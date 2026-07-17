import { lazy, Suspense } from "react";
import { Header } from "./components/header";
import { HeroSection } from "./components/hero-section";
import { DeferredSection } from "./components/deferred-section";

const HowItWorks = lazy(() =>
  import("./components/how-it-works").then((module) => ({ default: module.HowItWorks })),
);
const ImpactResults = lazy(() =>
  import("./components/impact-results").then((module) => ({ default: module.ImpactResults })),
);
const LogoSlider = lazy(() =>
  import("./components/logo-slider").then((module) => ({ default: module.LogoSlider })),
);
const Testimonials = lazy(() =>
  import("./components/testimonials").then((module) => ({ default: module.Testimonials })),
);
const FaqSection = lazy(() =>
  import("./components/faq-section").then((module) => ({ default: module.FaqSection })),
);
const FinalCta = lazy(() =>
  import("./components/final-cta").then((module) => ({ default: module.FinalCta })),
);
const Footer = lazy(() =>
  import("./components/footer").then((module) => ({ default: module.Footer })),
);

export default function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Header />
      <main>
        <HeroSection />
        <Suspense fallback={null}>
          <DeferredSection id="how-it-works-shell" minHeight="2800px">
            <HowItWorks />
          </DeferredSection>
          <DeferredSection minHeight="900px">
            <ImpactResults />
          </DeferredSection>
          <DeferredSection minHeight="420px">
            <LogoSlider />
          </DeferredSection>
          <DeferredSection minHeight="760px">
            <Testimonials />
          </DeferredSection>
          <DeferredSection minHeight="760px">
            <FaqSection />
          </DeferredSection>
          <DeferredSection minHeight="520px">
            <FinalCta />
          </DeferredSection>
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <DeferredSection minHeight="360px">
          <Footer />
        </DeferredSection>
      </Suspense>
    </div>
  );
}
