const API_BASE_URL = process.env.NEXT_PUBLIC_MARKETING_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface SendMarketingMessageDto {
  eventId: number;
  customerIds: number[];
  messageType: 'email' | 'sms';
  subject?: string;
  message: string;
}

export interface SendBroadcastMessageDto {
  messageType: 'email' | 'sms';
  subject?: string;
  message: string;
  customerIds?: number[]; // Optional: specific customers, if empty sends to all
}

export interface MarketingResponse {
  success: boolean;
  message: string;
  results: Array<{
    customer: string;
    status: 'sent' | 'failed';
    method?: 'email' | 'sms';
    reason?: string;
  }>;
  summary: {
    total: number;
    sent: number;
    failed: number;
  };
}

// Helpers
const getAuthToken = () => (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null);

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `Request failed: ${response.status} ${response.statusText}`;
    try {
      const data: any = await response.json();
      if (data?.message) message = data.message;
    } catch {
      try {
        const text = await response.text();
        if (text) message = text;
      } catch {}
    }
    if (response.status === 403) {
      throw new Error(message || 'Forbidden: You do not have permission to perform this action.');
    }
    if (response.status === 401) {
      throw new Error(message || 'Unauthorized: Please sign in again.');
    }
    throw new Error(message);
  }
  try {
    return await response.json();
  } catch {
    return {} as T;
  }
}

export const marketingService = {
  async sendMarketingMessage(data: SendMarketingMessageDto): Promise<MarketingResponse> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/marketing/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return handleResponse<MarketingResponse>(response);
  },

  async sendBroadcastMessage(data: SendBroadcastMessageDto): Promise<MarketingResponse> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/marketing/broadcast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return handleResponse<MarketingResponse>(response);
  },

  async getAllCustomers(): Promise<any[]> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/tickets/organizer/my`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const tickets = await handleResponse<any[]>(response);
    
    // Extract unique customers from all tickets
    const uniqueCustomers = tickets.reduce((acc: any[], ticket: any) => {
      const existingCustomer = acc.find(c => c.email === ticket.buyerEmail);
      if (!existingCustomer) {
        acc.push({
          id: ticket.id,
          name: ticket.buyerName,
          email: ticket.buyerEmail,
          phone: ticket.buyerPhone || 'N/A',
          ticketCount: 1,
          totalSpent: Number(ticket.price || 0),
          events: [ticket.event?.title || 'Unknown Event'],
          ticketIds: [ticket.id]
        });
      } else {
        existingCustomer.ticketCount += 1;
        existingCustomer.totalSpent += Number(ticket.price || 0);
        if (ticket.event?.title && !existingCustomer.events.includes(ticket.event.title)) {
          existingCustomer.events.push(ticket.event.title);
        }
        existingCustomer.ticketIds.push(ticket.id);
      }
      return acc;
    }, []);

    return uniqueCustomers;
  },
};