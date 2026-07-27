function SignIn() {
  return (
    <section className="min-h-screen bg-[#0B0B12] flex items-center justify-center px-6">

      <div className="
        w-full
        max-w-md
        bg-[#161622]
        border border-purple-500/20
        rounded-2xl
        p-8
        shadow-xl
        shadow-purple-500/10
      ">

        <h1 className="text-3xl font-bold text-white text-center">
          CodePulse{" "}
          <span className="text-purple-400">
            AI
          </span>
        </h1>


        <h2 className="
          text-white
          text-2xl
          font-semibold
          text-center
          mt-8
        ">
          Welcome Back
        </h2>


        <p className="
          text-gray-400
          text-center
          mt-3
        ">
          Sign in to continue analyzing your codebase
        </p>


        <div className="mt-8 space-y-5">

          <input
            type="email"
            placeholder="Email address"
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


          <input
            type="password"
            placeholder="Password"
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
              bg-purple-500
              text-white
              py-3
              rounded-xl
              hover:bg-purple-600
              transition
            "
          >
            Sign In
          </button>


          <div className="flex items-center gap-3">

            <div className="h-px bg-gray-700 flex-1"></div>

            <span className="text-gray-500 text-sm">
              OR
            </span>

            <div className="h-px bg-gray-700 flex-1"></div>

          </div>


          <button
            className="
              w-full
              border
              border-gray-700
              text-gray-300
              py-3
              rounded-xl
              hover:border-purple-500
              hover:text-white
              transition
            "
          >
            Continue with Google
          </button>


        </div>


      </div>


    </section>
  );
}

export default SignIn;