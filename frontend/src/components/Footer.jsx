import React from 'react';
import { Mail, Phone } from 'lucide-react';

const Footer = () => {
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
              <span className="text-2xl font-bold">
                <span className="text-[#c4ff0f]">Inver</span>
                <span className="text-white">ser</span>
              </span>
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

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:info@inverser.us"
                  className="flex items-center space-x-2 text-gray-400 hover:text-[#c4ff0f] transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  <span>info@inverser.us</span>
                </a>
              </li>
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
            </ul>
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