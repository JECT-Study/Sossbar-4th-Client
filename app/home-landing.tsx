import { HomeCtaSection } from './home-cta-section';
import { HomeFeaturesSection } from './home-features-section';
import { HomeHeroSection } from './home-hero-section';
import { HomeHowItWorksSection } from './home-how-it-works-section';
import { HomeShowcaseSection } from './home-showcase-section';

export const HomeLandingSections = () => {
  return (
    <>
      <HomeHeroSection />
      <HomeFeaturesSection />
      <HomeHowItWorksSection />
      <HomeShowcaseSection />
      <HomeCtaSection />
    </>
  );
};
