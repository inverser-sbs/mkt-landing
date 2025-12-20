import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
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

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const DynamicLandingPage = () => {
  const { slug } = useParams();
  const [mentorData, setMentorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/public/mentor/${slug}`);
        setMentorData(response.data);
        
        // Track visit
        trackEvent('visit');
      } catch (err) {
        console.error('Error fetching mentor data:', err);
        setError(err.response?.status === 404 ? 'Mentor no encontrado' : 'Error cargando datos');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchMentorData();
    }
  }, [slug]);

  const trackEvent = async (eventType, actionKey = null) => {
    if (!mentorData || !slug) return;
    
    try {
      await axios.post(`${BACKEND_URL}/api/track/event`, {
        mentor_id: slug, // Use slug as mentor identifier for tracking
        event_type: eventType,
        action_key: actionKey
      });
    } catch (err) {
      console.error('Error tracking event:', err);
    }
  };

  const handleActionClick = (actionKey) => {
    trackEvent('click', actionKey);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7c3aed] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">{error}</h1>
          <p className="text-gray-600 mb-6">El mentor que buscas no está disponible.</p>
          <a href="/" className="text-[#7c3aed] hover:underline">Volver al inicio</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <Navbar />
      <HeroSection mentorData={mentorData} onActionClick={handleActionClick} />
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
      <CTASection mentorData={mentorData} onActionClick={handleActionClick} />
      <Footer />
    </div>
  );
};

export default DynamicLandingPage;
