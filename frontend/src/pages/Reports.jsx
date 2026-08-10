import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import API from "../services/api";

function Reports() {
  const navigate = useNavigate();
  const [latestAnalysis, setLatestAnalysis] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signin");
      return;
    }

    const fetchReportsData = async () => {
      try {
        setLoading(true);
        const [latestRes, historyRes] = await Promise.all([
          API.get("/latest-analysis").catch(() => ({ data: null })),
          API.get("/history").catch(() => ({ data: [] })),
        ]);

        if (latestRes.data && !latestRes.data.message) {
          setLatestAnalysis(latestRes.data);
        } else if (historyRes.data && historyRes.data.length > 0) {
          setLatestAnalysis(historyRes.data[historyRes.data.length - 1]);
        }

        if (Array.isArray(historyRes.data)) {
          setHistoryList(historyRes.data);
        }
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          setError("Session expired or unauthorized. Please sign in again.");
        } else {
          setError("Failed to load analysis report data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReportsData();
  }, [navigate]);

  const handleDownloadPDF = () => {
    if (!latestAnalysis) return;

    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(139, 92, 246); // Purple
    doc.text("CodePulse AI - Repository Analysis Report", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);
    doc.line(14, 32, 196, 32);

    // Latest Analysis Summary
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Latest Repository Analysis Summary", 14, 42);

    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    doc.text(`Repository Name: ${latestAnalysis.project_name || "N/A"}`, 14, 52);
    doc.text(`Health Score: ${latestAnalysis.health_score}%`, 14, 60);
    doc.text(`Technical Debt Score: ${latestAnalysis.technical_debt_score}%`, 14, 68);
    doc.text(`Risk Level: ${latestAnalysis.risk_level}`, 14, 76);
    doc.text(`Recommendation: ${latestAnalysis.recommendation}`, 14, 84);

    // History Breakdown
    if (historyList && historyList.length > 0) {
      doc.line(14, 94, 196, 94);
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Saved Analyses History Summary", 14, 104);

      let yPos = 114;
      historyList.forEach((item, index) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        doc.text(
          `${index + 1}. ${item.project_name} | Health: ${item.health_score}% | Debt: ${item.technical_debt_score}% | Risk: ${item.risk_level}`,
          14,
          yPos
        );
        yPos += 8;
      });
    }

    doc.save(`${(latestAnalysis.project_name || "CodePulse_AI").replace(/[^a-z0-9]/gi, "_")}_Report.pdf`);
  };

  const handleExportCSV = () => {
    if (!historyList || historyList.length === 0) {
      if (latestAnalysis) {
        // Export latest if history list is empty
        const headers = ["ID", "Repository Name", "Health Score (%)", "Technical Debt Score (%)", "Risk Level", "Recommendation"];
        const row = [
          latestAnalysis.id || 1,
          `"${(latestAnalysis.project_name || "").replace(/"/g, '""')}"`,
          latestAnalysis.health_score,
          latestAnalysis.technical_debt_score,
          `"${latestAnalysis.risk_level}"`,
          `"${(latestAnalysis.recommendation || "").replace(/"/g, '""')}"`
        ];
        const csvContent = [headers.join(","), row.join(",")].join("\n");
        downloadCSVFile(csvContent);
      }
      return;
    }

    const headers = ["ID", "Repository Name", "Health Score (%)", "Technical Debt Score (%)", "Risk Level", "Recommendation"];
    const rows = historyList.map((item) => [
      item.id,
      `"${(item.project_name || "").replace(/"/g, '""')}"`,
      item.health_score,
      item.technical_debt_score,
      `"${item.risk_level}"`,
      `"${(item.recommendation || "").replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    downloadCSVFile(csvContent);
  };

  const downloadCSVFile = (csvContent) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `CodePulse_AI_Reports_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="min-h-screen bg-[#0B0B12] px-10 py-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Analysis <span className="text-purple-400">Reports</span>
          </h1>
          <p className="text-gray-400 mt-2">
            Download and view repository analysis reports.
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-lg transition"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Download Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <button
          onClick={handleDownloadPDF}
          disabled={!latestAnalysis}
          className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-2xl text-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          📄 Download PDF Report
        </button>

        <button
          onClick={handleExportCSV}
          disabled={!latestAnalysis && historyList.length === 0}
          className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-2xl text-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          📊 Export CSV Data
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="mt-10 bg-[#161622] border border-gray-700 rounded-2xl p-8 text-center">
          <p className="text-gray-400 text-lg">Loading analysis reports...</p>
        </div>
      ) : error ? (
        <div className="mt-10 bg-[#161622] border border-red-500/30 rounded-2xl p-8 flex items-center justify-between">
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
      ) : !latestAnalysis && historyList.length === 0 ? (
        /* Empty State */
        <div className="mt-10 bg-[#161622] border border-purple-500/20 rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-2xl font-bold text-white">No Analysis Reports Available</h3>
          <p className="text-gray-400 mt-2 max-w-md mx-auto">
            You haven't analyzed any repository yet. Run your first analysis to generate downloadable PDF and CSV reports.
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
          {/* Analysis Report Preview */}
          <div className="mt-10 bg-[#161622] border border-gray-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white">
              Analysis Report Preview
            </h2>
            <p className="text-gray-400 mt-2">
              Latest repository analysis summary.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              <div>
                <p className="text-gray-400 text-sm">Repository</p>
                <h3 className="text-white text-xl font-semibold mt-2">
                  {latestAnalysis?.project_name || "CodePulse-AI"}
                </h3>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Health Score</p>
                <h3 className="text-green-400 text-xl font-semibold mt-2">
                  {latestAnalysis?.health_score !== undefined ? `${latestAnalysis.health_score}%` : "--"}
                </h3>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Technical Debt</p>
                <h3 className="text-red-400 text-xl font-semibold mt-2">
                  {latestAnalysis?.technical_debt_score !== undefined ? `${latestAnalysis.technical_debt_score}%` : "--"}
                </h3>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Future Risk</p>
                <h3
                  className={`text-xl font-semibold mt-2 ${
                    latestAnalysis?.risk_level === "Low"
                      ? "text-green-400"
                      : latestAnalysis?.risk_level === "Medium"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {latestAnalysis?.risk_level || "--"}
                </h3>
              </div>
            </div>
          </div>

          {/* Analyzed Repositories Breakdown */}
          <div className="mt-10 bg-[#161622] border border-gray-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white">
              Analyzed Repositories
            </h2>
            <p className="text-gray-400 mt-2">
              Repositories analyzed and saved in your account history.
            </p>

            <div className="overflow-x-auto mt-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-white p-4">Repository Name</th>
                    <th className="text-left text-white p-4">Health Score</th>
                    <th className="text-left text-white p-4">Risk Level</th>
                    <th className="text-left text-white p-4">Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  {historyList.length > 0 ? (
                    historyList.map((item) => (
                      <tr key={item.id} className="border-b border-gray-800 hover:bg-[#1D1D2B] transition">
                        <td className="p-4 text-gray-300 font-medium">{item.project_name}</td>
                        <td className="p-4 text-green-400 font-semibold">{item.health_score}%</td>
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
                        <td className="p-4 text-gray-400">{item.recommendation}</td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border-b border-gray-800">
                      <td className="p-4 text-gray-300 font-medium">{latestAnalysis?.project_name}</td>
                      <td className="p-4 text-green-400 font-semibold">{latestAnalysis?.health_score}%</td>
                      <td className="p-4">
                        <span className="bg-purple-500 px-3 py-1 rounded-full text-white text-sm font-semibold">
                          {latestAnalysis?.risk_level}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400">{latestAnalysis?.recommendation}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default Reports;