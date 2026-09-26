import type { ApiEnvelope } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('sazu_fcs_token');
}

export function setToken(token: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('sazu_fcs_token', token);
}

export function clearToken() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem('sazu_fcs_token');
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  skipAuth?: boolean;
}

function stripServerFields<T>(body: T): T {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return body;
  }

  const cleaned = { ...(body as Record<string, unknown>) };
  for (const key of ['id', 'createdAt', 'updatedAt']) {
    delete cleaned[key];
  }

  return cleaned as T;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, skipAuth, headers, ...rest } = options;
  const token = skipAuth ? null : getToken();
  const sanitizedBody = body !== undefined ? stripServerFields(body) : undefined;

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: sanitizedBody !== undefined ? JSON.stringify(sanitizedBody) : undefined,
    cache: rest.next ? undefined : rest.cache ?? 'no-store',
  });

  let json: ApiEnvelope<T> | { message?: string | string[]; error?: string } | null = null;
  try {
    json = await res.json();
  } catch {
    // Non-JSON response (e.g. 204) — leave json null.
  }

  if (!res.ok) {
    const errBody = json as { message?: string | string[]; error?: string } | null;
    const message = Array.isArray(errBody?.message)
      ? errBody!.message!.join(', ')
      : errBody?.message ?? errBody?.error ?? 'Something went wrong. Please try again.';
    throw new ApiError(message, res.status, json);
  }

  if (json && typeof json === 'object' && 'data' in json && json.data !== undefined) {
    return json.data as T;
  }

  return json as T;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
  postForm: async <T>(path: string, formData: FormData): Promise<T> => {
    const token = getToken();
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    });
    const json = await res.json();
    if (!res.ok) throw new ApiError(json?.message ?? 'Something went wrong. Please try again.', res.status, json);
    return json?.data ?? json;
  },
};

/**
 * Downloads a receipt PDF (binary response, not JSON) with the auth header
 * attached, then triggers a browser save via an object URL.
 */
export async function downloadReceiptPdf(receiptId: string, filename: string) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/receipts/${receiptId}/download`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) {
    throw new ApiError('Could not download receipt', res.status);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function uploadReceiptFile(receiptId: string, file: File) {
  const allowedTypes = new Set([
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/pjpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/avif',
  ]);
  if (!allowedTypes.has(file.type.toLowerCase())) {
    throw new ApiError('Receipt files must be PDF or a normal image format.', 400);
  }

  const formData = new FormData();
  formData.append('file', file);
  const token = getToken();
  const res = await fetch(`${API_URL}/api/admin/receipts/${receiptId}/file`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });
  const json = await res.json();
  if (!res.ok) throw new ApiError(json?.message ?? 'Could not upload receipt', res.status, json);
  return json.data;
}

/**
 * Multipart upload helper (bypasses the JSON body path above).
 * Used for admin image uploads to POST /api/admin/upload/image.
 */
export async function uploadImage(file: File, folder = 'general'): Promise<{ url: string; publicId: string }> {
  const allowedTypes = new Set([
    'image/jpeg',
    'image/jpg',
    'image/pjpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/avif',
  ]);
  if (!allowedTypes.has(file.type.toLowerCase())) {
    throw new ApiError('Unsupported image format. Use JPEG, PNG, WebP, GIF, or AVIF.', 400);
  }

  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_URL}/api/admin/upload/image?folder=${encodeURIComponent(folder)}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });

  const json = await res.json();
  if (!res.ok) {
    throw new ApiError(json?.message ?? 'Upload failed', res.status, json);
  }
  return json.data;
}
