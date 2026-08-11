import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import jsPDF from "jspdf";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";
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
    <div className="flex flex-col lg:flex-row bg-[#0B0B12] min-h-screen overflow-x-hidden">
      <Sidebar />

      <section className="flex-1 w-full min-h-screen bg-[#0B0B12] px-4 sm:px-6 lg:px-10 py-6 lg:py-8 overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              Repository Health Dashboard
            </h1>

            <p className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2">
              Live insights from your latest repository analysis.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-2.5 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={() => navigate("/reports")}
              className="flex-1 sm:flex-none bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium min-h-[44px]"
            >
              View Reports
            </button>

            <button
              onClick={() => navigate("/repositories")}
              className="flex-1 sm:flex-none bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium min-h-[44px]"
            >
              New Analysis
            </button>

            <button
              onClick={handleLogout}
              className="flex-1 sm:flex-none bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium min-h-[44px]"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6 sm:mt-10">
          {/* Health Score */}
          <div className="bg-[#161622] border border-gray-700 rounded-2xl p-5 sm:p-6">
            <p className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider font-semibold">
              Software Health Score
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold text-green-400 mt-3 sm:mt-4">
              {dashboardData ? `${dashboardData.health_score}%` : "--"}
            </h2>

            <p className="text-green-400 text-xs sm:text-sm mt-1.5 sm:mt-2">
              Healthy Repository
            </p>

            <div className="w-full bg-gray-700 rounded-full h-2 mt-4 sm:mt-5">
              <div
                className="bg-green-400 h-2 rounded-full transition-all"
                style={{
                  width: `${dashboardData?.health_score || 0}%`,
                }}
              />
            </div>
          </div>

          {/* Technical Debt */}
          <div className="bg-[#161622] border border-gray-700 rounded-2xl p-5 sm:p-6">
            <p className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider font-semibold">
              Technical Debt
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold text-yellow-400 mt-3 sm:mt-4">
              {dashboardData?.technical_debt_score ?? "--"}%
            </h2>

            <p className="text-red-400 text-xs sm:text-sm mt-1.5 sm:mt-2">
              Requires Attention
            </p>

            <div className="w-full bg-gray-700 rounded-full h-2 mt-4 sm:mt-5">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all"
                style={{
                  width: `${dashboardData?.technical_debt_score || 0}%`,
                }}
              />
            </div>
          </div>

          {/* Future Risk */}
          <div className="bg-[#161622] border border-gray-700 rounded-2xl p-5 sm:p-6">
            <p className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider font-semibold">
              Future Risk Level
            </p>

            <h2
              className={`text-3xl sm:text-4xl font-bold mt-3 sm:mt-4 ${
                dashboardData?.risk_level === "Low"
                  ? "text-green-400"
                  : dashboardData?.risk_level === "Medium"
                  ? "text-yellow-400"
                  : dashboardData?.risk_level === "High"
                  ? "text-orange-400"
                  : "text-red-500"
              }`}
            >
              {dashboardData?.risk_level || "--"}
            </h2>

            <p className="text-gray-400 text-xs sm:text-sm mt-1.5 sm:mt-2">
              AI Predicted Risk
            </p>
          </div>

          {/* Files Analyzed */}
          <div className="bg-[#161622] border border-gray-700 rounded-2xl p-5 sm:p-6">
            <p className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider font-semibold">
              Files Analyzed
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold text-blue-400 mt-3 sm:mt-4">
              {dashboardData?.total_files ?? "--"}
            </h2>

            <p className="text-blue-400 text-xs sm:text-sm mt-1.5 sm:mt-2">
              Repository Files
            </p>
          </div>
        </div>

        {/* Repository Information */}
        <div className="mt-6 sm:mt-8 bg-[#161622] border border-gray-700 rounded-2xl p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Current Repository
            </h2>

            <button
              onClick={() => navigate("/repositories")}
              className="w-full sm:w-auto bg-purple-500 hover:bg-purple-600 text-white px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium min-h-[44px] flex items-center justify-center"
            >
              Analyze New Repository
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Repository</p>
              <h3 className="text-white font-semibold mt-1 sm:mt-2 break-all text-sm sm:text-base">
                {dashboardData?.project_name || "No Repository"}
              </h3>
            </div>

            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Language</p>
              <h3 className="text-white font-semibold mt-1 sm:mt-2 text-sm sm:text-base">
                {dashboardData?.language || "--"}
              </h3>
            </div>

            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Files</p>
              <h3 className="text-white font-semibold mt-1 sm:mt-2 text-sm sm:text-base">
                {dashboardData?.total_files || "--"}
              </h3>
            </div>

            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Lines of Code</p>
              <h3 className="text-white font-semibold mt-1 sm:mt-2 text-sm sm:text-base">
                {dashboardData?.lines_of_code || "--"}
              </h3>
            </div>
          </div>
        </div>
{/* Health Trend + Risk Distribution */}

