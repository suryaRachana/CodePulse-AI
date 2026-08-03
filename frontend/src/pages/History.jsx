import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import { FaFolderOpen } from "react-icons/fa";


import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signin");
      return;
    }

    fetchHistory();
  }, [navigate]);

  const fetchHistory = async () => {
    try {
      const response = await API.get("/history");
      setHistory(response.data);
    } catch (error) {
      console.error(error);
     toast.error("Failed to load history!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/history/${id}`);

      setHistory((prevHistory) =>
        prevHistory.filter((item) => item.id !== id)
      );

      toast.success("Analysis deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete analysis");
    }
  };


  const chartData = history.map((item) => ({
  project: item.project_name,
  health: item.health_score,
}));

  return (
    <section className="min-h-screen bg-[#0B0B12] px-12 py-10">

      {/* Header */}
      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-4xl font-bold text-white">
            Analysis{" "}
            <span className="text-purple-400">
              History
            </span>
          </h1>
         

          <p className="text-gray-400 mt-3">
            View and manage your previous project analyses.
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-lg transition"
        >
          Back to Dashboard
        </button>

      </div>

{/* Statistics */}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">

  <div className="bg-[#161622] border border-gray-700 rounded-2xl p-6">
    <p className="text-gray-400 text-sm">
      Total Analyses
    </p>

    <h2 className="text-4xl font-bold text-purple-400 mt-3">
      {history.length}
    </h2>
  </div>

  <div className="bg-[#161622] border border-gray-700 rounded-2xl p-6">
    <p className="text-gray-400 text-sm">
      Avg Improvement
    </p>

    <h2 className="text-4xl font-bold text-green-400 mt-3">
      +18%
    </h2>
  </div>

  <div className="bg-[#161622] border border-gray-700 rounded-2xl p-6">
    <p className="text-gray-400 text-sm">
      Total Points Gained
    </p>

    <h2 className="text-4xl font-bold text-blue-400 mt-3">
      125
    </h2>
  </div>

  <div className="bg-[#161622] border border-gray-700 rounded-2xl p-6">
    <p className="text-gray-400 text-sm">
      Best Improvement
    </p>

    <h2 className="text-4xl font-bold text-yellow-400 mt-3">
      +32%
    </h2>
  </div>

</div>





{/* Health Score Progress */}

<div className="mt-10 bg-[#161622] border border-gray-700 rounded-2xl p-8">

  <h2 className="text-2xl font-bold text-white">
    Health Score Progress
  </h2>

  <p className="text-gray-400 mt-2">
    Repository health score across previous analyses.
  </p>

  <div className="w-full h-80 mt-8">

    <ResponsiveContainer width="100%" height="100%">

      <BarChart data={chartData}>

        <CartesianGrid strokeDasharray="3 3" stroke="#333" />

        <XAxis
          dataKey="project"
          stroke="#9ca3af"
        />

        <YAxis stroke="#9ca3af" />

        <Tooltip />

        <Bar
          dataKey="health"
          fill="#8b5cf6"
          radius={[8, 8, 0, 0]}
        />

      </BarChart>

    </ResponsiveContainer>

  </div>

</div>




      {/* History Table */}
      <div className="mt-10 overflow-x-auto">
        <div className="mb-6">
  <h2 className="text-2xl font-bold text-white">
    Previous Analyses
  </h2>

  <p className="text-gray-400 mt-2">
    View all previously analyzed repositories.
  </p>
</div>

        {loading ? (
          <p className="text-gray-400 text-center py-10">
            Loading history...
          </p>
        ) : history.length === 0 ? (
          <div className="bg-[#161622] border border-purple-500/20 rounded-2xl p-12 text-center">

  <div className="text-7xl mb-4">
    📂
  </div>

  <h2 className="text-3xl font-bold text-white">
    No Analysis History
  </h2>

  <p className="text-gray-400 mt-3">
    Analyze your first project to see your reports here.
  </p>

  <button
    onClick={() => navigate("/dashboard")}
    className="mt-6 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl transition"
  >
    Analyze Project
  </button>

</div>
        ) : (
          <table className="w-full bg-[#161622] rounded-2xl overflow-hidden">

  <thead className="bg-purple-600">
    <tr>
      <th className="p-4 text-left text-white">Repository</th>
<th className="p-4 text-left text-white">Health Score</th>
<th className="p-4 text-left text-white">Technical Debt</th>
<th className="p-4 text-left text-white">Risk Level</th>
<th className="p-4 text-left text-white">Actions</th>
    </tr>
  </thead>

  <tbody>

    {history.map((item) => (

      <tr
        key={item.id}
        className="border-b border-gray-700 hover:bg-[#1d1d2b] transition"
      >

        <td className="p-4 text-gray-300">
          {item.project_name}
        </td>

        <td className="p-4 text-green-400 font-semibold">
          {item.health_score}%
        </td>

        <td className="p-4 text-red-400">
          {item.technical_debt_score}
        </td>

        <td className="p-4">
  <span
    className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
      item.risk_level === "Low"
        ? "bg-green-500"
        : item.risk_level === "Medium"
        ? "bg-yellow-500"
        : "bg-red-500"
    }`}
  >
    {item.risk_level}
  </span>
</td>

        <td className="p-4 flex gap-3">

          <button
            onClick={() => navigate(`/history/${item.id}`)}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition"
          >
            View Details
          </button>

          <button
            onClick={() => handleDelete(item.id)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Delete
          </button>

        </td>

      </tr>

    ))}

  </tbody>

</table>
        )}

      </div>

    </section>
  );
}

export default History;