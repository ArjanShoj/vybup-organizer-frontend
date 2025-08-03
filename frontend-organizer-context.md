# Frontend Developer Context: Organizer Module

## Platform Overview

Vybup Platform is a two-sided marketplace that connects event organizers with performers for live entertainment events. The platform operates as a job board specifically for the entertainment industry, where organizers post gigs (performance opportunities) and performers apply to them.

### Core Business Model

- **Event Organizers** create gigs for events requiring live entertainment (concerts, festivals, private parties, corporate events)
- **Performers** (musicians, DJs, bands, entertainers) browse and apply to relevant gigs
- **Organizers** review applications and hire the performer that best fits their event
- **Platform** facilitates the entire hiring process from gig posting to payment processing

## Organizer Role and Responsibilities

### Primary User Journey

1. **Registration & Profile Setup**
   - Create account with email/password authentication
   - Complete profile with business context (private individual vs. business entity)
   - Provide company information and VAT details if operating as a business

2. **Gig Management**
   - Create detailed gig postings with event information, requirements, and compensation
   - Choose payment method (cash or digital payments via Stripe Connect)
   - Set application deadlines and manage gig lifecycle (draft → open → booked → completed)
   - Monitor application counts and manage gig visibility

3. **Application Review & Hiring**
   - Review performer applications with full access to applicant profiles and details
   - Evaluate performer skills, experience, portfolio, and application messages
   - Make hiring decisions by accepting one application (auto-rejecting others)
   - Track application status and manage the selection process

4. **Communication**
   - Communicate with hired performers through the platform's chat system
   - Chat sessions are automatically created when an application is accepted
   - Exchange event details, logistics, and coordination messages

5. **Review & Feedback**
   - After event completion, provide ratings and reviews for hired performers
   - Receive reviews from performers to build reputation on the platform

### Business Context Management

Organizers operate in two distinct contexts:

**Private/Individual Organizers:**
- Organizing personal events (birthdays, weddings, private parties)
- No business registration or VAT requirements
- Simplified profile and legal obligations

**Business Organizers:**
- Companies organizing corporate events, festivals, commercial venues
- Must provide business registration details and VAT information
- Enhanced business profiles with company information
- Different legal and tax obligations

## Technical Architecture for Frontend Development

### Authentication & Security

**Authentication Flow:**
- JWT-based authentication with role-specific tokens
- Tokens include `organizerId` for direct profile access
- All organizer endpoints require `ORGANIZER` role
- Cross-role access attempts are treated as "account not found"

### API Documentation

**Complete API Reference:**
All organizer-specific endpoints, request/response schemas, and authentication details are documented in the interactive Swagger UI:

**🎪 Organizer API Documentation**: http://localhost:8010/swagger-ui/index.html#/organizers

The Swagger documentation includes:
- Authentication endpoints (sign-up, sign-in)
- Profile management operations
- Gig CRUD operations and lifecycle management
- Application review and hiring workflows
- Chat system integration
- Review and rating system
- Complete request/response schemas
- Error code documentation
- Interactive testing capabilities

### Data Models

**Organizer Profile Structure:**
```typescript
interface OrganizerProfile {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  bio?: string
  profileImageUrl?: string
  websiteUrl?: string
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  businessContext: BusinessContext
  createdAt: string
  updatedAt: string
}

interface BusinessContext {
  organizerType: 'PRIVATE' | 'BUSINESS'
  companyInfo?: CompanyInfo
}

interface CompanyInfo {
  companyName: string
  vatNumber: string
  businessAddress: string
}
```

**Gig Structure:**
```typescript
interface Gig {
  id: string
  publicId: string
  title: string
  description: string
  location: string
  eventDate: string
  applicationDeadline: string
  pricingInCents: number
  paymentMethod: 'CASH' | 'STRIPE_CONNECT'
  status: 'DRAFT' | 'OPEN' | 'BOOKED' | 'COMPLETED' | 'CANCELLED'
  applicationsCount: number
  requirements?: string
  genres: string[]
  createdAt: string
  updatedAt: string
}
```

