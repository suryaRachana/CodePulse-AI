function Features() {
  const features = [
    {
      title: "AI Repository Analysis",
      description:
        "Analyze your GitHub repositories and understand your code quality instantly.",
    },
    {
      title: "Technical Debt Detection",
      description:
        "Identify hidden code issues, complexity, and maintenance risks.",
    },
    {
      title: "Code Health Score",
      description:
        "Get a clear score that shows the overall health of your codebase.",
    },
    {
      title: "AI Refactoring Suggestions",
      description:
        "Receive intelligent recommendations to improve and optimize your code.",
    },
    {
      title: "Code Quality Metrics",
      description:
        "Track complexity, duplication, and maintainability metrics.",
    },
    {
      title: "Risk Prediction",
      description:
        "Predict future code problems before they become critical.",
    },
  ];


  return (
    <section 
      id="features"
      className="bg-[#0B0B12] px-12 py-20"
    >


      <div className="text-center">

        <p className="text-purple-400 font-medium">
          Key Features
        </p>


        <h2 className="
          text-5xl
          font-bold
          text-white
          mt-4
        ">
          Powerful Features for Better Code Quality
        </h2>


        <p className="
          text-gray-400
          mt-5
          max-w-2xl
          mx-auto
          text-lg
        ">
          Everything you need to understand, monitor,
          and improve your software quality with AI.
        </p>

      </div>



      <div className="
        grid
        grid-cols-1
        md:grid-cols-3
        gap-8
        mt-12
      ">


        {features.map((feature) => (

          <div
            key={feature.title}
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
              w-14
              h-14
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
              ">
                ✦
              </span>

            </div>



            <h3 className="
              text-white
              text-2xl
              font-semibold
              mt-6
            ">
              {feature.title}
            </h3>



            <p className="
              text-gray-400
              mt-4
              leading-relaxed
            ">
              {feature.description}
            </p>


          </div>

        ))}


      </div>


    </section>
  );
}

export default Features;