import {
  HomeCareerSection,
  HomeCtaSection,
  HomeFeaturesSection,
  HomeHeroSection,
  HomeHowItWorksSection,
} from '@/features/landing';

const Home = () => {
  return (
    <>
      <HomeHeroSection />
      <HomeFeaturesSection />
      <HomeHowItWorksSection />
      <HomeCareerSection />
      <HomeCtaSection />
    </>
  );
};

export default Home;
