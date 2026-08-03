import { useNavigate } from "react-router-dom";

function Reports() {

  const navigate = useNavigate();

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
          className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-lg"
        >
          Back to Dashboard
        </button>

      </div>

      {/* Download Buttons */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

        <button className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-2xl text-xl font-semibold">

          📄 Download PDF Report

        </button>

        <button className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-2xl text-xl font-semibold">

          📊 Export CSV Data

        </button>

      </div>




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
      <p className="text-gray-400 text-sm">
        Repository
      </p>

      <h3 className="text-white text-xl font-semibold mt-2">
        CodePulse-AI
      </h3>
    </div>

    <div>
      <p className="text-gray-400 text-sm">
        Health Score
      </p>

      <h3 className="text-green-400 text-xl font-semibold mt-2">
        91%
      </h3>
    </div>

    <div>
      <p className="text-gray-400 text-sm">
        Technical Debt
      </p>

      <h3 className="text-red-400 text-xl font-semibold mt-2">
        18%
      </h3>
    </div>

    <div>
      <p className="text-gray-400 text-sm">
        Future Risk
      </p>

      <h3 className="text-yellow-400 text-xl font-semibold mt-2">
        Low
      </h3>
    </div>

  </div>

</div>





{/* High Risk Files */}

<div className="mt-10 bg-[#161622] border border-gray-700 rounded-2xl p-8">

  <h2 className="text-2xl font-bold text-white">
    High Risk Files
  </h2>

  <p className="text-gray-400 mt-2">
    Files that require immediate attention based on AI analysis.
  </p>

  <div className="overflow-x-auto mt-8">

    <table className="w-full">

      <thead>

        <tr className="border-b border-gray-700">

          <th className="text-left text-white p-4">
            File Name
          </th>

          <th className="text-left text-white p-4">
            Risk Level
          </th>

          <th className="text-left text-white p-4">
            Recommendation
          </th>

        </tr>

      </thead>

      <tbody>

        <tr className="border-b border-gray-800">

          <td className="p-4 text-gray-300">
            AuthController.js
          </td>

          <td className="p-4">
            <span className="bg-red-500 px-3 py-1 rounded-full text-white text-sm">
              High
            </span>
          </td>

          <td className="p-4 text-gray-400">
            Reduce complexity & improve validation.
          </td>

        </tr>

        <tr className="border-b border-gray-800">

          <td className="p-4 text-gray-300">
            PaymentService.js
          </td>

          <td className="p-4">
            <span className="bg-red-500 px-3 py-1 rounded-full text-white text-sm">
              High
            </span>
          </td>

          <td className="p-4 text-gray-400">
            Refactor duplicated business logic.
          </td>

        </tr>

        <tr>

          <td className="p-4 text-gray-300">
            Database.java
          </td>

          <td className="p-4">
            <span className="bg-yellow-500 px-3 py-1 rounded-full text-white text-sm">
              Medium
            </span>
          </td>

          <td className="p-4 text-gray-400">
            Optimize database queries.
          </td>

        </tr>

      </tbody>

    </table>

  </div>

</div>

    </section>

  );

}

export default Reports;