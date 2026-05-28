'use client';

import { useState } from 'react';
import {
  Upload,
  CheckCircle,
} from 'lucide-react';
import { categoryLabels } from '@/data/spots';
import { Category } from '@/types';

export default function CadastrarPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Sugestão Enviada!</h1>
        <p className="mt-3 text-gray-500">
          Sua sugestão foi recebida e será analisada pela equipe administrativa.
          Você receberá uma notificação quando for aprovada.
        </p>
        <button
          onClick={() => setSubmitted(false)}
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
          Sugira um novo local turístico para a plataforma. Sua sugestão passará por aprovação.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="space-y-6"
      >
        {/* Basic Info */}
        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label>Nome do Local *</Label>
              <input
                type="text"
                required
                placeholder="Ex: Praia do Sol"
                className="input-field"
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Descrição *</Label>
              <textarea
                required
                rows={4}
                placeholder="Descreva o local, sua importância e o que os visitantes podem encontrar..."
                className="input-field resize-none"
              />
            </div>
            <div>
              <Label>Categoria *</Label>
              <select required className="input-field">
                <option value="">Selecione...</option>
                {(Object.entries(categoryLabels) as [Category, string][]).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Status</Label>
              <select className="input-field">
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
          </div>
        </Section>

        {/* Address */}
        <Section title="Endereço">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label>Endereço Completo *</Label>
              <input type="text" required placeholder="Rua, número, bairro" className="input-field" />
            </div>
            <div>
              <Label>CEP</Label>
              <input type="text" placeholder="00000-000" className="input-field" />
            </div>
            <div className="sm:col-span-2 grid grid-cols-2 gap-4">
              <div>
                <Label>Latitude</Label>
                <input type="text" placeholder="-20.3155" className="input-field" />
              </div>
              <div>
                <Label>Longitude</Label>
                <input type="text" placeholder="-40.3200" className="input-field" />
              </div>
            </div>
          </div>
        </Section>

        {/* Operating Hours */}
        <Section title="Funcionamento">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Horário de Funcionamento</Label>
              <input type="text" placeholder="Ex: 08:00 - 18:00" className="input-field" />
            </div>
            <div>
              <Label>Dias de Funcionamento</Label>
              <input type="text" placeholder="Ex: Segunda a Sábado" className="input-field" />
            </div>
          </div>
        </Section>

        {/* Contact */}
        <Section title="Contato">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Telefone</Label>
              <input type="tel" placeholder="(00) 0000-0000" className="input-field" />
            </div>
            <div>
              <Label>Site Oficial</Label>
              <input type="url" placeholder="https://..." className="input-field" />
            </div>
            <div>
              <Label>Instagram</Label>
              <input type="text" placeholder="@usuario" className="input-field" />
            </div>
            <div>
              <Label>Facebook</Label>
              <input type="text" placeholder="pagina" className="input-field" />
            </div>
          </div>
        </Section>

        {/* Media */}
        <Section title="Mídia">
          <div>
            <Label>Imagens</Label>
            <div className="mt-1 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-teal-300 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Arraste imagens ou clique para selecionar</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG até 5MB</p>
            </div>
          </div>
        </Section>

        {/* Observations */}
        <Section title="Observações">
          <textarea
            rows={3}
            placeholder="Informações adicionais, dicas para visitantes..."
            className="input-field resize-none"
          />
        </Section>

        {/* Submit */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors"
          >
            Enviar Sugestão
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
