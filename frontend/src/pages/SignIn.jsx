import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";

function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    location.state?.registeredMessage || ""
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      const formData = new URLSearchParams();
      const normalizedEmail = email.trim().toLowerCase();

      formData.append("username", normalizedEmail);
      formData.append("password", password);

      const response = await API.post("/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      localStorage.setItem("token", response.data.access_token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.data?.detail) {
        setErrorMessage(error.response.data.detail);
      } else if (error.request) {
        setErrorMessage("Network error. Unable to connect to backend server.");
      } else {
        setErrorMessage("Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#0B0B12] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-[#161622] border border-purple-500/20 rounded-2xl p-8 shadow-xl shadow-purple-500/10">
        <h1 className="text-3xl font-bold text-white text-center">
          CodePulse <span className="text-purple-400">AI</span>
        </h1>

        <h2 className="text-white text-2xl font-semibold text-center mt-6">
          Welcome Back
        </h2>

        <p className="text-gray-400 text-center mt-2 text-sm">
          Sign in to continue analyzing your codebase
        </p>

        {/* Success Banner */}
        {successMessage && (
          <div className="mt-6 bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-xl p-4 text-center font-medium">
            {successMessage}
          </div>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <div className="mt-6 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl p-4 text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0B0B12] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition"
              required
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0B0B12] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-purple-500 text-white py-3 rounded-xl hover:bg-purple-600 font-semibold transition disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-purple-400 hover:underline font-medium">
            Create Account
          </Link>
        </div>
      </div>
    </section>
  );
}

export default SignIn;