<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">

  {/* Software Health Trend */}

  <div className="bg-[#161622] border border-gray-700 rounded-2xl p-6">

    <h2 className="text-2xl font-bold text-white mb-2">
      Software Health Trend
    </h2>

    <p className="text-gray-400 mb-6">
      Monthly software health score
    </p>

    <div className="w-full h-80">

      <ResponsiveContainer width="100%" height="100%">

        <LineChart
          data={
            historyData && historyData.length > 0
              ? historyData.map((item) => ({
                  month: item.project,
                  score: item.health_score,
                }))
              : [
                  { month: "No Data", score: dashboardData?.health_score || 0 },
                ]
          }
        >

          <CartesianGrid strokeDasharray="3 3" stroke="#333" />

          <XAxis
            dataKey="month"
            stroke="#9ca3af"
          />

          <YAxis stroke="#9ca3af" />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="score"
            stroke="#22c55e"
            strokeWidth={4}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  </div>

  {/* Risk Distribution */}

  <div className="bg-[#161622] border border-gray-700 rounded-2xl p-6">

    <h2 className="text-2xl font-bold text-white mb-2">
      Risk Distribution
    </h2>

    <p className="text-gray-400 mb-6">
      AI risk breakdown
    </p>

    <div className="w-full h-80">

      <ResponsiveContainer width="100%" height="100%">

        <PieChart>

          <Pie
            data={[
              { name: "Low", value: 50 },
              { name: "Medium", value: 30 },
              { name: "High", value: 20 },
            ]}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label
          >

            <Cell fill="#22c55e" />
            <Cell fill="#facc15" />
            <Cell fill="#ef4444" />

          </Pie>

          <Tooltip />
          <Legend />

        </PieChart>

      </ResponsiveContainer>

    </div>

  </div>

</div>




{/* Technical Debt Distribution + Top Risky Files */}

<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">

  {/* Technical Debt Distribution */}

  <div className="bg-[#161622] border border-gray-700 rounded-2xl p-6">

    <h2 className="text-2xl font-bold text-white mb-2">
      Technical Debt Distribution
    </h2>

    <p className="text-gray-400 mb-6">
      Debt across different code quality categories
    </p>

    <div className="w-full h-80">

      <ResponsiveContainer width="100%" height="100%">

        <BarChart
          data={[
            { category: "Complexity", value: 35 },
            { category: "Duplication", value: 22 },
            { category: "Coverage", value: 18 },
            { category: "Docs", value: 12 },
            { category: "Style", value: 16 },
            { category: "Dependencies", value: 28 },
          ]}
        >

          <CartesianGrid strokeDasharray="3 3" stroke="#333" />

          <XAxis dataKey="category" stroke="#9ca3af" />

          <YAxis stroke="#9ca3af" />

          <Tooltip />

          <Bar
            dataKey="value"
            fill="#8b5cf6"
            radius={[6, 6, 0, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

  </div>

  {/* Top Risky Files */}

  <div className="bg-[#161622] border border-gray-700 rounded-2xl p-6">

    <h2 className="text-2xl font-bold text-white mb-2">
      Top Risky Files
    </h2>

    <p className="text-gray-400 mb-6">
      Files that need immediate attention
    </p>

    <div className="space-y-4">

      {[
        { file: "UserService.py", risk: "High" },
        { file: "PaymentService.py", risk: "High" },
        { file: "Database.py", risk: "Medium" },
        { file: "AuthController.py", risk: "Medium" },
        { file: "Router.js", risk: "Low" },
      ].map((item, index) => (

        <div
          key={index}
          className="flex justify-between items-center bg-[#0B0B12] rounded-xl p-4"
        >

          <span className="text-white">
            {item.file}
          </span>

          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              item.risk === "High"
                ? "bg-red-500/20 text-red-400"
                : item.risk === "Medium"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-green-500/20 text-green-400"
            }`}
          >
            {item.risk}
          </span>

        </div>

      ))}

    </div>

  </div>

</div>


    </section>
    </div>
  
    );
  }

export default Dashboard ;