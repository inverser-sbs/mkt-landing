import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';

const FAQSection = () => {
  const faqs = [
    {
      question: '¿Qué es un Coach Ontológico?',
      answer:
        'Un Coach Ontológico es un profesional que trabaja con las personas desde su SER, ayudándolas a transformar su forma de observar y relacionarse con el mundo. A través de conversaciones poderosas, facilita procesos de cambio profundo en la manera de pensar, sentir y actuar de las personas.',
    },
    {
      question: '¿Puede cualquier persona convertirse en COACH?',
      answer:
        'Sí, cualquier persona con el deseo genuino de ayudar a otros, compromiso con su propio desarrollo personal y disposición para el aprendizaje continuo puede convertirse en coach. No se requiere una profesión específica previa, aunque la experiencia de vida y la capacidad de escucha empática son fundamentales.',
    },
    {
      question: '¿Un Coach maneja la PNL?',
      answer:
        'La Programación Neurolingüística (PNL) es una de las herramientas que puede utilizar un coach, pero no es exclusiva ni obligatoria. En nuestra certificación de NeuroCoaching, integramos diversas metodologías incluyendo neurociencia aplicada, ontología del lenguaje y técnicas de comunicación transformadora.',
    },
    {
      question: '¿Un NeuroCoach es un Psicólogo?',
      answer:
        'No, un NeuroCoach no es un psicólogo. Mientras que la psicología trabaja con la salud mental y trastornos psicológicos, el coaching se enfoca en el desarrollo personal y profesional de personas funcionales que buscan alcanzar metas específicas. El NeuroCoaching incorpora conocimientos de neurociencia para optimizar el proceso de transformación.',
    },
    {
      question: '¿Puedo vivir del COACHING?',
      answer:
        'Sí, es absolutamente posible vivir del coaching. Muchos de nuestros coaches certificados han construido carreras exitosas y prósperas. A través de nuestro Partner Program, te acompañamos desde el inicio para que puedas generar ingresos incluso durante tu formación, construyendo tu propio equipo y desarrollando tu práctica profesional.',
    },
    {
      question: '¿El COACHING es una disciplina reconocida internacionalmente?',
      answer:
        'Sí, el coaching es una disciplina profesional reconocida a nivel mundial. Nuestra certificación cuenta con el respaldo de organizaciones internacionales como la Global Coaching Federation (GCF), la Confederación Interamericana de Coaching (CIC) y universidades como Florida Global University, garantizando estándares de excelencia reconocidos globalmente.',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#faf8f5]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-[#7c3aed] uppercase tracking-wider mb-4">
            Resolvemos tus dudas
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Preguntas Frecuentes</h2>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white rounded-xl px-6 border-none shadow-sm"
            >
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-[#7c3aed] py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;