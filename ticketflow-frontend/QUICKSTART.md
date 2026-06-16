# Quick Start - TicketFlow Frontend

Get up and running in 5 minutes!

## 1. Install & Run

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit: `http://localhost:3000`

## 2. Connect Your API

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Replace with your actual API URL.

## 3. Test It Out

1. Go to `/register` and create an account
2. Login with your credentials
3. Click "New Ticket" to create a support ticket
4. Click ticket to view details and add comments
5. If you're staff, visit `/app/admin` to manage all tickets

## Key Files to Understand

| File | Purpose |
|------|---------|
| `lib/auth-context.tsx` | User authentication & state |
| `lib/api.ts` | API client with auto token refresh |
| `app/(app)/page.tsx` | Main dashboard |
| `app/globals.css` | Dark theme design tokens |

## What's Built

✅ Login & Registration with JWT  
✅ Ticket Management (Create, View, Update Status)  
✅ Comments System  
✅ Admin Dashboard for Staff  
✅ Dark Theme (Notion/Vercel Inspired)  
✅ Responsive Design  
✅ Protected Routes  

## Customization

### Change Theme Colors
Edit `app/globals.css` color values:
```css
:root {
  --primary: oklch(0.52 0.18 264);  /* Blue */
  --background: oklch(0.08 0 0);    /* Near-black */
}
```

### Add New Pages
Create files in `app/(app)/`:
```bash
mkdir app/(app)/tickets/new
# Create page.tsx inside
```

### Modify Components
All components are in `components/` - edit freely!

## API Requirements

Your Django API should provide:

### Endpoints
- `POST /api/account/login/` - Returns `{ access, refresh, user }`
- `POST /api/account/register/` - Create new account
- `GET /api/tickets/` - List tickets
- `POST /api/tickets/` - Create ticket
- `GET /api/comments/?ticket=X` - List comments

### CORS Setup (Django)
```python
INSTALLED_APPS = ['corsheaders', ...]
MIDDLEWARE = ['corsheaders.middleware.CorsMiddleware', ...]
CORS_ALLOWED_ORIGINS = ['http://localhost:3000']
```

## Troubleshooting

**Can't login?**
- Check API URL in `.env.local`
- Verify Django API is running
- Check browser console (F12) for errors

**Comments not showing?**
- Ensure API returns `created_by` with user info
- Check ticket ID in URL

**Admin panel missing?**
- User must have `is_staff=true` in database
- Only staff can access `/app/admin`

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variable in Vercel dashboard:
# NEXT_PUBLIC_API_URL = your api url
```

## Learn More

- `README.md` - Full documentation
- `SETUP.md` - Detailed setup guide
- `FEATURES.md` - Complete feature list

## File Structure

```
app/                 # Next.js App Router
├── (app)/          # Protected routes (auth required)
├── login/          # Sign in page
├── register/       # Sign up page
lib/                # Utilities
├── api.ts          # API client
├── auth-context.tsx # Auth state
components/         # React components
├── ui/             # shadcn UI components
└── tickets-list.tsx # Reusable ticket list
```

## Next Steps

1. **Connect API** - Update `.env.local` with your API URL
2. **Test Flow** - Register, create ticket, view comments
3. **Customize** - Edit colors, add features, deploy
4. **Integrate** - Connect to your Django backend

## Support

For detailed help, see:
- Browser console errors (F12 → Console)
- Network requests (F12 → Network)
- API response details in Network tab
- Django logs for backend errors

---

**Built with Next.js 16, React 19, shadcn/ui, and Tailwind CSS**
