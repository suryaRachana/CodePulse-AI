function Benefits() {
  const benefits = [
    {
      title: "Faster Refactoring Decisions",
      description:
        "Get AI-powered recommendations to identify and fix code issues faster.",
    },
    {
      title: "Earlier Risk Detection",
      description:
        "Detect potential technical debt and code risks before they impact your project.",
    },
    {
      title: "Critical Path Coverage",
      description:
        "Gain visibility into important code areas and prioritize improvements effectively.",
    },
    {
      title: "Continuous Monitoring",
      description:
        "Track your code health continuously and maintain long-term software quality.",
    },
  ];

  return (
    <section id="benefits" className="bg-[#0B0B12] px-4 sm:px-8 lg:px-12 py-12 lg:py-20">
      <div className="text-center max-w-3xl mx-auto">
        <p className="text-purple-400 font-medium text-sm sm:text-base tracking-wider uppercase">
          BENEFITS
        </p>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 sm:mt-4 leading-tight">
          Measurable Impact on Your Codebase
        </h2>

        <p className="text-gray-400 mt-3 sm:mt-5 text-sm sm:text-base lg:text-lg leading-relaxed">
          Improve your software quality, reduce technical debt, and make smarter
          development decisions with AI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-10 lg:mt-12 max-w-5xl mx-auto">
        {benefits.map((benefit, index) => (
          <div
            key={benefit.title}
            className="bg-[#161622] border border-purple-500/20 rounded-2xl p-6 sm:p-8 hover:border-purple-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300"
          >
            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <span className="text-purple-400 text-base sm:text-xl font-bold">
                0{index + 1}
              </span>
            </div>

            <h3 className="text-white text-xl sm:text-2xl font-semibold mt-5 sm:mt-6">
              {benefit.title}
            </h3>

            <p className="text-gray-400 text-sm sm:text-base mt-3 sm:mt-4 leading-relaxed">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Benefits;