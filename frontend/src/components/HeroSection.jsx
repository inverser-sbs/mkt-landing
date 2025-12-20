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
            <div className="relative w-full h-[500px] rounded-3xl overflow-hidden">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-green-50 to-purple-50"></div>
              
              {/* Brain Illustration with Glowing Effect */}
              <div className="absolute inset-0" style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&auto=format&fit=crop&q=60)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.4,
                mixBlendMode: 'multiply'
              }}></div>
              
              {/* Glowing Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#c4ff0f]/30 via-[#7c3aed]/30 to-purple-400/30 backdrop-blur-sm">
                <div className="w-full h-full relative">
                  {/* Animated Neural Network Effect */}
                  <svg
                    className="absolute inset-0 w-full h-full opacity-60"
                    viewBox="0 0 500 500"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Brain Outline */}
                    <path
                      d="M250 100 C300 100, 350 120, 350 180 C350 220, 340 250, 320 270 L320 350 C320 390, 290 420, 250 420 C210 420, 180 390, 180 350 L180 270 C160 250, 150 220, 150 180 C150 120, 200 100, 250 100 Z"
                      stroke="url(#gradient1)"
                      strokeWidth="3"
                      fill="none"
                      className="animate-pulse"
                      style={{ animationDuration: '3s' }}
                    />
                    
                    {/* Neural Connections */}
                    <circle cx="250" cy="160" r="80" stroke="url(#gradient2)" strokeWidth="2" fill="none" opacity="0.7" />
                    <circle cx="220" cy="150" r="10" fill="#c4ff0f" opacity="0.8" className="animate-pulse" style={{ animationDuration: '2s' }} />
                    <circle cx="280" cy="150" r="10" fill="#7c3aed" opacity="0.8" className="animate-pulse" style={{ animationDuration: '2.5s' }} />
                    <circle cx="250" cy="200" r="8" fill="#c4ff0f" opacity="0.6" className="animate-pulse" style={{ animationDuration: '3s' }} />
                    
                    {/* Neural Lines */}
                    <line x1="220" y1="150" x2="180" y2="200" stroke="#c4ff0f" strokeWidth="2" opacity="0.5" />
                    <line x1="280" y1="150" x2="320" y2="200" stroke="#7c3aed" strokeWidth="2" opacity="0.5" />
                    <line x1="250" y1="200" x2="250" y2="280" stroke="#c4ff0f" strokeWidth="2" opacity="0.4" />
                    
                    {/* Additional nodes */}
                    <circle cx="200" cy="240" r="6" fill="#7c3aed" opacity="0.7" className="animate-pulse" style={{ animationDuration: '2.2s' }} />
                    <circle cx="300" cy="240" r="6" fill="#c4ff0f" opacity="0.7" className="animate-pulse" style={{ animationDuration: '2.8s' }} />
                    <circle cx="250" cy="300" r="7" fill="#7c3aed" opacity="0.8" className="animate-pulse" style={{ animationDuration: '3.2s' }} />
                    
                    <defs>
                      <linearGradient id="gradient1" x1="150" y1="100" x2="350" y2="420">
                        <stop offset="0%" stopColor="#c4ff0f" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity="0.6" />
                      </linearGradient>
                      <linearGradient id="gradient2" x1="170" y1="100" x2="330" y2="220">
                        <stop offset="0%" stopColor="#c4ff0f" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.7" />
                      </linearGradient>
                    </defs>
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