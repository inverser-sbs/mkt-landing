import React from 'react';
import { Check } from 'lucide-react';
import ButtonAnchor, { prepareAnchorData } from './ButtonAnchor';

const IsForYouSection = ({ mentorData, onActionClick }) => {
  // Preparar datos para los anchors
  const { actions, mentorLinks, campaignLinks } = prepareAnchorData(mentorData);
  const templateKey = 'cpn';

  const points = [
    'Te sientes estancado y sin avances en tu vida',
    'Buscas dejar un legado y causar un impacto en el mundo',
    'Siempre te pasa lo mismo y te lamentas de las mismas situaciones',
    'Tu trabajo, relaciones, economía y sueños están llenos de incertidumbre',
    'Quieres una vida de mayor impacto y más tiempo libre',
    'Deseas aumentar tus ingresos y alcanzar libertad financiera',
  ];

  return (
    <section id="programa" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#faf8f5]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-[#7c3aed] uppercase tracking-wider mb-4">
            ¿Es para ti?
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            ¿Cómo saber si esta formación es para ti?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {points.map((point, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 p-6 bg-white rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-[#c4ff0f] flex items-center justify-center">
                  <Check className="w-5 h-5 text-gray-900" />
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{point}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-[#7c3aed] to-purple-600 rounded-3xl p-10 text-white text-center">
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">
            Si quieres dar un salto cuántico en tu calidad de vida
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Y acompañar a otros en el proceso... <span className="font-bold">¡Toma acción!</span>
          </p>
          <p className="text-sm mb-8 opacity-80 max-w-2xl mx-auto">
            Con garantía de resultados + un team maravilloso que estará lado a lado contigo para
            impulsarte a lograr tus metas.
          </p>
          
          {/* ============================================ */}
          {/* BUTTON ANCHOR - Posición fija: Is For You */}
          {/* REGLA: SIEMPRE visible, disabled si falta URL */}
          {/* ============================================ */}
          <ButtonAnchor
            buttonKey="solicitar_entrevista"
            templateKey={templateKey}
            actions={actions}
            mentorLinks={mentorLinks}
            campaignLinks={campaignLinks}
            onActionClick={onActionClick}
            variant="cta"
            size="lg"
          />
        </div>
      </div>
    </section>
  );
};

export default IsForYouSection;
