import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Card } from '../../components/ui/card';
import { Switch } from '../../components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink,
  AlertTriangle,
  Loader2,
  Layers,
  Info
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { Toaster } from '../../components/ui/toaster';
import { getAvailableTemplates } from '../../templates';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Palabras reservadas que no se pueden usar como campaign key
const RESERVED_KEYS = ['admin', 'edit', 'api', 'login', 'assets', 'static', 'track', 'analytics', 'public', 'mentor'];

const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    key: '',
    name: '',
    template_key: 'generic',
    active: true,
    sort_order: 0
  });
  const [formErrors, setFormErrors] = useState({});

  // Get available templates from registry
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

  const validateKey = (key) => {
    if (!key) return 'El key es requerido';
    if (key.length < 2) return 'El key debe tener al menos 2 caracteres';
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(key)) {
      return 'Solo letras minúsculas, números y guiones simples';
    }
    if (RESERVED_KEYS.includes(key)) {
      return `"${key}" es una palabra reservada`;
    }
    // Check if key already exists (only for new campaigns)
    if (!selectedCampaign && campaigns.some(c => c.key === key)) {
      return 'Este key ya está en uso';
    }
    return null;
  };

  const validateForm = () => {
    const errors = {};
    
    const keyError = validateKey(formData.key);
    if (keyError) errors.key = keyError;
    
    if (!formData.name) errors.name = 'El nombre es requerido';
    if (!formData.template_key) errors.template_key = 'El template es requerido';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openModal = (campaign = null) => {
    if (campaign) {
      setSelectedCampaign(campaign);
      setFormData({
        key: campaign.key,
        name: campaign.name,
        template_key: campaign.template_key || 'generic',
        active: campaign.active,
        sort_order: campaign.sort_order || 0
      });
    } else {
      setSelectedCampaign(null);
      setFormData({
        key: '',
        name: '',
        template_key: 'generic',
        active: true,
        sort_order: campaigns.length
      });
    }
    setFormErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCampaign(null);
    setFormErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSaving(true);
    try {
      if (selectedCampaign) {
        // Update existing campaign
        await axios.put(`${BACKEND_URL}/api/admin/campaigns/${selectedCampaign.key}`, {
          name: formData.name,
          template_key: formData.template_key,
          active: formData.active,
          sort_order: formData.sort_order
        });
        toast({
          title: 'Actualizado',
          description: 'Campaña actualizada correctamente'
        });
      } else {
        // Create new campaign
        await axios.post(`${BACKEND_URL}/api/admin/campaigns`, formData);
        toast({
          title: 'Creado',
          description: 'Campaña creada correctamente'
        });
      }
      
      closeModal();
      fetchCampaigns();
    } catch (error) {
      console.error('Error saving campaign:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'No se pudo guardar la campaña',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (campaign) => {
    setSelectedCampaign(campaign);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedCampaign) return;
    
    try {
      await axios.delete(`${BACKEND_URL}/api/admin/campaigns/${selectedCampaign.key}`);
      toast({
        title: 'Eliminado',
        description: 'Campaña eliminada correctamente'
      });
      fetchCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'No se pudo eliminar la campaña',
        variant: 'destructive'
      });
    } finally {
      setDeleteConfirmOpen(false);
      setSelectedCampaign(null);
    }
  };

  const isTemplateRegistered = (templateKey) => {
    return availableTemplates.some(t => t.key === templateKey);
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Campañas</h1>
          <p className="text-gray-600 mt-1">{campaigns.length} campañas configuradas</p>
        </div>
        <Button
          onClick={() => openModal()}
          className="bg-[#7c3aed] hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Campaña
        </Button>
      </div>

      {/* Info Card */}
      <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Sistema Multi-Campaña</p>
            <p>
              Cada campaña puede tener su propia landing page mediante <code className="bg-blue-100 px-1 rounded">template_key</code>. 
              Para crear un nuevo template, solicítalo a Emergent y luego actualiza la campaña con el nuevo template_key.
            </p>
          </div>
        </div>
      </Card>

      {/* Campaigns Grid */}
      {campaigns.length === 0 ? (
        <Card className="p-12 text-center">
          <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No hay campañas configuradas</p>
          <Button onClick={() => openModal()}>
            <Plus className="w-4 h-4 mr-2" />
            Crear primera campaña
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.key} className="p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                  <p className="text-sm text-gray-500 font-mono">/{campaign.key}/&lt;slug&gt;</p>
                </div>
                <Badge variant={campaign.active ? "default" : "outline"}>
                  {campaign.active ? 'Activa' : 'Inactiva'}
                </Badge>
              </div>

              {/* Template Key */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1">Template</p>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="font-mono">
                    {campaign.template_key || 'generic'}
                  </Badge>
                  {!isTemplateRegistered(campaign.template_key) && (
                    <div className="flex items-center text-amber-600" title="Template no registrado, usando generic">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>

              {/* Preview URL */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1">URL de ejemplo</p>
                <a 
                  href={`/${campaign.key}/noel-rivera`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#7c3aed] hover:underline flex items-center"
                >
                  /{campaign.key}/noel-rivera
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t">
                <Button
                  onClick={() => openModal(campaign)}
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  onClick={() => confirmDelete(campaign)}
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedCampaign ? 'Editar Campaña' : 'Nueva Campaña'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Key (only editable on create) */}
            <div className="space-y-2">
              <Label htmlFor="key">Key (URL)</Label>
              <Input
                id="key"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value.toLowerCase() })}
                placeholder="mi-campana"
                disabled={!!selectedCampaign}
                className={formErrors.key ? 'border-red-500' : ''}
              />
              {formErrors.key && (
                <p className="text-sm text-red-500">{formErrors.key}</p>
              )}
              {!selectedCampaign && formData.key && !formErrors.key && (
                <p className="text-sm text-gray-500">
                  URL: <span className="font-mono">/{formData.key}/&lt;slug&gt;</span>
                </p>
              )}
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Mi Nueva Campaña"
                className={formErrors.name ? 'border-red-500' : ''}
              />
              {formErrors.name && (
                <p className="text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>

            {/* Template Key */}
            <div className="space-y-2">
              <Label htmlFor="template_key">Template</Label>
              <select
                id="template_key"
                value={formData.template_key}
                onChange={(e) => setFormData({ ...formData, template_key: e.target.value })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {availableTemplates.map(template => (
                  <option key={template.key} value={template.key}>
                    {template.name} ({template.key})
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500">
                Selecciona "generic" para nuevas campañas. Crea templates personalizados con Emergent.
              </p>
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <Label htmlFor="sort_order">Orden</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>

            {/* Active */}
            <div className="flex items-center justify-between">
              <Label htmlFor="active">Activa</Label>
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeModal}>
                Cancelar
              </Button>
              <Button type="submit" disabled={saving} className="bg-[#7c3aed] hover:bg-purple-700">
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {selectedCampaign ? 'Guardar' : 'Crear'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar campaña?</AlertDialogTitle>
            <AlertDialogDescription>
              Esto eliminará la campaña "{selectedCampaign?.name}". 
              Esta acción no se puede deshacer.
              <br /><br />
              <strong>Nota:</strong> No se puede eliminar si tiene acciones asociadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CampaignsPage;
