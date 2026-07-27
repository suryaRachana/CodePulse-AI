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
    <section
      id="how-it-works"
      className="bg-[#0B0B12] px-12 py-20"
    >


      <div className="text-center">


        <h3 className="
          text-purple-400
          font-medium
          text-lg
        ">
          How It Works
        </h3>



        <h2 className="
          text-5xl
          font-bold
          text-white
          mt-4
        ">
          From Repository to Recommendations in Three Steps
        </h2>



        <p className="
          text-gray-400
          mt-5
          max-w-2xl
          mx-auto
          text-lg
        ">
          CodePulse AI turns static analysis into
          forward-looking intelligence.
        </p>


      </div>




      <div className="
        grid
        grid-cols-1
        md:grid-cols-3
        gap-8
        mt-12
      ">


        {steps.map((step, index) => (

          <div
            key={step.title}
            className="
              bg-[#161622]
              border border-purple-500/20
              rounded-2xl
              p-8
              hover:border-purple-500
              hover:-translate-y-2
              hover:shadow-xl
              hover:shadow-purple-500/10
              transition-all
              duration-300
            "
          >



            <div className="
              w-12
              h-12
              rounded-xl
              bg-purple-500/10
              border
              border-purple-500/20
              flex
              items-center
              justify-center
            ">

              <span className="
                text-purple-400
                text-xl
                font-bold
              ">
                0{index + 1}
              </span>

            </div>




            <h3 className="
              text-white
              text-2xl
              font-semibold
              mt-6
            ">
              {step.title}
            </h3>




            <p className="
              text-gray-400
              mt-4
              leading-relaxed
            ">
              {step.description}
            </p>



          </div>

        ))}


      </div>


    </section>
  );
}

export default HowItWorks;