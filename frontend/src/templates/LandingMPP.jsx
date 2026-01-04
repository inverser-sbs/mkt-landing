/**
 * LandingMPP - Landing para Mentor & Partner Program (Plan Pioneros)
 * campaign_key: mpp
 * 
 * VERSIÓN 3: Diseño visual integrado y profesional
 * 
 * FILOSOFÍA DE DISEÑO:
 * - Imágenes como ambiente, no como bloques
 * - Overlays y gradientes para integración
 * - Espacios de respiración visual
 * - Momentos emocionales con fondos inmersivos
 * - Elegancia a través de la sutileza
 */

import React, { useEffect } from 'react';
import { 
  Calendar, Clock, Users, BookOpen, Brain, MessageSquare,
  Video, Headphones, Layout, Globe, Briefcase, Link2,
  Award, Star, ChevronRight, Mail, Phone, ExternalLink,
  Sparkles, Target, Heart, Zap, Shield, TrendingUp,
  Play, Mic, Move, Grid, Send, DollarSign, FileText,
  CheckCircle, ArrowRight
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { getImageUrl } from '../utils/imageUrl';
import ButtonAnchor, { prepareAnchorData } from '../components/ButtonAnchor';

// ============================================
// IMÁGENES DE AMBIENTE (FONDOS INMERSIVOS)
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
// NAVBAR - Elegante y minimalista
// ============================================
const NavbarMPP = ({ mentorData, onActionClick }) => {
  const { actions, mentorLinks, campaignLinks } = prepareAnchorData(mentorData);
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#031730]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <LogoMPP />
          <div className="hidden md:flex items-center space-x-8 text-sm text-white/70">
            <a href="#ecosistema" className="hover:text-[#c4ff0f] transition-all duration-300">Ecosistema</a>
            <a href="#certificacion" className="hover:text-[#c4ff0f] transition-all duration-300">Certificación</a>
            <a href="#herramientas" className="hover:text-[#c4ff0f] transition-all duration-300">Herramientas</a>
            <a href="#comunidad" className="hover:text-[#c4ff0f] transition-all duration-300">Comunidad</a>
          </div>
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
        </div>
      </div>
    </nav>
  );
};

