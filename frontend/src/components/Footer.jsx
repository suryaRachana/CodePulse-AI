import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#080810] border-t border-purple-500/20 px-4 sm:px-8 lg:px-12 py-8 lg:py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:gap-10">
        {/* Logo & Description */}
        <div>
          <Link to="/" className="text-xl sm:text-2xl font-bold text-white inline-block">
            CodePulse <span className="text-purple-400">AI</span>
          </Link>

          <p className="text-gray-400 text-sm mt-3 sm:mt-4 max-w-sm leading-relaxed">
            AI-powered repository analysis for forward-thinking engineering teams.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white font-semibold mb-4 sm:mb-5 text-base sm:text-lg">
            Quick Links
          </h3>

          <ul className="space-y-2.5 sm:space-y-3 text-gray-400 text-sm">
            <li>
              <a href="#how-it-works" className="hover:text-purple-400 transition">
                How It Works
              </a>
            </li>
            <li>
              <a href="#features" className="hover:text-purple-400 transition">
                Features
              </a>
            </li>
            <li>
              <a href="#benefits" className="hover:text-purple-400 transition">
                Benefits
              </a>
            </li>
            <li>
              <Link to="/signin" className="hover:text-purple-400 transition">
                Sign In
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-purple-400 transition">
                Get Started
              </Link>
            </li>
          </ul>
        </div>

        {/* Copyright */}
        <div className="flex items-start sm:items-end md:justify-end">
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
            © {new Date().getFullYear()} CodePulse AI.
            <br />
            Built for developers who care about code health.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;