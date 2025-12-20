import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Import template system
import { getTemplate, DEFAULT_TEMPLATE_KEY } from '../templates';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

/**
 * DynamicLandingPage - Componente principal para renderizar landings multi-campaña
 * 
 * Este componente:
 * 1. Obtiene campaign y slug de la URL (/:campaign/:slug)
 * 2. Llama a la API para obtener datos del mentor y campaña
 * 3. Lee el template_key de la campaña
 * 4. Renderiza el template correspondiente usando TEMPLATE_REGISTRY
 * 
 * Si el template_key no existe en el registry, usa el template "generic" como fallback
 * y muestra un warning en consola.
 */
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7c3aed] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{error}</h1>
          <p className="text-gray-600 mb-6">El mentor que buscas no está disponible.</p>
          <a href="/" className="text-[#7c3aed] hover:underline">Volver al inicio</a>
        </div>
      </div>
    );
  }

  // Get template_key from campaign data (fallback to default)
  const templateKey = mentorData?.campaign?.template_key || DEFAULT_TEMPLATE_KEY;
  
  // Get the template component using the registry helper
  const TemplateComponent = getTemplate(templateKey);

  return (
    <TemplateComponent 
      mentorData={mentorData} 
      onActionClick={handleActionClick} 
    />
  );
};

export default DynamicLandingPage;
