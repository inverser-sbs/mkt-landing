/**
 * LandingCPN v2.0 - Certificación Profesional de NeuroCoaching
 * =============================================================
 * 
 * Estructura actualizada basada en el brochure InverSer 2.0
 * Enfoque desde la POSIBILIDAD, no desde el miedo
 * 
 * SECCIONES:
 * 1. Hero - Card mentor + propuesta de valor
 * 2. TransformaSER - Filosofía central del SER
 * 3. ¿Es para ti? - Perfil del candidato ideal
 * 4. Qué Lograrás - Beneficios transformacionales
 * 5. Metodología PEDALEAR - El ciclo de transformación
 * 6. Ejes Transformacionales - Los 7 ejes del programa
 * 7. Niveles de Certificación - Junior, Senior, Master
 * 8. Ecosistema Digital - Herramientas y tecnología
 * 9. Comunidad - Kommunity y red de apoyo
 * 10. Tu Siguiente Paso - De Coach a Mentor (ex-Partner)
 * 11. Acreditaciones - GCF y reconocimiento
 * 12. Testimonios - Carrusel
 * 13. FAQ - Preguntas frecuentes
 * 14. CTA Final - Llamada a la acción
 * 15. Footer
 */

import React, { useEffect, useState } from 'react';
import { 
  Star, Award, Users, BookOpen, Brain, MessageSquare,
  Video, Headphones, Layout, Globe, Briefcase, Calendar,
  ChevronRight, ChevronDown, ChevronLeft, Mail, Phone, ExternalLink,
  Sparkles, Target, Heart, Zap, Shield, TrendingUp,
  Play, FileText, CheckCircle, ArrowRight, HelpCircle,
  Clock, Quote, Lightbulb, Compass, Eye, MessageCircle,
  Layers, Rocket, GraduationCap, Trophy
} from 'lucide-react';
import ButtonAnchor, { prepareAnchorData } from '../components/ButtonAnchor';
import { getImageUrl } from '../utils/imageUrl';

// ============================================
// NAVBAR
// ============================================
const NavbarCPN = ({ mentorData, onActionClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const { actions, mentorLinks, campaignLinks } = prepareAnchorData(mentorData);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://inverser.us/wp-content/uploads/2024/10/InverSer-logo-200px.png" 
              alt="InverSer" 
              className="h-10"
            />
          </div>
          
          <ButtonAnchor
            buttonKey="inscribete_nav"
            templateKey="cpn"
            actions={actions}
            mentorLinks={mentorLinks}
            campaignLinks={campaignLinks}
            onActionClick={onActionClick}
            variant="primary"
            size="sm"
          />
        </div>
      </div>
    </nav>
  );
};

