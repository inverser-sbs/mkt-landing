import React from 'react';
import { ExternalLink } from 'lucide-react';

const AccreditationsSection = () => {
  const accreditations = [
    {
      name: 'Global Coaching Federation',
      description:
        'Reconocimiento internacional que certifica nuestros estándares de excelencia en coaching a nivel mundial',
      logo: 'https://customer-assets.emergentagent.com/job_landing-bugs/artifacts/4oif9u9q_GCF-1.png',
      link: 'https://globalcoachingfederation.org/members/inverser/',
    },
    {
      name: 'Center of Education and Leadership',
      description:
        'Respaldo académico universitario que garantiza la validez y calidad de nuestra certificación profesional',
      logo: 'https://customer-assets.emergentagent.com/job_landing-bugs/artifacts/4xct8y9m_CEL-1.png',
      link: 'https://cel.education/',
    },
    {
      name: 'Florida Global University',
      description:
        'Respaldo académico universitario que garantiza la validez y calidad de nuestra certificación profesional',
      logo: 'https://customer-assets.emergentagent.com/job_landing-bugs/artifacts/no18ggug_FGU_kit%20de%20marca_RGB_Mesa%20de%20trabajo%201%20copia%208.png',
      link: 'https://floridaglobal.university/es/',
    },
    {
      name: 'Confederación Interamericana de Coaching',
      description:
        'Todas las acreditaciones son verificables. Haz clic en cada logo para más información.',
      logo: 'https://customer-assets.emergentagent.com/job_landing-bugs/artifacts/2rkhabrt_CIC-1.jpg',
      link: 'https://interamericanadecoaching.org/escuelas/',
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {accreditations.map((accreditation, index) => (
            <a
              key={index}
              href={accreditation.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 group flex flex-col items-center"
            >
              {/* Logo Container */}
              <div className="h-24 w-full flex items-center justify-center mb-4">
                <img
                  src={accreditation.logo}
                  alt={accreditation.name}
                  className="max-h-20 max-w-full object-contain"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                {/* Fallback placeholder (hidden by default) */}
                <div 
                  className="w-full h-16 bg-gradient-to-br from-[#7c3aed] to-purple-400 rounded flex items-center justify-center text-white font-bold text-sm"
                  style={{ display: 'none' }}
                >
                  {accreditation.name.split(' ').map((word, i) => (
                    <span key={i}>{word[0]}</span>
                  ))}
                </div>
              </div>
              
              {/* Text Content */}
              <div className="text-center flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#7c3aed] transition-colors">
                  {accreditation.name}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed flex-1">{accreditation.description}</p>
              </div>
              
              {/* Link indicator */}
              <div className="flex items-center text-[#7c3aed] font-semibold text-sm mt-4 group-hover:underline">
                <span className="mr-2">Verificar</span>
                <ExternalLink className="w-4 h-4" />
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