**Application Structure:**
```typescript
interface GigApplication {
  id: string
  gigId: string
  performerId: string
  performer: PerformerSummary
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  message?: string
  appliedAt: string
}

interface PerformerSummary {
  id: string
  firstName: string
  lastName: string
  stageName?: string
  profileImageUrl?: string
  genres: string[]
  location: string
  bio?: string
  averageRating?: number
  totalReviews: number
}
```

### Business Rules for Frontend Implementation

**Gig Lifecycle Management:**
- Gigs start as DRAFT and must be explicitly published to become OPEN
- Only OPEN gigs accept applications
- Accepting an application automatically changes gig status to BOOKED
- BOOKED gigs cannot accept new applications
- Only COMPLETED gigs can be reviewed

**Application Management:**
- Organizers see full performer details and application messages
- Accepting one application automatically rejects all others
- Application deadline enforcement is server-side
- No duplicate applications possible from same performer

**Payment Method Selection:**
- Must be chosen at gig creation time
- Cannot be changed after gig is created
- CASH gigs require manual payment coordination
- STRIPE_CONNECT gigs enable digital payment processing

**Business Context Validation:**
- BUSINESS organizers must provide company info and VAT
- PRIVATE organizers cannot provide business details
- Business context affects legal document requirements

**Communication Rules:**
- Chat sessions are automatically created when applications are accepted
- Only organizers and accepted performers can participate in chats
- Messages are scoped to specific gig relationships
- Read status tracking is maintained per participant

**Review System:**
- Reviews can only be created after gig completion
- Both organizers and performers can review each other
- Each party can only review once per gig
- Ratings are required (1-5 stars), review text is optional

### Error Handling

**Common Error Scenarios:**
- `401 Unauthorized` - Invalid or expired JWT token
- `403 Forbidden` - Insufficient permissions or wrong role
- `404 Not Found` - Gig or application not found
- `400 Bad Request` - Validation errors or business rule violations
- `409 Conflict` - Attempting operations on incompatible gig states

**Business Logic Errors:**
- Cannot accept applications on non-OPEN gigs
- Cannot modify gigs that have accepted applications
- Cannot change payment method after gig creation
- Invalid business context combinations

### Integration Points

**File Upload:**
- Profile images stored locally with configurable paths
- Image optimization and validation handled server-side

**Payment Processing:**
- Stripe Connect integration for digital payments
- Automatic payment creation when applications are accepted
- Payment status monitoring and reconciliation

**Location Services:**
- City geocoding and location-based search capabilities
- Distance calculations for location-based filtering

### Development Environment

**Local Development Setup:**
- Backend API: `http://localhost:8010`
- Database: PostgreSQL on `localhost:5432`
- Health Check: `http://localhost:8010/actuator/health`

**API Documentation:**
- **Organizer API**: http://localhost:8010/swagger-ui/index.html#/organizers
- **Complete Documentation**: http://localhost:8010/swagger-ui/index.html

**Authentication Setup:**
1. Use organizer sign-up endpoint to create test account
2. Sign in to receive JWT token
3. Include token in Authorization header: `Bearer <token>`
4. Token includes `organizerId` for direct profile operations

### Testing Strategy

**API Testing:**
- Use Swagger UI for interactive API testing and endpoint exploration
- Test all CRUD operations for gigs and applications
- Verify business rule enforcement (deadlines, status changes)
- Test error scenarios and edge cases

**Data Scenarios:**
- Test with different gig statuses and payment methods
- Create applications from multiple performers
- Test application acceptance workflow
- Verify chat creation and messaging flow

**User Flow Testing:**
- Complete organizer registration and profile setup
- Create and publish gigs with different configurations
- Review and accept performer applications
- Test communication with hired performers
- Complete the review process after gig completion

### Key Frontend Considerations

**State Management:**
- Track gig status changes and application counts
- Manage chat message state and read status
- Handle authentication state and token refresh

**Real-time Updates:**
- Consider implementing real-time updates for new applications
- Chat message delivery and read status updates
- Application status changes

**User Experience:**
- Clear indication of gig status and what actions are available
- Intuitive application review interface with performer details
- Streamlined hiring workflow with confirmation steps
- Accessible chat interface integrated with gig context

This document provides the complete context needed to develop the organizer frontend module. For detailed API specifications, request/response schemas, and interactive testing, refer to the Swagger documentation linked above.