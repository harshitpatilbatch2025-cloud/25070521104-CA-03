import { Link } from 'react-router-dom';
import { Icon } from './Icons.jsx';
import { LogoMark } from './Logo.jsx';

export function Spinner({ label = 'Loading…', size = 22 }) {
  return (
    <span className="spinner-wrap">
      <span className="spinner" style={{ width: size, height: size }} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function PageLoader({ label = 'Loading…' }) {
  return (
    <div className="session-loader">
      <LogoMark size={50} />
      <span className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

export function ErrorPanel({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="empty-state empty-state-error">
      <span className="empty-icon">
        <Icon name="alert" size={26} />
      </span>
      <h3>{title}</h3>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn-outline btn-sm" onClick={onRetry}>
          <Icon name="refresh" size={16} /> Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ icon = 'bookmark', title, text, actionLabel, actionTo, children }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon name={icon} size={26} />
      </span>
      <h3>{title}</h3>
      <p>{text}</p>
      {actionTo && actionLabel && (
        <Link to={actionTo} className="btn btn-outline btn-sm">
          {actionLabel} <Icon name="arrowRight" size={15} />
        </Link>
      )}
      {children}
    </div>
  );
}
