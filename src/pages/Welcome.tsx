
import { Separator } from '@/components/ui/separator';
import WelcomeHeader from '@/components/welcome/WelcomeHeader';
import BackgroundAnimation from '@/components/welcome/BackgroundAnimation';
import HeroSection from '@/components/welcome/HeroSection';
import AboutSection from '@/components/welcome/AboutSection';
import WelcomeFooter from '@/components/welcome/WelcomeFooter';

const Welcome = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Background with gradient */}
      <BackgroundAnimation />

      {/* Header */}
      <WelcomeHeader />

      {/* Hero Section */}
      <HeroSection />

      <Separator className="container" />
      
      {/* About Section */}
      <AboutSection />

      <div className="flex-grow"></div>
      
      {/* Footer */}
      <WelcomeFooter />
    </div>
  );
};

export default Welcome;
