# ACTION_COLLEGE - Production-Ready Campus Management Platform

A comprehensive, production-ready campus management platform built with Next.js, TypeScript, Tailwind CSS, and Supabase. This platform provides students with a modern, intuitive interface for managing their academic life.

## 🚀 Features

### Core Functionality
- **User Authentication & Management** - Secure login/registration with Supabase Auth
- **Academic Dashboard** - Real-time course tracking, grades, and progress monitoring
- **Course Management** - Browse, search, and enroll in courses
- **Profile Management** - Complete student profile with academic details
- **Responsive Design** - Mobile-first approach with modern UI components

### Technical Features
- **Real-time Database** - Supabase PostgreSQL with Row Level Security
- **Type Safety** - Full TypeScript implementation
- **Modern UI** - Built with shadcn/ui components and Tailwind CSS
- **Performance Optimized** - Next.js 15 with App Router
- **Production Ready** - Environment configuration, error handling, and security

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel-ready configuration

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Leukaill/ACTION_COLLEGE.git
cd ACTION_COLLEGE
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database
DATABASE_URL=your_database_connection_string

# Session Security
SESSION_SECRET=your_session_secret
```

### 4. Database Setup

Run the SQL migration in your Supabase SQL editor:

```sql
-- Copy and paste the contents of database-setup.sql
-- This will create all necessary tables and sample data
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:9002`

## 🗄️ Database Schema

### Tables

- **users** - Student profiles and academic information
- **courses** - Available courses with details
- **enrollments** - Student course enrollments and grades
- **events** - Campus events and academic calendar

### Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:
- Users can only access their own data
- Course information is publicly readable
- Enrollment data is restricted to the student

## 🔐 Authentication

The platform uses Supabase Auth with:
- Email/password authentication
- Secure session management
- Protected routes and API endpoints
- User profile management

## 📱 Pages & Features

### Public Pages
- **Landing Page** (`/`) - Marketing and information
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - New user registration

### Protected Dashboard
- **Main Dashboard** (`/dashboard`) - Overview and quick actions
- **Academics** (`/dashboard/academics`) - Course management
- **Profile** (`/dashboard/profile`) - User profile editing
- **Calendar** (`/dashboard/calendar`) - Academic calendar
- **Community** (`/dashboard/community`) - Student networking
- **Library** (`/dashboard/library`) - Resource management
- **Payment** (`/dashboard/payment`) - Financial management
- **Emergency** (`/dashboard/emergency`) - Safety and support

## 🎨 UI Components

Built with shadcn/ui components:
- Responsive cards and layouts
- Form components with validation
- Navigation and sidebar
- Data tables and grids
- Loading states and error handling

## 🔧 Development

### Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
├── contexts/           # React contexts (auth, etc.)
├── lib/               # Utility functions and configurations
└── hooks/             # Custom React hooks
```

### Key Files

- `src/contexts/auth-context.tsx` - Authentication state management
- `src/lib/supabase.ts` - Supabase client and types
- `database-setup.sql` - Database schema and sample data
- `src/app/dashboard/layout.tsx` - Dashboard layout and navigation

### Adding New Features

1. Create new page in `src/app/dashboard/`
2. Add navigation item in dashboard layout
3. Implement required database tables if needed
4. Add TypeScript types to `src/lib/supabase.ts`

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

Ensure all environment variables are set in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `SESSION_SECRET`

## 🔒 Security Features

- Row Level Security (RLS) on all database tables
- Protected API routes
- Input validation and sanitization
- Secure authentication flow
- Environment variable protection

## 📊 Performance

- Next.js 15 with App Router
- Optimized database queries
- Lazy loading and code splitting
- Responsive image handling
- Efficient state management

## 🧪 Testing

The platform is built with production-ready code quality:
- TypeScript for type safety
- Error boundaries for graceful error handling
- Loading states and user feedback
- Responsive design testing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review the code comments

## 🔄 Updates

Stay updated with the latest features:
- Watch the repository for updates
- Check the releases page
- Follow the development roadmap

---

**Built with ❤️ for modern education**
