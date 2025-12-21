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

/**
 * LandingCPN - Template de landing para campaña CPN
 * 
 * ARQUITECTURA BUTTON ANCHORS:
 * Cada sección tiene sus propios ButtonAnchor anclados en posiciones fijas del diseño.
 * El mentorData se pasa a cada sección que necesita renderizar botones.
 * 
 * BOTONES POR SECCIÓN:
 * - HeroSection: agenda_hero, whatsapp_hero
 * - AwakeningSection: iniciar_transformacion
 * - IsForYouSection: solicitar_entrevista
 * - WhyInverserSection: solicitar_info
 * - CTASection: formulario_cta
 * - Footer: directorio
 */
const LandingCPN = ({ mentorData, onActionClick }) => {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <Navbar />
      <HeroSection mentorData={mentorData} onActionClick={onActionClick} />
      <AwakeningSection mentorData={mentorData} onActionClick={onActionClick} />
      <IsForYouSection mentorData={mentorData} onActionClick={onActionClick} />
      <WhatYouAchieveSection />
      <MethodologySection />
      <WhyInverserSection mentorData={mentorData} onActionClick={onActionClick} />
      <LevelsSection />
      <CommunitySection />
      <PartnerSection />
      <AccreditationsSection />
      <FAQSection />
      <CTASection mentorData={mentorData} onActionClick={onActionClick} />
      <Footer mentorData={mentorData} onActionClick={onActionClick} />
    </div>
  );
};

export default LandingCPN;
