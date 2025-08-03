// API Client configuration
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
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

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
    return this.request('/api/organizer/gigs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateGig(gigId: string, data: any) {
    return this.request(`/api/organizer/gigs/${gigId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async publishGig(gigId: string) {
    return this.request(`/api/organizer/gigs/${gigId}/publish`, {
      method: 'POST',
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

  async getUnreadCount() {
    return this.request('/api/organizer/chats/unread-count');
  }

  async getTotalUnreadCount() {
    return this.request('/api/organizer/chats/unread-count');
  }
}

export const apiClient = new ApiClient();