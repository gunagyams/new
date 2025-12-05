import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Stories from './pages/Stories';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Login from './pages/admin/Login';
import Signup from './pages/admin/Signup';
import Dashboard from './pages/admin/Dashboard';
import ProjectsList from './pages/admin/ProjectsList';
import ProjectForm from './pages/admin/ProjectForm';
import BlogList from './pages/admin/BlogList';
import BlogForm from './pages/admin/BlogForm';
import AboutImages from './pages/admin/AboutImages';
import PageSEO from './pages/admin/PageSEO';
import HomepageImages from './pages/admin/HomepageImages';

function AppRoutes() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/homepage-images" element={<ProtectedRoute><HomepageImages /></ProtectedRoute>} />
          <Route path="/admin/projects" element={<ProtectedRoute><ProjectsList /></ProtectedRoute>} />
          <Route path="/admin/projects/new" element={<ProtectedRoute><ProjectForm /></ProtectedRoute>} />
          <Route path="/admin/projects/:id" element={<ProtectedRoute><ProjectForm /></ProtectedRoute>} />
          <Route path="/admin/blog" element={<ProtectedRoute><BlogList /></ProtectedRoute>} />
          <Route path="/admin/blog/new" element={<ProtectedRoute><BlogForm /></ProtectedRoute>} />
          <Route path="/admin/blog/:id" element={<ProtectedRoute><BlogForm /></ProtectedRoute>} />
          <Route path="/admin/about-images" element={<ProtectedRoute><AboutImages /></ProtectedRoute>} />
          <Route path="/admin/seo" element={<ProtectedRoute><PageSEO /></ProtectedRoute>} />

          <Route path="/*" element={<AppRoutes />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
