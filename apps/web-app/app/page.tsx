import { HeroSection } from "@/components/blocks/hero";

import Footer from "@/components/footer";
import { Features } from "@/components/blocks/features";
import { BentoGridDemo } from "@/components/blocks/bento-grid";
import Slicers from '@repo/ui/slicers';
import Faqs from "@/components/blocks/faqs";

export default function Home() {
  return (
    <div className="w-full min-h-screen overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0 pointer-events-none">
      <div className="flex items-center justify-center w-full min-h-screen bg-gray-100 dark:bg-black p-4">
      <div className="w-full h-[600px] relative">3
        <Slicers />
      </div>
    </div>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10">
        <HeroSection />
      </div>
      <Features />
      <BentoGridDemo />
      <Faqs />
      <Footer />
    </div>
  );
}
