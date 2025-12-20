import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import StatsSection from '../components/StatsSection';
import AwakeningSection from '../components/AwakeningSection';
import IsForYouSection from '../components/IsForYouSection';
import WhatYouAchieveSection from '../components/WhatYouAchieveSection';
import MethodologySection from '../components/MethodologySection';
import WhyInverserSection from '../components/WhyInverserSection';
import LevelsSection from '../components/LevelsSection';
import CommunitySection from '../components/CommunitySection';
import PartnerSection from '../components/PartnerSection';
import AccreditationsSection from '../components/AccreditationsSection';
import FAQSection from '../components/FAQSection';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <AwakeningSection />
      <IsForYouSection />
      <WhatYouAchieveSection />
      <MethodologySection />
      <WhyInverserSection />
      <LevelsSection />
      <CommunitySection />
      <PartnerSection />
      <AccreditationsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default HomePage;