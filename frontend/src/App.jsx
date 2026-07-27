import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

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


function App() {
  return (
    <BrowserRouter>

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


        {/* Sign In Page */}
        <Route
          path="/signin"
          element={<SignIn />}
        />


       {/* Get Started Page */} 
      <Route
  path="/get-started"
  element={<GetStarted />}
/>
<Route
  path="/dashboard"
  element={<Dashboard />}
/>

      </Routes>




    </BrowserRouter>
  );
}


export default App;
