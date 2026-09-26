'use client';

import { useEffect, useState } from 'react';
import { Cross } from 'lucide-react';
import { api } from '@/lib/api';
import type { FellowshipSettings } from '@/types';

let settingsRequest: Promise<FellowshipSettings> | null = null;

function getSettings() {
  settingsRequest ??= api.get<FellowshipSettings>('/api/settings', { skipAuth: true });
  return settingsRequest;
}

export function BrandLogo({ className = '', iconClassName = '' }: { className?: string; iconClassName?: string }) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    getSettings()
      .then((settings) => {
        const configuredLogo = settings.logoUrl?.trim();
        setLogoUrl(configuredLogo && !configuredLogo.startsWith('[') ? configuredLogo : null);
      })
      .catch(() => setLogoUrl(null));
  }, []);

  return (
    <span className={`flex shrink-0 items-center justify-center overflow-hidden ${className}`}>
      {logoUrl ? (
        <img
          src={logoUrl}
          alt="SAZU FCS logo"
          onError={() => setLogoUrl(null)}
          className="block h-full w-full object-contain"
        />
      ) : (
        <Cross className={iconClassName} size={18} strokeWidth={2.25} />
      )}
    </span>
  );
}
