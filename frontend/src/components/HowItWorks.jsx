function HowItWorks() {
  const steps = [
    {
      title: "Connect Your Repository",
      description:
        "Paste a GitHub URL. CodePulse AI clones and parses your codebase, extracting structured and complexity metrics in seconds.",
    },
    {
      title: "AI Analyzes Your Code",
      description:
        "CodePulse AI analyzes your codebase and identifies technical debt, risks, and improvement opportunities.",
    },
    {
      title: "Get Intelligent Recommendations",
      description:
        "Receive actionable insights and AI-powered suggestions to improve your code quality.",
    },
  ];

  return (
    <section id="how-it-works" className="bg-[#0B0B12] px-4 sm:px-8 lg:px-12 py-12 lg:py-20">
      <div className="text-center max-w-3xl mx-auto">
        <h3 className="text-purple-400 font-medium text-sm sm:text-base">
          How It Works
        </h3>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 sm:mt-4 leading-tight">
          From Repository to Recommendations in Three Steps
        </h2>

        <p className="text-gray-400 mt-3 sm:mt-5 text-sm sm:text-base lg:text-lg leading-relaxed">
          CodePulse AI turns static analysis into forward-looking intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-10 lg:mt-12">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="bg-[#161622] border border-purple-500/20 rounded-2xl p-6 sm:p-8 hover:border-purple-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <span className="text-purple-400 text-base sm:text-xl font-bold">
                  0{index + 1}
                </span>
              </div>

              <h3 className="text-white text-xl sm:text-2xl font-semibold mt-5 sm:mt-6">
                {step.title}
              </h3>

              <p className="text-gray-400 text-sm sm:text-base mt-3 sm:mt-4 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;