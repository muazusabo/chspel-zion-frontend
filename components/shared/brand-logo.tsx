'use client';

import { useEffect, useState } from 'react';
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
        <svg
          viewBox="0 0 40 40"
          role="img"
          aria-label="SAZU FCS"
          className={`h-full w-full ${iconClassName}`}
          fill="none"
        >
          <path d="M4.5 11.5c5.3-2.1 10.8-1 15.5 3.3v20c-4.7-4.2-10.2-5.4-15.5-3.3v-20Z" fill="currentColor" />
          <path d="M35.5 11.5c-5.3-2.1-10.8-1-15.5 3.3v20c4.7-4.2 10.2-5.4 15.5-3.3v-20Z" fill="currentColor" opacity=".58" />
          <path d="M20 15v19" stroke="#B8924A" strokeWidth="1.8" />
          <path d="M20 3.5v9M16.5 7h7" stroke="#B8924A" strokeWidth="2" strokeLinecap="round" />
          <path d="M8 17.5c3-.5 6 .3 8.2 2.2M8 23c3-.5 6 .3 8.2 2.2M32 17.5c-3-.5-6 .3-8.2 2.2M32 23c-3-.5-6 .3-8.2 2.2" stroke="white" strokeOpacity=".65" strokeWidth="1" strokeLinecap="round" />
        </svg>
      )}
    </span>
  );
}
