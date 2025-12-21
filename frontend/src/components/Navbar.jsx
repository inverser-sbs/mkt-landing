import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import ButtonAnchor, { prepareAnchorData } from './ButtonAnchor';

const Navbar = ({ mentorData, onActionClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Preparar datos para ButtonAnchor
  const { actions, mentorLinks, campaignLinks } = prepareAnchorData(mentorData);
  const templateKey = 'cpn';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">
              <span className={`transition-colors duration-300 ${isScrolled ? 'text-[#7c3aed]' : 'text-[#c4ff0f]'}`}>Inver</span>
              <span className={`transition-colors duration-300 ${isScrolled ? 'text-gray-900' : 'text-gray-800'}`}>ser</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('inicio')} className={`text-sm font-medium transition-colors ${isScrolled ? 'text-gray-700 hover:text-[#7c3aed]' : 'text-gray-800 hover:text-[#7c3aed]'}`}>
              Inicio
            </button>
            <button onClick={() => scrollToSection('programa')} className={`text-sm font-medium transition-colors ${isScrolled ? 'text-gray-700 hover:text-[#7c3aed]' : 'text-gray-800 hover:text-[#7c3aed]'}`}>
              Programa
            </button>
            <button onClick={() => scrollToSection('metodo')} className={`text-sm font-medium transition-colors ${isScrolled ? 'text-gray-700 hover:text-[#7c3aed]' : 'text-gray-800 hover:text-[#7c3aed]'}`}>
              Método
            </button>
            <button onClick={() => scrollToSection('beneficios')} className={`text-sm font-medium transition-colors ${isScrolled ? 'text-gray-700 hover:text-[#7c3aed]' : 'text-gray-800 hover:text-[#7c3aed]'}`}>
              Beneficios
            </button>
            <button onClick={() => scrollToSection('faq')} className={`text-sm font-medium transition-colors ${isScrolled ? 'text-gray-700 hover:text-[#7c3aed]' : 'text-gray-800 hover:text-[#7c3aed]'}`}>
              FAQ
            </button>
            
            {/* ============================================ */}
            {/* BUTTON ANCHOR - Posición fija: Navbar */}
            {/* ============================================ */}
            <ButtonAnchor
              buttonKey="inscribete_nav"
              templateKey={templateKey}
              actions={actions}
              mentorLinks={mentorLinks}
              campaignLinks={campaignLinks}
              onActionClick={onActionClick}
              variant="primary"
              size="sm"
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t">
            <div className="flex flex-col space-y-4">
              <button onClick={() => scrollToSection('inicio')} className="text-left text-gray-700 hover:text-[#7c3aed]">Inicio</button>
              <button onClick={() => scrollToSection('programa')} className="text-left text-gray-700 hover:text-[#7c3aed]">Programa</button>
              <button onClick={() => scrollToSection('metodo')} className="text-left text-gray-700 hover:text-[#7c3aed]">Método</button>
              <button onClick={() => scrollToSection('beneficios')} className="text-left text-gray-700 hover:text-[#7c3aed]">Beneficios</button>
              <button onClick={() => scrollToSection('faq')} className="text-left text-gray-700 hover:text-[#7c3aed]">FAQ</button>
              
              {/* Mobile ButtonAnchor */}
              <ButtonAnchor
                buttonKey="inscribete_nav"
                templateKey={templateKey}
                actions={actions}
                mentorLinks={mentorLinks}
                campaignLinks={campaignLinks}
                onActionClick={onActionClick}
                variant="primary"
                size="default"
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
