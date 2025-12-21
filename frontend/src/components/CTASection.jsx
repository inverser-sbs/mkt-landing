import React from 'react';
import ButtonAnchor, { prepareAnchorData } from './ButtonAnchor';

const CTASection = ({ mentorData, onActionClick }) => {
  // Preparar datos para los anchors
  const { actions, mentorLinks, campaignLinks } = prepareAnchorData(mentorData);
  const mentor = mentorData?.mentor || null;
  
  // Template key
  const templateKey = 'cpn';

  return (
    <section id="cta" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#7c3aed] via-purple-600 to-purple-700">
      <div className="max-w-4xl mx-auto text-center text-white">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-wider opacity-90">
            ¡Toma acción ahora!
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            ¿Listo para <span className="text-[#c4ff0f]">transformar tu vida?</span>
          </h2>
          {mentor && (
            <p className="text-xl font-semibold">
              Trabaja con {mentor.first_name} {mentor.last_name}
            </p>
          )}
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Traemos para ti una comunidad de Coaches a tu disposición, para ayudarte a lograr tus
            metas.
          </p>
          <p className="text-xl font-semibold">
            Únete a una comunidad de coaches y mentores que están cambiando vidas. Iniciemos HOY,
            juntos el camino de tu transformación.
          </p>
        </div>

        {/* ============================================ */}
        {/* BUTTON ANCHOR - Posición fija: CTA Section */}
        {/* REGLA: SIEMPRE visible, disabled si falta URL */}
        {/* ============================================ */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          {/* ANCHOR: formulario_cta (CTA Final) */}
          <ButtonAnchor
            buttonKey="formulario_cta"
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

export default CTASection;
