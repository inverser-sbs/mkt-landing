import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Brain, Heart, Zap, MessageCircle, Target } from 'lucide-react';

const WhatYouAchieveSection = () => {
  const achievements = [
    {
      icon: Heart,
      title: 'Autoconocimiento y Conexión Interior',
      description:
        'Aprende a conocerte, entender tus emociones y descubrir tus valores esenciales. Este primer paso es fundamental para guiar a otros.',
      color: 'text-pink-500',
    },
    {
      icon: Brain,
      title: 'Neurociencia Aplicada al Coaching',
      description:
        'Comprende cómo funcionan el cerebro y las emociones para diseñar estrategias efectivas que impulsen resultados positivos.',
      color: 'text-[#7c3aed]',
    },
    {
      icon: Zap,
      title: 'Integración Cuerpo-Mente',
      description:
        'Descubre cómo el cuerpo y las emociones se influyen mutuamente, y aprende herramientas para manejar la energía emocional.',
      color: 'text-[#c4ff0f]',
    },
    {
      icon: MessageCircle,
      title: 'Comunicación Transformadora',
      description:
        'Aprende a escuchar activamente, hacer las preguntas correctas y crear un espacio seguro para el cambio.',
      color: 'text-blue-500',
    },
    {
      icon: Target,
      title: 'Maestría Práctica - ConversAcción',
      description:
        'Desarrolla y perfecciona tus sesiones de coaching con metodologías basadas en la acción y el logro de objetivos claros.',
      color: 'text-orange-500',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-[#7c3aed] uppercase tracking-wider mb-4">
            ¿Qué lograrás?
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            ¿Qué lograrás en la Certificación?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Formación creada, vivida y aplicada por Coaches que ya cambiaron sus vidas con
            iniciativa, dedicación, soporte y acción.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <Card
              key={index}
              className="border-none shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50"
            >
              <CardHeader>
                <achievement.icon className={`w-12 h-12 mb-4 ${achievement.color}`} />
                <CardTitle className="font-display text-xl font-bold text-gray-900">
                  {achievement.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{achievement.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatYouAchieveSection;