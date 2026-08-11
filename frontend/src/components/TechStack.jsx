function TechStack() {
  const technologies = [
    {
      title: "React + TypeScript",
      category: "Frontend",
      description:
        "Modern component-based interface for building a fast and responsive experience.",
    },
    {
      title: "Tailwind CSS",
      category: "Styling",
      description:
        "Utility-first styling system for building scalable and consistent UI.",
    },
    {
      title: "FastAPI",
      category: "Backend",
      description:
        "High-performance Python backend for APIs and intelligent processing.",
    },
    {
      title: "PostgreSQL",
      category: "Database",
      description:
        "Reliable relational database for storing application data securely.",
    },
    {
      title: "ML Prediction Service",
      category: "AI Engine",
      description:
        "Machine learning models that analyze code patterns and predict technical debt.",
    },
    {
      title: "LLM Explanation Service",
      category: "AI Explanation",
      description:
        "Large language models that provide human-readable code improvement suggestions.",
    },
    {
      title: "Edge Functions",
      category: "Infrastructure",
      description:
        "Serverless functions for fast and scalable application operations.",
    },
    {
      title: "GitHub API",
      category: "Integration",
      description:
        "Connect repositories and retrieve code information for analysis.",
    },
  ];

  return (
    <section id="tech-stack" className="bg-[#0B0B12] px-4 sm:px-8 lg:px-12 py-12 lg:py-20">
      <div className="text-center max-w-3xl mx-auto">
        <p className="text-purple-400 font-medium text-sm sm:text-base">
          Technology Stack
        </p>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 sm:mt-4 leading-tight">
          Built on Modern, Scalable Architecture
        </h2>

        <p className="text-gray-400 mt-3 sm:mt-5 text-sm sm:text-base lg:text-lg leading-relaxed">
          A future-ready architecture designed to connect with your existing ML
          and backend services.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-10 lg:mt-14">
        {technologies.map((tech) => (
          <div
            key={tech.title}
            className="bg-[#161622] border border-purple-500/20 rounded-2xl p-5 sm:p-6 hover:border-purple-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <span className="inline-block text-purple-400 text-xs sm:text-sm bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full font-medium">
                {tech.category}
              </span>

              <h3 className="text-white text-lg sm:text-xl font-semibold mt-4 sm:mt-5">
                {tech.title}
              </h3>

              <p className="text-gray-400 text-xs sm:text-sm mt-3 sm:mt-4 leading-relaxed">
                {tech.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TechStack;