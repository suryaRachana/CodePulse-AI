import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTools,
  FaCode,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBrain,
} from "react-icons/fa";
import API from "../services/api";

const DEFAULT_SAMPLE_CODE = `def process_data(data):
    result = []
    for item in data:
        if item.is_valid:
            result.append(item)
    return result`;

function Refactoring() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [codeInput, setCodeInput] = useState(DEFAULT_SAMPLE_CODE);
  const [suggestionResult, setSuggestionResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    const fetchRefactoringData = async () => {
      try {
        setLoading(true);
        const [latestRes, historyRes] = await Promise.all([
          API.get("/latest-analysis").catch(() => ({ data: null })),
          API.get("/history").catch(() => ({ data: [] })),
        ]);

        let items = [];
        if (Array.isArray(historyRes.data) && historyRes.data.length > 0) {
          items = historyRes.data;
        } else if (latestRes.data && !latestRes.data.message) {
          items = [latestRes.data];
        }

        setHistory(items);
        if (items.length > 0) {
          setSelectedId(String(items[items.length - 1].id || 0));
        }
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          setError("Session expired or unauthorized. Please sign in again.");
        } else {
          setError("Failed to load repository data for refactoring.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRefactoringData();
  }, [navigate]);

  const selectedRepo =
    history.find((item) => String(item.id) === selectedId) ||
    history[history.length - 1] ||
    null;

  const handleGenerateSuggestion = async () => {
    if (!codeInput || !codeInput.trim()) {
      setValidationError("Please enter or paste a Python code snippet to refactor.");
      return;
    }

    setValidationError(null);
    setError(null);
    setGenerating(true);

    try {
      const response = await API.post("/refactor-suggestion", {
        code: codeInput,
        language: "python",
        repository_id: selectedRepo?.id ? Number(selectedRepo.id) : null,
      });

      setSuggestionResult(response.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setError("Session expired. Please sign in again.");
      } else if (err.response?.data?.detail) {
        setError(`Refactoring error: ${err.response.data.detail}`);
      } else {
        setError("Failed to generate refactoring suggestion. Please check code syntax.");
      }
    } finally {
      setGenerating(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#0B0B12] px-10 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Code <span className="text-purple-400">Refactoring</span>
          </h1>
          <p className="text-gray-400 mt-2">
            Rule-based code refactoring and technical debt optimization.
          </p>
        </div>

        <button
          onClick={() => navigate("/prediction")}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          View Risk Prediction
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-[#161622] border border-gray-700 rounded-2xl p-12 text-center">
          <p className="text-gray-400 text-lg">Loading refactoring workspace...</p>
        </div>
      ) : error && !selectedRepo ? (
        <div className="bg-[#161622] border border-red-500/30 rounded-2xl p-6 flex items-center justify-between">
          <p className="text-red-400">{error}</p>
          {error.includes("sign in") && (
            <button
              onClick={() => navigate("/signin")}
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-lg transition"
            >
              Sign In
            </button>
          )}
        </div>
      ) : !selectedRepo && history.length === 0 ? (
        /* Empty State */
        <div className="bg-[#161622] border border-purple-500/20 rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">🛠️</div>
          <h3 className="text-2xl font-bold text-white">No Analyzed Repositories Found</h3>
          <p className="text-gray-400 mt-2 max-w-md mx-auto">
            Analyze a repository first to evaluate code complexity and run automated rule-based refactoring.
          </p>
          <button
            onClick={() => navigate("/repositories")}
            className="mt-6 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl transition font-medium"
          >
            Analyze Repository
          </button>
        </div>
      ) : (
        <>
          {/* Repository Selection */}
          <div className="bg-[#161622] border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <FaTools className="text-purple-400 text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Select Analyzed Repository
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Choose a repository from your account history to associate refactoring suggestions.
                </p>
              </div>
            </div>

            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full bg-[#0B0B12] border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-purple-500"
            >
              {history.map((item) => (
                <option key={item.id || item.project_name} value={String(item.id)}>
                  {item.project_name} — (Health: {item.health_score}%, Risk: {item.risk_level})
                </option>
              ))}
            </select>
          </div>

          {/* Selected Repository Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-[#161622] border border-gray-700 rounded-2xl p-6">
              <p className="text-gray-400 text-sm">Selected Repository</p>
              <h2 className="text-xl font-bold text-white mt-3">
                {selectedRepo?.project_name || "Repository"}
              </h2>
            </div>

            <div className="bg-[#161622] border border-gray-700 rounded-2xl p-6">
              <p className="text-gray-400 text-sm">Health Score</p>
              <h2 className="text-4xl font-bold text-green-400 mt-3">
                {selectedRepo?.health_score !== undefined ? `${selectedRepo.health_score}%` : "--"}
              </h2>
            </div>

            <div className="bg-[#161622] border border-gray-700 rounded-2xl p-6">
              <p className="text-gray-400 text-sm">Technical Debt Score</p>
              <h2 className="text-4xl font-bold text-red-400 mt-3">
                {selectedRepo?.technical_debt_score !== undefined ? `${selectedRepo.technical_debt_score}%` : "--"}
              </h2>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mt-6 bg-[#161622] border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Validation Warning */}
          {validationError && (
            <div className="mt-6 bg-[#161622] border border-yellow-500/30 rounded-xl p-4 text-yellow-400 text-sm">
              {validationError}
            </div>
          )}

          {/* Refactoring Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Input Code Editor */}
            <div className="bg-[#161622] border border-gray-700 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaCode className="text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Source Code Input (Python)</h2>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Paste or edit Python code snippet below to evaluate for AST rule optimizations.
              </p>

              <textarea
                rows={9}
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="def my_function():..."
                className="w-full bg-[#0B0B12] border border-gray-800 rounded-xl p-4 font-mono text-sm text-gray-200 outline-none focus:border-purple-500 leading-6"
              />

              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Supported: Python functions, conditionals & loops
                </span>
                <button
                  onClick={handleGenerateSuggestion}
                  disabled={generating}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold transition disabled:opacity-50"
                >
                  {generating ? "Analyzing Code..." : "Generate Suggestion"}
                </button>
              </div>
            </div>

            {/* Refactoring Suggestion Output */}
            <div className="bg-[#161622] border border-purple-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaTools className="text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Rule-Based Refactoring Suggestion</h2>
              </div>

              {!suggestionResult ? (
                <div className="text-center py-16">
                  <FaBrain className="text-4xl text-purple-400/40 mx-auto mb-3" />
                  <p className="text-gray-400">
                    Click "Generate Suggestion" to analyze the code snippet for rule-based optimizations.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="bg-[#0B0B12] border border-gray-800 rounded-xl p-4 font-mono text-sm text-green-300 leading-6 overflow-x-auto whitespace-pre-wrap">
                    {suggestionResult.refactored_code}
                  </div>

                  <div className="mt-5 flex items-start gap-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-purple-300 text-sm">
                    <FaCheckCircle className="text-green-400 text-lg shrink-0 mt-0.5" />
                    <span>{suggestionResult.issue_description}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Expected Improvements */}
          {suggestionResult && (
            <div className="mt-8 bg-[#161622] border border-gray-700 rounded-2xl p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">Estimated Quality Improvements</h2>
                  <p className="text-gray-400 mt-1 text-sm">
                    Estimated benefits calculated from rule-based static code patterns.
                  </p>
                </div>
                <span className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full font-medium">
                  Rule-Based Estimates
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="bg-[#0B0B12] rounded-xl p-5 border border-gray-800">
                  <p className="text-gray-400 text-sm">Estimated Complexity Reduction</p>
                  <p className="text-green-400 text-2xl font-bold mt-2">
                    -{suggestionResult.complexity_reduction}%
                  </p>
                  <p className="text-gray-500 text-xs mt-1">Lower cyclomatic complexity</p>
                </div>

                <div className="bg-[#0B0B12] rounded-xl p-5 border border-gray-800">
                  <p className="text-gray-400 text-sm">Estimated Maintainability Increase</p>
                  <p className="text-green-400 text-2xl font-bold mt-2">
                    +{suggestionResult.maintainability_increase}%
                  </p>
                  <p className="text-gray-500 text-xs mt-1">Easier code maintenance</p>
                </div>

                <div className="bg-[#0B0B12] rounded-xl p-5 border border-gray-800">
                  <p className="text-gray-400 text-sm">Estimated Technical Debt Reduction</p>
                  <p className="text-green-400 text-2xl font-bold mt-2">
                    -{suggestionResult.technical_debt_reduction}%
                  </p>
                  <p className="text-gray-500 text-xs mt-1">Reduced future debt</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default Refactoring;