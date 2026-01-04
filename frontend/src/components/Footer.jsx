import React from 'react';
import ButtonAnchor, { prepareAnchorData } from './ButtonAnchor';
import { getImageUrl } from '../utils/imageUrl';

const Footer = ({ mentorData, onActionClick }) => {
  // Datos del mentor para mostrar contacto
  const mentor = mentorData?.mentor || null;
  
  // Preparar datos para ButtonAnchor
  const { actions, mentorLinks, campaignLinks } = prepareAnchorData(mentorData);
  const templateKey = 'cpn';
  
  // Año actual dinámico
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#2d2a45] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <img 
                src="https://customer-assets.emergentagent.com/job_landing-bugs/artifacts/ux8tcoz0_logo-02.png" 
                alt="InverSer" 
                className="h-12 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Certificación Profesional en NeuroCoaching avalada por organizaciones internacionales.
              Transforma tu vida HOY.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection('inicio')}
                  className="text-gray-400 hover:text-[#c4ff0f] transition-colors text-sm"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('programa')}
                  className="text-gray-400 hover:text-[#c4ff0f] transition-colors text-sm"
                >
                  Programa
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('metodo')}
                  className="text-gray-400 hover:text-[#c4ff0f] transition-colors text-sm"
                >
                  Método
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('beneficios')}
                  className="text-gray-400 hover:text-[#c4ff0f] transition-colors text-sm"
                >
                  Beneficios
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('acreditaciones')}
                  className="text-gray-400 hover:text-[#c4ff0f] transition-colors text-sm"
                >
                  Acreditaciones
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://inverser.us/terminos-condiciones/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#c4ff0f] transition-colors text-sm"
                >
                  Términos y Condiciones
                </a>
              </li>
            </ul>
          </div>

          {/* Mentor Section con foto miniatura */}
          <div>
            {mentor && (
              <>
                <div className="flex items-center gap-3 mb-4">
                  {mentor.photo_url && (
                    <img 
                      src={getImageUrl(mentor.photo_url)} 
                      alt={`${mentor.first_name} ${mentor.last_name}`}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#c4ff0f]/40"
                    />
                  )}
                  <div>
                    <p className="text-xs text-gray-500">Mentor certificado</p>
                    <p className="text-base font-medium text-white">
                      {mentor.first_name} {mentor.last_name}
                    </p>
                  </div>
                </div>
                <ButtonAnchor
                  buttonKey="ir_perfil_footer"
                  templateKey={templateKey}
                  actions={actions}
                  mentorLinks={mentorLinks}
                  campaignLinks={campaignLinks}
                  onActionClick={onActionClick}
                  variant="ghost"
                  size="sm"
                />
              </>
            )}
          </div>
        </div>

        {/* Bottom Bar - Copyright dinámico */}
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400 text-sm font-medium">
            2009–{currentYear}{' '}
            <a 
              href="https://inverser.us" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[#c4ff0f] transition-colors"
            >
              INVERSER SBS LLC
            </a>
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
