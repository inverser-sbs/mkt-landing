import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Switch } from '../../components/ui/switch';
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
  Download,
  Upload,
  FileText,
  Eye,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Layers,
  FileSpreadsheet,
  Info
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { Toaster } from '../../components/ui/toaster';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const STORAGE_KEY = 'inverser_selected_campaign_csv';

const CSVPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Export state
  const [exportFilter, setExportFilter] = useState('all');
  const [exportGroup, setExportGroup] = useState('');
  const [exporting, setExporting] = useState(false);

  // Preview state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewing, setPreviewing] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  // Import state
  const [importing, setImporting] = useState(false);
  const [importOptions, setImportOptions] = useState({
    create_new: true,
    update_existing: true,
    overwrite_links: false
  });
  const [importResults, setImportResults] = useState(null);

  // Load campaigns
  useEffect(() => {
    fetchCampaigns();
  }, []);

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

  const handleCampaignChange = (key) => {
    const campaign = campaigns.find(c => c.key === key);
    if (campaign) {
      setSelectedCampaign(campaign);
      localStorage.setItem(STORAGE_KEY, key);
      // Reset preview when campaign changes
      setPreviewData(null);
      setImportResults(null);
    }
  };

  // ========== Template Download ==========
  const downloadTemplate = async () => {
    if (!selectedCampaign) return;
    
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/admin/csv/template?campaign_key=${selectedCampaign.key}`,
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `template_${selectedCampaign.key}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast({
        title: 'Descargado',
        description: `Template CSV para ${selectedCampaign.name} descargado`
      });
    } catch (error) {
      console.error('Error downloading template:', error);
      toast({
        title: 'Error',
        description: 'No se pudo descargar el template',
        variant: 'destructive'
      });
    }
  };

  // ========== Export ==========
  const exportCSV = async () => {
    if (!selectedCampaign) return;
    
    setExporting(true);
    try {
      let url = `${BACKEND_URL}/api/admin/csv/export?campaign_key=${selectedCampaign.key}&filter_type=${exportFilter}`;
      if (exportFilter === 'group' && exportGroup) {
        url += `&group_name=${encodeURIComponent(exportGroup)}`;
      }
      
      const response = await axios.get(url, { responseType: 'blob' });
      
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `mentors_${selectedCampaign.key}_${exportFilter}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast({
        title: 'Exportado',
        description: `CSV de mentores exportado correctamente`
      });
    } catch (error) {
      console.error('Error exporting:', error);
      toast({
        title: 'Error',
        description: 'No se pudo exportar el CSV',
        variant: 'destructive'
      });
    } finally {
      setExporting(false);
    }
  };

  // ========== Preview ==========
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewData(null);
      setImportResults(null);
    }
  };

  const previewImport = async () => {
    if (!selectedFile || !selectedCampaign) return;
    
    setPreviewing(true);
    setPreviewData(null);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const response = await axios.post(
        `${BACKEND_URL}/api/admin/csv/preview?campaign_key=${selectedCampaign.key}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      setPreviewData(response.data);
      
      toast({
        title: 'Preview completado',
        description: `${response.data.total_rows} filas analizadas`
      });
    } catch (error) {
      console.error('Error previewing:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Error al previsualizar el archivo',
        variant: 'destructive'
      });
    } finally {
      setPreviewing(false);
    }
  };

  // ========== Import ==========
  const executeImport = async () => {
    if (!selectedFile || !selectedCampaign || !previewData) return;
    
    setImporting(true);
    setImportResults(null);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const params = new URLSearchParams({
        campaign_key: selectedCampaign.key,
        create_new: importOptions.create_new,
        update_existing: importOptions.update_existing,
        overwrite_links: importOptions.overwrite_links
      });
      
      const response = await axios.post(
        `${BACKEND_URL}/api/admin/csv/import?${params.toString()}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      setImportResults(response.data);
      
      toast({
        title: 'Importación completada',
        description: `Creados: ${response.data.created}, Actualizados: ${response.data.updated}`
      });
    } catch (error) {
      console.error('Error importing:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Error al importar el archivo',
        variant: 'destructive'
      });
    } finally {
      setImporting(false);
    }
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
          <Layers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No hay campañas activas</h2>
          <p className="text-gray-600">Crea una campaña antes de usar la gestión CSV.</p>
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
          <h1 className="text-3xl font-display font-bold text-gray-900">Gestión CSV</h1>
          <p className="text-gray-600 mt-1">Import/Export de mentores por campaña</p>
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

      {/* Campaign Context Banner */}
      {selectedCampaign && (
        <Card className="p-4 mb-6 bg-purple-50 border-purple-200">
          <div className="flex items-center space-x-3">
            <FileSpreadsheet className="w-5 h-5 text-[#7c3aed]" />
            <div>
              <p className="font-medium text-purple-900">
                CSV para la campaña: <span className="font-bold">{selectedCampaign.name}</span>
              </p>
              <p className="text-sm text-purple-700">
                Las columnas de acciones corresponden SOLO a esta campaña
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Template Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Template CSV
            </CardTitle>
            <CardDescription>
              Descarga un template con las columnas correctas para esta campaña
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={downloadTemplate}
              className="w-full bg-[#7c3aed] hover:bg-purple-700"
              disabled={!selectedCampaign}
            >
              <Download className="w-4 h-4 mr-2" />
              Descargar Template
            </Button>
            <p className="text-xs text-gray-500 mt-3">
              El template incluirá columnas <code className="bg-gray-100 px-1 rounded">action:*</code> 
              solo para las acciones de "{selectedCampaign?.name}"
            </p>
          </CardContent>
        </Card>

        {/* Export Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Exportar Mentores
            </CardTitle>
            <CardDescription>
              Exporta los mentores existentes con sus enlaces de esta campaña
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Filtro</Label>
              <Select value={exportFilter} onValueChange={setExportFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los mentores</SelectItem>
                  <SelectItem value="active">Solo activos</SelectItem>
                  <SelectItem value="group">Por grupo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {exportFilter === 'group' && (
              <div className="space-y-2">
                <Label>Nombre del grupo</Label>
                <Input
                  placeholder="team, vip, etc..."
                  value={exportGroup}
                  onChange={(e) => setExportGroup(e.target.value)}
                />
              </div>
            )}
            
            <Button 
              onClick={exportCSV}
              className="w-full"
              variant="outline"
              disabled={!selectedCampaign || exporting || (exportFilter === 'group' && !exportGroup)}
            >
              {exporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Exportar CSV
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Preview & Import Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Previsualizar e Importar
          </CardTitle>
          <CardDescription>
            Sube un archivo CSV para previsualizar los cambios antes de importar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload */}
          <div className="space-y-2">
            <Label>Archivo CSV</Label>
            <div className="flex gap-3">
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="flex-1"
              />
              <Button 
                onClick={previewImport}
                disabled={!selectedFile || !selectedCampaign || previewing}
                variant="outline"
              >
                {previewing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Eye className="w-4 h-4 mr-2" />
                )}
                Previsualizar
              </Button>
            </div>
            {selectedFile && (
              <p className="text-sm text-gray-500">
                Archivo seleccionado: {selectedFile.name}
              </p>
            )}
          </div>

          {/* Preview Results */}
          {previewData && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-lg">Resultados de Previsualización</h3>
              
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-700">{previewData.new_count}</div>
                  <div className="text-sm text-green-600">Nuevos</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-blue-700">{previewData.existing_count}</div>
                  <div className="text-sm text-blue-600">Existentes</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-red-700">{previewData.error_count}</div>
                  <div className="text-sm text-red-600">Errores</div>
                </div>
              </div>

              {/* Warnings */}
              {previewData.warnings && previewData.warnings.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-900">Advertencias</p>
                      {previewData.warnings.map((w, i) => (
                        <p key={i} className="text-sm text-amber-700">{w.message}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Preview Table */}
              {(previewData.new_mentors.length > 0 || previewData.existing_mentors.length > 0 || previewData.errors.length > 0) && (
                <div className="max-h-64 overflow-y-auto border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Fila</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead className="w-24">Estado</TableHead>
                        <TableHead>Detalle</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.new_mentors.map((m) => (
                        <TableRow key={m.row}>
                          <TableCell>{m.row}</TableCell>
                          <TableCell className="font-mono text-sm">{m.slug}</TableCell>
                          <TableCell>{m.first_name} {m.last_name}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">Nuevo</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {m.links_count} enlaces
                          </TableCell>
                        </TableRow>
                      ))}
                      {previewData.existing_mentors.map((m) => (
                        <TableRow key={m.row}>
                          <TableCell>{m.row}</TableCell>
                          <TableCell className="font-mono text-sm">{m.slug}</TableCell>
                          <TableCell>{m.first_name} {m.last_name}</TableCell>
                          <TableCell>
                            <Badge className="bg-blue-100 text-blue-800">Existente</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            Actual: {m.current_name}
                          </TableCell>
                        </TableRow>
                      ))}
                      {previewData.errors.map((e, i) => (
                        <TableRow key={`error-${i}`}>
                          <TableCell>{e.row}</TableCell>
                          <TableCell className="font-mono text-sm">{e.slug || '-'}</TableCell>
                          <TableCell>{e.first_name} {e.last_name}</TableCell>
                          <TableCell>
                            <Badge variant="destructive">Error</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-red-600">
                            {e.error}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Import Options */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Opciones de Importación</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label htmlFor="create_new">Crear nuevos</Label>
                      <p className="text-xs text-gray-500">Crear mentores que no existen</p>
                    </div>
                    <Switch
                      id="create_new"
                      checked={importOptions.create_new}
                      onCheckedChange={(checked) => 
                        setImportOptions(prev => ({ ...prev, create_new: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label htmlFor="update_existing">Actualizar existentes</Label>
                      <p className="text-xs text-gray-500">Actualizar mentores existentes</p>
                    </div>
                    <Switch
                      id="update_existing"
                      checked={importOptions.update_existing}
                      onCheckedChange={(checked) => 
                        setImportOptions(prev => ({ ...prev, update_existing: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label htmlFor="overwrite_links">Sobrescribir enlaces</Label>
                      <p className="text-xs text-gray-500">Reemplazar enlaces existentes</p>
                    </div>
                    <Switch
                      id="overwrite_links"
                      checked={importOptions.overwrite_links}
                      onCheckedChange={(checked) => 
                        setImportOptions(prev => ({ ...prev, overwrite_links: checked }))
                      }
                    />
                  </div>
                </div>

                {/* Import Button */}
                <Button
                  onClick={executeImport}
                  disabled={importing || previewData.error_count === previewData.total_rows}
                  className="w-full mt-4 bg-[#7c3aed] hover:bg-purple-700"
                >
                  {importing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  Ejecutar Importación
                </Button>
              </div>
            </div>
          )}

          {/* Import Results */}
          {importResults && (
            <div className="border-t pt-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-green-900">Importación Completada</h4>
                    <div className="mt-2 grid grid-cols-4 gap-4">
                      <div>
                        <span className="text-2xl font-bold text-green-700">{importResults.created}</span>
                        <p className="text-xs text-green-600">Creados</p>
                      </div>
                      <div>
                        <span className="text-2xl font-bold text-blue-700">{importResults.updated}</span>
                        <p className="text-xs text-blue-600">Actualizados</p>
                      </div>
                      <div>
                        <span className="text-2xl font-bold text-gray-700">{importResults.skipped}</span>
                        <p className="text-xs text-gray-600">Omitidos</p>
                      </div>
                      <div>
                        <span className="text-2xl font-bold text-red-700">{importResults.errors?.length || 0}</span>
                        <p className="text-xs text-red-600">Errores</p>
                      </div>
                    </div>
                    
                    {importResults.warnings && importResults.warnings.length > 0 && (
                      <div className="mt-3 text-sm text-amber-700">
                        <p className="font-medium">Advertencias:</p>
                        {importResults.warnings.slice(0, 5).map((w, i) => (
                          <p key={i}>• {w.warning}</p>
                        ))}
                        {importResults.warnings.length > 5 && (
                          <p>... y {importResults.warnings.length - 5} más</p>
                        )}
                      </div>
                    )}
                    
                    {importResults.errors && importResults.errors.length > 0 && (
                      <div className="mt-3 text-sm text-red-700">
                        <p className="font-medium">Errores:</p>
                        {importResults.errors.slice(0, 5).map((e, i) => (
                          <p key={i}>• Fila {e.row}: {e.error}</p>
                        ))}
                        {importResults.errors.length > 5 && (
                          <p>... y {importResults.errors.length - 5} más</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">Notas importantes:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>Los datos se importan SOLO para la campaña "{selectedCampaign?.name}"</li>
              <li>Las columnas <code className="bg-blue-100 px-1 rounded">action:*</code> de otras campañas serán ignoradas</li>
              <li>Con "Sobrescribir enlaces" desactivado, solo se agregan enlaces nuevos</li>
              <li>La previsualización es obligatoria antes de importar</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSVPage;
