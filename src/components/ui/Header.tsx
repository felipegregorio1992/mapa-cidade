'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, MapPin, Search, Heart, User, Compass, LogIn, LogOut } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Header() {
  const { isMobileMenuOpen, toggleMobileMenu, favorites } = useStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verifica se o usuário está logado
    fetch('/api/auth/me')
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setUserMenuOpen(false);
    router.refresh();
  };

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

            {/* User / Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 text-gray-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                  aria-label="Menu do usuário"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg py-2 animate-fade-in">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    {(user.role === 'admin' || user.role === 'moderator') && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700"
                      >
                        <User className="w-4 h-4" />
                        Painel Admin
                      </Link>
                    )}
                    <Link
                      href="/favoritos"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700"
                    >
                      <Heart className="w-4 h-4" />
                      Meus Favoritos
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Entrar
              </Link>
            )}

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
            {user ? (
              <>
                {(user.role === 'admin' || user.role === 'moderator') && (
                  <MobileNavLink href="/admin" icon={<User className="w-4 h-4" />} label="Admin" />
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sair ({user.name.split(' ')[0]})
                </button>
              </>
            ) : (
              <MobileNavLink href="/login" icon={<LogIn className="w-4 h-4" />} label="Entrar" />
            )}
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
