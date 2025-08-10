# Frontend Developer Context: Organizer Module

## Platform Overview

Vybup Platform is a two-sided marketplace that connects event organizers with performers for live entertainment events.
The platform operates as a job board specifically for the entertainment industry, where organizers post gigs (
performance opportunities) and performers apply to them.

### Core Business Model

- **Event Organizers** create gigs for events requiring live entertainment (concerts, festivals, private parties,
  corporate events)
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

4. **Real-time Communication**
    - Communicate with hired performers through the platform's WebSocket-powered chat system
    - Chat sessions are automatically created when an application is accepted
    - Real-time messaging with instant delivery, typing indicators, and read receipts
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
All organizer-specific endpoints, request/response schemas, and authentication details are documented in the interactive
Swagger UI:

**🎪 Organizer API Documentation**: http://localhost:8010/swagger-ui/index.html#/organizers

The Swagger documentation includes:

- Authentication endpoints (sign-up, sign-in)
- Profile management operations
- Gig CRUD operations and lifecycle management
- Application review and hiring workflows
- Real-time chat system integration (REST + WebSocket)
- Review and rating system
- Complete request/response schemas
- Error code documentation
- Interactive testing capabilities

**WebSocket Chat Integration:**

- **WebSocket Endpoint**: `ws://localhost:8010/ws/chat?token=YOUR_JWT_TOKEN`
- **Interactive Test Page**: http://localhost:8010/websocket-test.html
- **WebSocket Stats**: http://localhost:8010/api/websocket/stats

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

**Chat Participant Structure:**

```typescript
interface ChatParticipantInfo {
    id: string
    displayName: string          // Never null - includes fallbacks
    firstName: string            // Never null - includes fallbacks
    lastName: string             // Never null - includes fallbacks
    avatarUrl?: string           // Only this can be null
}

interface ChatDto {
    id: string
    gigId: string
    organizerId: string
    performerId: string
    organizer: ChatParticipantInfo    // Complete organizer info
    performer: ChatParticipantInfo    // Complete performer info
    isActive: boolean
    createdAt: string
    lastMessageAt?: string
    organizerLastReadAt?: string
    performerLastReadAt?: string
}

interface MessageDto {
    id: string
    chatId: string
    senderId: string
    sender: ChatParticipantInfo       // Never null - includes system/fallbacks
    content: string
    messageType: 'TEXT' | 'SYSTEM'
    status: 'SENT' | 'DELIVERED' | 'READ'
    sentAt: string
    readAt?: string
    isSystemMessage: boolean
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

**Real-time Communication Rules:**

- Chat sessions are automatically created when applications are accepted
- Only organizers and accepted performers can participate in chats
- Messages are scoped to specific gig relationships
- Real-time message delivery via WebSocket with REST API fallback
- Typing indicators and read receipts for enhanced user experience
- Online/offline status awareness for participants

**Enhanced User Information in Chat:**

- **Guaranteed Non-Null User Data**: All chat and message responses include complete participant information
- **Intelligent Fallbacks**: System provides meaningful fallback names when profile data is missing:
  - **Performers**: "Unknown Performer" / "Unknown" / "Performer" 
  - **Organizers**: "Unknown Organizer" / "Unknown" / "Organizer"
  - **System Messages**: "System" / "System" / "Message"
  - **Unknown Users**: "Unknown User" / "Unknown" / "User"
- **Frontend Simplicity**: No null checks required for user names in frontend code
- **Type Safety**: TypeScript interfaces guarantee non-null user information

**Review System:**

- Reviews can only be created after gig completion
- Both organizers and performers can review each other
- Each party can only review once per gig
- Ratings are required (1-5 stars), review text is optional

### Real-time WebSocket Integration

**Connection Setup:**

```typescript
class ChatWebSocketService {
    private socket: WebSocket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;

