# Documentation Index

**Start here if you're new to this project!**

## 📚 Reading Order

### 1. **PROJECT_SUMMARY.md** (This is you, start here!)
High-level overview of the entire project, tech stack, file structure, and what's been built.

### 2. **QUICKSTART.md** (5-minute setup)
The fastest way to get the app running locally:
- Install dependencies
- Configure API URL
- Start development server
- Test basic features

### 3. **SETUP.md** (Detailed setup guide)
In-depth setup instructions if you run into issues:
- Prerequisites check
- Step-by-step configuration
- CORS setup for Django
- Testing endpoints
- Troubleshooting guide

### 4. **README.md** (Full documentation)
Comprehensive reference for everything in the project:
- Features overview
- Tech stack details
- Project structure
- Pages & routes
- Key files explained
- API integration details
- Authentication flow
- Customization guide
- Performance tips
- Deployment instructions

### 5. **FEATURES.md** (Feature breakdown)
Deep dive into all features, components, and capabilities:
- Application features
- Page routes
- Component architecture
- API endpoints
- User roles & permissions
- Design system details
- State management
- Error handling
- Accessibility info
- Testing scenarios
- Future enhancement ideas

---

## 🎯 Quick Navigation

### I want to...

**Get it running immediately**
→ Go to **QUICKSTART.md**

**Understand what was built**
→ Read **PROJECT_SUMMARY.md**

**Integrate with my Django API**
→ See **Setup.md** → API Configuration section

**Customize colors & design**
→ Check **README.md** → Customization section

**Deploy to production**
→ Read **README.md** → Deployment section

**Debug an issue**
→ Look in **SETUP.md** → Troubleshooting

**Learn about all features**
→ Study **FEATURES.md**

**Understand the code structure**
→ Read **README.md** → Project Structure

---

## 📋 What's Included

### Documentation Files (5)
- `DOCS_INDEX.md` - This file
- `PROJECT_SUMMARY.md` - High-level overview
- `QUICKSTART.md` - 5-minute setup
- `SETUP.md` - Detailed setup guide  
- `FEATURES.md` - Complete feature list
- `README.md` - Full documentation

### Source Code Files (19)
- **Pages**: 8 route handlers
- **Components**: 2 reusable components  
- **Utilities**: 2 helper modules
- **Styles**: Global CSS with dark theme
- **Config**: Next.js, TypeScript, package.json

### Configuration Files
- `.env.example` - Environment variables template
- `next.config.mjs` - Next.js configuration
- `tsconfig.json` - TypeScript settings
- `package.json` - Dependencies and scripts

---

## 🚀 Quick Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Deploy to Vercel
vercel
```

---

## 🏗️ Project Structure at a Glance

```
App Routes:
  /                    ← Redirect to /login or /app
  /login              ← Sign in page
  /register           ← Create account page
  /app                ← Main dashboard (protected)
  /app/new            ← Create ticket (protected)
  /app/tickets/[id]   ← Ticket detail (protected)
  /app/profile        ← User profile (protected)
  /app/admin          ← Admin panel (staff only)

Core Files:
  lib/api.ts                    ← API client
  lib/auth-context.tsx          ← Auth state management
  components/tickets-list.tsx   ← Reusable ticket list
  app/globals.css               ← Dark theme design tokens

UI Framework:
  shadcn/ui Button component
  shadcn/ui Badge component
  Tailwind CSS utilities
```

---

## 🎨 Design Highlights

**Dark Theme** 
- Background: Near-black (#0a0a0a)
- Text: Near-white (#f2f2f2)
- Accent: Blue (#3366ff)
- Inspired by Notion and Vercel

**Typography**
- Headings: Geist Sans, bold
- Body: Geist Sans, regular
- Code: Geist Mono

**Responsive**
- Mobile-first design
- Works on all screen sizes
- Touch-friendly controls

---

## 🔐 Security Features

- JWT token-based authentication
- httpOnly cookie support
- Automatic token refresh on 401
- Protected routes require login
- Role-based access control (staff vs customers)
- Input validation on forms
- XSS protection via React

---

## 🌐 API Integration

The app expects a Django REST API with these main endpoints:

**Auth**: `/api/account/login/`, `/api/account/register/`, `/api/account/logout/`
**Tickets**: `/api/tickets/`, `/api/tickets/{id}/`, `/api/tickets/{id}/assign/`
**Comments**: `/api/comments/`, `/api/comments/{id}/`
**Staff**: `/api/account/staff/` (admin only)

See **SETUP.md** for detailed endpoint documentation.

---

## 📱 Supported Browsers

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🛠️ Technology Stack

**Framework**: Next.js 16 with App Router  
**UI Library**: React 19.2  
**Styling**: Tailwind CSS v4  
**Components**: shadcn/ui  
**State**: React Context API  
**HTTP**: Fetch API  
**Fonts**: Geist Sans & Mono  

---

## 📈 Performance

- Static page pre-rendering where possible
- Code splitting via Next.js App Router
- Dark theme reduces eye strain
- Minimal external dependencies
- Fast development refresh with Turbopack

---

## ✅ What's Ready

- [x] Complete authentication system
- [x] Ticket management interface
- [x] Comments system
- [x] Admin dashboard
- [x] Dark theme design
- [x] Responsive layouts
- [x] Error handling
- [x] Documentation
- [x] Production-ready build

---

## 🎯 Next Steps

1. **Read QUICKSTART.md** - Get it running in 5 minutes
2. **Configure .env.local** - Point to your Django API
3. **Start dev server** - `pnpm dev`
4. **Test the flow** - Register, create ticket, comment
5. **Customize** - Update colors, add your branding
6. **Deploy** - Push to production

---

## 📞 Support

For issues or questions:

1. Check the relevant documentation file above
2. Review **SETUP.md** troubleshooting section
3. Inspect browser console (F12 → Console tab)
4. Check network requests (F12 → Network tab)
5. Verify Django API is running and CORS configured

---

## 📄 File Legend

- **.md** - Documentation (read in browser)
- **.tsx** - React components with TypeScript
- **.ts** - TypeScript utilities
- **.css** - Stylesheets
- **.json** - Configuration files

---

## 🎓 Learning Resources

- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **shadcn/ui**: https://ui.shadcn.com
- **TypeScript**: https://www.typescriptlang.org

---

## 💡 Tips

- Use browser DevTools (F12) to debug
- Check localStorage for auth token: `authToken`
- API errors show in network tab
- CSS changes reflect immediately with hot reload
- Add `console.log()` for debugging

---

**You're all set! Start with QUICKSTART.md →**

