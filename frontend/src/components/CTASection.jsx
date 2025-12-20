import React from 'react';
import { Button } from './ui/button';
import { Phone, MessageCircle, CheckCircle } from 'lucide-react';

const CTASection = () => {
  const handleWhatsApp = (message) => {
    window.open(
      `https://wa.me/13059005673?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  return (
    <section id="cta" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#7c3aed] via-purple-600 to-purple-700">
      <div className="max-w-4xl mx-auto text-center text-white">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-wider opacity-90">
            ¡Toma acción ahora!
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            ¿Listo para <span className="text-[#c4ff0f]">transformar tu vida?</span>
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Traemos para ti una comunidad de Coaches a tu disposición, para ayudarte a lograr tus
            metas.
          </p>
          <p className="text-xl font-semibold">
            Únete a una comunidad de coaches y mentores que están cambiando vidas. Iniciemos HOY,
            juntos el camino de tu transformación.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Button
            onClick={() =>
              handleWhatsApp(
                'Me interesa agendar una llamada para obtener mas información de la Certificación Profesional'
              )
            }
            className="bg-[#c4ff0f] text-gray-900 hover:bg-[#b3ef00] font-semibold px-10 py-7 text-lg transition-all duration-300 hover:scale-105"
          >
            Comenzar Ahora →
          </Button>
          <Button
            onClick={() =>
              handleWhatsApp(
                'Me interesa agendar una llamada para obtener mas información de la Certificación Profesional'
              )
            }
            variant="outline"
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#7c3aed] px-10 py-7 text-lg transition-all duration-300"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            ¿Tienes alguna duda?
          </Button>
        </div>

        <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <CheckCircle className="w-6 h-6 text-[#c4ff0f]" />
            <p className="text-lg font-bold">Oportunidad única Garantizada con Acreditación Internacional</p>
          </div>
          <p className="text-sm opacity-90">
            Team de apoyo y ventajas incomparables. Única formación con verdadera vocación de
            acompañarte a lograr metas.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;