import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-80px)] bg-[#0B0B12] flex flex-col lg:flex-row items-center justify-between px-4 sm:px-8 lg:px-12 py-12 lg:py-20 overflow-hidden gap-10 lg:gap-0">
      {/* Background Glow */}
      <div className="absolute top-10 left-10 sm:top-20 sm:left-20 w-64 h-64 sm:w-96 sm:h-96 bg-purple-500/20 blur-3xl rounded-full pointer-events-none"></div>

      <div className="w-full lg:w-1/2 relative z-10">
        <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs sm:text-sm font-medium">
          AI-Powered Code Quality Analysis
        </span>

        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-white mt-4 sm:mt-6 leading-tight">
          Predict Technical Debt
          <br />
          <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Before It Becomes a Problem
          </span>
        </h1>

        <p className="text-gray-400 text-sm sm:text-lg lg:text-xl leading-relaxed mt-4 sm:mt-6 max-w-xl">
          Analyze your GitHub repository using AI to detect technical debt, code
          quality issues, and get intelligent refactoring recommendations.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-6 sm:mt-8 w-full sm:w-auto">
          <Link
            to="/register"
            className="w-full sm:w-auto text-center bg-purple-500 text-white px-6 py-3.5 rounded-xl shadow-lg shadow-purple-500/20 hover:bg-purple-600 transition font-medium min-h-[44px] flex items-center justify-center"
          >
            Analyze Repository →
          </Link>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex justify-center relative z-10 mt-6 lg:mt-0">
        <div className="bg-[#161622] border border-purple-500/20 rounded-2xl p-6 sm:p-8 w-full max-w-[420px] shadow-xl shadow-purple-500/10">
          <h2 className="text-white text-xl sm:text-2xl font-semibold">
            Repository Analysis
          </h2>

          <div className="mt-6 space-y-4">
            <div className="bg-[#0B0B12] rounded-xl p-4">
              <p className="text-gray-400 text-xs sm:text-sm">Health Score</p>
              <p className="text-purple-400 text-xl sm:text-2xl font-bold">92%</p>
            </div>

            <div className="bg-[#0B0B12] rounded-xl p-4">
              <p className="text-gray-400 text-xs sm:text-sm">Technical Debt</p>
              <p className="text-white text-xl sm:text-2xl font-bold">Low</p>
            </div>

            <div className="bg-[#0B0B12] rounded-xl p-4">
              <p className="text-gray-400 text-xs sm:text-sm">AI Suggestions</p>
              <p className="text-purple-400 text-xl sm:text-2xl font-bold">12</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;