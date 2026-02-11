import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Card } from '../../components/ui/card';
import { Textarea } from '../../components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { 
  Plus, 
  Search, 
  Edit, 
  Link as LinkIcon,
  Eye,
  EyeOff,
  Loader2,
  Copy,
  ExternalLink,
  Wand2,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  UserPen,
  Globe,
  Filter,
  Users,
  Trash2,
  Video
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { Toaster } from '../../components/ui/toaster';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const STORAGE_KEY = 'inverser_selected_campaign_mentors';

const MentorsListPage = () => {
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const [filterByCampaign, setFilterByCampaign] = useState(false); // New: filter mentors by campaign assignment
  
  // Modal states
  const [linksModalOpen, setLinksModalOpen] = useState(false);
  const [magicLinkModalOpen, setMagicLinkModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [mentorLinks, setMentorLinks] = useState({});
  const [videoWidgetUrl, setVideoWidgetUrl] = useState(''); // Video widget URL for mentor
  const [videoWidgetOrientation, setVideoWidgetOrientation] = useState('horizontal'); // Video orientation
  const [availableActions, setAvailableActions] = useState([]); // Actions available for this campaign
  const [mentorMagicLink, setMentorMagicLink] = useState(null);
  const [loadingLinks, setLoadingLinks] = useState(false);
  const [savingLinks, setSavingLinks] = useState(false);
  const [generatingMagicLink, setGeneratingMagicLink] = useState(false);
  const [magicLinkDays, setMagicLinkDays] = useState(30);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load campaigns and mentors on mount
  useEffect(() => {
    fetchCampaigns();
    fetchMentors();
  }, []);

  // Filter mentors when search/filter/campaign changes
  useEffect(() => {
    filterMentors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filterActive, mentors, filterByCampaign, selectedCampaign]);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/campaigns?active_only=true`);
      setCampaigns(response.data);
      
      if (response.data.length > 0) {
        // Try to restore last selected campaign
        const savedKey = localStorage.getItem(STORAGE_KEY);
        const savedCampaign = response.data.find(c => c.key === savedKey);
        setSelectedCampaign(savedCampaign || response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const fetchMentors = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/mentors`);
      setMentors(response.data);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los mentores',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterMentors = () => {
    let filtered = [...mentors];

    // Filter by campaign assignment
    if (filterByCampaign && selectedCampaign) {
      filtered = filtered.filter(m => 
        m.campaigns && m.campaigns.some(c => c.campaign_key === selectedCampaign.key)
      );
    }

    if (filterActive === 'active') {
      filtered = filtered.filter(m => m.active);
    } else if (filterActive === 'inactive') {
      filtered = filtered.filter(m => !m.active);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(m => 
        m.first_name.toLowerCase().includes(term) ||
        m.last_name.toLowerCase().includes(term) ||
        m.slug.toLowerCase().includes(term) ||
        (m.email && m.email.toLowerCase().includes(term))
      );
    }

    setFilteredMentors(filtered);
  };

  const handleCampaignChange = (key) => {
    const campaign = campaigns.find(c => c.key === key);
    if (campaign) {
      setSelectedCampaign(campaign);
      localStorage.setItem(STORAGE_KEY, key);
    }
  };

  // Check if mentor is assigned to selected campaign
  const isMentorInCampaign = (mentor) => {
    if (!selectedCampaign || !mentor.campaigns) return false;
    return mentor.campaigns.some(c => c.campaign_key === selectedCampaign.key);
  };

  // Get mentor's status in selected campaign
  const getMentorCampaignStatus = (mentor) => {
    if (!selectedCampaign || !mentor.campaigns) return null;
    const assignment = mentor.campaigns.find(c => c.campaign_key === selectedCampaign.key);
    return assignment?.status || null;
  };

  const toggleActive = async (mentor) => {
    try {
      await axios.put(`${BACKEND_URL}/api/admin/mentors/${mentor.id}`, {
        active: !mentor.active
      });
      
      toast({
        title: 'Actualizado',
        description: `Mentor ${mentor.active ? 'desactivado' : 'activado'} correctamente`
      });
      
      fetchMentors();
    } catch (error) {
      console.error('Error updating mentor:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el mentor',
        variant: 'destructive'
      });
    }
  };

  const copyPublicUrl = (slug) => {
    if (!selectedCampaign) return;
    const url = `${window.location.origin}/api/og/${selectedCampaign.key}/${slug}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Copiado',
      description: `URL para compartir en redes (campaña "${selectedCampaign.name}") copiada`
    });
  };

  // ========== Links Modal ==========
  const openLinksModal = async (mentor) => {
    if (!selectedCampaign) return;
    
    setSelectedMentor(mentor);
    setLinksModalOpen(true);
    setLoadingLinks(true);
    
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/admin/mentors/${mentor.id}/links/${selectedCampaign.key}`
      );
      
      // Response structure: { is_assigned: bool, links: [...], video_widget_url, video_widget_orientation }
      const linksData = response.data.links || [];
      
      // Convert array to object for form state
      const linksObj = {};
      linksData.forEach(link => {
        linksObj[link.action_key] = link.url || '';
      });
      setMentorLinks(linksObj);
      
      // Store the full links data for rendering labels
      setAvailableActions(linksData);
      
      // Set video widget settings
      setVideoWidgetUrl(response.data.video_widget_url || '');
      setVideoWidgetOrientation(response.data.video_widget_orientation || 'horizontal');
    } catch (error) {
      console.error('Error fetching links:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los enlaces',
        variant: 'destructive'
      });
    } finally {
      setLoadingLinks(false);
    }
  };

  const handleLinkChange = (actionKey, value) => {
    setMentorLinks(prev => ({
      ...prev,
      [actionKey]: value
    }));
  };

  const saveLinks = async () => {
    if (!selectedMentor || !selectedCampaign) return;
    
    setSavingLinks(true);
    try {
      await axios.put(
        `${BACKEND_URL}/api/admin/mentors/${selectedMentor.id}/links/${selectedCampaign.key}`,
        {
          links: mentorLinks,
          video_widget_code: videoWidgetCode
        }
      );
      
      toast({
        title: 'Guardado',
        description: 'Enlaces y configuración actualizados correctamente'
      });
      setLinksModalOpen(false);
    } catch (error) {
      console.error('Error saving links:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron guardar los enlaces',
        variant: 'destructive'
      });
    } finally {
      setSavingLinks(false);
    }
  };

  // ========== Magic Link Modal ==========
  const openMagicLinkModal = async (mentor) => {
    if (!selectedCampaign) return;
    
    setSelectedMentor(mentor);
    setMagicLinkModalOpen(true);
    setMentorMagicLink(null);
    
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/admin/mentors/${mentor.id}/magic-link/${selectedCampaign.key}/info`
      );
      
      if (response.data.has_token) {
        setMentorMagicLink(response.data);
      }
    } catch (error) {
      console.error('Error fetching magic link info:', error);
    }
  };

  const generateMagicLink = async () => {
    if (!selectedMentor || !selectedCampaign) return;
    
    setGeneratingMagicLink(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/admin/mentors/${selectedMentor.id}/magic-link/${selectedCampaign.key}?days_valid=${magicLinkDays}`
      );
      
      setMentorMagicLink({
        ...response.data,
        has_token: true,
        is_expired: false
      });
      
      // Copy to clipboard
      navigator.clipboard.writeText(response.data.magic_link);
      
      toast({
        title: 'Magic Link Generado',
        description: 'El link ha sido copiado al portapapeles'
      });
      
      // Refresh mentor list to update magic link badge
      fetchMentors();
    } catch (error) {
      console.error('Error generating magic link:', error);
      const detail = error.response?.data?.detail || 'No se pudo generar el magic link';
      toast({
        title: 'Error',
        description: detail,
        variant: 'destructive'
      });
    } finally {
      setGeneratingMagicLink(false);
    }
  };

  const deleteMagicLink = async () => {
    if (!selectedMentor || !selectedCampaign) return;
    
    setGeneratingMagicLink(true);
    try {
      await axios.delete(
        `${BACKEND_URL}/api/admin/mentors/${selectedMentor.id}/magic-link/${selectedCampaign.key}`
      );
      
      setMentorMagicLink(null);
      
      toast({
        title: 'Magic Link Eliminado',
        description: 'El mentor ya no puede usar el link de edición anterior'
      });
      
      // Refresh mentor list to update magic link badge
      fetchMentors();
    } catch (error) {
      console.error('Error deleting magic link:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el magic link',
        variant: 'destructive'
      });
    } finally {
      setGeneratingMagicLink(false);
    }
  };

  const copyMagicLink = () => {
    if (mentorMagicLink?.magic_link) {
      navigator.clipboard.writeText(mentorMagicLink.magic_link);
      toast({
        title: 'Copiado',
        description: 'Magic link copiado al portapapeles'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#7c3aed]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Toaster />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Mentores</h1>
          <p className="text-gray-600 mt-1">{mentors.length} mentores en total</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Campaign Selector */}
          {campaigns.length > 0 && (
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium whitespace-nowrap">Campaña:</Label>
              <Select value={selectedCampaign?.key || ''} onValueChange={handleCampaignChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Seleccionar" />
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
          )}
          
          <Button
            onClick={() => navigate('/admin/mentor/new')}
            className="bg-[#7c3aed] hover:bg-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Mentor
          </Button>
        </div>
      </div>

      {/* Campaign Context Banner */}
      {selectedCampaign && (
        <Card className="p-4 mb-6 bg-purple-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Layers className="w-5 h-5 text-[#7c3aed]" />
              <div>
                <p className="font-medium text-purple-900">
                  Gestión de enlaces para: <span className="font-bold">{selectedCampaign.name}</span>
                </p>
                <p className="text-sm text-purple-700">
                  URL: /{selectedCampaign.key}/&lt;slug&gt; • Template: {selectedCampaign.template_key}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="filter-campaign" className="text-sm text-purple-700">Solo asignados a esta campaña</Label>
              <Switch
                id="filter-campaign"
                checked={filterByCampaign}
                onCheckedChange={setFilterByCampaign}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nombre, slug o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterActive === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterActive('all')}
              size="sm"
            >
              Todos
            </Button>
            <Button
              variant={filterActive === 'active' ? 'default' : 'outline'}
              onClick={() => setFilterActive('active')}
              size="sm"
            >
              Activos
            </Button>
            <Button
              variant={filterActive === 'inactive' ? 'default' : 'outline'}
              onClick={() => setFilterActive('inactive')}
              size="sm"
            >
              Inactivos
            </Button>
          </div>
        </div>
        {filterByCampaign && (
          <p className="mt-2 text-sm text-gray-500">
            <Filter className="inline w-3 h-3 mr-1" />
            Mostrando {filteredMentors.length} mentor(es) asignados a {selectedCampaign?.name}
          </p>
        )}
      </Card>

      {/* Mentors Grid */}
      {filteredMentors.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500">No se encontraron mentores</p>
          {filterByCampaign && (
            <p className="text-sm text-gray-400 mt-2">
              Desactiva el filtro para ver todos los mentores
            </p>
          )}
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMentors.map((mentor) => {
            const isInCampaign = isMentorInCampaign(mentor);
            const campaignStatus = getMentorCampaignStatus(mentor);
            
            return (
            <Card key={mentor.id} className={`p-4 hover:shadow-lg transition-shadow ${!isInCampaign && selectedCampaign ? 'opacity-75 border-dashed' : ''}`}>
              <div className="flex items-start space-x-4">
                {/* Photo */}
                <div className="flex-shrink-0">
                  {mentor.photo_url ? (
                    <img
                      src={mentor.photo_url.startsWith('http') ? mentor.photo_url : `${BACKEND_URL}${mentor.photo_url}`}
                      alt={`${mentor.first_name} ${mentor.last_name}`}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#c4ff0f] to-[#7c3aed] flex items-center justify-center text-white font-bold text-xl">
                      {mentor.first_name[0]}{mentor.last_name[0]}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {mentor.first_name} {mentor.last_name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    /{selectedCampaign?.key || 'cpn'}/{mentor.slug}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {/* Global status badge */}
                    <Badge variant={mentor.active ? "default" : "outline"} className="text-xs">
                      {mentor.active ? 'Activo' : 'Inactivo'}
                    </Badge>
                    
                    {/* Campaign assignment badge */}
                    {selectedCampaign && (
                      isInCampaign ? (
                        <Badge variant="secondary" className={`text-xs ${
                          campaignStatus === 'paused' ? 'bg-amber-100 text-amber-700' :
                          campaignStatus === 'inactive' ? 'bg-red-100 text-red-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {campaignStatus === 'paused' ? '⏸️ Pausado' :
                           campaignStatus === 'inactive' ? '🔴 Inactivo' :
                           '✅ Asignado'}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs text-gray-400">
                          No asignado
                        </Badge>
                      )
                    )}
                  </div>
                  
                  {/* Campaign list badges */}
                  {mentor.campaigns && mentor.campaigns.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {mentor.campaigns.slice(0, 3).map((c) => (
                        <Badge 
                          key={c.campaign_key} 
                          variant="outline" 
                          className={`text-xs ${c.campaign_key === selectedCampaign?.key ? 'border-purple-300 bg-purple-50' : ''}`}
                        >
                          {c.campaign_key}
                          {c.has_magic_link && <Wand2 className="w-2 h-2 ml-1" />}
                        </Badge>
                      ))}
                      {mentor.campaigns.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{mentor.campaigns.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 space-y-2">
                {/* Edit Mentor Button - Prominent */}
                <Button
                  onClick={() => navigate(`/admin/mentor/${mentor.id}`)}
                  size="sm"
                  variant="default"
                  className="w-full bg-[#7c3aed] hover:bg-purple-700"
                  title="Editar datos y foto del mentor"
                >
                  <UserPen className="w-4 h-4 mr-2" />
                  Editar Mentor
                </Button>
                
                {/* Secondary Actions Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => openLinksModal(mentor)}
                    size="sm"
                    variant="outline"
                    disabled={!selectedCampaign}
                    title="Editar enlaces"
                  >
                    <LinkIcon className="w-4 h-4 mr-1" />
                    Enlaces
                  </Button>
                  <Button
                    onClick={() => openMagicLinkModal(mentor)}
                    size="sm"
                    variant={isInCampaign ? "outline" : "secondary"}
                    disabled={!selectedCampaign}
                    title={isInCampaign ? "Generar magic link" : "Primero asigna el mentor a esta campaña"}
                  >
                    <Wand2 className="w-4 h-4 mr-1" />
                    Magic Link
                  </Button>
                  <Button
                    onClick={() => copyPublicUrl(mentor.slug)}
                    size="sm"
                    variant="outline"
                    disabled={!selectedCampaign}
                    title="Copiar URL pública"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    URL
                  </Button>
                  <Button
                    onClick={() => toggleActive(mentor)}
                    size="sm"
                    variant="outline"
                    title={mentor.active ? 'Desactivar' : 'Activar'}
                  >
                    {mentor.active ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                    {mentor.active ? 'Off' : 'On'}
                  </Button>
                </div>
              </div>
            </Card>
            );
          })}
        </div>
      )}

      {/* Links Modal */}
      <Dialog open={linksModalOpen} onOpenChange={setLinksModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Enlaces de {selectedMentor?.first_name} {selectedMentor?.last_name}
            </DialogTitle>
            <DialogDescription asChild>
              <div className="text-sm text-muted-foreground">
                Campaña: <Badge variant="secondary">{selectedCampaign?.name}</Badge>
              </div>
            </DialogDescription>
          </DialogHeader>

          {loadingLinks ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#7c3aed]" />
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {availableActions.length === 0 ? (
                <div className="text-center py-4">
                  <AlertCircle className="w-8 h-8 mx-auto text-amber-500 mb-2" />
                  <p className="text-gray-600">No hay acciones configuradas para esta campaña</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Ve a <span className="font-medium">Gestión de Acciones</span> para configurar botones primero.
                  </p>
                </div>
              ) : (
                availableActions.map((action) => (
                  <div key={action.action_key} className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <span>{action.label}</span>
                      {!action.active && (
                        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                          Inactivo
                        </span>
                      )}
                    </Label>
                    {/* Internal Note - visible to admin */}
                    {action.internal_note && (
                      <p className="text-xs text-gray-500 italic bg-gray-50 px-2 py-1 rounded">
                        💡 {action.internal_note}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        placeholder="https://..."
                        value={mentorLinks[action.action_key] || ''}
                        onChange={(e) => handleLinkChange(action.action_key, e.target.value)}
                        className="font-mono text-sm"
                      />
                      {mentorLinks[action.action_key] && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => window.open(mentorLinks[action.action_key], '_blank')}
                          title="Abrir enlace"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
              
              {/* Video Widget Code Section */}
              <div className="pt-4 mt-4 border-t border-gray-200">
                <Label className="flex items-center gap-2 mb-2">
                  <Video className="w-4 h-4 text-purple-600" />
                  <span>Widget de Video (opcional)</span>
                </Label>
                <p className="text-xs text-gray-500 mb-2">
                  Pega aquí el código del widget de video (ej: FacePop, Loom, etc.). 
                  Se mostrará en la esquina inferior izquierda de la landing.
                </p>
                <Textarea
                  placeholder='<script id="..." src="https://..."></script>'
                  value={videoWidgetCode}
                  onChange={(e) => setVideoWidgetCode(e.target.value)}
                  className="font-mono text-xs min-h-[80px]"
                  data-testid="video-widget-code-input"
                />
                {videoWidgetCode && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Widget configurado
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setLinksModalOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={saveLinks} 
              disabled={savingLinks || loadingLinks}
              className="bg-[#7c3aed] hover:bg-purple-700"
            >
              {savingLinks && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Magic Link Modal */}
      <Dialog open={magicLinkModalOpen} onOpenChange={setMagicLinkModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Magic Link para {selectedMentor?.first_name} {selectedMentor?.last_name}
            </DialogTitle>
            <DialogDescription asChild>
              <div className="text-sm text-muted-foreground">
                Campaña: <Badge variant="secondary">{selectedCampaign?.name}</Badge>
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {mentorMagicLink?.has_token ? (
              <div className="space-y-4">
                {mentorMagicLink.is_expired ? (
                  <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-900">Token expirado</p>
                      <p className="text-sm text-red-700">Genera un nuevo magic link para este mentor.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-green-900">Token activo</p>
                      <p className="text-sm text-green-700">
                        Expira: {new Date(mentorMagicLink.expires_at).toLocaleDateString()}
                      </p>
                      {mentorMagicLink.magic_link && (
                        <div className="mt-2">
                          <Input 
                            value={mentorMagicLink.magic_link} 
                            readOnly 
                            className="font-mono text-xs"
                          />
                          <Button
                            onClick={copyMagicLink}
                            variant="outline"
                            size="sm"
                            className="mt-2 w-full"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copiar Magic Link
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <Wand2 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No hay magic link activo para esta campaña</p>
              </div>
            )}

            <div className="border-t pt-4">
              <Label>Generar nuevo Magic Link</Label>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <Input
                    type="number"
                    min="1"
                    max="365"
                    value={magicLinkDays}
                    onChange={(e) => setMagicLinkDays(parseInt(e.target.value) || 30)}
                    className="w-20"
                  />
                  <span className="text-sm text-gray-500">días</span>
                </div>
                <Button
                  onClick={generateMagicLink}
                  disabled={generatingMagicLink}
                  className="bg-[#7c3aed] hover:bg-purple-700"
                >
                  {generatingMagicLink && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Generar
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Esto invalidará cualquier magic link anterior para esta campaña.
              </p>
            </div>
            
            {/* Delete Magic Link option */}
            {mentorMagicLink?.has_token && !mentorMagicLink.is_expired && (
              <div className="border-t pt-4 mt-4">
                <Label className="text-red-600">Eliminar Magic Link</Label>
                <p className="text-xs text-gray-500 mt-1 mb-2">
                  El mentor ya no podrá usar el link de edición actual. Deberás generar uno nuevo si lo necesita.
                </p>
                <Button
                  onClick={deleteMagicLink}
                  disabled={generatingMagicLink}
                  variant="outline"
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  {generatingMagicLink && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar Magic Link
                </Button>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setMagicLinkModalOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MentorsListPage;
