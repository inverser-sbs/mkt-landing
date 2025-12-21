import React from 'react';
import { Users, Award, TrendingUp, Globe } from 'lucide-react';
import ButtonAnchor, { prepareAnchorData } from './ButtonAnchor';

const PartnerSection = ({ mentorData, onActionClick }) => {
  // Preparar datos para ButtonAnchor
  const { actions, mentorLinks, campaignLinks } = prepareAnchorData(mentorData);
  const templateKey = 'cpn';

  const partnerBenefits = [
    {
      icon: Users,
      title: 'Red de Contactos',
      description: 'Accede a una red exclusiva de coaches y mentores certificados',
    },
    {
      icon: Award,
      title: 'Certificación Premium',
      description: 'Obtén certificaciones reconocidas internacionalmente',
    },
    {
      icon: TrendingUp,
      title: 'Crecimiento Continuo',
      description: 'Formación continua y actualización de metodologías',
    },
    {
      icon: Globe,
      title: 'Alcance Global',
      description: 'Expande tu práctica a nivel internacional',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#7c3aed] via-purple-600 to-purple-700">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 text-white">
          <p className="text-sm font-semibold uppercase tracking-wider opacity-90 mb-4">
            Partner Program
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Únete a Nuestra Red de <span className="text-[#c4ff0f]">Partners</span>
          </h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto">
            Forma parte de una comunidad exclusiva de profesionales del coaching y accede a
            oportunidades únicas de crecimiento y colaboración.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {partnerBenefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-[#c4ff0f] rounded-full flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="w-7 h-7 text-gray-900" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
              <p className="text-sm text-white/80">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* ============================================ */}
        {/* BUTTON ANCHOR - Posición fija: Partner Section */}
        {/* ============================================ */}
        <div className="text-center">
          <ButtonAnchor
            buttonKey="partner_cta"
            templateKey={templateKey}
            actions={actions}
            mentorLinks={mentorLinks}
            campaignLinks={campaignLinks}
            onActionClick={onActionClick}
            variant="cta"
            size="lg"
          />
        </div>

        <p className="text-center text-white/70 text-sm mt-6">
          Más de 100 coaches ya son parte de nuestra red de partners
        </p>
      </div>
    </section>
  );
};

export default PartnerSection;
