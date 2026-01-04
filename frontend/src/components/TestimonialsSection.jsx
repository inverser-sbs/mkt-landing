import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Jannio Rojas",
    image: "https://customer-assets.emergentagent.com/job_mentor-program/artifacts/zpfcfg5a_Jannio%20Rojas.jpg",
    text: `Si tuviese que decir qué significó para mí la formación de NeuroCoaching, la verdad lo resumo en una frase: Puntual. Una vida antes y una vida después.

Había ya comenzado a trabajar internamente, fui a varios cursos, hice quizás parte de diplomados, pero nada me dio lo que esta formación me dio. Hubo una ruptura incluso de identidad, un despertar, fue como estar siempre dormido y luego vivir una vida de cambio, inicio en un cambio radical, me convertí en ser diferente a lo que era.

Desde allí no volví nunca a ser el mismo, fue desflorada mi ignorancia y absorbido por el mundo del imposible, ahora posible, atrás quedaron las décadas de inocencia e ignorancia llenas de culpas o resentimiento… Y quien emergió, en su vuelo encantador, fue la mariposa de mi ser.

El sufrimiento y la decadencia de todo… cesaría al menos en gran parte. Sí. Una simple creencia y el lente de cómo veo mi vida. Puede transformar para mal la vida de un ser humano… Hoy me veo al espejo y confirmo: comprobado que para bien también puede.`
  },
  {
    name: "Luis Cabrera",
    image: "https://customer-assets.emergentagent.com/job_mentor-program/artifacts/58tedicy_Luis%20Cabrera.png",
    text: `Hablar de la experiencia en la Formación Coaching Neuro Evolutivo, es describir un viaje de transformación. A lo largo de los 12 meses, viví una de las experiencias más inolvidables y maravillosas que haya podido experimentar, pues en ella, pude encontrar entre tantas cosas, la conexión con mi Misión de Vida, que es la de conducir al prójimo a ir en búsqueda de su felicidad; y con ello yo encontraba mi felicidad.

Antes de llegar a ella, no había conectado con mi propósito de vida, y con mis talentos, a pesar que llegó a mis 46 años de vida, esa experiencia hoy por hoy siento que marcó un antes y un después en mí. Porque luego de ella, conocí lo maravilloso que es estar claro de quién eres y hacia dónde vas.

Finalmente, quiero agradecer a ese equipo maravilloso que me acompañó en la experiencia, encabezado por quien considero uno de mis mentores de vida, Noel Rivera, quien junto a mis compañeros de promoción formamos una hermosa red de apoyo, que aún, 9 años después, sigue igual o más fuerte que en sus principios.

Si me tocara describir este proceso con una palabra, lo dibujaría como un Renacimiento, desde quien era a quien actualmente soy.`
  },
  {
    name: "Saray Torres",
    image: "https://customer-assets.emergentagent.com/job_mentor-program/artifacts/9pkhi67e_Saray%20Torres.jpg",
    text: `Mi vida tuvo un 'antes' y un 'después' de mi formación de Neurocoaching; todo cambió en todos los sentidos.

Principalmente, me volví más consciente de mi lenguaje, de mis pensamientos y de mis acciones, comprendí que mi propósito de vida es servir y ayudar a otros a encontrar y desarrollar su propósito también, entendiendo que primero debía trabajar en mí. Por otra parte, encontré muchas respuestas y encaminé mis objetivos con propósito e intención.

El Neurocoaching no solo me brindó las herramientas para crecer en cada área de mi vida, también me regaló un mundo de posibilidades dentro de un estilo de vida consciente que me permite acompañar y guiar a otros a encontrar su propio camino.`
  },
  {
    name: "Carmen Julia Cabello",
    image: "https://customer-assets.emergentagent.com/job_mentor-program/artifacts/9wnjyc0k_Carmen%20Julia%20Cabello.jpg",
    text: `Aprendí a darme el primer lugar en mi vida, dejé de ser quien creí ser por mucho tiempo, para convertirme en un ser de infinitas posibilidades, con la valentía para probar cada nueva idea, la humildad para reconocer los fallos, y la disposición de celebrar mis aciertos siempre…

No soy quien soy ahora, sino todo lo que puedo ser.`
  }
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play carrusel
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToSlide = (index) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#2d2a45] via-[#3d3a55] to-[#2d2a45] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#7c3aed]/10 rounded-full filter blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#c4ff0f]/10 rounded-full filter blur-[100px]" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-[#c4ff0f]/20 text-[#c4ff0f] text-sm font-medium rounded-full mb-4">
            Testimonios
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Historias de{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c4ff0f] to-[#7c3aed]">
              Transformación
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Descubre cómo el NeuroCoaching ha impactado la vida de quienes ya han vivido esta experiencia
          </p>
        </div>

        {/* Carrusel */}
        <div className="relative">
          {/* Card del testimonio */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 md:p-12 transition-all duration-500">
            <Quote className="w-12 h-12 text-[#c4ff0f]/30 mb-6" />
            
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Imagen circular */}
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-[#c4ff0f]/40 shadow-xl">
                  <img
                    src={testimonials[currentIndex].image}
                    alt={testimonials[currentIndex].name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Contenido */}
              <div className="flex-1">
                <p className="text-white/90 text-base md:text-lg leading-relaxed mb-6 whitespace-pre-line">
                  "{testimonials[currentIndex].text}"
                </p>
                
                <div className="border-t border-white/10 pt-4">
                  <p className="text-[#c4ff0f] font-semibold text-lg">
                    {testimonials[currentIndex].name}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Egresado de la Certificación NeuroCoaching
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Controles de navegación */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={goToPrevious}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 border border-white/10"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            
            {/* Indicadores */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-[#c4ff0f] w-8' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Ir al testimonio ${index + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={goToNext}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 border border-white/10"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
