'use client';

import { useState } from 'react';

export function useSavedMessage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const save = (msg: string) => {
    setError(null);
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  return { message, error, save, setError };
}
