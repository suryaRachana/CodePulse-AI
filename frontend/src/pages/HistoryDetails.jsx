import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function HistoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signin");
      return;
    }

    const fetchAnalysis = async () => {
      try {
        const response = await API.get(`/history/${id}`);
        setAnalysis(response.data);
      } catch (error) {
        console.error(error);
        alert("Failed to load analysis");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id, navigate]);

  if (loading) {
    return (
      <section className="min-h-screen bg-[#0B0B12] flex items-center justify-center">
        <p className="text-gray-400 text-xl">
          Loading analysis...
        </p>
      </section>
    );
  }

  if (!analysis) {
    return (
      <section className="min-h-screen bg-[#0B0B12] flex items-center justify-center">
        <p className="text-red-400 text-xl">
          Analysis not found
        </p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#0B0B12] px-12 py-10">

      {/* Header */}
      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-4xl font-bold text-white">
            Analysis{" "}
            <span className="text-purple-400">
              Details
            </span>
          </h1>

          <p className="text-gray-400 mt-3">
            Detailed results for your project analysis.
          </p>
        </div>

        <button
          onClick={() => navigate("/history")}
          className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-lg transition"
        >
          Back to History
        </button>

      </div>

      {/* Project Name */}
      <div className="mt-10 bg-[#161622] border border-purple-500/20 rounded-2xl p-8">

        <p className="text-gray-400">
          Project Name
        </p>

        <h2 className="text-3xl font-bold text-white mt-2">
          {analysis.project_name}
        </h2>

      </div>

      {/* Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

        <div className="bg-[#161622] border border-purple-500/20 rounded-2xl p-6">

          <p className="text-gray-400">
            Health Score
          </p>

          <h2 className="text-4xl font-bold text-green-400 mt-4">
            {analysis.health_score}%
          </h2>

        </div>

        <div className="bg-[#161622] border border-purple-500/20 rounded-2xl p-6">

          <p className="text-gray-400">
            Technical Debt
          </p>

          <h2 className="text-4xl font-bold text-red-400 mt-4">
            {analysis.technical_debt_score}
          </h2>

        </div>

        <div className="bg-[#161622] border border-purple-500/20 rounded-2xl p-6">

          <p className="text-gray-400">
            Risk Level
          </p>

          <h2 className="text-4xl font-bold text-yellow-400 mt-4">
            {analysis.risk_level}
          </h2>

        </div>

      </div>

      {/* Recommendation */}
      <div className="mt-6 bg-[#161622] border border-purple-500/20 rounded-2xl p-8">

        <p className="text-gray-400">
          Recommendation
        </p>

        <h2 className="text-2xl font-semibold text-purple-400 mt-3">
          {analysis.recommendation}
        </h2>

      </div>

    </section>
  );
}

export default HistoryDetails;