# Vybup Organizer Dashboard

A modern, responsive web application for event organizers to manage gigs, review performer applications, and connect with talent.

## Features

### ✅ Completed
- **Authentication System**: Sign in/Sign up pages with form validation
- **Responsive Dashboard Layout**: Clean sidebar navigation that works on mobile and desktop
- **Dashboard Home**: Overview stats, quick actions, and recent gigs
- **Gig Management**: 
  - View all gigs with filtering and search
  - Create new gigs with comprehensive form
  - Manage gig status (draft, open, booked, completed)
- **Application Review**: 
  - Review performer applications with detailed profiles
  - Accept/reject applications with messaging
  - Tabbed interface for different application statuses
- **Profile Management**: 
  - Personal information and business context
  - Account statistics and verification status
- **API Integration**: Full API client setup ready for backend connection

### 🔄 Coming Soon
- Messages/Chat system
- Payment management
- Reviews and ratings
- Advanced settings

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **State Management**: React hooks (ready for Zustand/Redux if needed)

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open** [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # Shadcn/ui components
│   └── dashboard/        # Dashboard-specific components
├── lib/                  # Utilities and API client
├── types/                # TypeScript type definitions
└── globals.css           # Global styles
```

## API Integration

The app is ready to connect to the Vybup backend API. The API client in `src/lib/api.ts` includes all necessary endpoints:

- Authentication (sign up, sign in)
- Profile management
- Gig CRUD operations
- Application management
- Statistics and more

## Design Philosophy

- **Clean & Modern**: Professional SaaS-style interface
- **Mobile-First**: Responsive design that works on all devices
- **User-Centric**: Intuitive workflows for organizers
- **Scalable**: Component-based architecture for easy expansion

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8010
```

## Deployment

Ready for deployment on Vercel, Netlify, or any other platform that supports Next.js.

```bash
npm run build
npm start
```