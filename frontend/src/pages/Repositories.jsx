import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import API from "../services/api";

function Repositories() {
  const navigate = useNavigate();
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [repositoryData, setRepositoryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPrediction, setShowPrediction] = useState(false);

  const handleAnalyze = async () => {
    if (!repositoryUrl.trim()) {
      setError("Please enter a GitHub repository URL");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please sign in first to analyze a repository.");
      return;
    }

    setLoading(true);
    setError("");
    setShowPrediction(false);

    try {
      const response = await API.post("/predict-repository", {
        repository_url: repositoryUrl.trim(),
      });

      setRepositoryData(response.data);
      setShowPrediction(true);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setError("Session expired or invalid credentials. Please sign in again.");
      } else if (err.response?.status === 404) {
        setError(err.response.data?.detail || "Repository or resource not found.");
      } else if (err.response?.status === 500) {
        setError(err.response.data?.detail || "Server error occurred while analyzing repository.");
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.request) {
        setError("Network failure: Unable to reach the backend server.");
      } else {
        setError(err.message || "Repository analysis failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row bg-[#0B0B12] min-h-screen overflow-x-hidden">
      <Sidebar />

      <section className="flex-1 w-full min-h-screen bg-[#0B0B12] px-4 sm:px-6 lg:px-10 py-6 lg:py-8 overflow-x-hidden">
        {/* Header */}
        <div className="mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            Analyze Repository
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2">
            Paste your GitHub repository URL to begin AI-powered analysis.
          </p>
        </div>

        {/* Repository URL Input Card */}
        <div className="bg-[#161622] border border-gray-700 rounded-2xl p-5 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">
            Repository URL
          </h2>

          <input
            type="text"
            placeholder="https://github.com/username/repository"
            value={repositoryUrl}
            onChange={(e) => setRepositoryUrl(e.target.value)}
            className="w-full bg-[#0B0B12] border border-gray-700 rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-white text-sm sm:text-base outline-none focus:border-purple-500 min-h-[44px]"
          />

          <div className="flex items-center gap-4 mt-6">
            <button
              className="w-full sm:w-auto bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl transition font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center"
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze Repository"}
            </button>
          </div>

          {/* Clean Error State */}
          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-red-400 font-medium text-xs sm:text-sm">{error}</p>
              {error.includes("sign in") && (
                <button
                  onClick={() => navigate("/signin")}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-lg transition"
                >
                  Sign In
                </button>
              )}
            </div>
          )}
        </div>

        {/* Empty State: No repository analyzed yet */}
        {!repositoryData && !loading && (
          <div className="mt-10 bg-[#161622] border border-purple-500/20 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white">No Repository Analyzed Yet</h3>
            <p className="text-gray-400 mt-2 max-w-md mx-auto">
              Enter a public GitHub repository URL above and click "Analyze Repository" to extract metrics and view AI predictions.
            </p>
          </div>
        )}

        {/* Repository Information */}
        <div className="mt-10 bg-[#161622] border border-gray-700 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-8">
            Repository Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#0B0B12] rounded-xl p-5">
              <p className="text-gray-400 text-sm">Repository Name</p>
              <h3 className="text-white text-lg font-semibold mt-2">
                {repositoryData?.repository?.name || "--"}
              </h3>
            </div>

            <div className="bg-[#0B0B12] rounded-xl p-5">
              <p className="text-gray-400 text-sm">Language</p>
              <h3 className="text-white text-lg font-semibold mt-2">
                {repositoryData?.repository?.language || "--"}
              </h3>
            </div>

            <div className="bg-[#0B0B12] rounded-xl p-5">
              <p className="text-gray-400 text-sm">Stars</p>
              <h3 className="text-yellow-400 text-lg font-semibold mt-2">
                {repositoryData?.repository?.stars ?? "--"}
              </h3>
            </div>

            <div className="bg-[#0B0B12] rounded-xl p-5">
              <p className="text-gray-400 text-sm">Forks</p>
              <h3 className="text-blue-400 text-lg font-semibold mt-2">
                {repositoryData?.repository?.forks ?? "--"}
              </h3>
            </div>

            <div className="bg-[#0B0B12] rounded-xl p-5">
              <p className="text-gray-400 text-sm">Default Branch</p>
              <h3 className="text-green-400 text-lg font-semibold mt-2">
                {repositoryData?.repository?.default_branch || "--"}
              </h3>
            </div>

            <div className="bg-[#0B0B12] rounded-xl p-5">
              <p className="text-gray-400 text-sm">Total Files</p>
              <h3 className="text-purple-400 text-lg font-semibold mt-2">
                {repositoryData?.metrics?.total_files ?? "--"}
              </h3>
            </div>
          </div>
        </div>

        {/* Extracted Metrics */}
        <div className="mt-10 bg-[#161622] border border-gray-700 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-8">
            Extracted Metrics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#0B0B12] rounded-xl p-5">
              <p className="text-gray-400 text-sm">Lines of Code</p>
              <h3 className="text-green-400 text-2xl font-bold mt-2">
                {repositoryData?.metrics?.lines_of_code ?? "--"}
              </h3>
            </div>

            <div className="bg-[#0B0B12] rounded-xl p-5">
              <p className="text-gray-400 text-sm">Cyclomatic Complexity</p>
              <h3 className="text-yellow-400 text-2xl font-bold mt-2">
                {repositoryData?.complexity?.cyclomatic_complexity ?? "--"}
              </h3>
            </div>

            <div className="bg-[#0B0B12] rounded-xl p-5">
              <p className="text-gray-400 text-sm">Maintainability Index</p>
              <h3 className="text-blue-400 text-2xl font-bold mt-2">
                {repositoryData?.maintainability?.maintainability_index ?? "--"}
              </h3>
            </div>

            <div className="bg-[#0B0B12] rounded-xl p-5">
              <p className="text-gray-400 text-sm">Number of Functions</p>
              <h3 className="text-purple-400 text-2xl font-bold mt-2">
                {repositoryData?.code_structure?.functions ?? "--"}
              </h3>
            </div>

            <div className="bg-[#0B0B12] rounded-xl p-5">
              <p className="text-gray-400 text-sm">Number of Classes</p>
              <h3 className="text-pink-400 text-2xl font-bold mt-2">
                {repositoryData?.code_structure?.classes ?? "--"}
              </h3>
            </div>

            <div className="bg-[#0B0B12] rounded-xl p-5">
              <p className="text-gray-400 text-sm">Duplicate Code</p>
              <h3 className="text-red-400 text-2xl font-bold mt-2">
                {repositoryData?.duplicate_code?.duplicate_code_percentage !== undefined
                  ? `${repositoryData.duplicate_code.duplicate_code_percentage}%`
                  : "--"}
              </h3>
            </div>
          </div>
        </div>

        {/* Start AI Analysis Button Card */}
        {repositoryData && !showPrediction && (
          <div className="mt-10 bg-[#161622] border border-gray-700 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white">
              Ready for AI Analysis?
            </h2>
            <p className="text-gray-400 mt-3">
              Repository metrics extracted! Click below to view the AI-predicted health score, technical debt, and risk evaluation.
            </p>
            <button
              onClick={() => setShowPrediction(true)}
              className="mt-6 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold transition"
            >
              🚀 Start AI Analysis
            </button>
          </div>
        )}

        {/* AI Analysis Prediction Results */}
        {repositoryData?.prediction && showPrediction && (
          <div className="mt-10 bg-[#161622] border border-purple-500/30 rounded-2xl p-8 shadow-xl shadow-purple-500/5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  AI Analysis Prediction
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  AI-calculated quality metrics and risk assessment for <span className="text-purple-400 font-semibold">{repositoryData.repository?.name}</span>
                </p>
              </div>
              <span className="px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider">
                Analysis Complete
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#0B0B12] rounded-xl p-5 border border-green-500/20">
                <p className="text-gray-400 text-sm uppercase tracking-wider">Health Score</p>
                <h3 className="text-green-400 text-3xl font-bold mt-2">
                  {repositoryData.prediction.health_score}%
                </h3>
              </div>

              <div className="bg-[#0B0B12] rounded-xl p-5 border border-red-500/20">
                <p className="text-gray-400 text-sm uppercase tracking-wider">Technical Debt</p>
                <h3 className="text-red-400 text-3xl font-bold mt-2">
                  {repositoryData.prediction.technical_debt_score}%
                </h3>
              </div>

              <div className="bg-[#0B0B12] rounded-xl p-5 border border-yellow-500/20">
                <p className="text-gray-400 text-sm uppercase tracking-wider">Risk Level</p>
                <h3 className="text-yellow-400 text-3xl font-bold mt-2">
                  {repositoryData.prediction.risk_level}
                </h3>
              </div>

              <div className="bg-[#0B0B12] rounded-xl p-5 border border-purple-500/20">
                <p className="text-gray-400 text-sm uppercase tracking-wider">Recommendation</p>
                <h3 className="text-purple-300 text-base font-semibold mt-2">
                  {repositoryData.prediction.recommendation}
                </h3>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Repositories;