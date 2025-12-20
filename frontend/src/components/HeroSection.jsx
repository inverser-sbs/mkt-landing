import React from 'react';
import { Button } from './ui/button';
import { Star, Award, Phone, Calendar, MessageCircle } from 'lucide-react';
import { Badge } from './ui/badge';

const HeroSection = ({ mentorData, onActionClick }) => {
  // If no mentor data, use default (generic landing)
  const mentor = mentorData?.mentor || {
    first_name: 'Nuestro',
    last_name: 'Equipo',
    photo_url: null
  };
  
  const actions = mentorData?.actions || [];

  const handleActionClick = (action) => {
    if (onActionClick) {
      onActionClick(action.action_key);
    }
    window.open(action.url, '_blank');
  };

  const getActionIcon = (actionKey) => {
    switch (actionKey) {
      case 'agenda':
        return Calendar;
      case 'whatsapp':
        return Phone;
      case 'formulario':
        return MessageCircle;
      default:
        return Phone;
    }
  };

  return (
    <section id="inicio" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#faf8f5] via-purple-50/30 to-green-50/20"></div>
      
      {/* Abstract Neural Network Background */}
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-40 hidden lg:block">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='800' height='800' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='g1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23c4ff0f;stop-opacity:0.3' /%3E%3Cstop offset='50%25' style='stop-color:%237c3aed;stop-opacity:0.4' /%3E%3Cstop offset='100%25' style='stop-color:%23a855f7;stop-opacity:0.2' /%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='400' cy='200' r='150' fill='none' stroke='url(%23g1)' stroke-width='2' opacity='0.6'/%3E%3Ccircle cx='500' cy='400' r='120' fill='none' stroke='url(%23g1)' stroke-width='2' opacity='0.5'/%3E%3Ccircle cx='300' cy='500' r='100' fill='none' stroke='url(%23g1)' stroke-width='2' opacity='0.4'/%3E%3Cline x1='400' y1='200' x2='500' y2='400' stroke='%237c3aed' stroke-width='1.5' opacity='0.3'/%3E%3Cline x1='500' y1='400' x2='300' y2='500' stroke='%23c4ff0f' stroke-width='1.5' opacity='0.3'/%3E%3Ccircle cx='400' cy='200' r='8' fill='%23c4ff0f' opacity='0.8'/%3E%3Ccircle cx='500' cy='400' r='8' fill='%237c3aed' opacity='0.8'/%3E%3Ccircle cx='300' cy='500' r='8' fill='%23c4ff0f' opacity='0.8'/%3E%3C/svg%3E")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            maskImage: 'linear-gradient(to left, black 30%, transparent 90%)',
            WebkitMaskImage: 'linear-gradient(to left, black 30%, transparent 90%)'
          }}
        ></div>
      </div>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"
            style={{
              background: i % 3 === 0 ? '#c4ff0f' : i % 3 === 1 ? '#7c3aed' : '#a855f7',
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          {/* Rating */}
          <div className="flex items-center space-x-2 mb-6 animate-fade-in">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-5 h-5 fill-[#c4ff0f] text-[#c4ff0f]" />
              ))}
            </div>
            <span className="text-sm text-gray-600">(+100 valoraciones)</span>
          </div>

          {/* Badge */}
          <Badge className="bg-purple-100 text-[#7c3aed] border-purple-200 hover:bg-purple-100 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <Award className="w-4 h-4 mr-2" />
            Avalada por GCF y Universidad Global de Florida
          </Badge>

          {/* Main Heading */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-slide-up">
            <span className="text-gray-900">Certificación Profesional</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] via-purple-500 to-[#7c3aed]">
              Neurocoaching <span className="font-serif italic">&</span> Mentor Program
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-700 mb-4 max-w-2xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <span className="font-semibold text-gray-900">Transforma tu vida y la de otros</span> mientras
            construyes una carrera con propósito. Únete a la comunidad de coaches que ya están
            generando impacto y resultados extraordinarios.
          </p>

          <p className="text-base text-gray-600 mb-8 max-w-2xl animate-slide-up" style={{ animationDelay: '0.15s' }}>
            Forma parte ya de la Comunidad de Formación más completa. Con tu registro podrás
            solicitar tu entrevista.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button
              onClick={handleWhatsApp}
              className="bg-[#c4ff0f] text-gray-900 hover:bg-[#b3ef00] font-semibold px-10 py-7 text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Únete Hoy →
            </Button>
            <Button
              onClick={handleWhatsApp}
              variant="outline"
              className="border-2 border-[#7c3aed] text-[#7c3aed] hover:bg-[#7c3aed] hover:text-white px-10 py-7 text-lg transition-all duration-300"
            >
              <Phone className="w-5 h-5 mr-2" />
              Agendar Llamada
            </Button>
          </div>

          {/* Fire Alert */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-400 rounded-lg p-4 mb-8 animate-slide-up" style={{ animationDelay: '0.25s' }}>
            <p className="text-sm font-medium text-gray-800">
              🔥 <span className="font-bold">Oportunidad única:</span> Formación + acceso de
              por vida a la membresía de Coaches NeuroEvolutivos con Acreditación Internacional.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                <div className="w-2 h-2 rounded-full bg-[#c4ff0f] animate-pulse"></div>
                <span className="text-3xl md:text-4xl font-display font-bold text-gray-900">280</span>
              </div>
              <span className="text-sm text-gray-600">Días de formación</span>
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                <div className="w-2 h-2 rounded-full bg-[#7c3aed] animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <span className="text-3xl md:text-4xl font-display font-bold text-gray-900">3</span>
              </div>
              <span className="text-sm text-gray-600">Niveles evolutivos</span>
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                <div className="w-2 h-2 rounded-full bg-[#c4ff0f] animate-pulse" style={{ animationDelay: '1s' }}></div>
                <span className="text-3xl md:text-4xl font-display font-bold text-gray-900">100%</span>
              </div>
              <span className="text-sm text-gray-600">Online y flexible</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;