import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Icon } from '../components/Icons.jsx';
import { ErrorPanel } from '../components/Feedback.jsx';
import { formatDate } from '../utils/format.js';

function BodyBlock({ block }) {
  if (block.type === 'h2') return <h2>{block.text}</h2>;
  if (block.type === 'quote') {
    return (
      <blockquote>
        <Icon name="spark" size={18} />
        <p>{block.text}</p>
      </blockquote>
    );
  }
  if (block.type === 'ul') {
    return (
      <ul className="prose-list">
        {block.items?.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  return <p>{block.text}</p>;
}

export default function ArticleDetail() {
  const { slug } = useParams();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [bookmarked, setBookmarked] = useState(false);
  const [read, setRead] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [markingRead, setMarkingRead] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (authLoading) return undefined;
    let active = true;
    setLoading(true);
    setError('');

    api
      .get(`/articles/${slug}`)
      .then((data) => {
        if (!active) return;
        setArticle(data.article);
        setRelated(data.related || []);
        setBookmarked(Boolean(data.bookmarked));
        setRead(Boolean(data.read));
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
  }, [slug, authLoading, user?.id, reloadKey]);

  async function toggleBookmark() {
    if (!user) {
      toast.info('Log in to save this guide to your account.');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    if (!article) return;

    setBusy(true);
    try {
      if (bookmarked) {
        await api.delete(`/bookmarks/${article.slug}`);
        setBookmarked(false);
        toast.success('Removed from your saved articles.');
      } else {
        const data = await api.post('/bookmarks', { articleSlug: article.slug });
        setBookmarked(true);
        toast.success(data.message || 'Article saved.');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function markAsRead() {
    if (!user) {
      toast.info('Log in to track completed guides and earn XP.');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    if (!article || read) return;

    setMarkingRead(true);
    try {
      const data = await api.post(`/progress/read/${article.slug}`);
      setRead(true);
      toast.success(data.message || 'Guide marked as complete.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setMarkingRead(false);
    }
  }

  if (loading) {
    return (
      <section className="section container article-loading">
        <div className="skeleton skeleton-line short" />
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-block" />
      </section>
    );
  }

  if (error || !article) {
    return (
      <section className="section container">
        <ErrorPanel
          title="We could not find that guide"
          message={error || 'The article may have moved or no longer exists.'}
          onRetry={() => setReloadKey((key) => key + 1)}
        />
        <div className="center-actions">
          <Link to="/learn" className="btn btn-outline">
            <Icon name="arrowLeft" size={16} /> Back to the learning hub
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="article-hero">
        <div className="container article-hero-inner">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link to="/learn">Learn</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{article.category}</span>
          </nav>

          <div className="article-hero-main">
            <div className="article-hero-copy">
              <div className="article-meta">
                <span className="badge" style={{ '--badge-accent': article.accent }}>
                  {article.category}
                </span>
                <span className="badge badge-soft">{article.level}</span>
                {read && (
                  <span className="badge badge-success">
                    <Icon name="check" size={12} /> Completed
                  </span>
                )}
              </div>
              <h1>{article.title}</h1>
              <p className="article-excerpt">{article.excerpt}</p>
              <div className="article-byline">
                <span>{article.author}</span>
                <span aria-hidden="true">·</span>
                <span>{formatDate(article.publishedAt)}</span>
                <span aria-hidden="true">·</span>
                <span>
                  <Icon name="clock" size={14} /> {article.readTimeMinutes} min read
                </span>
              </div>
            </div>

            <div className="article-hero-badge" style={{ '--accent': article.accent }} aria-hidden="true">
              <span>{article.emoji}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section container article-layout">
        <div className="article-main">
          {read && (
            <div className="success-banner">
              <Icon name="check" size={16} /> You have completed this guide. Your progress is saved
              to your account.
            </div>
          )}

          <div className="prose">
            {article.body?.map((block, index) => (
              <BodyBlock key={`${block.type}-${index}`} block={block} />
            ))}
          </div>

          <div className="article-tip-panel">
            <div className="tip-panel-head">
              <span className="tip-emoji" aria-hidden="true">
                🛡️
              </span>
              <div>
                <span className="eyebrow">Quick checklist</span>
                <h2>Put this guide into practice</h2>
              </div>
            </div>
            <ul className="check-list">
              {article.tips?.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>

          <div className="article-actions-bottom">
            <button
              type="button"
              className={`btn ${bookmarked ? 'btn-saved' : 'btn-outline'}`}
              onClick={toggleBookmark}
              disabled={busy}
            >
              <Icon name="bookmark" size={17} filled={bookmarked} />
              {bookmarked ? 'Saved to bookmarks' : 'Save this guide'}
            </button>
            <button
              type="button"
              className={`btn ${read ? 'btn-success' : 'btn-primary'}`}
              onClick={markAsRead}
              disabled={read || markingRead}
            >
              <Icon name={read ? 'check' : 'target'} size={17} />
              {read ? 'Completed' : markingRead ? 'Saving…' : 'Mark as read (+10 XP)'}
            </button>
          </div>
        </div>

        <aside className="article-aside">
          <div className="aside-card">
            <h2>Your progress</h2>
            {user ? (
              <>
                <p className="aside-muted">
                  {read
                    ? 'This guide is marked complete. Keep going to build your streak.'
                    : 'Mark this guide as read to earn 10 XP and record it on your dashboard.'}
                </p>
                <button
                  type="button"
                  className={`btn btn-block ${read ? 'btn-success' : 'btn-primary'}`}
                  onClick={markAsRead}
                  disabled={read || markingRead}
                >
                  <Icon name={read ? 'check' : 'target'} size={16} />
                  {read ? 'Already completed' : markingRead ? 'Saving…' : 'Mark complete'}
                </button>
                <button
                  type="button"
                  className={`btn btn-block ${bookmarked ? 'btn-saved' : 'btn-outline'}`}
                  onClick={toggleBookmark}
                  disabled={busy}
                >
                  <Icon name="bookmark" size={16} filled={bookmarked} />
                  {bookmarked ? 'Saved' : 'Save for later'}
                </button>
                <Link to="/dashboard" className="text-link aside-link">
                  Open dashboard <Icon name="arrowRight" size={14} />
                </Link>
              </>
            ) : (
              <>
                <p className="aside-muted">
                  Create a free account to save this guide, mark it complete, and track your
                  learning progress.
                </p>
                <Link to="/register" className="btn btn-primary btn-block">
                  Create free account
                </Link>
                <Link to="/login" state={{ from: location.pathname }} className="btn btn-outline btn-block">
                  Log in
                </Link>
              </>
            )}
          </div>

          <div className="aside-card">
            <h2>At a glance</h2>
            <dl className="aside-list">
              <div>
                <dt>Category</dt>
                <dd>{article.category}</dd>
              </div>
              <div>
                <dt>Level</dt>
                <dd>{article.level}</dd>
              </div>
              <div>
                <dt>Read time</dt>
                <dd>{article.readTimeMinutes} minutes</dd>
              </div>
              <div>
                <dt>Published</dt>
                <dd>{formatDate(article.publishedAt)}</dd>
              </div>
            </dl>
          </div>

          {related.length > 0 && (
            <div className="aside-card">
              <h2>Related guides</h2>
              <ul className="related-list">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link to={`/learn/${item.slug}`}>
                      <span aria-hidden="true">{item.emoji}</span>
                      <span>{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </section>

      <section className="section container">
        <div className="inline-notice inline-notice-info">
          <Icon name="info" size={18} />
          <span>
            ScamShield is educational. If you have lost money or shared credentials, contact your
            bank immediately and report at cybercrime.gov.in or call 1930.
          </span>
        </div>
      </section>
    </>
  );
}
