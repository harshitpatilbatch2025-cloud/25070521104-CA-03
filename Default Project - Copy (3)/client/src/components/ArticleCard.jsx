import { Link } from 'react-router-dom';
import { Icon } from './Icons.jsx';

export default function ArticleCard({ article, onToggleBookmark, busy = false, compact = false }) {
  return (
    <article className={`article-card ${compact ? 'article-card-compact' : ''}`}>
      <div className="article-card-head">
        <Link
          to={`/learn/${article.slug}`}
          className="article-emoji"
          style={{ '--accent': article.accent || '#22d3ee' }}
          aria-hidden="true"
          tabIndex={-1}
        >
          <span>{article.emoji || '🛡️'}</span>
        </Link>
        {onToggleBookmark && (
          <button
            type="button"
            className={`icon-btn bookmark-btn ${article.bookmarked ? 'is-saved' : ''}`}
            onClick={() => onToggleBookmark(article)}
            disabled={busy}
            aria-label={article.bookmarked ? `Remove ${article.title} from bookmarks` : `Bookmark ${article.title}`}
            title={article.bookmarked ? 'Remove bookmark' : 'Save article'}
          >
            <Icon name="bookmark" size={19} filled={article.bookmarked} />
          </button>
        )}
      </div>

      <Link to={`/learn/${article.slug}`} className="article-card-body">
        <div className="article-meta">
          <span className="badge">{article.category}</span>
          <span className="meta-dot">•</span>
          <span className="meta-text">
            <Icon name="clock" size={13} /> {article.readTimeMinutes} min
          </span>
          {article.featured && <span className="badge badge-featured">Featured</span>}
        </div>
        <h3>{article.title}</h3>
        <p>{article.excerpt}</p>
        <span className="article-link">
          Read guide <Icon name="arrowRight" size={15} />
        </span>
      </Link>
    </article>
  );
}
