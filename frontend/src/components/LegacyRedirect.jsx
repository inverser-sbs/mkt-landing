import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const LegacyRedirect = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to cpn campaign by default
    navigate(`/cpn/${slug}`, { replace: true });
  }, [slug, navigate]);

  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7c3aed] mx-auto mb-4"></div>
        <p className="text-gray-600">Redirigiendo...</p>
      </div>
    </div>
  );
};

export default LegacyRedirect;
