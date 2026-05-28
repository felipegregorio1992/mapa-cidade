'use client';

import { useState } from 'react';
import {
  LayoutDashboard,
  MapPin,
  Users,
  BarChart3,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  CheckCircle,
  XCircle,
  TrendingUp,
} from 'lucide-react';
import { touristSpots } from '@/data/spots';
import { categoryLabels, categoryColors } from '@/data/spots';

type Tab = 'dashboard' | 'spots' | 'users' | 'reports' | 'settings';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
        <p className="mt-2 text-gray-500">Gerencie o sistema de turismo educacional</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-8 overflow-x-auto">
        <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" />
        <TabButton active={activeTab === 'spots'} onClick={() => setActiveTab('spots')} icon={<MapPin className="w-4 h-4" />} label="Locais" />
        <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users className="w-4 h-4" />} label="Usuários" />
        <TabButton active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} icon={<BarChart3 className="w-4 h-4" />} label="Relatórios" />
        <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings className="w-4 h-4" />} label="Configurações" />
      </div>

      {/* Content */}
      {activeTab === 'dashboard' && <DashboardTab />}
      {activeTab === 'spots' && <SpotsTab />}
      {activeTab === 'users' && <UsersTab />}
      {activeTab === 'reports' && <ReportsTab />}
      {activeTab === 'settings' && <SettingsTab />}
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

function DashboardTab() {
  const stats = [
    { label: 'Total de Locais', value: touristSpots.length, icon: <MapPin className="w-5 h-5" />, color: 'teal' },
    { label: 'Locais Ativos', value: touristSpots.filter((s) => s.status === 'active').length, icon: <CheckCircle className="w-5 h-5" />, color: 'green' },
    { label: 'Avaliações', value: touristSpots.reduce((acc, s) => acc + s.totalReviews, 0), icon: <Star className="w-5 h-5" />, color: 'amber' },
    { label: 'Média Geral', value: (touristSpots.reduce((acc, s) => acc + s.rating, 0) / touristSpots.length).toFixed(1), icon: <TrendingUp className="w-5 h-5" />, color: 'purple' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className={`inline-flex p-2 rounded-lg bg-${stat.color}-50 text-${stat.color}-600 mb-3`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Atividade Recente</h3>
        <div className="space-y-3">
          <ActivityItem text="Novo local cadastrado: Praia do Sol" time="2 horas atrás" type="success" />
          <ActivityItem text="Avaliação recebida no Museu Histórico" time="4 horas atrás" type="info" />
          <ActivityItem text="Sugestão de local pendente de aprovação" time="6 horas atrás" type="warning" />
          <ActivityItem text="Evento 'Festival Cultural' atualizado" time="1 dia atrás" type="info" />
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ text, time, type }: { text: string; time: string; type: string }) {
  const colors = {
    success: 'bg-green-100 text-green-600',
    info: 'bg-blue-100 text-blue-600',
    warning: 'bg-amber-100 text-amber-600',
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
      <div className={`w-2 h-2 rounded-full ${type === 'success' ? 'bg-green-500' : type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 truncate">{text}</p>
        <p className="text-xs text-gray-400">{time}</p>
      </div>
    </div>
  );
}

function SpotsTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{touristSpots.length} locais cadastrados</p>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-colors">
          <Plus className="w-4 h-4" />
          Novo Local
        </button>
      </div>

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
              {touristSpots.map((spot) => (
                <tr key={spot.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-teal-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{spot.name}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[200px]">{spot.address}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className="inline-flex px-2 py-0.5 text-xs font-medium text-white rounded-full"
                      style={{ backgroundColor: categoryColors[spot.category] }}
                    >
                      {categoryLabels[spot.category]}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${spot.status === 'active' ? 'text-green-600' : 'text-gray-400'}`}>
                      {spot.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {spot.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm text-gray-700">{spot.rating}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors" aria-label="Editar">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-amber-600 rounded-lg hover:bg-amber-50 transition-colors" aria-label="Visibilidade">
                        {spot.status === 'active' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors" aria-label="Excluir">
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
    </div>
  );
}

function UsersTab() {
  const users = [
    { id: '1', name: 'Admin Principal', email: 'admin@turismoedu.com.br', role: 'admin', status: 'active' },
    { id: '2', name: 'Maria Moderadora', email: 'maria@email.com', role: 'moderator', status: 'active' },
    { id: '3', name: 'João Visitante', email: 'joao@email.com', role: 'user', status: 'active' },
    { id: '4', name: 'Ana Turista', email: 'ana@email.com', role: 'user', status: 'active' },
  ];

  const roleLabels: Record<string, string> = { admin: 'Administrador', moderator: 'Moderador', user: 'Usuário' };
  const roleColors: Record<string, string> = { admin: 'bg-red-100 text-red-700', moderator: 'bg-purple-100 text-purple-700', user: 'bg-gray-100 text-gray-700' };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <p className="text-sm text-gray-500">{users.length} usuários</p>
        <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-colors">
          <Plus className="w-4 h-4" />
          Novo Usuário
        </button>
      </div>
      <div className="divide-y divide-gray-50">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user.name[0]}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${roleColors[user.role]}`}>
              {roleLabels[user.role]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportsTab() {
  const topSpots = [...touristSpots].sort((a, b) => b.totalReviews - a.totalReviews).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Locais Mais Acessados</h3>
        <div className="space-y-3">
          {topSpots.map((spot, index) => (
            <div key={spot.id} className="flex items-center gap-4">
              <span className="text-sm font-bold text-gray-400 w-6">{index + 1}.</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{spot.name}</p>
                <p className="text-xs text-gray-400">{spot.totalReviews} avaliações</p>
              </div>
              <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-full"
                  style={{ width: `${(spot.totalReviews / topSpots[0].totalReviews) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-2">Categorias Populares</h3>
          <div className="space-y-2 mt-4">
            {Object.entries(categoryLabels).slice(0, 5).map(([key, label]) => {
              const count = touristSpots.filter((s) => s.category === key).length;
              return (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: categoryColors[key] }} />
                    <span className="text-sm text-gray-700">{label}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-2">Estatísticas Gerais</h3>
          <div className="space-y-3 mt-4">
            <StatRow label="Total de avaliações" value={touristSpots.reduce((a, s) => a + s.totalReviews, 0).toString()} />
            <StatRow label="Média de avaliação" value={(touristSpots.reduce((a, s) => a + s.rating, 0) / touristSpots.length).toFixed(1)} />
            <StatRow label="Locais em destaque" value={touristSpots.filter((s) => s.featured).length.toString()} />
            <StatRow label="Categorias ativas" value={new Set(touristSpots.map((s) => s.category)).size.toString()} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Configurações Gerais</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Nome do Sistema</label>
            <input
              type="text"
              defaultValue="TurismoEdu"
              className="mt-1 w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Cidade</label>
            <input
              type="text"
              defaultValue="Maricá, RJ"
              className="mt-1 w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Coordenadas Padrão (Lat, Lng)</label>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <input
                type="text"
                defaultValue="-22.9190"
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="text"
                defaultValue="-42.8200"
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
          <button className="px-5 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-colors">
            Salvar Configurações
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Sistema Colaborativo</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
            <span className="text-sm text-gray-700">Permitir sugestões de novos locais</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
            <span className="text-sm text-gray-700">Permitir avaliações de usuários</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
            <span className="text-sm text-gray-700">Aprovação obrigatória para novos cadastros</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
            <span className="text-sm text-gray-700">Permitir upload de fotos por usuários</span>
          </label>
        </div>
      </div>
    </div>
  );
}
