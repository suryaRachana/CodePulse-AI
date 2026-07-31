import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import { FaFolderOpen } from "react-icons/fa";
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

      {/* History Table */}
      <div className="mt-10 overflow-x-auto">

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
      <th className="p-4 text-left text-white">Project</th>
      <th className="p-4 text-left text-white">Health</th>
      <th className="p-4 text-left text-white">Debt</th>
      <th className="p-4 text-left text-white">Risk</th>
      <th className="p-4 text-left text-white">Action</th>
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

        <td className="p-4 text-yellow-400">
          {item.risk_level}
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