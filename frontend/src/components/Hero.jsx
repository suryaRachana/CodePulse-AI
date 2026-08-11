import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  const handleAnalyzeClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/repositories");
    } else {
      navigate("/register");
    }
  };

  return (
    <section className="relative min-h-screen bg-[#0B0B12] flex items-center px-12 py-20 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/20 blur-3xl rounded-full"></div>

      <div className="w-1/2 relative">
        <span className="inline-block px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm">
          AI-Powered Code Quality Analysis
        </span>

        <h1 className="text-7xl font-bold text-white mt-6 leading-tight">
          Predict Technical Debt
          <br />
          <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Before It Becomes a Problem
          </span>
        </h1>

        <p className="text-gray-400 text-xl leading-relaxed mt-6 max-w-xl">
          Analyze your GitHub repository using AI to detect technical debt, code
          quality issues, and get intelligent refactoring recommendations.
        </p>

        <div className="flex gap-5 mt-8">
          <button
            onClick={handleAnalyzeClick}
            className="bg-purple-500 text-white px-6 py-3 rounded-xl shadow-lg shadow-purple-500/20 hover:bg-purple-600 transition font-medium"
          >
            Analyze Repository →
          </button>
        </div>
      </div>

      <div className="w-1/2 flex justify-center relative">
        <div className="bg-[#161622] border border-purple-500/20 rounded-2xl p-8 w-[420px] shadow-xl shadow-purple-500/10">
          <h2 className="text-white text-2xl font-semibold">
            Repository Analysis
          </h2>

          <div className="mt-6 space-y-4">
            <div className="bg-[#0B0B12] rounded-xl p-4">
              <p className="text-gray-400">Health Score</p>
              <p className="text-purple-400 text-2xl font-bold">92%</p>
            </div>

            <div className="bg-[#0B0B12] rounded-xl p-4">
              <p className="text-gray-400">Technical Debt</p>
              <p className="text-white text-2xl font-bold">Low</p>
            </div>

            <div className="bg-[#0B0B12] rounded-xl p-4">
              <p className="text-gray-400">AI Suggestions</p>
              <p className="text-purple-400 text-2xl font-bold">12</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;