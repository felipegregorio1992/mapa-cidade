'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, MapPin, Search, Heart, User, Compass } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function Header() {
  const { isMobileMenuOpen, toggleMobileMenu, favorites } = useStore();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-teal-700 to-emerald-600 bg-clip-text text-transparent hidden sm:block">
              TurismoEdu
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
            >
              Início
            </Link>
            <Link
              href="/explorar"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
            >
              Explorar
            </Link>
            <Link
              href="/mapa"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
            >
              Mapa
            </Link>
            <Link
              href="/roteiro"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
            >
              Roteiro IA
            </Link>
            <Link
              href="/eventos"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
            >
              Eventos
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link
              href="/favoritos"
              className="relative p-2 text-gray-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
              aria-label="Favoritos"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link
              href="/admin"
              className="hidden sm:flex p-2 text-gray-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
              aria-label="Painel Admin"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="pb-4 animate-fade-in">
            <SearchBar onClose={() => setSearchOpen(false)} />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in">
          <nav className="px-4 py-3 space-y-1">
            <MobileNavLink href="/" icon={<Compass className="w-4 h-4" />} label="Início" />
            <MobileNavLink href="/explorar" icon={<Search className="w-4 h-4" />} label="Explorar" />
            <MobileNavLink href="/mapa" icon={<MapPin className="w-4 h-4" />} label="Mapa" />
            <MobileNavLink href="/roteiro" icon={<Compass className="w-4 h-4" />} label="Roteiro IA" />
            <MobileNavLink href="/eventos" icon={<Heart className="w-4 h-4" />} label="Eventos" />
            <MobileNavLink href="/admin" icon={<User className="w-4 h-4" />} label="Admin" />
          </nav>
        </div>
      )}
    </header>
  );
}

function SearchBar({ onClose }: { onClose: () => void }) {
  const { setSearchQuery } = useStore();

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        placeholder="Buscar pontos turísticos, categorias..."
        className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        onChange={(e) => setSearchQuery(e.target.value)}
        autoFocus
      />
      <button
        onClick={onClose}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function MobileNavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const { toggleMobileMenu } = useStore();

  return (
    <Link
      href={href}
      onClick={toggleMobileMenu}
      className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
    >
      {icon}
      {label}
    </Link>
  );
}
