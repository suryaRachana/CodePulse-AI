import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLightbulb, FaBrain, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import API from "../services/api";
import Sidebar from "../components/Sidebar";

function ExplainableAI() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    const fetchExplainableData = async () => {
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
          setError("Failed to load explainable AI analysis data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExplainableData();
  }, [navigate]);

  const currentAnalysis =
    history.find((item) => String(item.id) === selectedId) || history[history.length - 1] || null;

  return (
    <div className="flex flex-col lg:flex-row bg-[#0B0B12] min-h-screen overflow-x-hidden">
      <Sidebar />

      <section className="flex-1 w-full min-h-screen bg-[#0B0B12] px-4 sm:px-6 lg:px-10 py-6 lg:py-8 overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              Explainable <span className="text-purple-400">AI</span>
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2">
              Understand how risk scores and recommendations are calculated.
            </p>
          </div>

          <button
            onClick={() => navigate("/prediction")}
            className="w-full sm:w-auto bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition text-sm sm:text-base min-h-[44px] flex items-center justify-center"
          >
            View Risk Prediction
          </button>
        </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-[#161622] border border-gray-700 rounded-2xl p-12 text-center">
          <p className="text-gray-400 text-lg">Loading Explainable Analysis...</p>
        </div>
      ) : error ? (
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
      ) : !currentAnalysis ? (
        /* Empty State */
        <div className="bg-[#161622] border border-purple-500/20 rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">💡</div>
          <h3 className="text-2xl font-bold text-white">No Analysis Data Available</h3>
          <p className="text-gray-400 mt-2 max-w-md mx-auto">
            Analyze a repository first to generate transparent risk explanations and metric breakdowns.
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
          {/* Repository Selection Dropdown */}
          <div className="bg-[#161622] border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <FaLightbulb className="text-purple-400 text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Select Analyzed Repository
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Choose a repository to view its metric breakdown and assessment explanation.
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

          {/* Explanation Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Risk Overview */}
            <div className="bg-[#161622] border border-gray-700 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white">
                Risk Explanation
              </h2>
              <p className="text-gray-400 mt-2">
                Calculated evaluation metrics for selected repository.
              </p>

              <div className="mt-6">
                <p className="text-gray-400 text-sm">Repository</p>
                <h3 className="text-xl font-semibold text-white mt-1">
                  {currentAnalysis.project_name}
                </h3>
              </div>

              <div className="mt-6">
                <p className="text-gray-400 text-sm">Technical Debt Score</p>
                <h3 className="text-4xl font-bold text-red-400 mt-2">
                  {currentAnalysis.technical_debt_score}%
                </h3>
              </div>

              <div className="w-full bg-gray-700 rounded-full h-2 mt-5">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${currentAnalysis.technical_debt_score}%`,
                  }}
                />
              </div>

              <div className="mt-6 bg-purple-500/10 border border-purple-500/20 rounded-xl p-5">
                <p className="text-purple-300 font-semibold flex items-center gap-2">
                  <FaExclamationTriangle className="text-yellow-400" />
                  Why is this repository evaluated at {currentAnalysis.risk_level} risk?
                </p>
                <p className="text-gray-300 text-sm mt-2 leading-6">
                  The backend metrics algorithm evaluated repository{" "}
                  <strong className="text-white">{currentAnalysis.project_name}</strong> with a Software Health Score of{" "}
                  <strong className="text-green-400">{currentAnalysis.health_score}%</strong> and a Technical Debt Score of{" "}
                  <strong className="text-red-400">{currentAnalysis.technical_debt_score}%</strong>, placing it in the{" "}
                  <strong className="text-yellow-400">{currentAnalysis.risk_level}</strong> risk tier.
                </p>
              </div>
            </div>

            {/* Metric Factors */}
            <div className="bg-[#161622] border border-gray-700 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <FaBrain className="text-purple-400 text-xl" />
                <h2 className="text-2xl font-bold text-white">
                  Evaluation Factors
                </h2>
              </div>

              <p className="text-gray-400 mt-1 mb-6">
                Primary metrics determining the final health score.
              </p>

              {/* Health Score Factor */}
              <div className="mt-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">Software Health Score</span>
                  <span className="text-green-400 font-semibold">
                    {currentAnalysis.health_score}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                  <div
                    className="bg-green-400 h-2 rounded-full transition-all"
                    style={{
                      width: `${currentAnalysis.health_score}%`,
                    }}
                  />
                </div>
              </div>

              {/* Technical Debt Factor */}
              <div className="mt-7">
                <div className="flex justify-between">
                  <span className="text-gray-300">Technical Debt Score</span>
                  <span className="text-red-400 font-semibold">
                    {currentAnalysis.technical_debt_score}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                  <div
                    className="bg-red-400 h-2 rounded-full transition-all"
                    style={{
                      width: `${currentAnalysis.technical_debt_score}%`,
                    }}
                  />
                </div>
              </div>

              {/* Risk Level Badge */}
              <div className="mt-8 bg-[#0B0B12] rounded-xl p-5 flex items-center justify-between border border-gray-800">
                <span className="text-gray-400 text-sm">Assessed Risk Tier</span>
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                    currentAnalysis.risk_level === "Low"
                      ? "bg-green-500/20 text-green-400"
                      : currentAnalysis.risk_level === "Medium"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {currentAnalysis.risk_level}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Metric Explanation */}
          <div className="mt-8 bg-[#161622] border border-purple-500/20 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white">
              Assessment Breakdown
            </h2>
            <p className="text-gray-400 mt-2">
              Human-readable summary of backend evaluation rules.
            </p>

            <div className="mt-6 space-y-4">
              <div className="bg-[#0B0B12] rounded-xl p-5 border border-gray-800">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <FaCheckCircle className="text-green-400" />
                  1. Health Score Evaluation ({currentAnalysis.health_score}%)
                </h3>
                <p className="text-gray-300 text-sm mt-2 leading-relaxed">
                  Higher health scores indicate cleaner code structure, lower cyclomatic complexity, and better maintainability across repository source files.
                </p>
              </div>

              <div className="bg-[#0B0B12] rounded-xl p-5 border border-gray-800">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <FaExclamationTriangle className="text-yellow-400" />
                  2. Technical Debt ({currentAnalysis.technical_debt_score}%)
                </h3>
                <p className="text-gray-300 text-sm mt-2 leading-relaxed">
                  Technical debt represents potential future maintenance work required to refactor complex methods or duplicate code blocks.
                </p>
              </div>

              <div className="bg-[#0B0B12] rounded-xl p-5 border border-gray-800">
                <h3 className="text-purple-300 font-semibold flex items-center gap-2">
                  💡 3. Strategic Recommendation
                </h3>
                <p className="text-gray-300 text-sm mt-2 leading-relaxed">
                  {currentAnalysis.recommendation}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
    </div>
  );
}

export default ExplainableAI;