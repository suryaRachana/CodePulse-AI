import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBrain } from "react-icons/fa";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function Prediction() {

  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const files = [
    {
      id: 1,
      file: "UserService.py",
      risk: 92,
      level: "High",
      priority: "Critical",
      loc: 1240,
      trend: "↗",
    },
    {
      id: 2,
      file: "Payment.py",
      risk: 85,
      level: "High",
      priority: "High",
      loc: 980,
      trend: "↗",
    },
    {
      id: 3,
      file: "DatabaseManager.py",
      risk: 78,
      level: "High",
      priority: "High",
      loc: 760,
      trend: "→",
    },
    {
      id: 4,
      file: "Auth.py",
      risk: 45,
      level: "Medium",
      priority: "Medium",
      loc: 420,
      trend: "↘",
    },
    {
      id: 5,
      file: "InventorySync.py",
      risk: 38,
      level: "Low",
      priority: "Low",
      loc: 310,
      trend: "↘",
    },
    {
      id: 6,
      file: "NotificationService.py",
      risk: 28,
      level: "Low",
      priority: "Low",
      loc: 210,
      trend: "→",
    },
  ];

  return (
    <section className="min-h-screen bg-[#0B0B12] px-10 py-8">

      {/* Header */}

      <div className="flex justify-between items-center mb-10">

        <div>

          <h1 className="text-4xl font-bold text-white">
            AI Risk Prediction
          </h1>

          <p className="text-gray-400 mt-2">
            File-level technical debt prediction
          </p>

        </div>

        <button
          onClick={() => navigate("/repositories")}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          + New Analysis
        </button>

      </div>




      {/* Risk Summary */}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">

  {/* Overall Risk */}
  <div className="bg-[#161622] border border-gray-700 rounded-2xl p-6">
    <p className="text-gray-400 text-sm uppercase tracking-wider">
      Overall Risk
    </p>

    <h2 className="text-4xl font-bold text-red-400 mt-4">
      High
    </h2>

    <p className="text-red-400 text-sm mt-2">
      AI Predicted Risk
    </p>
  </div>

  {/* Average Risk Score */}
  <div className="bg-[#161622] border border-gray-700 rounded-2xl p-6">
    <p className="text-gray-400 text-sm uppercase tracking-wider">
      Average Risk Score
    </p>

    <h2 className="text-4xl font-bold text-orange-400 mt-4">
      67%
    </h2>

    <p className="text-gray-400 text-sm mt-2">
      Across analyzed files
    </p>
  </div>

  {/* Critical Files */}
  <div className="bg-[#161622] border border-gray-700 rounded-2xl p-6">
    <p className="text-gray-400 text-sm uppercase tracking-wider">
      Critical Files
    </p>

    <h2 className="text-4xl font-bold text-red-500 mt-4">
      2
    </h2>

    <p className="text-red-400 text-sm mt-2">
      Immediate attention
    </p>
  </div>

  {/* High Risk Files */}
  <div className="bg-[#161622] border border-gray-700 rounded-2xl p-6">
    <p className="text-gray-400 text-sm uppercase tracking-wider">
      High Risk Files
    </p>

    <h2 className="text-4xl font-bold text-yellow-400 mt-4">
      8
    </h2>

    <p className="text-yellow-400 text-sm mt-2">
      Requires review
    </p>
  </div>

</div>




{/* Top Risky Files */}

<div className="mt-10 bg-[#161622] border border-gray-700 rounded-2xl p-6">

  <div className="flex justify-between items-center mb-6">

    <div>
      <h2 className="text-2xl font-bold text-white">
        Top Risky Files
      </h2>

      <p className="text-gray-400 mt-2">
        Files with the highest predicted technical debt risk.
      </p>
    </div>

  </div>

  {/* Search */}

  <div className="mb-6">

    <input
      type="text"
      placeholder="Search files..."
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

          <th className="text-left p-4 text-gray-400">
            File
          </th>

          <th className="text-left p-4 text-gray-400">
            Risk Score
          </th>

          <th className="text-left p-4 text-gray-400">
            Risk Level
          </th>

          <th className="text-left p-4 text-gray-400">
            Priority
          </th>

          <th className="text-left p-4 text-gray-400">
            Lines of Code
          </th>

          <th className="text-left p-4 text-gray-400">
            Trend
          </th>

        </tr>

      </thead>

      <tbody>

        {files
          .filter((item) =>
            item.file.toLowerCase().includes(search.toLowerCase())
          )
          .map((item) => (

            <tr
              key={item.id}
              className="border-b border-gray-800 hover:bg-[#1D1D2B] transition"
            >

              <td className="p-4 text-white font-medium">
                {item.file}
              </td>

              <td className="p-4">

                <span className="text-red-400 font-semibold">
                  {item.risk}%
                </span>

              </td>

              <td className="p-4">

                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    item.level === "High"
                      ? "bg-red-500/10 text-red-400"
                      : item.level === "Medium"
                      ? "bg-yellow-500/10 text-yellow-400"
                      : "bg-green-500/10 text-green-400"
                  }`}
                >
                  {item.level}
                </span>

              </td>

              <td className="p-4 text-gray-300">
                {item.priority}
              </td>

              <td className="p-4 text-gray-300">
                {item.loc}
              </td>

              <td className="p-4 text-lg">
                {item.trend}
              </td>

            </tr>

          ))}

      </tbody>

    </table>

  </div>

</div>



{/* Risk Distribution */}

<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">

  {/* Risk Score Distribution */}

  <div className="bg-[#161622] border border-gray-700 rounded-2xl p-6">

    <h2 className="text-2xl font-bold text-white">
      Risk Score Distribution
    </h2>

    <p className="text-gray-400 mt-2 mb-6">
      Predicted risk scores across repository files.
    </p>

    <div className="w-full h-80">

      <ResponsiveContainer width="100%" height="100%">

        <BarChart data={files}>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#333"
          />

          <XAxis
            dataKey="file"
            stroke="#9ca3af"
            tick={{ fontSize: 11 }}
          />

          <YAxis
            stroke="#9ca3af"
          />

          <Tooltip />

          <Bar
            dataKey="risk"
            fill="#ef4444"
            radius={[6, 6, 0, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

  </div>


  {/* Risk Level Distribution */}

  <div className="bg-[#161622] border border-gray-700 rounded-2xl p-6">

    <h2 className="text-2xl font-bold text-white">
      Risk Level Distribution
    </h2>

    <p className="text-gray-400 mt-2 mb-6">
      Breakdown of files by predicted risk level.
    </p>

    <div className="w-full h-80">

      <ResponsiveContainer width="100%" height="100%">

        <BarChart
          data={[
            {
              level: "Critical",
              files: 2,
            },
            {
              level: "High",
              files: 8,
            },
            {
              level: "Medium",
              files: 17,
            },
            {
              level: "Low",
              files: 15,
            },
          ]}
        >

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#333"
          />

          <XAxis
            dataKey="level"
            stroke="#9ca3af"
          />

          <YAxis
            stroke="#9ca3af"
          />

          <Tooltip />

          <Bar
            dataKey="files"
            fill="#8b5cf6"
            radius={[6, 6, 0, 0]}
          />

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
        AI Risk Insights
      </h2>

      <p className="text-gray-400">
        AI-generated analysis of potential repository risks.
      </p>
    </div>

  </div>

  <div className="space-y-4">

    {/* Insight 1 */}

    <div className="bg-[#0B0B12] border border-red-500/20 rounded-xl p-5">

      <div className="flex items-start gap-4">

        <div className="text-red-400 text-xl">
          ⚠
        </div>

        <div>

          <h3 className="text-white font-semibold">
            Critical files require immediate attention
          </h3>

          <p className="text-gray-400 text-sm mt-2">
            UserService.py and Payment.py have significantly
            high predicted risk scores and may contribute to
            future technical debt.
          </p>

        </div>

      </div>

    </div>


    {/* Insight 2 */}

    <div className="bg-[#0B0B12] border border-yellow-500/20 rounded-xl p-5">

      <div className="flex items-start gap-4">

        <div className="text-yellow-400 text-xl">
          !
        </div>

        <div>

          <h3 className="text-white font-semibold">
            High complexity detected
          </h3>

          <p className="text-gray-400 text-sm mt-2">
            Several files show patterns that may increase
            maintenance difficulty and future development cost.
          </p>

        </div>

      </div>

    </div>


    {/* Insight 3 */}

    <div className="bg-[#0B0B12] border border-green-500/20 rounded-xl p-5">

      <div className="flex items-start gap-4">

        <div className="text-green-400 text-xl">
          ✓
        </div>

        <div>

          <h3 className="text-white font-semibold">
            Low-risk files are stable
          </h3>

          <p className="text-gray-400 text-sm mt-2">
            A significant portion of the repository currently
            remains within a low-risk range.
          </p>

        </div>

      </div>

    </div>

  </div>

</div>


{/* Recommendations */}

<div className="mt-8 bg-[#161622] border border-gray-700 rounded-2xl p-6">

  <h2 className="text-2xl font-bold text-white">
    Recommended Actions
  </h2>

  <p className="text-gray-400 mt-2 mb-6">
    Suggested actions to reduce future technical debt.
  </p>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

    <div className="bg-[#0B0B12] border border-gray-800 rounded-xl p-5">

      <span className="text-red-400 text-sm font-semibold">
        PRIORITY 1
      </span>

      <h3 className="text-white font-semibold mt-3">
        Refactor Critical Files
      </h3>

      <p className="text-gray-400 text-sm mt-2">
        Focus on files with risk scores above 80%.
      </p>

    </div>


    <div className="bg-[#0B0B12] border border-gray-800 rounded-xl p-5">

      <span className="text-yellow-400 text-sm font-semibold">
        PRIORITY 2
      </span>

      <h3 className="text-white font-semibold mt-3">
        Reduce Code Complexity
      </h3>

      <p className="text-gray-400 text-sm mt-2">
        Simplify complex functions and improve code structure.
      </p>

    </div>


    <div className="bg-[#0B0B12] border border-gray-800 rounded-xl p-5">

      <span className="text-green-400 text-sm font-semibold">
        PRIORITY 3
      </span>

      <h3 className="text-white font-semibold mt-3">
        Monitor Risk Trends
      </h3>

      <p className="text-gray-400 text-sm mt-2">
        Regularly analyze the repository to track risk changes.
      </p>

    </div>

  </div>

</div>


    </section>
  );
}

export default Prediction;