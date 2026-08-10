import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter a password.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const normalizedEmail = email.trim().toLowerCase();

      // 1. Register User
      await API.post("/register", {
        name: name.trim(),
        email: normalizedEmail,
        password: password,
      });

      // 2. Auto-login using OAuth2 password form payload
      const formData = new URLSearchParams();
      formData.append("username", normalizedEmail);
      formData.append("password", password);

      const loginResponse = await API.post("/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      // 3. Store token and redirect directly to /dashboard
      if (loginResponse.data?.access_token) {
        localStorage.setItem("token", loginResponse.data.access_token);
        navigate("/dashboard");
      } else {
        navigate("/signin", {
          state: {
            registeredMessage: "Account created successfully! Please sign in with your password.",
          },
        });
      }
    } catch (error) {
      console.error("Registration/Login error:", error);
      if (error.response?.data?.detail) {
        setErrorMessage(error.response.data.detail);
      } else if (error.request) {
        setErrorMessage("Network error. Unable to connect to backend server.");
      } else {
        setErrorMessage("Registration or auto-login failed. Please try signing in manually.");
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
          Create Account
        </h2>

        <p className="text-gray-400 text-center mt-2 text-sm">
          Start analyzing your repository health with AI
        </p>

        {/* Error Banner */}
        {errorMessage && (
          <div className="mt-6 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl p-4 text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleRegister} className="mt-6 space-y-4">
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Surya Rachana"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0B0B12] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition"
              required
            />
          </div>

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

          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#0B0B12] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-purple-500 text-white py-3 rounded-xl hover:bg-purple-600 font-semibold transition disabled:opacity-50"
          >
            {loading ? "Creating Account & Logging In..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/signin" className="text-purple-400 hover:underline font-medium">
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Register;