import { HeroSection } from "@/components/sections/hero-section";
import { ContactSection } from "@/components/sections/contact-section";
import { StudioSection } from "@/components/sections/studio-section";
import { WorksSection } from "@/components/sections/works-section";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <WorksSection />
      <StudioSection />
      <ContactSection />
    </main>
  );
}
