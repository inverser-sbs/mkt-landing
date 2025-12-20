import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Clock } from 'lucide-react';

const LevelsSection = () => {
  const levels = [
    {
      title: 'Nivel Junior',
      duration: '280 días',
      description:
        'Inicia tu camino como coach. Aprende herramientas esenciales como escucha activa, preguntas poderosas y conducción de sesiones estructuradas.',
      tags: ['Coaching', 'Neurociencias', 'ConversAcción', 'MetaManagement'],
      color: 'from-green-100 to-green-50',
      badgeColor: 'bg-green-500',
    },
    {
      title: 'Nivel Senior',
      duration: '200 días',
      description:
        'Profundiza en técnicas avanzadas de neurociencia aplicada, comunicación neuroevolutiva y proyectos cerebralmente amigables.',
      tags: ['Avanzado', 'Neurociencia Aplicada', 'Liderazgo', 'Mentoría'],
      color: 'from-purple-100 to-purple-50',
      badgeColor: 'bg-[#7c3aed]',
    },
    {
      title: 'Nivel Máster',
      duration: 'TFC',
      description:
        'Preparación y entrega del Trabajo Final de Certificación (TFC). Módulo neuro integrativo de las competencias adquiridas durante toda la formación.',
      tags: ['Integración', 'Proyecto Final', 'Certificación', 'Competencias'],
      color: 'from-yellow-100 to-yellow-50',
      badgeColor: 'bg-yellow-500',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            3 Niveles de la Certificación
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {levels.map((level, index) => (
            <Card
              key={index}
              className={`border-none shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br ${level.color}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className={`${level.badgeColor} text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2`}>
                    <Clock className="w-4 h-4" />
                    <span>{level.duration}</span>
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">{level.title}</CardTitle>
                <CardDescription className="text-gray-700 mt-4 leading-relaxed">
                  {level.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {level.tags.map((tag, tagIndex) => (
                    <Badge
                      key={tagIndex}
                      variant="secondary"
                      className="bg-white/80 text-gray-700 hover:bg-white"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LevelsSection;