    connect() {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No authentication token available');

        this.socket = new WebSocket(`ws://localhost:8010/ws/chat?token=${encodeURIComponent(token)}`);

        this.socket.onopen = this.handleConnection.bind(this);
        this.socket.onmessage = this.handleMessage.bind(this);
        this.socket.onclose = this.handleDisconnection.bind(this);
        this.socket.onerror = this.handleError.bind(this);
    }

    private handleConnection(event: Event) {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        // User receives automatic USER_ONLINE event
    }

    private handleMessage(event: MessageEvent) {
        const data = JSON.parse(event.data);

        switch (data.type) {
            case 'MESSAGE_RECEIVED':
                this.onNewMessage(data.message);
                break;
            case 'TYPING_STARTED':
                this.onTypingStarted(data.chatId, data.userId);
                break;
            case 'TYPING_STOPPED':
                this.onTypingStopped(data.chatId, data.userId);
                break;
            case 'MESSAGE_READ':
                this.onMessageRead(data.chatId, data.messageId, data.readBy);
                break;
            case 'USER_ONLINE':
                this.onUserOnline(data.userId);
                break;
            case 'USER_OFFLINE':
                this.onUserOffline(data.userId);
                break;
            case 'ERROR':
                console.error('WebSocket error:', data.message);
                break;
        }
    }
}
```

**Chat Room Management:**

```typescript
// Join a chat room after accepting an application
joinChat(chatId
:
string
)
{
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        console.error('WebSocket not connected');
        return;
    }

    const message = {
        type: 'JOIN_CHAT',
        chatId: chatId
    };
    this.socket.send(JSON.stringify(message));
}

// Leave a chat room
leaveChat(chatId
:
string
)
{
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;

    const message = {
        type: 'LEAVE_CHAT',
        chatId: chatId
    };
    this.socket.send(JSON.stringify(message));
}
```

**Typing Indicators:**

```typescript
let typingTimeout: NodeJS.Timeout;

// Handle typing events
handleTypingStart(chatId
:
string
)
{
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;

    // Send typing started event
    this.socket.send(JSON.stringify({
        type: 'START_TYPING',
        chatId: chatId
    }));

    // Auto-stop typing after 3 seconds of inactivity
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        this.handleTypingStop(chatId);
    }, 3000);
}

