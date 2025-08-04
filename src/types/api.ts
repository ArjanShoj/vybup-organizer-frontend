// API Types based on Swagger schema
export interface OrganizerProfileDto {
  id: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  bio?: string;
  locationCity?: string;
  phoneNumber?: string;
  organizerType?: 'PRIVATE' | 'BUSINESS';
  companyInfo?: CompanyInfo;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface CompanyInfo {
  name: string;
  address: string;
  vatNumber?: VATNumber;
  contactEmail?: string;
  contactPhone?: string;
}

export interface VATNumber {
  number: string;
  country: string;
}

export interface Money {
  amountInCents: number;
  currency: string;
  amountInEuros: number;
}

export interface GigResponse {
  gigId: string;
  publicId: string;
  organizerId: string;
  organizerDisplayName?: string;
  title: string;
  description?: string;
  category: string;
  genres: string[];
  locationCity?: string;
  eventDate: string;
  applicationDeadline?: string;
  pricing: Money;
  priceType: 'FIXED' | 'HOURLY' | 'NEGOTIABLE';
  isNegotiable: boolean;
  paymentMethod: 'CASH' | 'STRIPE_CONNECT';
  status: 'DRAFT' | 'OPEN' | 'BOOKED' | 'COMPLETED' | 'CANCELLED';
  applicationsCount: number;
  canApply: boolean;
  createdAt: string;
}

export interface GigApplicationResponse {
  id: string;
  gigId: string;
  gigTitle: string;
  performerId?: string;
  performerDisplayName?: string;
  performerFirstName?: string;
  performerLastName?: string;
  performerAvatarUrl?: string;
  performerGenres: string[];
  performerRating?: number;
  performerReviewCount: number;
  applicationMessage?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  appliedAt: string;
  decisionAt?: string;
  decisionReason?: string;
}

export interface PerformerSummary {
  id: string;
  firstName: string;
  lastName: string;
  stageName?: string;
  profileImageUrl?: string;
  genres: string[];
  location: string;
  bio?: string;
  averageRating?: number;
  totalReviews: number;
}

export interface CreateGigRequest {
  title: string;
  description?: string;
  category: string;
  genres: string[];
  locationCity?: string;
  locationLat?: number;
  locationLon?: number;
  eventDate: string;
  applicationDeadline?: string;
  pricing: Money;
  priceType: 'FIXED' | 'HOURLY' | 'NEGOTIABLE';
  isNegotiable: boolean;
  paymentMethod: 'CASH' | 'STRIPE_CONNECT';
}

export interface SignUpRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  token: string;
  organizer: OrganizerProfileDto;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ChatSummaryDto {
  id: string;
  gigId: string;
  gigTitle: string;
  performerId: string;
  performerName: string;
  performerImageUrl?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  status: 'ACTIVE' | 'ARCHIVED';
}

export interface ReviewDto {
  id: string;
  gigId: string;
  reviewerId: string;
  revieweeId: string;
  reviewType: 'PERFORMER_TO_ORGANIZER' | 'ORGANIZER_TO_PERFORMER';
  rating: number;
  reviewText?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizerStatisticsDto {
  totalGigsCreated: number;
  totalGigsCompleted: number;
  totalApplicationsReceived: number;
  averageRating?: number;
  totalReviews: number;
  totalAmountPaid: number;
}

export interface ReviewSummaryDto {
  totalReviews: number;
  averageRating?: number;
  ratingDistribution: Record<string, number>;
  recentReviews: ReviewDto[];
}

export interface ReviewStatisticsDto {
  userId: string;
  totalReviewsReceived: number;
  totalReviewsGiven: number;
  averageRatingReceived?: number;
  ratingDistribution: Record<string, number>;
  positiveReviewPercentage: number;
  mostCommonRating?: number;
  lastReviewReceivedAt?: string;
  lastReviewGivenAt?: string;
  hasReceivedReviews: boolean;
  hasGivenReviews: boolean;
}

export interface PaymentSummaryDto {
  totalPayments: number;
  completedPayments: number;
  failedPayments: number;
  totalAmountProcessed: Money;
  totalPlatformFees: Money;
}

export interface PaymentDto {
  id: string;
  gigId: string;
  organizerId: string;
  performerId: string;
  amount: Money;
  provider: 'STRIPE' | 'CASH' | 'BANK_TRANSFER';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED' | 'ON_HOLD';
  stripePaymentIntentId?: string;
  platformFee?: Money;
  performerPayout: Money;
  failureReason?: string;
  processedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  timeoutAt?: string;
  createdAt: string;
  updatedAt: string;
}