// ============================================
// HERO SECTION
// ============================================
const HeroCPN = ({ mentorData, onActionClick }) => {
  const mentor = mentorData?.mentor || {};
  const hasMentor = mentor.first_name && mentor.first_name !== '';
  const { actions, mentorLinks, campaignLinks } = prepareAnchorData(mentorData);

  return (
    <section 
      className="relative min-h-screen flex items-center pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-fixed bg-cover bg-center"
      style={{ 
        backgroundImage: `url('https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg')` 
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#031730]/95 via-[#0a1f3d]/90 to-[#031730]/95" />
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#7c3aed]/20 rounded-full filter blur-[150px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#c4ff0f]/10 rounded-full filter blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16 items-center">
          {/* Contenido principal */}
          <div className="lg:col-span-3 space-y-6 md:space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <Award className="w-4 h-4 text-[#c4ff0f]" />
              <span className="text-sm font-body text-white/80">Avalada por Global Coaching Federation</span>
            </div>
            
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight">
              <span className="text-white">Certificación Profesional de</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] via-[#a78bfa] to-[#c4ff0f]">
                NeuroCoaching
              </span>
            </h1>
            
            <p className="font-body text-lg md:text-xl lg:text-2xl text-white/80 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Más que una certificación, <span className="text-[#c4ff0f] font-medium">una experiencia de transformación</span>. Desarrolla tu máximo potencial mientras aprendes a transformar vidas.
            </p>
            
            <p className="font-body text-base md:text-lg text-white/50 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Un viaje de crecimiento profundo donde tu pasión por ayudar a otros se convierte en el motor de tu crecimiento personal, profesional y financiero.
            </p>

            {/* Rating */}
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-[#c4ff0f] text-[#c4ff0f]" />
                ))}
              </div>
              <span className="text-sm text-white/60">(+100 coaches certificados)</span>
            </div>
          </div>
          
          {/* Mentor card */}
          <div className="lg:col-span-2 flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-[#7c3aed]/40 to-[#c4ff0f]/40 rounded-3xl blur-2xl opacity-50" />
              
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 text-center min-w-[300px] sm:min-w-[340px]">
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed] to-[#c4ff0f] rounded-full p-[3px]">
                    <div className="w-full h-full rounded-full overflow-hidden bg-[#031730]">
                      {mentor.photo_url ? (
                        <img
                          src={getImageUrl(mentor.photo_url)}
                          alt={hasMentor ? `${mentor.first_name} ${mentor.last_name}` : 'Tu Mentor'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Users className="w-14 h-14 text-white/30" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <p className="font-heading text-xl sm:text-2xl font-semibold text-white mb-1">
                  {hasMentor ? `${mentor.first_name} ${mentor.last_name}` : 'Tu Mentor'}
                </p>
                <p className="font-body text-[#c4ff0f] text-sm mb-6">Mentor Certificado GCF</p>
                
                {/* Botones en pirámide */}
                <div className="space-y-3">
                  <div className="flex justify-center">
                    <ButtonAnchor
                      buttonKey="ver_perfil"
                      templateKey="cpn"
                      actions={actions}
                      mentorLinks={mentorLinks}
                      campaignLinks={campaignLinks}
                      onActionClick={onActionClick}
                      variant="ghost"
                      size="sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <ButtonAnchor
                      buttonKey="agenda_hero"
                      templateKey="cpn"
                      actions={actions}
                      mentorLinks={mentorLinks}
                      campaignLinks={campaignLinks}
                      onActionClick={onActionClick}
                      variant="primary"
                      size="sm"
                    />
                    <ButtonAnchor
                      buttonKey="whatsapp_hero"
                      templateKey="cpn"
                      actions={actions}
                      mentorLinks={mentorLinks}
                      campaignLinks={campaignLinks}
                      onActionClick={onActionClick}
                      variant="secondary"
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// TRANSFORMA SER SECTION (NUEVA)
// ============================================
const TransformaSERSection = ({ mentorData, onActionClick }) => {
  const { actions, mentorLinks, campaignLinks } = prepareAnchorData(mentorData);

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7c3aed]/10 mb-6">
            <Heart className="w-4 h-4 text-[#7c3aed]" />
            <span className="text-sm font-body text-[#7c3aed] font-medium">Nuestra Filosofía</span>
          </div>
          
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 leading-tight mb-6">
            La transformación comienza en tu{' '}
            <span className="text-[#7c3aed]">SER</span>
          </h2>
          
          <p className="font-body text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Expandiéndose al mundo y convirtiéndose en legado. No formamos coaches que repiten técnicas. 
            Formamos seres humanos que <strong className="text-gray-900">transforman desde su propia transformación</strong>.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Sparkles,
              title: 'Desbloquea tu Potencial',
              description: 'Conecta contigo mismo a un nivel profundo. Descubre capacidades que no sabías que tenías y activa tu mejor versión.',
              color: '#7c3aed'
            },
            {
              icon: Users,
              title: 'Impacta en Otros',
              description: 'Desarrolla las competencias para guiar el crecimiento de otros. Tu transformación se convierte en el puente para la de ellos.',
              color: '#c4ff0f'
            },
            {
              icon: TrendingUp,
              title: 'Crecimiento Sostenible',
              description: 'Aprende a generar ingresos recurrentes haciendo lo que amas. Tu pasión por ayudar se convierte en tu profesión.',
              color: '#7c3aed'
            }
          ].map((item, idx) => (
            <div 
              key={idx}
              className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                style={{ backgroundColor: `${item.color}15` }}
              >
                <item.icon className="w-8 h-8" style={{ color: item.color }} />
              </div>
              <h3 className="font-heading text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
              <p className="font-body text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <ButtonAnchor
            buttonKey="iniciar_transformacion"
            templateKey="cpn"
            actions={actions}
            mentorLinks={mentorLinks}
            campaignLinks={campaignLinks}
            onActionClick={onActionClick}
            variant="primary"
            size="lg"
          />
        </div>
      </div>
    </section>
  );
};

// ============================================
// ¿ES PARA TI? SECTION (Actualizada)
// ============================================
const EsParaTiSection = ({ mentorData, onActionClick }) => {
  const { actions, mentorLinks, campaignLinks } = prepareAnchorData(mentorData);

  const perfiles = [
    'Sientes pasión genuina por acompañar el crecimiento de otros',
    'Buscas darle un propósito más profundo a tu carrera profesional',
    'Quieres herramientas científicas para generar transformación real',
    'Deseas construir una práctica profesional rentable y sostenible',
    'Estás listo para iniciar tu propia transformación primero',
    'Crees que el mundo necesita más líderes conscientes'
  ];

  return (
    <section 
      className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-fixed bg-cover bg-center"
      style={{ 
        backgroundImage: `url('https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg')` 
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed]/90 via-[#5b21b6]/85 to-[#4c1d95]/90" />
      
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-white leading-tight mb-6">
            ¿Es para ti esta{' '}
            <span className="text-[#c4ff0f]">certificación?</span>
          </h2>
          
          <p className="font-body text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Imagina un mundo donde tu pasión por ayudar a los demás se convierta en el motor 
            de tu crecimiento personal, profesional y financiero.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20">
          <p className="font-body text-white/90 text-lg mb-8 text-center">
            Esta certificación es para ti si...
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {perfiles.map((perfil, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-3 bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
              >
                <CheckCircle className="w-6 h-6 text-[#c4ff0f] flex-shrink-0 mt-0.5" />
                <span className="font-body text-white/90">{perfil}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <ButtonAnchor
              buttonKey="solicitar_entrevista"
              templateKey="cpn"
              actions={actions}
              mentorLinks={mentorLinks}
              campaignLinks={campaignLinks}
              onActionClick={onActionClick}
              variant="primary"
              size="lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// QUÉ LOGRARÁS SECTION (Actualizada)
// ============================================
const QueLograsSection = () => {
  const logros = [
    {
      icon: Brain,
      title: 'Dominio del NeuroCoaching',
      description: 'Aprende a aplicar técnicas de neurociencia en situaciones reales para obtener resultados medibles.'
    },
    {
      icon: MessageCircle,
      title: 'Maestría en ConversAcción',
      description: 'Genera conversaciones que impulsan cambio, conciencia y acción. El coaching es provocar transformación.'
    },
    {
      icon: Target,
      title: 'Claridad de Propósito',
      description: 'Conecta con tu misión de vida y aprende a guiar a otros hacia la suya.'
    },
    {
      icon: Briefcase,
      title: 'Práctica Profesional',
      description: 'Construye una carrera sostenible con herramientas de monetización éticas y efectivas.'
    },
    {
      icon: Users,
      title: 'Comunidad de Alto Valor',
      description: 'Únete a una red global de coaches y mentores que se apoyan mutuamente.'
    },
    {
      icon: Award,
      title: 'Certificación Internacional',
      description: 'Obtén una credencial avalada por la Global Coaching Federation (GCF).'
    }
  ];

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c4ff0f]/20 mb-6">
            <Trophy className="w-4 h-4 text-[#7c3aed]" />
            <span className="text-sm font-body text-[#7c3aed] font-medium">Tu Transformación</span>
          </div>
          
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 leading-tight mb-6">
            ¿Qué lograrás con esta{' '}
            <span className="text-[#7c3aed]">certificación?</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {logros.map((logro, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#7c3aed]/10 to-[#c4ff0f]/10 flex items-center justify-center mb-4">
                <logro.icon className="w-7 h-7 text-[#7c3aed]" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-gray-900 mb-2">{logro.title}</h3>
              <p className="font-body text-gray-600 text-sm leading-relaxed">{logro.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// METODOLOGÍA PEDALEAR (Enriquecida)
// ============================================
const MetodologiaSection = () => {
  const pasos = [
    { letter: 'P', title: 'Piensa', description: 'Reflexiona, explora ideas, cuestiona creencias', color: '#7c3aed' },
    { letter: 'E', title: 'Emociónate', description: 'Conecta con tu pasión y motivación profunda', color: '#a78bfa' },
    { letter: 'D', title: 'Decide', description: 'Toma decisiones conscientes y comprometidas', color: '#c4ff0f' },
    { letter: 'A', title: 'Actúa', description: 'Pon en marcha tus planes con determinación', color: '#7c3aed' },
    { letter: 'L', title: 'Lógralo', description: 'Celebra cada meta alcanzada, grande o pequeña', color: '#a78bfa' },
    { letter: 'E', title: 'Evoluciona', description: 'Transforma aprendizajes en poder personal', color: '#c4ff0f' },
    { letter: 'A', title: 'Avanza', description: 'Mantén el movimiento constante hacia adelante', color: '#7c3aed' },
    { letter: 'R', title: 'RefleAcciona', description: 'Integra pensamiento y acción con propósito', color: '#a78bfa' }
  ];

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7c3aed]/10 mb-6">
            <Compass className="w-4 h-4 text-[#7c3aed]" />
            <span className="text-sm font-body text-[#7c3aed] font-medium">Nuestra Metodología</span>
          </div>
          
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 leading-tight mb-6">
            Método{' '}
            <span className="text-[#7c3aed]">PEDALEAR</span>
          </h2>
          
          <p className="font-body text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            El ciclo de la transformación. Un sistema de guía constante que asegura movimiento 
            y giros de 360 grados en tu evolución como coach y ser humano.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 mb-12">
          {pasos.map((paso, idx) => (
            <div 
              key={idx}
              className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 md:p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              <div 
                className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4"
                style={{ backgroundColor: paso.color }}
              >
                <span className="text-xl md:text-3xl font-bold text-white">{paso.letter}</span>
              </div>
              <h3 className="font-heading text-base md:text-lg font-semibold text-gray-900 mb-1 md:mb-2">{paso.title}</h3>
              <p className="font-body text-xs md:text-sm text-gray-600 leading-relaxed">{paso.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-[#7c3aed]/10 via-purple-50 to-[#c4ff0f]/10 rounded-3xl p-8 text-center">
          <blockquote className="font-heading text-xl md:text-2xl font-semibold text-gray-900 italic">
            "El cambio verdadero no ocurre por casualidad, sino por elección."
          </blockquote>
          <p className="mt-4 font-body text-gray-600">
            ¿Estás preparado para PEDALEAR hacia una nueva realidad?
          </p>
        </div>
      </div>
    </section>
  );
};

// ============================================
// EJES TRANSFORMACIONALES (NUEVA)
// ============================================
const EjesSection = () => {
  const ejes = [
    {
      icon: Heart,
      title: 'Conectando con tu SER',
      description: 'Autoconocimiento, propósito, paz interior y alineación interna.',
      frase: 'Descubre el poder de tu esencia.'
    },
    {
      icon: Brain,
      title: 'Consciencia Cerebro Evolutiva',
      description: 'Desbloquea tu potencial, expande tu pensamiento, rompe barreras mentales.',
      frase: 'Tu mente es tu mayor aliado.'
    },
    {
      icon: Zap,
      title: 'Consciencia Corporal',
      description: 'Tu cuerpo es más que un vehículo: es un canal de sabiduría y energía.',
      frase: 'Escucha lo que tu cuerpo tiene que decir.'
    },
    {
      icon: Lightbulb,
      title: 'Consciencia Intelecto Reflexiva',
      description: 'Cuestiona, explora, profundiza. La sabiduría nace del conocimiento aplicado.',
      frase: 'Amplía tu visión del mundo.'
    },
    {
      icon: MessageSquare,
      title: 'ConversAcción',
      description: 'El coaching no es solo hablar, es provocar transformación con cada palabra.',
      frase: 'Maestría de la comunicación consciente.'
    },
    {
      icon: Shield,
      title: 'PsyCoach',
      description: 'Principios de psicología aplicados al coaching con ética y claridad.',
      frase: 'Comprender la mente es clave para acompañar.'
    },
    {
      icon: Rocket,
      title: 'RefleAcción',
      description: 'Reflexionar sin actuar es estancarse. Actuar sin reflexionar es perder el rumbo.',
      frase: 'Integra pensamiento y acción.'
    }
  ];

  return (
    <section 
      className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-fixed bg-cover bg-center"
      style={{ 
        backgroundImage: `url('https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg')` 
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#031730]/95 via-[#0a1f3d]/90 to-[#031730]/95" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
            <Layers className="w-4 h-4 text-[#c4ff0f]" />
            <span className="text-sm font-body text-white/80">Formación Integral</span>
          </div>
          
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-white leading-tight mb-6">
            7 Ejes{' '}
            <span className="text-[#c4ff0f]">Transformacionales</span>
          </h2>
          
          <p className="font-body text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
            No es solo aprender técnicas. Es desarrollar una transformación integral que abarca 
            todas las dimensiones del ser humano.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {ejes.map((eje, idx) => (
            <div 
              key={idx}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#c4ff0f]/30 hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#c4ff0f]/10 flex items-center justify-center mb-4">
                <eje.icon className="w-6 h-6 text-[#c4ff0f]" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-white mb-2">{eje.title}</h3>
              <p className="font-body text-white/60 text-sm mb-3 leading-relaxed">{eje.description}</p>
              <p className="font-body text-[#c4ff0f] text-xs italic">"{eje.frase}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// NIVELES DE CERTIFICACIÓN (Actualizada)
// ============================================
const NivelesSection = () => {
  const niveles = [
    {
      title: 'Nivel Junior',
      duracion: '280 días',
      perfil: 'Tu primer paso en el mundo del NeuroCoaching',
      transformacion: 'De interesado a Mentor en formación',
      mision: 'Aprender desde la práctica, sentir el poder de acompañar, enamorarte del arte de SER y ESTAR para otros.',
      competencias: ['Escucha activa', 'Preguntas poderosas', 'Sesiones estructuradas', 'Fundamentos neurociencia'],
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50'
    },
    {
      title: 'Nivel Senior',
      duracion: '180 días',
      perfil: 'Comprensión profunda del cambio y mirada estratégica',
      transformacion: 'De coach en formación a NeuroCoach con dominio avanzado',
      mision: 'Elevar la calidad de las sesiones, adaptarte a diferentes clientes, aplicar estrategias de mayor impacto.',
      competencias: ['Patrones avanzados', 'Procesos complejos', 'Neurociencia aplicada', 'Liderazgo consciente'],
      color: 'from-[#7c3aed] to-purple-700',
      bgColor: 'from-purple-50 to-violet-50'
    },
    {
      title: 'Nivel Máster',
      duracion: '120 días',
      perfil: 'Referente capaz de crear transformación a gran escala',
      transformacion: 'De coach avanzado a líder del NeuroCoaching',
      mision: 'Convertirte en referente, desarrollar tu propio enfoque, formar a la próxima generación.',
      competencias: ['Modelos propios', 'Impacto empresarial', 'Mentoría de coaches', 'Legado transformacional'],
      color: 'from-amber-500 to-orange-600',
      bgColor: 'from-amber-50 to-orange-50'
    }
  ];

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7c3aed]/10 mb-6">
            <GraduationCap className="w-4 h-4 text-[#7c3aed]" />
            <span className="text-sm font-body text-[#7c3aed] font-medium">Tu Camino</span>
          </div>
          
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 leading-tight mb-6">
            3 Niveles de{' '}
            <span className="text-[#7c3aed]">Certificación</span>
          </h2>
          
          <p className="font-body text-lg text-gray-600 max-w-3xl mx-auto">
            Un recorrido estructurado con objetivos claros para cada etapa de tu evolución.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {niveles.map((nivel, idx) => (
            <div 
              key={idx}
              className={`bg-gradient-to-br ${nivel.bgColor} rounded-3xl p-6 md:p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}
            >
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${nivel.color} text-white text-sm font-semibold mb-6`}>
                <Clock className="w-4 h-4" />
                <span>{nivel.duracion}</span>
              </div>
              
              <h3 className="font-heading text-2xl font-bold text-gray-900 mb-3">{nivel.title}</h3>
              <p className="font-body text-gray-700 mb-4">{nivel.perfil}</p>
              
              <div className="bg-white/60 rounded-xl p-4 mb-4">
                <p className="font-body text-sm text-gray-600 mb-1">Tu transformación:</p>
                <p className="font-heading font-semibold text-gray-900">{nivel.transformacion}</p>
              </div>
              
              <p className="font-body text-sm text-gray-600 italic mb-4">"{nivel.mision}"</p>
              
              <div className="flex flex-wrap gap-2">
                {nivel.competencias.map((comp, i) => (
                  <span key={i} className="px-3 py-1 bg-white/80 rounded-full text-xs font-medium text-gray-700">
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="font-body text-gray-600">
            <strong className="text-gray-900">Acceso total:</strong> 3 años para completar tu certificación a tu ritmo
          </p>
        </div>
      </div>
    </section>
  );
};

// ============================================
// ECOSISTEMA DIGITAL (NUEVA)
// ============================================
const EcosistemaDigitalSection = () => {
  const herramientas = [
    { icon: Calendar, name: 'iCalendar', desc: 'Gestiona tus sesiones' },
    { icon: Layout, name: 'iProjects', desc: 'Proyectos ágiles guiados' },
    { icon: BookOpen, name: 'iLearning', desc: 'Plataforma e-learning' },
    { icon: Users, name: 'Kommunity', desc: 'Red de coaches' },
    { icon: Video, name: 'iMeet', desc: 'Salas de encuentro' },
    { icon: Globe, name: 'iNetwork', desc: 'Networking global' },
    { icon: Play, name: 'iMedia', desc: 'Contenido multimedia' },
    { icon: FileText, name: 'EbookTK', desc: 'Biblioteca digital' }
  ];

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7c3aed]/10">
              <Zap className="w-4 h-4 text-[#7c3aed]" />
              <span className="text-sm font-body text-[#7c3aed] font-medium">Tecnología</span>
            </div>
            
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 leading-tight">
              Un ecosistema digital{' '}
              <span className="text-[#7c3aed]">a tu servicio</span>
            </h2>
            
            <div className="space-y-4 font-body text-lg text-gray-600 leading-relaxed">
              <p>
                No eres solo un usuario, eres el dueño de una plataforma que <strong className="text-gray-900">trabaja para ti</strong>.
              </p>
              <p>
                Herramientas digitales de vanguardia diseñadas para potenciar tu desarrollo, 
                gestionar tu práctica y conectar con tu comunidad.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-[#7c3aed]/10 to-[#c4ff0f]/10 rounded-xl p-6 border border-[#7c3aed]/20">
              <p className="font-body text-gray-700">
                <span className="text-[#7c3aed] font-semibold">La tecnología al servicio del ser humano.</span> 
                {' '}Herramientas que potencian tu trabajo, nunca lo reemplazan.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            {herramientas.map((tool, idx) => (
              <div 
                key={idx}
                className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <tool.icon className="w-6 h-6 text-[#7c3aed]" />
                </div>
                <p className="font-heading font-semibold text-gray-900 text-sm mb-1">{tool.name}</p>
                <p className="font-body text-gray-500 text-xs">{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// COMUNIDAD SECTION
// ============================================
const ComunidadSection = () => (
  <section 
    className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-fixed bg-cover bg-center"
    style={{ 
      backgroundImage: `url('https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg')` 
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed]/90 via-[#5b21b6]/85 to-[#4c1d95]/90" />
    
    <div className="relative z-10 max-w-5xl mx-auto text-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
        <Users className="w-4 h-4 text-[#c4ff0f]" />
        <span className="text-sm font-body text-white/80">Kommunity</span>
      </div>
      
      <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-white leading-tight mb-6">
        Una comunidad que{' '}
        <span className="text-[#c4ff0f]">te sostiene</span>
      </h2>
      
      <p className="font-body text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-12">
        No caminas solo. Formas parte de una red vibrante de coaches y mentores que se apoyan, 
        comparten y crecen juntos. Casi 2 décadas cambiando vidas.
      </p>
      
      <div className="grid sm:grid-cols-3 gap-6">
        {[
          { number: '+100', label: 'Coaches certificados' },
          { number: '18', label: 'Años de experiencia' },
          { number: '+1000', label: 'Vidas transformadas' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <p className="font-heading text-4xl md:text-5xl font-bold text-[#c4ff0f] mb-2">{stat.number}</p>
            <p className="font-body text-white/80">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ============================================
// TU SIGUIENTE PASO (Ex-Partner, Reenfocado)
// ============================================
const SiguientePasoSection = ({ mentorData, onActionClick }) => {
  const { actions, mentorLinks, campaignLinks } = prepareAnchorData(mentorData);

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#faf8f5]">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c4ff0f]/20">
              <Rocket className="w-4 h-4 text-[#7c3aed]" />
              <span className="text-sm font-body text-[#7c3aed] font-medium">Tu Siguiente Paso</span>
            </div>
            
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 leading-tight">
              ¿Ya me certifiqué...{' '}
              <span className="text-[#7c3aed]">y ahora qué?</span>
            </h2>
            
            <div className="space-y-4 font-body text-lg text-gray-600 leading-relaxed">
              <p>
                Tu certificación <strong className="text-gray-900">no es el final</strong>. 
                Es la puerta de entrada a un nuevo viaje como mentor.
              </p>
              <p>
                Al graduarte, tienes la posibilidad de convertirte en <strong className="text-[#7c3aed]">Mentor del Ecosistema InverSer</strong> 
                {' '}a través del Mentor & Partner Program.
              </p>
              <p>
                Comienza a monetizar tus nuevas competencias acompañando a otros en su transformación. 
                Tu camino no termina aquí... <strong className="text-gray-900">apenas comienza</strong>.
              </p>
            </div>
            
            <ul className="space-y-3">
              {[
                'Acompaña a nuevos coaches en su certificación',
                'Genera ingresos recurrentes haciendo lo que amas',
                'Forma parte del equipo de mentores InverSer',
                'Escala tu impacto sin límites geográficos'
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#c4ff0f]" />
                  <span className="font-body text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            
            <ButtonAnchor
              buttonKey="partner_cta"
              templateKey="cpn"
              actions={actions}
              mentorLinks={mentorLinks}
              campaignLinks={campaignLinks}
              onActionClick={onActionClick}
              variant="primary"
              size="lg"
            />
          </div>
          
          <div className="bg-gradient-to-br from-[#7c3aed]/10 via-purple-50 to-[#c4ff0f]/10 rounded-3xl p-8 md:p-10 border border-[#7c3aed]/20">
            <Quote className="w-12 h-12 text-[#7c3aed]/30 mb-6" />
            <blockquote className="font-heading text-xl md:text-2xl text-gray-900 leading-relaxed mb-6">
              "Ser mentor en InverSer no es solo acompañar a otros en su proceso de transformación, 
              es escalar tu propósito y profesionalizar tu impacto."
            </blockquote>
            <p className="font-body text-[#7c3aed] font-medium">
              De la Inspiración a la Monetización
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// ACREDITACIONES SECTION
// ============================================
const AcreditacionesSection = () => (
  <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-gray-100">
    <div className="max-w-5xl mx-auto text-center">
      <p className="font-body text-sm text-gray-500 uppercase tracking-wider mb-8">
        Certificación avalada por
      </p>
      
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
        <div className="flex flex-col items-center">
          <Award className="w-16 h-16 text-[#7c3aed] mb-3" />
          <p className="font-heading font-semibold text-gray-900">Global Coaching Federation</p>
          <p className="font-body text-sm text-gray-500">Reconocimiento Internacional</p>
        </div>
        
        <div className="h-16 w-px bg-gray-200 hidden md:block" />
        
        <div className="flex flex-col items-center">
          <img 
            src="https://inverser.us/wp-content/uploads/2024/10/InverSer-logo-200px.png" 
            alt="InverSer" 
            className="h-12 mb-3"
          />
          <p className="font-heading font-semibold text-gray-900">InverSer</p>
          <p className="font-body text-sm text-gray-500">18 años transformando vidas</p>
        </div>
      </div>
    </div>
  </section>
);

// ============================================
// TESTIMONIOS SECTION (Existente)
// ============================================
const TestimoniosSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonios = [
    {
      name: "Jannio Rojas",
      image: "https://customer-assets.emergentagent.com/job_mentor-program/artifacts/zpfcfg5a_Jannio%20Rojas.jpg",
      text: `Si tuviese que decir qué significó para mí la formación de NeuroCoaching, la verdad lo resumo en una frase: Puntual. Una vida antes y una vida después.

Hubo una ruptura incluso de identidad, un despertar, fue como estar siempre dormido y luego vivir una vida de cambio. Desde allí no volví nunca a ser el mismo, fue desflorada mi ignorancia y absorbido por el mundo del imposible, ahora posible.

Hoy me veo al espejo y confirmo: comprobado que para bien también puede.`
    },
    {
      name: "Luis Cabrera",
      image: "https://customer-assets.emergentagent.com/job_mentor-program/artifacts/58tedicy_Luis%20Cabrera.png",
      text: `Hablar de la experiencia en la Formación Coaching Neuro Evolutivo, es describir un viaje de transformación. Pude encontrar la conexión con mi Misión de Vida: conducir al prójimo a ir en búsqueda de su felicidad.

Esa experiencia marcó un antes y un después en mí. Conocí lo maravilloso que es estar claro de quién eres y hacia dónde vas.

Si me tocara describir este proceso con una palabra, lo dibujaría como un Renacimiento.`
    },
    {
      name: "Saray Torres",
      image: "https://customer-assets.emergentagent.com/job_mentor-program/artifacts/9pkhi67e_Saray%20Torres.jpg",
      text: `Mi vida tuvo un 'antes' y un 'después' de mi formación de Neurocoaching; todo cambió en todos los sentidos.

Principalmente, me volví más consciente de mi lenguaje, de mis pensamientos y de mis acciones. Comprendí que mi propósito de vida es servir y ayudar a otros.

El Neurocoaching me regaló un mundo de posibilidades dentro de un estilo de vida consciente.`
    },
    {
      name: "Carmen Julia Cabello",
      image: "https://customer-assets.emergentagent.com/job_mentor-program/artifacts/9wnjyc0k_Carmen%20Julia%20Cabello.jpg",
      text: `Aprendí a darme el primer lugar en mi vida, dejé de ser quien creí ser por mucho tiempo, para convertirme en un ser de infinitas posibilidades.

Con la valentía para probar cada nueva idea, la humildad para reconocer los fallos, y la disposición de celebrar mis aciertos siempre…

No soy quien soy ahora, sino todo lo que puedo ser.`
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonios.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonios.length]);

  const goToSlide = (index) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#031730] via-[#0a1f3d] to-[#031730]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-[#c4ff0f]/20 text-[#c4ff0f] text-sm font-medium rounded-full mb-4">
            Testimonios
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-4">
            Historias de{' '}
            <span className="text-[#c4ff0f]">Transformación</span>
          </h2>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6 md:p-10">
          <Quote className="w-10 h-10 text-[#c4ff0f]/30 mb-6" />
          
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-[#c4ff0f]/40">
                <img
                  src={testimonios[currentIndex].image}
                  alt={testimonios[currentIndex].name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <p className="text-white/90 text-base md:text-lg leading-relaxed mb-6 whitespace-pre-line">
                "{testimonios[currentIndex].text}"
              </p>
              
              <div className="border-t border-white/10 pt-4">
                <p className="text-[#c4ff0f] font-semibold text-lg">{testimonios[currentIndex].name}</p>
                <p className="text-white/50 text-sm">Coach Certificado NeuroCoaching</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {testimonios.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-[#c4ff0f] w-8' : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// FAQ SECTION (Actualizada)
// ============================================
const FAQSectionCPN = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "¿Qué es la Certificación Profesional de NeuroCoaching?",
      answer: "Es mucho más que un título. Es una experiencia de transformación que te convierte en un coach de alto impacto. Combina neurociencia aplicada, metodologías probadas y un ecosistema de herramientas para que puedas transformar vidas mientras desarrollas tu práctica profesional."
    },
    {
      question: "¿Cuánto dura la certificación completa?",
      answer: "La certificación tiene 3 niveles: Junior (280 días), Senior (180 días) y Máster (120 días). Tienes acceso total a la plataforma durante 3 años para completarla a tu ritmo. Puedes empezar a ejercer como Coach Junior mientras avanzas en los siguientes niveles."
    },
    {
      question: "¿Necesito experiencia previa en coaching?",
      answer: "No es necesario. El programa está diseñado para llevarte desde cero hasta convertirte en un NeuroCoach profesional. Lo que sí necesitas es pasión genuina por el desarrollo humano y compromiso con tu propia transformación."
    },
    {
      question: "¿Cómo es la modalidad de estudio?",
      answer: "Es 100% online con flexibilidad total. Tienes acceso a la plataforma iLearning con contenidos multimedia, sesiones en vivo con tu mentor, encuentros grupales en la Kommunity, y herramientas prácticas para aplicar lo aprendido."
    },
    {
      question: "¿Qué validez internacional tiene la certificación?",
      answer: "La certificación está avalada por la Global Coaching Federation (GCF), lo que te brinda reconocimiento internacional y credibilidad profesional en cualquier parte del mundo."
    },
    {
      question: "¿Puedo generar ingresos mientras estudio?",
      answer: "Sí. Al completar el Nivel Junior puedes comenzar a realizar sesiones de coaching y generar tus primeros ingresos. Además, al graduarte tienes la opción de convertirte en Mentor del Ecosistema a través del Mentor & Partner Program."
    },
    {
      question: "¿Qué metodología utilizan?",
      answer: "Utilizamos la metodología exclusiva PEDALEAR (Piensa, Emociónate, Decide, Actúa, Lógralo, Evoluciona, Avanza, RefleAcciona) junto con 7 Ejes Transformacionales que abarcan todas las dimensiones del ser humano."
    },
    {
      question: "¿Qué herramientas digitales tendré acceso?",
      answer: "Tendrás acceso al ecosistema completo: iLearning (plataforma educativa), iCalendar (gestión de sesiones), iProjects (proyectos ágiles), Kommunity (red de coaches), iMeet (salas virtuales), y muchas más herramientas profesionales."
    },
    {
      question: "¿Cómo es el acompañamiento durante la formación?",
      answer: "Tendrás un mentor certificado GCF asignado que te acompañará durante todo el proceso. Además, formarás parte de una comunidad vibrante de coaches que se apoyan mutuamente. No caminas solo."
    },
    {
      question: "¿Qué pasa después de certificarme?",
      answer: "Tu certificación es la puerta de entrada a nuevas posibilidades. Puedes ejercer como coach independiente, unirte al equipo de mentores de InverSer a través del Mentor & Partner Program, o combinar ambas opciones para maximizar tu impacto e ingresos."
    }
  ];

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#faf8f5]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7c3aed]/10 mb-6">
            <HelpCircle className="w-4 h-4 text-[#7c3aed]" />
            <span className="text-sm font-body text-[#7c3aed] font-medium">FAQ</span>
          </div>
          
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 leading-tight mb-4">
            Preguntas{' '}
            <span className="text-[#7c3aed]">Frecuentes</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className="font-body font-semibold text-gray-900 pr-4">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-[#7c3aed] flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-6 pb-6">
                  <div className="border-t border-gray-100 pt-4">
                    <p className="font-body text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// CTA FINAL SECTION
// ============================================
const CTAFinalSection = ({ mentorData, onActionClick }) => {
  const { actions, mentorLinks, campaignLinks } = prepareAnchorData(mentorData);

  return (
    <section 
      className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-fixed bg-cover bg-center"
      style={{ 
        backgroundImage: `url('https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg')` 
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed]/90 via-[#5b21b6]/85 to-[#4c1d95]/90" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight mb-6">
          ¿Estás listo para iniciar tu{' '}
          <span className="text-[#c4ff0f]">transformación?</span>
        </h2>
        
        <p className="font-body text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          El primer paso es tuyo. Da el salto y descubre cómo convertirte en un coach y mentor 
          que genera cambios reales… y también ingresos recurrentes.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <ButtonAnchor
            buttonKey="formulario_cta"
            templateKey="cpn"
            actions={actions}
            mentorLinks={mentorLinks}
            campaignLinks={campaignLinks}
            onActionClick={onActionClick}
            variant="primary"
            size="lg"
          />
        </div>
        
        <p className="font-heading text-xl text-white/60 italic">
          ¡Iniciemos HOY, juntos el camino de tu transformación!
        </p>
      </div>
    </section>
  );
};

// ============================================
// FOOTER
// ============================================
const FooterCPN = ({ mentorData, onActionClick }) => {
  const mentor = mentorData?.mentor || {};
  const hasMentor = mentor.first_name && mentor.first_name !== '';
  const { actions, mentorLinks, campaignLinks } = prepareAnchorData(mentorData);

  return (
    <footer className="bg-[#031730] text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Logo y descripción */}
          <div>
            <img 
              src="https://inverser.us/wp-content/uploads/2024/10/InverSer-logo-200px.png" 
              alt="InverSer" 
              className="h-10 mb-4"
            />
            <p className="font-body text-white/60 text-sm leading-relaxed">
              Transformando vidas desde el SER. Más de 18 años formando coaches y mentores 
              que generan impacto real en el mundo.
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2 font-body text-white/60 text-sm">
              <li><a href="#" className="hover:text-[#c4ff0f] transition-colors">Sobre InverSer</a></li>
              <li><a href="#" className="hover:text-[#c4ff0f] transition-colors">Certificación</a></li>
              <li><a href="#" className="hover:text-[#c4ff0f] transition-colors">Mentor Program</a></li>
              <li><a href="#" className="hover:text-[#c4ff0f] transition-colors">Contacto</a></li>
            </ul>
          </div>
          
          {/* Mentor */}
          <div>
            {hasMentor && (
              <>
                <div className="flex items-center gap-3 mb-4">
                  {mentor.photo_url && (
                    <img 
                      src={getImageUrl(mentor.photo_url)} 
                      alt={`${mentor.first_name} ${mentor.last_name}`}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#c4ff0f]/40"
                    />
                  )}
                  <div>
                    <p className="text-xs text-white/50">Tu mentor</p>
                    <p className="font-heading font-semibold">{mentor.first_name} {mentor.last_name}</p>
                  </div>
                </div>
                <ButtonAnchor
                  buttonKey="ir_perfil_footer"
                  templateKey="cpn"
                  actions={actions}
                  mentorLinks={mentorLinks}
                  campaignLinks={campaignLinks}
                  onActionClick={onActionClick}
                  variant="ghost"
                  size="sm"
                />
              </>
            )}
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="font-body text-white/40 text-sm">
            © 2009-2026 INVERSER SBS LLC · Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  );
};

// ============================================
// MAIN LANDING CPN v2.0
// ============================================
const LandingCPN = ({ mentorData, onActionClick }) => {
  useEffect(() => {
    const campaignName = mentorData?.campaign?.name || 'Certificación Profesional de NeuroCoaching';
    document.title = campaignName;
  }, [mentorData]);

  return (
    <div className="min-h-screen font-body">
      <NavbarCPN mentorData={mentorData} onActionClick={onActionClick} />
      <HeroCPN mentorData={mentorData} onActionClick={onActionClick} />
      <TransformaSERSection mentorData={mentorData} onActionClick={onActionClick} />
      <EsParaTiSection mentorData={mentorData} onActionClick={onActionClick} />
      <QueLograsSection />
      <MetodologiaSection />
      <EjesSection />
      <NivelesSection />
      <EcosistemaDigitalSection />
      <ComunidadSection />
      <SiguientePasoSection mentorData={mentorData} onActionClick={onActionClick} />
      <AcreditacionesSection />
      <TestimoniosSection />
      <FAQSectionCPN />
      <CTAFinalSection mentorData={mentorData} onActionClick={onActionClick} />
      <FooterCPN mentorData={mentorData} onActionClick={onActionClick} />
    </div>
  );
};

export default LandingCPN;
