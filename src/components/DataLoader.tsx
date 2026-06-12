'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';

export default function DataLoader() {
  const fetchSpots = useStore((s) => s.fetchSpots);

  useEffect(() => {
    fetchSpots();
  }, [fetchSpots]);

  return null;
}
