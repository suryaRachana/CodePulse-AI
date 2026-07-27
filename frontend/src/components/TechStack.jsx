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
    <section
      id="tech-stack"
      className="bg-[#0B0B12] px-12 py-20"
    >


      <div className="text-center">


        <p className="
          text-purple-400
          font-medium
          text-lg
        ">
          Technology Stack
        </p>



        <h2 className="
          text-5xl
          font-bold
          text-white
          mt-4
        ">
          Built on Modern,
          <br />
          Scalable Architecture
        </h2>



        <p className="
          text-gray-400
          mt-5
          max-w-2xl
          mx-auto
          text-lg
        ">
          A future-ready architecture designed to connect
          with your existing ML and backend services.
        </p>


      </div>




      <div className="
        grid
        grid-cols-1
        md:grid-cols-4
        gap-6
        mt-14
      ">


        {technologies.map((tech) => (

          <div
            key={tech.title}
            className="
              bg-[#161622]
              border border-purple-500/20
              rounded-2xl
              p-6
              hover:border-purple-500
              hover:-translate-y-2
              hover:shadow-xl
              hover:shadow-purple-500/10
              transition-all
              duration-300
            "
          >



            <span className="
              inline-block
              text-purple-400
              text-sm
              bg-purple-500/10
              border
              border-purple-500/20
              px-3
              py-1
              rounded-full
            ">
              {tech.category}
            </span>




            <h3 className="
              text-white
              text-xl
              font-semibold
              mt-5
            ">
              {tech.title}
            </h3>




            <p className="
              text-gray-400
              text-sm
              mt-4
              leading-relaxed
            ">
              {tech.description}
            </p>



          </div>

        ))}


      </div>


    </section>
  );
}

export default TechStack;