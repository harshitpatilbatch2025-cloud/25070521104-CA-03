import { Link } from 'react-router-dom';
import { Icon } from '../components/Icons.jsx';
import { scamTypes } from '../data/scamTypes.js';

export default function ScamTypes() {
  return (
    <>
      <section className="page-hero">
        <div className="container page-hero-inner">
          <span className="eyebrow">
            <Icon name="target" size={14} /> Scam library
          </span>
          <h1>
            Know the scam <span className="gradient-text">before it finds you.</span>
          </h1>
          <p>
            Fraudsters recycle the same playbooks across channels. This library breaks down the
            most common digital scams: how they work, what they look like, and exactly what to do.
          </p>
          <div className="page-hero-actions">
            <Link to="/quizzes" className="btn btn-primary">
              <Icon name="play" size={16} /> Test your knowledge
            </Link>
            <Link to="/learn" className="btn btn-outline">
              <Icon name="book" size={16} /> Read the guides
            </Link>
          </div>
        </div>
      </section>

      <div className="container">
        <nav className="anchor-nav" aria-label="Scam type shortcuts">
          {scamTypes.map((type) => (
            <a key={type.id} href={`#${type.id}`} className="chip">
              <span aria-hidden="true">{type.emoji}</span> {type.title}
            </a>
          ))}
        </nav>
      </div>

      <section className="section container scam-library">
        {scamTypes.map((type, index) => (
          <article
            key={type.id}
            id={type.id}
            className="scam-detail"
            style={{ '--accent': type.accent }}
          >
            <div className="scam-detail-head">
              <span className="scam-detail-emoji" aria-hidden="true">
                {type.emoji}
              </span>
              <div>
                <span className="scam-index">0{index + 1}</span>
                <h2>{type.title}</h2>
                <p className="scam-tagline">{type.tagline}</p>
              </div>
            </div>

            <p className="scam-description">{type.description}</p>

            <div className="scam-detail-grid">
              <div className="scam-list-block">
                <h3>
                  <Icon name="alert" size={17} /> Red flags
                </h3>
                <ul className="check-list check-list-warn">
                  {type.redFlags.map((flag) => (
                    <li key={flag}>{flag}</li>
                  ))}
                </ul>
              </div>
              <div className="scam-list-block">
                <h3>
                  <Icon name="shield" size={17} /> Protect yourself
                </h3>
                <ul className="check-list">
                  {type.protection.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="scam-detail-foot">
              <Link to={`/learn/${type.articleSlug}`} className="text-link">
                Read the full guide <Icon name="arrowRight" size={15} />
              </Link>
              <Link to="/quizzes" className="text-link muted-link">
                Practice with a quiz <Icon name="arrowUpRight" size={14} />
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="section container">
        <div className="cta-panel cta-panel-compact">
          <div className="cta-copy">
            <span className="eyebrow">Remember the pattern</span>
            <h2>
              Urgency. Authority. <span className="gradient-text">A request.</span>
            </h2>
            <p>
              Almost every scam combines pressure with a demand for money, codes, or access.
              Recognize that shape and you can stop most attacks before they start.
            </p>
            <div className="cta-actions">
              <Link to="/quizzes" className="btn btn-primary">
                Take a safety quiz <Icon name="arrowRight" size={16} />
              </Link>
              <Link to="/register" className="btn btn-outline">
                Track your progress
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
