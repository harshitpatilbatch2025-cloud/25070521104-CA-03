import { Link } from 'react-router-dom';
import { Icon } from '../components/Icons.jsx';
import { LogoMark } from '../components/Logo.jsx';

export default function NotFound() {
  return (
    <section className="section container not-found">
      <div className="not-found-visual" aria-hidden="true">
        <LogoMark size={76} />
        <span className="not-found-code">404</span>
      </div>
      <span className="eyebrow">Page not found</span>
      <h1>
        This page slipped <span className="gradient-text">through the shield.</span>
      </h1>
      <p>
        The link may be old or mistyped. Head back to safety and keep exploring the awareness
        guides.
      </p>
      <div className="not-found-actions">
        <Link to="/" className="btn btn-primary">
          Back to home <Icon name="arrowRight" size={16} />
        </Link>
        <Link to="/learn" className="btn btn-outline">
          Browse guides
        </Link>
      </div>
    </section>
  );
}
