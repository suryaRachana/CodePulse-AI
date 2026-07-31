import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import jsPDF from "jspdf";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
Pie,
Cell,
Legend,
LineChart,
Line

} from "recharts";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [historyData, setHistoryData] = useState([]);

  const [projectName, setProjectName] = useState("");
  const [linesOfCode, setLinesOfCode] = useState("");
  const [codeComplexity, setCodeComplexity] = useState("");
  const [bugs, setBugs] = useState("");
  const [codeDuplication, setCodeDuplication] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signin");
      return;
    }

    const fetchDashboard = async () => {
      try {
        const response = await API.get("/latest-analysis");
        setDashboardData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDashboard();
  }, [navigate]);
  

  useEffect(() => {
  const fetchHistory = async () => {
    try {
      const response = await API.get("/history-chart");
      setHistoryData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  fetchHistory();
}, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleAnalyze = async () => {
    console.log("Analyze button clicked");
    setLoading(true);
  try {
    const response = await API.post("/predict", {
      project_name: projectName,
      lines_of_code: Number(linesOfCode),
      code_complexity: Number(codeComplexity),
      bugs: Number(bugs),
      code_duplication: Number(codeDuplication),
    });

     setPredictionResult(response.data);
     setDashboardData(response.data);
     setLoading(false);
     toast.success("Project analyzed successfully!");

  } catch (error) {
    setLoading(false);
    console.error(error);
    toast.error("Prediction Failed!");
  }
};
const downloadPDF = () => {
  if (!predictionResult) {
    alert("No prediction available!");
    return;
  }

  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("CodePulse AI Report", 20, 20);

  doc.setFontSize(12);
  doc.text(`Project Name: ${predictionResult.project_name}`, 20, 40);
  doc.text(`Health Score: ${predictionResult.health_score}%`, 20, 50);
  doc.text(`Technical Debt: ${predictionResult.technical_debt_score}`, 20, 60);
  doc.text(`Risk Level: ${predictionResult.risk_level}`, 20, 70);

  doc.text("Recommendation:", 20, 85);
  doc.text(predictionResult.recommendation, 20, 95);

  doc.save(`${predictionResult.project_name}_Report.pdf`);
};
const chartData = dashboardData
  ? [
      {
        name: "Health",
        score: dashboardData.health_score,
      },
    ]
  : [];

  const pieData = dashboardData
  ? [
      {
        name: "Healthy Code",
        value: dashboardData.health_score,
      },
      {
        name: "Technical Debt",
        value: dashboardData.technical_debt_score,
      },
    ]
  : [];

const COLORS = ["#8b5cf6", "#ef4444"];
  return (
    <section className="min-h-screen bg-[#0B0B12] px-12 py-10">

      {/* Header */}
      <div className="flex justify-between items-center">

        <h1 className="text-4xl font-bold text-white">
          CodePulse <span className="text-purple-400">AI Dashboard</span>
        </h1>
        <button
  onClick={() => navigate("/history")}
  className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-lg transition"
>
  History
</button>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition"
        >
          Logout
        </button>

      </div>

      <p className="text-gray-400 mt-3">
        Monitor your repository health and AI-powered insights.
      </p>

     {/* Dashboard Cards */}

<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

  {/* Health Score */}
  <div className="bg-[#161622] border border-purple-500/20 rounded-2xl p-6 shadow-lg">

    <p className="text-gray-400">
      Repository Health Score
    </p>

    <div className="flex items-center justify-between mt-4">

      <h2 className="text-4xl font-bold text-purple-400">
        {dashboardData
          ? `${dashboardData.health_score}%`
          : "Loading..."}
      </h2>

      <span className="text-sm text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
        Healthy
      </span>

    </div>

    <div className="w-full bg-gray-700 rounded-full h-2 mt-5">
      <div
        className="bg-purple-500 h-2 rounded-full transition-all duration-500"
        style={{
          width: `${dashboardData?.health_score || 0}%`,
        }}
      ></div>
    </div>

  </div>


  {/* Technical Debt */}
  <div className="bg-[#161622] border border-purple-500/20 rounded-2xl p-6 shadow-lg">

    <p className="text-gray-400">
      Technical Debt
    </p>

    <div className="flex items-center justify-between mt-4">

      <h2 className="text-4xl font-bold text-red-400">
        {dashboardData
          ? dashboardData.technical_debt_score
          : "Loading..."}
      </h2>

      <span className="text-sm text-red-400 bg-red-400/10 px-3 py-1 rounded-full">
        Debt
      </span>

    </div>

    <div className="w-full bg-gray-700 rounded-full h-2 mt-5">
      <div
        className="bg-red-500 h-2 rounded-full transition-all duration-500"
        style={{
          width: `${dashboardData?.technical_debt_score || 0}%`,
        }}
      ></div>
    </div>

  </div>


  {/* Risk Level */}
  <div className="bg-[#161622] border border-purple-500/20 rounded-2xl p-6 shadow-lg">

  <p className="text-gray-400">
    Risk Level
  </p>

  <div className="mt-4">
    {dashboardData && (
      <span
        className={`px-4 py-2 rounded-full text-white font-semibold ${
          dashboardData.risk_level === "Low"
            ? "bg-green-500"
            : dashboardData.risk_level === "Medium"
            ? "bg-yellow-500"
            : dashboardData.risk_level === "High"
            ? "bg-orange-500"
            : "bg-red-500"
        }`}
      >
        {dashboardData.risk_level}
      </span>
    )}

    <span className="inline-block mt-4 text-sm text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full">
      AI Assessment
    </span>
  </div>

</div>

</div>
        

      {/* Analyze Project Form */}

      <div className="mt-10 bg-[#161622] border border-purple-500/20 rounded-2xl p-8">

        <h2 className="text-2xl font-semibold text-white mb-6">
          Analyze Project
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <input
            type="text"
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="bg-[#0B0B12] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500"
          />

          <input
            type="number"
            placeholder="Lines of Code"
            value={linesOfCode}
            onChange={(e) => setLinesOfCode(e.target.value)}
            className="bg-[#0B0B12] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500"
          />

          <input
            type="number"
            placeholder="Code Complexity"
            value={codeComplexity}
            onChange={(e) => setCodeComplexity(e.target.value)}
            className="bg-[#0B0B12] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500"
          />

          <input
            type="number"
            placeholder="Number of Bugs"
            value={bugs}
            onChange={(e) => setBugs(e.target.value)}
            className="bg-[#0B0B12] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500"
          />

          <input
            type="number"
            placeholder="Code Duplication (%)"
            value={codeDuplication}
            onChange={(e) => setCodeDuplication(e.target.value)}
            className="bg-[#0B0B12] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500"
          />

        </div>

       <button
  onClick={handleAnalyze}
  disabled={loading}
  className={`mt-6 px-6 py-3 rounded-xl text-white transition ${
    loading
      ? "bg-gray-500 cursor-not-allowed"
      : "bg-purple-500 hover:bg-purple-600"
  }`}
>
  {loading ? "Analyzing..." : "Analyze Project"}
</button>


{predictionResult && (
  <div className="mt-8 bg-[#0B0B12] border border-purple-500/20 rounded-2xl p-6">

    <h2 className="text-2xl font-bold text-white mb-6">
      Prediction Result
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      <div>
        <p className="text-gray-400">Project Name</p>
        <h3 className="text-white text-xl font-semibold mt-2">
          {predictionResult.project_name}
        </h3>
      </div>

      <div>
        <p className="text-gray-400">Health Score</p>
        <h3 className="text-green-400 text-xl font-semibold mt-2">
          {predictionResult.health_score}%
        </h3>
      </div>

      <div>
        <p className="text-gray-400">Technical Debt</p>
        <h3 className="text-red-400 text-xl font-semibold mt-2">
          {predictionResult.technical_debt_score}
        </h3>
      </div>

      <div>
        <p className="text-gray-400">Risk Level</p>
        <h3 className="text-yellow-400 text-xl font-semibold mt-2">
          {predictionResult.risk_level}
        </h3>
      </div>

    </div>

    <div className="mt-8 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/30 rounded-2xl p-6">

  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
    🤖 AI Recommendation
  </h3>

  <p className="text-gray-300 mt-4 leading-8">
    {predictionResult.recommendation}
  </p>

  <div className="mt-6 flex flex-wrap gap-3">

    <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full">
      ✔ Improve Code Quality
    </span>

    <span className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full">
      ✔ Reduce Bugs
    </span>

    <span className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full">
      ✔ Optimize Performance
    </span>

  </div>

  <button
    onClick={downloadPDF}
    className="mt-8 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl transition"
  >
    📄 Download PDF Report
  </button>

</div>
  </div>
)}

      </div>

      <div className="mt-10 bg-[#161622] border border-purple-500/20 rounded-2xl p-8">

  <h2 className="text-2xl font-semibold text-white mb-6">
    Health Score Analytics
  </h2>

  <div className="w-full h-80">

    <ResponsiveContainer width="100%" height="100%">

      <BarChart data={chartData}>
  <CartesianGrid strokeDasharray="3 3" stroke="#444" />

  <XAxis dataKey="name" stroke="#ffffff" />
  <YAxis stroke="#ffffff" />
  <Tooltip />

  <Bar
    dataKey="score"
    fill="#8b5cf6"
    radius={[8, 8, 0, 0]}
  />
</BarChart>
    </ResponsiveContainer>

  </div>

</div>
<div className="mt-10 bg-[#161622] border border-purple-500/20 rounded-2xl p-8">

  <h2 className="text-2xl font-semibold text-white mb-6">
    Technical Debt Distribution
  </h2>

  <div className="w-full h-80">

    <ResponsiveContainer width="100%" height="100%">

      <PieChart>

        <Pie
          data={pieData}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {pieData.map((entry, index) => (
            <Cell
              key={index}
              fill={COLORS[index]}
            />
          ))}
        </Pie>

        <Tooltip />
        <Legend />

      </PieChart>

    </ResponsiveContainer>

  </div>

</div>



<div className="mt-10 bg-[#161622] border border-purple-500/20 rounded-2xl p-8">

  <h2 className="text-2xl font-semibold text-white mb-6">
    Project Health Trend
  </h2>

  <div className="w-full h-80">

    <ResponsiveContainer width="100%" height="100%">

      <LineChart data={historyData}>

        <CartesianGrid strokeDasharray="3 3" stroke="#444" />

        <XAxis
          dataKey="project"
          stroke="#ffffff"
        />

        <YAxis stroke="#ffffff" />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="health_score"
          stroke="#8b5cf6"
          strokeWidth={3}
        />

      </LineChart>

    </ResponsiveContainer>

  </div>

</div>
    </section>
  );
}

export default Dashboard;