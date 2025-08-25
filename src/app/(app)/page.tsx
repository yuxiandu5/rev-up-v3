import HeroSection from "@/components/home-page/HeroSection";
import FeaturesSection from "@/components/home-page/FeaturesSection";
import SupportedBrandsSection from "@/components/home-page/SupportedBrandsSection";
import TestimonialsSection from "@/components/home-page/TestimonialsSection";
import Footer from "@/components/home-page/Footer";

export default function Home() {
  return (
    <main className="min-h-screen w-full">
      <HeroSection />
      <FeaturesSection />
      <SupportedBrandsSection />
      <TestimonialsSection />
      <Footer />
    </main>
  );
}
