import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#0B0B12] border-b border-[#27272A] px-4 sm:px-8 lg:px-12 py-4 lg:py-5">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl sm:text-2xl font-bold text-white">
          CodePulse <span className="text-purple-400">AI</span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex items-center gap-6 lg:gap-10 text-gray-400 text-sm lg:text-base">
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

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/signin"
            className="text-gray-300 border border-gray-700 px-4 py-2 rounded-lg hover:text-purple-400 hover:border-purple-500 transition font-medium text-sm lg:text-base min-h-[44px] flex items-center"
          >
            Sign In
          </Link>

          <Link
            to="/register"
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition font-medium text-sm lg:text-base min-h-[44px] flex items-center"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-300 hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown / Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-gray-800 flex flex-col gap-4 animate-fadeIn">
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="text-gray-300 hover:text-purple-400 transition py-2"
          >
            How It Works
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="text-gray-300 hover:text-purple-400 transition py-2"
          >
            Features
          </a>
          <a
            href="#benefits"
            onClick={() => setMobileMenuOpen(false)}
            className="text-gray-300 hover:text-purple-400 transition py-2"
          >
            Benefits
          </a>
          <a
            href="#tech-stack"
            onClick={() => setMobileMenuOpen(false)}
            className="text-gray-300 hover:text-purple-400 transition py-2"
          >
            Tech Stack
          </a>

          <div className="flex flex-col gap-3 pt-2 border-t border-gray-800/60">
            <Link
              to="/signin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center text-gray-300 border border-gray-700 py-2.5 rounded-lg hover:text-purple-400 font-medium min-h-[44px] flex items-center justify-center"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-purple-500 text-white py-2.5 rounded-lg hover:bg-purple-600 font-medium min-h-[44px] flex items-center justify-center"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;