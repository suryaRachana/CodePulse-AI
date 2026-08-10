import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBrain, FaExclamationTriangle } from "react-icons/fa";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import API from "../services/api";

function Prediction() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [latestAnalysis, setLatestAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    const fetchPredictionData = async () => {
      try {
        setLoading(true);
        const [latestRes, historyRes] = await Promise.all([
          API.get("/latest-analysis").catch(() => ({ data: null })),
          API.get("/history").catch(() => ({ data: [] })),
        ]);

        if (latestRes.data && !latestRes.data.message) {
          setLatestAnalysis(latestRes.data);
        } else if (Array.isArray(historyRes.data) && historyRes.data.length > 0) {
          setLatestAnalysis(historyRes.data[historyRes.data.length - 1]);
        }

        if (Array.isArray(historyRes.data)) {
          setHistory(historyRes.data);
        }
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          setError("Session expired or unauthorized. Please sign in again.");
        } else {
          setError("Failed to load AI risk prediction data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPredictionData();
  }, [navigate]);

  const filteredHistory = history.filter((item) =>
    (item.project_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="min-h-screen bg-[#0B0B12] px-10 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-white">AI Risk Prediction</h1>
          <p className="text-gray-400 mt-2">
            Repository-level technical debt & health prediction
          </p>
        </div>

        <button
          onClick={() => navigate("/repositories")}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          + New Analysis
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-[#161622] border border-gray-700 rounded-2xl p-12 text-center">
          <p className="text-gray-400 text-lg">Loading AI Risk Prediction...</p>
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
      ) : !latestAnalysis && history.length === 0 ? (
        /* Empty State */
        <div className="bg-[#161622] border border-purple-500/20 rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">🧠</div>
          <h3 className="text-2xl font-bold text-white">No AI Prediction Data</h3>
          <p className="text-gray-400 mt-2 max-w-md mx-auto">
            Analyze a repository to view live AI risk predictions, technical debt calculations, and risk distribution.
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
          {/* Risk Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {/* Overall Risk */}
            <div className="bg-[#161622] border border-gray-700 rounded-2xl p-6">
              <p className="text-gray-400 text-sm uppercase tracking-wider">
                Overall Risk Level
              </p>
              <h2
                className={`text-4xl font-bold mt-4 ${
                  latestAnalysis?.risk_level === "Low"
                    ? "text-green-400"
                    : latestAnalysis?.risk_level === "Medium"
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {latestAnalysis?.risk_level || "--"}
              </h2>
              <p className="text-gray-400 text-sm mt-2">Calculated Risk Level</p>
            </div>

            {/* Health Score */}
            <div className="bg-[#161622] border border-gray-700 rounded-2xl p-6">
              <p className="text-gray-400 text-sm uppercase tracking-wider">
                Health Score
              </p>
              <h2 className="text-4xl font-bold text-green-400 mt-4">
                {latestAnalysis?.health_score !== undefined ? `${latestAnalysis.health_score}%` : "--"}
              </h2>
              <p className="text-green-400 text-sm mt-2">Code Health Metric</p>
            </div>

            {/* Technical Debt */}
            <div className="bg-[#161622] border border-gray-700 rounded-2xl p-6">
              <p className="text-gray-400 text-sm uppercase tracking-wider">
                Technical Debt
              </p>
              <h2 className="text-4xl font-bold text-red-400 mt-4">
                {latestAnalysis?.technical_debt_score !== undefined ? `${latestAnalysis.technical_debt_score}%` : "--"}
              </h2>
              <p className="text-red-400 text-sm mt-2">Estimated Debt</p>
            </div>

            {/* Total Analyzed Repositories */}
            <div className="bg-[#161622] border border-gray-700 rounded-2xl p-6">
              <p className="text-gray-400 text-sm uppercase tracking-wider">
                Total Analyzed Repos
              </p>
              <h2 className="text-4xl font-bold text-purple-400 mt-4">
                {history.length || 1}
              </h2>
              <p className="text-purple-300 text-sm mt-2">Saved History Records</p>
            </div>
          </div>

          {/* Analyzed Repositories Table */}
          <div className="mt-10 bg-[#161622] border border-gray-700 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Analyzed Repositories
                </h2>
                <p className="text-gray-400 mt-1">
                  Repositories evaluated for technical debt and health.
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search repository..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0B0B12] border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-purple-500"
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-4 text-gray-400">Repository</th>
                    <th className="text-left p-4 text-gray-400">Health Score</th>
                    <th className="text-left p-4 text-gray-400">Technical Debt</th>
                    <th className="text-left p-4 text-gray-400">Risk Level</th>
                    <th className="text-left p-4 text-gray-400">Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  {(filteredHistory.length > 0 ? filteredHistory : history.length > 0 ? history : [latestAnalysis]).map(
                    (item, idx) => (
                      <tr
                        key={item.id || idx}
                        className="border-b border-gray-800 hover:bg-[#1D1D2B] transition"
                      >
                        <td className="p-4 text-white font-medium">
                          {item.project_name}
                        </td>
                        <td className="p-4 font-semibold text-green-400">
                          {item.health_score}%
                        </td>
                        <td className="p-4 font-semibold text-red-400">
                          {item.technical_debt_score}%
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              item.risk_level === "Low"
                                ? "bg-green-500/20 text-green-400"
                                : item.risk_level === "Medium"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {item.risk_level}
                          </span>
                        </td>
                        <td className="p-4 text-gray-300">
                          {item.recommendation}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Risk Distribution Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
            {/* Risk Score Distribution */}
            <div className="bg-[#161622] border border-gray-700 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white">
                Health Score Distribution
              </h2>
              <p className="text-gray-400 mt-2 mb-6">
                Health scores across evaluated repositories.
              </p>

              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={
                      history.length > 0
                        ? history.map((h) => ({
                            file: h.project_name,
                            score: h.health_score,
                          }))
                        : [{ file: latestAnalysis.project_name, score: latestAnalysis.health_score }]
                    }
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="file" stroke="#9ca3af" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip />
                    <Bar dataKey="score" fill="#22c55e" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Technical Debt Distribution */}
            <div className="bg-[#161622] border border-gray-700 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white">
                Technical Debt Distribution
              </h2>
              <p className="text-gray-400 mt-2 mb-6">
                Technical debt scores across evaluated repositories.
              </p>

              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={
                      history.length > 0
                        ? history.map((h) => ({
                            file: h.project_name,
                            debt: h.technical_debt_score,
                          }))
                        : [{ file: latestAnalysis.project_name, debt: latestAnalysis.technical_debt_score }]
                    }
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="file" stroke="#9ca3af" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip />
                    <Bar dataKey="debt" fill="#ef4444" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* AI Risk Insights */}
          <div className="mt-10 bg-[#161622] border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <FaBrain className="text-purple-400 text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Risk Evaluation Summary
                </h2>
                <p className="text-gray-400 text-sm">
                  Evaluated analysis results for <span className="text-purple-400 font-semibold">{latestAnalysis?.project_name}</span>
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-[#0B0B12] border border-purple-500/20 rounded-xl p-5">
                <div className="flex items-start gap-4">
                  <FaExclamationTriangle className="text-yellow-400 text-xl mt-1" />
                  <div>
                    <h3 className="text-white font-semibold">
                      Recommendation & Strategy
                    </h3>
                    <p className="text-gray-300 text-sm mt-2 leading-relaxed">
                      {latestAnalysis?.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default Prediction;