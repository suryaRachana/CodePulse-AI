import { useNavigate } from "react-router-dom";

function CTA() {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  return (
    <section className="bg-[#0B0B12] px-12 py-24">
      <div className="max-w-5xl mx-auto text-center bg-[#161622] border border-purple-500/20 rounded-3xl p-14 relative overflow-hidden shadow-xl shadow-purple-500/10">
        {/* Background Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/20 blur-3xl rounded-full"></div>

        <div className="relative z-10">
          <span className="inline-block px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm">
            Start your first analysis in minutes
          </span>

          <h2 className="text-5xl font-bold text-white mt-6 leading-tight">
            Ready to See the Future of Your Codebase?
          </h2>

          <p className="text-gray-400 text-lg mt-6 max-w-3xl mx-auto leading-relaxed">
            Connect a repository and let CodePulse AI surface risks and
            recommendations your team can act on today.
          </p>

          <div className="flex justify-center gap-5 mt-10">
            <button
              onClick={handleGetStartedClick}
              className="bg-purple-500 text-white px-7 py-3 rounded-xl shadow-lg shadow-purple-500/20 hover:bg-purple-600 hover:-translate-y-1 transition-all font-medium"
            >
              Get Started Free →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;