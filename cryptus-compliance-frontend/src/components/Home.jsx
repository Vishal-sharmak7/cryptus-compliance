import Hero from "./Hero";
import CTA from "./CTA";
import Features from "./Features";
import Howitswork from "./Howitswork";
import Workflow from "./Workflow";

const Home = () => {
  return (
    <div className="min-h-screen w-full relative">
      <Hero />
      <Howitswork />
      <Features />
      <Workflow />
      <CTA />
    </div>
  );
};

export default Home;