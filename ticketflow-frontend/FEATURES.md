# TicketFlow Frontend - Features & Components

Comprehensive documentation of all features, components, and capabilities in the TicketFlow frontend application.

## Application Features

### Authentication System
- **Sign Up**: Register new account with email, password, and full name
- **Sign In**: Login with email and password
- **Session Management**: JWT token-based authentication with httpOnly cookie support
- **Auto Token Refresh**: Automatic token refresh on 401 responses
- **Protected Routes**: All `/app/*` routes require authentication
- **Sign Out**: Clear session and redirect to login

### Ticket Management
- **Create Tickets**: Submit new support tickets with title, description, and priority
- **View Tickets**: Browse all your tickets with real-time status
- **Filter Tickets**: Filter by status (All, Open, In Progress, Closed)
- **Ticket Details**: View complete ticket information including:
  - Title and description
  - Status (customer can only view, staff can update)
  - Priority level with visual indicators
  - Customer email
  - Creation date
  - Assignment information
- **Priority Levels**: Low, Medium, High with corresponding icons
- **Status Tracking**: Open, In Progress, On Hold, Closed

### Comment System
- **Add Comments**: Leave comments on any ticket
- **View Comments**: See all comments with timestamps and author info
- **Edit Comments**: Customers can edit their own comments
- **Delete Comments**: Authors and staff can delete comments
- **Rich Formatting**: Comments support line breaks and plain text

### Admin Features (Staff Only)
- **Admin Dashboard**: Dedicated staff management interface at `/app/admin`
- **Metrics Dashboard**: Real-time metrics showing:
  - Total ticket count
  - Unassigned tickets count
  - In-progress tickets count
- **Ticket Assignment**: Assign unassigned tickets to staff members
- **Bulk Status Management**: Update ticket statuses from admin dashboard
- **Staff List**: View all available staff members for assignment
- **Advanced Filtering**: Filter tickets by status in admin view

### User Profile
- **Profile Information**: View your account details
- **User Details**: See full name, email, role, and account status
- **Logout**: Sign out from any page via the profile section

## Pages & Routes

### Public Pages
```
/                    Root redirect (to /login or /app)
/login               Sign in page
/register            Create account page
```

### Protected Pages (Authentication Required)
```
/app                 Dashboard - ticket list
/app/new             Create new ticket
/app/tickets/[id]    View ticket detail & comments
/app/profile         User profile
```

### Admin Pages (Staff Only)
```
/app/admin           Staff dashboard & ticket management
```

## Components & Architecture

### Layout Components
- **RootLayout** (`app/layout.tsx`) - Wraps entire app with AuthProvider and dark theme
- **AppLayout** (`app/(app)/layout.tsx`) - Protected routes group with auth check
- **Header Bars** - Consistent navigation headers on all pages

### Authentication Components
- **AuthProvider** (`lib/auth-context.tsx`) - React Context for user state
- **useAuth Hook** - Access authentication state and methods globally
- **Login Form** - Email/password input with validation
- **Register Form** - Sign up with full name, email, password

### Ticket Components
- **TicketsList** (`components/tickets-list.tsx`) - Reusable ticket list with filtering
- **Ticket Cards** - Individual ticket display with status badge
- **Comment Thread** - Nested comment view with delete functionality
- **Status Badge** - Color-coded status indicators
- **Priority Icon** - Visual priority indicators

### Admin Components
- **Metrics Grid** - Dashboard statistics display
- **Assignment Selector** - Dropdown staff selection for assignment
- **Admin Filters** - Status and type filtering controls

### UI Components (shadcn/ui)
- **Button** - Primary, secondary, ghost variants
- **Badge** - Status and tag display
- **Input/Textarea** - Form field controls
- **Select** - Dropdown selections

## API Integration

### Authentication Endpoints
```
POST   /account/login/          Login
POST   /account/register/       Create account  
GET    /account/profile/        Get user info
PUT    /account/profile/        Update profile
POST   /account/logout/         Sign out
GET    /account/staff/          List staff (admin)
```

### Ticket Endpoints
```
GET    /tickets/                List tickets (filterable)
POST   /tickets/                Create ticket
GET    /tickets/{id}/           Get ticket detail
PATCH  /tickets/{id}/           Update ticket
DELETE /tickets/{id}/           Delete ticket
POST   /tickets/{id}/assign/    Assign to staff
```

### Comment Endpoints
```
GET    /comments/?ticket={id}   List comments
POST   /comments/               Create comment
PATCH  /comments/{id}/          Update comment
DELETE /comments/{id}/          Delete comment
```

## User Roles & Permissions

### Customer (is_staff = false)
- Create tickets for themselves
- View their own tickets
- View ticket details
- Add comments to tickets
- Edit/delete own comments
- View profile
- Cannot access admin features

### Staff (is_staff = true)
- View all tickets
- Update ticket status
- Assign tickets to other staff
- Delete any comment
- Access admin dashboard
- View metrics and assignments