// ============================================
// HERO SECTION - Inmersivo con imagen de ambiente
// ============================================
const HeroMPP = ({ mentorData, onActionClick }) => {
  const mentor = mentorData?.mentor || {
    first_name: '',
    last_name: '',
    photo_url: null,
    title: 'Team Líder'
  };
  
  const { actions, mentorLinks, campaignLinks } = prepareAnchorData(mentorData);
  const hasMentor = mentor.first_name && mentor.first_name !== '';

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Imagen de fondo con tratamiento */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${IMAGES.heroAmbient})` }}
        />
        {/* Overlay gradiente para integración */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#031730] via-[#031730]/95 to-[#031730]/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#031730] via-transparent to-[#031730]/50" />
      </div>
      
      {/* Elementos decorativos sutiles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#7c3aed]/20 rounded-full filter blur-[150px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#c4ff0f]/10 rounded-full filter blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-16">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Contenido principal - 3 columnas */}
          <div className="lg:col-span-3 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-[#c4ff0f]" />
              <span className="text-sm text-white/80">Plan Pioneros</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight">
              <span className="text-white">Mentor</span>
              <span className="text-[#c4ff0f]"> & </span>
              <span className="text-white">Partner</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] via-[#a78bfa] to-[#c4ff0f]">
                Program
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/70 leading-relaxed max-w-2xl font-light">
              Un <span className="text-white font-normal">ecosistema de empoderamiento</span> donde tu experiencia, tu criterio y tu vocación se amplifican.
            </p>
            
            <p className="text-lg text-white/50 max-w-xl">
              No es un curso. No es una certificación aislada. Es una infraestructura completa para ejercer tu rol de mentor con profundidad.
            </p>
          </div>
          
          {/* Mentor card - 2 columnas */}
          <div className="lg:col-span-2 flex justify-center lg:justify-end">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-br from-[#7c3aed]/40 to-[#c4ff0f]/40 rounded-3xl blur-2xl opacity-50" />
              
              {/* Card */}
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 text-center">
                {/* Foto */}
                <div className="relative w-40 h-40 mx-auto mb-6">
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
                          <Users className="w-16 h-16 text-white/30" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Info */}
                <p className="text-xl font-semibold text-white mb-1">
                  {hasMentor ? `${mentor.first_name} ${mentor.last_name}` : 'Tu Mentor'}
                </p>
                <p className="text-[#c4ff0f] text-sm mb-6">Team Líder</p>
                
                {/* Botones */}
                <div className="space-y-3">
                  <ButtonAnchor
                    buttonKey="ver_perfil_mpp"
                    templateKey="mpp"
                    actions={actions}
                    mentorLinks={mentorLinks}
                    campaignLinks={campaignLinks}
                    onActionClick={onActionClick}
                    variant="ghost"
                    size="sm"
                  />
                  <ButtonAnchor
                    buttonKey="agendar_mpp"
                    templateKey="mpp"
                    actions={actions}
                    mentorLinks={mentorLinks}
                    campaignLinks={campaignLinks}
                    onActionClick={onActionClick}
                    variant="primary"
                    size="default"
                  />
                  <ButtonAnchor
                    buttonKey="whatsapp_mpp"
                    templateKey="mpp"
                    actions={actions}
                    mentorLinks={mentorLinks}
                    campaignLinks={campaignLinks}
                    onActionClick={onActionClick}
                    variant="secondary"
                    size="default"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/40 rounded-full" />
        </div>
      </div>
    </section>
  );
};

// ============================================
// ECOSISTEMA - Diseño editorial elegante
// ============================================
const IntroEcosistemaSection = () => (
  <section id="ecosistema" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#faf8f5]">
    <div className="max-w-4xl mx-auto">
      {/* Header elegante */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7c3aed]/10 mb-8">
          <Target className="w-4 h-4 text-[#7c3aed]" />
          <span className="text-sm text-[#7c3aed] font-medium">El Ecosistema</span>
        </div>
        
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
          Aquí no vienes a consumir contenidos.
          <br />
          <span className="text-[#7c3aed]">Vienes a habitar un ecosistema.</span>
        </h2>
      </div>
      
      {/* Contenido con tipografía editorial */}
      <div className="space-y-8 text-lg md:text-xl text-gray-600 leading-relaxed">
        <p className="first-letter:text-6xl first-letter:font-bold first-letter:text-[#7c3aed] first-letter:float-left first-letter:mr-3 first-letter:mt-1">
          Vivimos en un tiempo vertiginoso. La Inteligencia Artificial avanza sin pausa, automatiza procesos, optimiza decisiones y redefine el trabajo. Pero mientras la tecnología crece, algo queda en riesgo: la <strong className="text-gray-900">capacidad humana de comprender, sostener y acompañar procesos emocionales y vitales</strong>.
        </p>
        
        <p>
          Las personas no solo necesitan respuestas. Necesitan presencia. Necesitan alguien que les ayude a ver lo que aún no ven. Alguien que no les dé fórmulas, sino que les acompañe en el camino de descubrir las propias.
        </p>
        
        {/* Quote destacado */}
        <blockquote className="relative py-8 my-12">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#7c3aed] to-[#c4ff0f] rounded-full" />
          <p className="pl-8 text-2xl md:text-3xl font-light text-gray-900 italic">
            InverSer evoluciona desde ahí. Desde años de experiencia real en el mundo digital, en la formación de coaches, en procesos profundos de transformación humana.
          </p>
        </blockquote>
        
        <p>
          Ese rol —el del mentor, el coach, el acompañante consciente— no puede ser reemplazado por una máquina. Pero sí puede ser <strong className="text-gray-900">potenciado por la tecnología adecuada</strong>.
        </p>
        
        <p className="text-center text-2xl font-medium text-gray-900 py-8">
          Hoy, InverSer se expresa con más claridad en ese punto donde{' '}
          <span className="text-[#7c3aed]">la tecnología necesita conciencia</span>.
        </p>
      </div>
      
      {/* Tres pilares - diseño minimalista */}
      <div className="grid md:grid-cols-3 gap-8 mt-16">
        {[
          { icon: Heart, text: 'Estructura sin rigidez', desc: 'Flexibilidad con propósito' },
          { icon: Zap, text: 'Herramientas sin frialdad', desc: 'Tecnología con alma' },
          { icon: Users, text: 'Comunidad sin competencia', desc: 'Crecimiento compartido' }
        ].map((item, idx) => (
          <div key={idx} className="text-center group">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#7c3aed]/10 to-[#c4ff0f]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <item.icon className="w-7 h-7 text-[#7c3aed]" />
            </div>
            <p className="font-semibold text-gray-900 mb-1">{item.text}</p>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ============================================
// CERTIFICACIÓN - Layout asimétrico elegante
// ============================================
const CertificacionSection = ({ mentorData, onActionClick }) => {
  const { actions, mentorLinks, campaignLinks } = prepareAnchorData(mentorData);

  return (
    <section id="certificacion" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF9100]/10 mb-6">
            <Award className="w-4 h-4 text-[#FF9100]" />
            <span className="text-sm text-[#FF9100] font-medium">El Corazón de tu Impacto</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Certifica con Propósito.
            <br />
            <span className="text-[#7c3aed]">Escala tu Mentoría.</span>
          </h2>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            ¿Y si pudieras acompañar a otros en un viaje de transformación… con un programa ya creado, avalado y listo para escalar?
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contenido */}
          <div className="space-y-8">
            <div className="prose prose-lg max-w-none text-gray-600">
              <p>
                En InverSer no vienes a aprender de cero. Vienes a convertirte en un <strong className="text-gray-900">canal de expansión</strong>. Como Mentor & Partner, tendrás acceso a una certificación profesional de NeuroCoaching completamente lista para entregar a tus aprendices.
              </p>
              
              <p>
                No tienes que crear los contenidos. No tienes que diseñar los ejercicios. No tienes que montar una plataforma. <strong className="text-gray-900">Todo eso ya existe</strong>. Tu rol es el más importante: acompañar, guiar, estar presente.
              </p>
            </div>
            
            {/* Acreditaciones - diseño limpio */}
            <div className="pt-8 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Programa avalado por</p>
              <div className="flex flex-wrap gap-4">
                {['Global Coaching Federation', 'Florida Global University', 'Centro de Educación y Liderazgo'].map((name, idx) => (
                  <span key={idx} className="text-sm text-gray-500 flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#7c3aed]" />
                    {name}
                  </span>
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
          
          {/* Card de beneficios - diseño premium */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-[#7c3aed]/5 to-[#c4ff0f]/5 rounded-3xl" />
            <div className="relative bg-[#031730] rounded-2xl p-8 md:p-10 text-white">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#c4ff0f]/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[#c4ff0f]" />
                </div>
                ¿Qué obtienes exactamente?
              </h3>
              
              <ul className="space-y-5">
                {[
                  'Certificación en 3 niveles: Junior, Senior y Máster',
                  '1500 Horas de Evolución y Transformación',
                  'Plataforma completa para tus mentees',
                  'Método PEDALEAR: transformación con estructura',
                  'Tu propia landing personalizada',
                  'Acceso al ecosistema completo InverSer'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <CheckCircle className="w-5 h-5 text-[#c4ff0f] flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-10 pt-8 border-t border-white/10">
                <p className="text-sm text-white/60">
                  <span className="text-[#c4ff0f] font-medium">Monetización con sentido:</span> Comercializa esta certificación y quédate con la mayor parte del ingreso. No trabajas para InverSer. Eres dueño de tu mentoría.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// SECCIÓN STATEMENT - Fondo inmersivo
// ============================================
const StatementSection = () => (
  <section className="relative py-32 md:py-40 overflow-hidden">
    {/* Imagen de fondo con tratamiento */}
    <div className="absolute inset-0">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${IMAGES.transformationAmbient})` }}
      />
      <div className="absolute inset-0 bg-[#031730]/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#7c3aed]/20 to-transparent" />
    </div>
    
    <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p className="text-2xl md:text-4xl lg:text-5xl font-light text-white leading-relaxed">
        Si eres coach, terapeuta, formador, consultor o una persona con vocación de acompañar a otros…
        <br /><br />
        <span className="font-semibold text-[#c4ff0f]">este es tu lugar.</span>
      </p>
    </div>
  </section>
);

