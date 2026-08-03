import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTools,
  FaCode,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

function Refactoring() {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);

  const files = [
    {
      id: 1,
      file: "UserService.py",
      risk: 92,
      complexity: 87,
      issue: "High complexity and duplicated logic",
    },
    {
      id: 2,
      file: "Payment.py",
      risk: 85,
      complexity: 81,
      issue: "Complex payment processing logic",
    },
    {
      id: 3,
      file: "DatabaseManager.py",
      risk: 78,
      complexity: 74,
      issue: "Large functions and repeated queries",
    },
    {
      id: 4,
      file: "Auth.py",
      risk: 45,
      complexity: 42,
      issue: "Moderate code complexity",
    },
  ];

  const currentFile =
    files.find((item) => item.file === selectedFile) || files[0];

  return (
    <section className="min-h-screen bg-[#0B0B12] px-10 py-8">

      {/* Header */}

      <div className="flex justify-between items-center mb-10">

        <div>

          <h1 className="text-4xl font-bold text-white">
            AI <span className="text-purple-400">Refactoring</span>
          </h1>

          <p className="text-gray-400 mt-2">
            Improve code quality with AI-powered refactoring suggestions.
          </p>

        </div>

        <button
          onClick={() => navigate("/prediction")}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          View Risk Prediction
        </button>

      </div>


      {/* File Selection */}

      <div className="bg-[#161622] border border-gray-700 rounded-2xl p-6">

        <div className="flex items-center gap-3 mb-5">

          <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
            <FaTools className="text-purple-400 text-xl" />
          </div>

          <div>

            <h2 className="text-2xl font-bold text-white">
              Select File to Refactor
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              Choose a risky file to get AI-powered improvement suggestions.
            </p>

          </div>

        </div>

        <select
          value={selectedFile}
          onChange={(e) => {
            setSelectedFile(e.target.value);
            setShowSuggestion(false);
          }}
          className="w-full bg-[#0B0B12] border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-purple-500"
        >

          <option value="">
            Select repository file
          </option>

          {files.map((item) => (
            <option key={item.id} value={item.file}>
              {item.file}
            </option>
          ))}

        </select>

      </div>


      {/* Selected File Overview */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

        <div className="bg-[#161622] border border-gray-700 rounded-2xl p-6">

          <p className="text-gray-400 text-sm">
            Selected File
          </p>

          <h2 className="text-xl font-bold text-white mt-3">
            {currentFile.file}
          </h2>

        </div>


        <div className="bg-[#161622] border border-gray-700 rounded-2xl p-6">

          <p className="text-gray-400 text-sm">
            Risk Score
          </p>

          <h2 className="text-4xl font-bold text-red-400 mt-3">
            {currentFile.risk}%
          </h2>

        </div>


        <div className="bg-[#161622] border border-gray-700 rounded-2xl p-6">

          <p className="text-gray-400 text-sm">
            Complexity
          </p>

          <h2 className="text-4xl font-bold text-orange-400 mt-3">
            {currentFile.complexity}%
          </h2>

        </div>

      </div>


      {/* Refactoring Workspace */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

        {/* Current Code */}

        <div className="bg-[#161622] border border-gray-700 rounded-2xl p-6">

          <div className="flex items-center gap-3 mb-5">

            <FaCode className="text-gray-400" />

            <h2 className="text-2xl font-bold text-white">
              Current Code
            </h2>

          </div>

          <div className="bg-[#0B0B12] border border-gray-800 rounded-xl p-5 font-mono text-sm text-gray-300 leading-7 overflow-x-auto">

            <p>
              <span className="text-purple-400">def</span>{" "}
              process_data(data):
            </p>

            <p className="ml-4">
              result = []
            </p>

            <p className="ml-4">
              for item in data:
            </p>

            <p className="ml-8">
              if item.is_valid:
            </p>

            <p className="ml-12">
              result.append(item)
            </p>

            <p className="ml-4">
              return result
            </p>

          </div>

          <div className="mt-5 flex items-center gap-2 text-yellow-400">

            <FaExclamationTriangle />

            <span className="text-sm">
              {currentFile.issue}
            </span>

          </div>

        </div>


        {/* AI Suggestion */}

        <div className="bg-[#161622] border border-purple-500/20 rounded-2xl p-6">

          <div className="flex items-center gap-3 mb-5">

            <FaTools className="text-purple-400" />

            <h2 className="text-2xl font-bold text-white">
              AI Refactoring Suggestion
            </h2>

          </div>

          {!showSuggestion ? (

            <div className="text-center py-12">

              <p className="text-gray-400">
                Let AI analyze this file and suggest improvements.
              </p>

              <button
                onClick={() => setShowSuggestion(true)}
                className="mt-6 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                Generate Suggestion
              </button>

            </div>

          ) : (

            <div>

              <div className="bg-[#0B0B12] border border-gray-800 rounded-xl p-5 font-mono text-sm text-gray-300 leading-7 overflow-x-auto">

                <p>
                  <span className="text-purple-400">def</span>{" "}
                  process_valid_data(data):
                </p>

                <p className="ml-4">
                  return [
                </p>

                <p className="ml-8">
                  item
                </p>

                <p className="ml-8">
                  <span className="text-purple-400">for</span> item{" "}
                  <span className="text-purple-400">in</span> data
                </p>

                <p className="ml-8">
                  <span className="text-purple-400">if</span> item.is_valid
                </p>

                <p className="ml-4">
                  ]
                </p>

              </div>

              <div className="mt-5 flex items-center gap-2 text-green-400">

                <FaCheckCircle />

                <span className="text-sm">
                  AI suggests simplifying the logic to improve readability.
                </span>

              </div>

            </div>

          )}

        </div>

      </div>


      {/* Improvement Summary */}

      <div className="mt-8 bg-[#161622] border border-gray-700 rounded-2xl p-6">

        <h2 className="text-2xl font-bold text-white">
          Expected Improvements
        </h2>

        <p className="text-gray-400 mt-2">
          Estimated benefits after applying the suggested refactoring.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

          <div className="bg-[#0B0B12] rounded-xl p-5">

            <p className="text-gray-400 text-sm">
              Complexity
            </p>

            <p className="text-green-400 text-2xl font-bold mt-2">
              -32%
            </p>

            <p className="text-gray-500 text-sm mt-1">
              Lower complexity
            </p>

          </div>

          <div className="bg-[#0B0B12] rounded-xl p-5">

            <p className="text-gray-400 text-sm">
              Maintainability
            </p>

            <p className="text-green-400 text-2xl font-bold mt-2">
              +28%
            </p>

            <p className="text-gray-500 text-sm mt-1">
              Easier to maintain
            </p>

          </div>

          <div className="bg-[#0B0B12] rounded-xl p-5">

            <p className="text-gray-400 text-sm">
              Technical Debt
            </p>

            <p className="text-green-400 text-2xl font-bold mt-2">
              -24%
            </p>

            <p className="text-gray-500 text-sm mt-1">
              Reduced future debt
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Refactoring;