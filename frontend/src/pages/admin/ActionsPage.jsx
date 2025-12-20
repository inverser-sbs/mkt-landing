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
  MapPin,
  MousePointer2,
  Settings2,
  CheckCircle2,
  Archive,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { Toaster } from '../../components/ui/toaster';
import { useNavigate } from 'react-router-dom';
import { 
  getSlotsForTemplate, 
  getButtonsForTemplate,
  getButtonByKey,
  getAllowedSlotsForButton,
  getButtonDefaultLabel
} from '../../templates';

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
  const [retireConfirmOpen, setRetireConfirmOpen] = useState(false);
  const [replaceModalOpen, setReplaceModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showRetired, setShowRetired] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Replace action state
  const [replaceData, setReplaceData] = useState({
    newActionKey: ''
  });

  // Form state
  const [formData, setFormData] = useState({
    action_key: '',
    button_key: '',
    label: '',
    description: '',
    active: true,
    order: 0,
    display_slots: []
  });
  const [formErrors, setFormErrors] = useState({});

  // Get template info for current campaign
  const templateKey = selectedCampaign?.template_key || 'cpn';
  const availableSlots = getSlotsForTemplate(templateKey);
  const availableButtons = getButtonsForTemplate(templateKey);
  
  // Get allowed slots based on selected button
  const selectedButton = formData.button_key 
    ? getButtonByKey(templateKey, formData.button_key) 
    : null;
  const allowedSlots = formData.button_key 
    ? getAllowedSlotsForButton(templateKey, formData.button_key)
    : availableSlots;

  // Load campaigns on mount
  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Load actions when campaign changes
  useEffect(() => {
    if (selectedCampaign) {
      fetchActions(selectedCampaign.key);
      localStorage.setItem(STORAGE_KEY, selectedCampaign.key);
    }
  }, [selectedCampaign]);

  // Reset slots when button changes
  useEffect(() => {
    if (formData.button_key && selectedButton) {
      // Auto-select all allowed slots for this button
      setFormData(prev => ({
        ...prev,
        display_slots: [...selectedButton.allowed_slots]
      }));
    }
  }, [formData.button_key]);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/campaigns?active_only=true`);
      const activeCampaigns = response.data;
      setCampaigns(activeCampaigns);
      
      if (activeCampaigns.length > 0) {
        const savedCampaignKey = localStorage.getItem(STORAGE_KEY);
        const savedCampaign = activeCampaigns.find(c => c.key === savedCampaignKey);
        setSelectedCampaign(savedCampaign || activeCampaigns[0]);
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
    
    if (!formData.button_key) {
      errors.button_key = 'Selecciona un botón del template';
    }
    
    if (!formData.action_key) {
      errors.action_key = 'El key es requerido';
    } else if (!/^[a-z0-9_-]+$/.test(formData.action_key)) {
      errors.action_key = 'Solo letras minúsculas, números, guiones y guiones bajos';
    } else if (!selectedAction) {
      const exists = actions.some(a => a.action_key === formData.action_key);
      if (exists) {
        errors.action_key = 'Este key ya existe en esta campaña';
      }
    }
    
    if (!formData.label) {
      errors.label = 'El texto del botón es requerido';
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
        button_key: action.button_key || action.action_key,
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
        button_key: '',
        label: '',
        description: '',
        active: true,
        order: actions.length,
        display_slots: []
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

  const handleButtonSelect = (buttonKey) => {
    const button = getButtonByKey(templateKey, buttonKey);
    if (button) {
      setFormData(prev => ({
        ...prev,
        button_key: buttonKey,
        action_key: prev.action_key || buttonKey, // Auto-fill action_key
        label: prev.label || button.label_default, // Auto-fill label
        display_slots: [...button.allowed_slots] // Auto-select all allowed slots
      }));
    }
    if (formErrors.button_key) {
      setFormErrors(prev => ({ ...prev, button_key: null }));
    }
  };

  const handleSlotToggle = (slotKey) => {
    // Only allow toggling slots that are allowed for this button
    if (selectedButton && !selectedButton.allowed_slots.includes(slotKey)) {
      return;
    }
    
    setFormData(prev => {
      const currentSlots = prev.display_slots || [];
      if (currentSlots.includes(slotKey)) {
        return { ...prev, display_slots: currentSlots.filter(s => s !== slotKey) };
      } else {
        return { ...prev, display_slots: [...currentSlots, slotKey] };
      }
    });
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
        await axios.put(`${BACKEND_URL}/api/admin/actions/${selectedAction.id}`, {
          label: formData.label,
          button_key: formData.button_key,
          description: formData.description || null,
          active: formData.active,
          order: formData.order,
          display_slots: formData.display_slots
        });
        toast({ title: 'Actualizado', description: 'Acción actualizada correctamente' });
      } else {
        await axios.post(`${BACKEND_URL}/api/admin/actions`, {
          campaign_key: selectedCampaign.key,
          action_key: formData.action_key,
          button_key: formData.button_key,
          label: formData.label,
          description: formData.description || null,
          active: formData.active,
          order: formData.order,
          display_slots: formData.display_slots
        });
        toast({ title: 'Creado', description: 'Acción creada correctamente' });
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
      toast({ title: 'Eliminado', description: 'Acción eliminada correctamente' });
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

  // Helper to get slot labels
  const getSlotLabels = (slotKeys) => {
    if (!slotKeys || slotKeys.length === 0) return ['Sin ubicación'];
    return slotKeys.map(key => {
      const slot = availableSlots.find(s => s.key === key);
      return slot ? slot.label.replace('Hero - ', '').replace('CTA ', '') : key;
    });
  };

  // Helper to get button info
  const getButtonInfo = (buttonKey) => {
    const button = getButtonByKey(templateKey, buttonKey);
    return button || { label_default: buttonKey, description: '' };
  };

  // Check which buttons are already configured
  const configuredButtonKeys = actions.map(a => a.button_key || a.action_key);
  const unconfiguredButtons = availableButtons.filter(b => !configuredButtonKeys.includes(b.key));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#7c3aed]" />
      </div>
    );
  }

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
          <h1 className="text-3xl font-display font-bold text-gray-900">Configurar Botones</h1>
          <p className="text-gray-600 mt-1">
            Configura los botones del template para que los mentores puedan personalizar sus URLs
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

      {/* Context Banner */}
      {selectedCampaign && (
        <Card className="p-4 mb-6 bg-purple-50 border-purple-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 text-[#7c3aed]" />
              <div>
                <p className="font-medium text-purple-900">
                  Campaña: <span className="font-bold">{selectedCampaign.name}</span>
                </p>
                <p className="text-sm text-purple-700 flex items-center gap-3">
                  <span>Template: <strong>{templateKey}</strong></span>
                  <span>•</span>
                  <span className="flex items-center">
                    <MousePointer2 className="w-3 h-3 mr-1" />
                    {availableButtons.length} botones en el diseño
                  </span>
                  <span>•</span>
                  <span className="flex items-center">
                    <LayoutGrid className="w-3 h-3 mr-1" />
                    {availableSlots.length} ubicaciones
                  </span>
                </p>
              </div>
            </div>
            <Button
              onClick={() => openModal()}
              className="bg-[#7c3aed] hover:bg-purple-700"
              disabled={unconfiguredButtons.length === 0}
            >
              <Plus className="w-4 h-4 mr-2" />
              Configurar Botón
            </Button>
          </div>
        </Card>
      )}

      {/* Info Card */}
      <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">¿Cómo funciona?</p>
            <p>
              El template <strong>{templateKey}</strong> tiene <strong>{availableButtons.length} botones</strong> predefinidos en su diseño.
              Aquí configuras cada botón para que los mentores puedan asignar sus URLs personalizadas.
            </p>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="bg-blue-100 px-2 py-1 rounded">BOTÓN (del diseño)</span>
              <span>→</span>
              <span className="bg-blue-100 px-2 py-1 rounded">ACCIÓN (configuración)</span>
              <span>→</span>
              <span className="bg-blue-100 px-2 py-1 rounded">SLOT (ubicación)</span>
              <span>→</span>
              <span className="bg-blue-100 px-2 py-1 rounded">URL (del mentor)</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Unconfigured Buttons Alert */}
      {unconfiguredButtons.length > 0 && (
        <Card className="p-4 mb-6 bg-amber-50 border-amber-200">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-semibold mb-1">Botones sin configurar</p>
              <p>
                Estos botones existen en el template pero no están configurados:
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {unconfiguredButtons.map(button => (
                  <Badge 
                    key={button.key} 
                    variant="outline" 
                    className="bg-white border-amber-300 text-amber-700 cursor-pointer hover:bg-amber-100"
                    onClick={() => {
                      handleButtonSelect(button.key);
                      setModalOpen(true);
                    }}
                  >
                    + {button.label_default}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Actions List */}
      {actionsLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#7c3aed]" />
        </div>
      ) : actions.length === 0 ? (
        <Card className="p-12 text-center">
          <MousePointer2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Sin botones configurados
          </h3>
          <p className="text-gray-600 mb-6">
            El template tiene {availableButtons.length} botones disponibles. 
            Configura cada uno para que los mentores puedan personalizar sus URLs.
          </p>
          <Button onClick={() => openModal()} className="bg-[#7c3aed] hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Configurar primer botón
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {actions.map((action) => {
            const buttonInfo = getButtonInfo(action.button_key || action.action_key);
            return (
              <Card key={action.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="text-gray-400 cursor-move">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                    {action.order}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{action.label}</h3>
                      <Badge variant="secondary" className="font-mono text-xs bg-purple-100 text-purple-700">
                        {action.button_key || action.action_key}
                      </Badge>
                      <Badge variant={action.active ? "default" : "outline"}>
                        {action.active ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </div>
                    
                    {/* Button description */}
                    {buttonInfo.description && (
                      <p className="text-xs text-gray-500 mt-1">{buttonInfo.description}</p>
                    )}
                    
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
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => toggleActive(action)}
                      size="sm"
                      variant="outline"
                      className={action.active ? "text-orange-600" : "text-green-600"}
                    >
                      {action.active ? 'Desactivar' : 'Activar'}
                    </Button>
                    <Button onClick={() => openModal(action)} size="sm" variant="outline">
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
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal - 3 Step Flow */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings2 className="w-5 h-5" />
              {selectedAction ? 'Editar Configuración' : 'Configurar Botón'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* ============================================ */}
            {/* PASO 1: Seleccionar Botón del Template */}
            {/* ============================================ */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <span className="w-6 h-6 rounded-full bg-[#7c3aed] text-white flex items-center justify-center text-xs">1</span>
                ¿Qué botón del template estás configurando?
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600 mb-2">
                Template: <strong>{templateKey}</strong> • {availableButtons.length} botones disponibles
              </div>

              <div className="space-y-2">
                {availableButtons.map((button) => {
                  const isConfigured = configuredButtonKeys.includes(button.key) && 
                    (!selectedAction || selectedAction.button_key !== button.key);
                  const isSelected = formData.button_key === button.key;
                  
                  return (
                    <div 
                      key={button.key}
                      onClick={() => !isConfigured && !selectedAction && handleButtonSelect(button.key)}
                      className={`
                        p-3 rounded-lg border-2 transition-all
                        ${isSelected 
                          ? 'border-[#7c3aed] bg-purple-50' 
                          : isConfigured 
                            ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                            : selectedAction
                              ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                              : 'border-gray-200 hover:border-purple-300 cursor-pointer'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{button.label_default}</p>
                          <p className="text-xs text-gray-500">{button.description}</p>
                          <div className="flex gap-1 mt-1">
                            {button.allowed_slots.map(slot => (
                              <span key={slot} className="text-xs bg-gray-200 px-1.5 py-0.5 rounded">
                                {slot}
                              </span>
                            ))}
                          </div>
                        </div>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-[#7c3aed]" />}
                        {isConfigured && !isSelected && (
                          <Badge variant="outline" className="text-xs">Ya configurado</Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {formErrors.button_key && (
                <p className="text-sm text-red-500">{formErrors.button_key}</p>
              )}
            </div>

            {/* ============================================ */}
            {/* PASO 2: Personalizar Texto */}
            {/* ============================================ */}
            {formData.button_key && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <span className="w-6 h-6 rounded-full bg-[#7c3aed] text-white flex items-center justify-center text-xs">2</span>
                  Personaliza el texto (opcional)
                </div>

                <div className="space-y-3">
                  {/* Label */}
                  <div className="space-y-2">
                    <Label htmlFor="label">Texto del botón</Label>
                    <Input
                      id="label"
                      value={formData.label}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      placeholder={getButtonDefaultLabel(templateKey, formData.button_key)}
                      className={formErrors.label ? 'border-red-500' : ''}
                    />
                    {formErrors.label && (
                      <p className="text-sm text-red-500">{formErrors.label}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Default: {getButtonDefaultLabel(templateKey, formData.button_key)}
                    </p>
                  </div>

                  {/* Action Key (hidden for most users, auto-generated) */}
                  {!selectedAction && (
                    <div className="space-y-2">
                      <Label htmlFor="action_key" className="text-gray-500">
                        ID interno (auto-generado)
                      </Label>
                      <Input
                        id="action_key"
                        value={formData.action_key}
                        onChange={(e) => setFormData({ ...formData, action_key: e.target.value.toLowerCase() })}
                        placeholder={formData.button_key}
                        className={`font-mono text-sm ${formErrors.action_key ? 'border-red-500' : ''}`}
                      />
                      {formErrors.action_key && (
                        <p className="text-sm text-red-500">{formErrors.action_key}</p>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Nota interna (opcional)</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Nota para el equipo admin"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ============================================ */}
            {/* PASO 3: Seleccionar Ubicaciones (Slots) */}
            {/* ============================================ */}
            {formData.button_key && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <span className="w-6 h-6 rounded-full bg-[#7c3aed] text-white flex items-center justify-center text-xs">3</span>
                  ¿Dónde aparece este botón?
                </div>

                <p className="text-xs text-gray-500">
                  Este botón puede aparecer en las siguientes ubicaciones del template:
                </p>

                <div className="space-y-2 border rounded-lg p-3">
                  {availableSlots.map((slot) => {
                    const isAllowed = selectedButton?.allowed_slots.includes(slot.key);
                    const isChecked = formData.display_slots.includes(slot.key);
                    
                    return (
                      <div 
                        key={slot.key}
                        className={`
                          flex items-start space-x-3 p-2 rounded-md transition-colors
                          ${!isAllowed 
                            ? 'opacity-40 cursor-not-allowed' 
                            : isChecked 
                              ? 'bg-purple-50 border border-purple-200' 
                              : 'hover:bg-gray-50'
                          }
                        `}
                      >
                        <Checkbox
                          id={`slot-${slot.key}`}
                          checked={isChecked}
                          onCheckedChange={() => handleSlotToggle(slot.key)}
                          disabled={!isAllowed}
                        />
                        <div className="flex-1">
                          <label 
                            htmlFor={`slot-${slot.key}`}
                            className={`text-sm font-medium block ${!isAllowed ? 'text-gray-400' : 'cursor-pointer'}`}
                          >
                            {slot.label}
                            {!isAllowed && <span className="text-xs text-gray-400 ml-2">(no disponible para este botón)</span>}
                          </label>
                          <p className="text-xs text-gray-500">{slot.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {formErrors.display_slots && (
                  <p className="text-sm text-red-500">{formErrors.display_slots}</p>
                )}
              </div>
            )}

            {/* Order & Active */}
            {formData.button_key && (
              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div className="space-y-2">
                  <Label htmlFor="order">Orden</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
                <div className="flex items-center justify-between pt-6">
                  <Label htmlFor="active">Activa</Label>
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeModal}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={saving || !formData.button_key} 
                className="bg-[#7c3aed] hover:bg-purple-700"
              >
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {selectedAction ? 'Guardar' : 'Configurar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar configuración?</AlertDialogTitle>
            <AlertDialogDescription>
              Esto eliminará la configuración del botón &ldquo;{selectedAction?.label}&rdquo;.
              <br /><br />
              <strong>Nota:</strong> No se puede eliminar si hay mentores con URLs configuradas.
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
