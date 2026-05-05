import { LoginGate } from './login-gate';
import { HomeCtaSection } from '../(home)/home-cta-section';
import { HomeFeaturesSection } from '../(home)/home-features-section';
import { HomeHeroSection } from '../(home)/home-hero-section';
import { HomeHowItWorksSection } from '../(home)/home-how-it-works-section';
import { HomeShowcaseSection } from '../(home)/home-showcase-section';

const LoginPage = () => {
  return (
    <>
      <HomeHeroSection />
      <HomeFeaturesSection />
      <HomeHowItWorksSection />
      <HomeShowcaseSection />
      <HomeCtaSection />
      <LoginGate />
    </>
  );
};

export default LoginPage;
