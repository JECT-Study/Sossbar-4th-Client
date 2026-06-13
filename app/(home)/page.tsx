import { HomeComparisonSection } from './home-comparison-section';
import { HomeCtaSection } from './home-cta-section';
import { HomeFeaturesSection } from './home-features-section';
import { HomeHeroSection } from './home-hero-section';
import { HomeHowItWorksSection } from './home-how-it-works-section';
import { HomeShowcaseSection } from './home-showcase-section';

const Home = () => {
  return (
    <>
      <HomeHeroSection />
      <HomeComparisonSection />
      <HomeFeaturesSection />
      <HomeHowItWorksSection />
      <HomeShowcaseSection />
      <HomeCtaSection />
    </>
  );
};

export default Home;
