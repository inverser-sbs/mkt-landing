import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { Switch } from '../../components/ui/switch';
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
  Loader2,
  ArrowLeft,
  Save,
  Trash2,
  Upload,
  User,
  Camera,
  X,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { Toaster } from '../../components/ui/toaster';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Allowed file types and max size
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const MentorFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const isEditing = !!id;

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    slug: '',
    active: true,
    mentor_group: '',
    photo_url: ''
  });
  const [formErrors, setFormErrors] = useState({});
  
  // Photo preview for new upload
  const [photoPreview, setPhotoPreview] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);

  // Fetch mentor data if editing
  useEffect(() => {
    if (isEditing) {
      fetchMentor();
    }
  }, [id]);

  const fetchMentor = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/mentors/${id}`);
      const mentor = response.data;
      setFormData({
        first_name: mentor.first_name || '',
        last_name: mentor.last_name || '',
        email: mentor.email || '',
        slug: mentor.slug || '',
        active: mentor.active ?? true,
        mentor_group: mentor.mentor_group || '',
        photo_url: mentor.photo_url || ''
      });
    } catch (error) {
      console.error('Error fetching mentor:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar el mentor',
        variant: 'destructive'
      });
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.first_name.trim()) {
      errors.first_name = 'El nombre es requerido';
    }
    
    if (!formData.last_name.trim()) {
      errors.last_name = 'El apellido es requerido';
    }
    
    if (!formData.slug.trim()) {
      errors.slug = 'El slug es requerido';
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug)) {
      errors.slug = 'Solo letras minúsculas, números y guiones';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email inválido';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const generateSlug = () => {
    const slug = `${formData.first_name}-${formData.last_name}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    handleInputChange('slug', slug);
  };

  // ==================== PHOTO HANDLING ====================
  
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        title: 'Tipo de archivo no válido',
        description: 'Solo se permiten imágenes JPG, PNG o WebP',
        variant: 'destructive'
      });
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'Archivo muy grande',
        description: 'El tamaño máximo es 5MB',
        variant: 'destructive'
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target.result);
    };
    reader.readAsDataURL(file);
    setPendingFile(file);
  };

  const clearPhotoPreview = () => {
    setPhotoPreview(null);
    setPendingFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadPhoto = async (mentorId) => {
    if (!pendingFile) return null;

    setUploadingPhoto(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', pendingFile);

      const response = await axios.post(
        `${BACKEND_URL}/api/admin/mentors/${mentorId}/photo`,
        formDataUpload,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      return response.data.photo_url;
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    } finally {
      setUploadingPhoto(false);
    }
  };

  // ==================== FORM SUBMIT ====================

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSaving(true);
    try {
      let mentorId = id;

      // Prepare data (exclude photo_url, it's handled separately)
      const dataToSend = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim() || null,
        slug: formData.slug.trim(),
        active: formData.active,
        mentor_group: formData.mentor_group.trim() || null
      };

      if (isEditing) {
        // Update existing mentor
        await axios.put(`${BACKEND_URL}/api/admin/mentors/${id}`, dataToSend);
      } else {
        // Create new mentor
        const response = await axios.post(`${BACKEND_URL}/api/admin/mentors`, dataToSend);
        mentorId = response.data.id;
      }

      // Upload photo if there's a pending file
      if (pendingFile && mentorId) {
        await uploadPhoto(mentorId);
      }

      toast({
        title: isEditing ? 'Actualizado' : 'Creado',
        description: `Mentor ${isEditing ? 'actualizado' : 'creado'} correctamente`
      });

      navigate('/admin');
    } catch (error) {
      console.error('Error saving mentor:', error);
      const errorMsg = error.response?.data?.detail || 'No se pudo guardar el mentor';
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  // ==================== DELETE ====================

  const handleDelete = async () => {
    try {
      await axios.delete(`${BACKEND_URL}/api/admin/mentors/${id}`);
      toast({
        title: 'Eliminado',
        description: 'Mentor eliminado correctamente'
      });
      navigate('/admin');
    } catch (error) {
      console.error('Error deleting mentor:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el mentor',
        variant: 'destructive'
      });
    } finally {
      setDeleteConfirmOpen(false);
    }
  };

  // ==================== RENDER ====================

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#7c3aed]" />
      </div>
    );
  }

  // Determine which photo to show
  const displayPhoto = photoPreview || formData.photo_url;

  return (
    <div className="max-w-2xl mx-auto">
      <Toaster />
      
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/admin')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            {isEditing ? 'Editar Mentor' : 'Nuevo Mentor'}
          </h1>
          {isEditing && (
            <p className="text-gray-500 text-sm">ID: {id}</p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ==================== PHOTO SECTION ==================== */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Camera className="w-5 h-5 mr-2 text-[#7c3aed]" />
            Foto del Mentor
          </h2>
          
          <div className="flex items-start space-x-6">
            {/* Photo Preview */}
            <div className="flex-shrink-0">
              {displayPhoto ? (
                <div className="relative">
                  <img
                    src={displayPhoto.startsWith('data:') ? displayPhoto : `${BACKEND_URL}${displayPhoto}`}
                    alt="Preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
                  />
                  {photoPreview && (
                    <button
                      type="button"
                      onClick={clearPhotoPreview}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#c4ff0f] to-[#7c3aed] flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
              )}
            </div>

            {/* Upload Controls */}
            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
                id="photo-upload"
              />
              
              <label
                htmlFor="photo-upload"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                {displayPhoto ? 'Cambiar foto' : 'Subir foto'}
              </label>

              <div className="mt-3 space-y-1">
                <p className="text-xs text-gray-500">
                  Formatos permitidos: JPG, PNG, WebP
                </p>
                <p className="text-xs text-gray-500">
                  Tamaño máximo: 5MB
                </p>
              </div>

              {photoPreview && (
                <div className="mt-3 flex items-center text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-md">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>La foto se guardará al hacer clic en &ldquo;Guardar&rdquo;</span>
                </div>
              )}

              {formData.photo_url && !photoPreview && (
                <div className="mt-3 flex items-center text-sm text-green-600 bg-green-50 px-3 py-2 rounded-md">
                  <CheckCircle2 className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>Foto actual guardada</span>
                </div>
              )}
            </div>
          </div>

          <p className="mt-4 text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
            💡 La foto del mentor es <strong>global</strong> — se mostrará en todas las campañas donde participe.
          </p>
        </Card>

        {/* ==================== BASIC INFO ==================== */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-[#7c3aed]" />
            Información Básica
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="first_name">Nombre *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                placeholder="Juan"
                className={formErrors.first_name ? 'border-red-500' : ''}
              />
              {formErrors.first_name && (
                <p className="text-sm text-red-500">{formErrors.first_name}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="last_name">Apellido *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                placeholder="Pérez"
                className={formErrors.last_name ? 'border-red-500' : ''}
              />
              {formErrors.last_name && (
                <p className="text-sm text-red-500">{formErrors.last_name}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2 mt-4">
            <Label htmlFor="email">Email (opcional)</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="juan@ejemplo.com"
              className={formErrors.email ? 'border-red-500' : ''}
            />
            {formErrors.email && (
              <p className="text-sm text-red-500">{formErrors.email}</p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="slug">Slug (URL) *</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={generateSlug}
                disabled={!formData.first_name || !formData.last_name}
                className="text-xs"
              >
                Generar automático
              </Button>
            </div>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value.toLowerCase())}
              placeholder="juan-perez"
              className={`font-mono ${formErrors.slug ? 'border-red-500' : ''}`}
              disabled={isEditing} // Can't change slug when editing
            />
            {formErrors.slug && (
              <p className="text-sm text-red-500">{formErrors.slug}</p>
            )}
            {formData.slug && !formErrors.slug && (
              <p className="text-sm text-gray-500">
                URL: /{'{campaña}'}/{formData.slug}
              </p>
            )}
          </div>

          {/* Group */}
          <div className="space-y-2 mt-4">
            <Label htmlFor="mentor_group">Grupo (opcional)</Label>
            <Input
              id="mentor_group"
              value={formData.mentor_group}
              onChange={(e) => handleInputChange('mentor_group', e.target.value)}
              placeholder="Generación 2024"
            />
            <p className="text-xs text-gray-500">
              Útil para organizar mentores en lotes o generaciones
            </p>
          </div>

          {/* Active */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div>
              <Label htmlFor="active">Estado activo</Label>
              <p className="text-xs text-gray-500">Los mentores inactivos no aparecen en las landings</p>
            </div>
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => handleInputChange('active', checked)}
            />
          </div>
        </Card>

        {/* ==================== ACTIONS ==================== */}
        <div className="flex items-center justify-between pt-4">
          <div>
            {isEditing && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleteConfirmOpen(true)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </Button>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving || uploadingPhoto}
              className="bg-[#7c3aed] hover:bg-purple-700"
            >
              {(saving || uploadingPhoto) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </Button>
          </div>
        </div>
      </form>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar mentor?</AlertDialogTitle>
            <AlertDialogDescription>
              Esto eliminará al mentor &ldquo;{formData.first_name} {formData.last_name}&rdquo; y todos sus enlaces asociados.
              Esta acción no se puede deshacer.
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

export default MentorFormPage;
