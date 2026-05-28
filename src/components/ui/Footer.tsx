'use client';

import Link from 'next/link';
import { Compass, MapPin, Mail, Phone, Globe, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">TurismoEdu</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Plataforma de turismo educacional que conecta moradores e visitantes aos principais
              pontos turísticos da cidade.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-gray-800 hover:bg-teal-600 rounded-lg transition-colors" aria-label="Instagram">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-teal-600 rounded-lg transition-colors" aria-label="Facebook">
                <Heart className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navegação</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm hover:text-teal-400 transition-colors">Início</Link></li>
              <li><Link href="/explorar" className="text-sm hover:text-teal-400 transition-colors">Explorar</Link></li>
              <li><Link href="/mapa" className="text-sm hover:text-teal-400 transition-colors">Mapa Interativo</Link></li>
              <li><Link href="/roteiro" className="text-sm hover:text-teal-400 transition-colors">Roteiro IA</Link></li>
              <li><Link href="/eventos" className="text-sm hover:text-teal-400 transition-colors">Eventos</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categorias</h3>
            <ul className="space-y-2">
              <li><Link href="/explorar?cat=praia" className="text-sm hover:text-teal-400 transition-colors">Praias</Link></li>
              <li><Link href="/explorar?cat=cultural" className="text-sm hover:text-teal-400 transition-colors">Cultural</Link></li>
              <li><Link href="/explorar?cat=historico" className="text-sm hover:text-teal-400 transition-colors">Histórico</Link></li>
              <li><Link href="/explorar?cat=ecologico" className="text-sm hover:text-teal-400 transition-colors">Ecológico</Link></li>
              <li><Link href="/explorar?cat=gastronomico" className="text-sm hover:text-teal-400 transition-colors">Gastronômico</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-teal-400" />
                Maricá, RJ - Brasil
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-teal-400" />
                (21) 2637-0100
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-teal-400" />
                contato@turismoedu.marica.rj.gov.br
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2026 TurismoEdu. Todos os direitos reservados.
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link href="#" className="hover:text-teal-400 transition-colors">Privacidade</Link>
            <Link href="#" className="hover:text-teal-400 transition-colors">Termos</Link>
            <Link href="#" className="hover:text-teal-400 transition-colors">Acessibilidade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
