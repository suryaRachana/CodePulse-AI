function Dashboard() {
  return (
    <section className="min-h-screen bg-[#0B0B12] px-12 py-10">


      <h1 className="
        text-4xl
        font-bold
        text-white
      ">
        CodePulse{" "}
        <span className="text-purple-400">
          AI Dashboard
        </span>
      </h1>



      <p className="
        text-gray-400
        mt-3
      ">
        Monitor your repository health and AI-powered insights.
      </p>




      <div className="
        grid
        grid-cols-1
        md:grid-cols-3
        gap-6
        mt-10
      ">


        <div className="
          bg-[#161622]
          border border-purple-500/20
          rounded-2xl
          p-6
        ">

          <p className="text-gray-400">
            Repository Health Score
          </p>

          <h2 className="
            text-4xl
            font-bold
            text-purple-400
            mt-4
          ">
            92%
          </h2>

        </div>




        <div className="
          bg-[#161622]
          border border-purple-500/20
          rounded-2xl
          p-6
        ">

          <p className="text-gray-400">
            Technical Debt
          </p>

          <h2 className="
            text-3xl
            font-bold
            text-white
            mt-4
          ">
            Low
          </h2>

        </div>





        <div className="
          bg-[#161622]
          border border-purple-500/20
          rounded-2xl
          p-6
        ">

          <p className="text-gray-400">
            Risk Level
          </p>

          <h2 className="
            text-3xl
            font-bold
            text-purple-400
            mt-4
          ">
            Medium
          </h2>

        </div>


      </div>




      <div className="
        mt-10
        bg-[#161622]
        border border-purple-500/20
        rounded-2xl
        p-8
      ">


        <h2 className="
          text-2xl
          font-semibold
          text-white
        ">
          AI Recommendations
        </h2>



        <ul className="
          mt-5
          space-y-3
          text-gray-400
        ">

          <li>
            ✦ Reduce duplicate code
          </li>

          <li>
            ✦ Improve function complexity
          </li>

          <li>
            ✦ Refactor unused modules
          </li>

        </ul>


      </div>


    </section>
  );
}

export default Dashboard;