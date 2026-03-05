import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AdminLayout } from './components/layout/AdminLayout';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './context/AuthContext';
import { Loader2 } from 'lucide-react';

// ─── Lazy-loaded pages ───────────────────────────────────────────────────────
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Blogs = lazy(() => import('./pages/Blogs').then(m => ({ default: m.Blogs })));
const BlogDetail = lazy(() => import('./pages/BlogDetail').then(m => ({ default: m.BlogDetail })));
const Projects = lazy(() => import('./pages/Projects').then(m => ({ default: m.Projects })));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails').then(m => ({ default: m.ProjectDetails })));
const Skills = lazy(() => import('./pages/Skills').then(m => ({ default: m.Skills })));
const Docs = lazy(() => import('./pages/Docs').then(m => ({ default: m.Docs })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));

// Admin
const Dashboard = lazy(() => import('./pages/admin/Dashboard').then(m => ({ default: m.Dashboard })));
const ManageBlogs = lazy(() => import('./pages/admin/blogs/ManageBlogs').then(m => ({ default: m.ManageBlogs })));
const EditBlog = lazy(() => import('./pages/admin/blogs/EditBlog').then(m => ({ default: m.EditBlog })));
const ManageProjects = lazy(() => import('./pages/admin/projects/ManageProjects').then(m => ({ default: m.ManageProjects })));
const EditProject = lazy(() => import('./pages/admin/projects/EditProject').then(m => ({ default: m.EditProject })));

// ─── Global page-level loading fallback ──────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router basename={import.meta.env.BASE_URL}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="blogs" element={<Blogs />} />
                <Route path="blogs/:slug" element={<BlogDetail />} />
                <Route path="projects" element={<Projects />} />
                <Route path="projects/:id" element={<ProjectDetails />} />
                <Route path="skills" element={<Skills />} />
                <Route path="docs" element={<Docs />} />
                <Route path="contact" element={<Contact />} />
                <Route path="login" element={<Login />} />
              </Route>

              {/* Protected Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="blogs" element={<ManageBlogs />} />
                <Route path="blogs/:id" element={<EditBlog />} />
                <Route path="projects" element={<ManageProjects />} />
                <Route path="projects/:id" element={<EditProject />} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
