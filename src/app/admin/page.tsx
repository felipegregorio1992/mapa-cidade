'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  LayoutDashboard,
  MapPin,
  Calendar,
  Users,
  ClipboardCheck,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  TrendingUp,
  Clock,
  X,
  Save,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { categoryLabels, categoryColors } from '@/data/spots';
import { Category } from '@/types';

const LocationPicker = dynamic(() => import('@/components/map/LocationPicker'), { ssr: false });
import ImageUploader from '@/components/ui/ImageUploader';

type Tab = 'dashboard' | 'spots' | 'events' | 'pending' | 'users';

interface SpotData {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  category: Category;
  address: string;
  cep: string;
  latitude: number;
  longitude: number;
  openingHours: string;
  operatingDays: string[];
  phones: string[];
  socialMedia: { instagram?: string; facebook?: string; twitter?: string };
  website?: string;
  observations?: string;
  images: string[];
  status: 'active' | 'inactive' | 'pending';
  featured: boolean;
  rating: number;
  totalReviews: number;
  createdAt?: string;
  updatedAt?: string;
}

interface EventData {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  location: string;
  spotId?: string;
  image?: string;
  category: Category;
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (data.user?.role === 'admin' || data.user?.role === 'moderator') {
          setAuthorized(true);
        } else {
          router.push('/login');
        }
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
        <p className="mt-2 text-gray-500">Gerencie locais, eventos e solicitações</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-8 overflow-x-auto">
        <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" />
        <TabButton active={activeTab === 'spots'} onClick={() => setActiveTab('spots')} icon={<MapPin className="w-4 h-4" />} label="Locais" />
        <TabButton active={activeTab === 'events'} onClick={() => setActiveTab('events')} icon={<Calendar className="w-4 h-4" />} label="Eventos" />
        <TabButton active={activeTab === 'pending'} onClick={() => setActiveTab('pending')} icon={<ClipboardCheck className="w-4 h-4" />} label="Solicitações" />
        <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users className="w-4 h-4" />} label="Usuários" />
      </div>

      {activeTab === 'dashboard' && <DashboardTab />}
      {activeTab === 'spots' && <SpotsTab />}
      {activeTab === 'events' && <EventsTab />}
      {activeTab === 'pending' && <PendingTab />}
      {activeTab === 'users' && <UsersTab />}
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
        active ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

