/**
 * NIRVIK Centralized Frontend API Client
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const getAccessToken = (): string | null => {
  return localStorage.getItem('nirvik_access_token') || localStorage.getItem('nirvik_token');
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('nirvik_refresh_token');
};

export const setTokens = (accessToken: string, refreshToken?: string) => {
  localStorage.setItem('nirvik_access_token', accessToken);
  localStorage.setItem('nirvik_token', accessToken);
  if (refreshToken) {
    localStorage.setItem('nirvik_refresh_token', refreshToken);
  }
};

export const clearTokens = () => {
  localStorage.removeItem('nirvik_access_token');
  localStorage.removeItem('nirvik_token');
  localStorage.removeItem('nirvik_refresh_token');
  localStorage.removeItem('nirvik_user');
};

interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined | null>;
  skipAuth?: boolean;
  body?: any;
}


export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, skipAuth, headers: customHeaders, body, ...customOptions } = options;

  let url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const headers: Record<string, string> = {
    ...((customHeaders as Record<string, string>) || {}),
  };

  if (!(body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (!skipAuth) {
    const token = getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {
      ...customOptions,
      headers,
      body: body instanceof FormData ? body : typeof body === 'object' && body !== null ? JSON.stringify(body) : body,
    });

    if (response.status === 401 && !skipAuth) {
      // Handle expired authentication token
      clearTokens();
      window.dispatchEvent(new CustomEvent('nirvik_unauthorized'));
    }

    if (!response.ok) {
      let errorData: any = null;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }
      const message = errorData?.detail || errorData?.message || `HTTP ${response.status}: ${response.statusText}`;
      throw new ApiError(response.status, message, errorData);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network or connection errors
    throw new ApiError(0, error.message || 'Unable to connect to NIRVIK backend server.', { url });
  }
}

export async function getCaseNetwork(caseId: string): Promise<any> {
  return apiRequest(`/network/${caseId}`);
}

export { USE_MOCK_DATA };

