import React from 'react';
import ButtonAnchor, { prepareAnchorData } from './ButtonAnchor';

const Footer = ({ mentorData, onActionClick }) => {
  // Datos del mentor para mostrar contacto
  const mentor = mentorData?.mentor || null;
  
  // Preparar datos para ButtonAnchor
  const { actions, mentorLinks, campaignLinks } = prepareAnchorData(mentorData);
  const templateKey = 'cpn';

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
                <a href="#" className="text-gray-400 hover:text-[#c4ff0f] transition-colors text-sm">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#c4ff0f] transition-colors text-sm">
                  Términos y Condiciones
                </a>
              </li>
            </ul>
          </div>

          {/* Mentor Section */}
          <div>
            <h3 className="font-bold text-lg mb-4">
              {mentor ? `Tu Mentor` : 'Mentor'}
            </h3>
            
            {/* Mentor Name */}
            {mentor && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1">Mentor certificado</p>
                <p className="text-base font-medium text-white">
                  {mentor.first_name} {mentor.last_name}
                </p>
              </div>
            )}
            
            {/* ============================================ */}
            {/* BUTTON ANCHOR - Ir al perfil (Footer) */}
            {/* Mismo sistema que todos los botones */}
            {/* ============================================ */}
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
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 InverSer SBS. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
