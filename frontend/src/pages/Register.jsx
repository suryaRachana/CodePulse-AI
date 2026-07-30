import { useState } from "react";
import API from "../services/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await API.post("/register", {
        name: name,
        email: email,
        password: password,
      });

      alert(response.data.message);

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

    } catch (error) {
      console.error(error);
      alert("Registration Failed");
    }
  };

  return (
    <section className="min-h-screen bg-[#0B0B12] flex items-center justify-center px-6">

      <div
        className="
          w-full
          max-w-md
          bg-[#161622]
          border border-purple-500/20
          rounded-2xl
          p-8
          shadow-xl
          shadow-purple-500/10
        "
      >

        <h1 className="text-3xl font-bold text-white text-center">
          CodePulse <span className="text-purple-400">AI</span>
        </h1>

        <h2 className="text-white text-2xl font-semibold text-center mt-8">
          Create Account
        </h2>

        <p className="text-gray-400 text-center mt-3">
          Start analyzing your projects with AI
        </p>

        <div className="mt-8 space-y-5">

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="
              w-full
              bg-[#0B0B12]
              border border-gray-700
              rounded-xl
              px-4
              py-3
              text-white
              outline-none
              focus:border-purple-500
            "
          />

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full
              bg-[#0B0B12]
              border border-gray-700
              rounded-xl
              px-4
              py-3
              text-white
              outline-none
              focus:border-purple-500
            "
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full
              bg-[#0B0B12]
              border border-gray-700
              rounded-xl
              px-4
              py-3
              text-white
              outline-none
              focus:border-purple-500
            "
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="
              w-full
              bg-[#0B0B12]
              border border-gray-700
              rounded-xl
              px-4
              py-3
              text-white
              outline-none
              focus:border-purple-500
            "
          />

          <button
            onClick={handleRegister}
            className="
              w-full
              bg-purple-500
              text-white
              py-3
              rounded-xl
              hover:bg-purple-600
              transition
            "
          >
            Create Account
          </button>

        </div>

      </div>

    </section>
  );
}

export default Register;