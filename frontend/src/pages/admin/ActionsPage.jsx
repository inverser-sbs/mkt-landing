import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Card } from '../../components/ui/card';
import { Switch } from '../../components/ui/switch';
import { Checkbox } from '../../components/ui/checkbox';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { 
  Plus, 
  Edit, 
  Trash2, 
  GripVertical,
  Loader2,
  Zap,
  AlertCircle,
  Layers,
  LayoutGrid,
  Info,
  MapPin
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { Toaster } from '../../components/ui/toaster';
import { useNavigate } from 'react-router-dom';
import { getSlotsForTemplate } from '../../templates';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const STORAGE_KEY = 'inverser_selected_campaign';

const ActionsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionsLoading, setActionsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    action_key: '',
    label: '',
    description: '',
    active: true,
    order: 0,
    display_slots: ['cta']  // Default slot
  });
  const [formErrors, setFormErrors] = useState({});

  // Get available slots for current campaign
  const availableSlots = selectedCampaign 
    ? getSlotsForTemplate(selectedCampaign.template_key || 'cpn')
    : [];

  // Load campaigns on mount
  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Load actions when campaign changes
  useEffect(() => {
    if (selectedCampaign) {
      fetchActions(selectedCampaign.key);
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, selectedCampaign.key);
    }
  }, [selectedCampaign]);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/campaigns?active_only=true`);
      const activeCampaigns = response.data;
      setCampaigns(activeCampaigns);
      
      if (activeCampaigns.length > 0) {
        // Try to restore last selected campaign from localStorage
        const savedCampaignKey = localStorage.getItem(STORAGE_KEY);
        const savedCampaign = activeCampaigns.find(c => c.key === savedCampaignKey);
        
        if (savedCampaign) {
          setSelectedCampaign(savedCampaign);
        } else {
          // Default to first campaign
          setSelectedCampaign(activeCampaigns[0]);
        }
      }
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

  const fetchActions = useCallback(async (campaignKey) => {
    setActionsLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/actions?campaign_key=${campaignKey}`);
      setActions(response.data);
    } catch (error) {
      console.error('Error fetching actions:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las acciones',
        variant: 'destructive'
      });
    } finally {
      setActionsLoading(false);
    }
  }, [toast]);

  const handleCampaignChange = (campaignKey) => {
    const campaign = campaigns.find(c => c.key === campaignKey);
    if (campaign) {
      setSelectedCampaign(campaign);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.action_key) {
      errors.action_key = 'El key es requerido';
    } else if (!/^[a-z0-9_-]+$/.test(formData.action_key)) {
      errors.action_key = 'Solo letras minúsculas, números, guiones y guiones bajos';
    } else if (!selectedAction) {
      // Check for duplicate only on create
      const exists = actions.some(a => a.action_key === formData.action_key);
      if (exists) {
        errors.action_key = 'Este key ya existe en esta campaña';
      }
    }
    
    if (!formData.label) {
      errors.label = 'La etiqueta es requerida';
    }

    if (formData.display_slots.length === 0) {
      errors.display_slots = 'Selecciona al menos una ubicación';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openModal = (action = null) => {
    if (action) {
      setSelectedAction(action);
      setFormData({
        action_key: action.action_key,
        label: action.label,
        description: action.description || '',
        active: action.active,
        order: action.order || 0,
        display_slots: action.display_slots || ['cta']
      });
    } else {
      setSelectedAction(null);
      setFormData({
        action_key: '',
        label: '',
        description: '',
        active: true,
        order: actions.length, // Default to end of list
        display_slots: ['cta']  // Default slot
      });
    }
    setFormErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedAction(null);
    setFormErrors({});
  };

  const handleSlotToggle = (slotKey) => {
    setFormData(prev => {
      const currentSlots = prev.display_slots || [];
      if (currentSlots.includes(slotKey)) {
        // Remove slot
        return { ...prev, display_slots: currentSlots.filter(s => s !== slotKey) };
      } else {
        // Add slot
        return { ...prev, display_slots: [...currentSlots, slotKey] };
      }
    });
    // Clear error when user selects a slot
    if (formErrors.display_slots) {
      setFormErrors(prev => ({ ...prev, display_slots: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm() || !selectedCampaign) return;
    
    setSaving(true);
    try {
      if (selectedAction) {
        // Update existing action
        await axios.put(`${BACKEND_URL}/api/admin/actions/${selectedAction.id}`, {
          label: formData.label,
          description: formData.description || null,
          active: formData.active,
          order: formData.order,
          display_slots: formData.display_slots
        });
        toast({
          title: 'Actualizado',
          description: 'Acción actualizada correctamente'
        });
      } else {
        // Create new action
        await axios.post(`${BACKEND_URL}/api/admin/actions`, {
          campaign_key: selectedCampaign.key,
          action_key: formData.action_key,
          label: formData.label,
          description: formData.description || null,
          active: formData.active,
          order: formData.order,
          display_slots: formData.display_slots
        });
        toast({
          title: 'Creado',
          description: 'Acción creada correctamente'
        });
      }
      
      closeModal();
      fetchActions(selectedCampaign.key);
    } catch (error) {
      console.error('Error saving action:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'No se pudo guardar la acción',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (action) => {
    setSelectedAction(action);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedAction) return;
    
    try {
      await axios.delete(`${BACKEND_URL}/api/admin/actions/${selectedAction.id}`);
      toast({
        title: 'Eliminado',
        description: 'Acción eliminada correctamente'
      });
      fetchActions(selectedCampaign.key);
    } catch (error) {
      console.error('Error deleting action:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'No se pudo eliminar la acción',
        variant: 'destructive'
      });
    } finally {
      setDeleteConfirmOpen(false);
      setSelectedAction(null);
    }
  };

  const toggleActive = async (action) => {
    try {
      await axios.put(`${BACKEND_URL}/api/admin/actions/${action.id}`, {
        active: !action.active
      });
      toast({
        title: 'Actualizado',
        description: `Acción ${action.active ? 'desactivada' : 'activada'} correctamente`
      });
      fetchActions(selectedCampaign.key);
    } catch (error) {
      console.error('Error toggling action:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la acción',
        variant: 'destructive'
      });
    }
  };

  // Helper to get slot labels for display
  const getSlotLabels = (slotKeys) => {
    if (!slotKeys || slotKeys.length === 0) return 'Sin ubicación';
    return slotKeys.map(key => {
      const slot = availableSlots.find(s => s.key === key);
      return slot ? slot.label.replace('Hero - ', '').replace('CTA ', '') : key;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#7c3aed]" />
      </div>
    );
  }

  // Empty state - no campaigns
  if (campaigns.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <Toaster />
        <Card className="p-12 text-center">
          <Layers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No hay campañas activas</h2>
          <p className="text-gray-600 mb-6">
            Para gestionar acciones, primero necesitas crear al menos una campaña activa.
          </p>
          <Button onClick={() => navigate('/admin/campaigns')} className="bg-[#7c3aed] hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Ir a Campañas
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Toaster />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Acciones (Botones)</h1>
          <p className="text-gray-600 mt-1">
            Define qué botones aparecen y en qué sección de la landing
          </p>
        </div>
        
        {/* Campaign Selector */}
        <div className="flex items-center gap-3">
          <Label className="text-sm font-medium whitespace-nowrap">Campaña:</Label>
          <Select value={selectedCampaign?.key || ''} onValueChange={handleCampaignChange}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Seleccionar campaña" />
            </SelectTrigger>
            <SelectContent>
              {campaigns.map((campaign) => (
                <SelectItem key={campaign.key} value={campaign.key}>
                  {campaign.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Context Banner with Template Info */}
      {selectedCampaign && (
        <Card className="p-4 mb-6 bg-purple-50 border-purple-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 text-[#7c3aed]" />
              <div>
                <p className="font-medium text-purple-900">
                  Campaña: <span className="font-bold">{selectedCampaign.name}</span>
                </p>
                <p className="text-sm text-purple-700 flex items-center gap-2">
                  <span>Template: <strong>{selectedCampaign.template_key || 'cpn'}</strong></span>
                  <span>•</span>
                  <span className="flex items-center">
                    <LayoutGrid className="w-3 h-3 mr-1" />
                    {availableSlots.length} slots disponibles
                  </span>
                </p>
              </div>
            </div>
            <Button
              onClick={() => openModal()}
              className="bg-[#7c3aed] hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Acción
            </Button>
          </div>
        </Card>
      )}

      {/* Info Card - Explain the concept */}
      <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">¿Cómo funcionan los Slots?</p>
            <p>
              Cada <strong>Acción</strong> es un botón. Los <strong>Slots</strong> indican <em>dónde</em> aparece ese botón en la landing.
              Por ejemplo: un botón puede aparecer en el <strong>Hero</strong> (arriba) y también en el <strong>CTA</strong> (abajo).
            </p>
          </div>
        </div>
      </Card>

      {/* Actions List */}
      {actionsLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#7c3aed]" />
        </div>
      ) : actions.length === 0 ? (
        <Card className="p-12 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Sin acciones en esta campaña
          </h3>
          <p className="text-gray-600 mb-6">
            Esta campaña no tiene acciones configuradas. Crea la primera acción para 
            que los mentores puedan agregar sus enlaces.
          </p>
          <Button onClick={() => openModal()} className="bg-[#7c3aed] hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Crear primera acción
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {actions.map((action) => (
            <Card key={action.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                {/* Drag Handle (visual only for now) */}
                <div className="text-gray-400 cursor-move">
                  <GripVertical className="w-5 h-5" />
                </div>
                
                {/* Order Number */}
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                  {action.order}
                </div>
                
                {/* Action Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900">{action.label}</h3>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {action.action_key}
                    </Badge>
                    <Badge variant={action.active ? "default" : "outline"}>
                      {action.active ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </div>
                  
                  {/* Slots Display */}
                  <div className="flex items-center gap-1 mt-2 flex-wrap">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">Ubicación:</span>
                    {getSlotLabels(action.display_slots).map((label, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs bg-purple-50 border-purple-200 text-purple-700">
                        {label}
                      </Badge>
                    ))}
                  </div>
                  
                  {action.description && (
                    <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => toggleActive(action)}
                    size="sm"
                    variant="outline"
                    className={action.active ? "text-orange-600" : "text-green-600"}
                  >
                    {action.active ? 'Desactivar' : 'Activar'}
                  </Button>
                  <Button
                    onClick={() => openModal(action)}
                    size="sm"
                    variant="outline"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => confirmDelete(action)}
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedAction ? 'Editar Acción' : 'Nueva Acción'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Action Key (only editable on create) */}
            <div className="space-y-2">
              <Label htmlFor="action_key">Key (identificador)</Label>
              <Input
                id="action_key"
                value={formData.action_key}
                onChange={(e) => setFormData({ ...formData, action_key: e.target.value.toLowerCase() })}
                placeholder="whatsapp, calendly, demo..."
                disabled={!!selectedAction}
                className={formErrors.action_key ? 'border-red-500' : ''}
              />
              {formErrors.action_key && (
                <p className="text-sm text-red-500">{formErrors.action_key}</p>
              )}
              {!selectedAction && (
                <p className="text-xs text-gray-500">
                  Identificador único. Ej: whatsapp, agenda, demo
                </p>
              )}
            </div>

            {/* Label */}
            <div className="space-y-2">
              <Label htmlFor="label">Texto del botón</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="Hablar por WhatsApp"
                className={formErrors.label ? 'border-red-500' : ''}
              />
              {formErrors.label && (
                <p className="text-sm text-red-500">{formErrors.label}</p>
              )}
            </div>

            {/* ============================================ */}
            {/* SLOTS SELECTION - NEW FEATURE */}
            {/* ============================================ */}
            <div className="space-y-3">
              <div>
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  ¿Dónde aparece este botón?
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Selecciona las secciones de la landing donde se mostrará este botón
                </p>
              </div>
              
              {/* Template Context */}
              <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600">
                <span className="font-medium">Template actual:</span> {selectedCampaign?.template_key || 'cpn'}
              </div>

              {/* Slots Checkboxes */}
              <div className="space-y-2 border rounded-lg p-3">
                {availableSlots.map((slot) => (
                  <div 
                    key={slot.key}
                    className={`flex items-start space-x-3 p-2 rounded-md transition-colors ${
                      formData.display_slots.includes(slot.key) 
                        ? 'bg-purple-50 border border-purple-200' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <Checkbox
                      id={`slot-${slot.key}`}
                      checked={formData.display_slots.includes(slot.key)}
                      onCheckedChange={() => handleSlotToggle(slot.key)}
                    />
                    <div className="flex-1">
                      <label 
                        htmlFor={`slot-${slot.key}`}
                        className="text-sm font-medium cursor-pointer block"
                      >
                        {slot.label}
                      </label>
                      <p className="text-xs text-gray-500">{slot.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {formErrors.display_slots && (
                <p className="text-sm text-red-500">{formErrors.display_slots}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción interna (opcional)</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nota para el equipo admin"
              />
            </div>

            {/* Order */}
            <div className="space-y-2">
              <Label htmlFor="order">Orden de aparición</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
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
                {selectedAction ? 'Guardar' : 'Crear'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar acción?</AlertDialogTitle>
            <AlertDialogDescription>
              Esto eliminará la acción &ldquo;{selectedAction?.label}&rdquo; de la campaña.
              <br /><br />
              <strong>Nota:</strong> No se puede eliminar si hay mentores con enlaces configurados para esta acción.
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

export default ActionsPage;
