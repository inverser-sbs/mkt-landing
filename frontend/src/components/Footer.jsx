import React from 'react';
import { Mail, Phone } from 'lucide-react';

const Footer = ({ mentorData }) => {
  // Datos del mentor para mostrar contacto
  const mentor = mentorData?.mentor || null;

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

          {/* Contact - Mentor-specific if available */}
          <div>
            <h3 className="font-bold text-lg mb-4">
              {mentor ? `Contacta a ${mentor.first_name}` : 'Contacto'}
            </h3>
            <ul className="space-y-3">
              {/* Mentor Email */}
              {mentor?.email ? (
                <li>
                  <a
                    href={`mailto:${mentor.email}`}
                    className="flex items-center space-x-2 text-gray-400 hover:text-[#c4ff0f] transition-colors text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{mentor.email}</span>
                  </a>
                </li>
              ) : (
                <li>
                  <a
                    href="mailto:info@inverser.us"
                    className="flex items-center space-x-2 text-gray-400 hover:text-[#c4ff0f] transition-colors text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    <span>info@inverser.us</span>
                  </a>
                </li>
              )}
              
              {/* Mentor Phone */}
              {mentor?.phone ? (
                <li>
                  <a
                    href={`https://wa.me/${mentor.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-gray-400 hover:text-[#c4ff0f] transition-colors text-sm"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{mentor.phone}</span>
                  </a>
                </li>
              ) : (
                <li>
                  <a
                    href="https://wa.me/17869547264"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-gray-400 hover:text-[#c4ff0f] transition-colors text-sm"
                  >
                    <Phone className="w-4 h-4" />
                    <span>+1 786 954 7264</span>
                  </a>
                </li>
              )}
            </ul>
            
            {/* Mentor Card if available */}
            {mentor && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-xs text-gray-500 mb-2">Tu mentor certificado</p>
                <p className="text-sm font-medium text-white">
                  {mentor.first_name} {mentor.last_name}
                </p>
              </div>
            )}
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
