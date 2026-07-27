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
    <section 
      id="benefits"
      className="bg-[#0B0B12] px-12 py-20"
    >


      <div className="text-center">


        <p className="
          text-purple-400
          font-medium
          text-lg
        ">
          BENEFITS
        </p>



        <h2 className="
          text-5xl
          font-bold
          text-white
          mt-4
        ">
          Measurable Impact on Your Codebase
        </h2>



        <p className="
          text-gray-400
          mt-5
          max-w-2xl
          mx-auto
          text-lg
        ">
          Improve your software quality, reduce technical debt,
          and make smarter development decisions with AI.
        </p>


      </div>




      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-8
        mt-12
        max-w-5xl
        mx-auto
      ">


        {benefits.map((benefit, index) => (

          <div
            key={benefit.title}
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
              {benefit.title}
            </h3>




            <p className="
              text-gray-400
              mt-4
              leading-relaxed
            ">
              {benefit.description}
            </p>



          </div>

        ))}


      </div>


    </section>
  );
}

export default Benefits;