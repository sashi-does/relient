import { HeroSection } from "@/components/blocks/hero";

import Footer from "@/components/footer";
import Features from "@/components/blocks/bento-grid";
import Slicers from "@repo/ui/slicers";
import Faqs from "@/components/blocks/faqs";
import Link from "next/link";
import Plans from "@/components/subscription-plans";

export default function Home() {
  return (
    <div className="w-full min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="flex items-center justify-center w-full min-h-screen bg-gray-100 dark:bg-black p-4">
          <div className="w-full h-[600px] relative">
            3
            <Slicers />
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <HeroSection />
      </div>

      <Features />
      <Plans />
      <Faqs />
      <Footer />
      <footer className="w-full px-6 py-12 bg-transparent text-sm text-zinc-600 dark:text-[#F8F8F8]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 text-center">
          <div className="text-[#989898]">
            <p className="font-semibold mb-3 text-zinc-700 dark:text-[#cbcbcb]">
              Company
            </p>
            <p className="hover:underline cursor-pointer">About</p>
            <p className="hover:underline cursor-pointer">Careers</p>
            <p className="hover:underline cursor-pointer">Contact</p>
          </div>
          <div className="text-[#989898]">
            <p className="font-semibold mb-3 text-zinc-700 dark:text-[#cbcbcb]">
              Product
            </p>
            <p className="hover:underline cursor-pointer">Features</p>
            <p className="hover:underline cursor-pointer">Pricing</p>
            <p className="hover:underline cursor-pointer">Roadmap</p>
          </div>
          <div className="text-[#989898]">
            <p className="font-semibold mb-3 text-zinc-700 dark:text-[#cbcbcb]">
              Resources
            </p>
            <p className="hover:underline cursor-pointer">Blog</p>
            <p className="hover:underline cursor-pointer">Docs</p>
            <p className="hover:underline cursor-pointer">Community</p>
          </div>
          <div className="text-[#989898]">
            <p className="font-semibold mb-3 text-zinc-700 dark:text-[#cbcbcb]">
              Legal
            </p>
            <p className="hover:underline cursor-pointer">Privacy</p>
            <p className="hover:underline cursor-pointer">Terms</p>
            <p className="hover:underline cursor-pointer">Cookies</p>
          </div>
        </div>
        <p className="text-center mt-10 text-xs text-[#888] dark:text-[#999]">
          Built by{" "}
          <Link
            href="https://x.com/sashi_does"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-zinc-800 dark:hover:text-[#98ddff] text-white"
          >
            @sashi_does
          </Link>
        </p>
      </footer>
    </div>
  );
}
