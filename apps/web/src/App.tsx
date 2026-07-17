import { Header } from "./components/header";
import { HeroSection } from "./components/hero-section";
import { HowItWorks } from "./components/how-it-works";
import { ImpactResults } from "./components/impact-results";
import { LogoSlider } from "./components/logo-slider";
import { Testimonials } from "./components/testimonials";
import { FaqSection } from "./components/faq-section";
import { FinalCta } from "./components/final-cta";
import { Footer } from "./components/footer";

export default function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Header />
      <main>
        <HeroSection />
        <HowItWorks />
        <ImpactResults />
        <LogoSlider />
        <Testimonials />
        <FaqSection />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
