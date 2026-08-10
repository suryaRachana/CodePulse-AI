import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Settings() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signin");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await API.get("/me");
        setUserProfile(response.data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          setError("Session expired or unauthorized. Please sign in again.");
        } else {
          setError("Failed to load user profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  return (
    <section className="min-h-screen bg-[#0B0B12] px-10 py-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-2">
            Manage your account and application preferences.
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-lg transition"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="mt-10 bg-[#161622] border border-gray-700 rounded-2xl p-8 text-center">
          <p className="text-gray-400 text-lg">Loading profile data...</p>
        </div>
      ) : error ? (
        <div className="mt-10 bg-[#161622] border border-red-500/30 rounded-2xl p-8 flex items-center justify-between">
          <p className="text-red-400">{error}</p>
          {error.includes("sign in") && (
            <button
              onClick={() => navigate("/signin")}
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-lg transition"
            >
              Sign In
            </button>
          )}
        </div>
      ) : (
        /* Settings Cards */
        <div className="grid grid-cols-1 gap-8 mt-10">
          {/* User Profile */}
          <div className="bg-[#161622] border border-gray-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white">User Profile</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div>
                <label className="text-gray-400 text-sm">Full Name</label>
                <input
                  type="text"
                  value={userProfile?.name || "--"}
                  readOnly
                  className="w-full mt-2 bg-[#0B0B12] border border-gray-700 rounded-lg px-4 py-3 text-white outline-none"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm">Email Address</label>
                <input
                  type="email"
                  value={userProfile?.email || "--"}
                  readOnly
                  className="w-full mt-2 bg-[#0B0B12] border border-gray-700 rounded-lg px-4 py-3 text-white outline-none"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm">Member Since</label>
                <input
                  type="text"
                  value={
                    userProfile?.created_at
                      ? new Date(userProfile.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "--"
                  }
                  readOnly
                  className="w-full mt-2 bg-[#0B0B12] border border-gray-700 rounded-lg px-4 py-3 text-white outline-none"
                />
              </div>
            </div>

            <button className="mt-8 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition">
              Change Password
            </button>
          </div>
        </div>
      )}

      {/* Appearance */}
      <div className="bg-[#161622] border border-gray-700 rounded-2xl p-8 mt-8">
        <h2 className="text-2xl font-bold text-white">Appearance</h2>
        <p className="text-gray-400 mt-2">
          Customize your workspace appearance.
        </p>

        <div className="flex justify-between items-center mt-8">
          <div>
            <h3 className="text-white font-semibold">Dark Theme</h3>
            <p className="text-gray-400 text-sm mt-1">
              Enable dark mode for better coding experience.
            </p>
          </div>

          <button className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-lg transition">
            Enabled
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-[#161622] border border-gray-700 rounded-2xl p-8 mt-8">
        <h2 className="text-2xl font-bold text-white">Notifications</h2>
        <p className="text-gray-400 mt-2">
          Manage how you receive updates and alerts.
        </p>

        <div className="space-y-6 mt-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-white font-semibold">Email Notifications</h3>
              <p className="text-gray-400 text-sm mt-1">
                Receive repository analysis reports via email.
              </p>
            </div>
            <button className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg transition">
              Enabled
            </button>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-white font-semibold">AI Analysis Alerts</h3>
              <p className="text-gray-400 text-sm mt-1">
                Notify when AI detects high-risk repositories.
              </p>
            </div>
            <button className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg transition">
              Enabled
            </button>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-white font-semibold">Security Alerts</h3>
              <p className="text-gray-400 text-sm mt-1">
                Receive alerts for suspicious account activity.
              </p>
            </div>
            <button className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition">
              Disabled
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Settings;