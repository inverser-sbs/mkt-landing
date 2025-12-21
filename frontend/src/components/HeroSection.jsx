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
    <section id="inicio" className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Background con imagen tenue de conexiones/neuronas */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#faf8f5] via-purple-50/30 to-green-50/20"></div>
      
      {/* Overlay de patrón de conexiones (muy sutil) */}
      <div 
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='neural' patternUnits='userSpaceOnUse' width='100' height='100'%3E%3Ccircle cx='10' cy='10' r='2' fill='%237c3aed'/%3E%3Ccircle cx='50' cy='30' r='2' fill='%237c3aed'/%3E%3Ccircle cx='90' cy='20' r='2' fill='%23c4ff0f'/%3E%3Ccircle cx='30' cy='60' r='2' fill='%23c4ff0f'/%3E%3Ccircle cx='70' cy='70' r='2' fill='%237c3aed'/%3E%3Ccircle cx='20' cy='90' r='2' fill='%237c3aed'/%3E%3Ccircle cx='80' cy='90' r='2' fill='%23c4ff0f'/%3E%3Cline x1='10' y1='10' x2='50' y2='30' stroke='%237c3aed' stroke-width='0.5' opacity='0.5'/%3E%3Cline x1='50' y1='30' x2='90' y2='20' stroke='%23c4ff0f' stroke-width='0.5' opacity='0.5'/%3E%3Cline x1='50' y1='30' x2='30' y2='60' stroke='%237c3aed' stroke-width='0.5' opacity='0.5'/%3E%3Cline x1='30' y1='60' x2='70' y2='70' stroke='%23c4ff0f' stroke-width='0.5' opacity='0.5'/%3E%3Cline x1='70' y1='70' x2='80' y2='90' stroke='%237c3aed' stroke-width='0.5' opacity='0.5'/%3E%3Cline x1='30' y1='60' x2='20' y2='90' stroke='%23c4ff0f' stroke-width='0.5' opacity='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23neural)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      ></div>
      
      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* ============================================ */}
          {/* LEFT COLUMN - Content */}
          {/* ============================================ */}
          <div className="space-y-6 ml-4 md:ml-8">
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
          </div>

          {/* ============================================ */}
          {/* RIGHT COLUMN - Mentor Photo + Buttons */}
          {/* ============================================ */}
          <div className="relative flex flex-col items-center">
            {/* Photo Container - CIRCULAR */}
            <div className="relative w-[350px] h-[350px] md:w-[400px] md:h-[400px] rounded-full overflow-hidden shadow-2xl border-4 border-[#c4ff0f]/40">
              {mentor.photo_url ? (
                <img
                  src={getImageUrl(mentor.photo_url)}
                  alt={`${mentor.first_name} ${mentor.last_name}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                /* Placeholder when no photo */
                <div className="w-full h-full bg-gradient-to-br from-[#7c3aed]/20 via-purple-100 to-[#c4ff0f]/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#7c3aed] to-purple-500 flex items-center justify-center">
                      <span className="text-4xl text-white font-bold">
                        {mentor.first_name?.[0] || 'I'}{mentor.last_name?.[0] || 'S'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mentor Name (if available) */}
            {mentor.first_name && mentor.first_name !== 'Nuestro' && (
              <div className="mt-4 text-center">
                <p className="font-semibold text-gray-900 text-xl">{mentor.first_name} {mentor.last_name}</p>
                <p className="text-sm text-gray-500">Tu mentor certificado</p>
              </div>
            )}

            {/* ============================================ */}
            {/* BUTTON ANCHORS - Pirámide bajo la foto */}
            {/* Orden: Ver perfil (pequeño) → Agendar cita → WhatsApp */}
            {/* Colores: Solo verde y morado */}
            {/* ============================================ */}
            <div className="mt-6 flex flex-col items-center gap-3 w-full max-w-sm">
              {/* Ver perfil - botón pequeño */}
              <ButtonAnchor
                buttonKey="ver_perfil"
                templateKey={templateKey}
                actions={actions}
                mentorLinks={mentorLinks}
                campaignLinks={campaignLinks}
                onActionClick={onActionClick}
                variant="ghost"
                size="sm"
                className="text-[#7c3aed] hover:bg-purple-50"
              />
              
              {/* Agendar cita y WhatsApp - botones principales */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                {/* ANCHOR: agenda_hero (Hero Primary) */}
                <ButtonAnchor
                  buttonKey="agenda_hero"
                  templateKey={templateKey}
                  actions={actions}
                  mentorLinks={mentorLinks}
                  campaignLinks={campaignLinks}
                  onActionClick={onActionClick}
                  variant="primary"
                  size="default"
                  className="flex-1"
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
                  size="default"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
