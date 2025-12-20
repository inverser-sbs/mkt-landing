import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { AlertCircle, CheckCircle2, ExternalLink, Save } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { Toaster } from '../components/ui/toaster';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MentorEditPage = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mentorData, setMentorData] = useState(null);
  const [links, setLinks] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Token no proporcionado. Por favor, use el link mágico completo.');
      setLoading(false);
      return;
    }

    fetchMentorData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, token]);

  const fetchMentorData = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/edit/${slug}?token=${token}`
      );
      
      setMentorData(response.data);
      
      // Initialize links state
      const initialLinks = {};
      response.data.actions.forEach(action => {
        initialLinks[action.action_key] = action.current_url || '';
      });
      setLinks(initialLinks);
    } catch (err) {
      console.error('Error fetching mentor data:', err);
      
      if (err.response?.status === 401) {
        setError('Token inválido o expirado. Por favor, solicite un nuevo link de edición a su administrador.');
      } else if (err.response?.status === 404) {
        setError('Mentor no encontrado.');
      } else {
        setError('Error al cargar los datos. Por favor, intente nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLinkChange = (actionKey, value) => {
    setLinks(prev => ({
      ...prev,
      [actionKey]: value
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      await axios.put(
        `${BACKEND_URL}/api/edit/${slug}?token=${token}`,
        links
      );

      setSaved(true);
      toast({
        title: "¡Guardado exitoso!",
        description: "Tus enlaces han sido actualizados correctamente.",
        duration: 3000,
      });
    } catch (err) {
      console.error('Error saving links:', err);
      
      let errorMessage = 'Error al guardar los enlaces. Por favor, intente nuevamente.';
      
      if (err.response?.status === 401) {
        errorMessage = 'Tu sesión ha expirado. Por favor, solicita un nuevo link de edición.';
      }
      
      toast({
        title: "Error al guardar",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#faf8f5] to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7c3aed] mx-auto mb-4"></div>
          <p className="text-gray-600">Validando acceso...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#faf8f5] to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-red-200">
          <CardHeader>
            <div className="flex items-center space-x-2 text-red-600 mb-2">
              <AlertCircle className="w-6 h-6" />
              <CardTitle>Acceso Denegado</CardTitle>
            </div>
            <CardDescription className="text-base text-gray-700">
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Para obtener un nuevo link de edición, contacte con su administrador.
            </p>
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="w-full"
            >
              Volver al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8f5] to-purple-50 py-12 px-4">
      <Toaster />
      
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Panel de Edición
          </h1>
          <p className="text-lg text-gray-600">
            Hola, <span className="font-semibold">{mentorData.mentor.first_name} {mentorData.mentor.last_name}</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Edita los enlaces de tus botones de acción
          </p>
        </div>

        {/* Success Message */}
        {saved && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-900">Cambios guardados exitosamente</p>
              <p className="text-sm text-green-700">Tus enlaces están activos y visibles en tu página pública.</p>
            </div>
          </div>
        )}

        {/* Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle>Enlaces de Acciones</CardTitle>
            <CardDescription>
              Actualiza las URLs de tus botones. Si dejas un campo vacío, ese botón no aparecerá en tu página.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {mentorData.actions.map((action) => (
              <div key={action.action_key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-900">
                    {action.label}
                  </label>
                  {links[action.action_key] && (
                    <a
                      href={links[action.action_key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#7c3aed] hover:underline flex items-center"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Probar enlace
                    </a>
                  )}
                </div>
                
                {action.description && (
                  <p className="text-xs text-gray-500">{action.description}</p>
                )}
                
                <Input
                  type="url"
                  placeholder="https://ejemplo.com/tu-enlace"
                  value={links[action.action_key] || ''}
                  onChange={(e) => handleLinkChange(action.action_key, e.target.value)}
                  className="font-mono text-sm"
                />
                
                {links[action.action_key] && !links[action.action_key].startsWith('http') && (
                  <p className="text-xs text-amber-600">
                    ⚠️ La URL debe empezar con http:// o https://
                  </p>
                )}
              </div>
            ))}

            <div className="pt-6 border-t">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-[#7c3aed] hover:bg-purple-700 text-white py-6 text-lg font-semibold"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">💡 Consejo:</span> Después de guardar los cambios, 
            puedes verificar que todo funcione correctamente visitando tu página pública en{' '}
            <span className="font-mono bg-blue-100 px-1 rounded">/{mentorData.mentor.slug}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MentorEditPage;
