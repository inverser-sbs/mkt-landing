import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Template imports
import LandingCPN from '../templates/LandingCPN';
import LandingSuitex from '../templates/LandingSuitex';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Template registry - maps template_key to component
const TEMPLATE_REGISTRY = {
  cpn: LandingCPN,
  suitex: LandingSuitex,
};

const DynamicLandingPage = () => {
  const { campaign, slug } = useParams();
  const [mentorData, setMentorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/public/mentor/${campaign}/${slug}`);
        setMentorData(response.data);
        
        // Track visit
        try {
          await axios.post(`${BACKEND_URL}/api/track/event`, {
            mentor_id: slug,
            campaign_key: campaign,
            event_type: 'visit'
          });
        } catch (trackErr) {
          console.error('Error tracking visit:', trackErr);
        }
      } catch (err) {
        console.error('Error fetching mentor data:', err);
        setError(err.response?.status === 404 ? 'Mentor no encontrado' : 'Error cargando datos');
      } finally {
        setLoading(false);
      }
    };

    if (slug && campaign) {
      fetchMentorData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, campaign]);

  const trackEvent = async (eventType, actionKey = null) => {
    if (!mentorData || !slug || !campaign) return;
    
    try {
      await axios.post(`${BACKEND_URL}/api/track/event`, {
        mentor_id: slug,
        campaign_key: campaign,
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

  // Get template_key from campaign data (fallback to 'cpn')
  const templateKey = mentorData?.campaign?.template_key || 'cpn';
  
  // Get the template component from registry
  let TemplateComponent = TEMPLATE_REGISTRY[templateKey];
  
  // Fallback to CPN with warning if template not found
  if (!TemplateComponent) {
    console.warn(`[DynamicLandingPage] Template "${templateKey}" not found in registry. Falling back to "cpn".`);
    TemplateComponent = TEMPLATE_REGISTRY['cpn'];
  }

  return (
    <TemplateComponent 
      mentorData={mentorData} 
      onActionClick={handleActionClick} 
    />
  );
};

export default DynamicLandingPage;
