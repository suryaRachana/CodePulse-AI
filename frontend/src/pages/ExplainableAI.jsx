import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLightbulb, FaBrain } from "react-icons/fa";

function ExplainableAI() {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState("");

  const files = [
    {
      id: 1,
      file: "UserService.py",
      risk: 92,
      level: "High",
      complexity: 87,
      duplication: 72,
      bugs: 8,
    },
    {
      id: 2,
      file: "Payment.py",
      risk: 85,
      level: "High",
      complexity: 81,
      duplication: 65,
      bugs: 6,
    },
    {
      id: 3,
      file: "DatabaseManager.py",
      risk: 78,
      level: "High",
      complexity: 74,
      duplication: 58,
      bugs: 5,
    },
    {
      id: 4,
      file: "Auth.py",
      risk: 45,
      level: "Medium",
      complexity: 42,
      duplication: 31,
      bugs: 2,
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
            Explainable <span className="text-purple-400">AI</span>
          </h1>

          <p className="text-gray-400 mt-2">
            Understand why your repository files are considered risky.
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
            <FaLightbulb className="text-purple-400 text-xl" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              Select a File
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              Choose a file to understand its AI risk assessment.
            </p>
          </div>

        </div>

        <select
          value={selectedFile}
          onChange={(e) => setSelectedFile(e.target.value)}
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


      {/* Explanation */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

        {/* Risk Overview */}

        <div className="bg-[#161622] border border-gray-700 rounded-2xl p-6">

          <h2 className="text-2xl font-bold text-white">
            Risk Explanation
          </h2>

          <p className="text-gray-400 mt-2">
            AI-generated explanation for the selected file.
          </p>

          <div className="mt-6">

            <p className="text-gray-400 text-sm">
              File
            </p>

            <h3 className="text-xl font-semibold text-white mt-1">
              {currentFile.file}
            </h3>

          </div>

          <div className="mt-6">

            <p className="text-gray-400 text-sm">
              Risk Score
            </p>

            <h3 className="text-4xl font-bold text-red-400 mt-2">
              {currentFile.risk}%
            </h3>

          </div>

          <div className="w-full bg-gray-700 rounded-full h-2 mt-5">

            <div
              className="bg-red-500 h-2 rounded-full"
              style={{
                width: `${currentFile.risk}%`,
              }}
            />

          </div>

          <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-xl p-5">

            <p className="text-red-400 font-semibold">
              Why is this file risky?
            </p>

            <p className="text-gray-300 text-sm mt-2 leading-6">
              This file shows elevated code complexity, code duplication,
              and potential bug patterns. These factors increase the
              probability of future maintenance problems.
            </p>

          </div>

        </div>


        {/* AI Factors */}

        <div className="bg-[#161622] border border-gray-700 rounded-2xl p-6">

          <div className="flex items-center gap-3">

            <FaBrain className="text-purple-400 text-xl" />

            <h2 className="text-2xl font-bold text-white">
              AI Risk Factors
            </h2>

          </div>

          <p className="text-gray-400 mt-2">
            Factors influencing the predicted risk score.
          </p>


          {/* Complexity */}

          <div className="mt-7">

            <div className="flex justify-between">

              <span className="text-gray-300">
                Code Complexity
              </span>

              <span className="text-orange-400 font-semibold">
                {currentFile.complexity}%
              </span>

            </div>

            <div className="w-full bg-gray-700 rounded-full h-2 mt-3">

              <div
                className="bg-orange-400 h-2 rounded-full"
                style={{
                  width: `${currentFile.complexity}%`,
                }}
              />

            </div>

          </div>


          {/* Duplication */}

          <div className="mt-7">

            <div className="flex justify-between">

              <span className="text-gray-300">
                Code Duplication
              </span>

              <span className="text-yellow-400 font-semibold">
                {currentFile.duplication}%
              </span>

            </div>

            <div className="w-full bg-gray-700 rounded-full h-2 mt-3">

              <div
                className="bg-yellow-400 h-2 rounded-full"
                style={{
                  width: `${currentFile.duplication}%`,
                }}
              />

            </div>

          </div>


          {/* Bugs */}

          <div className="mt-7">

            <div className="flex justify-between">

              <span className="text-gray-300">
                Potential Bugs
              </span>

              <span className="text-red-400 font-semibold">
                {currentFile.bugs}
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* AI Explanation */}

      <div className="mt-8 bg-[#161622] border border-purple-500/20 rounded-2xl p-6">

        <h2 className="text-2xl font-bold text-white">
          AI Explanation
        </h2>

        <p className="text-gray-400 mt-2">
          Human-readable explanation of the prediction.
        </p>

        <div className="mt-6 space-y-4">

          <div className="bg-[#0B0B12] rounded-xl p-5">

            <h3 className="text-white font-semibold">
              1. High complexity
            </h3>

            <p className="text-gray-400 text-sm mt-2">
              Complex code is harder to understand, test, and maintain,
              which can increase future technical debt.
            </p>

          </div>

          <div className="bg-[#0B0B12] rounded-xl p-5">

            <h3 className="text-white font-semibold">
              2. Code duplication
            </h3>

            <p className="text-gray-400 text-sm mt-2">
              Repeated logic can make future changes more difficult and
              increase the possibility of inconsistent behavior.
            </p>

          </div>

          <div className="bg-[#0B0B12] rounded-xl p-5">

            <h3 className="text-white font-semibold">
              3. Potential bug patterns
            </h3>

            <p className="text-gray-400 text-sm mt-2">
              Detected patterns suggest that this file may require
              additional testing and review.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}

export default ExplainableAI;