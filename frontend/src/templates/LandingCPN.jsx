import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
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

const LandingCPN = ({ mentorData, onActionClick }) => {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <Navbar />
      <HeroSection mentorData={mentorData} onActionClick={onActionClick} />
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
      <CTASection mentorData={mentorData} onActionClick={onActionClick} />
      <Footer />
    </div>
  );
};

export default LandingCPN;
