import React from 'react';
import { Button } from './ui/button';
import { Star, Award, Phone } from 'lucide-react';
import { Badge } from './ui/badge';

const HeroSection = () => {
  const handleWhatsApp = () => {
    window.open(
      'https://wa.me/13059005673?text=Me%20interesa%20agendar%20una%20llamada%20para%20obtener%20mas%20informaci%C3%B3n%20de%20la%20Certificaci%C3%B3n%20Profesional',
      '_blank'
    );
  };

  return (
    <section id="inicio" className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-[#c4ff0f] text-[#c4ff0f]" />
                ))}
              </div>
              <span className="text-sm text-gray-600">(+100 valoraciones)</span>
            </div>

            {/* Badge */}
            <Badge className="bg-purple-100 text-[#7c3aed] border-purple-200 hover:bg-purple-100">
              <Award className="w-4 h-4 mr-2" />
              Avalada por GCF y Universidad Global de Florida
            </Badge>

            {/* Main Heading */}
            <div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-gray-900">Certificación Profesional</span>
                <br />
                <span className="text-[#7c3aed]">Neurocoaching <span className="font-serif italic">&</span> Mentor Program</span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Transforma tu vida y la de otros</span> mientras
              construyes una carrera con propósito. Únete a la comunidad de coaches que ya están
              generando impacto y resultados extraordinarios.
            </p>

            <p className="text-gray-600">
              Forma parte ya de la Comunidad de Formación más completa. Con tu registro podrás
              solicitar tu entrevista.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={handleWhatsApp}
                className="bg-[#c4ff0f] text-gray-900 hover:bg-[#b3ef00] font-semibold px-8 py-6 text-lg transition-all duration-300 hover:scale-105"
              >
                Únete Hoy →
              </Button>
              <Button
                onClick={handleWhatsApp}
                variant="outline"
                className="border-[#7c3aed] text-[#7c3aed] hover:bg-purple-50 px-8 py-6 text-lg transition-all duration-300"
              >
                <Phone className="w-5 h-5 mr-2" />
                Agendar Llamada
              </Button>
            </div>

            {/* Fire Alert */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                🔥 <span className="font-semibold">Oportunidad única:</span> Formación + acceso de
                por vida a la membresía de Coaches NeuroEvolutivos con Acreditación Internacional.
              </p>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative w-full h-[500px] bg-gradient-to-br from-purple-100 via-green-50 to-purple-50 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-[#c4ff0f]/20 via-[#7c3aed]/20 to-purple-300/30 backdrop-blur-3xl">
                  <svg
                    className="w-full h-full opacity-40"
                    viewBox="0 0 400 400"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M200 50 C250 50, 280 80, 280 130 C280 160, 270 180, 250 190 L250 250 C250 280, 230 300, 200 300 C170 300, 150 280, 150 250 L150 190 C130 180, 120 160, 120 130 C120 80, 150 50, 200 50 Z"
                      stroke="#7c3aed"
                      strokeWidth="2"
                      fill="none"
                      opacity="0.6"
                    />
                    <circle cx="200" cy="120" r="60" stroke="#c4ff0f" strokeWidth="2" fill="none" opacity="0.8" />
                    <circle cx="170" cy="110" r="8" fill="#7c3aed" opacity="0.6" />
                    <circle cx="230" cy="110" r="8" fill="#7c3aed" opacity="0.6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;