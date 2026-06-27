import { HomeCtaSection } from './home-cta-section';
import { HomeHeroSection } from './home-hero-section';
import { HomeRenewalCareerSection } from './home-renewal-career-section';
import { HomeRenewalFeaturesSection } from './home-renewal-features-section';
import { HomeRenewalHowItWorksSection } from './home-renewal-how-it-works-section';
const Home = () => {
  return (
    <>
      <HomeHeroSection />
      <HomeRenewalFeaturesSection />
      <HomeRenewalHowItWorksSection />

      <HomeRenewalCareerSection />
      <HomeCtaSection />
    </>
  );
};

export default Home;
