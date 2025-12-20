import React from 'react';
import { Button } from './ui/button';

const AwakeningSection = () => {
  const scrollToCTA = () => {
    const element = document.getElementById('cta');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-5xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <p className="text-sm font-semibold text-[#7c3aed] uppercase tracking-wider">
            ES MOMENTO DE DESPERTAR
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            ¿Sientes que <span className="text-[#7c3aed]">falta algo en tu vida?</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-lg text-gray-600 leading-relaxed">
            A pesar de tener un trabajo, haber estudiado una profesión, haber hecho todo lo que
            se esperaba de ti, haber seguido todos los consejos de seres importantes para ti...
          </p>
          <p className="text-xl font-semibold text-gray-900">
            ¿Sientes que la vida gira y gira y te encuentras en el mismo sitio?
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-green-50 rounded-3xl p-12 mt-12">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="text-gray-900">CRECE, </span>
            <span className="text-[#c4ff0f]">EVOLUCIONA</span>
            <span className="text-gray-900"> Y EXPÁNDETE</span>
          </h3>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Es momento de <span className="font-bold">darle sentido a tu vida</span>. ¡Casi 2 décadas
            CAMBIANDO VIDAS! Sé parte de una comunidad que crece, evoluciona y se expande.
          </p>
          <Button
            onClick={scrollToCTA}
            className="bg-[#c4ff0f] text-gray-900 hover:bg-[#b3ef00] font-semibold px-8 py-6 text-lg transition-all duration-300 hover:scale-105"
          >
            Quiero Iniciar mi Transformación →
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AwakeningSection;