import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Card } from '../../components/ui/card';
import { 
  Plus, 
  Search, 
  Edit, 
  Link as LinkIcon,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { Toaster } from '../../components/ui/toaster';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MentorsListPage = () => {
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchMentors();
  }, []);

  useEffect(() => {
    filterMentors();
  }, [searchTerm, filterActive, mentors]);

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

    // Filter by active status
    if (filterActive === 'active') {
      filtered = filtered.filter(m => m.active);
    } else if (filterActive === 'inactive') {
      filtered = filtered.filter(m => !m.active);
    }

    // Filter by search term
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
    const url = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Copiado',
      description: 'URL pública copiada al portapapeles'
    });
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Mentores</h1>
          <p className="text-gray-600 mt-1">{mentors.length} mentores en total</p>
        </div>
        <Button
          onClick={() => navigate('/admin/mentor/new')}
          className="bg-[#7c3aed] hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Mentor
        </Button>
      </div>

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
                  <p className="text-sm text-gray-500 truncate">/{mentor.slug}</p>
                  {mentor.mentor_group && (
                    <Badge variant="secondary" className="mt-1">
                      {mentor.mentor_group}
                    </Badge>
                  )}
                  <div className="mt-2">
                    <Badge variant={mentor.active ? "default" : "outline"}>
                      {mentor.active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={() => navigate(`/admin/mentor/${mentor.id}`)}
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  onClick={() => copyPublicUrl(mentor.slug)}
                  size="sm"
                  variant="outline"
                >
                  <LinkIcon className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => toggleActive(mentor)}
                  size="sm"
                  variant="outline"
                >
                  {mentor.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentorsListPage;