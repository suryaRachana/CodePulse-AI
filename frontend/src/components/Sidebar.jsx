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
} from "react-icons/fa";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const menuClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
      isActive
        ? "bg-purple-600 text-white"
        : "text-gray-400 hover:bg-[#1F1F2E] hover:text-white"
    }`;

  return (
    <aside className="w-72 min-h-screen bg-[#11111A] border-r border-gray-800 p-6">

      {/* Logo */}

      <div className="mb-10">

        <h1 className="text-3xl font-bold text-purple-400">
          CodePulse AI
        </h1>

        <p className="text-gray-500 text-sm mt-2">
          Repository Intelligence Platform
        </p>

      </div>

      {/* Main Menu */}

      <h3 className="text-gray-500 uppercase text-xs mb-4 tracking-widest">
        Navigation
      </h3>

      <div className="space-y-2">

        <NavLink to="/dashboard" className={menuClass}>
          <FaChartLine />
          Dashboard
        </NavLink>

        <NavLink to="/repositories" className={menuClass}>
          <FaSearch />
          Analyze Repository
        </NavLink>

        <NavLink to="/history" className={menuClass}>
          <FaHistory />
          Analysis History
        </NavLink>

        <NavLink to="/reports" className={menuClass}>
          <FaFileAlt />
          Reports
        </NavLink>

        <NavLink to="/settings" className={menuClass}>
          <FaCog />
          Settings
        </NavLink>

      </div>

      {/* AI Tools */}

      <h3 className="text-gray-500 uppercase text-xs mt-10 mb-4 tracking-widest">
        AI Tools
      </h3>

      <div className="space-y-2">

        <NavLink to="/prediction" className={menuClass}>
          <FaBrain />
          AI Risk Prediction
        </NavLink>

        <NavLink to="/explainable-ai" className={menuClass}>
          <FaLightbulb />
          Explainable AI
        </NavLink>

        <NavLink to="/refactoring" className={menuClass}>
          <FaTools />
          AI Refactoring
        </NavLink>

      </div>

      {/* Logout */}

      <button
        onClick={handleLogout}
        className="mt-12 flex items-center gap-3 text-red-400 hover:text-red-300 transition"
      >
        <FaSignOutAlt />
        Logout
      </button>

    </aside>
  );
}

export default Sidebar;