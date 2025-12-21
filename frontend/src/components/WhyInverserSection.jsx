import React from 'react';
import { Award, Monitor, Users, Globe, Trophy } from 'lucide-react';
import ButtonAnchor, { prepareAnchorData } from './ButtonAnchor';

const WhyInverserSection = ({ mentorData, onActionClick }) => {
  // Preparar datos para los anchors
  const { actions, mentorLinks, campaignLinks } = prepareAnchorData(mentorData);
  const templateKey = 'cpn';

  const benefits = [
    { icon: Award, text: 'Reconocimiento internacional avalado por GCF' },
    { icon: Monitor, text: 'Plataforma 100% online y flexible' },
    { icon: Users, text: 'Acompañamiento personalizado con mentores certificados' },
    { icon: Globe, text: 'Acceso a comunidad de coaches y networking' },
    { icon: Trophy, text: 'Certificación profesional de alto prestigio' },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-[#7c3aed] uppercase tracking-wider mb-4">
            ¿Por qué InverSer?
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Tu transformación comienza en tu SER
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            En InverSer creemos que el cambio comienza desde adentro. Nuestra misión es ayudarte a
            desarrollar las habilidades, el conocimiento y la confianza necesarios para impactar
            vidas de manera positiva.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-6 bg-gradient-to-r from-purple-50 to-green-50 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#7c3aed] rounded-full flex items-center justify-center">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-gray-700 font-medium">{benefit.text}</p>
            </div>
          ))}
        </div>

        {/* ============================================ */}
        {/* BUTTON ANCHOR - Posición fija: Why InverSer */}
        {/* ============================================ */}
        <div className="text-center">
          <ButtonAnchor
            buttonKey="solicitar_info"
            templateKey={templateKey}
            actions={actions}
            mentorLinks={mentorLinks}
            campaignLinks={campaignLinks}
            onActionClick={onActionClick}
            variant="primary"
            size="lg"
            hideIfNoUrl={true}
          />
        </div>
      </div>
    </section>
  );
};

export default WhyInverserSection;
