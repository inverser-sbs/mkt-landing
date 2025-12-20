import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer" onClick={() => scrollToSection('inicio')}>
            <span className="text-2xl font-bold">
              <span className="text-[#c4ff0f]">Inver</span>
              <span className="text-[#7c3aed]">ser</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('inicio')}
              className="text-gray-700 hover:text-[#7c3aed] transition-colors"
            >
              Inicio
            </button>
            <button
              onClick={() => scrollToSection('programa')}
              className="text-gray-700 hover:text-[#7c3aed] transition-colors"
            >
              Programa
            </button>
            <button
              onClick={() => scrollToSection('metodo')}
              className="text-gray-700 hover:text-[#7c3aed] transition-colors"
            >
              Método
            </button>
            <button
              onClick={() => scrollToSection('beneficios')}
              className="text-gray-700 hover:text-[#7c3aed] transition-colors"
            >
              Beneficios
            </button>
            <button
              onClick={() => scrollToSection('acreditaciones')}
              className="text-gray-700 hover:text-[#7c3aed] transition-colors"
            >
              Acreditaciones
            </button>
          </div>

          <Button
            onClick={() => scrollToSection('cta')}
            className="bg-[#c4ff0f] text-gray-900 hover:bg-[#b3ef00] font-semibold px-6 transition-all duration-300 hover:scale-105"
          >
            Inscríbete Ahora
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;