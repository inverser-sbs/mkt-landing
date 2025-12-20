import React from 'react';
import { ExternalLink } from 'lucide-react';

const AccreditationsSection = () => {
  const accreditations = [
    {
      name: 'Global Coaching Federation',
      description:
        'Reconocimiento internacional que certifica nuestros estándares de excelencia en coaching a nivel mundial',
      logo: 'https://globalcoachingfederation.org/wp-content/uploads/2021/07/GCF-Logo.png',
      link: 'https://globalcoachingfederation.org/members/inverser/',
      width: 'w-48',
    },
    {
      name: 'Center of Education and Leadership',
      description:
        'Respaldo académico universitario que garantiza la validez y calidad de nuestra certificación profesional',
      logo: 'https://cel.education/wp-content/uploads/2021/09/CEL-Logo-2021.png',
      link: 'https://cel.education/',
      width: 'w-40',
    },
    {
      name: 'Florida Global University',
      description:
        'Respaldo académico universitario que garantiza la validez y calidad de nuestra certificación profesional',
      logo: 'https://floridaglobal.university/wp-content/uploads/2021/09/FGU-Logo.png',
      link: 'https://floridaglobal.university/es/',
      width: 'w-40',
    },
    {
      name: 'Confederación Interamericana de Coaching',
      description:
        'Todas las acreditaciones son verificables. Haz clic en cada logo para más información.',
      logo: 'https://interamericanadecoaching.org/wp-content/uploads/2021/09/CIC-Logo.png',
      link: 'https://interamericanadecoaching.org/escuelas/',
      width: 'w-48',
    },
  ];

  return (
    <section id="acreditaciones" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-[#7c3aed] uppercase tracking-wider mb-4">
            Respaldo Internacional
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Acreditaciones que garantizan excelencia
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            Nuestro programa de NeuroCoaching & Mentor Program cuenta con el respaldo de las más
            prestigiosas organizaciones internacionales de coaching y educación superior,
            asegurando una formación de primer nivel con reconocimiento global.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {accreditations.map((accreditation, index) => (
            <a
              key={index}
              href={accreditation.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 group"
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="h-24 flex items-center justify-center">
                  <div
                    className={`${accreditation.width} bg-white rounded-lg p-4 shadow-sm group-hover:shadow-md transition-shadow`}
                  >
                    <div className="w-full h-16 bg-gradient-to-br from-[#7c3aed] to-purple-400 rounded flex items-center justify-center text-white font-bold text-sm">
                      {accreditation.name.split(' ').map((word, i) => (
                        <span key={i}>{word[0]}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#7c3aed] transition-colors">
                    {accreditation.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{accreditation.description}</p>
                </div>
                <div className="flex items-center text-[#7c3aed] font-semibold group-hover:underline">
                  <span className="mr-2">Verificar acreditación</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 italic">
            Todas las acreditaciones son verificables. Haz clic en cada tarjeta para más información.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AccreditationsSection;