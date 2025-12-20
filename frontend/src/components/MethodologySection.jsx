import React from 'react';

const MethodologySection = () => {
  const steps = [
    { letter: 'P', title: 'Piensa', description: 'Reflexiona y explora nuevas ideas', color: 'bg-purple-500' },
    { letter: 'E', title: 'Emociónate', description: 'Conecta con tus objetivos', color: 'bg-pink-500' },
    { letter: 'D', title: 'Decide', description: 'Toma decisiones conscientes', color: 'bg-blue-500' },
    { letter: 'A', title: 'Actúa', description: 'Pon en marcha tus planes', color: 'bg-green-500' },
    { letter: 'L', title: 'Lógralo', description: 'Celebra cada meta alcanzada', color: 'bg-yellow-500' },
    { letter: 'E', title: 'Evoluciona', description: 'Crece y transforma', color: 'bg-orange-500' },
    { letter: 'A', title: 'Avanza', description: 'Mantén el movimiento', color: 'bg-red-500' },
    { letter: 'R', title: 'RefleAcciona', description: 'Reflexiona y ajusta', color: 'bg-indigo-500' },
  ];

  return (
    <section id="metodo" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-[#7c3aed] uppercase tracking-wider mb-4">
            Nuestra Metodología
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-6">Método PEDALEAR</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            El ciclo de la transformación. Cada pedalazo representa un compromiso contigo mismo,
            con tu futuro y con el impacto que generarás en los demás.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div
                className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <span className="text-3xl font-bold text-white">{step.letter}</span>
              </div>
              <h3 className="font-display text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-purple-100 to-green-100 rounded-3xl p-8 text-center">
          <blockquote className="font-display text-2xl font-semibold text-gray-900 italic">
            "El cambio verdadero no ocurre por casualidad, sino por elección."
          </blockquote>
        </div>
      </div>
    </section>
  );
};

export default MethodologySection;