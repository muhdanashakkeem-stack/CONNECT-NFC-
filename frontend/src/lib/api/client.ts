import { getStoredToken } from '@/lib/auth/session';
import { ApiResponse } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export class ApiError extends Error {
  statusCode: number;
  data?: any;

  constructor(message: string, statusCode: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { params, headers, ...customConfig } = options;
  const token = getStoredToken();

  let url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...customConfig,
      headers: {
        ...defaultHeaders,
        ...headers,
      },
    });

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const responseData = isJson ? await response.json() : null;

    if (!response.ok) {
      const errorMessage =
        responseData?.message ||
        responseData?.error ||
        `Backend API returned error ${response.status} (${response.statusText})`;
      
      throw new ApiError(errorMessage, response.status, responseData);
    }

    return {
      success: true,
      data: responseData?.data !== undefined ? responseData.data : responseData,
      message: responseData?.message,
      statusCode: response.status,
    };
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }

    // Backend is unreachable or network error
    const isOffline = err?.name === 'TypeError' || err?.message?.includes('fetch');
    const userMsg = isOffline
      ? `Backend at ${API_BASE_URL} is currently unreachable. Ensure backend server is started on port 5000.`
      : (err?.message || 'Unexpected network error connecting to backend API');

    throw new ApiError(userMsg, 0, { isBackendOffline: true, original: err?.message });
  }
}

export async function checkBackendHealth(): Promise<{ online: boolean; url: string; latency?: number }> {
  const start = performance.now();
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(2500),
    });
    return {
      online: res.ok,
      url: API_BASE_URL,
      latency: Math.round(performance.now() - start),
    };
  } catch {
    return {
      online: false,
      url: API_BASE_URL,
    };
  }
}
