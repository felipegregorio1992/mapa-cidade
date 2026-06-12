'use client';

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { categoryLabels } from '@/data/spots';
import { Category } from '@/types';
import ImageUploader from '@/components/ui/ImageUploader';

const LocationPicker = dynamic(() => import('@/components/map/LocationPicker'), { ssr: false });

export default function CadastrarPage() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '' as Category | '',
    address: '',
    cep: '',
    latitude: '',
    longitude: '',
    openingHours: '',
    operatingDays: '',
    phone: '',
    website: '',
    instagram: '',
    facebook: '',
    observations: '',
    images: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSending(true);

    try {
      const payload = {
        name: form.name,
        description: form.description,
        category: form.category,
        address: form.address,
        cep: form.cep || '24900-000',
        latitude: parseFloat(form.latitude) || -22.919,
        longitude: parseFloat(form.longitude) || -42.82,
        openingHours: form.openingHours || 'Não informado',
        operatingDays: form.operatingDays
          ? form.operatingDays.split(',').map((d) => d.trim())
          : [],
        phones: form.phone ? [form.phone] : [],
        socialMedia: {
          instagram: form.instagram || undefined,
          facebook: form.facebook || undefined,
        },
        website: form.website || undefined,
        observations: form.observations || undefined,
        images: form.images,
        featured: false,
        rating: 0,
        totalReviews: 0,
        status: 'pending',
      };

      const res = await fetch('/api/spots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao enviar');
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar sugestão');
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Sugestão Enviada!</h1>
        <p className="mt-3 text-gray-500">
          Sua sugestão foi recebida e será analisada pela equipe administrativa.
        </p>
        <button
          onClick={() => { setSubmitted(false); setForm({ name: '', description: '', category: '', address: '', cep: '', latitude: '', longitude: '', openingHours: '', operatingDays: '', phone: '', website: '', instagram: '', facebook: '', observations: '', images: [] }); }}
          className="mt-6 px-5 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-colors"
        >
          Cadastrar outro local
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Cadastrar Ponto Turístico</h1>
        <p className="mt-2 text-gray-500">
          Sugira um novo local turístico. Sua sugestão passará por aprovação do admin.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label>Nome do Local *</Label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Praia do Sol" className="input-field" />
            </div>
            <div className="sm:col-span-2">
              <Label>Descrição *</Label>
              <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descreva o local..." className="input-field resize-none" />
            </div>
            <div>
              <Label>Categoria *</Label>
              <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })} className="input-field">
                <option value="">Selecione...</option>
                {(Object.entries(categoryLabels) as [string, string][]).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </Section>

        <Section title="Endereço">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label>Endereço Completo *</Label>
              <input type="text" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Rua, número, bairro" className="input-field" />
            </div>
            <div className="sm:col-span-2">
              <Label>Selecionar no Mapa</Label>
              <LocationPicker
                latitude={parseFloat(form.latitude) || -22.919}
                longitude={parseFloat(form.longitude) || -42.82}
                onLocationSelect={(lat, lng, address) => {
                  setForm((prev) => ({
                    ...prev,
                    latitude: lat.toFixed(6),
                    longitude: lng.toFixed(6),
                    ...(address ? { address } : {}),
                  }));
                }}
              />
            </div>
            <div>
              <Label>CEP</Label>
              <input type="text" value={form.cep} onChange={(e) => setForm({ ...form, cep: e.target.value })} placeholder="00000-000" className="input-field" />
            </div>
            <div>
              <Label>Latitude</Label>
              <input type="text" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} placeholder="-22.9190" className="input-field" />
            </div>
            <div>
              <Label>Longitude</Label>
              <input type="text" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} placeholder="-42.8200" className="input-field" />
            </div>
          </div>
        </Section>

        <Section title="Funcionamento">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Horário de Funcionamento</Label>
              <input type="text" value={form.openingHours} onChange={(e) => setForm({ ...form, openingHours: e.target.value })} placeholder="Ex: 08:00 - 18:00" className="input-field" />
            </div>
            <div>
              <Label>Dias de Funcionamento</Label>
              <input type="text" value={form.operatingDays} onChange={(e) => setForm({ ...form, operatingDays: e.target.value })} placeholder="Ex: Segunda, Terça, Quarta" className="input-field" />
            </div>
          </div>
        </Section>

        <Section title="Contato">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Telefone</Label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(00) 0000-0000" className="input-field" />
            </div>
            <div>
              <Label>Site Oficial</Label>
              <input type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://..." className="input-field" />
            </div>
            <div>
              <Label>Instagram</Label>
              <input type="text" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} placeholder="@usuario" className="input-field" />
            </div>
            <div>
              <Label>Facebook</Label>
              <input type="text" value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} placeholder="pagina" className="input-field" />
            </div>
          </div>
        </Section>

        <Section title="Observações">
          <textarea rows={3} value={form.observations} onChange={(e) => setForm({ ...form, observations: e.target.value })} placeholder="Informações adicionais, dicas para visitantes..." className="input-field resize-none" />
        </Section>

        <Section title="Fotos">
          <ImageUploader
            images={form.images}
            onChange={(imgs) => setForm({ ...form, images: imgs })}
          />
        </Section>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={sending}
            className="flex-1 py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 disabled:opacity-50 transition-colors"
          >
            {sending ? 'Enviando...' : 'Enviar Sugestão'}
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center">
          * Campos obrigatórios. Sua sugestão será revisada antes de ser publicada.
        </p>
      </form>

      <style jsx>{`
        .input-field {
          width: 100%;
          padding: 0.625rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s;
        }
        .input-field:focus {
          border-color: transparent;
          box-shadow: 0 0 0 2px #14b8a6;
        }
      `}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>;
}
