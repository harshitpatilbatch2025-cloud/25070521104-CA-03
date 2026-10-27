import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import ScamTypes from './pages/ScamTypes.jsx';
import Learn from './pages/Learn.jsx';
import ArticleDetail from './pages/ArticleDetail.jsx';
import Quizzes from './pages/Quizzes.jsx';
import QuizPlay from './pages/QuizPlay.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import NotFound from './pages/NotFound.jsx';
import { useAuth } from './context/AuthContext.jsx';

function ThemeSync() {
  const { user } = useAuth();

  useEffect(() => {
    const pref = user?.preferences?.theme || 'dark';
    const media = window.matchMedia('(prefers-color-scheme: light)');

    const apply = () => {
      const resolved = pref === 'system' ? (media.matches ? 'light' : 'dark') : pref;
      document.documentElement.dataset.theme = resolved;
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', resolved === 'light' ? '#f5f8fc' : '#060a15');
    };

    apply();
    if (pref === 'system') {
      media.addEventListener('change', apply);
      return () => media.removeEventListener('change', apply);
    }
    return undefined;
  }, [user?.preferences?.theme]);

  return null;
}

export default function App() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <ThemeSync />
      <ScrollToTop />
      <Navbar />
      <main id="main" className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scam-types" element={<ScamTypes />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:slug" element={<ArticleDetail />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route
            path="/quizzes/:slug"
            element={
              <ProtectedRoute>
                <QuizPlay />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
