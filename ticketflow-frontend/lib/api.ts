const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface ApiError {
  detail?: string
  message?: string
  [key: string]: any
}

export interface ApiResponse<T> {
  data?: T
  error?: ApiError
  status: number
}

interface RequestOptions extends RequestInit {
  skipAuthHeader?: boolean
}

async function getAuthToken() {
  if (typeof window === 'undefined') return null

  try {
    const response = await fetch(`${API_BASE_URL}/accounts/api/token/refresh/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      localStorage.removeItem('authToken')
      return null
    }

    const data = await response.json()
    const token = data.access || data.token

    if (token) {
      localStorage.setItem('authToken', token)
      return token
    }

    return null
  } catch {
    return null
  }
}

async function makeRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { skipAuthHeader = false, headers = {}, ...rest } = options

  const url = `${API_BASE_URL}${endpoint}`
  const mergedHeaders: HeadersInit = { 'Content-Type': 'application/json' }

  if (!skipAuthHeader) {
    let token = null

    if (typeof window !== 'undefined') {
      token = localStorage.getItem('authToken')
    }

    console.log("makeRequest: Token from localStorage:", token);

    if (token) {
      ;(mergedHeaders as any)['Authorization'] = `Bearer ${token}`
      console.log("makeRequest: Authorization header set:", (mergedHeaders as any)['Authorization']);
    } else {
      console.log("makeRequest: No token found in localStorage.");
    }
  }

Object.assign(mergedHeaders, headers)

  try {
    const response = await fetch(url, {
      ...rest,
      headers: mergedHeaders,
      credentials: 'include',
    })

    const contentType = response.headers.get('content-type')
    let data = null

    if (contentType?.includes('application/json')) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    if (response.status === 401) {
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        localStorage.removeItem('authToken')
        window.location.href = '/login'
      }
      return { data: null as any, error: data || { detail: 'Unauthorized' }, status: 401 }
    }

    if (!response.ok) {
      return {
        data: null as any,
        error: data || { detail: `HTTP ${response.status}` },
        status: response.status,
      }
    }

    return { data, status: response.status }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error'
    return {
      data: null as any,
      error: { detail: message },
      status: 0,
    }
  }
}

export const api = {
  // Account endpoints (accounts/urls.py)
  auth: {
    login: (email: string, password: string) =>
      makeRequest<{ access: string; refresh: string; user: any }>('/accounts/api/token/', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        skipAuthHeader: true,
      }),

    register: (email: string, password: string, full_name: string) =>
      makeRequest<{ user: any }>('/accounts/api/user/register/', {
        method: 'POST',
        body: JSON.stringify({ email, password, full_name }),
        skipAuthHeader: true,
      }),

    // logout: () =>
    //   makeRequest('/account/logout/', {
    //     method: 'POST',
    //   }),

    me: () => makeRequest<any>('/accounts/api/user/me/', { method: 'GET' }),

    logout: () => Promise.resolve({ data: { success: true }, status: 200 }),

    updateProfile: (data: any) =>
      makeRequest('/accounts/api/user/me/', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  // Ticket endpoints (tickets/urls.py mounted at /tickets/)
  tickets: {
    list: (params?: Record<string, any>) => {
      const query = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query.append(key, String(value))
          }
        })
      }
      const queryString = query.toString()
      const url = queryString ? `/tickets/tickets/?${queryString}` : '/tickets/tickets/'
      return makeRequest<any[]>(url, { method: 'GET' })
    },

    get: (id: string | number) =>
      makeRequest<any>(`/tickets/tickets/${id}/`, { method: 'GET' }),

    create: (data: any) =>
      makeRequest<any>('/tickets/tickets/', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string | number, data: any) =>
      makeRequest<any>(`/tickets/tickets/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    delete: (id: string | number) =>
      makeRequest(`/tickets/tickets/${id}/`, { method: 'DELETE' }),

    assign: (id: string | number, staff_id: number) =>
      makeRequest<any>(`/tickets/tickets/${id}/assign/`, {
        method: 'PATCH', // Changed from POST to PATCH
        body: JSON.stringify({ agent: staff_id }), // Changed from staff_id to agent
      }),

    updateStatus: (id: string | number, status: string) =>
      makeRequest<any>(`/tickets/tickets/${id}/status_update/`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
  },

  // Comment endpoints (tickets/urls.py + comments/urls.py)
  comments: {
    list: (ticketId: string | number) =>
      makeRequest<any[]>(`/tickets/tickets/${ticketId}/comments/`, { method: 'GET' }),

    create: (ticketId: string | number, text: string) =>
      makeRequest<any>(`/tickets/tickets/${ticketId}/comments/`, {
        method: 'POST',
        body: JSON.stringify({ comment: text }), // Changed from text to comment, removed ticketId from body
      }),

    update: (ticketId: string | number, id: string | number, text: string) =>
      makeRequest<any>(`/tickets/tickets/${ticketId}/comments/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify({ comment: text }),
      }),

    delete: (ticketId: string | number, id: string | number) =>
      makeRequest(`/tickets/tickets/${ticketId}/comments/${id}/`, { method: 'DELETE' }),
  },

  // No staff list endpoint in Django backend yet
  // staff: {
  //   list: () => makeRequest<any[]>('/account/staff/', { method: 'GET' }),
  // },
}
