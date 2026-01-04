/**
 * LandingMPP - Landing para Mentor & Partner Program (Plan Pioneros)
 * campaign_key: mpp
 * 
 * ARQUITECTURA:
 * - Landing aislada, no modifica componentes compartidos
 * - Consume datos del mentor desde el sistema (no hardcodea)
 * - Usa ButtonAnchor para todos los CTAs
 * - Paleta: Púrpura #7c3aed, Verde #c4ff0f, Azul #031730, Naranja #FF9100, Verde grama #1A8314
 * 
 * BOTONES (ButtonAnchor):
 * - agendar_mpp: Agendar llamada
 * - whatsapp_mpp: WhatsApp
 * - email_mpp: Contacto email
 * - ver_certificacion_mpp: Conocer certificación
 * - ver_perfil_mpp: Ver perfil del mentor
 * - aplicar_mpp: CTA final
 * - ir_perfil_footer_mpp: Perfil en footer
 */

import React, { useEffect } from 'react';
import { 
  Calendar, Clock, Users, BookOpen, Brain, MessageSquare,
  Video, Headphones, Layout, Globe, Briefcase, Link2,
  Award, Star, ChevronRight, Mail, Phone, ExternalLink,
  Sparkles, Target, Heart, Zap, Shield, TrendingUp,
  Play, Mic, Move, Grid, Send, DollarSign, FileText
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { getImageUrl } from '../utils/imageUrl';
import ButtonAnchor, { prepareAnchorData } from '../components/ButtonAnchor';

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#031730]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <LogoMPP />
          <div className="hidden md:flex items-center space-x-6 text-sm text-white/80">
            <a href="#ecosistema" className="hover:text-[#c4ff0f] transition-colors">Ecosistema</a>
            <a href="#herramientas" className="hover:text-[#c4ff0f] transition-colors">Herramientas</a>
            <a href="#comunidad" className="hover:text-[#c4ff0f] transition-colors">Comunidad</a>
            <a href="#toolbox" className="hover:text-[#c4ff0f] transition-colors">Toolbox</a>
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
// HERO SECTION
// ============================================
const HeroMPP = ({ mentorData, onActionClick }) => {
  const mentor = mentorData?.mentor || {
    first_name: '',
    last_name: '',
    photo_url: null,
    title: 'Mentor Certificado'
  };
  
  const { actions, mentorLinks, campaignLinks } = prepareAnchorData(mentorData);
  const hasMentor = mentor.first_name && mentor.first_name !== '';

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#031730] via-[#0a2540] to-[#031730]" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#7c3aed] rounded-full filter blur-[120px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#c4ff0f] rounded-full filter blur-[150px] opacity-30" />
      </div>
      
      {/* Neural pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='1.5' fill='%23ffffff'/%3E%3Ccircle cx='10' cy='10' r='1' fill='%23c4ff0f'/%3E%3Ccircle cx='50' cy='10' r='1' fill='%237c3aed'/%3E%3Ccircle cx='10' cy='50' r='1' fill='%237c3aed'/%3E%3Ccircle cx='50' cy='50' r='1' fill='%23c4ff0f'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <Badge className="bg-[#c4ff0f]/20 text-[#c4ff0f] border-[#c4ff0f]/30 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Plan Pioneros
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-white">Mentor</span>
              <span className="text-[#c4ff0f]"> & </span>
              <span className="text-white">Partner</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#c4ff0f]">
                Program
              </span>
            </h1>
            
            <p className="text-xl text-white/80 leading-relaxed max-w-xl">
              Bienvenido a una nueva dimensión del mentoring. Un <strong className="text-[#c4ff0f]">ecosistema de empoderamiento</strong> donde tu experiencia, tu criterio y tu vocación se amplifican.
            </p>
            
            <p className="text-lg text-white/60">
              No es un curso. No es una certificación aislada. Es una <strong className="text-white/90">infraestructura completa</strong> para que puedas ejercer tu rol de mentor con profundidad, respaldo y proyección.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <ButtonAnchor
                buttonKey="agendar_mpp"
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
          </div>
          
          {/* Right - Mentor Photo */}
          <div className="flex flex-col items-center lg:items-end">
            <div className="relative">
              {/* Decorative ring */}
              <div className="absolute -inset-4 bg-gradient-to-br from-[#7c3aed]/30 to-[#c4ff0f]/30 rounded-full blur-xl" />
              
              {/* Photo container */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-[#c4ff0f]/40 shadow-2xl">
                {mentor.photo_url ? (
                  <img
                    src={getImageUrl(mentor.photo_url)}
                    alt={hasMentor ? `${mentor.first_name} ${mentor.last_name}` : 'Tu Mentor'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#7c3aed]/40 to-[#031730] flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#c4ff0f] flex items-center justify-center">
                        <Users className="w-10 h-10 text-white" />
                      </div>
                      <p className="text-white/60 text-sm">Tu Mentor</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Mentor info */}
            {hasMentor && (
              <div className="mt-6 text-center lg:text-right">
                <p className="text-xl font-semibold text-white">
                  {mentor.first_name} {mentor.last_name}
                </p>
                <p className="text-white/60">{mentor.title || 'Mentor Certificado InverSer'}</p>
              </div>
            )}
            
            {/* Ver Perfil button */}
            <div className="mt-4">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// INTRO ECOSISTEMA SECTION
// ============================================
const IntroEcosistemaSection = () => (
  <section id="ecosistema" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#faf8f5]">
    <div className="max-w-4xl mx-auto text-center space-y-8">
      <Badge className="bg-[#7c3aed]/10 text-[#7c3aed] border-[#7c3aed]/20">
        <Target className="w-4 h-4 mr-2" />
        El Ecosistema
      </Badge>
      
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
        Aquí no vienes a consumir contenidos.
        <br />
        <span className="text-[#7c3aed]">Vienes a habitar un ecosistema.</span>
      </h2>
      
      <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
        <p>
          Vivimos en un tiempo vertiginoso. La Inteligencia Artificial avanza sin pausa, automatiza procesos, optimiza decisiones y redefine el trabajo. Pero mientras la tecnología crece, algo queda en riesgo: la <strong>capacidad humana de comprender, sostener y acompañar procesos emocionales y vitales</strong>.
        </p>
        
        <p>
          InverSer evoluciona desde ahí. Desde años de experiencia real en el mundo digital, en la formación de coaches, en procesos profundos de transformación humana.
        </p>
        
        <p className="text-xl font-medium text-gray-900">
          Hoy, InverSer se expresa con más claridad en ese punto donde <span className="text-[#7c3aed]">la tecnología necesita conciencia</span>. Donde la información necesita sentido. Y donde las personas necesitan mentores preparados para este nuevo mundo.
        </p>
      </div>
    </div>
  </section>
);

// ============================================
// CERTIFICACIÓN SECTION
// ============================================
const CertificacionSection = ({ mentorData, onActionClick }) => {
  const { actions, mentorLinks, campaignLinks } = prepareAnchorData(mentorData);
  
  const acreditaciones = [
    { icon: Globe, name: 'Global Coaching Federation (GCF)' },
    { icon: Award, name: 'Florida Global University' },
    { icon: BookOpen, name: 'Centro de Educación y Liderazgo' },
    { icon: Globe, name: 'Confederación Interamericana de Coaching' }
  ];
  
  const beneficios = [
    'Certificación estructurada en 3 niveles: Junior, Senior y Máster',
    '1500 Horas de Evolución y Transformación',
    'Plataforma completamente desarrollada para tus mentees',
    'Método PEDALEAR: ciclo de transformación con estructura y profundidad',
    'Método CRECE+: crecimiento continuo a través de conexión y reflexión',
    'Tu propia landing personalizada para invitar prospectos'
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <Badge className="bg-[#FF9100]/10 text-[#FF9100] border-[#FF9100]/20 mb-4">
                <Heart className="w-4 h-4 mr-2" />
                El Corazón de tu Impacto
              </Badge>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Certifica con Propósito.
                <br />
                <span className="text-[#7c3aed]">Escala tu Mentoría.</span>
              </h2>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                ¿Y si pudieras acompañar a otros en un viaje de transformación… con un programa ya creado, avalado y listo para escalar?
              </p>
            </div>
            
            <p className="text-gray-600">
              En InverSer no vienes a aprender de cero. Vienes a convertirte en un <strong>canal de expansión</strong>. Como Mentor & Partner, tendrás acceso a una certificación profesional de NeuroCoaching completamente lista para entregar a tus aprendices.
            </p>
            
            {/* Acreditaciones */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Avalada por:</p>
              <div className="grid grid-cols-2 gap-3">
                {acreditaciones.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                    <item.icon className="w-4 h-4 text-[#7c3aed]" />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* CTA */}
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
          
          {/* Right - Beneficios */}
          <div className="bg-gradient-to-br from-[#031730] to-[#0a2540] rounded-2xl p-8 text-white">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#c4ff0f]" />
              ¿Qué obtienes exactamente?
            </h3>
            
            <ul className="space-y-4">
              {beneficios.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <ChevronRight className="w-5 h-5 text-[#c4ff0f] flex-shrink-0 mt-0.5" />
                  <span className="text-white/90">{item}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-sm text-white/70">
                <strong className="text-[#c4ff0f]">Tu rol:</strong> Acompañar, guiar, estar presente. La tecnología, los contenidos, la infraestructura… ya están cubiertos por InverSer.
              </p>
            </div>
            
            <div className="mt-6 p-4 bg-[#c4ff0f]/10 rounded-xl border border-[#c4ff0f]/20">
              <p className="text-sm">
                <strong className="text-[#c4ff0f]">Monetización con sentido:</strong> Comercializa esta certificación y quédate con la mayor parte del ingreso. No trabajas para InverSer. Eres dueño de tu mentoría.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// TOOL CARD COMPONENT
// ============================================
const ToolCard = ({ icon: Icon, title, subtitle, description, features, color = '#7c3aed', accent = '#c4ff0f' }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
    <div className="flex items-start gap-4 mb-4">
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    </div>
    
    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{description}</p>
    
    {features && features.length > 0 && (
      <ul className="space-y-2">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
            <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: accent }} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

// ============================================
// HERRAMIENTAS GESTION SECTION
// ============================================
const HerramientasGestionSection = () => {
  const tools = [
    {
      icon: Calendar,
      title: 'iCalendar',
      subtitle: 'Tu tiempo es tu activo más valioso',
      description: 'Organiza tu jornada de forma clara y espiritual. Integra Google, Outlook y más.',
      features: [
        'Sesiones de mentoría 1 a 1 o grupales',
        'Espacios VIP monetizables',
        'Tú defines tus bloques y límites'
      ],
      color: '#7c3aed'
    },
    {
      icon: Layout,
      title: 'iProjects',
      subtitle: 'Cada mentee es un proyecto de transformación',
      description: 'Gestiona el avance de tus mentees como proyectos ágiles de transformación profunda.',
      features: [
        'Tableros por mentee con tareas prediseñadas',
        'Sprints alineados al método PEDALEAR',
        'Crea tus propias plantillas de formación'
      ],
      color: '#FF9100'
    },
    {
      icon: Heart,
      title: 'iCRM',
      subtitle: 'Relaciones que transforman',
      description: 'El corazón digital de tus relaciones significativas. Cada mentee tiene rostro, voz, camino.',
      features: [
        'Fichas personalizadas con hilo emocional',
        'Registro de sueños, miedos, revelaciones',
        'Gestión por equipos y empresas'
      ],
      color: '#1A8314'
    },
    {
      icon: BookOpen,
      title: 'iLearning',
      subtitle: 'Tu sabiduría merece un escenario',
      description: 'Tu campus vivo. Accede a todos los módulos y crea tus propios contenidos.',
      features: [
        'Acceso completo como mentor',
        'Crea cápsulas, módulos o cursos',
        'Monetiza tus propios saberes'
      ],
      color: '#7c3aed'
    }
  ];

  return (
    <section id="herramientas" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="bg-[#7c3aed]/10 text-[#7c3aed] border-[#7c3aed]/20 mb-4">
            <Briefcase className="w-4 h-4 mr-2" />
            Herramientas de Gestión
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Tu infraestructura de <span className="text-[#7c3aed]">acompañamiento</span>
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Un ecosistema que te sostiene mientras tú sostienes a otros.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {tools.map((tool, idx) => (
            <ToolCard key={idx} {...tool} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// IA SECTION
// ============================================
const IASection = () => (
  <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#031730] to-[#0a2540] text-white">
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <Badge className="bg-[#c4ff0f]/20 text-[#c4ff0f] border-[#c4ff0f]/30">
            <Brain className="w-4 h-4 mr-2" />
            iTeam IA
          </Badge>
          
          <h2 className="text-3xl md:text-4xl font-bold">
            Conecta tu Inteligencia Emocional
            <br />
            <span className="text-[#c4ff0f]">con la Inteligencia Artificial</span>
          </h2>
          
          <p className="text-lg text-white/80 leading-relaxed">
            Estamos entrando en una nueva revolución: la de la inteligencia artificial. Y el mundo necesita <strong className="text-white">mentores conscientes</strong>, capaces de tender puentes entre lo tecnológico y lo humano.
          </p>
          
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#c4ff0f] flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Conoce a MIA</h3>
                <p className="text-white/60 text-sm">Mentora de Inteligencia Artificial</p>
              </div>
            </div>
            <p className="text-white/70 text-sm">
              MIA ha sido entrenada con los contenidos, valores y filosofía del NeuroCoaching Evolutivo. Puede sugerirte ideas, resolver dudas de tus mentees y conectarte con el contenido formativo de manera ágil.
            </p>
          </div>
          
          <blockquote className="border-l-4 border-[#c4ff0f] pl-6 text-white/80 italic">
            &ldquo;El mentor del futuro no teme a la IA. La guía. La humaniza. La transforma en aliada del crecimiento humano.&rdquo;
          </blockquote>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed]/20 to-[#c4ff0f]/20 rounded-3xl blur-2xl" />
          <div className="relative bg-white/5 rounded-3xl p-8 border border-white/10">
            <h3 className="text-xl font-bold mb-6">¿Qué puede hacer MIA por ti?</h3>
            <ul className="space-y-4">
              {[
                'Sugerirte ideas para sesiones o actividades',
                'Resolver dudas frecuentes de tus mentees',
                'Conectarte con el contenido formativo',
                'Ayudarte a sostener el espíritu InverSer',
                'Diseñar campañas y ordenar ideas',
                'Planificar sesiones y escribir textos'
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-white/80">
                  <Zap className="w-5 h-5 text-[#c4ff0f]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ============================================
// KOMMUNITY SECTION
// ============================================
const KommunitySection = () => (
  <section id="comunidad" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#faf8f5]">
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: MessageSquare, label: 'Hilos de conversación', color: '#7c3aed' },
              { icon: Users, label: 'Co-creación colectiva', color: '#FF9100' },
              { icon: Heart, label: 'Compartir luces y sombras', color: '#1A8314' },
              { icon: Sparkles, label: 'Conciencia circular', color: '#c4ff0f' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                <div 
                  className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <item.icon className="w-6 h-6" style={{ color: item.color }} />
                </div>
                <p className="text-sm font-medium text-gray-700">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="order-1 lg:order-2 space-y-6">
          <Badge className="bg-[#FF9100]/10 text-[#FF9100] border-[#FF9100]/20">
            <Users className="w-4 h-4 mr-2" />
            KOMMUNITY
          </Badge>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Neuronas que se conectan,
            <br />
            <span className="text-[#7c3aed]">almas que co-crean</span>
          </h2>
          
          <p className="text-lg text-gray-700 leading-relaxed">
            En InverSer creemos que la comunidad no es un accesorio: es el tejido vivo de la transformación. Por eso no hablamos de "foro". Hablamos de <strong>KOMMUNITY</strong>, con "K" de kinética, de conexión, de conocimiento compartido.
          </p>
          
          <p className="text-gray-600">
            Aquí no vienes a opinar. Vienes a <strong>co-crear una conciencia colectiva</strong>. Cada mentor, cada mentee, se convierte en una neurona viva dentro de una red mayor.
          </p>
          
          <blockquote className="border-l-4 border-[#c4ff0f] pl-6 text-gray-600 italic">
            "Cuando compartes desde tu verdad, no solo enseñas: invitas a otros a ser más ellos mismos."
          </blockquote>
        </div>
      </div>
    </div>
  </section>
);

// ============================================
// VIDEOTK & RECURSOS SECTION
// ============================================
const VideoTKSection = () => {
  const recursos = [
    {
      icon: Headphones,
      title: 'NeuroGym',
      description: 'Audios para reprogramación mental y estados de poder interno',
      color: '#7c3aed'
    },
    {
      icon: Play,
      title: 'VideoTK',
      description: 'Cápsulas diseñadas para provocar reflexión e inspirar nuevos paradigmas',
      color: '#FF9100'
    },
    {
      icon: Move,
      title: 'Movimiento Consciente',
      description: 'Prácticas en video que integran cuerpo y emoción',
      color: '#1A8314'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="bg-[#7c3aed]/10 text-[#7c3aed] border-[#7c3aed]/20 mb-4">
            <Video className="w-4 h-4 mr-2" />
            VideoTK
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Tu cerebro, tu cuerpo, tu emoción...
            <br />
            <span className="text-[#7c3aed]">alineados</span>
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Un campo sensorial donde lo audiovisual se convierte en camino de transformación.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {recursos.map((item, idx) => (
            <div key={idx} className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300">
              <div 
                className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: `${item.color}15` }}
              >
                <item.icon className="w-8 h-8" style={{ color: item.color }} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
        
        <p className="text-center text-gray-500 mt-8 italic">
          "Hay aprendizajes que no entran por la lógica, sino por la vibración. Este es tu laboratorio de sentidos."
        </p>
      </div>
    </section>
  );
};

// ============================================
// MEETING TOOLS SECTION
// ============================================
const MeetingToolsSection = () => {
  const tools = [
    {
      icon: Calendar,
      title: 'BookMeet',
      subtitle: 'Tu tiempo consciente',
      description: 'Más que una herramienta de reservas: un espacio para ordenar tu energía y multiplicar tu impacto.',
      features: ['Conversaciones 1 a 1', 'Sesiones premium cobrables', 'Mentorías grupales y VIP'],
      color: '#7c3aed'
    },
    {
      icon: Video,
      title: 'WebMeet',
      subtitle: 'Espacios sin distancia',
      description: 'Tu espacio de encuentro generativo. Reserva tu sala virtual sin necesidad de Zoom o Meet.',
      features: ['Salas hasta 1.000 asistentes', 'Graba y guarda sesiones', 'Usa para proyectos externos'],
      color: '#FF9100'
    },
    {
      icon: Users,
      title: 'WebBrunch',
      subtitle: 'Reuniones con sentido',
      description: 'Tu sala inmersiva de conexión con alma. Cada quien tiene su silla, su avatar, su espacio.',
      features: ['Coworking y estudio grupal', 'Tertulias y foros de libros', 'Prácticas de coaching'],
      color: '#1A8314'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="bg-[#FF9100]/10 text-[#FF9100] border-[#FF9100]/20 mb-4">
            <Video className="w-4 h-4 mr-2" />
            Herramientas de Encuentro
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Conexión en <span className="text-[#7c3aed]">tiempo real</span>
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Porque la conexión humana ocurre en la mirada, en el silencio compartido, en ese instante en que dos almas se encuentran.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {tools.map((tool, idx) => (
            <ToolCard key={idx} {...tool} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// PROFESSIONAL TOOLS SECTION
// ============================================
const ProfessionalToolsSection = () => {
  const tools = [
    {
      icon: Globe,
      title: 'Directorio Vivo',
      subtitle: 'Tu escaparate al mundo',
      description: 'Más que un listado, es tu escenario digital con perfil editable, blog personal y galería multimedia.',
      features: ['Perfil con tu historia y servicios', 'Blog personal dentro de InverSer', 'Úsalo como página web propia'],
      color: '#7c3aed'
    },
    {
      icon: Grid,
      title: 'AgileWork',
      subtitle: 'Ideas que se vuelven proceso',
      description: 'Tableros tipo Kanban, automatización inteligente y gestión de procesos vivos.',
      features: ['Diseña tableros personalizados', 'Automatiza tareas repetitivas', 'Crea plantillas de formación'],
      color: '#FF9100'
    },
    {
      icon: Send,
      title: 'IConnect',
      subtitle: 'Conversaciones que acercan',
      description: 'Sistema de mensajería inteligente estilo Slack. Canales, menciones y archivos centralizados.',
      features: ['Mensajes directos y canales', 'Widget para tu sitio web', 'Gestión centralizada'],
      color: '#1A8314'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="bg-[#1A8314]/10 text-[#1A8314] border-[#1A8314]/20 mb-4">
            <Briefcase className="w-4 h-4 mr-2" />
            Herramientas Profesionales
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Visibilidad, organización y <span className="text-[#7c3aed]">conexión</span>
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {tools.map((tool, idx) => (
            <ToolCard key={idx} {...tool} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// IPARTNER & MONETIZACIÓN SECTION
// ============================================
const IPartnerSection = ({ mentorData, onActionClick }) => {
  const { actions, mentorLinks, campaignLinks } = prepareAnchorData(mentorData);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#031730] to-[#0a2540] text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Badge className="bg-[#c4ff0f]/20 text-[#c4ff0f] border-[#c4ff0f]/30">
              <DollarSign className="w-4 h-4 mr-2" />
              iPartner
            </Badge>
            
            <h2 className="text-3xl md:text-4xl font-bold">
              Monetiza tu Impacto,
              <br />
              <span className="text-[#c4ff0f]">Multiplica tu Legado</span>
            </h2>
            
            <p className="text-lg text-white/80 leading-relaxed">
              Además de formarte y transformar vidas, en InverSer también puedes generar ingresos. <strong className="text-white">iPartner</strong> es nuestro sistema de afiliación consciente.
            </p>
            
            <ul className="space-y-4">
              {[
                'Invita mentores y recibe comisión directa',
                'Ganancias por segundo nivel de invitados',
                'Cubre el costo de tu membresía con pocos referidos',
                'Modelo ético de expansión con propósito'
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-white/80">
                  <TrendingUp className="w-5 h-5 text-[#c4ff0f]" />
                  {item}
                </li>
              ))}
            </ul>
            
            <blockquote className="border-l-4 border-[#c4ff0f] pl-6 text-white/70 italic">
              "En InverSer, tu impacto también puede sostenerte."
            </blockquote>
            
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
          
          <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#c4ff0f]" />
              Landings Personalizadas
            </h3>
            
            <p className="text-white/80 mb-6">
              Cada mentor tendrá acceso a landings personalizadas como esta que estás leyendo ahora. Una página diseñada especialmente para ti.
            </p>
            
            <ul className="space-y-3 text-white/70 text-sm">
              {[
                'Tu foto, presentación y enlaces de contacto',
                'Landing para presentar el ecosistema a otros mentores',
                'Landings específicas para cada certificación',
                'Formatos adaptables para tus programas'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-[#c4ff0f] flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            
            <div className="mt-6 p-4 bg-[#c4ff0f]/10 rounded-xl">
              <p className="text-sm text-white/80">
                <strong className="text-[#c4ff0f]">Nota:</strong> No necesitas diseñar nada. Nosotros lo hacemos por ti. Tú solo decides qué mostrar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// TOOLBOX SECTION
// ============================================
const ToolboxSection = () => {
  const recursos = [
    { icon: Users, text: '+1.000 dinámicas de grupo', color: '#7c3aed' },
    { icon: FileText, text: 'Plantillas profesionales', color: '#FF9100' },
    { icon: Target, text: 'Modelos de diagnóstico', color: '#1A8314' },
    { icon: Sparkles, text: 'Herramientas proyectivas', color: '#c4ff0f' },
    { icon: Briefcase, text: 'Recursos para coaching empresarial', color: '#7c3aed' },
    { icon: BookOpen, text: '+600 títulos en biblioteca', color: '#FF9100' },
    { icon: Play, text: 'Cursos en video', color: '#1A8314' },
    { icon: Heart, text: 'Materiales cuerpo-emoción-lenguaje', color: '#c4ff0f' }
  ];

  return (
    <section id="toolbox" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="bg-[#7c3aed]/10 text-[#7c3aed] border-[#7c3aed]/20 mb-4">
            <Briefcase className="w-4 h-4 mr-2" />
            TOOLBOX
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Tu Caja de Herramientas
            <br />
            <span className="text-[#7c3aed]">Profesional</span>
          </h2>
          <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
            En InverSer no creemos en formar mentores solo desde el conocimiento. Creemos en formar mentores <strong>capaces de intervenir, acompañar y transformar</strong> en contextos reales.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {recursos.map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div 
                className="w-10 h-10 rounded-lg mb-3 flex items-center justify-center"
                style={{ backgroundColor: `${item.color}15` }}
              >
                <item.icon className="w-5 h-5" style={{ color: item.color }} />
              </div>
              <p className="text-sm font-medium text-gray-700">{item.text}</p>
            </div>
          ))}
        </div>
        
        <div className="bg-gradient-to-br from-[#031730] to-[#0a2540] rounded-3xl p-8 md:p-12 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            El Toolbox no te dice <em>qué hacer</em>.
            <br />
            Te da <span className="text-[#c4ff0f]">con qué hacerlo</span>.
          </h3>
          <p className="text-white/70 max-w-2xl mx-auto">
            Es tu apoyo silencioso. Tu respaldo profesional. Tu caja de recursos cuando el proceso lo exige. Porque un mentor con herramientas claras puede sostener procesos profundos.
          </p>
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
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#7c3aed] to-[#5b21b6] text-white">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h2 className="text-3xl md:text-5xl font-bold leading-tight">
          Si sientes que este mundo necesita
          <br />
          <span className="text-[#c4ff0f]">más mentores conscientes...</span>
        </h2>
        
        <p className="text-xl text-white/90 max-w-2xl mx-auto">
          Si intuyes que tu rol puede crecer más allá de las sesiones uno a uno. Si buscas un espacio que te potencie sin deshumanizarte...
        </p>
        
        <p className="text-lg text-white/70">
          Entonces sigue avanzando. Esto no es una promesa. Es una arquitectura.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
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
        
        <p className="text-white/60 text-sm pt-8">
          Bienvenido al <strong>Mentor & Partner Program</strong>. Bienvenido al <strong>Plan Pioneros</strong>.
        </p>
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
    <footer className="bg-[#031730] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Mentor info si existe */}
        {hasMentor && (
          <div className="flex flex-col items-center mb-10 pb-10 border-b border-white/10">
            <div className="flex items-center gap-4 mb-4">
              {mentor.photo_url && (
                <img 
                  src={getImageUrl(mentor.photo_url)} 
                  alt={`${mentor.first_name} ${mentor.last_name}`}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#c4ff0f]/40"
                />
              )}
              <div>
                <p className="font-semibold text-lg">{mentor.first_name} {mentor.last_name}</p>
                <p className="text-white/60 text-sm">{mentor.title || 'Mentor Certificado InverSer'}</p>
              </div>
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
          </div>
        )}
        
        {/* Logo y enlaces */}
        <div className="flex flex-col items-center space-y-6">
          <LogoMPP />
          
          {/* Links legales */}
          <div className="flex items-center gap-4 text-sm text-white/60">
            <a 
              href="https://inverser.us/terminos-condiciones/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[#c4ff0f] transition-colors"
            >
              Términos y Condiciones
            </a>
          </div>
          
          {/* Copyright */}
          <div className="text-center text-sm text-white/40">
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
            </p>
            <p>Todos los derechos reservados</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ============================================
// MAIN LANDING COMPONENT
// ============================================
const LandingMPP = ({ mentorData, onActionClick }) => {
  // Set page title
  useEffect(() => {
    const campaignName = mentorData?.campaign?.name || 'Mentor & Partner Program';
    document.title = campaignName;
  }, [mentorData]);

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <NavbarMPP mentorData={mentorData} onActionClick={onActionClick} />
      <HeroMPP mentorData={mentorData} onActionClick={onActionClick} />
      <IntroEcosistemaSection />
      <CertificacionSection mentorData={mentorData} onActionClick={onActionClick} />
      <HerramientasGestionSection />
      <IASection />
      <KommunitySection />
      <VideoTKSection />
      <MeetingToolsSection />
      <ProfessionalToolsSection />
      <IPartnerSection mentorData={mentorData} onActionClick={onActionClick} />
      <ToolboxSection />
      <CTAFinalSection mentorData={mentorData} onActionClick={onActionClick} />
      <FooterMPP mentorData={mentorData} onActionClick={onActionClick} />
    </div>
  );
};

export default LandingMPP;
