import { HeroSection } from "@/components/blocks/hero";
import Slicers from "@repo/ui/slicers";
import Footer from "@/components/footer";
import { Features } from "@/components/blocks/features";
import { BentoGridDemo } from "@/components/blocks/bento-grid";

export default function Home() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Slicers />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10">
        <HeroSection />
      </div>
      <Features />
      <BentoGridDemo />
      <Footer />
    </div>
  );
}
