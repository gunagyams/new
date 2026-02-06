import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load components - they'll be loaded only when needed
// This dramatically reduces the initial bundle size

// Public pages - loaded on-demand when user navigates to them
const Navigation = lazy(() => import('./components/Navigation'));
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Stories = lazy(() => import('./pages/Stories'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Contact = lazy(() => import('./pages/Contact'));

// Auth pages - only loaded when user tries to login/signup
const Login = lazy(() => import('./pages/admin/Login'));
const Signup = lazy(() => import('./pages/admin/Signup'));

// Admin pages - only loaded for authenticated admin users
// These include heavy dependencies like TipTap editor
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ProjectsList = lazy(() => import('./pages/admin/ProjectsList'));
const ProjectForm = lazy(() => import('./pages/admin/ProjectForm'));
const BlogList = lazy(() => import('./pages/admin/BlogList'));
const BlogForm = lazy(() => import('./pages/admin/BlogForm'));
const PageSEO = lazy(() => import('./pages/admin/PageSEO'));
const ImagesManager = lazy(() => import('./pages/admin/ImagesManager'));
const ServicesManager = lazy(() => import('./pages/admin/ServicesManager'));
const TestimonialsManager = lazy(() => import('./pages/admin/TestimonialsManager'));

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Auth routes - lazy loaded only when accessed */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            {/* Admin routes - lazy loaded with heavy dependencies (TipTap editor, etc) */}
            <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/images" element={<ProtectedRoute><ImagesManager /></ProtectedRoute>} />
            <Route path="/admin/projects" element={<ProtectedRoute><ProjectsList /></ProtectedRoute>} />
            <Route path="/admin/projects/new" element={<ProtectedRoute><ProjectForm /></ProtectedRoute>} />
            <Route path="/admin/projects/:id" element={<ProtectedRoute><ProjectForm /></ProtectedRoute>} />
            <Route path="/admin/blog" element={<ProtectedRoute><BlogList /></ProtectedRoute>} />
            <Route path="/admin/blog/new" element={<ProtectedRoute><BlogForm /></ProtectedRoute>} />
            <Route path="/admin/blog/:id" element={<ProtectedRoute><BlogForm /></ProtectedRoute>} />
            <Route path="/admin/seo" element={<ProtectedRoute><PageSEO /></ProtectedRoute>} />
            <Route path="/admin/services" element={<ProtectedRoute><ServicesManager /></ProtectedRoute>} />
            <Route path="/admin/testimonials" element={<ProtectedRoute><TestimonialsManager /></ProtectedRoute>} />

            {/* Public routes - lazy loaded on navigation */}
            <Route path="/*" element={<AppRoutes />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