// ============================================
// HERRAMIENTAS - Grid elegante con iconografía
// ============================================
const HerramientasGestionSection = () => {
  const tools = [
    {
      icon: Calendar,
      title: 'iCalendar',
      description: 'Organiza tu jornada de forma clara y alineada con tu energía. Sincroniza calendarios, gestiona disponibilidad.',
      color: '#7c3aed'
    },
    {
      icon: Layout,
      title: 'iProjects',
      description: 'Cada mentee como un proyecto de transformación. Tableros, sprints y seguimiento visual del progreso.',
      color: '#FF9100'
    },
    {
      icon: Heart,
      title: 'iCRM',
      description: 'El corazón digital de tus relaciones. Cada contacto tiene rostro, historia y camino propio.',
      color: '#1A8314'
    },
    {
      icon: BookOpen,
      title: 'iLearning',
      description: 'Tu campus vivo. Accede a módulos de formación y crea tus propios contenidos.',
      color: '#7c3aed'
    },
    {
      icon: Video,
      title: 'WebMeet',
      description: 'Salas virtuales hasta 1.000 asistentes. Graba, comparte pantalla, colabora.',
      color: '#FF9100'
    },
    {
      icon: Send,
      title: 'IConnect',
      description: 'Mensajería inteligente estilo Slack. Canales, menciones, todo centralizado.',
      color: '#1A8314'
    }
  ];

  return (
    <section id="herramientas" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7c3aed]/10 mb-6">
            <Briefcase className="w-4 h-4 text-[#7c3aed]" />
            <span className="text-sm text-[#7c3aed] font-medium">Herramientas</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Tu infraestructura de{' '}
            <span className="text-[#7c3aed]">acompañamiento</span>
          </h2>
          
          <p className="text-xl text-gray-600">
            Un ecosistema que te sostiene mientras tú sostienes a otros.
          </p>
        </div>
        
        {/* Grid de herramientas - diseño limpio */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, idx) => (
            <div 
              key={idx} 
              className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-500"
            >
              <div 
                className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${tool.color}10` }}
              >
                <tool.icon className="w-7 h-7" style={{ color: tool.color }} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">{tool.title}</h3>
              <p className="text-gray-600 leading-relaxed">{tool.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// IA SECTION - Diseño futurista pero humano
// ============================================
const IASection = () => (
  <section className="relative py-24 md:py-32 overflow-hidden">
    {/* Fondo con gradiente y textura */}
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
            <span className="text-sm text-white/80">iTeam IA</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            Inteligencia Artificial
            <br />
            <span className="text-[#c4ff0f]">con alma</span>
          </h2>
          
          <p className="text-xl text-white/70 leading-relaxed">
            El mundo necesita mentores conscientes, capaces de tender puentes entre lo tecnológico y lo humano. Hemos creado una IA que acompaña sin reemplazar.
          </p>
          
          {/* MIA Card */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#c4ff0f] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">MIA</p>
                <p className="text-sm text-white/50">Mentora de Inteligencia Artificial</p>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Entrenada con los valores y filosofía del NeuroCoaching Evolutivo. Tu asistente consciente.
            </p>
          </div>
          
          <blockquote className="border-l-2 border-[#c4ff0f] pl-6 text-white/70 italic text-lg">
            &ldquo;El mentor del futuro no teme a la IA. La guía. La humaniza.&rdquo;
          </blockquote>
        </div>
        
        {/* Capacidades de MIA */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-8">¿Qué puede hacer MIA por ti?</h3>
          <div className="space-y-4">
            {[
              'Sugerirte ideas para sesiones',
              'Resolver dudas de tus mentees',
              'Conectarte con el contenido formativo',
              'Diseñar campañas de comunicación',
              'Planificar y ordenar ideas',
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
// KOMMUNITY - Fondo inmersivo con overlay
// ============================================
const KommunitySection = () => (
  <section id="comunidad" className="relative py-24 md:py-32 overflow-hidden">
    {/* Fondo con imagen */}
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
            <span className="text-sm text-[#FF9100] font-medium">KOMMUNITY</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
            Neuronas que se conectan,
            <br />
            <span className="text-[#7c3aed]">almas que co-crean</span>
          </h2>
          
          <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
            <p>
              La comunidad no es un accesorio: es el <strong className="text-gray-900">tejido vivo de la transformación</strong>. Por eso hablamos de KOMMUNITY, con &ldquo;K&rdquo; de kinética, de conexión, de conocimiento compartido.
            </p>
            
            <p>
              Cada mentor, cada mentee, se convierte en una neurona viva dentro de una red mayor. Lo que uno aprende, ilumina a otros.
            </p>
          </div>
          
          <blockquote className="border-l-4 border-[#c4ff0f] pl-6 text-gray-500 italic text-lg">
            &ldquo;Cuando compartes desde tu verdad, no solo enseñas: invitas a otros a ser más ellos mismos.&rdquo;
          </blockquote>
        </div>
        
        {/* Grid visual */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: MessageSquare, label: 'Hilos profundos', color: '#7c3aed' },
            { icon: Users, label: 'Co-creación', color: '#FF9100' },
            { icon: Heart, label: 'Luces y sombras', color: '#1A8314' },
            { icon: Sparkles, label: 'Conciencia circular', color: '#c4ff0f' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow text-center">
              <div 
                className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: `${item.color}15` }}
              >
                <item.icon className="w-6 h-6" style={{ color: item.color }} />
              </div>
              <p className="font-medium text-gray-800 text-sm">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ============================================
// TOOLBOX - Diseño compacto y elegante
// ============================================
const ToolboxSection = () => (
  <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Contenido */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7c3aed]/10">
            <Briefcase className="w-4 h-4 text-[#7c3aed]" />
            <span className="text-sm text-[#7c3aed] font-medium">TOOLBOX</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
            Tu caja de herramientas
            <br />
            <span className="text-[#7c3aed]">profesional</span>
          </h2>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            No creemos en formar mentores solo desde el conocimiento. Creemos en formar mentores <strong className="text-gray-900">capaces de intervenir, acompañar y transformar</strong> en contextos reales.
          </p>
          
          <p className="text-gray-500">
            El Toolbox no te dice qué hacer. Te da con qué hacerlo. Es tu apoyo silencioso, tu respaldo profesional.
          </p>
        </div>
        
        {/* Grid de recursos */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Users, text: '+1.000 dinámicas', color: '#7c3aed' },
            { icon: FileText, text: 'Plantillas pro', color: '#FF9100' },
            { icon: Target, text: 'Diagnósticos', color: '#1A8314' },
            { icon: BookOpen, text: '+600 títulos', color: '#7c3aed' },
            { icon: Play, text: 'Cursos video', color: '#FF9100' },
            { icon: Heart, text: 'Cuerpo-emoción', color: '#1A8314' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${item.color}15` }}
              >
                <item.icon className="w-5 h-5" style={{ color: item.color }} />
              </div>
              <span className="font-medium text-gray-700 text-sm">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ============================================
