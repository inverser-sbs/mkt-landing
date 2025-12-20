import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Sparkles, GraduationCap, FileText, Users as UsersIcon, Target, MessageSquare } from 'lucide-react';

const CommunitySection = () => {
  const benefits = [
    {
      icon: Sparkles,
      title: 'Encuentros Generativos',
      description:
        'Espacios conversacionales para una toma de perspectiva multidimensional. Sesiones de 60-90 minutos para ampliar tu aprendizaje efectivo.',
      color: 'text-purple-500',
    },
    {
      icon: GraduationCap,
      title: 'Ciclo de Conferencias',
      description:
        'Convierte el miedo en tu amigo, tus creencias en el motor de tu existencia y tus pensamientos limitantes en tu fuente de proyectos.',
      color: 'text-blue-500',
    },
    {
      icon: FileText,
      title: 'Guías Generativas',
      description:
        'Poderosas herramientas de descubrimiento personal. Explora, refleAcciona y auto-obsérvate en tu sendero de aprendiz.',
      color: 'text-green-500',
    },
    {
      icon: UsersIcon,
      title: 'Prácticas Supervisadas',
      description:
        'Desde el principio realizarás prácticas de coaching supervisadas con feedback personalizado de tu coach-mentor.',
      color: 'text-orange-500',
    },
    {
      icon: Target,
      title: 'Proyecto de Vida',
      description:
        'Camina sobre tus huellas y crea una visión de futuro. Desarrolla un plan de objetivos detallado hacia el mapa de tus sueños.',
      color: 'text-pink-500',
    },
    {
      icon: MessageSquare,
      title: 'Sesiones de Coaching-Mentoring',
      description:
        'Espacio dedicado a tu expansión personal. Conversaciones con tu Coach-Mentor sobre los temas que más te interesen.',
      color: 'text-indigo-500',
    },
  ];

  return (
    <section id="beneficios" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-[#7c3aed] uppercase tracking-wider mb-4">
            Más que una certificación
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Somos una Comunidad</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Conoce los múltiples beneficios de ser parte de InverSer. Tu transformación va más allá
            de obtener un certificado.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="border-none shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50"
            >
              <CardHeader>
                <benefit.icon className={`w-12 h-12 mb-4 ${benefit.color}`} />
                <CardTitle className="text-xl font-bold text-gray-900">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;