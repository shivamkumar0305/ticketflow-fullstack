# TicketFlow Frontend - Setup Guide

This guide walks you through setting up the TicketFlow frontend to work with your Django backend.

## Prerequisites

- Node.js 18+ installed
- TicketFlow Django API running locally or deployed
- pnpm or npm package manager

## Step 1: Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

## Step 2: Configure API URL

Create `.env.local` in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` and set your API URL:

```env
# Local development with Django running on port 8000
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Deployed API
# NEXT_PUBLIC_API_URL=https://api.ticketflow.example.com/api
```

## Step 3: Start Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

### Dev Server Output
```
  ▲ Next.js 16.2.6
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 1.2s
```

## Step 4: Test the Application

### Without Django Backend

For testing the frontend UI without a backend:

1. The app will try to load from the API and show errors (expected)
2. Network requests will fail with CORS or connection errors
3. This is normal - the app is designed to work with the full API

### With Django Backend

Ensure your Django API is configured:

1. **CORS Headers** - Add to Django settings:
   ```python
   INSTALLED_APPS = [
       # ...
       'corsheaders',
   ]

   MIDDLEWARE = [
       'corsheaders.middleware.CorsMiddleware',
       'django.middleware.common.CommonMiddleware',
       # ...
   ]

   CORS_ALLOWED_ORIGINS = [
       'http://localhost:3000',
       'http://127.0.0.1:3000',
   ]
   ```

2. **JWT Configuration** - Ensure your API uses JWT tokens properly

3. **Test the Flow**:
   - Navigate to `http://localhost:3000`
   - Redirects to login (no auth token)
   - Register a new account or login with existing credentials
   - Should see the ticket dashboard
   - Create a new ticket
   - View ticket details and add comments

## Frontend API Endpoints Expected

The frontend expects these Django REST API endpoints:

### Account Management
- `POST /api/account/login/` - Sign in with email/password
- `POST /api/account/register/` - Create new account
- `GET /api/account/profile/` - Get current user info
- `PUT /api/account/profile/` - Update user profile
- `POST /api/account/logout/` - Sign out (clear session)
- `GET /api/account/staff/` - List staff members (admin only)

### Ticket Operations
- `GET /api/tickets/` - List all tickets (with optional filters)
- `POST /api/tickets/` - Create new ticket
- `GET /api/tickets/{id}/` - Get ticket detail
- `PATCH /api/tickets/{id}/` - Update ticket (status, priority, etc.)
- `DELETE /api/tickets/{id}/` - Delete ticket
- `POST /api/tickets/{id}/assign/` - Assign ticket to staff member

### Comments
- `GET /api/comments/?ticket={id}` - Get comments for a ticket
- `POST /api/comments/` - Create new comment
- `PATCH /api/comments/{id}/` - Update comment
- `DELETE /api/comments/{id}/` - Delete comment

## API Response Format

The frontend expects standard JSON responses:

### Success (2xx)
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "is_staff": false
}
```

### Login Success
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "is_staff": false
  }
}
```

### Error (4xx/5xx)
```json
{
  "detail": "Invalid credentials",
  "error_code": "invalid_login"
}
```

## Troubleshooting

### "Failed to load tickets" Error

**Possible Causes:**
1. API URL is incorrect in `.env.local`
2. Django API is not running
3. CORS headers not configured
4. Token has expired

**Solution:**
1. Check `.env.local` points to correct API URL
2. Verify Django dev server is running: `python manage.py runserver`
3. Check browser console (F12) for CORS errors
4. Try logging out and back in

### Login Page Shows But Can't Submit

**Possible Causes:**
1. Network request failing silently
2. API endpoint doesn't exist
3. Request timeout

**Solution:**
1. Open browser DevTools (F12) → Network tab
2. Try to login and check the request to `/api/account/login/`
3. Look for error responses or timeouts
4. Check console (Console tab) for JavaScript errors

### Comments Not Loading

**Possible Causes:**
1. Comments endpoint not implemented
2. Ticket ID not passed correctly
3. User doesn't have permission

**Solution:**
1. Check `/api/comments/?ticket=1` endpoint exists
2. Verify response includes `created_by` user info
3. Ensure ticket exists before viewing

### Admin Dashboard Not Visible

**Check:**
1. User must have `is_staff: true` from backend
2. Only staff can access `/app/admin`
3. Regular users see 404

**Solution:**
- In Django admin, set `is_staff=True` on the user account

## Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Set environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy!

```bash
vercel
```

### Deploy to Other Platforms

Export as static or use serverless deployment:

```bash
# Build
pnpm build

# Output in .next directory
# Deploy the .next directory + public folder
```

## Development Tips

### Enable React DevTools

```bash
agent-browser open --enable react-devtools http://localhost:3000
```

### Check Network Requests

Browser DevTools → Network tab:
- Filter by "Fetch/XHR"
- Check request headers for `Authorization: Bearer {token}`
- Inspect response payloads
- Watch for 401 errors (token expired)

### Local Storage

Check saved auth token:
```javascript
localStorage.getItem('authToken')
```

Clear auth if stuck:
```javascript
localStorage.removeItem('authToken')
```

## Next Steps

1. **Customize Theme** - Edit `app/globals.css` design tokens
2. **Add More Features** - Build on top of existing components
3. **Improve Styling** - Check `components/tickets-list.tsx` for example
4. **Add Tests** - Create `.test.tsx` files next to components
5. **Connect to Vercel** - Set `NEXT_PUBLIC_API_URL` in project settings

## Support

For issues:
1. Check the main README.md
2. Look at browser console errors (F12)
3. Check Django logs for API errors
4. Verify CORS configuration
5. Test API endpoints with curl or Postman
