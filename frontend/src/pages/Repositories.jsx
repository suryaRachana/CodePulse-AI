import { useState } from "react";
import Sidebar from "../components/Sidebar";

function Repositories() {
  const [repositoryUrl, setRepositoryUrl] = useState("");

  return (
    <div className="flex bg-[#0B0B12] min-h-screen">

      <Sidebar />

      <section className="flex-1 px-10 py-8">

        {/* Header */}

        <div className="mb-10">

          <h1 className="text-4xl font-bold text-white">
            Analyze Repository
          </h1>

          <p className="text-gray-400 mt-2">
            Paste your GitHub repository URL to begin AI-powered analysis.
          </p>

        </div>

        {/* Repository URL */}

        <div className="bg-[#161622] border border-gray-700 rounded-2xl p-8">

          <h2 className="text-2xl font-semibold text-white mb-6">
            Repository URL
          </h2>

          <input
            type="text"
            placeholder="https://github.com/username/repository"
            value={repositoryUrl}
            onChange={(e) => setRepositoryUrl(e.target.value)}
            className="w-full bg-[#0B0B12] border border-gray-700 rounded-xl px-5 py-4 text-white outline-none focus:border-purple-500"
          />

          <button
            className="mt-6 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl transition"
          >
            Analyze Repository
          </button>

        </div>


        {/* Repository Information */}

<div className="mt-10 bg-[#161622] border border-gray-700 rounded-2xl p-8">

  <h2 className="text-2xl font-semibold text-white mb-8">
    Repository Information
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

    <div className="bg-[#0B0B12] rounded-xl p-5">
      <p className="text-gray-400 text-sm">Repository Name</p>
      <h3 className="text-white text-lg font-semibold mt-2">
        --
      </h3>
    </div>

    <div className="bg-[#0B0B12] rounded-xl p-5">
      <p className="text-gray-400 text-sm">Language</p>
      <h3 className="text-white text-lg font-semibold mt-2">
        --
      </h3>
    </div>

    <div className="bg-[#0B0B12] rounded-xl p-5">
      <p className="text-gray-400 text-sm">Stars</p>
      <h3 className="text-yellow-400 text-lg font-semibold mt-2">
        --
      </h3>
    </div>

    <div className="bg-[#0B0B12] rounded-xl p-5">
      <p className="text-gray-400 text-sm">Forks</p>
      <h3 className="text-blue-400 text-lg font-semibold mt-2">
        --
      </h3>
    </div>

    <div className="bg-[#0B0B12] rounded-xl p-5">
      <p className="text-gray-400 text-sm">Default Branch</p>
      <h3 className="text-green-400 text-lg font-semibold mt-2">
        --
      </h3>
    </div>

    <div className="bg-[#0B0B12] rounded-xl p-5">
      <p className="text-gray-400 text-sm">Total Files</p>
      <h3 className="text-purple-400 text-lg font-semibold mt-2">
        --
      </h3>
    </div>

  </div>

</div>




{/* Extracted Metrics */}

<div className="mt-10 bg-[#161622] border border-gray-700 rounded-2xl p-8">

  <h2 className="text-2xl font-semibold text-white mb-8">
    Extracted Metrics
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

    {/* Lines of Code */}
    <div className="bg-[#0B0B12] rounded-xl p-5">
      <p className="text-gray-400 text-sm">Lines of Code</p>
      <h3 className="text-green-400 text-2xl font-bold mt-2">
        --
      </h3>
    </div>

    {/* Cyclomatic Complexity */}
    <div className="bg-[#0B0B12] rounded-xl p-5">
      <p className="text-gray-400 text-sm">
        Cyclomatic Complexity
      </p>
      <h3 className="text-yellow-400 text-2xl font-bold mt-2">
        --
      </h3>
    </div>

    {/* Maintainability Index */}
    <div className="bg-[#0B0B12] rounded-xl p-5">
      <p className="text-gray-400 text-sm">
        Maintainability Index
      </p>
      <h3 className="text-blue-400 text-2xl font-bold mt-2">
        --
      </h3>
    </div>

    {/* Functions */}
    <div className="bg-[#0B0B12] rounded-xl p-5">
      <p className="text-gray-400 text-sm">
        Number of Functions
      </p>
      <h3 className="text-purple-400 text-2xl font-bold mt-2">
        --
      </h3>
    </div>

    {/* Classes */}
    <div className="bg-[#0B0B12] rounded-xl p-5">
      <p className="text-gray-400 text-sm">
        Number of Classes
      </p>
      <h3 className="text-pink-400 text-2xl font-bold mt-2">
        --
      </h3>
    </div>

    {/* Duplicate Code */}
    <div className="bg-[#0B0B12] rounded-xl p-5">
      <p className="text-gray-400 text-sm">
        Duplicate Code
      </p>
      <h3 className="text-red-400 text-2xl font-bold mt-2">
        --
      </h3>
    </div>

  </div>

</div>

{/* Start AI Analysis */}

<div className="mt-10 bg-[#161622] border border-gray-700 rounded-2xl p-8 text-center">

  <h2 className="text-2xl font-bold text-white">
    Ready for AI Analysis?
  </h2>

  <p className="text-gray-400 mt-3">
    Once the repository metrics are extracted, start the AI-powered analysis
    to predict repository health, technical debt, and future risk.
  </p>

  <button
    className="mt-8 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold transition"
  >
    🚀 Start AI Analysis
  </button>

</div>

      </section>

    </div>
  );
}

export default Repositories;