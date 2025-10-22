import { getAuthHeaders } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// API Helper function with auth headers
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const config: RequestInit = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers as Record<string, string>),
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    // Try to get error message from response body
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } else {
        // For non-JSON responses (like HTML error pages)
        const textResponse = await response.text();
        if (textResponse.includes('<!DOCTYPE')) {
          errorMessage = `Server returned HTML error page (${response.status}). Check if the API endpoint exists and the server is running correctly.`;
        } else {
          errorMessage = `${errorMessage}: ${textResponse.substring(0, 100)}`;
        }
      }
    } catch (parseError) {
      // If we can't parse the error response, use the original message
    }
    throw new Error(errorMessage);
  }
  
  // Check if response is JSON before parsing
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    if (text.includes('<!DOCTYPE')) {
      throw new Error('Server returned HTML instead of JSON. This usually means the API endpoint was not found or there\'s a server configuration issue.');
    }
    throw new Error('Server returned non-JSON response: ' + text.substring(0, 100));
  }
  
  return response.json();
}

// Analytics API
export const analyticsAPI = {
  getDashboard: () => apiRequest('/analytics/dashboard'),
  getRevenue: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return apiRequest(`/analytics/revenue?${params}`);
  },
  getUsers: () => apiRequest('/analytics/users'),
  getPlatformMetrics: () => apiRequest('/analytics/platform-metrics'),
  exportData: (format = 'json') => apiRequest(`/analytics/export?format=${format}`),
};

// Users API
export const usersAPI = {
  getAll: () => apiRequest('/users'),
  getStatistics: () => apiRequest('/users/statistics'),
  search: (query: string) => apiRequest(`/users/search?q=${encodeURIComponent(query)}`),
  getById: (id: number) => apiRequest(`/users/${id}`),
  updateRole: (id: number, role: string) => 
    apiRequest(`/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    }),
  activate: (id: number) => apiRequest(`/users/${id}/activate`, { method: 'PUT' }),
  deactivate: (id: number) => apiRequest(`/users/${id}/deactivate`, { method: 'PUT' }),
  grantMarketingAccess: (id: number) => apiRequest(`/users/${id}/grant-marketing`, { method: 'PUT' }),
  revokeMarketingAccess: (id: number) => apiRequest(`/users/${id}/revoke-marketing`, { method: 'PUT' }),
  delete: (id: number) => apiRequest(`/users/${id}`, { method: 'DELETE' }),
  createAdmin: (userData: any) => 
    apiRequest('/users/admin', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
};

// Events API
export const eventsAPI = {
  getAllForAdmin: () => apiRequest('/events/admin/all'),
  getStatistics: () => apiRequest('/events/admin/statistics'),
  getPending: () => apiRequest('/events/admin/pending'),
  approve: (id: number, reason?: string) => 
    apiRequest(`/events/admin/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    }),
  reject: (id: number, reason: string) => 
    apiRequest(`/events/admin/${id}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    }),
  feature: (id: number) => apiRequest(`/events/admin/${id}/feature`, { method: 'PUT' }),
  unfeature: (id: number) => apiRequest(`/events/admin/${id}/unfeature`, { method: 'PUT' }),
  delete: (id: number) => apiRequest(`/events/admin/${id}`, { method: 'DELETE' }),
};

// Tickets API
export const ticketsAPI = {
  getAllForAdmin: () => apiRequest('/tickets/admin/all'),
  getStatistics: () => apiRequest('/tickets/admin/statistics'),
  getByEventId: (eventId: number) => apiRequest(`/tickets/event/${eventId}`),
  getRevenue: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return apiRequest(`/tickets/admin/revenue?${params}`);
  },
  refund: (id: number, reason: string) => 
    apiRequest(`/tickets/admin/${id}/refund`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    }),
  updateStatus: (id: number, status: string) => 
    apiRequest(`/tickets/admin/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
  search: (params: any) => {
    const searchParams = new URLSearchParams(params);
    return apiRequest(`/tickets/admin/search?${searchParams}`);
  },
};

// Settings API
export const settingsAPI = {
  getAll: (category?: string) => {
    const params = category ? `?category=${category}` : '';
    return apiRequest(`/settings${params}`);
  },
  getPublic: () => apiRequest('/settings/public'),
  get: (key: string) => apiRequest(`/settings/${key}`),
  create: (settingData: any) => 
    apiRequest('/settings', {
      method: 'POST',
      body: JSON.stringify(settingData),
    }),
  update: (key: string, value: string) => 
    apiRequest(`/settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    }),
  bulkUpdate: (updates: Array<{ key: string; value: string }>) => 
    apiRequest('/settings/bulk', {
      method: 'PUT',
      body: JSON.stringify({ updates }),
    }),
  delete: (key: string) => apiRequest(`/settings/${key}`, { method: 'DELETE' }),
  initialize: () => apiRequest('/settings/initialize', { method: 'POST' }),
};

// Audit API
export const auditAPI = {
  getLogs: (params?: any) => {
    const searchParams = new URLSearchParams(params);
    return apiRequest(`/audit/logs?${searchParams}`);
  },
  getStatistics: () => apiRequest('/audit/statistics'),
  export: (params?: any) => {
    const searchParams = new URLSearchParams(params);
    return apiRequest(`/audit/export?${searchParams}`);
  },
  cleanup: (daysToKeep: number) => 
    apiRequest('/audit/cleanup', {
      method: 'POST',
      body: JSON.stringify({ daysToKeep }),
    }),
};

// Admin Broadcast API
export const adminBroadcast = (broadcastData: {
  targetType: string;
  eventId?: string;
  organizerId?: string;
  subject: string;
  message: string;
  sendEmail: boolean;
  sendSms: boolean;
}) => 
  apiRequest('/marketing/admin-broadcast', {
    method: 'POST',
    body: JSON.stringify(broadcastData),
  });

export const getAdminBroadcastTargets = () => 
  apiRequest('/marketing/admin-broadcast-targets');