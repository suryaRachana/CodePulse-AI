function Footer() {
  return (
    <footer className="
      bg-[#080810]
      border-t border-purple-500/20
      px-12
      py-12
    ">


      <div className="
        grid
        grid-cols-1
        md:grid-cols-3
        gap-10
      ">


        {/* Logo & Description */}
        <div>


          <h2 className="
            text-2xl
            font-bold
            text-white
          ">
            CodePulse{" "}
            <span className="text-purple-400">
              AI
            </span>
          </h2>



          <p className="
            text-gray-400
            mt-4
            max-w-sm
            leading-relaxed
          ">
            AI-powered repository analysis for
            forward-thinking engineering teams.
          </p>


        </div>




        {/* Links */}
        <div>


          <h3 className="
            text-white
            font-semibold
            mb-5
            text-lg
          ">
            Quick Links
          </h3>



          <ul className="
            space-y-3
            text-gray-400
          ">


            <li className="
              hover:text-purple-400
              cursor-pointer
              transition
            ">
              How It Works
            </li>


            <li className="
              hover:text-purple-400
              cursor-pointer
              transition
            ">
              Features
            </li>


            <li className="
              hover:text-purple-400
              cursor-pointer
              transition
            ">
              Benefits
            </li>


            <li className="
              hover:text-purple-400
              cursor-pointer
              transition
            ">
              Sign In
            </li>


            <li className="
              hover:text-purple-400
              cursor-pointer
              transition
            ">
              Get Started
            </li>


          </ul>


        </div>





        {/* Copyright */}
        <div className="
          flex
          items-end
          md:justify-end
        ">


          <p className="
            text-gray-400
            text-sm
            leading-relaxed
          ">
            © 2026 CodePulse AI.
            <br />
            Built for developers who care about code health.
          </p>


        </div>



      </div>


    </footer>
  );
}

export default Footer;