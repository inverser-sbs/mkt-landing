import React from 'react';
import { Button } from './ui/button';
import { UserPlus, Target as TargetIcon, Users, TrendingUp } from 'lucide-react';

const PartnerSection = () => {
  const steps = [
    {
      number: '1',
      icon: UserPlus,
      title: 'Inscríbete en la Comunidad',
      description: 'Inicia probando en primera línea, descubramos juntos todas tus capacidades.',
    },
    {
      number: '2',
      icon: TargetIcon,
      title: 'Alcanza el Nivel Junior',
      description: 'Logra las competencias necesarias para acompañar y mentorizar a otros.',
    },
    {
      number: '3',
      icon: Users,
      title: 'Construye tu Grupo',
      description:
        'Invita a potenciales Mentee con una presentación irresistible para formar tu equipo.',
    },
    {
      number: '4',
      icon: TrendingUp,
      title: 'Mentorías e Ingresos',
      description:
        'Desarrolla tu equipo bajo supervisión de tu Coach/Mentor. ¡Tus ganancias te esperan!',
    },
  ];

  const scrollToCTA = () => {
    const element = document.getElementById('cta');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-[#7c3aed] uppercase tracking-wider mb-4">
            Partner Program
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            ¡Genera Ingresos y Transforma Vidas!
          </h2>
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 max-w-4xl mx-auto mb-8">
            <p className="text-lg text-gray-800">
              ¿Sabías que puedes generar ingresos a partir de tus primeros pasos y tu formación puede
              resultarte <span className="font-bold text-[#7c3aed]">GRATIS</span>?
            </p>
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto mb-6">
            Nuestro modelo innovador con Acreditación Internacional posee la fórmula y los
            mecanismos estructurados para convertir en Partner Mentor a cada miembro de la comunidad
            que logre los resultados y lo desee.
          </p>
          <p className="text-lg font-semibold text-gray-900 mb-2">
            ¡InverSer es más que una Certificación! Es también un modo de generar ingresos a partir
            del Nivel Junior.
          </p>
          <p className="text-gray-600">Te acompañamos en la construcción de tu equipo.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-bold text-white bg-[#7c3aed] rounded-full w-8 h-8 flex items-center justify-center">
                  {step.number}
                </div>
                <step.icon className="w-8 h-8 text-[#c4ff0f]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={scrollToCTA}
            className="bg-[#c4ff0f] text-gray-900 hover:bg-[#b3ef00] font-semibold px-8 py-6 text-lg transition-all duration-300 hover:scale-105"
          >
            Conviértete en Partner
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PartnerSection;