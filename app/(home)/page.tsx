import { PageContainer } from '@/shared/components/page-container';

import { HomeCtaSection } from './home-cta-section';
import { HomeFeaturesSection } from './home-features-section';
import { HomeHeroSection } from './home-hero-section';
import { HomeHowItWorksSection } from './home-how-it-works-section';
import { HomeShowcaseSection } from './home-showcase-section';

const Home = () => {
  return (
    <PageContainer>
      <HomeHeroSection />
      <HomeFeaturesSection />
      <HomeHowItWorksSection />
      <HomeShowcaseSection />
      <HomeCtaSection />
    </PageContainer>
  );
};

export default Home;
