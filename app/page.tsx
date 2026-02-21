import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { CoursesSection } from '@/components/courses-section';
import { InstructorsSection } from '@/components/instructors-section';
import { AboutSection } from '@/components/about-section';
import { ContactSection } from '@/components/contact-section';
import { Footer } from '@/components/footer';
import { TestEmailButton } from '@/components/test-email-button';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CoursesSection />
        <InstructorsSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
      {/* TODO: Remover después de probar emails */}
      <TestEmailButton />
    </div>
  );
}