// ============ DASHBOARD ============
function DashboardTab() {
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, events: 0 });

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/spots').then((r) => r.json()),
      fetch('/api/admin/events').then((r) => r.json()),
    ]).then(([spots, events]) => {
      if (Array.isArray(spots) && Array.isArray(events)) {
        setStats({
          total: spots.length,
          active: spots.filter((s: SpotData) => s.status === 'active').length,
          pending: spots.filter((s: SpotData) => s.status === 'pending').length,
          events: events.length,
        });
      }
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<MapPin className="w-5 h-5" />} label="Total de Locais" value={stats.total} color="teal" />
        <StatCard icon={<CheckCircle className="w-5 h-5" />} label="Locais Ativos" value={stats.active} color="green" />
        <StatCard icon={<Clock className="w-5 h-5" />} label="Pendentes" value={stats.pending} color="amber" />
        <StatCard icon={<Calendar className="w-5 h-5" />} label="Eventos" value={stats.events} color="purple" />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  const bgMap: Record<string, string> = { teal: 'bg-teal-50 text-teal-600', green: 'bg-green-50 text-green-600', amber: 'bg-amber-50 text-amber-600', purple: 'bg-purple-50 text-purple-600' };
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      <div className={`inline-flex p-2 rounded-lg ${bgMap[color]} mb-3`}>{icon}</div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

// ============ SPOTS TAB ============
function SpotsTab() {
  const [spots, setSpots] = useState<SpotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSpot, setEditingSpot] = useState<SpotData | null>(null);

  const fetchSpots = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/spots')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setSpots(data); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchSpots(); }, [fetchSpots]);

  const handleDelete = async (spot: SpotData) => {
    if (!confirm(`Excluir "${spot.name}"?`)) return;
    const id = spot._id || spot.id;
    await fetch(`/api/admin/spots/${id}`, { method: 'DELETE' });
    fetchSpots();
  };

  const handleToggleStatus = async (spot: SpotData) => {
    const id = spot._id || spot.id;
    const newStatus = spot.status === 'active' ? 'inactive' : 'active';
    await fetch(`/api/admin/spots/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchSpots();
  };

  const activeSpots = spots.filter((s) => s.status !== 'pending');

  if (showForm || editingSpot) {
    return (
      <SpotForm
        spot={editingSpot}
        onClose={() => { setShowForm(false); setEditingSpot(null); }}
        onSaved={() => { setShowForm(false); setEditingSpot(null); fetchSpots(); }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{activeSpots.length} locais cadastrados</p>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Local
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-teal-600 animate-spin" /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Local</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Categoria</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Avaliação</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody>
                {activeSpots.map((spot) => (
                  <tr key={spot._id || spot.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-gray-900">{spot.name}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[200px]">{spot.address}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex px-2 py-0.5 text-xs font-medium text-white rounded-full" style={{ backgroundColor: categoryColors[spot.category] || '#666' }}>
                        {categoryLabels[spot.category] || spot.category}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={() => handleToggleStatus(spot)} className={`inline-flex items-center gap-1 text-xs font-medium ${spot.status === 'active' ? 'text-green-600' : 'text-gray-400'}`}>
                        {spot.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {spot.status === 'active' ? 'Ativo' : 'Inativo'}
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm text-gray-700">{spot.rating}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setEditingSpot(spot)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50" aria-label="Editar">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(spot)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50" aria-label="Excluir">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ SPOT FORM ============
function SpotForm({ spot, onClose, onSaved }: { spot: SpotData | null; onClose: () => void; onSaved: () => void }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<SpotData>>({
    name: spot?.name || '',
    description: spot?.description || '',
    category: spot?.category || 'praia',
    address: spot?.address || '',
    cep: spot?.cep || '',
    latitude: spot?.latitude || -22.919,
    longitude: spot?.longitude || -42.82,
    openingHours: spot?.openingHours || '',
    operatingDays: spot?.operatingDays || [],
    phones: spot?.phones || [],
    socialMedia: spot?.socialMedia || {},
    website: spot?.website || '',
    observations: spot?.observations || '',
    images: spot?.images || [],
    status: spot?.status || 'active',
    featured: spot?.featured || false,
  });

  const handleSave = async () => {
    if (!form.name || !form.description || !form.address) {
      alert('Preencha nome, descrição e endereço');
      return;
    }
    setSaving(true);
    const id = spot?._id || spot?.id;
    const url = id ? `/api/admin/spots/${id}` : '/api/admin/spots';
    const method = id ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    onSaved();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">{spot ? 'Editar Local' : 'Novo Local'}</h2>
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
              {Object.entries(categoryLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'active' | 'inactive' })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Endereço *</label>
            <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
            <input type="text" value={form.cep} onChange={(e) => setForm({ ...form, cep: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Horário de Funcionamento</label>
            <input type="text" value={form.openingHours} onChange={(e) => setForm({ ...form, openingHours: e.target.value })} placeholder="Ex: 08:00 - 18:00" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Localização no Mapa</label>
            <LocationPicker
              latitude={form.latitude || -22.919}
              longitude={form.longitude || -42.82}
              onLocationSelect={(lat, lng, address) => {
                setForm((prev) => ({
                  ...prev,
                  latitude: lat,
                  longitude: lng,
                  ...(address ? { address } : {}),
                }));
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
            <input type="number" step="any" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: parseFloat(e.target.value) })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
            <input type="number" step="any" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: parseFloat(e.target.value) })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mt-6">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
              Destaque na home
            </label>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
            <textarea rows={2} value={form.observations} onChange={(e) => setForm({ ...form, observations: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Fotos</label>
            <ImageUploader
              images={form.images || []}
              onChange={(imgs) => setForm({ ...form, images: imgs })}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button onClick={onClose} className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50">
            Cancelar
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {spot ? 'Salvar Alterações' : 'Criar Local'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ EVENTS TAB ============
function EventsTab() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);

  const fetchEvents = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/events')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setEvents(data); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const handleDelete = async (ev: EventData) => {
    if (!confirm(`Excluir evento "${ev.title}"?`)) return;
    await fetch(`/api/admin/events/${ev._id || ev.id}`, { method: 'DELETE' });
    fetchEvents();
  };

  if (showForm || editingEvent) {
    return (
      <EventForm
        event={editingEvent}
        onClose={() => { setShowForm(false); setEditingEvent(null); }}
        onSaved={() => { setShowForm(false); setEditingEvent(null); fetchEvents(); }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{events.length} eventos</p>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-colors">
          <Plus className="w-4 h-4" />
          Novo Evento
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-teal-600 animate-spin" /></div>
      ) : (
        <div className="space-y-3">
          {events.map((ev) => (
            <div key={ev._id || ev.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900">{ev.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{ev.location}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {ev.date}{ev.endDate ? ` → ${ev.endDate}` : ''}
                  </span>
                  <span className="inline-flex px-2 py-0.5 text-xs font-medium text-white rounded-full" style={{ backgroundColor: categoryColors[ev.category] || '#666' }}>
                    {categoryLabels[ev.category] || ev.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setEditingEvent(ev)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50" aria-label="Editar">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(ev)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50" aria-label="Excluir">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <p className="text-center text-gray-400 py-8">Nenhum evento cadastrado</p>
          )}
        </div>
      )}
    </div>
  );
}

// ============ EVENT FORM ============
function EventForm({ event, onClose, onSaved }: { event: EventData | null; onClose: () => void; onSaved: () => void }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date || '',
    endDate: event?.endDate || '',
    location: event?.location || '',
    category: event?.category || 'cultural' as Category,
    image: event?.image || '',
  });

  const handleSave = async () => {
    if (!form.title || !form.date || !form.location) {
      alert('Preencha título, data e local');
      return;
    }
    setSaving(true);
    const id = event?._id || event?.id;
    const url = id ? `/api/admin/events/${id}` : '/api/admin/events';
    const method = id ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    onSaved();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">{event ? 'Editar Evento' : 'Novo Evento'}</h2>
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Início *</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
            <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Local *</label>
            <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
              {Object.entries(categoryLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button onClick={onClose} className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {event ? 'Salvar Alterações' : 'Criar Evento'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ PENDING (SOLICITAÇÕES) ============
function PendingTab() {
  const [pending, setPending] = useState<SpotData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/spots')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPending(data.filter((s: SpotData) => s.status === 'pending'));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchPending(); }, [fetchPending]);

  const handleApprove = async (spot: SpotData) => {
    const id = spot._id || spot.id;
    await fetch(`/api/admin/spots/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'active' }),
    });
    fetchPending();
  };

  const handleReject = async (spot: SpotData) => {
    if (!confirm(`Rejeitar "${spot.name}"? Isso removerá a solicitação.`)) return;
    const id = spot._id || spot.id;
    await fetch(`/api/admin/spots/${id}`, { method: 'DELETE' });
    fetchPending();
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-teal-600 animate-spin" /></div>;
  }

  if (pending.length === 0) {
    return (
      <div className="text-center py-16">
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
        <p className="text-gray-500">Nenhuma solicitação pendente</p>
        <p className="text-sm text-gray-400 mt-1">Todas as sugestões foram revisadas</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
        <AlertTriangle className="w-4 h-4 text-amber-600" />
        <p className="text-sm text-amber-700">{pending.length} solicitação(ões) aguardando aprovação</p>
      </div>

      {pending.map((spot) => (
        <div key={spot._id || spot.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-gray-900">{spot.name}</h3>
                <span className="inline-flex px-2 py-0.5 text-xs font-medium text-white rounded-full" style={{ backgroundColor: categoryColors[spot.category] || '#666' }}>
                  {categoryLabels[spot.category] || spot.category}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{spot.description}</p>
              <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-400">
                <span>📍 {spot.address}</span>
                {spot.openingHours && <span>🕐 {spot.openingHours}</span>}
                {spot.createdAt && <span>📅 {new Date(spot.createdAt).toLocaleDateString('pt-BR')}</span>}
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => handleApprove(spot)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Aprovar
            </button>
            <button
              onClick={() => handleReject(spot)}
              className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-xl hover:bg-red-50 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Rejeitar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============ USERS TAB ============
function UsersTab() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/users')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setUsers(data); })
      .finally(() => setLoading(false));
  }, []);

  const roleLabels: Record<string, string> = { admin: 'Administrador', moderator: 'Moderador', user: 'Usuário' };
  const roleColors: Record<string, string> = { admin: 'bg-red-100 text-red-700', moderator: 'bg-purple-100 text-purple-700', user: 'bg-gray-100 text-gray-700' };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-teal-600 animate-spin" /></div>;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-5 border-b border-gray-100">
        <p className="text-sm text-gray-500">{users.length} usuários cadastrados</p>
      </div>
      <div className="divide-y divide-gray-50">
        {users.map((user) => (
          <div key={user._id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user.name[0]}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : ''}
              </span>
              <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${roleColors[user.role] || roleColors.user}`}>
                {roleLabels[user.role] || user.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
