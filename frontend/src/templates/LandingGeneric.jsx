import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Check, ArrowRight, Star, Target, Rocket } from 'lucide-react';
import { getImageUrl } from '../utils/imageUrl';

/**
 * LandingGeneric - Template por defecto para nuevas campañas
 * 
 * Este template se usa cuando:
 * 1. Una campaña tiene template_key vacío o no definido
 * 2. Una campaña tiene un template_key que no existe en TEMPLATE_REGISTRY
 * 
 * Características:
 * - Layout neutral (no específico de ningún producto)
 * - Renderiza dinámicamente las acciones/botones de la campaña
 * - Secciones: Hero, Beneficios, CTA
 * 
 * Flujo esperado:
 * 1. Admin crea campaña nueva con template_key="generic"
 * 2. Landing funciona inmediatamente con este template
 * 3. Cuando se necesite landing personalizada, Emergent crea el componente
 * 4. Se actualiza template_key en la campaña
 */
const LandingGeneric = ({ mentorData, onActionClick }) => {
  const mentor = mentorData?.mentor || {};
  const actions = mentorData?.actions || [];
  const campaign = mentorData?.campaign || {};

  const handleActionClick = (action) => {
    if (onActionClick) {
      onActionClick(action.action_key);
    }
    if (action.url) {
      window.open(action.url, '_blank');
    }
  };

  // Beneficios genéricos que aplican a cualquier campaña
  const benefits = [
    {
      icon: Star,
      title: 'Experiencia comprobada',
      description: 'Metodología validada por cientos de participantes satisfechos'
    },
    {
      icon: Target,
      title: 'Resultados medibles',
      description: 'Objetivos claros y métricas de progreso en cada etapa'
    },
    {
      icon: Rocket,
      title: 'Acompañamiento personalizado',
      description: 'Soporte directo de expertos durante todo el proceso'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold">
                <span className="text-[#c4ff0f]">Inver</span>
                <span className="text-[#7c3aed]">ser</span>
              </span>
              {campaign.name && (
                <span className="ml-3 text-sm text-gray-500 hidden sm:inline">
                  {campaign.name}
                </span>
              )}
            </div>
            {actions.length > 0 && (
              <Button
                onClick={() => handleActionClick(actions[0])}
                className="bg-[#7c3aed] hover:bg-purple-700 text-white"
              >
                {actions[0].label}
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                {campaign.name || 'Transforma tu futuro'}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Descubre una experiencia diseñada para impulsar tu crecimiento personal y profesional.
                Acompañamiento experto, metodología probada, resultados reales.
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {actions.map((action, index) => (
                  <Button
                    key={action.action_key}
                    onClick={() => handleActionClick(action)}
                    size="lg"
                    className={index === 0 
                      ? "bg-[#7c3aed] hover:bg-purple-700 text-white px-8 py-6 text-lg" 
                      : "bg-white border-2 border-[#7c3aed] text-[#7c3aed] hover:bg-purple-50 px-8 py-6 text-lg"
                    }
                  >
                    {action.label}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                ))}
              </div>

              {/* No actions warning */}
              {actions.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                  <p className="text-yellow-800 text-sm">
                    Esta campaña aún no tiene acciones configuradas.
                  </p>
                </div>
              )}
            </div>

            {/* Mentor Card */}
            <div className="flex justify-center lg:justify-end">
              <Card className="p-8 bg-white shadow-xl max-w-md w-full">
                <div className="text-center">
                  {mentor.photo_url ? (
                    <img
                      src={mentor.photo_url}
                      alt={`${mentor.first_name} ${mentor.last_name}`}
                      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-[#c4ff0f]"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-gradient-to-br from-[#c4ff0f] to-[#7c3aed] flex items-center justify-center text-white text-3xl font-bold">
                      {mentor.first_name?.[0]}{mentor.last_name?.[0]}
                    </div>
                  )}
                  
                  {mentor.first_name && (
                    <>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {mentor.first_name} {mentor.last_name}
                      </h3>
                      <p className="text-gray-500 mt-1">Tu guía en este proceso</p>
                    </>
                  )}

                  {actions.length > 0 && (
                    <Button
                      onClick={() => handleActionClick(actions[0])}
                      className="mt-6 w-full bg-[#7c3aed] hover:bg-purple-700 text-white"
                    >
                      {actions[0].label}
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            ¿Por qué elegirnos?
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Nuestro enfoque combina experiencia, metodología y acompañamiento personalizado
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-[#7c3aed]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Checklist */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Lo que incluye
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Acceso a contenido exclusivo',
              'Sesiones en vivo con expertos',
              'Comunidad de apoyo',
              'Material descargable',
              'Certificado de participación',
              'Soporte continuo'
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#7c3aed] to-purple-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para dar el siguiente paso?
          </h2>
          {mentor.first_name && (
            <p className="text-xl mb-8 opacity-90">
              Conecta con {mentor.first_name} y comienza tu transformación
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {actions.map((action) => (
              <Button
                key={action.action_key}
                onClick={() => handleActionClick(action)}
                size="lg"
                className="bg-white text-[#7c3aed] hover:bg-gray-100 px-8 py-6 text-lg"
              >
                {action.label}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-4">
            <span className="text-2xl font-bold">
              <span className="text-[#c4ff0f]">Inver</span>
              <span className="text-[#7c3aed]">ser</span>
            </span>
          </div>
          <p className="text-gray-400">
            © {new Date().getFullYear()} InverSer. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingGeneric;
