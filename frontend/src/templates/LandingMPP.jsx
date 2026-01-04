/**
 * LandingMPP - Landing para Mentor & Partner Program (Plan Pioneros)
 * campaign_key: mpp
 * 
 * VERSIÓN 2: Contenido completo con alma + imágenes reales + correcciones de layout
 * 
 * CORRECCIONES APLICADAS:
 * - Contenido completo recuperado del brief original
 * - CTAs movidos al lado derecho (debajo de Ver Perfil)
 * - "Mentor Certificado InverSer" cambiado a "Team Líder"
 * - Alineación centrada de foto, nombre, título y botón
 * - Imágenes realistas añadidas
 * - Footer: mentor alineado a la derecha + menú de navegación
 */

import React, { useEffect } from 'react';
import { 
  Calendar, Clock, Users, BookOpen, Brain, MessageSquare,
  Video, Headphones, Layout, Globe, Briefcase, Link2,
  Award, Star, ChevronRight, Mail, Phone, ExternalLink,
  Sparkles, Target, Heart, Zap, Shield, TrendingUp,
  Play, Mic, Move, Grid, Send, DollarSign, FileText,
  CheckCircle
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { getImageUrl } from '../utils/imageUrl';
import ButtonAnchor, { prepareAnchorData } from '../components/ButtonAnchor';

// ============================================
// IMÁGENES DE LA LANDING
// ============================================
const IMAGES = {
  certificacion: 'https://images.unsplash.com/photo-1659080909445-e1c007f87282?w=800&q=80',
  comunidad: 'https://images.pexels.com/photos/8613319/pexels-photo-8613319.jpeg?w=800',
  ia: 'https://images.unsplash.com/photo-1694903089438-bf28d4697d9a?w=800&q=80',
  herramientas: 'https://images.pexels.com/photos/7213549/pexels-photo-7213549.jpeg?w=800',
  transformacion: 'https://images.unsplash.com/photo-1633158834806-766387547d2c?w=800&q=80',
  workspace: 'https://images.pexels.com/photos/296115/pexels-photo-296115.jpeg?w=800',
  collaboration: 'https://images.pexels.com/photos/2962135/pexels-photo-2962135.jpeg?w=800',
  growth: 'https://images.unsplash.com/photo-1758930908722-6f8f561d7473?w=800&q=80'
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#031730]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <LogoMPP />
          <div className="hidden md:flex items-center space-x-6 text-sm text-white/80">
            <a href="#ecosistema" className="hover:text-[#c4ff0f] transition-colors">Ecosistema</a>
            <a href="#certificacion" className="hover:text-[#c4ff0f] transition-colors">Certificación</a>
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
// HERO SECTION - CORREGIDO
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
          </div>
          
          {/* Right - Mentor Photo + CTAs (TODO CENTRADO) */}
          <div className="flex flex-col items-center">
            {/* Photo container */}
            <div className="relative">
              {/* Decorative ring */}
              <div className="absolute -inset-4 bg-gradient-to-br from-[#7c3aed]/30 to-[#c4ff0f]/30 rounded-full blur-xl" />
              
              {/* Photo */}
              <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-[#c4ff0f]/40 shadow-2xl">
                {mentor.photo_url ? (
                  <img
                    src={getImageUrl(mentor.photo_url)}
                    alt={hasMentor ? `${mentor.first_name} ${mentor.last_name}` : 'Tu Mentor'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#7c3aed]/40 to-[#031730] flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#c4ff0f] flex items-center justify-center">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-white/60 text-sm">Tu Mentor</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Mentor info - CENTRADO */}
            <div className="mt-6 text-center">
              <p className="text-xl font-semibold text-white">
                {hasMentor ? `${mentor.first_name} ${mentor.last_name}` : 'Tu Mentor'}
              </p>
              <p className="text-[#c4ff0f]/80 text-sm mt-1">Team Líder</p>
            </div>
            
            {/* Botones - CENTRADOS debajo del mentor */}
            <div className="mt-6 flex flex-col items-center gap-3 w-full max-w-xs">
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
    </section>
  );
};

// ============================================
// INTRO ECOSISTEMA SECTION - CONTENIDO COMPLETO
// ============================================
const IntroEcosistemaSection = () => (
  <section id="ecosistema" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#faf8f5]">
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center">
        <Badge className="bg-[#7c3aed]/10 text-[#7c3aed] border-[#7c3aed]/20 mb-6">
          <Target className="w-4 h-4 mr-2" />
          El Ecosistema
        </Badge>
        
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Aquí no vienes a consumir contenidos.
          <br />
          <span className="text-[#7c3aed]">Vienes a habitar un ecosistema.</span>
        </h2>
      </div>
      
      <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
        <p className="text-xl leading-relaxed">
          Vivimos en un tiempo vertiginoso. La Inteligencia Artificial avanza sin pausa, automatiza procesos, optimiza decisiones y redefine el trabajo. Pero mientras la tecnología crece, algo queda en riesgo: la <strong className="text-gray-900">capacidad humana de comprender, sostener y acompañar procesos emocionales y vitales</strong>.
        </p>
        
        <p>
          Las personas no solo necesitan respuestas. Necesitan presencia. Necesitan alguien que les ayude a ver lo que aún no ven. Alguien que no les dé fórmulas, sino que les acompañe en el camino de descubrir las propias. Ese rol —el del mentor, el coach, el acompañante consciente— no puede ser reemplazado por una máquina. Pero sí puede ser <strong className="text-gray-900">potenciado por la tecnología adecuada</strong>.
        </p>
        
        <div className="bg-gradient-to-r from-[#7c3aed]/5 to-[#c4ff0f]/5 rounded-2xl p-8 border-l-4 border-[#7c3aed]">
          <p className="text-xl font-medium text-gray-900 mb-4">
            InverSer evoluciona desde ahí.
          </p>
          <p className="text-gray-700">
            Desde años de experiencia real en el mundo digital, en la formación de coaches, en procesos profundos de transformación humana. No somos una plataforma más. No somos un marketplace de servicios. Somos un ecosistema para mentores conscientes.
          </p>
        </div>
        
        <p className="text-xl font-medium text-gray-900 text-center py-4">
          Hoy, InverSer se expresa con más claridad en ese punto donde <span className="text-[#7c3aed]">la tecnología necesita conciencia</span>. Donde la información necesita sentido. Y donde las personas necesitan mentores preparados para este nuevo mundo.
        </p>
        
        <p>
          Si eres coach, terapeuta, formador, consultor, líder de equipos o simplemente una persona con vocación de acompañar a otros… este es tu lugar. Aquí encontrarás estructura sin rigidez, herramientas sin frialdad, comunidad sin competencia. Un espacio donde <strong className="text-gray-900">tu experiencia se vuelve legado</strong>. Y donde cada mentee que acompañas se convierte en semilla de una transformación mayor.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 pt-8">
        {[
          { icon: Heart, text: 'Estructura sin rigidez', color: '#7c3aed' },
          { icon: Zap, text: 'Herramientas sin frialdad', color: '#FF9100' },
          { icon: Users, text: 'Comunidad sin competencia', color: '#1A8314' }
        ].map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <div 
              className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: `${item.color}15` }}
            >
              <item.icon className="w-7 h-7" style={{ color: item.color }} />
            </div>
            <p className="font-medium text-gray-800">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ============================================
// CERTIFICACIÓN SECTION - CONTENIDO COMPLETO CON IMAGEN
// ============================================
const CertificacionSection = ({ mentorData, onActionClick }) => {
  const { actions, mentorLinks, campaignLinks } = prepareAnchorData(mentorData);
  
  const acreditaciones = [
    { icon: Globe, name: 'Global Coaching Federation (GCF)' },
    { icon: Award, name: 'Florida Global University' },
    { icon: BookOpen, name: 'Centro de Educación y Liderazgo' },
    { icon: Globe, name: 'Confederación Interamericana de Coaching' }
  ];

  return (
    <section id="certificacion" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-[#FF9100]/10 text-[#FF9100] border-[#FF9100]/20 mb-4">
            <Heart className="w-4 h-4 mr-2" />
            El Corazón de tu Impacto
          </Badge>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Certifica con Propósito.
            <br />
            <span className="text-[#7c3aed]">Escala tu Mentoría.</span>
          </h2>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="text-xl leading-relaxed">
                ¿Y si pudieras acompañar a otros en un viaje de transformación… con un programa ya creado, avalado y listo para escalar?
              </p>
              
              <p>
                En InverSer no vienes a aprender de cero. Vienes a convertirte en un <strong className="text-gray-900">canal de expansión</strong>. Como Mentor & Partner, tendrás acceso a una certificación profesional de NeuroCoaching completamente lista para entregar a tus aprendices.
              </p>
              
              <p>
                No tienes que crear los contenidos. No tienes que diseñar los ejercicios. No tienes que montar una plataforma. <strong className="text-gray-900">Todo eso ya existe</strong>. Tu rol es el más importante: acompañar, guiar, estar presente.
              </p>
            </div>
            
            {/* Imagen */}
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img 
                src={IMAGES.certificacion}
                alt="Certificación profesional"
                className="w-full h-64 object-cover"
              />
            </div>
            
            {/* Acreditaciones */}
            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Programa avalado por:</p>
              <div className="grid grid-cols-2 gap-3">
                {acreditaciones.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
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
          
          {/* Right - Detalles */}
          <div className="space-y-6">
            {/* Estructura */}
            <div className="bg-gradient-to-br from-[#031730] to-[#0a2540] rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#c4ff0f]" />
                ¿Qué obtienes exactamente?
              </h3>
              
              <ul className="space-y-4">
                {[
                  'Certificación estructurada en 3 niveles: Junior, Senior y Máster',
                  '1500 Horas de Evolución y Transformación',
                  'Plataforma completamente desarrollada para tus mentees',
                  'Método PEDALEAR: ciclo de transformación con estructura y profundidad',
                  'Método CRECE+: crecimiento continuo a través de conexión y reflexión',
                  'Tu propia landing personalizada para invitar prospectos',
                  'Acceso al ecosistema completo de herramientas InverSer'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#c4ff0f] flex-shrink-0 mt-0.5" />
                    <span className="text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Tu rol */}
            <div className="bg-[#7c3aed]/5 rounded-xl p-6 border border-[#7c3aed]/20">
              <p className="text-gray-700">
                <strong className="text-[#7c3aed]">Tu rol:</strong> Acompañar, guiar, estar presente. La tecnología, los contenidos, la infraestructura… ya están cubiertos por InverSer. Tú te enfocas en lo que mejor sabes hacer: <strong className="text-gray-900">transformar vidas</strong>.
              </p>
            </div>
            
            {/* Monetización */}
            <div className="bg-[#c4ff0f]/10 rounded-xl p-6 border border-[#c4ff0f]/30">
              <p className="font-medium text-gray-900 mb-2">💰 Monetización con sentido</p>
              <p className="text-gray-700 text-sm">
                Comercializa esta certificación y quédate con la mayor parte del ingreso. No trabajas para InverSer. <strong>Eres dueño de tu mentoría</strong>. Nosotros solo te damos las herramientas para que tu impacto sea sostenible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// HERRAMIENTAS GESTIÓN - CON IMÁGENES Y CONTENIDO COMPLETO
// ============================================
const HerramientasGestionSection = () => {
  const tools = [
    {
      icon: Calendar,
      title: 'iCalendar',
      subtitle: 'Tu tiempo es tu activo más valioso',
      description: 'No se trata solo de agendar. Se trata de organizar tu jornada de forma clara, respetuosa contigo y alineada con tu energía. iCalendar te permite sincronizar Google Calendar, Outlook y otros servicios, pero sobre todo, te da el control.',
      features: [
        'Sesiones de mentoría 1 a 1 o grupales',
        'Espacios VIP que puedes monetizar',
        'Tú decides cuándo estás disponible y cuándo no',
        'Tu tiempo, tus reglas'
      ],
      color: '#7c3aed'
    },
    {
      icon: Layout,
      title: 'iProjects',
      subtitle: 'Cada mentee es un proyecto de transformación',
      description: 'Un proceso de mentoría no es un servicio puntual. Es un viaje. Y cada viaje merece ser gestionado como lo que es: un proyecto de transformación profunda.',
      features: [
        'Tableros por mentee con tareas prediseñadas',
        'Sprints alineados al método PEDALEAR',
        'Crea tus propias plantillas de formación',
        'El avance de cada mentee siempre visible'
      ],
      color: '#FF9100'
    },
    {
      icon: Heart,
      title: 'iCRM',
      subtitle: 'Relaciones que transforman',
      description: 'El CRM de InverSer no es una hoja de cálculo fría. Es el corazón digital de tus relaciones significativas. Cada mentee tiene rostro, voz, historia y camino.',
      features: [
        'Fichas personalizadas con hilo emocional',
        'Registro de sueños, miedos, revelaciones',
        'Gestión por equipos, empresas o programas',
        'Cada contacto es una relación, no un número'
      ],
      color: '#1A8314'
    },
    {
      icon: BookOpen,
      title: 'iLearning',
      subtitle: 'Tu sabiduría merece un escenario',
      description: 'iLearning es más que un LMS: es tu campus vivo. Aquí tienes acceso a todos los módulos de formación, pero también puedes crear los tuyos propios.',
      features: [
        'Acceso completo como mentor',
        'Crea cápsulas, módulos o cursos completos',
        'Monetiza tus propios saberes',
        'Tu conocimiento se vuelve activo'
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
          <p className="text-gray-600 mt-4 max-w-3xl mx-auto text-lg">
            Un ecosistema que te sostiene mientras tú sostienes a otros. Herramientas diseñadas no desde la eficiencia fría, sino desde la comprensión profunda de lo que significa acompañar procesos humanos.
          </p>
        </div>
        
        {/* Imagen destacada */}
        <div className="mb-12 rounded-2xl overflow-hidden shadow-lg">
          <img 
            src={IMAGES.herramientas}
            alt="Herramientas de gestión profesional"
            className="w-full h-64 md:h-80 object-cover"
          />
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {tools.map((tool, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${tool.color}15` }}
                >
                  <tool.icon className="w-7 h-7" style={{ color: tool.color }} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{tool.title}</h3>
                  <p className="text-sm text-[#7c3aed]">{tool.subtitle}</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">{tool.description}</p>
              
              <ul className="space-y-3">
                {tool.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-start gap-2 text-sm text-gray-600">
                    <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#c4ff0f]" />
                    <span>{feature}</span>
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
// IA SECTION - CONTENIDO COMPLETO CON IMAGEN
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
          
          <div className="space-y-6 text-white/80 leading-relaxed">
            <p className="text-lg">
              Estamos entrando en una nueva revolución: la de la inteligencia artificial. Y el mundo necesita <strong className="text-white">mentores conscientes</strong>, capaces de tender puentes entre lo tecnológico y lo humano.
            </p>
            
            <p>
              Nosotros hemos creado algo diferente. No una IA que sustituye, sino una IA que acompaña. Un equipo de agentes especializados, entrenados con nuestros valores, que te asisten sin reemplazarte.
            </p>
          </div>
          
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
            <p className="text-white/70 text-sm leading-relaxed">
              MIA ha sido entrenada con los contenidos, valores y filosofía del NeuroCoaching Evolutivo. Puede sugerirte ideas, resolver dudas de tus mentees y conectarte con el contenido formativo de manera ágil. No es un chatbot genérico. Es tu asistente consciente.
            </p>
          </div>
          
          <blockquote className="border-l-4 border-[#c4ff0f] pl-6 text-white/80 italic text-lg">
            &ldquo;El mentor del futuro no teme a la IA. La guía. La humaniza. La transforma en aliada del crecimiento humano.&rdquo;
          </blockquote>
        </div>
        
        <div className="space-y-6">
          {/* Imagen */}
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={IMAGES.ia}
              alt="Inteligencia Artificial humanizada"
              className="w-full h-64 object-cover"
            />
          </div>
          
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-bold mb-6">¿Qué puede hacer MIA por ti?</h3>
            <ul className="space-y-4">
              {[
                'Sugerirte ideas para sesiones o actividades',
                'Resolver dudas frecuentes de tus mentees',
                'Conectarte con el contenido formativo adecuado',
                'Ayudarte a sostener el espíritu InverSer',
                'Diseñar campañas de comunicación',
                'Ordenar ideas y planificar sesiones',
                'Escribir textos alineados a tu voz'
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
// KOMMUNITY SECTION - CONTENIDO COMPLETO CON IMAGEN
// ============================================
const KommunitySection = () => (
  <section id="comunidad" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#faf8f5]">
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1 space-y-6">
          {/* Imagen */}
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img 
              src={IMAGES.comunidad}
              alt="Comunidad colaborativa"
              className="w-full h-64 object-cover"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: MessageSquare, label: 'Hilos de conversación profunda', color: '#7c3aed' },
              { icon: Users, label: 'Co-creación colectiva', color: '#FF9100' },
              { icon: Heart, label: 'Compartir luces y sombras', color: '#1A8314' },
              { icon: Sparkles, label: 'Conciencia circular', color: '#c4ff0f' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
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
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p className="text-lg">
              En InverSer creemos que la comunidad no es un accesorio: <strong className="text-gray-900">es el tejido vivo de la transformación</strong>. Por eso no hablamos de &ldquo;foro&rdquo;. Hablamos de <span className="text-[#7c3aed] font-semibold">KOMMUNITY</span>, con &ldquo;K&rdquo; de kinética, de conexión, de conocimiento compartido.
            </p>
            
            <p>
              Aquí no vienes a opinar. Vienes a <strong className="text-gray-900">co-crear una conciencia colectiva</strong>. Cada mentor, cada mentee, se convierte en una neurona viva dentro de una red mayor. Lo que uno aprende, ilumina a otros. Lo que uno comparte, inspira a muchos.
            </p>
            
            <p>
              Comunicarte, conocerte, vincularte. No como estrategia de networking vacío, sino como práctica de <strong className="text-gray-900">humanidad en red</strong>. Una red que no extrae, sino que nutre.
            </p>
          </div>
          
          <blockquote className="border-l-4 border-[#c4ff0f] pl-6 text-gray-600 italic text-lg">
            &ldquo;Cuando compartes desde tu verdad, no solo enseñas: invitas a otros a ser más ellos mismos.&rdquo;
          </blockquote>
        </div>
      </div>
    </div>
  </section>
);

// ============================================
// VIDEOTK & RECURSOS - CONTENIDO COMPLETO
// ============================================
const VideoTKSection = () => {
  const recursos = [
    {
      icon: Headphones,
      title: 'NeuroGym',
      description: 'Audios para reprogramación mental, meditaciones guiadas y ejercicios de respiración. Pensados para llevarte a estados de poder interno, serenidad o enfoque según lo que necesites.',
      color: '#7c3aed'
    },
    {
      icon: Play,
      title: 'VideoTK',
      description: 'Cápsulas de video diseñadas para provocar reflexión. No son clases. Son detonadores de insight. Historias, metáforas visuales, explicaciones profundas que inspiran nuevos paradigmas.',
      color: '#FF9100'
    },
    {
      icon: Move,
      title: 'Movimiento Consciente',
      description: 'Prácticas en video que integran cuerpo, emoción y mente. Desde stretching consciente hasta rutinas de activación emocional. Porque la transformación no ocurre solo en la cabeza.',
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
          <p className="text-gray-600 mt-4 max-w-3xl mx-auto text-lg">
            Un campo sensorial donde lo audiovisual se convierte en camino de transformación. Recursos que activan lo que el texto no alcanza.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {recursos.map((item, idx) => (
            <div key={idx} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
              <div 
                className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center"
                style={{ backgroundColor: `${item.color}15` }}
              >
                <item.icon className="w-8 h-8" style={{ color: item.color }} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-gradient-to-r from-[#7c3aed]/5 to-[#c4ff0f]/5 rounded-2xl p-8 text-center">
          <p className="text-gray-600 italic text-lg">
            &ldquo;Hay aprendizajes que no entran por la lógica, sino por la vibración. Este es tu laboratorio de sentidos.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
};

// ============================================
// MEETING TOOLS - CONTENIDO COMPLETO
// ============================================
const MeetingToolsSection = () => {
  const tools = [
    {
      icon: Calendar,
      title: 'BookMeet',
      subtitle: 'Tu tiempo consciente',
      description: 'Más que una herramienta de reservas: un espacio para ordenar tu energía y multiplicar tu impacto. Integra pagos, sincroniza calendarios, personaliza formularios previos.',
      features: ['Conversaciones 1 a 1', 'Sesiones premium cobrables', 'Mentorías grupales y VIP', 'Tu agenda, tus condiciones'],
      color: '#7c3aed'
    },
    {
      icon: Video,
      title: 'WebMeet',
      subtitle: 'Espacios sin distancia',
      description: 'Tu espacio de encuentro generativo. Reserva tu sala virtual sin necesidad de Zoom o Meet externos. Comparte pantalla, graba, usa pizarras colaborativas.',
      features: ['Salas hasta 1.000 asistentes', 'Graba y guarda sesiones', 'Pizarras colaborativas', 'Usa para proyectos externos'],
      color: '#FF9100'
    },
    {
      icon: Users,
      title: 'WebBrunch',
      subtitle: 'Reuniones con sentido',
      description: 'Tu sala inmersiva de conexión con alma. No es una videollamada: es un espacio donde cada quien tiene su silla, su avatar, su espacio. Ideal para encuentros colaborativos.',
      features: ['Coworking y estudio grupal', 'Tertulias y foros de libros', 'Prácticas de coaching', 'Conexión más humana'],
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
          <p className="text-gray-600 mt-4 max-w-3xl mx-auto text-lg">
            Porque la conexión humana ocurre en la mirada, en el silencio compartido, en ese instante en que dos almas se encuentran. Y eso también puede pasar en lo digital… si el entorno está diseñado para ello.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {tools.map((tool, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div 
                className="w-14 h-14 rounded-xl mb-6 flex items-center justify-center"
                style={{ backgroundColor: `${tool.color}15` }}
              >
                <tool.icon className="w-7 h-7" style={{ color: tool.color }} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{tool.title}</h3>
              <p className="text-sm text-[#7c3aed] mb-4">{tool.subtitle}</p>
              <p className="text-gray-600 mb-6 leading-relaxed">{tool.description}</p>
              <ul className="space-y-2">
                {tool.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-center gap-2 text-sm text-gray-600">
                    <ChevronRight className="w-4 h-4 text-[#c4ff0f]" />
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
// PROFESSIONAL TOOLS - CONTENIDO COMPLETO
// ============================================
const ProfessionalToolsSection = () => {
  const tools = [
    {
      icon: Globe,
      title: 'Directorio Vivo',
      subtitle: 'Tu escaparate al mundo',
      description: 'Más que un listado de profesionales: es tu escenario digital. Un perfil editable donde puedes mostrar tu historia, tus servicios, tus logros. Incluye blog personal, galería multimedia y enlaces a tus redes.',
      features: ['Perfil profesional completo', 'Blog personal dentro de InverSer', 'Galería multimedia', 'Úsalo como tu página web'],
      color: '#7c3aed'
    },
    {
      icon: Grid,
      title: 'AgileWork',
      subtitle: 'Ideas que se vuelven proceso',
      description: 'Tableros tipo Kanban, listas de tareas, automatización inteligente. No es solo organización: es diseño de procesos vivos. Crea tableros personalizados para tus programas de mentoría.',
      features: ['Tableros personalizables', 'Automatiza tareas repetitivas', 'Plantillas de formación', 'Gestión visual del progreso'],
      color: '#FF9100'
    },
    {
      icon: Send,
      title: 'IConnect',
      subtitle: 'Conversaciones que acercan',
      description: 'Sistema de mensajería inteligente estilo Slack. Canales por proyecto, menciones, archivos adjuntos. Todo en un solo lugar, sin perderte entre correos y WhatsApps.',
      features: ['Mensajes directos y canales', 'Menciones y notificaciones', 'Widget para tu sitio web', 'Todo centralizado'],
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
          <p className="text-gray-600 mt-4 max-w-3xl mx-auto text-lg">
            No basta con ser buen mentor. Necesitas ser visible, estar organizado, comunicarte con claridad. Estas herramientas te dan presencia profesional sin perder tu esencia.
          </p>
        </div>
        
        {/* Imagen */}
        <div className="mb-12 rounded-2xl overflow-hidden shadow-lg">
          <img 
            src={IMAGES.collaboration}
            alt="Trabajo colaborativo profesional"
            className="w-full h-64 md:h-72 object-cover"
          />
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {tools.map((tool, idx) => (
            <div key={idx} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
              <div 
                className="w-14 h-14 rounded-xl mb-6 flex items-center justify-center"
                style={{ backgroundColor: `${tool.color}15` }}
              >
                <tool.icon className="w-7 h-7" style={{ color: tool.color }} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{tool.title}</h3>
              <p className="text-sm text-[#7c3aed] mb-4">{tool.subtitle}</p>
              <p className="text-gray-600 mb-6 leading-relaxed">{tool.description}</p>
              <ul className="space-y-2">
                {tool.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-center gap-2 text-sm text-gray-600">
                    <ChevronRight className="w-4 h-4 text-[#c4ff0f]" />
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
// IPARTNER & MONETIZACIÓN - CONTENIDO COMPLETO
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
            
            <div className="space-y-6 text-white/80 leading-relaxed">
              <p className="text-lg">
                Además de formarte y transformar vidas, en InverSer también puedes generar ingresos. <strong className="text-white">iPartner</strong> es nuestro sistema de afiliación consciente.
              </p>
              
              <p>
                Invita a otros mentores al ecosistema y recibe una comisión directa. Si ellos también invitan, recibes un segundo nivel. No es un sistema piramidal vacío: es un modelo de expansión con propósito.
              </p>
              
              <p>
                ¿Cuánto puedes ganar? Depende de ti. Algunos mentores cubren con creces el costo de su membresía solo con dos o tres referidos. Otros han construido redes de impacto que generan ingresos pasivos significativos.
              </p>
            </div>
            
            <ul className="space-y-4">
              {[
                'Invita mentores y recibe comisión directa',
                'Ganancias por segundo nivel de invitados',
                'Cubre tu membresía con pocos referidos',
                'Modelo ético de expansión con propósito'
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-white/80">
                  <TrendingUp className="w-5 h-5 text-[#c4ff0f]" />
                  {item}
                </li>
              ))}
            </ul>
            
            <blockquote className="border-l-4 border-[#c4ff0f] pl-6 text-white/70 italic text-lg">
              &ldquo;En InverSer, tu impacto también puede sostenerte.&rdquo;
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
          
          <div className="space-y-6">
            {/* Imagen */}
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={IMAGES.growth}
                alt="Crecimiento y expansión"
                className="w-full h-56 object-cover"
              />
            </div>
            
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#c4ff0f]" />
                Landings Personalizadas
              </h3>
              
              <p className="text-white/80 mb-6 leading-relaxed">
                Cada mentor tiene acceso a landings personalizadas como esta que estás leyendo. Una página diseñada para que tú la compartas con tu red, con tu estilo, con tu voz.
              </p>
              
              <ul className="space-y-3 text-white/70">
                {[
                  'Tu foto, presentación y enlaces de contacto',
                  'Landing para presentar el ecosistema',
                  'Landings específicas por certificación',
                  'Formatos adaptables para tus programas'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-[#c4ff0f] flex-shrink-0 mt-1" />
                    {item}
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 p-4 bg-[#c4ff0f]/10 rounded-xl">
                <p className="text-sm text-white/80">
                  <strong className="text-[#c4ff0f]">Nota:</strong> No necesitas diseñar nada. Nosotros lo hacemos por ti. Tú solo decides qué mostrar y cómo comunicar.
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
// TOOLBOX SECTION - CONTENIDO COMPLETO
// ============================================
const ToolboxSection = () => {
  const recursos = [
    { icon: Users, text: '+1.000 dinámicas de grupo', color: '#7c3aed' },
    { icon: FileText, text: 'Plantillas profesionales', color: '#FF9100' },
    { icon: Target, text: 'Modelos de diagnóstico', color: '#1A8314' },
    { icon: Sparkles, text: 'Herramientas proyectivas', color: '#c4ff0f' },
    { icon: Briefcase, text: 'Recursos empresariales', color: '#7c3aed' },
    { icon: BookOpen, text: '+600 títulos en biblioteca', color: '#FF9100' },
    { icon: Play, text: 'Cursos en video', color: '#1A8314' },
    { icon: Heart, text: 'Materiales cuerpo-emoción', color: '#c4ff0f' }
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
          <p className="text-gray-600 mt-4 max-w-3xl mx-auto text-lg">
            En InverSer no creemos en formar mentores solo desde el conocimiento. Creemos en formar mentores <strong className="text-gray-900">capaces de intervenir, acompañar y transformar</strong> en contextos reales. Por eso, te entregamos una caja de herramientas viva.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {recursos.map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div 
                className="w-12 h-12 rounded-lg mb-3 flex items-center justify-center"
                style={{ backgroundColor: `${item.color}15` }}
              >
                <item.icon className="w-6 h-6" style={{ color: item.color }} />
              </div>
              <p className="text-sm font-medium text-gray-700">{item.text}</p>
            </div>
          ))}
        </div>
        
        {/* Imagen */}
        <div className="mb-12 rounded-2xl overflow-hidden shadow-lg">
          <img 
            src={IMAGES.workspace}
            alt="Espacio de trabajo profesional"
            className="w-full h-64 object-cover"
          />
        </div>
        
        <div className="bg-gradient-to-br from-[#031730] to-[#0a2540] rounded-3xl p-8 md:p-12 text-white">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold">
              El Toolbox no te dice <em>qué hacer</em>.
              <br />
              Te da <span className="text-[#c4ff0f]">con qué hacerlo</span>.
            </h3>
            <p className="text-white/70 text-lg leading-relaxed">
              Es tu apoyo silencioso. Tu respaldo profesional. Tu caja de recursos cuando el proceso lo exige. Porque un mentor con herramientas claras puede sostener procesos profundos sin improvisar ni quedar expuesto.
            </p>
            <p className="text-white/60">
              Todo el material está organizado por categorías, niveles y tipos de intervención. Y si necesitas algo que no encuentras… puedes pedirlo. Escuchamos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// CTA FINAL SECTION - CONTENIDO COMPLETO
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
        
        <div className="space-y-6 text-white/90 text-lg leading-relaxed">
          <p>
            Si intuyes que tu rol puede crecer más allá de las sesiones uno a uno. Si buscas un espacio que te potencie sin deshumanizarte. Si crees que la tecnología puede ser aliada de la transformación humana...
          </p>
          
          <p>
            Entonces sigue avanzando. <strong className="text-white">Esto no es una promesa. Es una arquitectura.</strong> Un lugar donde puedes ejercer tu vocación con estructura, respaldo y proyección.
          </p>
        </div>
        
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
          Bienvenido al <strong className="text-white/80">Mentor & Partner Program</strong>. Bienvenido al <strong className="text-white/80">Plan Pioneros</strong>.
          <br />
          Tu legado comienza aquí.
        </p>
      </div>
    </section>
  );
};

// ============================================
// FOOTER - CON MENÚ Y MENTOR A LA DERECHA
// ============================================
const FooterMPP = ({ mentorData, onActionClick }) => {
  const mentor = mentorData?.mentor || {};
  const hasMentor = mentor.first_name && mentor.first_name !== '';
  const { actions, mentorLinks, campaignLinks } = prepareAnchorData(mentorData);

  const navLinks = [
    { href: '#ecosistema', label: 'Ecosistema' },
    { href: '#certificacion', label: 'Certificación' },
    { href: '#herramientas', label: 'Herramientas' },
    { href: '#comunidad', label: 'Comunidad' },
    { href: '#toolbox', label: 'Toolbox' }
  ];

  return (
    <footer className="bg-[#031730] text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main footer content */}
        <div className="grid md:grid-cols-3 gap-12 mb-12 pb-12 border-b border-white/10">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <LogoMPP />
            <p className="text-white/60 text-sm leading-relaxed">
              Ecosistema de empoderamiento para mentores conscientes. Donde la tecnología potencia la transformación humana.
            </p>
          </div>
          
          {/* Navegación */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Navegación</h4>
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link, idx) => (
                <a 
                  key={idx}
                  href={link.href} 
                  className="text-white/60 hover:text-[#c4ff0f] transition-colors text-sm"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
          
          {/* Mentor info - ALINEADO A LA DERECHA */}
          <div className="flex flex-col items-end text-right">
            {hasMentor ? (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-right">
                    <p className="font-semibold text-lg">{mentor.first_name} {mentor.last_name}</p>
                    <p className="text-[#c4ff0f]/80 text-sm">Team Líder</p>
                  </div>
                  {mentor.photo_url && (
                    <img 
                      src={getImageUrl(mentor.photo_url)} 
                      alt={`${mentor.first_name} ${mentor.last_name}`}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#c4ff0f]/40"
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
            ) : (
              <div className="text-white/40 text-sm">
                Mentor asignado próximamente
              </div>
            )}
          </div>
        </div>
        
        {/* Bottom footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Links legales */}
          <div className="flex items-center gap-6 text-sm text-white/60">
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
          <div className="text-center md:text-right text-sm text-white/40">
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
