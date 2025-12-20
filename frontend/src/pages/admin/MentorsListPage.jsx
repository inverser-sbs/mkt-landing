import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Card } from '../../components/ui/card';
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
  AlertCircle
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
  
  // Modal states
  const [linksModalOpen, setLinksModalOpen] = useState(false);
  const [magicLinkModalOpen, setMagicLinkModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [mentorLinks, setMentorLinks] = useState({});
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

  // Filter mentors when search/filter changes
  useEffect(() => {
    filterMentors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filterActive, mentors]);

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
    const url = `${window.location.origin}/${selectedCampaign.key}/${slug}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Copiado',
      description: `URL pública para campaña "${selectedCampaign.name}" copiada`
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
      
      // Convert array to object
      const linksObj = {};
      response.data.forEach(link => {
        linksObj[link.action_key] = link.url || '';
      });
      setMentorLinks(linksObj);
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
        mentorLinks
      );
      
      toast({
        title: 'Guardado',
        description: 'Enlaces actualizados correctamente'
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
    } catch (error) {
      console.error('Error generating magic link:', error);
      toast({
        title: 'Error',
        description: 'No se pudo generar el magic link',
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
      </Card>

      {/* Mentors Grid */}
      {filteredMentors.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500">No se encontraron mentores</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMentors.map((mentor) => (
            <Card key={mentor.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                {/* Photo */}
                <div className="flex-shrink-0">
                  {mentor.photo_url ? (
                    <img
                      src={mentor.photo_url}
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
                  <div className="mt-2">
                    <Badge variant={mentor.active ? "default" : "outline"}>
                      {mentor.active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 grid grid-cols-2 gap-2">
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
                  variant="outline"
                  disabled={!selectedCampaign}
                  title="Generar magic link"
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
            </Card>
          ))}
        </div>
      )}

      {/* Links Modal */}
      <Dialog open={linksModalOpen} onOpenChange={setLinksModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Enlaces de {selectedMentor?.first_name} {selectedMentor?.last_name}
            </DialogTitle>
            <DialogDescription>
              Campaña: <Badge variant="secondary">{selectedCampaign?.name}</Badge>
            </DialogDescription>
          </DialogHeader>

          {loadingLinks ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#7c3aed]" />
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {Object.keys(mentorLinks).length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  No hay acciones configuradas para esta campaña
                </p>
              ) : (
                Object.entries(mentorLinks).map(([actionKey, url]) => (
                  <div key={actionKey} className="space-y-2">
                    <Label className="capitalize">{actionKey.replace(/-|_/g, ' ')}</Label>
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        placeholder="https://..."
                        value={url}
                        onChange={(e) => handleLinkChange(actionKey, e.target.value)}
                        className="font-mono text-sm"
                      />
                      {url && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => window.open(url, '_blank')}
                          title="Abrir enlace"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
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
            <DialogDescription>
              Campaña: <Badge variant="secondary">{selectedCampaign?.name}</Badge>
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
