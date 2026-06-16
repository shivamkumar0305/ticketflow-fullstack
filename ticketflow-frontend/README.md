# TicketFlow Frontend

A modern, minimal dark-themed ticket management frontend built with Next.js 16, React 19, and shadcn/ui. Designed to integrate with the TicketFlow Django backend API.

## Features

- **Authentication**: JWT-based login and registration with httpOnly cookie support
- **Ticket Management**: Create, view, and manage support tickets
- **Comments**: Add comments to tickets for communication
- **Admin Dashboard**: Staff-only dashboard for managing all tickets and assignments
- **Role-Based Access**: Differentiated views for customers and staff members
- **Dark Theme**: Professional dark interface inspired by Notion and Vercel
- **Responsive Design**: Mobile-friendly layouts with clean typography
- **Real-time Updates**: Comments and ticket status updates

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI Components**: shadcn/ui with Tailwind CSS v4
- **Styling**: Dark theme with semantic design tokens
- **State Management**: React Context API for auth
- **HTTP Client**: Native Fetch with automatic token refresh
- **Typography**: Geist Sans & Mono fonts from Vercel

## Setup

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Configure environment**:
   Create `.env.local` (copy from `.env.example`):
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```
   Update `NEXT_PUBLIC_API_URL` to point to your TicketFlow Django API.

3. **Start development server**:
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── (app)/                      # Protected routes with AuthProvider
│   ├── page.tsx               # Dashboard/ticket list
│   ├── new/                   # Create new ticket
│   ├── tickets/[id]/          # Ticket detail & comments
│   ├── admin/                 # Staff-only dashboard
│   └── profile/               # User profile
├── login/                     # Login page
├── register/                  # Registration page
├── layout.tsx                 # Root layout with dark theme
└── globals.css                # Dark theme design tokens

lib/
├── api.ts                     # API client with auth
├── auth-context.tsx           # Auth state management

components/
├── ui/                        # shadcn/ui components
└── tickets-list.tsx           # Reusable tickets list component
```

## Key Files

### Authentication (`lib/auth-context.tsx`)
Provides `AuthProvider` and `useAuth()` hook:
```tsx
const { user, isAuthenticated, login, register, logout } = useAuth()
```

### API Client (`lib/api.ts`)
Centralized API with automatic token management:
```tsx
await api.auth.login(email, password)
await api.tickets.list()
await api.comments.create(ticketId, text)
```

### Dark Theme (`app/globals.css`)
- Background: `oklch(0.08 0 0)` (near-black)
- Primary Blue: `oklch(0.52 0.18 264)` (accent color)
- Text: `oklch(0.95 0 0)` (near-white)
- Borders: Subtle 8% white opacity

## Pages & Routes

### Public Routes
- `/` - Redirect to login or /app based on auth
- `/login` - Sign in page
- `/register` - Create account page

### Protected Routes (require authentication)
- `/app` - Dashboard with ticket list
- `/app/new` - Create new ticket
- `/app/tickets/[id]` - Ticket detail with comments
- `/app/profile` - User profile and settings

### Admin Routes (staff only)
- `/app/admin` - Staff dashboard with ticket assignments and metrics

## Features in Detail

### Ticket List
- Filter by status (All, Open, In Progress, Closed)
- Display priority with icons
- Relative timestamps (just now, 2h ago, etc.)
- Quick access to ticket details

### Ticket Detail
- Full ticket information
- Comment thread
- Status management (staff only)
- Comment deletion for author/staff

### Admin Dashboard
- Metrics: Total tickets, unassigned, in progress
- Assign tickets to staff members
- Filter and manage all tickets
- Quick access to ticket details

## API Integration

The frontend communicates with a Django REST API. Expected endpoints:

```
POST   /api/account/login/          - Sign in
POST   /api/account/register/       - Create account
GET    /api/account/profile/        - Get current user
PUT    /api/account/profile/        - Update profile
POST   /api/account/logout/         - Sign out
GET    /api/account/staff/          - List staff (admin)

GET    /api/tickets/                - List tickets
POST   /api/tickets/                - Create ticket
GET    /api/tickets/{id}/           - Get ticket detail
PATCH  /api/tickets/{id}/           - Update ticket
DELETE /api/tickets/{id}/           - Delete ticket
POST   /api/tickets/{id}/assign/    - Assign to staff

GET    /api/comments/?ticket={id}   - List comments
POST   /api/comments/               - Create comment
PATCH  /api/comments/{id}/          - Update comment
DELETE /api/comments/{id}/          - Delete comment
```

### Response Format
The API client expects:
- Success: `{ access: string, data: any }`
- Error: `{ detail: string, [key]: any }`
- Status codes: 200/201 = success, 401 = unauthorized, 4xx/5xx = error

## Authentication Flow

1. **Login**: POST email + password → receive JWT token
2. **Token Storage**: Token stored in `localStorage` (httpOnly cookie via API)
3. **Requests**: All subsequent requests include `Authorization: Bearer {token}`
4. **Token Refresh**: Automatic refresh on 401 response
5. **Logout**: Clear token and redirect to login

## Customization

### Colors
Edit design tokens in `app/globals.css`:
```css
:root {
  --primary: oklch(...);     /* Main brand color */
  --accent: oklch(...);      /* Accent color */
  --background: oklch(...);  /* Page background */
  --foreground: oklch(...);  /* Text color */
}
```

### Typography
Fonts configured in `app/layout.tsx`:
```tsx
const geistSans = Geist({ variable: '--font-geist-sans' })
```

### Components
Add/customize shadcn components:
```bash
pnpm exec shadcn add [component-name]
```

## Performance Tips

- Use `next/image` for images
- Leverage `<Suspense>` for streaming
- Optimize by removing unused shadcn components
- Use `pnpm install --no-frozen-lockfile` for dependency updates

## Debugging

### Check Console
Browser DevTools → Console tab for errors

### Network Requests
Browser DevTools → Network tab to inspect API calls

### Auth Issues
Check `localStorage` for `authToken` key

### CORS Problems
Ensure Django API has correct CORS headers:
```python
ALLOWED_HOSTS = ['localhost', '127.0.0.1']
CORS_ALLOWED_ORIGINS = ['http://localhost:3000']
```

## Deployment

### Vercel (Recommended)
```bash
vercel
```

### Docker
```bash
docker build -t ticketflow-frontend .
docker run -p 3000:3000 ticketflow-frontend
```

### Environment Variables
Set in deployment platform:
- `NEXT_PUBLIC_API_URL` - Your Django API URL

## Common Issues

**Q: "Unauthorized" error after login?**
A: Check that token is being stored in localStorage and included in requests.

**Q: Comments not showing?**
A: Verify Django API returns comments with proper user data.

**Q: Admin features not visible?**
A: Ensure user has `is_staff=true` from backend.

**Q: Dark mode not applied?**
A: Check that `<html class="dark">` is set in layout.tsx.

## Contributing

When adding features:
1. Keep components small and reusable
2. Use semantic HTML and ARIA attributes
3. Follow the existing file structure
4. Test with dark theme
5. Update this README

## License

MIT - See LICENSE file for details