// IPARTNER - Monetización con elegancia
// ============================================
const IPartnerSection = ({ mentorData, onActionClick }) => {
  const { actions, mentorLinks, campaignLinks } = prepareAnchorData(mentorData);

  return (
    <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#031730]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <TrendingUp className="w-4 h-4 text-[#c4ff0f]" />
              <span className="text-sm text-white/80">iPartner</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              Monetiza tu impacto,
              <br />
              <span className="text-[#c4ff0f]">multiplica tu legado</span>
            </h2>
            
            <p className="text-xl text-white/70 leading-relaxed">
              Además de formarte y transformar vidas, en InverSer también puedes generar ingresos. iPartner es nuestro sistema de afiliación consciente.
            </p>
            
            <ul className="space-y-4">
              {[
                'Invita mentores y recibe comisión directa',
                'Ganancias por segundo nivel',
                'Modelo ético de expansión'
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-white/70">
                  <CheckCircle className="w-5 h-5 text-[#c4ff0f]" />
                  {item}
                </li>
              ))}
            </ul>
            
            <ButtonAnchor
              buttonKey="email_mpp"
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
              <div className="w-10 h-10 rounded-xl bg-[#c4ff0f]/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#c4ff0f]" />
              </div>
              <h3 className="text-xl font-bold text-white">Landings Personalizadas</h3>
            </div>
            
            <p className="text-white/70 mb-6 leading-relaxed">
              Cada mentor tiene acceso a landings personalizadas como esta. Tu foto, tu presentación, tus enlaces.
            </p>
            
            <ul className="space-y-3 text-white/60 text-sm">
              {[
                'Tu foto y presentación',
                'Landing para el ecosistema',
                'Landings por certificación',
                'Formatos adaptables'
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-[#c4ff0f]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// CTA FINAL - Impactante y emocional
// ============================================
const CTAFinalSection = ({ mentorData, onActionClick }) => {
  const { actions, mentorLinks, campaignLinks } = prepareAnchorData(mentorData);

  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      {/* Fondo gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed] via-[#5b21b6] to-[#4c1d95]" />
      
      {/* Decoración */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full filter blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#c4ff0f]/20 rounded-full filter blur-[150px]" />
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-8">
          Si sientes que este mundo necesita
          <br />
          <span className="text-[#c4ff0f]">más mentores conscientes...</span>
        </h2>
        
        <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto font-light">
          Entonces sigue avanzando. Esto no es una promesa. Es una arquitectura.
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
        
        <p className="mt-12 text-white/50 text-sm">
          Bienvenido al Mentor & Partner Program. Tu legado comienza aquí.
        </p>
      </div>
    </section>
  );
};

// ============================================
// FOOTER - Minimalista y elegante
// ============================================
const FooterMPP = ({ mentorData, onActionClick }) => {
  const mentor = mentorData?.mentor || {};
  const hasMentor = mentor.first_name && mentor.first_name !== '';
  const { actions, mentorLinks, campaignLinks } = prepareAnchorData(mentorData);

  return (
    <footer className="bg-[#031730] text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12 pb-12 border-b border-white/10">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <LogoMPP />
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Ecosistema de empoderamiento para mentores conscientes.
            </p>
          </div>
          
          {/* Navegación */}
          <div>
            <p className="font-semibold text-white mb-4">Navegación</p>
            <nav className="flex flex-col space-y-2">
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
          
          {/* Mentor - alineado a la derecha */}
          <div className="flex flex-col items-end text-right">
            {hasMentor && (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <div>
                    <p className="font-semibold">{mentor.first_name} {mentor.last_name}</p>
                    <p className="text-[#c4ff0f] text-sm">Team Líder</p>
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
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
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
// MAIN LANDING COMPONENT
// ============================================
const LandingMPP = ({ mentorData, onActionClick }) => {
  useEffect(() => {
    const campaignName = mentorData?.campaign?.name || 'Mentor & Partner Program';
    document.title = campaignName;
  }, [mentorData]);

  return (
    <div className="min-h-screen">
      <NavbarMPP mentorData={mentorData} onActionClick={onActionClick} />
      <HeroMPP mentorData={mentorData} onActionClick={onActionClick} />
      <IntroEcosistemaSection />
      <CertificacionSection mentorData={mentorData} onActionClick={onActionClick} />
      <StatementSection />
      <HerramientasGestionSection />
      <IASection />
      <KommunitySection />
      <ToolboxSection />
      <IPartnerSection mentorData={mentorData} onActionClick={onActionClick} />
      <CTAFinalSection mentorData={mentorData} onActionClick={onActionClick} />
      <FooterMPP mentorData={mentorData} onActionClick={onActionClick} />
    </div>
  );
};

export default LandingMPP;
