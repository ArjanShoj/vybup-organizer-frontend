// API Client configuration
import { toUtcIsoString } from './utils';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8010';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = API_BASE_URL;
    // Try to get token from localStorage on client side
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Merge existing headers
    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headers[key] = value;
        });
      } else if (Array.isArray(options.headers)) {
        options.headers.forEach(([key, value]) => {
          headers[key] = value;
        });
      } else {
        Object.assign(headers, options.headers);
      }
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new ApiError(response.status, errorMessage);
    }

    // Handle empty responses
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // Authentication
  async signUp(data: any) {
    return this.request('/api/auth/organizer/sign-up', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async signIn(data: any) {
    return this.request('/api/auth/organizer/sign-in', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Profile
  async getProfile() {
    return this.request('/api/organizer/profile');
  }

  async updateProfile(data: any) {
    return this.request('/api/organizer/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Gigs
  async getGigs(page = 0, size = 20) {
    return this.request(`/api/organizer/gigs?page=${page}&size=${size}`);
  }

  async getGigDetails(gigId: string) {
    return this.request(`/api/organizer/gigs/${gigId}`);
  }

  async createGig(data: any) {
    // Ensure timestamps are posted as UTC ISO strings without milliseconds
    const payload = {
      ...data,
      eventDate: toUtcIsoString(data?.eventDate) ?? data?.eventDate,
      applicationDeadline: toUtcIsoString(data?.applicationDeadline) ?? data?.applicationDeadline,
    };
    return this.request('/api/organizer/gigs', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updateGig(gigId: string, data: any) {
    // Ensure timestamps are posted as UTC ISO strings without milliseconds
    const payload = {
      ...data,
      eventDate: toUtcIsoString(data?.eventDate) ?? data?.eventDate,
      applicationDeadline: toUtcIsoString(data?.applicationDeadline) ?? data?.applicationDeadline,
    };
    return this.request(`/api/organizer/gigs/${gigId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async publishGig(gigId: string) {
    return this.request(`/api/organizer/gigs/${gigId}/publish`, {
      method: 'POST',
    });
  }

  async completeGig(gigId: string) {
    return this.request(`/api/organizer/gigs/${gigId}/complete`, {
      method: 'POST',
    });
  }

  async cancelGig(gigId: string, reason: string) {
    return this.request(`/api/organizer/gigs/${gigId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // Applications
  async getGigApplications(gigId: string, page = 0, size = 20) {
    return this.request(`/api/organizer/gigs/${gigId}/applications?page=${page}&size=${size}`);
  }

  async acceptApplication(gigId: string, applicationId: string, data: any) {
    return this.request(`/api/organizer/gigs/${gigId}/applications/${applicationId}/accept`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async rejectApplication(gigId: string, applicationId: string, data: any) {
    return this.request(`/api/organizer/gigs/${gigId}/applications/${applicationId}/reject`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Statistics
  async getStatistics() {
    return this.request('/api/organizer/profile/statistics');
  }

  // Reviews
  async getReviewSummary() {
    return this.request('/api/organizer/reviews/summary');
  }

  async getReviewStatistics() {
    return this.request('/api/organizer/reviews/statistics');
  }

  async getReviewsReceived(page = 0, size = 20) {
    return this.request(`/api/organizer/reviews/received?page=${page}&size=${size}`);
  }

  async getReviewsGiven(page = 0, size = 20) {
    return this.request(`/api/organizer/reviews/given?page=${page}&size=${size}`);
  }

  // Payments
  async getPayments(page = 0, size = 20) {
    return this.request(`/api/organizer/payments?page=${page}&size=${size}`);
  }

  async getPaymentSummary() {
    return this.request('/api/organizer/payments/summary');
  }

  async getPaymentByGig(gigId: string) {
    return this.request(`/api/organizer/payments/by-gig/${gigId}`);
  }

  // Chats
  async getChats(page = 0, size = 20) {
    return this.request(`/api/organizer/chats?page=${page}&size=${size}`);
  }

  async getChat(chatId: string) {
    return this.request(`/api/organizer/chats/${chatId}`);
  }

  async getChatByGig(gigId: string) {
    return this.request(`/api/organizer/chats/by-gig/${gigId}`);
  }

  async getMessages(chatId: string, page = 0, size = 50, since?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    });
    if (since) {
      params.append('since', since);
    }
    return this.request(`/api/organizer/chats/${chatId}/messages?${params.toString()}`);
  }

  async sendMessage(chatId: string, content: string, messageType: 'TEXT' | 'SYSTEM' | 'IMAGE' | 'FILE' = 'TEXT') {
    return this.request(`/api/organizer/chats/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ chatId, content, messageType }),
    });
  }

  async markMessagesAsRead(chatId: string) {
    return this.request(`/api/organizer/chats/${chatId}/read`, {
      method: 'POST',
    });
  }

  async archiveChat(chatId: string, reason?: string) {
    const params = reason ? `?reason=${encodeURIComponent(reason)}` : '';
    return this.request(`/api/organizer/chats/${chatId}/archive${params}`, {
      method: 'POST',
    });
  }

  async getUnreadCount() {
    return this.request('/api/organizer/chats/unread-count');
  }

  async getChatUnreadCount(chatId: string) {
    return this.request(`/api/organizer/chats/${chatId}/unread-count`);
  }

  async getTotalUnreadCount() {
    return this.request('/api/organizer/chats/unread-count');
  }

  // Performers
  async getPerformerProfile(performerId: string) {
    return this.request(`/api/organizer/performers/${performerId}`);
  }

  // Auth utilities
  logout() {
    this.clearToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/signin';
    }
  }
}

export const apiClient = new ApiClient();