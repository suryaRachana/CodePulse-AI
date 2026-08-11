import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaChartLine,
  FaSearch,
  FaHistory,
  FaFileAlt,
  FaCog,
  FaBrain,
  FaLightbulb,
  FaTools,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

function Sidebar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const menuClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition min-h-[44px] ${
      isActive
        ? "bg-purple-600 text-white font-medium"
        : "text-gray-400 hover:bg-[#1F1F2E] hover:text-white"
    }`;

  const renderNavContent = () => (
    <>
      {/* Logo */}
      <div className="mb-8 lg:mb-10">
        <h1 className="text-2xl lg:text-3xl font-bold text-purple-400">
          CodePulse AI
        </h1>
        <p className="text-gray-500 text-xs lg:text-sm mt-1">
          Repository Intelligence Platform
        </p>
      </div>

      {/* Main Menu */}
      <h3 className="text-gray-500 uppercase text-xs mb-3 lg:mb-4 tracking-widest font-semibold">
        Navigation
      </h3>

      <div className="space-y-1.5 lg:space-y-2">
        <NavLink
          to="/dashboard"
          className={menuClass}
          onClick={() => setMobileMenuOpen(false)}
        >
          <FaChartLine />
          Dashboard
        </NavLink>

        <NavLink
          to="/repositories"
          className={menuClass}
          onClick={() => setMobileMenuOpen(false)}
        >
          <FaSearch />
          Analyze Repository
        </NavLink>

        <NavLink
          to="/history"
          className={menuClass}
          onClick={() => setMobileMenuOpen(false)}
        >
          <FaHistory />
          Analysis History
        </NavLink>

        <NavLink
          to="/reports"
          className={menuClass}
          onClick={() => setMobileMenuOpen(false)}
        >
          <FaFileAlt />
          Reports
        </NavLink>

        <NavLink
          to="/settings"
          className={menuClass}
          onClick={() => setMobileMenuOpen(false)}
        >
          <FaCog />
          Settings
        </NavLink>
      </div>

      {/* AI Tools */}
      <h3 className="text-gray-500 uppercase text-xs mt-8 lg:mt-10 mb-3 lg:mb-4 tracking-widest font-semibold">
        AI Tools
      </h3>

      <div className="space-y-1.5 lg:space-y-2">
        <NavLink
          to="/prediction"
          className={menuClass}
          onClick={() => setMobileMenuOpen(false)}
        >
          <FaBrain />
          AI Risk Prediction
        </NavLink>

        <NavLink
          to="/explainable-ai"
          className={menuClass}
          onClick={() => setMobileMenuOpen(false)}
        >
          <FaLightbulb />
          Explainable AI
        </NavLink>

        <NavLink
          to="/refactoring"
          className={menuClass}
          onClick={() => setMobileMenuOpen(false)}
        >
          <FaTools />
          AI Refactoring
        </NavLink>
      </div>

      {/* Logout */}
      <button
        onClick={() => {
          setMobileMenuOpen(false);
          handleLogout();
        }}
        className="mt-8 lg:mt-12 w-full flex items-center gap-3 text-red-400 hover:text-red-300 transition px-4 py-3 rounded-xl min-h-[44px] hover:bg-red-500/10"
      >
        <FaSignOutAlt />
        Logout
      </button>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar (lg screens and above) */}
      <aside className="hidden lg:block w-72 min-h-screen bg-[#11111A] border-r border-gray-800 p-6 flex-shrink-0">
        {renderNavContent()}
      </aside>

      {/* Mobile Top Header Bar (smaller than lg screens) */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#11111A] border-b border-gray-800 px-4 py-3 flex items-center justify-between w-full">
        <div>
          <h1 className="text-xl font-bold text-purple-400">CodePulse AI</h1>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-300 hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-gray-800 bg-[#161622]"
          aria-label="Toggle App Navigation"
        >
          {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
        </button>
      </div>

      {/* Mobile Drawer Slide-over Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-72 max-w-[80vw] bg-[#11111A] h-full p-6 overflow-y-auto z-50 border-r border-gray-800 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs uppercase text-purple-400 font-semibold tracking-wider">
                  Menu
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-white p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
              {renderNavContent()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;