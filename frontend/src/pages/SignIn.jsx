import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
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

  const handleGoogleSuccess = async (credentialResponse) => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!credentialResponse.credential) {
      setErrorMessage("Google authentication failed. No credential received.");
      return;
    }

    try {
      setLoading(true);
      const response = await API.post("/auth/google", {
        id_token: credentialResponse.credential,
      });

      if (response.data?.access_token) {
        localStorage.setItem("token", response.data.access_token);
        navigate("/dashboard");
      } else {
        setErrorMessage("Failed to obtain authentication token from server.");
      }
    } catch (error) {
      console.error("Google login error:", error);
      if (error.response?.data?.detail) {
        setErrorMessage(error.response.data.detail);
      } else if (error.request) {
        setErrorMessage("Network error. Unable to connect to backend server.");
      } else {
        setErrorMessage("Google authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErrorMessage("Google Sign-In was cancelled or failed.");
  };

  return (
    <section className="min-h-screen bg-[#0B0B12] flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      <div className="w-full max-w-md bg-[#161622] border border-purple-500/20 rounded-2xl p-6 sm:p-8 shadow-xl shadow-purple-500/10">
        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">
          CodePulse <span className="text-purple-400">AI</span>
        </h1>

        <h2 className="text-white text-xl sm:text-2xl font-semibold text-center mt-4 sm:mt-6">
          Welcome Back
        </h2>

        <p className="text-gray-400 text-center mt-2 text-xs sm:text-sm">
          Sign in to continue analyzing your codebase
        </p>

        {/* Success Banner */}
        {successMessage && (
          <div className="mt-4 sm:mt-6 bg-green-500/10 border border-green-500/30 text-green-400 text-xs sm:text-sm rounded-xl p-3.5 sm:p-4 text-center font-medium">
            {successMessage}
          </div>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <div className="mt-4 sm:mt-6 bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm rounded-xl p-3.5 sm:p-4 text-center">
            {errorMessage}
          </div>
        )}

        {/* Google Authentication */}
        <div className="mt-6 flex justify-center w-full min-h-[44px]">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            theme="filled_black"
            shape="pill"
            size="large"
            text="continue_with"
            width="100%"
          />
        </div>

        {/* Divider */}
        <div className="my-5 flex items-center">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="px-3 text-gray-400 text-xs uppercase tracking-wider">Or email</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0B0B12] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition text-sm min-h-[44px]"
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
              className="w-full bg-[#0B0B12] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition text-sm min-h-[44px]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-purple-500 text-white py-3 rounded-xl hover:bg-purple-600 font-semibold transition disabled:opacity-50 min-h-[44px] flex items-center justify-center text-sm sm:text-base"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs sm:text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-purple-400 hover:underline font-medium p-1 inline-block">
            Create Account
          </Link>
        </div>
      </div>
    </section>
  );
}

export default SignIn;