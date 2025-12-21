import React from 'react';
import { Star, Award } from 'lucide-react';
import { Badge } from './ui/badge';
import { getImageUrl } from '../utils/imageUrl';
import ButtonAnchor, { prepareAnchorData } from './ButtonAnchor';

const HeroSection = ({ mentorData, onActionClick }) => {
  // Preparar datos del mentor
  const mentor = mentorData?.mentor || {
    first_name: 'Nuestro',
    last_name: 'Equipo',
    photo_url: null
  };
  
  // Preparar datos para los anchors
  const { actions, mentorLinks, campaignLinks } = prepareAnchorData(mentorData);
  
  // Template key (para buscar definiciones de botones)
  const templateKey = 'cpn';

  return (
    <section id="inicio" className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#faf8f5] via-purple-50/30 to-green-50/20"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* ============================================ */}
          {/* LEFT COLUMN - Content */}
          {/* ============================================ */}
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
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-gray-900">Certificación Profesional</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] via-purple-500 to-[#7c3aed]">
                Neurocoaching <span className="font-serif italic">&</span> Mentor Program
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-700">
              <span className="font-semibold text-gray-900">Transforma tu vida y la de otros</span> mientras
              construyes una carrera con propósito. Únete a la comunidad de coaches que ya están
              generando impacto y resultados extraordinarios.
            </p>

            <p className="text-base text-gray-600">
              Forma parte ya de la Comunidad de Formación más completa. Con tu registro podrás
              solicitar tu entrevista.
            </p>

            {/* ============================================ */}
            {/* BUTTON ANCHORS - Posición fija en el diseño */}
            {/* REGLA: SIEMPRE visibles, disabled si falta URL */}
            {/* ============================================ */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {/* ANCHOR: agenda_hero (Hero Primary) */}
              <ButtonAnchor
                buttonKey="agenda_hero"
                templateKey={templateKey}
                actions={actions}
                mentorLinks={mentorLinks}
                campaignLinks={campaignLinks}
                onActionClick={onActionClick}
                variant="primary"
                size="lg"
              />
              
              {/* ANCHOR: whatsapp_hero (Hero Secondary) */}
              <ButtonAnchor
                buttonKey="whatsapp_hero"
                templateKey={templateKey}
                actions={actions}
                mentorLinks={mentorLinks}
                campaignLinks={campaignLinks}
                onActionClick={onActionClick}
                variant="secondary"
                size="lg"
              />
            </div>

            {/* Fire Alert */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                🔥 <span className="font-semibold">Oportunidad única:</span> Formación + acceso de
                por vida a la membresía de Coaches NeuroEvolutivos con Acreditación Internacional.
              </p>
            </div>
          </div>

          {/* ============================================ */}
          {/* RIGHT COLUMN - Mentor Photo */}
          {/* ============================================ */}
          <div className="relative flex flex-col items-center">
            {/* Photo Container */}
            <div className="relative w-full max-w-[400px] h-[400px] bg-gradient-to-br from-purple-100 via-green-50 to-purple-50 rounded-3xl overflow-hidden shadow-xl">
              {mentor.photo_url ? (
                <img
                  src={getImageUrl(mentor.photo_url)}
                  alt={`${mentor.first_name} ${mentor.last_name}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                /* Placeholder when no photo */
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-br from-[#c4ff0f]/20 via-[#7c3aed]/20 to-purple-300/30">
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
              )}
              
              {/* Decorative border */}
              <div className="absolute inset-0 rounded-3xl border-4 border-[#c4ff0f]/30 pointer-events-none"></div>
            </div>

            {/* Mentor Name (if available) */}
            {mentor.first_name && mentor.first_name !== 'Nuestro' && (
              <div className="mt-4 text-center">
                <p className="font-semibold text-gray-900 text-lg">{mentor.first_name} {mentor.last_name}</p>
                <p className="text-sm text-gray-500">Tu mentor certificado</p>
              </div>
            )}

            {/* ============================================ */}
            {/* BUTTON ANCHOR - Ver perfil (debajo de la foto) */}
            {/* ============================================ */}
            <div className="mt-4">
              <ButtonAnchor
                buttonKey="ver_perfil"
                templateKey={templateKey}
                actions={actions}
                mentorLinks={mentorLinks}
                campaignLinks={campaignLinks}
                onActionClick={onActionClick}
                variant="outline"
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
