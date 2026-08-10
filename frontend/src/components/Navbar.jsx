import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#0B0B12] border-b border-[#27272A] px-12 py-5 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-white">
        CodePulse <span className="text-purple-400">AI</span>
      </Link>

      {/* Navigation Links */}
      <ul className="flex gap-10 text-gray-400">
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
          <a href="#tech-stack" className="hover:text-purple-400 transition">
            Tech Stack
          </a>
        </li>
      </ul>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <Link
          to="/signin"
          className="text-gray-300 border border-gray-700 px-5 py-2 rounded-lg hover:text-purple-400 hover:border-purple-500 transition font-medium"
        >
          Sign In
        </Link>

        <Link
          to="/register"
          className="bg-purple-500 text-white px-5 py-2 rounded-lg hover:bg-purple-600 transition font-medium"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;