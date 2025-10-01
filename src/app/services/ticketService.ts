// Ticket API Service
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Ticket {
  id: number;
  event: {
    id: number;
    title: string;
  };
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  ticketType: string;
  price: number;
  status: 'valid' | 'used' | 'canceled';
  qrCode: string;
  createdAt: string;
}

export interface TicketPurchaseData {
  event: number; // event ID
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  ticketType: string;
  price: number;
}

export interface MpesaResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

export interface TicketPurchaseResponse {
  ticket: Ticket;
  mpesa: MpesaResponse;
}

class TicketService {
  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
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
   * Purchase a ticket (public endpoint - no auth required)
   */
  async purchaseTicket(purchaseData: TicketPurchaseData): Promise<TicketPurchaseResponse> {
    const response = await fetch(`${API_BASE_URL}/tickets/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(purchaseData),
    });

    return this.handleResponse<TicketPurchaseResponse>(response);
  }

  /**
   * Get a specific ticket by ID (requires auth)
   */
  async getTicket(ticketId: number): Promise<Ticket> {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<Ticket>(response);
  }

  /**
   * Get all tickets for an event (organizer/admin only)
   */
  async getTicketsForEvent(eventId: number): Promise<Ticket[]> {
    const response = await fetch(`${API_BASE_URL}/tickets/event/${eventId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<Ticket[]>(response);
  }

  /**
   * Get all tickets for organizer's events
   */
  async getMyTickets(): Promise<Ticket[]> {
    try {
      // We'll need to fetch the organizer's events first, then get tickets for each event
      const eventsResponse = await fetch(`${API_BASE_URL}/events/my`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!eventsResponse.ok) {
        console.error('Events API response:', eventsResponse.status, eventsResponse.statusText);
        throw new Error(`Failed to fetch events: ${eventsResponse.status} ${eventsResponse.statusText}`);
      }

      const events = await eventsResponse.json();
      
      // Get tickets for all events
      const ticketPromises = events.map((event: any) => 
        this.getTicketsForEvent(event.id).catch(() => []) // Return empty array if fails
      );

      const ticketArrays = await Promise.all(ticketPromises);
      
      // Flatten the arrays and return all tickets
      return ticketArrays.flat();
    } catch (error) {
      console.error('Error fetching my tickets:', error);
      throw error;
    }
  }

  /**
   * Cancel a ticket (organizer/admin only)
   */
  async cancelTicket(ticketId: number): Promise<Ticket> {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/cancel`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<Ticket>(response);
  }

  /**
   * Mark ticket as used (organizer/admin only)
   */
  async useTicket(ticketId: number): Promise<Ticket> {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/use`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<Ticket>(response);
  }

  /**
   * Get ticket statistics for organizer
   */
  async getTicketStats(): Promise<{
    totalTickets: number;
    validTickets: number;
    usedTickets: number;
    canceledTickets: number;
    totalRevenue: number;
  }> {
    try {
      const tickets = await this.getMyTickets();
      
      const stats = {
        totalTickets: tickets.length,
        validTickets: tickets.filter(t => t.status === 'valid').length,
        usedTickets: tickets.filter(t => t.status === 'used').length,
        canceledTickets: tickets.filter(t => t.status === 'canceled').length,
        totalRevenue: tickets
          .filter(t => t.status !== 'canceled')
          .reduce((acc, ticket) => acc + ticket.price, 0),
      };

      return stats;
    } catch (error) {
      console.error('Error calculating ticket stats:', error);
      return {
        totalTickets: 0,
        validTickets: 0,
        usedTickets: 0,
        canceledTickets: 0,
        totalRevenue: 0,
      };
    }
  }
}

// Export singleton instance
export const ticketService = new TicketService();
export default ticketService;