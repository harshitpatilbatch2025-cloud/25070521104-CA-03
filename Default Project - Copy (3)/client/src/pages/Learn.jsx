import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import ArticleCard from '../components/ArticleCard.jsx';
import { Icon } from '../components/Icons.jsx';
import { EmptyState, ErrorPanel } from '../components/Feedback.jsx';

export default function Learn() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [busySlug, setBusySlug] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const category = searchParams.get('category') || 'All';

  useEffect(() => {
    if (authLoading) return undefined;
    let active = true;
    setLoading(true);

    api
      .get('/articles')
      .then((data) => {
        if (active) {
          setArticles(data.articles || []);
          setError('');
        }
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [authLoading, user?.id, reloadKey]);

  const categories = useMemo(() => {
    const unique = [...new Set(articles.map((article) => article.category))];
    return ['All', ...unique];
  }, [articles]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesCategory = category === 'All' || article.category === category;
      const matchesTerm =
        !term ||
        article.title.toLowerCase().includes(term) ||
        article.excerpt.toLowerCase().includes(term) ||
        article.category.toLowerCase().includes(term);
      return matchesCategory && matchesTerm;
    });
  }, [articles, category, query]);

  function setCategory(next) {
    const params = new URLSearchParams(searchParams);
    if (next === 'All') params.delete('category');
    else params.set('category', next);
    setSearchParams(params, { replace: true });
  }

  async function toggleBookmark(article) {
    if (!user) {
      toast.info('Log in to save articles to your account.');
      navigate('/login', { state: { from: location.pathname + location.search } });
      return;
    }

    setBusySlug(article.slug);
    try {
      if (article.bookmarked) {
        await api.delete(`/bookmarks/${article.slug}`);
        setArticles((current) =>
          current.map((item) => (item.slug === article.slug ? { ...item, bookmarked: false } : item))
        );
        toast.success('Removed from your saved articles.');
      } else {
        const data = await api.post('/bookmarks', { articleSlug: article.slug });
        setArticles((current) =>
          current.map((item) => (item.slug === article.slug ? { ...item, bookmarked: true } : item))
        );
        toast.success(data.message || 'Article saved.');
      }
    } catch (err) {
      toast.error(err.message);
      if (err.status === 401) navigate('/login', { state: { from: location.pathname } });
    } finally {
      setBusySlug('');
    }
  }

  return (
    <>
      <section className="page-hero page-hero-compact">
        <div className="container page-hero-inner">
          <span className="eyebrow">
            <Icon name="book" size={14} /> Learning hub
          </span>
          <h1>
            Small lessons. <span className="gradient-text">Stronger defences.</span>
          </h1>
          <p>
            Practical guides on the scams you are most likely to encounter — written in plain
            language, with actions you can take today.
          </p>
        </div>
      </section>

      <section className="section container learn-section">
        {!user && !authLoading && (
          <div className="inline-cta">
            <div>
              <strong>Want to save guides and track your progress?</strong>
              <span> A free account keeps your bookmarks and quiz scores in one place.</span>
            </div>
            <div className="inline-cta-actions">
              <Link to="/register" className="btn btn-primary btn-sm">
                Create free account
              </Link>
              <Link to="/login" className="btn btn-outline btn-sm">
                Log in
              </Link>
            </div>
          </div>
        )}

        <div className="learn-toolbar">
          <label className="search-field">
            <Icon name="search" size={18} />
            <span className="sr-only">Search guides</span>
            <input
              type="search"
              placeholder="Search guides, scams, or topics…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <button
                type="button"
                className="search-clear"
                onClick={() => setQuery('')}
                aria-label="Clear search"
              >
                <Icon name="close" size={15} />
              </button>
            )}
          </label>

          <div className="filter-chips" role="group" aria-label="Filter by category">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className={`chip ${category === item ? 'is-active' : ''}`}
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="results-meta">
          <span>
            {loading ? 'Loading guides…' : `${filtered.length} ${filtered.length === 1 ? 'guide' : 'guides'}`}
            {category !== 'All' && !loading ? ` in ${category}` : ''}
          </span>
          {(query || category !== 'All') && !loading && (
            <button
              type="button"
              className="text-button"
              onClick={() => {
                setQuery('');
                setCategory('All');
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        {error ? (
          <ErrorPanel
            title="The learning hub could not load"
            message={error}
            onRetry={() => setReloadKey((key) => key + 1)}
          />
        ) : loading ? (
          <div className="article-grid">
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="skeleton-card" aria-hidden="true">
                <span className="skeleton skeleton-circle" />
                <span className="skeleton skeleton-line short" />
                <span className="skeleton skeleton-line" />
                <span className="skeleton skeleton-line" />
                <span className="skeleton skeleton-line shorter" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="search"
            title="No guides match that search"
            text="Try a different keyword or clear the category filter."
          >
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => {
                setQuery('');
                setCategory('All');
              }}
            >
              Reset filters
            </button>
          </EmptyState>
        ) : (
          <div className="article-grid">
            {filtered.map((article) => (
              <ArticleCard
                key={article.slug}
                article={article}
                onToggleBookmark={toggleBookmark}
                busy={busySlug === article.slug}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
