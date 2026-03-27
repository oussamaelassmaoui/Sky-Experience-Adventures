# SkyExperience Frontend 🎈

A modern, multilingual Next.js application for hot air balloon flight bookings in Marrakech, Morocco.

## ✨ Features

- 🌍 **Multilingual Support** - English & French with dynamic routing
- 🎨 **Modern UI/UX** - Beautiful design with Tailwind CSS & Framer Motion
- 📱 **Fully Responsive** - Works seamlessly on all devices
- 🔍 **SEO Optimized** - Built-in SEO features and metadata
- 🎯 **Smart Booking System** - Interactive calendar and booking flow
- 💳 **Multi-Currency** - Support for USD, EUR, MAD
- 📝 **Blog & CMS** - Dynamic blog with markdown support
- 👨‍💼 **Admin Dashboard** - Complete management interface
- 🚀 **Performance** - Optimized with Next.js 16 and Turbopack

## 🛠️ Technologies

- **Framework**: Next.js 16.1.6 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Markdown**: React Markdown / MD Editor

## 📋 Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Backend API running (see [backend repo](https://github.com/imadev26/BackendSky))

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/imadev26/FrontendSky.git
cd FrontendSky
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and set your backend API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Clean build files
npm run clean
```

## 🌐 Language Support

The app supports English (`en`) and French (`fr`) with automatic routing:

- English: `/en/*`
- French: `/fr/*`

Language detection is automatic based on browser preferences.

## 📁 Project Structure

```
webnext/
├── app/                    # Next.js app directory
│   ├── [lang]/            # Language-based routing
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Home page
│   │   ├── about/         # About page
│   │   ├── flights/       # Flight listings & details
│   │   ├── booking/       # Booking flow
│   │   ├── blogs/         # Blog pages
│   │   ├── contact/       # Contact page
│   │   └── admin/         # Admin dashboard
│   └── data/              # Static data & types
├── components/            # Reusable components
│   ├── admin/            # Admin-specific components
│   └── Footer/           # Footer component
├── context/              # React context providers
├── dictionaries/         # Translation files
│   ├── en.json          # English translations
│   └── fr.json          # French translations
├── hooks/               # Custom React hooks
├── services/            # API services
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── public/              # Static assets
    └── images/          # Image assets
```

## 🎨 Key Features

### Multi-language Routing

The app uses Next.js dynamic routing with language prefixes:

```typescript
// Automatic language detection
middleware.ts handles language redirection
```

### Booking System

Complete booking flow with:
- Flight selection
- Date picker with availability
- Passenger information
- Payment integration ready

### Admin Dashboard

Full-featured admin panel for managing:
- ✈️ Flights
- 📝 Blog posts
- 📋 Reservations
- 👥 Users
- 💬 Reviews
- 📊 Dashboard analytics

### SEO Optimization

- Dynamic metadata generation
- Sitemap.xml support
- Robots.txt configuration
- Open Graph tags
- Structured data (JSON-LD)

## 🔗 API Integration

The frontend communicates with the backend API. Configure the API URL in `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-api-url.com/api
```

API endpoints used:
- `GET /flights` - List all flights
- `GET /flights/:id` - Flight details
- `POST /reservations` - Create booking
- `GET /blogs` - Blog posts
- `POST /contact` - Contact form
- `/admin/*` - Admin operations

## 🐳 Docker Deployment

Build and run with Docker:

```bash
# Build image
docker build -t skyexperience-frontend .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://your-api.com/api \
  skyexperience-frontend
```

## 🚀 Production Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy!

### Other Platforms

Compatible with:
- Netlify
- Railway
- Render
- AWS Amplify
- Any Node.js hosting

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API endpoint | `http://localhost:5000/api` |

## 🐛 Troubleshooting

### Port already in use

```bash
# Kill process on port 3000
npx kill-port 3000
```

### Build errors

```bash
# Clean and reinstall
npm run clean
rm -rf node_modules package-lock.json
npm install
```

### API connection issues

- Verify backend is running
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure CORS is configured on backend

## 📄 License

This project is proprietary and confidential.

## 👨‍💻 Author

**Imad Adaoumoum**
- GitHub: [@oussamaelassmaoui](https://github.com/oussamaelassmaoui)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting solutions
- All contributors and testers

---

**SkyExperience** - Making dreams take flight! 🎈✨
