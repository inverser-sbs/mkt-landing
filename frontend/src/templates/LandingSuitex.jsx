import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Check, Zap, Users, BarChart3, Calendar, MessageCircle } from 'lucide-react';
import { getImageUrl } from '../utils/imageUrl';
import { getActionsForSlot } from '../utils/slotHelpers';

const LandingSuitex = ({ mentorData, onActionClick }) => {
  const mentor = mentorData?.mentor || {};
  const actions = mentorData?.actions || [];

  // Filter actions by slot
  const heroPrimaryActions = getActionsForSlot(actions, 'hero_primary');
  const heroSecondaryActions = getActionsForSlot(actions, 'hero_secondary');
  const ctaActions = getActionsForSlot(actions, 'cta');
  const pricingActions = getActionsForSlot(actions, 'pricing');
  
  // If no slot-specific actions, fallback to all actions
  const hasSlotActions = heroPrimaryActions.length > 0 || heroSecondaryActions.length > 0 || ctaActions.length > 0;
  const heroActions = hasSlotActions ? [...heroPrimaryActions, ...heroSecondaryActions] : actions;
  const displayCtaActions = hasSlotActions ? ctaActions : actions;

  const handleActionClick = (action) => {
    if (onActionClick) {
      onActionClick(action.action_key);
    }
    window.open(action.url, '_blank');
  };

  const getActionIcon = (actionKey) => {
    switch (actionKey) {
      case 'demo':
        return Calendar;
      case 'whatsapp':
        return MessageCircle;
      default:
        return Zap;
    }
  };

  const benefits = [
    {
      icon: Zap,
      title: 'Todo en un solo lugar',
      description: 'Centraliza tu gestión, seguimiento y comunicación con clientes'
    },
    {
      icon: Users,
      title: 'Colaboración en tiempo real',
      description: 'Tu equipo sincronizado, sin importar dónde estén'
    },
    {
      icon: BarChart3,
      title: 'Métricas que importan',
      description: 'Visualiza el progreso y toma decisiones basadas en datos'
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Agenda una demo',
      description: 'Conoce cómo Suitex se adapta a tu negocio'
    },
    {
      number: '2',
      title: 'Configuración personalizada',
      description: 'Te ayudamos a configurar el sistema para tu equipo'
    },
    {
      number: '3',
      title: 'Empieza a crecer',
      description: 'Gestiona clientes, proyectos y facturación en un solo lugar'
    }
  ];

  const forWho = [
    'Coaches que quieren profesionalizar su práctica',
    'Consultores que necesitan organizar múltiples clientes',
    'Equipos pequeños que buscan simplicidad y eficiencia',
    'Emprendedores que quieren escalar sin complicaciones'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Suitex
              </span>
              <span className="ml-2 text-sm text-gray-500">by InverSer</span>
            </div>
            {actions.length > 0 && (
              <Button
                onClick={() => handleActionClick(actions[0])}
                className="bg-blue-600 hover:bg-blue-700 text-white"
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
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Tu oficina digital{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                todo en uno
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Suitex es el ecosistema completo para gestionar tu negocio de coaching, 
              consultoría o servicios profesionales. Simple, potente, diseñado para crecer contigo.
            </p>
            
            {mentor.first_name && (
              <div className="flex items-center justify-center space-x-3 mb-8">
                {mentor.photo_url ? (
                  <img
                    src={getImageUrl(mentor.photo_url)}
                    alt={`${mentor.first_name} ${mentor.last_name}`}
                    className="w-12 h-12 rounded-full border-2 border-blue-600"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                    {mentor.first_name[0]}{mentor.last_name[0]}
                  </div>
                )}
                <div className="text-left">
                  <p className="text-sm text-gray-500">Agenda una demo con</p>
                  <p className="font-semibold text-gray-900">{mentor.first_name} {mentor.last_name}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Hero Primary Actions */}
              {heroPrimaryActions.map((action) => {
                const Icon = getActionIcon(action.action_key);
                return (
                  <Button
                    key={action.action_key}
                    onClick={() => handleActionClick(action)}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {action.label}
                  </Button>
                );
              })}
              
              {/* Hero Secondary Actions */}
              {heroSecondaryActions.map((action) => {
                const Icon = getActionIcon(action.action_key);
                return (
                  <Button
                    key={action.action_key}
                    onClick={() => handleActionClick(action)}
                    size="lg"
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg"
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {action.label}
                  </Button>
                );
              })}
              
              {/* Fallback if no slot-specific actions */}
              {!hasSlotActions && actions.map((action) => {
                const Icon = getActionIcon(action.action_key);
                return (
                  <Button
                    key={action.action_key}
                    onClick={() => handleActionClick(action)}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {action.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            ¿Por qué Suitex?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <benefit.icon className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Cómo funciona
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For who */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            ¿Es para ti?
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {forWho.map((item, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 rounded-lg hover:bg-blue-50 transition-colors">
                <Check className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Empieza a transformar tu negocio hoy
          </h2>
          {mentor.first_name && (
            <p className="text-xl mb-8 opacity-90">
              Agenda una demo personalizada con {mentor.first_name}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* CTA Slot Actions */}
            {displayCtaActions.map((action) => {
              const Icon = getActionIcon(action.action_key);
              return (
                <Button
                  key={action.action_key}
                  onClick={() => handleActionClick(action)}
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg"
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {action.label}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2024 Suitex by InverSer. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingSuitex;
