import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { 
  Eye,
  MousePointerClick,
  TrendingUp,
  Users,
  Loader2,
  BarChart3,
  Layers,
  ArrowUpDown,
  Calendar,
  RefreshCw,
  Video,
  Play
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { Toaster } from '../../components/ui/toaster';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const STORAGE_KEY = 'inverser_selected_campaign_analytics';

const AnalyticsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  // Period filter
  const [periodDays, setPeriodDays] = useState(30);

  // Data states
  const [kpis, setKpis] = useState(null);
  const [mentorStats, setMentorStats] = useState([]);
  const [actionStats, setActionStats] = useState([]);
  const [videoWidgetStats, setVideoWidgetStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Sorting
  const [mentorSort, setMentorSort] = useState({ field: 'visits', order: 'desc' });

  // Load campaigns
  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Load stats when campaign or period changes
  useEffect(() => {
    if (selectedCampaign) {
      fetchAllStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCampaign, periodDays]);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/campaigns?active_only=true`);
      setCampaigns(response.data);
      
      if (response.data.length > 0) {
        const savedKey = localStorage.getItem(STORAGE_KEY);
        const savedCampaign = response.data.find(c => c.key === savedKey);
        setSelectedCampaign(savedCampaign || response.data[0]);
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

  const fetchAllStats = useCallback(async () => {
    if (!selectedCampaign) return;
    
    setLoadingStats(true);
    
    try {
      const [kpisRes, mentorsRes, actionsRes, videoWidgetRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/track/stats/campaign/${selectedCampaign.key}?days=${periodDays}`),
        axios.get(`${BACKEND_URL}/api/track/stats/campaign/${selectedCampaign.key}/mentors?days=${periodDays}`),
        axios.get(`${BACKEND_URL}/api/track/stats/campaign/${selectedCampaign.key}/actions?days=${periodDays}`),
        axios.get(`${BACKEND_URL}/api/track/video-widget/stats/${selectedCampaign.key}?days=${periodDays}`)
      ]);
      
      setKpis(kpisRes.data);
      setMentorStats(mentorsRes.data);
      setActionStats(actionsRes.data);
      setVideoWidgetStats(videoWidgetRes.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las estadísticas',
        variant: 'destructive'
      });
    } finally {
      setLoadingStats(false);
    }
  }, [selectedCampaign, periodDays, toast]);

  const handleCampaignChange = (key) => {
    const campaign = campaigns.find(c => c.key === key);
    if (campaign) {
      setSelectedCampaign(campaign);
      localStorage.setItem(STORAGE_KEY, key);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllStats();
    setRefreshing(false);
    toast({
      title: 'Actualizado',
      description: 'Estadísticas actualizadas'
    });
  };

  const sortedMentorStats = [...mentorStats].sort((a, b) => {
    const multiplier = mentorSort.order === 'desc' ? -1 : 1;
    return (a[mentorSort.field] - b[mentorSort.field]) * multiplier;
  });

  const toggleMentorSort = (field) => {
    if (mentorSort.field === field) {
      setMentorSort(prev => ({
        ...prev,
        order: prev.order === 'desc' ? 'asc' : 'desc'
      }));
    } else {
      setMentorSort({ field, order: 'desc' });
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No hay campañas activas</h2>
          <p className="text-gray-600">Crea una campaña antes de ver analíticas.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Toaster />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Analítica</h1>
          <p className="text-gray-600 mt-1">Métricas de tráfico y clicks por campaña</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Period Selector */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <Select value={String(periodDays)} onValueChange={(v) => setPeriodDays(Number(v))}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 días</SelectItem>
                <SelectItem value="30">Últimos 30 días</SelectItem>
                <SelectItem value="90">Últimos 90 días</SelectItem>
                <SelectItem value="365">Último año</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Campaign Selector */}
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
          
          {/* Refresh Button */}
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="icon"
            disabled={refreshing || loadingStats}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Campaign Context Banner */}
      {selectedCampaign && (
        <Card className="p-4 mb-6 bg-purple-50 border-purple-200">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-5 h-5 text-[#7c3aed]" />
            <div>
              <p className="font-medium text-purple-900">
                Analítica de la campaña: <span className="font-bold">{selectedCampaign.name}</span>
              </p>
              <p className="text-sm text-purple-700">
                Período: últimos {periodDays} días • Template: {selectedCampaign.template_key}
              </p>
            </div>
          </div>
        </Card>
      )}

      {loadingStats ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#7c3aed]" />
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Eye className="w-8 h-8 text-blue-600" />
                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-900">
                      {kpis?.total_visits?.toLocaleString() || 0}
                    </p>
                    <p className="text-sm text-blue-700">Visitas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <MousePointerClick className="w-8 h-8 text-green-600" />
                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-900">
                      {kpis?.total_clicks?.toLocaleString() || 0}
                    </p>
                    <p className="text-sm text-green-700">Clicks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <TrendingUp className="w-8 h-8 text-amber-600" />
                  <div className="text-right">
                    <p className="text-3xl font-bold text-amber-900">
                      {kpis?.ctr || 0}%
                    </p>
                    <p className="text-sm text-amber-700">CTR</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Users className="w-8 h-8 text-purple-600" />
                  <div className="text-right">
                    <p className="text-3xl font-bold text-purple-900">
                      {kpis?.active_mentors || 0}
                    </p>
                    <p className="text-sm text-purple-700">Mentores Activos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Video Widget Stats */}
          {videoWidgetStats && (videoWidgetStats.total_expands > 0 || Object.keys(videoWidgetStats.mentor_stats || {}).length > 0) && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-purple-600" />
                  Widget de Video
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <Play className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-900">{videoWidgetStats.total_expands || 0}</p>
                    <p className="text-sm text-purple-700">Videos Abiertos</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <Video className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-900">{videoWidgetStats.total_plays || 0}</p>
                    <p className="text-sm text-green-700">Reproducciones</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-900">
                      {Object.keys(videoWidgetStats.mentor_stats || {}).length}
                    </p>
                    <p className="text-sm text-blue-700">Mentores con Video</p>
                  </div>
                </div>
                
                {Object.keys(videoWidgetStats.mentor_stats || {}).length > 0 && (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Mentor</TableHead>
                          <TableHead className="text-center">Abiertos</TableHead>
                          <TableHead className="text-center">Reproducciones</TableHead>
                          <TableHead className="text-center">Cerrados</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(videoWidgetStats.mentor_stats).map(([mentorId, stats]) => (
                          <TableRow key={mentorId}>
                            <TableCell className="font-medium">{mentorId}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline" className="bg-purple-50">
                                {stats.expand || 0}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline" className="bg-green-50">
                                {stats.play || 0}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline" className="bg-gray-50">
                                {stats.collapse || 0}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Mentor Performance Table */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Rendimiento por Mentor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {mentorStats.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Eye className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p>Sin datos de tráfico en este período</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Mentor</TableHead>
                            <TableHead 
                              className="cursor-pointer hover:bg-gray-50"
                              onClick={() => toggleMentorSort('visits')}
                            >
                              <div className="flex items-center gap-1">
                                Visitas
                                <ArrowUpDown className="w-3 h-3" />
                              </div>
                            </TableHead>
                            <TableHead 
                              className="cursor-pointer hover:bg-gray-50"
                              onClick={() => toggleMentorSort('clicks')}
                            >
                              <div className="flex items-center gap-1">
                                Clicks
                                <ArrowUpDown className="w-3 h-3" />
                              </div>
                            </TableHead>
                            <TableHead>CTR</TableHead>
                            <TableHead>Top Acción</TableHead>
                            <TableHead>Última Actividad</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sortedMentorStats.map((mentor) => (
                            <TableRow key={mentor.mentor_id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{mentor.mentor_name}</p>
                                  <p className="text-xs text-gray-500 font-mono">
                                    /{selectedCampaign?.key}/{mentor.mentor_slug}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell className="font-semibold">
                                {mentor.visits.toLocaleString()}
                              </TableCell>
                              <TableCell className="font-semibold">
                                {mentor.clicks.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{mentor.ctr}%</Badge>
                              </TableCell>
                              <TableCell>
                                {mentor.most_clicked_action ? (
                                  <div className="text-sm">
                                    <span className="font-medium">{mentor.most_clicked_action.action}</span>
                                    <span className="text-gray-500 ml-1">
                                      ({mentor.most_clicked_action.clicks})
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </TableCell>
                              <TableCell className="text-sm text-gray-500">
                                {formatDate(mentor.last_activity)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Action Performance Table */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MousePointerClick className="w-5 h-5" />
                    Clicks por Acción
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {actionStats.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <MousePointerClick className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p>Sin clicks registrados</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {actionStats.map((action) => (
                        <div key={action.action_key} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{action.label}</span>
                            <span className="text-sm font-bold">{action.clicks}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[#7c3aed] rounded-full"
                                style={{ width: `${action.percentage}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 w-12 text-right">
                              {action.percentage}%
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1 font-mono">
                            {action.action_key}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