## Design System

### Color Palette
- **Background**: Near-black (`#0a0a0a`)
- **Card Background**: Slightly lighter gray (`#1a1a1a`)
- **Primary Accent**: Blue (`#3366ff`)
- **Text**: Near-white (`#f2f2f2`)
- **Subtle Border**: 8% white opacity
- **Status Colors**:
  - Open: Blue
  - In Progress: Yellow/Orange
  - Closed: Green
  - On Hold: Gray

### Typography
- **Font Family**: Geist Sans (primary), Geist Mono (code)
- **Heading Size**: 24-32px, bold
- **Body Size**: 14-16px, regular
- **Spacing**: 8px baseline grid
- **Line Height**: 1.5-1.6 for readability

### Components Styling
- **Border Radius**: 0.5rem (8px)
- **Shadows**: Subtle on hover, none at rest
- **Transitions**: 150-200ms on interactions
- **Focus States**: Primary ring color with offset

## State Management

### Auth Context
Managed via React Context API:
```typescript
{
  user: User | null,              // Current user object
  isAuthenticated: boolean,        // Auth state
  isLoading: boolean,              // Loading state
  login: (email, password) => Promise<void>,
  register: (email, password, fullName) => Promise<void>,
  logout: () => Promise<void>,
  refreshUser: () => Promise<void>
}
```

### Data Fetching
- No external state library (Redux, Zustand)
- Uses native `fetch` API with custom hooks
- Consider SWR or React Query for production scaling

### Local Storage
- `authToken` - JWT token for authentication
- Auto-cleared on logout or 401 response

## Error Handling

### Network Errors
- 401 Unauthorized - Auto-redirect to login
- 400 Bad Request - Show validation errors
- 404 Not Found - Show "not found" message
- 500+ Server Error - Show server error message

### User Feedback
- Toast-like error messages in UI
- Form validation feedback
- Loading states on async operations
- Disabled buttons during submission

## Performance Considerations

### Optimizations
- Code splitting via Next.js App Router
- Static page pre-rendering where possible
- Dynamic routes for ticket details
- Lazy component loading

### Future Improvements
- Add image optimization with `next/image`
- Implement SWR or React Query for caching
- Add pagination for large ticket lists
- Optimize bundle with tree-shaking
- Add performance monitoring

## Accessibility

### ARIA Support
- Semantic HTML (heading, main, nav)
- Proper label associations
- Button and form semantics
- Skip links where appropriate

### Keyboard Navigation
- Tab through all interactive elements
- Enter to submit forms
- Escape to close modals
- Screen reader support planned

## Testing Scenarios

### Authentication Flow
1. Unauthed user → redirects to login
2. Login with credentials → stored token
3. Verified by fetching profile
4. Token refresh on 401
5. Logout clears token

### Ticket Workflow (Customer)
1. Create new ticket
2. View in list
3. Click to detail
4. Add comment
5. See updated list

### Admin Workflow (Staff)
1. View admin dashboard
2. See unassigned tickets
3. Assign to staff member
4. Update ticket status
5. View metrics update

## File Structure Summary

```
TicketFlow Frontend/
├── app/
│   ├── (app)/                  # Protected routes
│   │   ├── layout.tsx          # AuthProvider wrapper
│   │   ├── page.tsx            # Main dashboard
│   │   ├── new/                # Create ticket
│   │   ├── tickets/[id]/       # Ticket detail
│   │   ├── profile/            # User profile
│   │   └── admin/              # Staff dashboard
│   ├── login/                  # Public login
│   ├── register/               # Public signup
│   ├── page.tsx                # Root redirect
│   ├── layout.tsx              # Root layout + auth
│   └── globals.css             # Dark theme tokens
├── lib/
│   ├── api.ts                  # API client
│   └── auth-context.tsx        # Auth state
├── components/
│   ├── ui/                     # shadcn components
│   └── tickets-list.tsx        # Ticket list component
├── .env.example                # Environment template
├── README.md                   # Main documentation
├── SETUP.md                    # Setup instructions
└── FEATURES.md                 # This file
```

## Future Enhancement Ideas

- Push notifications for ticket updates
- Email notifications
- Ticket search with full-text search
- Custom priority/status labels
- Ticket templates
- SLA tracking and alerts
- Bulk operations
- Ticket history/audit log
- Knowledge base integration
- Live chat support
- Mobile app
- Dark mode toggle (currently dark-only)
- Internationalization/i18n
- File attachments
- Ticket tags/categories
- Department routing
- Customer satisfaction ratings

## Maintenance & Support

### Regular Updates
- Update dependencies monthly
- Review security advisories
- Keep Next.js current
- Monitor bundle size

### Monitoring
- Error tracking (Sentry recommended)
- Performance monitoring (Web Vitals)
- User analytics
- API response times

### Documentation
- Keep README current
- Document any custom changes
- Maintain API contract docs
- Update this features list

