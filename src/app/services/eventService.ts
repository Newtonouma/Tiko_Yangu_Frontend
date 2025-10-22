// Event API Service
import { EventFormData } from '../components/events/EventForm';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export type TicketType = 'earlybird' | 'regular' | 'vip' | 'vvip' | 'at_the_gate';

export interface TicketTypeInfo {
  type: TicketType;
  name: string;
  price: number;
  available: boolean;
}

export interface GroupTicket {
  id: string;
  name: string;
  memberCount: number;
  price: number;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  images?: string[];
  url?: string;
  venue: string;
  location: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  // Individual ticket prices
  earlybirdPrice?: number;
  regularPrice: number;
  vipPrice?: number;
  vvipPrice?: number;
  atTheGatePrice?: number;
  // Backward compatibility
  ticketPrice: number;
  // Group tickets
  groupTickets?: GroupTicket[];
  organizer: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  status: 'active' | 'archived' | 'deleted';
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventData extends Omit<EventFormData, 'images'> {
  images?: File[];
}

// Utility function to get available ticket types for an event
export const getAvailableTicketTypes = (event: Event): TicketTypeInfo[] => {
  const ticketTypes: TicketTypeInfo[] = [];

  if (event.earlybirdPrice && event.earlybirdPrice > 0) {
    ticketTypes.push({
      type: 'earlybird',
      name: 'Earlybird',
      price: event.earlybirdPrice,
      available: true
    });
  }

  // Regular price is always available
  ticketTypes.push({
    type: 'regular',
    name: 'Regular',
    price: event.regularPrice || event.ticketPrice || 0,
    available: true
  });

  if (event.vipPrice && event.vipPrice > 0) {
    ticketTypes.push({
      type: 'vip',
      name: 'VIP',
      price: event.vipPrice,
      available: true
    });
  }

  if (event.vvipPrice && event.vvipPrice > 0) {
    ticketTypes.push({
      type: 'vvip',
      name: 'VVIP',
      price: event.vvipPrice,
      available: true
    });
  }

  if (event.atTheGatePrice && event.atTheGatePrice > 0) {
    ticketTypes.push({
      type: 'at_the_gate',
      name: 'At the Gate',
      price: event.atTheGatePrice,
      available: true
    });
  }

  return ticketTypes;
};

// Utility function to generate URL-friendly slug from event title
export const generateEventSlug = (title: string, id: number): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .concat(`-${id}`); // Add ID at the end for uniqueness
};

// Utility function to extract ID from slug (for backward compatibility)
export const getIdFromSlug = (slug: string): number => {
  const parts = slug.split('-');
  const lastPart = parts[parts.length - 1];
  return parseInt(lastPart) || 0;
};

class EventService {
  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    return {
      'Authorization': `Bearer ${token}`,
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: `HTTP error! status: ${response.status}` 
      }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  /**
   * Create a new event
   */
  async createEvent(eventData: CreateEventData): Promise<Event> {
    const formData = new FormData();
    
    // Add text fields
    Object.entries(eventData).forEach(([key, value]) => {
      if (key !== 'images' && value !== undefined && value !== '') {
        formData.append(key, value.toString());
      }
    });

    // Add image files
    if (eventData.images && eventData.images.length > 0) {
      eventData.images.forEach((file) => {
        formData.append('images', file);
      });
    }

    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: formData,
    });

    return this.handleResponse<Event>(response);
  }

  /**
   * Get all events (admin only)
   */
  async getAllEvents(): Promise<Event[]> {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
    });

    return this.handleResponse<Event[]>(response);
  }

  /**
   * Get organizer's active events
   */
  async getMyEvents(): Promise<Event[]> {
    const response = await fetch(`${API_BASE_URL}/events/my`, {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
    });

    return this.handleResponse<Event[]>(response);
  }

  /**
   * Get organizer's archived events
   */
  async getMyArchivedEvents(): Promise<Event[]> {
    const response = await fetch(`${API_BASE_URL}/events/my-archived`, {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
    });

    return this.handleResponse<Event[]>(response);
  }

  /**
   * Get a single event by ID
   */
  async getEventById(id: number): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
    });

    return this.handleResponse<Event>(response);
  }

  /**
   * Update an existing event
   */
  async updateEvent(id: number, eventData: CreateEventData): Promise<Event> {
    console.log('🔄 EventService.updateEvent called with:', { id, eventData });
    
    const formData = new FormData();
    
    // Add text fields
    Object.entries(eventData).forEach(([key, value]) => {
      if (key !== 'images' && value !== undefined && value !== '') {
        console.log(`📝 Adding form field: ${key} = ${value}`);
        formData.append(key, value.toString());
      }
    });

    // Add image files
    if (eventData.images && eventData.images.length > 0) {
      console.log(`🖼️ Adding ${eventData.images.length} image files`);
      eventData.images.forEach((file, index) => {
        console.log(`📎 Image ${index}: ${file.name} (${file.size} bytes)`);
        formData.append('images', file);
      });
    } else {
      console.log('📷 No images to upload');
    }

    const headers = this.getAuthHeaders();
    console.log('🔐 Request headers:', headers);
    console.log(`📤 Making PUT request to: ${API_BASE_URL}/events/${id}`);

    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers,
      body: formData,
    });

    console.log('📥 Raw response received:', response);
    return this.handleResponse<Event>(response);
  }

  /**
   * Delete an event permanently
   */
  async deleteEvent(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: `HTTP error! status: ${response.status}` 
      }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
  }

  /**
   * Archive an event (soft delete)
   */
  async archiveEvent(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/events/${id}/archive`, {
      method: 'PATCH',
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: `HTTP error! status: ${response.status}` 
      }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
  }

  /**
   * Unarchive an event (restore to active status)
   * Uses a simple status update approach
   */
  async unarchiveEvent(id: number): Promise<void> {
    // Try JSON approach first
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'PUT',
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'active' }),
      });

      if (response.ok) {
        return; // Success with JSON
      }
    } catch (error) {
      // JSON failed, try FormData approach
    }

    // Fallback to FormData approach
    const formData = new FormData();
    formData.append('status', 'active');

    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: `HTTP error! status: ${response.status}` 
      }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
  }
}

// Export singleton instance
export const eventService = new EventService();
export default eventService;