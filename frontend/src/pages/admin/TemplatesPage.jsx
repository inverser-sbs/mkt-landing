import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Loader2,
  Palette,
  ExternalLink,
  Info,
  Sparkles,
  CheckCircle2,
  Layers,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { Toaster } from '../../components/ui/toaster';
import { TEMPLATE_REGISTRY, getAvailableTemplates } from '../../templates';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Template descriptions - human readable
const TEMPLATE_INFO = {
  'generic': {
    name: 'Genérico',
    description: 'Diseño profesional y neutro que funciona para cualquier tipo de campaña. Ideal para comenzar rápidamente.',
    features: ['Diseño limpio y moderno', 'Colores neutros adaptables', 'Botones dinámicos'],
    color: 'bg-gray-100 border-gray-300'
  },
  'cpn': {
    name: 'CPN - Certificación NeuroCoaching',
    description: 'Diseño especializado para programas de certificación en coaching con elementos visuales de neurociencia.',
    features: ['Estilo educativo profesional', 'Colores institucionales', 'Enfoque en credibilidad'],
    color: 'bg-purple-50 border-purple-200'
  },
  'suitex': {
    name: 'Suitex - Oficina Digital',
    description: 'Diseño moderno estilo SaaS para productos de software y servicios digitales.',
    features: ['Estética tech moderna', 'Gradientes dinámicos', 'Llamadas a la acción destacadas'],
    color: 'bg-blue-50 border-blue-200'
  }
};

const TemplatesPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const availableTemplates = getAvailableTemplates();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/campaigns`);
      setCampaigns(response.data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las campañas',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Get campaigns using each template
  const getCampaignsForTemplate = (templateKey) => {
    return campaigns.filter(c => (c.template_key || 'generic') === templateKey);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#7c3aed]" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Toaster />
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-gray-900">Templates de Landing</h1>
        <p className="text-gray-600 mt-1">{availableTemplates.length} templates disponibles</p>
      </div>

      {/* ============================================ */}
      {/* HOW TO CREATE NEW TEMPLATES - PROMINENT */}
      {/* ============================================ */}
      <Card className="p-6 mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-white rounded-full shadow-sm">
            <Sparkles className="w-6 h-6 text-[#7c3aed]" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              ¿Cómo se crean los templates?
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Los templates NO se crean desde esta pantalla.</strong> Son diseños de página creados por el equipo de desarrollo.
              </p>
              
              <div className="bg-white p-4 rounded-lg border border-purple-100">
                <p className="font-semibold text-[#7c3aed] mb-2">Proceso para solicitar un nuevo template:</p>
                <ol className="space-y-2 text-sm">
                  <li className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-[#7c3aed] text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <span>Describe el diseño que necesitas (colores, estilo, secciones)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-[#7c3aed] text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <span>Solicita la creación a <strong>Emergent</strong> (tu plataforma de desarrollo)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-[#7c3aed] text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <span>Emergent crea el template y lo integra al sistema</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-[#7c3aed] text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                    <span>Asigna el nuevo template a tu campaña desde <strong>Campañas</strong></span>
                  </li>
                </ol>
              </div>

              <div className="flex items-center space-x-2 text-sm bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <HelpCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <span>
                  <strong>¿No tienes un template específico?</strong> Usa <strong>&ldquo;Genérico&rdquo;</strong> - funciona perfectamente para cualquier campaña nueva.
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ============================================ */}
      {/* TEMPLATES LIST */}
      {/* ============================================ */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Templates Disponibles</h2>
      
      <div className="space-y-4">
        {availableTemplates.map((template) => {
          const info = TEMPLATE_INFO[template.key] || {
            name: template.name,
            description: 'Template personalizado',
            features: [],
            color: 'bg-gray-50 border-gray-200'
          };
          const campaignsUsing = getCampaignsForTemplate(template.key);
          
          return (
            <Card key={template.key} className={`p-5 ${info.color} border`}>
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                {/* Template Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Palette className="w-5 h-5 text-[#7c3aed]" />
                    <h3 className="font-semibold text-lg text-gray-900">{info.name}</h3>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {template.key}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{info.description}</p>
                  
                  {/* Features */}
                  {info.features.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {info.features.map((feature, idx) => (
                        <span key={idx} className="inline-flex items-center text-xs bg-white px-2 py-1 rounded-full border">
                          <CheckCircle2 className="w-3 h-3 text-green-500 mr-1" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Campaigns using this template */}
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Campañas usando este template:
                    </p>
                    {campaignsUsing.length === 0 ? (
                      <span className="text-sm text-gray-500 italic">Ninguna campaña</span>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {campaignsUsing.map(campaign => (
                          <Badge key={campaign.key} variant="outline" className="text-xs">
                            {campaign.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex flex-col gap-2 lg:w-48">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Open example with a demo mentor slug
                      const firstCampaign = campaignsUsing[0];
                      if (firstCampaign) {
                        window.open(`/${firstCampaign.key}/noel-rivera`, '_blank');
                      } else {
                        toast({
                          title: 'Sin ejemplo',
                          description: 'Asigna este template a una campaña para ver un ejemplo',
                          variant: 'default'
                        });
                      }
                    }}
                    className="justify-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ver ejemplo
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ============================================ */}
      {/* QUICK CONCEPTS REMINDER */}
      {/* ============================================ */}
      <Card className="mt-8 p-5 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Conceptos clave</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-800">
              <div>
                <Palette className="w-4 h-4 inline mr-1" />
                <strong>Template</strong>
                <p className="text-blue-700 mt-1">El diseño visual de la página (colores, layout, estilo)</p>
              </div>
              <div>
                <Layers className="w-4 h-4 inline mr-1" />
                <strong>Campaña</strong>
                <p className="text-blue-700 mt-1">Un producto o programa específico con su propia URL</p>
              </div>
              <div>
                <ArrowRight className="w-4 h-4 inline mr-1" />
                <strong>Acciones (Botones)</strong>
                <p className="text-blue-700 mt-1">Los botones disponibles se configuran en Acciones, NO en el template</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TemplatesPage;