handleTypingStop(chatId
:
string
)
{
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;

    this.socket.send(JSON.stringify({
        type: 'STOP_TYPING',
        chatId: chatId
    }));
    clearTimeout(typingTimeout);
}
```

**Message Handling:**

```typescript
// Send message (still use REST API, WebSocket broadcasts automatically)
async
sendMessage(chatId
:
string, content
:
string
)
{
    try {
        const response = await fetch(`/api/organizer/chats/${chatId}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({content})
        });

        if (!response.ok) {
            throw new Error('Failed to send message');
        }

        const message = await response.json();
        // Message will be automatically broadcasted to other participants via WebSocket
        return message;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}

// Mark messages as read
async
markMessagesAsRead(chatId
:
string
)
{
    try {
        await fetch(`/api/organizer/chats/${chatId}/read`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        // Read status will be automatically broadcasted via WebSocket
    } catch (error) {
        console.error('Error marking messages as read:', error);
    }
}
```

**Event Handlers for UI Updates:**

```typescript
class ChatUI {
    private webSocketService: ChatWebSocketService;

    constructor() {
        this.webSocketService = new ChatWebSocketService();
        this.setupEventHandlers();
    }

    private setupEventHandlers() {
        this.webSocketService.onNewMessage = (message) => {
            this.displayMessage(message, 'received');
            // Use guaranteed non-null user information
            const senderName = message.sender.displayName;
            this.showNotification(`New message from ${senderName}`);
            this.playNotificationSound();
        };

        this.webSocketService.onTypingStarted = (chatId, userId) => {
            this.showTypingIndicator(chatId, userId);
        };

        this.webSocketService.onTypingStopped = (chatId, userId) => {
            this.hideTypingIndicator(chatId, userId);
        };

        this.webSocketService.onMessageRead = (chatId, messageId, readBy) => {
            this.markMessageAsRead(messageId);
        };

        this.webSocketService.onUserOnline = (userId) => {
            this.updateUserStatus(userId, 'online');
        };

        this.webSocketService.onUserOffline = (userId) => {
            this.updateUserStatus(userId, 'offline');
        };
    }
    
    // Enhanced UI methods using guaranteed user information
    displayMessage(message: MessageDto, type: 'sent' | 'received') {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        
        // Always have sender information available
        const senderInfo = message.sender;
        const senderDisplay = message.isSystemMessage 
            ? senderInfo.displayName  // "System"
            : `${senderInfo.firstName} ${senderInfo.lastName}`;
        
        messageElement.innerHTML = `
            <div class="sender-info">
                ${senderInfo.avatarUrl 
                    ? `<img src="${senderInfo.avatarUrl}" alt="Avatar" class="avatar">` 
                    : `<div class="avatar-placeholder">${senderInfo.firstName[0]}${senderInfo.lastName[0]}</div>`
                }
                <span class="sender-name">${senderDisplay}</span>
            </div>
            <div class="message-content">${message.content}</div>
            <div class="message-time">${new Date(message.sentAt).toLocaleTimeString()}</div>
        `;
        
        document.getElementById('messages-container')?.appendChild(messageElement);
    }
    
    renderChatList(chats: ChatDto[]) {
        const chatListElement = document.getElementById('chat-list');
        if (!chatListElement) return;
        
        chatListElement.innerHTML = chats.map(chat => `
            <div class="chat-item" data-chat-id="${chat.id}">
                <div class="participant-info">
                    ${chat.performer.avatarUrl 
                        ? `<img src="${chat.performer.avatarUrl}" alt="Avatar" class="avatar">` 
                        : `<div class="avatar-placeholder">${chat.performer.firstName[0]}${chat.performer.lastName[0]}</div>`
                    }
                    <div class="participant-details">
                        <div class="participant-name">${chat.performer.displayName}</div>
                        <div class="participant-real-name">${chat.performer.firstName} ${chat.performer.lastName}</div>
                    </div>
                </div>
                <div class="chat-preview">
                    ${chat.lastMessageAt ? `Last message: ${new Date(chat.lastMessageAt).toLocaleDateString()}` : 'No messages yet'}
                </div>
            </div>
        `).join('');
    }
}
```

**Error Handling & Reconnection:**

```typescript
private
handleDisconnection(event
:
CloseEvent
)
{
    console.log('WebSocket disconnected:', event.code, event.reason);

    // Attempt automatic reconnection
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

        setTimeout(() => {
            this.connect();
        }, Math.pow(2, this.reconnectAttempts) * 1000); // Exponential backoff
    } else {
        console.error('Max reconnection attempts reached');
        // Show user notification about connection issues
        this.showConnectionError();
    }
}
```

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

- **WebSocket Integration**: Implement real-time chat with instant message delivery
- **Live Typing Indicators**: Show when performers are typing messages
- **Read Receipts**: Display message read status in real-time
- **Online/Offline Status**: Show participant presence awareness
- **Automatic Reconnection**: Handle connection drops gracefully
- **Fallback Support**: Use REST API when WebSocket unavailable

**User Experience:**

- Clear indication of gig status and what actions are available
- Intuitive application review interface with performer details
- Streamlined hiring workflow with confirmation steps
- **Real-time Chat Interface**: Professional chat UI with typing indicators, read receipts, and online status
- **Notification System**: Desktop/push notifications for new messages
- **Connection Status**: Visual indicators for WebSocket connection health

This document provides the complete context needed to develop the organizer frontend module. For detailed API
specifications, request/response schemas, and interactive testing, refer to the Swagger documentation linked above.