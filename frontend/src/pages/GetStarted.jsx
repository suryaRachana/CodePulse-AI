function GetStarted() {
  return (
    <section className="min-h-screen bg-[#0B0B12] flex items-center justify-center px-6">


      <div
        className="
          w-full
          max-w-lg
          bg-[#161622]
          border border-purple-500/20
          rounded-2xl
          p-10
          shadow-xl
          shadow-purple-500/10
        "
      >


        <h1 className="
          text-3xl
          font-bold
          text-white
          text-center
        ">
          CodePulse{" "}
          <span className="text-purple-400">
            AI
          </span>
        </h1>



        <h2 className="
          text-2xl
          font-semibold
          text-white
          text-center
          mt-8
        ">
          Start Analyzing Your Codebase
        </h2>



        <p className="
          text-gray-400
          text-center
          mt-3
        ">
          Connect your GitHub repository and
          discover technical debt risks instantly.
        </p>




        <div className="mt-8">


          <input
            type="text"
            placeholder="Enter GitHub Repository URL"
            className="
              w-full
              bg-[#0B0B12]
              border border-gray-700
              rounded-xl
              px-4
              py-3
              text-white
              outline-none
              focus:border-purple-500
            "
          />



          <button
            className="
              w-full
              mt-5
              bg-purple-500
              text-white
              py-3
              rounded-xl
              hover:bg-purple-600
              transition
            "
          >
            Analyze Repository →
          </button>


        </div>



      </div>


    </section>
  );
}

export default GetStarted;