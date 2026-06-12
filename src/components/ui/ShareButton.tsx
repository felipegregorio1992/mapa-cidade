'use client';

import { Share2 } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonProps {
  title: string;
  url?: string;
}

export default function ShareButton({ title, url }: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const handleNativeShare = async () => {
    if (navigator.share) {
      await navigator.share({ title, url: shareUrl });
    } else {
      setShowMenu(!showMenu);
    }
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${title}\n${shareUrl}`)}`, '_blank');
    setShowMenu(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-teal-600 transition-colors"
        aria-label="Compartilhar"
      >
        <Share2 className="w-5 h-5" />
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-gray-200 shadow-lg py-1 z-50">
          <button onClick={shareWhatsApp} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
            📱 WhatsApp
          </button>
          <button onClick={copyLink} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
            🔗 Copiar link
          </button>
        </div>
      )}
    </div>
  );
}
