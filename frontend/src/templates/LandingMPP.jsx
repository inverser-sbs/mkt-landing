/**
 * LandingMPP - Landing para Mentor & Partner Program (Plan Pioneros)
 * campaign_key: mpp
 * 
 * VERSIÓN 4: Copywriting completo + Tipografía elegante
 * 
 * TIPOGRAFÍAS:
 * - Cormorant Garamond: Headings (elegante, serif clásica)
 * - Plus Jakarta Sans: Body (moderna, profesional, legible)
 * 
 * FILOSOFÍA:
 * - Contenido completo que enamora y vende
 * - Diseño visual inmersivo (mantenido de v3)
 * - Tipografía que transmite profesionalismo y elegancia
 */

import React, { useEffect } from 'react';
import { 
  Calendar, Clock, Users, BookOpen, Brain, MessageSquare,
  Video, Headphones, Layout, Globe, Briefcase, Link2,
  Award, Star, ChevronRight, ChevronDown, Mail, Phone, ExternalLink,
  Sparkles, Target, Heart, Zap, Shield, TrendingUp,
  Play, Mic, Move, Grid, Send, DollarSign, FileText,
  CheckCircle, ArrowRight, HelpCircle, Handshake
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { getImageUrl } from '../utils/imageUrl';
import ButtonAnchor, { prepareAnchorData } from '../components/ButtonAnchor';

// ============================================
// IMÁGENES DE AMBIENTE
// ============================================
const IMAGES = {
  heroAmbient: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&q=80',
  communityAmbient: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=80',
  transformationAmbient: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  techHumanAmbient: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80',
};

// ============================================
// LOGO COMPONENT
// ============================================
const LogoMPP = () => (
  <img 
    src="https://customer-assets.emergentagent.com/job_landing-debug-1/artifacts/8rox6813_logo-02.png"
    alt="InverSer"
    className="h-10 md:h-12 w-auto"
  />
);

// ============================================
// NAVBAR
// ============================================
const NavbarMPP = ({ mentorData, onActionClick }) => {
  const { actions, mentorLinks, campaignLinks } = prepareAnchorData(mentorData);
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#031730]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <LogoMPP />
          <div className="hidden md:flex items-center space-x-8 text-sm font-body text-white/70">
            <a href="#ecosistema" className="hover:text-[#c4ff0f] transition-all duration-300">Ecosistema</a>
            <a href="#certificacion" className="hover:text-[#c4ff0f] transition-all duration-300">Certificación</a>
            <a href="#herramientas" className="hover:text-[#c4ff0f] transition-all duration-300">Herramientas</a>
            <a href="#comunidad" className="hover:text-[#c4ff0f] transition-all duration-300">Comunidad</a>
            <a href="#faq" className="hover:text-[#c4ff0f] transition-all duration-300">FAQ</a>
          </div>
          <ButtonAnchor
            buttonKey="postular_nav_mpp"
            templateKey="mpp"
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
const HeroMPP = ({ mentorData, onActionClick }) => {
  const mentor = mentorData?.mentor || {
    first_name: '',
    last_name: '',
    photo_url: null,
    title: 'Team Líder INVERSER SBS'
  };
  
  const { actions, mentorLinks, campaignLinks } = prepareAnchorData(mentorData);
  const hasMentor = mentor.first_name && mentor.first_name !== '';

  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden">
      {/* Imagen de fondo */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${IMAGES.heroAmbient})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#031730] via-[#031730]/95 to-[#031730]/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#031730] via-transparent to-[#031730]/50" />
      </div>
      
      {/* Elementos decorativos */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#7c3aed]/20 rounded-full filter blur-[150px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#c4ff0f]/10 rounded-full filter blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16 items-center">
          {/* Contenido principal */}
          <div className="lg:col-span-3 space-y-6 md:space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-[#c4ff0f]" />
              <span className="text-sm font-body text-white/80">Plan Pioneros</span>
            </div>
            
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight">
              <span className="text-white">Mentor</span>
              <span className="text-[#c4ff0f]"> & </span>
              <span className="text-white">Partner</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] via-[#a78bfa] to-[#c4ff0f]">
                Program
              </span>
            </h1>
            
            <p className="font-body text-lg md:text-xl lg:text-2xl text-white/80 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Bienvenido a una nueva dimensión del mentoring. Un <span className="text-[#c4ff0f] font-medium">ecosistema de empoderamiento</span> donde tu experiencia, tu criterio y tu vocación se amplifican.
            </p>
            
            <p className="font-body text-base md:text-lg text-white/50 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              No es un curso. No es una certificación aislada. Es una <span className="text-white/70">infraestructura completa</span> para que puedas ejercer tu rol de mentor con profundidad, respaldo y proyección.
            </p>
          </div>
          
          {/* Mentor card */}
          <div className="lg:col-span-2 flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-[#7c3aed]/40 to-[#c4ff0f]/40 rounded-3xl blur-2xl opacity-50" />
              
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-8 text-center w-full max-w-[340px] md:max-w-[420px]">
                <div className="relative w-36 h-36 mx-auto mb-6">
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
                
                <p className="font-heading text-2xl font-semibold text-white mb-1">
                  {hasMentor ? `${mentor.first_name} ${mentor.last_name}` : 'Tu Mentor'}
                </p>
                <p className="font-body text-[#c4ff0f] text-sm mb-6">Team Líder<br />INVERSER SBS</p>
                
                {/* Botones en pirámide: Ver Perfil arriba, los otros dos lado a lado */}
                <div className="space-y-3 w-full">
                  {/* Ver Perfil - arriba centrado */}
                  <div className="flex justify-center">
                    <ButtonAnchor
                      buttonKey="ver_perfil_mpp"
                      templateKey="mpp"
                      actions={actions}
                      mentorLinks={mentorLinks}
                      campaignLinks={campaignLinks}
                      onActionClick={onActionClick}
                      variant="outline"
                      size="sm"
                    />
                  </div>
                  {/* Agendar y WhatsApp - lado a lado */}
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <ButtonAnchor
                      buttonKey="agendar_mpp"
                      templateKey="mpp"
                      actions={actions}
                      mentorLinks={mentorLinks}
                      campaignLinks={campaignLinks}
                      onActionClick={onActionClick}
                      variant="primary"
                      size="sm"
                    />
                    <ButtonAnchor
                      buttonKey="whatsapp_mpp"
                      templateKey="mpp"
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
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/40 rounded-full" />
        </div>
      </div>
    </section>
  );
};

// ============================================
// ECOSISTEMA - CONTENIDO COMPLETO CON FONDO
// ============================================
const IntroEcosistemaSection = () => (
  <section id="ecosistema" className="relative py-5 md:py-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
    {/* Imagen de fondo sutil */}
    <div className="absolute inset-0">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-[0.03]"
        style={{ backgroundImage: `url(https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&q=80)` }}
      />
      <div className="absolute inset-0 bg-[#faf8f5]" />
    </div>
    
    <div className="relative z-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-5 md:mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7c3aed]/10 mb-3 md:mb-4">
          <Target className="w-4 h-4 text-[#7c3aed]" />
          <span className="text-sm font-body text-[#7c3aed] font-medium">El Ecosistema</span>
        </div>
        
        <h2 className="font-heading text-2xl md:text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight">
          Aquí no vienes a consumir contenidos.
          <br />
          <span className="text-[#7c3aed]">Vienes a habitar un ecosistema.</span>
        </h2>
      </div>
      
      {/* Contenido completo */}
      <div className="space-y-4 md:space-y-6 font-body text-base md:text-lg text-gray-600 leading-[1.7] md:leading-[1.8]">
        <p className="first-letter:text-5xl md:first-letter:text-6xl first-letter:font-heading first-letter:font-bold first-letter:text-[#7c3aed] first-letter:float-left first-letter:mr-2 md:first-letter:mr-3 first-letter:mt-1">
          Vivimos en un tiempo vertiginoso. La Inteligencia Artificial avanza sin pausa, automatiza procesos, optimiza decisiones y redefine el trabajo. Pero mientras la tecnología crece, algo queda en riesgo: la <strong className="text-gray-900 font-semibold">capacidad humana de comprender, sostener y acompañar procesos emocionales y vitales</strong>.
        </p>
        
        <p>
          Las personas no solo necesitan respuestas. Necesitan presencia. Necesitan alguien que les ayude a ver lo que aún no ven. Alguien que no les dé fórmulas, sino que les acompañe en el camino de descubrir las propias. Ese rol —el del mentor, el coach, el acompañante consciente— <strong className="text-gray-900 font-semibold">no puede ser reemplazado por una máquina</strong>. Pero sí puede ser potenciado por la tecnología adecuada.
        </p>
        
        {/* Quote destacado */}
        <blockquote className="relative py-4 md:py-8 my-4 md:my-10">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#7c3aed] to-[#c4ff0f] rounded-full" />
          <p className="pl-6 font-heading text-lg md:text-2xl lg:text-3xl font-medium text-gray-900 italic leading-snug">
            &ldquo;InverSer evoluciona desde ahí. Desde años de experiencia real en el mundo digital, en la formación de coaches, en procesos profundos de transformación humana.&rdquo;
          </p>
        </blockquote>
        
        <p>
          No somos una plataforma más. No somos un marketplace de servicios. <strong className="text-gray-900 font-semibold">Somos un ecosistema para mentores conscientes</strong>. Un lugar donde la tecnología no deshumaniza, sino que amplifica tu capacidad de impacto.
        </p>
        
        <p className="text-center font-heading text-base md:text-2xl font-medium text-gray-900 py-2 md:py-4 leading-relaxed">
          Hoy, InverSer se expresa con más claridad en ese punto donde{' '}
          <span className="text-[#7c3aed]">la tecnología necesita conciencia</span>.
          <br />
          Donde la información necesita sentido.
          <br />
          Y donde las personas necesitan mentores preparados para este nuevo mundo.
        </p>
        
        <p>
          Si eres coach, terapeuta, formador, consultor, líder de equipos o simplemente una persona con vocación de acompañar a otros… <strong className="text-gray-900 font-semibold">este es tu lugar</strong>. Aquí encontrarás estructura sin rigidez, herramientas sin frialdad, comunidad sin competencia. Un espacio donde tu experiencia se vuelve legado. Y donde cada mentee que acompañas se convierte en semilla de una transformación mayor.
        </p>
      </div>
      
      {/* Tres pilares */}
      <div className="grid md:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-10">
        {[
          { icon: Heart, text: 'Estructura sin rigidez', desc: 'Flexibilidad que respeta tu estilo' },
          { icon: Zap, text: 'Herramientas sin frialdad', desc: 'Tecnología con alma y propósito' },
          { icon: Users, text: 'Comunidad sin competencia', desc: 'Crecimiento compartido y genuino' }
        ].map((item, idx) => (
          <div key={idx} className="text-center group">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#7c3aed]/10 to-[#c4ff0f]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <item.icon className="w-8 h-8 text-[#7c3aed]" />
            </div>
            <p className="font-heading text-lg font-semibold text-gray-900 mb-1">{item.text}</p>
            <p className="font-body text-sm text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ============================================
// CERTIFICACIÓN - CONTENIDO COMPLETO
// ============================================
const CertificacionSection = ({ mentorData, onActionClick }) => {
  const { actions, mentorLinks, campaignLinks } = prepareAnchorData(mentorData);

  return (
    <section id="certificacion" className="py-12 md:py-10 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-4xl mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF9100]/10 mb-6">
            <Award className="w-4 h-4 text-[#FF9100]" />
            <span className="text-sm font-body text-[#FF9100] font-medium">El Corazón de tu Impacto</span>
          </div>
          
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 leading-tight mb-8">
            Certifica con Propósito.
            <br />
            <span className="text-[#7c3aed]">Escala tu Mentoría.</span>
          </h2>
          
          <p className="font-body text-xl md:text-2xl text-gray-600 leading-relaxed">
            ¿Y si pudieras acompañar a otros en un viaje de transformación… con un programa ya creado, avalado y listo para escalar?
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20">
          {/* Contenido */}
          <div className="space-y-8">
            <div className="font-body text-lg text-gray-600 leading-[1.8] space-y-6">
              <p>
                En InverSer no vienes a aprender de cero. Vienes a convertirte en un <strong className="text-gray-900 font-semibold">canal de expansión</strong>. Como Mentor & Partner, tendrás acceso a una certificación profesional de NeuroCoaching completamente lista para entregar a tus aprendices.
              </p>
              
              <p>
                No tienes que crear los contenidos. No tienes que diseñar los ejercicios. No tienes que montar una plataforma. <strong className="text-gray-900 font-semibold">Todo eso ya existe</strong>. Tu rol es el más importante: acompañar, guiar, estar presente. Ser el faro que ilumina el camino de transformación.
              </p>
              
              <p>
                Este no es un programa teórico. Es una <strong className="text-gray-900 font-semibold">arquitectura viva</strong> construida desde la experiencia real, con metodologías probadas y un sistema de acompañamiento que te permite escalar sin perder profundidad.
              </p>
            </div>
            
            {/* Acreditaciones */}
            <div className="pt-8 border-t border-gray-100">
              <p className="font-body text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Programa avalado por</p>
              <div className="space-y-3">
                {[
                  'Global Coaching Federation (GCF)',
                  'Florida Global University',
                  'Centro de Educación y Liderazgo',
                  'Confederación Interamericana de Coaching'
                ].map((name, idx) => (
                  <div key={idx} className="flex items-center gap-3 font-body text-sm text-gray-600">
                    <Award className="w-4 h-4 text-[#7c3aed]" />
                    {name}
                  </div>
                ))}
              </div>
            </div>
            
            <ButtonAnchor
              buttonKey="ver_certificacion_mpp"
              templateKey="mpp"
              actions={actions}
              mentorLinks={mentorLinks}
              campaignLinks={campaignLinks}
              onActionClick={onActionClick}
              variant="primary"
              size="default"
            />
          </div>
          
          {/* Card de beneficios */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-[#7c3aed]/5 to-[#c4ff0f]/5 rounded-3xl" />
            <div className="relative bg-[#031730] rounded-2xl p-8 md:p-10 text-white">
              <h3 className="font-heading text-2xl font-semibold mb-8 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#c4ff0f]/20 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-[#c4ff0f]" />
                </div>
                ¿Qué obtienes exactamente?
              </h3>
              
              <ul className="space-y-5 font-body">
                {[
                  'Certificación estructurada en 3 niveles: Junior, Senior y Máster',
                  '1500 Horas de Evolución y Transformación profunda',
                  'Plataforma completamente desarrollada para tus mentees',
                  'Método PEDALEAR: ciclo de transformación con estructura',
                  'Método CRECE+: crecimiento continuo a través de conexión',
                  'Tu propia landing personalizada para invitar prospectos',
                  'Acceso al ecosistema completo de herramientas InverSer'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <CheckCircle className="w-5 h-5 text-[#c4ff0f] flex-shrink-0 mt-0.5" />
                    <span className="text-white/85">{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-10 pt-8 border-t border-white/10 space-y-4">
                <div className="bg-white/5 rounded-xl p-5">
                  <p className="font-body text-sm text-white/70 leading-relaxed">
                    <span className="text-[#c4ff0f] font-medium">Tu rol:</span> Acompañar, guiar, estar presente. La tecnología, los contenidos, la infraestructura… ya están cubiertos por InverSer. Tú te enfocas en lo que mejor sabes hacer: <strong className="text-white">transformar vidas</strong>.
                  </p>
                </div>
                
                <div className="bg-[#c4ff0f]/10 rounded-xl p-5 border border-[#c4ff0f]/20">
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <span className="text-[#c4ff0f] font-medium">💰 Monetización con sentido:</span> Comercializa esta certificación y quédate con la mayor parte del ingreso. No trabajas para InverSer. <strong className="text-white">Eres dueño de tu mentoría</strong>. Nosotros solo te damos las herramientas para que tu impacto sea sostenible.
                  </p>
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
// STATEMENT SECTION
// ============================================
const StatementSection = () => (
  <section className="relative py-32 md:py-40 overflow-hidden">
    <div className="absolute inset-0">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${IMAGES.transformationAmbient})` }}
      />
      <div className="absolute inset-0 bg-[#031730]/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#7c3aed]/20 to-transparent" />
    </div>
    
    <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p className="font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium text-white leading-[1.3]">
        Si eres coach, terapeuta, formador, consultor, líder de equipos o una persona con vocación de acompañar a otros…
      </p>
      <p className="font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-[#c4ff0f] mt-8">
        este es tu lugar.
      </p>
    </div>
  </section>
);

// ============================================
// HERRAMIENTAS COMPLETO
// ============================================
const HerramientasSection = () => {
  const tools = [
    {
      icon: Calendar,
      title: 'iCalendar',
      subtitle: 'Tu tiempo es tu activo más valioso',
      description: 'No se trata solo de agendar. Se trata de organizar tu jornada de forma clara, respetuosa contigo y alineada con tu energía. iCalendar te permite sincronizar Google Calendar, Outlook y otros servicios, pero sobre todo, te da el control.',
      features: ['Sesiones 1 a 1 o grupales', 'Espacios VIP monetizables', 'Tú decides tu disponibilidad'],
      color: '#7c3aed'
    },
    {
      icon: Layout,
      title: 'iProjects',
      subtitle: 'Cada mentee es un proyecto de transformación',
      description: 'Un proceso de mentoría no es un servicio puntual. Es un viaje. Y cada viaje merece ser gestionado como lo que es: un proyecto de transformación profunda con inicio, desarrollo y florecimiento.',
      features: ['Tableros por mentee', 'Sprints método PEDALEAR', 'Plantillas personalizables'],
      color: '#FF9100'
    },
    {
      icon: Heart,
      title: 'iCRM',
      subtitle: 'Relaciones que transforman',
      description: 'El CRM de InverSer no es una hoja de cálculo fría. Es el corazón digital de tus relaciones significativas. Cada mentee tiene rostro, voz, historia y camino. Aquí los honras.',
      features: ['Fichas con hilo emocional', 'Registro de revelaciones', 'Gestión por equipos'],
      color: '#1A8314'
    },
    {
      icon: BookOpen,
      title: 'iLearning',
      subtitle: 'Tu sabiduría merece un escenario',
      description: 'iLearning es más que un LMS: es tu campus vivo. Aquí tienes acceso a todos los módulos de formación, pero también puedes crear los tuyos propios y monetizarlos.',
      features: ['Acceso completo como mentor', 'Crea tus propios cursos', 'Monetiza tu conocimiento'],
      color: '#7c3aed'
    },
    {
      icon: Video,
      title: 'WebMeet',
      subtitle: 'Espacios sin distancia',
      description: 'Tu espacio de encuentro generativo. Reserva tu sala virtual sin necesidad de Zoom o Meet externos. Comparte pantalla, graba sesiones, usa pizarras colaborativas.',
      features: ['Hasta 1.000 asistentes', 'Grabación incluida', 'Pizarras colaborativas'],
      color: '#FF9100'
    },
    {
      icon: Send,
      title: 'IConnect',
      subtitle: 'Conversaciones que acercan',
      description: 'Sistema de mensajería inteligente estilo Slack. Canales por proyecto, menciones, archivos adjuntos. Todo en un solo lugar, sin perderte entre correos.',
      features: ['Canales y menciones', 'Widget para tu web', 'Todo centralizado'],
      color: '#1A8314'
    }
  ];

  return (
    <section id="herramientas" className="py-12 md:py-10 px-4 sm:px-6 lg:px-8 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7c3aed]/10 mb-4">
            <Briefcase className="w-4 h-4 text-[#7c3aed]" />
            <span className="text-sm font-body text-[#7c3aed] font-medium">Herramientas</span>
          </div>
          
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight mb-4">
            Tu infraestructura de{' '}
            <span className="text-[#7c3aed]">acompañamiento</span>
          </h2>
          
          <p className="font-body text-lg text-gray-600 leading-relaxed">
            Un ecosistema que te sostiene mientras tú sostienes a otros. Herramientas diseñadas no desde la eficiencia fría, sino desde la comprensión profunda de lo que significa acompañar procesos humanos.
          </p>
        </div>
        
        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, idx) => (
            <div 
              key={idx} 
              className="group bg-white rounded-2xl p-5 md:p-6 border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-500"
            >
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${tool.color}10` }}
                >
                  <tool.icon className="w-6 h-6" style={{ color: tool.color }} />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-semibold text-gray-900">{tool.title}</h3>
                  <p className="font-body text-xs text-[#7c3aed]">{tool.subtitle}</p>
                </div>
              </div>
              
              <p className="font-body text-sm text-gray-600 leading-relaxed mb-4">{tool.description}</p>
              
              <ul className="space-y-1">
                {tool.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-center gap-2 font-body text-xs text-gray-500">
                    <ChevronRight className="w-3 h-3 text-[#c4ff0f]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// IA SECTION COMPLETO
// ============================================
const IASection = () => (
  <section className="relative py-10 md:py-12 overflow-hidden">
    <div className="absolute inset-0 bg-[#031730]">
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${IMAGES.techHumanAmbient})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#031730] via-[#031730]/95 to-[#0a2540]" />
    </div>
    
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <Brain className="w-4 h-4 text-[#c4ff0f]" />
            <span className="text-sm font-body text-white/80">iTeam IA</span>
          </div>
          
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight">
            Inteligencia Artificial
            <br />
            <span className="text-[#c4ff0f]">con alma</span>
          </h2>
          
          <div className="space-y-6 font-body text-lg text-white/70 leading-relaxed">
            <p>
              Estamos entrando en una nueva revolución: la de la inteligencia artificial. Y el mundo necesita <strong className="text-white">mentores conscientes</strong>, capaces de tender puentes entre lo tecnológico y lo humano.
            </p>
            
            <p>
              Nosotros hemos creado algo diferente. No una IA que sustituye, sino <strong className="text-white">una IA que acompaña</strong>. Un equipo de agentes especializados, entrenados con nuestros valores, que te asisten sin reemplazarte.
            </p>
          </div>
          
          {/* MIA Card */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#c4ff0f] flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="font-heading text-xl font-semibold text-white">Conoce a MIA</p>
                <p className="font-body text-sm text-white/50">Mentora de Inteligencia Artificial</p>
              </div>
            </div>
            <p className="font-body text-white/60 leading-relaxed">
              MIA ha sido entrenada con los contenidos, valores y filosofía del NeuroCoaching Evolutivo. Puede sugerirte ideas, resolver dudas de tus mentees y conectarte con el contenido formativo de manera ágil. No es un chatbot genérico. Es tu asistente consciente.
            </p>
          </div>
          
          <blockquote className="border-l-2 border-[#c4ff0f] pl-6 font-heading text-xl text-white/70 italic">
            &ldquo;El mentor del futuro no teme a la IA. La guía. La humaniza. La transforma en aliada del crecimiento humano.&rdquo;
          </blockquote>
        </div>
        
        {/* Capacidades */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-white/10">
          <h3 className="font-heading text-2xl font-semibold text-white mb-8">¿Qué puede hacer MIA por ti?</h3>
          <div className="space-y-4 font-body">
            {[
              'Sugerirte ideas para sesiones o actividades',
              'Resolver dudas frecuentes de tus mentees',
              'Conectarte con el contenido formativo adecuado',
              'Ayudarte a sostener el espíritu InverSer',
              'Diseñar campañas de comunicación',
              'Ordenar ideas y planificar sesiones',
              'Escribir textos alineados a tu voz'
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <Zap className="w-5 h-5 text-[#c4ff0f]" />
                <span className="text-white/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ============================================
// KOMMUNITY COMPLETO
// ============================================
const KommunitySection = () => (
  <section id="comunidad" className="relative py-10 md:py-12 overflow-hidden">
    <div className="absolute inset-0">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${IMAGES.communityAmbient})` }}
      />
      <div className="absolute inset-0 bg-[#faf8f5]/95" />
    </div>
    
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Contenido */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF9100]/10">
            <Users className="w-4 h-4 text-[#FF9100]" />
            <span className="text-sm font-body text-[#FF9100] font-medium">KOMMUNITY</span>
          </div>
          
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 leading-tight">
            Neuronas que se conectan,
            <br />
            <span className="text-[#7c3aed]">almas que co-crean</span>
          </h2>
          
          <div className="space-y-6 font-body text-lg text-gray-600 leading-relaxed">
            <p>
              En InverSer creemos que la comunidad no es un accesorio: es el <strong className="text-gray-900 font-semibold">tejido vivo de la transformación</strong>. Por eso no hablamos de &ldquo;foro&rdquo;. Hablamos de <span className="text-[#7c3aed] font-semibold">KOMMUNITY</span>, con &ldquo;K&rdquo; de kinética, de conexión, de conocimiento compartido.
            </p>
            
            <p>
              Aquí no vienes a opinar. Vienes a <strong className="text-gray-900 font-semibold">co-crear una conciencia colectiva</strong>. Cada mentor, cada mentee, se convierte en una neurona viva dentro de una red mayor. Lo que uno aprende, ilumina a otros. Lo que uno comparte, inspira a muchos.
            </p>
            
            <p>
              Una red que no extrae, sino que nutre. Comunicarte, conocerte, vincularte. No como estrategia de networking vacío, sino como práctica de <strong className="text-gray-900 font-semibold">humanidad en red</strong>.
            </p>
          </div>
          
          <blockquote className="border-l-4 border-[#c4ff0f] pl-6 font-heading text-xl text-gray-500 italic">
            &ldquo;Cuando compartes desde tu verdad, no solo enseñas: invitas a otros a ser más ellos mismos.&rdquo;
          </blockquote>
        </div>
        
        {/* Grid visual */}
        <div className="grid grid-cols-2 gap-5">
          {[
            { icon: MessageSquare, label: 'Hilos de conversación profunda', color: '#7c3aed' },
            { icon: Users, label: 'Co-creación colectiva', color: '#FF9100' },
            { icon: Heart, label: 'Compartir luces y sombras', color: '#1A8314' },
            { icon: Sparkles, label: 'Conciencia circular', color: '#c4ff0f' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 text-center">
              <div 
                className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: `${item.color}15` }}
              >
                <item.icon className="w-7 h-7" style={{ color: item.color }} />
              </div>
              <p className="font-body font-medium text-gray-800">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ============================================
// TOOLBOX COMPLETO
// ============================================
const ToolboxSection = () => (
  <section className="py-12 md:py-10 px-4 sm:px-6 lg:px-8 bg-white">
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Contenido */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7c3aed]/10">
            <Briefcase className="w-4 h-4 text-[#7c3aed]" />
            <span className="text-sm font-body text-[#7c3aed] font-medium">TOOLBOX</span>
          </div>
          
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 leading-tight">
            Tu caja de herramientas
            <br />
            <span className="text-[#7c3aed]">profesional</span>
          </h2>
          
          <div className="space-y-6 font-body text-lg text-gray-600 leading-relaxed">
            <p>
              En InverSer no creemos en formar mentores solo desde el conocimiento. Creemos en formar mentores <strong className="text-gray-900 font-semibold">capaces de intervenir, acompañar y transformar</strong> en contextos reales. Por eso, te entregamos una caja de herramientas viva.
            </p>
            
            <p>
              El Toolbox no te dice qué hacer. <strong className="text-gray-900 font-semibold">Te da con qué hacerlo</strong>. Es tu apoyo silencioso. Tu respaldo profesional. Tu caja de recursos cuando el proceso lo exige. Porque un mentor con herramientas claras puede sostener procesos profundos sin improvisar.
            </p>
          </div>
        </div>
        
        {/* Grid de recursos - responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: Users, text: '+1.000 dinámicas de grupo', color: '#7c3aed' },
            { icon: FileText, text: 'Plantillas profesionales', color: '#FF9100' },
            { icon: Target, text: 'Modelos de diagnóstico', color: '#1A8314' },
            { icon: BookOpen, text: '+600 títulos biblioteca', color: '#7c3aed' },
            { icon: Play, text: 'Cursos en video', color: '#FF9100' },
            { icon: Heart, text: 'Materiales cuerpo-emoción', color: '#1A8314' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${item.color}15` }}
              >
                <item.icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: item.color }} />
              </div>
              <span className="font-body font-medium text-gray-700 text-sm sm:text-base">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ============================================
// DIRECTORIO VIVO SECTION
// ============================================
const DirectorioVivoSection = () => {
  return (
    <section 
      className="relative py-12 md:py-10 px-4 sm:px-6 lg:px-8 bg-fixed bg-cover bg-center"
      style={{ 
        backgroundImage: `url('https://images.pexels.com/photos/2569997/pexels-photo-2569997.jpeg')` 
      }}
    >
      {/* Overlay con menor opacidad para ver imagen parallax */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e]/85 via-[#16213e]/80 to-[#0f0f23]/85" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Columna izquierda - Contenido */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <Globe className="w-4 h-4 text-[#c4ff0f]" />
              <span className="text-sm font-body text-white/80">Directorio iProfesional</span>
            </div>
            
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight">
              Tu escaparate
              <br />
              <span className="text-[#c4ff0f]">al mundo</span>
            </h2>
            
            <div className="space-y-6 font-body text-lg text-white/70 leading-relaxed">
              <p>
                ¿Qué pasaría si tu perfil profesional no fuera solo una ficha fría con tu nombre? ¿Y si fuera un <strong className="text-white">micrositio vivo</strong>, donde muestras quién eres, qué haces y cómo transformarás vidas?
              </p>
              
              <p>
                Bienvenido al <strong className="text-[#c4ff0f]">Directorio Vivo InverSer</strong>. Más que un listado, es tu escenario digital. Aquí podrás mostrar tu logo, tu marca, tus colores. Este no es un espacio genérico: <strong className="text-white">es tuyo</strong>.
              </p>
            </div>
          </div>
          
          {/* Columna derecha - Features */}
          <div className="space-y-6">
            {[
              {
                icon: Users,
                title: 'Perfil editable completo',
                description: 'Tu historia, tus servicios, tus redes y tu contacto directo en un solo lugar.'
              },
              {
                icon: FileText,
                title: 'Blog personal integrado',
                description: 'Escribe, inspira y comparte tu conocimiento desde dentro de InverSer.'
              },
              {
                icon: Play,
                title: 'Galería multimedia',
                description: 'Videos, eventos, entrevistas, experiencias. Todo en tu escaparate.'
              },
              {
                icon: Calendar,
                title: 'Integración total',
                description: 'Conecta tu calendario, tus artículos y tus certificaciones automáticamente.'
              }
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#c4ff0f]/30 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#c4ff0f]/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-[#c4ff0f]" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="font-body text-white/60">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Cita destacada */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 max-w-3xl">
            <blockquote className="font-heading text-2xl md:text-3xl text-white/90 italic leading-relaxed">
              "Tener presencia no es estar. Es mostrarse con verdad, con alma, con intención."
            </blockquote>
            <p className="mt-4 font-body text-[#c4ff0f]">
              El Directorio Vivo no es una vitrina. Es un portal hacia ti.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// IPARTNER COMPLETO
// ============================================
const IPartnerSection = ({ mentorData, onActionClick }) => {
  const { actions, mentorLinks, campaignLinks } = prepareAnchorData(mentorData);

  return (
    <section className="py-12 md:py-10 px-4 sm:px-6 lg:px-8 bg-[#031730]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <TrendingUp className="w-4 h-4 text-[#c4ff0f]" />
              <span className="text-sm font-body text-white/80">iPartner</span>
            </div>
            
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight">
              Monetiza tu impacto,
              <br />
              <span className="text-[#c4ff0f]">multiplica tu legado</span>
            </h2>
            
            <div className="space-y-6 font-body text-lg text-white/70 leading-relaxed">
              <p>
                Además de formarte y transformar vidas, en InverSer también puedes generar ingresos. <strong className="text-white">iPartner</strong> es nuestro sistema de afiliación consciente.
              </p>
              
              <p>
                Invita a otros mentores al ecosistema y recibe una comisión directa. Si ellos también invitan, recibes un segundo nivel. No es un sistema piramidal vacío: es un <strong className="text-white">modelo de expansión con propósito</strong>.
              </p>
              
              <p>
                Algunos mentores cubren con creces el costo de su membresía solo con dos o tres referidos. Otros han construido redes de impacto que generan ingresos pasivos significativos.
              </p>
            </div>
            
            <ul className="space-y-4 font-body">
              {[
                'Invita mentores y recibe comisión directa',
                'Ganancias por segundo nivel de invitados',
                'Cubre tu membresía con pocos referidos',
                'Modelo ético de expansión con propósito'
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-white/70">
                  <CheckCircle className="w-5 h-5 text-[#c4ff0f]" />
                  {item}
                </li>
              ))}
            </ul>
            
            <blockquote className="border-l-2 border-[#c4ff0f] pl-6 font-heading text-xl text-white/60 italic">
              &ldquo;En InverSer, tu impacto también puede sostenerte.&rdquo;
            </blockquote>
            
            <ButtonAnchor
              buttonKey="contacto_mpp"
              templateKey="mpp"
              actions={actions}
              mentorLinks={mentorLinks}
              campaignLinks={campaignLinks}
              onActionClick={onActionClick}
              variant="primary"
              size="default"
            />
          </div>
          
          {/* Landings Card */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#c4ff0f]/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#c4ff0f]" />
              </div>
              <h3 className="font-heading text-2xl font-semibold text-white">Landings Personalizadas</h3>
            </div>
            
            <p className="font-body text-white/70 mb-6 leading-relaxed">
              Cada mentor tiene acceso a landings personalizadas como esta que estás leyendo ahora. Una página diseñada para que tú la compartas con tu red, con tu estilo, con tu voz.
            </p>
            
            <ul className="space-y-3 font-body text-white/60">
              {[
                'Tu foto, presentación y enlaces de contacto',
                'Landing para presentar el ecosistema a otros',
                'Landings específicas por cada certificación',
                'Formatos adaptables para tus programas propios'
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-[#c4ff0f]" />
                  {item}
                </li>
              ))}
            </ul>
            
            <div className="mt-8 p-5 bg-[#c4ff0f]/10 rounded-xl border border-[#c4ff0f]/20">
              <p className="font-body text-sm text-white/80 leading-relaxed">
                <span className="text-[#c4ff0f] font-medium">Nota:</span> No necesitas diseñar nada. Nosotros lo hacemos por ti. Tú solo decides qué mostrar y cómo comunicar. Tu landing se crea automáticamente al unirte.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// CTA FINAL
// ============================================
const CTAFinalSection = ({ mentorData, onActionClick }) => {
  const { actions, mentorLinks, campaignLinks } = prepareAnchorData(mentorData);

  return (
    <section 
      className="relative py-12 md:py-14 overflow-hidden bg-fixed bg-cover bg-center"
      style={{ 
        backgroundImage: `url('https://images.pexels.com/photos/4069293/pexels-photo-4069293.jpeg')` 
      }}
    >
      {/* Overlay con gradiente púrpura */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed]/90 via-[#5b21b6]/85 to-[#4c1d95]/90" />
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full filter blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#c4ff0f]/20 rounded-full filter blur-[150px]" />
      </div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-white leading-tight mb-6">
          Si sientes que este mundo necesita{' '}
          <span className="text-[#c4ff0f]">más mentores conscientes...</span>
        </h2>
        
        <p className="font-body text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
          Si intuyes que tu rol puede crecer más allá de las sesiones uno a uno. Si buscas un espacio que te potencie sin deshumanizarte. Si crees que la tecnología puede ser aliada de la transformación humana…
          <br /><br />
          <strong className="text-white">Entonces sigue avanzando. Esto no es una promesa. Es una arquitectura.</strong>
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <ButtonAnchor
            buttonKey="aplicar_mpp"
            templateKey="mpp"
            actions={actions}
            mentorLinks={mentorLinks}
            campaignLinks={campaignLinks}
            onActionClick={onActionClick}
            variant="primary"
            size="lg"
          />
          <ButtonAnchor
            buttonKey="whatsapp_mpp"
            templateKey="mpp"
            actions={actions}
            mentorLinks={mentorLinks}
            campaignLinks={campaignLinks}
            onActionClick={onActionClick}
            variant="secondary"
            size="lg"
          />
        </div>
        
        <p className="mt-10 font-heading text-xl text-white/60 italic">
          Bienvenido al Mentor & Partner Program. Bienvenido al Plan Pioneros.
          <br />
          <span className="text-white/80 font-medium">Tu legado comienza aquí.</span>
        </p>
      </div>
    </section>
  );
};

// ============================================
// FAQ SECTION
// ============================================
const FAQSection = ({ mentorData, onActionClick }) => {
  const [openIndex, setOpenIndex] = React.useState(null);
  
  // Preparar datos para ButtonAnchor
  const { actions, mentorLinks, campaignLinks } = prepareAnchorData(mentorData);

  const faqs = [
    {
      question: "¿Qué es exactamente el Mentor & Partner Program?",
      answer: "No es un curso ni una certificación aislada. El Mentor & Partner Program es un ecosistema de empoderamiento para mentores, diseñado para que puedas ejercer, escalar y sostener tu rol de acompañamiento humano con estructura, herramientas, comunidad y proyección real en la era digital."
    },
    {
      question: "¿Por qué hablan de \"ecosistema\" y no de programa tradicional?",
      answer: `Porque en InverSer no creemos en espacios cerrados ni en modelos donde el mentor solo "consume" lo que otros diseñaron.

Hablamos de ecosistema porque lo que proponemos es un entorno vivo, flexible y en evolución constante, donde las personas habitan digitalmente para crecer humanamente, pero también aportan, co-crean y transforman el propio espacio.

El Mentor & Partner Program no está pensado para que vengas únicamente a hacer un programa puntual ni para que repitas un guion prefabricado. Está diseñado para que ejerzas tu rol de mentor acompañando procesos reales, mientras el ecosistema se enriquece con tu experiencia, tu mirada y tu forma de acompañar.

Dentro del ecosistema no existe una sola certificación ni una única propuesta formativa. Accedes a múltiples programas —como la Certificación Profesional de NeuroCoaching y los que se irán incorporando—, pero también a espacios donde mentores y alumnos pueden proponer, diseñar y desarrollar nuevos módulos, experiencias y recorridos de aprendizaje.

Por eso el ecosistema no es rígido ni inmutable. Tiene estructura, reglas claras y coherencia, pero está pensado para adaptarse, crecer y evolucionar a medida que las personas que lo habitan lo hacen.

InverSer no busca empaquetar el comportamiento del mentor. Busca ofrecerle herramientas sólidas, infraestructura y soporte, dejando siempre en el centro lo más importante: la experiencia, la conexión humana y la capacidad de acompañar desde la autenticidad.

Llamarlo ecosistema no es una metáfora. Es una decisión consciente: crear un espacio donde el mentor no solo utiliza el sistema, sino que forma parte viva de él, contribuyendo a su evolución mientras crece profesional y humanamente.

Por eso hablamos de ecosistema y no de programa tradicional: porque aquí no entras a cumplir un recorrido cerrado, sino a habitar, aportar y construir un medio vivo para ejercer el mentoring en la era digital, con humanidad, propósito y futuro.`
    },
    {
      question: "¿Cómo puedo habitar un ecosistema tan completo sin perder mi esencia como mentor?",
      answer: `Es una pregunta legítima y profundamente humana. Cuando un ecosistema es potente, estructurado y ofrece muchas herramientas, es natural preguntarse si ese mismo sistema puede terminar condicionando, limitando o diluyendo la identidad de quien lo habita.

En InverSer, el ecosistema no existe para encerrar al mentor, sino para ampliarlo.

Nada dentro del Mentor & Partner Program es obligatorio. Ninguna certificación, ningún método, ninguna herramienta. Todo lo que el ecosistema ofrece está ahí como posibilidad, no como imposición. El mentor decide qué utiliza, cómo lo utiliza y hasta dónde lo integra en su práctica profesional.

El ecosistema no define tu identidad ni tu forma de acompañar. Esa identidad viene de tu historia, tu experiencia, tu mirada y tu forma de estar con otros seres humanos. InverSer no busca reemplazar esa voz, sino darle soporte, estructura y proyección si tú eliges hacerlo.

Aquí no se espera que el mentor se adapte al sistema. El sistema está diseñado para adaptarse al mentor. Puedes utilizar una certificación existente, crear tus propios módulos formativos, proponer nuevas experiencias, o incluso usar solo algunas herramientas del ecosistema mientras desarrollas propuestas completamente personales.

Y si en algún momento deseas llevar tu práctica a un entorno totalmente propio —con tu marca, tus nombres, tus recorridos y tu identidad completa—, también existe esa posibilidad a través de servicios como SuiteX, donde InverSer actúa como aliado tecnológico, no como contenedor identitario.

Por diseño, este ecosistema evita convertirse en una "jaula dorada" porque:
• No exige exclusividad.
• No impone recorridos cerrados.
• No captura al mentor dentro de una única forma de hacer.

InverSer no necesita que el mentor se disuelva para funcionar. Funciona precisamente porque cada mentor permanece siendo quien es, mientras encuentra un espacio que lo sostiene, lo amplifica y le permite crecer sin perder autenticidad.

Habitar este ecosistema no significa pertenecer a una estructura que te define. Significa elegir un entorno que te acompaña mientras tú sigues siendo tú.`
    },
    {
      question: "¿El ecosistema no corre el riesgo de homogeneizar la mentoría?",
      answer: `No. Y es importante decirlo con claridad.

La mentoría no es homogenizable, porque no es un contenido, es un acto humano. Nace de la experiencia, la trayectoria, la sensibilidad y la forma de estar de cada mentor. Eso no se puede estandarizar ni automatizar.

Lo que sí tiene una estructura común —como ocurre en cualquier universidad o formación profesional— son los contenidos, los recorridos formativos y los marcos de trabajo de certificaciones como la Certificación Profesional de NeuroCoaching y de los programas que se integran al ecosistema.

Esa estructura no busca uniformar a los mentores, sino dar coherencia, calidad y profundidad al proceso de aprendizaje del mentee. A partir de ahí, cada mentor acompaña desde su propia historia, su mirada, su estilo y su vivencia.

Dicho de otro modo:
• El contenido puede ser compartido.
• La mentoría nunca lo es.

En InverSer no formamos "mentores en serie" ni replicadores de un guion. Buscamos exactamente lo contrario: que cada mentor aporte su voz, su experiencia y su forma de acompañar, enriqueciendo el proceso.

Por eso hablamos de ecosistema vivo. Un espacio donde existe una base común que sostiene, pero donde la riqueza surge de la diversidad, la conexión humana y la experiencia real de quienes acompañan.

Aquí no se estandariza a las personas. Se cuida la estructura para que la humanidad pueda expresarse.`
    },
    {
      question: "¿La estructura del ecosistema limita la creatividad o la originalidad del mentor?",
      answer: `No. La estructura en InverSer no limita la creatividad: la sostiene.

El ecosistema ofrece una columna vertebral clara —métodos, recorridos, contenidos base y herramientas— para garantizar profundidad, coherencia y calidad en los procesos de transformación. Pero esa estructura no es una jaula, es un soporte.

La originalidad del mentor no solo no se sacrifica, sino que se activa y se potencia:
• Cada proceso de mentoría es uno a uno, humano y contextual.
• El mentor puede adaptar tareas, profundizar contenidos o abrir nuevas líneas de trabajo cuando un mentee lo necesita.
• Puede crear sus propios módulos, experiencias y recursos formativos dentro del ecosistema y utilizarlos con sus mentees.
• Puede aportar desde su experiencia viva, su mirada profesional y su sensibilidad personal.

La estructura existe para evitar el caos, no para uniformar. Igual que en una universidad: el programa es común, pero cada docente deja su huella, su enfoque y su forma de acompañar.

Además, el ecosistema está diseñado para escuchar y evolucionar. Mentores y mentees pueden proponer mejoras, ajustes y nuevas integraciones que se analizan y, cuando tienen sentido, se incorporan.

Por eso hablamos de un ecosistema vivo y no de un programa cerrado. Aquí no se busca eficiencia a costa de la humanidad. Se busca humanizar la estructura para que la transformación sea real, profunda y sostenible.

Se cuida la estructura para que la humanidad pueda expresarse.`
    },
    {
      question: "¿Qué diferencia a este programa de otros espacios de mentoring?",
      answer: "La diferencia principal es que aquí no solo te formamos como mentor: te acompañamos a ejercer como mentor."
    },
    {
      question: "¿A quién está dirigido este programa?",
      answer: "A coaches, mentores y profesionales del acompañamiento que sienten que su experiencia puede ir más lejos. Personas que quieren impactar, crecer y evolucionar sin perder humanidad, y que entienden que el futuro del mentoring es colaborativo y sistémico."
    },
    {
      question: "¿Necesito venir de InverSer o haber hecho una certificación previa?",
      answer: "No necesariamente. Valoramos la trayectoria, la conciencia y la alineación con la filosofía de InverSer. Por eso existe un proceso de aplicación y entrevista: para conocernos y asegurarnos de que este ecosistema es coherente para ambas partes."
    },
    {
      question: "¿Qué rol tengo dentro del ecosistema como mentor?",
      answer: "Tu rol es acompañar procesos humanos: formar, mentorear, sostener conversaciones, guiar recorridos de transformación. InverSer se encarga de la infraestructura, las herramientas y los sistemas para que tú puedas enfocarte en lo esencial: el acompañamiento."
    },
    {
      question: "¿Cómo funciona el modelo iPartner y de qué maneras puede monetizar un mentor dentro del ecosistema?",
      answer: `El modelo iPartner del Mentor & Partner Program está diseñado para que tu rol como mentor sea sostenible, escalable y económicamente viable, sin perder nunca el foco humano del acompañamiento.

La monetización no se basa en un único mecanismo, sino en varias vías complementarias, todas vinculadas a tu rol como mentor y al valor real que aportas dentro del ecosistema.

1. Monetización por tu rol directo como mentor
Cada vez que acompañas a mentees dentro de certificaciones como la Certificación Profesional de NeuroCoaching —y de los programas que se irán incorporando— generas ingresos por tu labor directa de acompañamiento humano.

2. Monetización como mentor supervisor
Cuando algunos de tus mentees deciden convertirse en mentores dentro del ecosistema, continúas generando ingresos por los procesos que ellos acompañan. Esto te permite evolucionar de forma natural hacia un rol de mentor supervisor, sosteniendo y acompañando también a nuevos mentores.

3. Invitación directa de otros mentores
Puedes invitar a otros profesionales del coaching o del acompañamiento (aunque provengan de otras escuelas) para que se postulen al ecosistema. Si son aprobados, generas ingresos por ellos y por un segundo nivel máximo, creando una red colaborativa y sostenible.

4. Monetización por productos y servicios del ecosistema
Todos los productos y servicios digitales que InverSer desarrolle (herramientas, plataformas, servicios profesionales) se integran a este modelo, generando nuevas oportunidades de ingresos.

El objetivo es claro: que el mentor disponga de formas reales, éticas y sostenibles de monetizar su labor, hasta el punto de que, en muchos casos, su membresía prácticamente se paga sola.`
    },
    {
      question: "¿Cómo escala InverSer sin deshumanizar los procesos de mentoría?",
      answer: `InverSer no escala a través de la masificación, sino a través de la multiplicación consciente de capacidad humana.

El ecosistema está diseñado para crecer sin perder humanidad porque el centro no es el volumen, sino la calidad del acompañamiento.

Esto se cuida de varias formas muy concretas:

• El mentor decide a cuántos mentees puede acompañar. No existen cuotas mínimas ni exigencias de volumen. Cada mentor actúa desde su disponibilidad real de tiempo, energía y presencia.

• Existen límites humanos explícitos. Si un mentor comienza a acompañar a más personas de las que humanamente puede sostener, eso se convierte en un indicador de alerta para el ecosistema. Acompañar es una responsabilidad, no una carrera por cantidad.

• Los procesos de certificación no son autoconsumibles. No se venden como contenidos aislados ni como formaciones masivas. Cada mentee entra al ecosistema acompañado por un mentor desde el inicio.

• El crecimiento se da por creación de nuevas células humanas, no por sobrecarga. A medida que se forman nuevos mentores, se amplía la capacidad de acompañamiento sin diluir la calidad.

• Los espacios colectivos (webinars, encuentros generativos, sesiones compartidas) enriquecen el aprendizaje, pero nunca sustituyen la mentoría uno a uno.

• El ecosistema aprende y se adapta. Los programas no son rígidos ni cerrados. Se nutren de la experiencia real de los mentores, de los encuentros en vivo y de las necesidades humanas que emergen en el camino.

Escalar, para InverSer, no significa atender a más personas con menos presencia. Significa crear las condiciones para que más personas sean acompañadas con profundidad, consciencia y cuidado, sin perder el vínculo humano.

Aquí no se crece deshumanizando. Se crece formando más humanidad capaz de acompañar a otros.`
    },
    {
      question: "¿Cómo está diseñado el modelo iPartner para ser ético, sostenible y humano?",
      answer: `El modelo iPartner del Mentor & Partner Program está diseñado para reconocer y sostener el valor real que el mentor aporta, sin desviar el foco del acompañamiento humano ni convertir el crecimiento en una lógica puramente financiera.

Su funcionamiento se apoya en principios claros que priorizan la ética, la sostenibilidad y la coherencia:

1. Integración consciente de mentores
Cada mentor pasa por un proceso de aplicación, evaluación y conversación. No buscamos volumen, buscamos alineación humana, profesional y ética.

2. Estructura simple y con límites claros
El modelo contempla un máximo de dos niveles de reconocimiento, permitiendo acompañar, supervisar y sostener relaciones reales sin generar estructuras desbordadas.

3. Valor real en el centro
El reconocimiento económico está siempre vinculado a procesos formativos concretos, mentoría uno a uno y entrega tangible de valor.

4. Protección de las personas en formación
Los procesos se sostienen con pagos periódicos y seguimiento activo, cuidando la continuidad del acompañamiento humano.

5. Transparencia y coherencia financiera
La lógica de distribución es clara, comprensible y revisable. El ecosistema se construye desde la confianza.

6. El acompañamiento como eje
El crecimiento económico surge como consecuencia natural del acompañamiento, la formación y el liderazgo responsable.

En InverSer, el sistema está al servicio de las personas, no al revés.`
    },
    {
      question: "¿Qué incluye el Plan Pioneros?",
      answer: `El Plan Pioneros es una etapa inicial y temporal del Mentor & Partner Program. No es un plan permanente, sino el primer momento de apertura del ecosistema.

Esta etapa nace con una intención muy clara: rodearnos de profesionales alineados, con experiencia real, que quieran crecer junto a InverSer y, al mismo tiempo, nutrir el ecosistema con su mirada, su práctica y su conocimiento.

Como pionero, accedes al ecosistema completo mediante un setup inicial y participas activamente en un proceso de co-creación y evolución: tu feedback, tus aportes y tu experiencia ayudan a fortalecer, ajustar y hacer más efectivo todo el sistema.

A cambio de ese compromiso temprano, los pioneros reciben condiciones preferenciales, entre ellas una membresía futura con descuento permanente, que reconoce haber dado el paso cuando el ecosistema aún estaba en fase de crecimiento y consolidación.

El Plan Pioneros es, en esencia, un acuerdo ganar–ganar: InverSer crece contigo, y tú creces siendo parte de la construcción desde el inicio.`
    },
    {
      question: "¿Hay una membresía mensual?",
      answer: "Sí. Tras la etapa inicial, el ecosistema funcionará con una membresía. Los pioneros accederán a esta membresía con un descuento aproximado del 40% respecto al precio estándar, como reconocimiento por haber sido parte de la construcción inicial."
    },
    {
      question: "¿Puedo usar las herramientas de InverSer para mis proyectos personales?",
      answer: "Sí. Muchas de las herramientas del ecosistema pueden utilizarse también para tus propios proyectos, siempre desde un uso responsable. InverSer no te limita: te potencia."
    },
    {
      question: "¿Qué tipo de herramientas voy a encontrar dentro del ecosistema?",
      answer: `Desde plataformas de proyectos, e-learning, comunidad, reservas de sesiones, salas de encuentro y espacios colaborativos, hasta un Toolbox profesional con dinámicas, plantillas, bibliotecas y recursos avanzados para tu práctica como mentor.

Además, el ecosistema integra herramientas de inteligencia artificial aplicadas al acompañamiento, diseñadas para potenciar el trabajo humano, nunca para sustituirlo.`
    },
    {
      question: "¿Qué papel juega la inteligencia artificial (MIA) dentro del ecosistema?",
      answer: `MIA es una herramienta de apoyo basada en inteligencia artificial, diseñada para acompañar tanto a mentores como a mentees en el acceso rápido a conocimiento relevante, recursos formativos y propuestas metodológicas.

No es una mentora humana, no toma decisiones por ti ni sustituye el acompañamiento real. Su valor está en acelerar el acceso a información de calidad, para que el mentor pueda dedicar más tiempo a lo verdaderamente importante: el análisis humano, la conversación profunda y la conexión con el mentee.

MIA está alimentada exclusivamente con:
• Libros y materiales de referentes del coaching, el desarrollo humano y la psicología aplicada.
• El pensamiento filosófico, el lenguaje y la estructura metodológica de InverSer.

No realiza búsquedas abiertas en internet ni genera respuestas fuera de este marco. Su función es similar a la de una biblioteca viva altamente especializada, capaz de sugerir dinámicas, enfoques, lecturas o marcos de reflexión que el mentor luego interpreta, adapta y lleva al terreno humano.

Cuando una pregunta toca ámbitos existenciales, decisiones vitales o procesos personales profundos, MIA está diseñada para derivar siempre al mentor humano, recordando que la transformación no se delega a una herramienta.

En InverSer entendemos la inteligencia artificial como lo que es: una tecnología para reducir tiempos operativos, ampliar acceso al conocimiento y liberar energía creativa, no como un reemplazo de la experiencia humana.

MIA no lidera procesos. Los lideras tú.
Ella apoya, tú acompañas.`
    },
    {
      question: "¿Qué pasa después de completar el formulario de aplicación?",
      answer: `Revisamos tu perfil y, si hay alineación, te invitamos a una conversación.

Ese encuentro es un espacio para conocernos, resolver tus dudas, profundizar en tu momento profesional y confirmar si este ecosistema es adecuado para ti y si existe un match real para avanzar juntos.

Si ambas partes estamos de acuerdo, el siguiente paso es realizar un pago único de incorporación (setup inicial del ecosistema). Este pago permite configurar tu llave de acceso, tu espacio dentro de InverSer y habilitar todas las herramientas y entornos que forman parte del ecosistema.

Durante la etapa de Pioneros no se cobra membresía (mensual, trimestral o anual). Esta fase inicial está pensada para que el primer equipo de mentores y InverSer podamos alinearnos, ajustar y fortalecer el ecosistema antes de iniciar formalmente la membresía.

El valor del setup es un importe especial y accesible para los pioneros, precisamente porque son quienes nos acompañan en esta primera etapa de construcción y crecimiento compartido. Es, una vez más, un acuerdo ganar–ganar: tú accedes al ecosistema desde el inicio y nosotros nos nutrimos de tu experiencia y tu mirada profesional.`
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-12 md:py-10 px-4 sm:px-6 lg:px-8 bg-[#faf8f5]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7c3aed]/10 mb-6">
            <HelpCircle className="w-4 h-4 text-[#7c3aed]" />
            <span className="text-sm font-body text-[#7c3aed] font-medium">FAQ</span>
          </div>
          
          <h2 className="font-heading text-4xl md:text-5xl font-semibold text-gray-900 leading-tight mb-4">
            Preguntas{' '}
            <span className="text-[#7c3aed]">Frecuentes</span>
          </h2>
          
          <p className="font-body text-lg text-gray-600 max-w-2xl mx-auto">
            Todo lo que necesitas saber sobre el Mentor & Partner Program
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className="font-body font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-[#7c3aed] flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6">
                  <div className="border-t border-gray-100 pt-4">
                    <p className="font-body text-gray-600 leading-relaxed whitespace-pre-line">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Botón Quiero Unirme */}
        <div className="flex justify-center mt-12">
          <ButtonAnchor
            buttonKey="unirme_faq"
            templateKey="mpp"
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
// FOOTER
// ============================================
const FooterMPP = ({ mentorData, onActionClick }) => {
  const mentor = mentorData?.mentor || {};
  const hasMentor = mentor.first_name && mentor.first_name !== '';
  const { actions, mentorLinks, campaignLinks } = prepareAnchorData(mentorData);

  return (
    <footer className="bg-[#031730] text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12 pb-12 border-b border-white/10">
          {/* Logo */}
          <div className="space-y-4">
            <LogoMPP />
            <p className="font-body text-white/50 text-sm leading-relaxed max-w-xs">
              Ecosistema de empoderamiento para mentores conscientes. Donde la tecnología potencia la transformación humana.
            </p>
          </div>
          
          {/* Navegación */}
          <div>
            <p className="font-heading font-semibold text-white mb-4">Navegación</p>
            <nav className="flex flex-col space-y-2 font-body">
              {['Ecosistema', 'Certificación', 'Herramientas', 'Comunidad'].map((item, idx) => (
                <a 
                  key={idx}
                  href={`#${item.toLowerCase()}`}
                  className="text-white/50 hover:text-[#c4ff0f] transition-colors text-sm"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
          
          {/* Mentor */}
          <div className="flex flex-col items-end text-right">
            {hasMentor && (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <div>
                    <p className="font-heading font-semibold">{mentor.first_name} {mentor.last_name}</p>
                    <p className="font-body text-[#c4ff0f] text-sm">Team Líder<br />INVERSER SBS</p>
                  </div>
                  {mentor.photo_url && (
                    <img 
                      src={getImageUrl(mentor.photo_url)} 
                      alt={`${mentor.first_name} ${mentor.last_name}`}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#c4ff0f]/40"
                    />
                  )}
                </div>
                <ButtonAnchor
                  buttonKey="ir_perfil_footer_mpp"
                  templateKey="mpp"
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
        
        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-body text-sm text-white/40">
          <a 
            href="https://inverser.us/terminos-condiciones/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-[#c4ff0f] transition-colors"
          >
            Términos y Condiciones
          </a>
          
          <p>
            2009–2026{' '}
            <a 
              href="https://inverser.us" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[#c4ff0f] transition-colors"
            >
              INVERSER SBS LLC
            </a>
            {' '}· Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  );
};

// ============================================
// MAIN LANDING
// ============================================
const LandingMPP = ({ mentorData, onActionClick }) => {
  useEffect(() => {
    const campaignName = mentorData?.campaign?.name || 'Mentor & Partner Program';
    document.title = campaignName;
  }, [mentorData]);

  return (
    <div className="min-h-screen font-body">
      <NavbarMPP mentorData={mentorData} onActionClick={onActionClick} />
      <HeroMPP mentorData={mentorData} onActionClick={onActionClick} />
      <IntroEcosistemaSection />
      <CertificacionSection mentorData={mentorData} onActionClick={onActionClick} />
      <StatementSection />
      <HerramientasSection />
      <IASection />
      <KommunitySection />
      <ToolboxSection />
      <DirectorioVivoSection />
      <IPartnerSection mentorData={mentorData} onActionClick={onActionClick} />
      <CTAFinalSection mentorData={mentorData} onActionClick={onActionClick} />
      <FAQSection mentorData={mentorData} onActionClick={onActionClick} />
      <FooterMPP mentorData={mentorData} onActionClick={onActionClick} />
    </div>
  );
};

export default LandingMPP;
