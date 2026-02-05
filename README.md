# CyberCity - Laptop Range Management System

A modern, full-stack admin panel and customer viewport for managing laptop inventory by price ranges.

## 🚀 Features

### Admin Panel

- Upload laptop images with price range categorization
- Add descriptions for each price range
- Filter and view uploaded laptops by range
- Generate shareable URLs for customer viewing
- Copy-to-clipboard functionality for WhatsApp sharing
- Responsive dashboard with modern UI

### Customer Viewport

- View laptop inventory by shared URL
- Clean, attractive product showcase
- Mobile-responsive design
- Fast loading with optimized images

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: Ant Design 5
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Styling**: CSS Modules + Ant Design theming
- **Deployment**: Vercel (serverless functions)

## 📦 Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account
- Git

## 🔧 Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd cybercity-admin
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Environment Setup**

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. **Supabase Setup**

Run the SQL schema provided in `/supabase/schema.sql` in your Supabase SQL Editor.

5. **Configure Storage**

In Supabase Dashboard:

- Go to Storage
- Create a bucket named `laptop-images`
- Set it to public

6. **Run Development Server**

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000`

## 📁 Project Structure

```
cybercity-admin/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── page.tsx          # Admin dashboard
│   │   │   └── layout.tsx
│   │   ├── range/
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Customer view page
│   │   ├── api/
│   │   │   ├── ranges/
│   │   │   │   └── route.ts      # Range API endpoints
│   │   │   └── upload/
│   │   │       └── route.ts      # Upload API endpoint
│   │   ├── layout.tsx
│   │   └── page.tsx              # Landing page
│   ├── components/
│   │   ├── admin/
│   │   │   ├── UploadForm.tsx
│   │   │   ├── RangeFilter.tsx
│   │   │   └── LaptopGrid.tsx
│   │   └── customer/
│   │       └── ProductShowcase.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   └── server.ts
│   │   └── types.ts
│   └── styles/
│       └── globals.css
├── supabase/
│   └── schema.sql
├── public/
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## 🎨 Design Features

- **Modern Gradient Theme**: Cyberpunk-inspired color palette
- **Glassmorphism Effects**: Frosted glass UI elements
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 compliant

## 🔐 Security

- Row Level Security (RLS) enabled on Supabase
- Environment variables for sensitive data
- Input validation and sanitization
- Secure file upload handling

## 📱 Usage

### Admin Flow

1. Login to admin panel at `/admin`
2. Select price range (e.g., 10000-20000)
3. Upload laptop images
4. Add description for the range
5. Submit and view in dashboard
6. Filter by range to view specific laptops
7. Copy shareable URL for customers

### Customer Flow

1. Receive WhatsApp link from admin
2. Click link to view range-specific laptops
3. Browse images and details
4. Contact admin for purchase

## 🚀 Deployment

### Vercel Deployment

```bash
vercel
```

Update environment variables in Vercel dashboard.

## 📄 License

MIT License

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a PR.

## 📞 Support

For issues or questions, please open a GitHub issue.
