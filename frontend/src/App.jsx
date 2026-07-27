import Features from "./components/Features";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Benefits from "./components/Benefits";
import TechStack from "./components/TechStack";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import HowItWorks from "./components/HowItWorks";

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks/>
      <Features />
      <Benefits />
      <TechStack/>
      <CTA />
      <Footer/>

    </>
  );
}

export default App;