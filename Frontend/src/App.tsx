import React from "react";
import { SearchProvider } from "./contexts/SearchContext";
import Hero from "./components/Hero/Hero";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import Features from "./components/Features/Features";
import RecipePreview from "./components/RecipePreview/RecipePreview";
import Testimonials from "./components/Testimonials/Testimonials";
import CallToAction from "./components/CallToAction/CallToAction";
import Navigation from "./components/Navigation/Navigation";

function App() {
  return (
    <SearchProvider>
      <div className="min-h-screen bg-white overflow-x-hidden">
        <Navigation />
        <Hero />
        <HowItWorks />
        <Features />
        <RecipePreview />
        <Testimonials />
        <CallToAction />
      </div>
    </SearchProvider>
  );
}

export default App;
