import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Benefits from "./components/Benefits";
import HowItWorks from "./components/HowItWorks";
import TechStack from "./components/TechStack";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

import SignIn from "./pages/SignIn";
import GetStarted from "./pages/GetStarted";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Prediction from "./pages/Prediction";
import History from "./pages/History";
import HistoryDetails from "./pages/HistoryDetails";
import Repositories from "./pages/Repositories";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import ExplainableAI from "./pages/ExplainableAI";
import Refactoring from "./pages/Refactoring";
function App() {
  return (
    <Routes>

      {/* Landing Page */}
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <Hero />
            <HowItWorks />
            <Features />
            <Benefits />
            <TechStack />
            <CTA />
            <Footer />
          </>
        }
      />

      {/* Authentication */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/register" element={<Register />} />
      <Route path="/get-started" element={<GetStarted />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Prediction */}
      <Route path="/prediction" element={<Prediction />} />

      {/* History */}
      <Route path="/history" element={<History />} />

      <Route path="/history/:id" element={<HistoryDetails />} />
<Route path="/repositories" element={<Repositories />} />

<Route path="/reports" element={<Reports />} />
<Route path="/settings" element={<Settings />} />

<Route path="/refactoring" element={<Refactoring />} />
    </Routes>
  );
}

export default App;