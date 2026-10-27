import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import ArticleCard from '../components/ArticleCard.jsx';
import { Icon } from '../components/Icons.jsx';
import { LogoMark } from '../components/Logo.jsx';
import { scamTypes, safetyTips } from '../data/scamTypes.js';

export default function Home() {
  const { user } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    api
      .get('/articles?featured=true&limit=4')
      .then((data) => {
        if (active) {
          setFeatured(data.articles || []);
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
  }, []);

  const highlightedTypes = scamTypes.slice(0, 6);

  return (
    <>
      <section className="hero">
        <div className="hero-grid container">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              Free digital fraud awareness portal
            </span>

            <h1 className="hero-title">
              Recognize Scams.
              <span className="gradient-text"> Protect Yourself.</span>
            </h1>

            <p className="hero-lede">
              ScamShield turns everyday fraud warnings into clear, practical knowledge. Learn how
              phishing, payment, investment, and AI-driven scams actually work — then test yourself
              before a real message arrives.
            </p>

            <div className="hero-actions">
              <Link to="/scam-types" className="btn btn-primary btn-lg">
                Explore Scam Types
                <Icon name="arrowRight" size={18} />
              </Link>
              <Link to="/learn" className="btn btn-outline btn-lg">
                <Icon name="book" size={18} />
                Learn About Scams
              </Link>
              <Link to="/quizzes" className="btn btn-ghost btn-lg">
                <Icon name="play" size={16} />
                Take a Quiz
              </Link>
            </div>

            <ul className="hero-points" aria-label="What ScamShield offers">
              <li>
                <Icon name="check" size={15} /> No cost, no jargon
              </li>
              <li>
                <Icon name="check" size={15} /> Built for real messages
              </li>
              <li>
                <Icon name="check" size={15} /> Track your learning
              </li>
            </ul>

            <div className="hero-stats">
              <div>
                <strong>{scamTypes.length}</strong>
                <span>fraud types mapped</span>
              </div>
              <div>
                <strong>10</strong>
                <span>practical guides</span>
              </div>
              <div>
                <strong>4</strong>
                <span>safety quizzes</span>
              </div>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-halo" />
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />

            <div className="shield-hub">
              <LogoMark size={118} />
              <span className="shield-caption">ScamShield</span>
            </div>

            <div className="float-card float-alert">
              <span className="pulse-dot" />
              <div>
                <strong>OTP request blocked</strong>
                <span>“Share the code to cancel…”</span>
              </div>
            </div>

            <div className="float-card float-check">
              <span className="float-check-icon">
                <Icon name="shield" size={18} />
              </span>
              <div>
                <strong>Sender verified</strong>
                <span>Official domain matches</span>
              </div>
            </div>

            <div className="float-card float-score">
              <span className="mini-score">92</span>
              <div>
                <strong>Safety score</strong>
                <span>Phishing check passed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="signals-strip" aria-label="Topics covered">
        <div className="container signals-inner">
          <span className="signals-label">Built around the scams people actually face</span>
          <div className="signals-chips">
            {['Phishing', 'OTP fraud', 'UPI traps', 'Fake investments', 'Romance scams', 'AI deepfakes'].map(
              (topic) => (
                <span key={topic} className="chip chip-muted">
                  {topic}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Know the playbook</span>
            <h2>
              Fraud wears <span className="gradient-text">many masks.</span>
            </h2>
            <p>
              Every scam relies on the same levers: urgency, authority, trust, or fear. Learn to
              recognize the pattern once and it becomes much harder to fool.
            </p>
          </div>
          <Link to="/scam-types" className="text-link">
            View all scam types <Icon name="arrowRight" size={16} />
          </Link>
        </div>

        <div className="scam-grid">
          {highlightedTypes.map((type) => (
            <Link
              key={type.id}
              to={`/scam-types#${type.id}`}
              className="scam-card"
              style={{ '--accent': type.accent }}
            >
              <span className="scam-emoji" aria-hidden="true">
                {type.emoji}
              </span>
              <h3>{type.title}</h3>
              <p>{type.description}</p>
              <span className="scam-card-link">
                Learn the red flags <Icon name="arrowRight" size={15} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Learn at your pace</span>
              <h2>
                Featured <span className="gradient-text">safety guides.</span>
              </h2>
              <p>
                Short, practical reads written for real-life decisions — not security textbooks.
                Save the ones you want to revisit.
              </p>
            </div>
            <Link to="/learn" className="text-link">
              Browse the learning hub <Icon name="arrowRight" size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="article-grid">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="skeleton-card" aria-hidden="true">
                  <span className="skeleton skeleton-circle" />
                  <span className="skeleton skeleton-line short" />
                  <span className="skeleton skeleton-line" />
                  <span className="skeleton skeleton-line" />
                  <span className="skeleton skeleton-line shorter" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="inline-notice">
              <Icon name="alert" size={18} />
              <span>We could not load featured guides right now. {error}</span>
              <Link to="/learn" className="text-link">
                Browse all guides <Icon name="arrowRight" size={14} />
              </Link>
            </div>
          ) : (
            <div className="article-grid">
              {featured.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section container">
        <div className="tips-layout">
          <div className="tips-intro">
            <span className="eyebrow">Everyday armour</span>
            <h2>
              Four habits that stop <span className="gradient-text">most attempts.</span>
            </h2>
            <p>
              You do not need to become a security expert. You need a repeatable pause-and-verify
              routine that works even when a message feels convincing.
            </p>
            <Link to="/learn" className="btn btn-outline">
              Build your safety routine <Icon name="arrowRight" size={16} />
            </Link>
          </div>

          <div className="tips-grid">
            {safetyTips.map((tip) => (
              <div key={tip.title} className="tip-card">
                <span className="tip-emoji" aria-hidden="true">
                  {tip.emoji}
                </span>
                <h3>{tip.title}</h3>
                <p>{tip.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="cta-panel">
          <div className="cta-copy">
            <span className="eyebrow">Test your instincts</span>
            <h2>
              Would you spot the <span className="gradient-text">trap?</span>
            </h2>
            <p>
              Take a short, scenario-based quiz. Get instant explanations, track your score, and
              turn knowledge into a habit.
            </p>
            <div className="cta-actions">
              <Link to="/quizzes" className="btn btn-primary btn-lg">
                <Icon name="play" size={16} /> Take a Quiz
              </Link>
              {user ? (
                <Link to="/dashboard" className="btn btn-outline btn-lg">
                  View your dashboard <Icon name="arrowRight" size={16} />
                </Link>
              ) : (
                <Link to="/register" className="btn btn-outline btn-lg">
                  Create free account <Icon name="arrowRight" size={16} />
                </Link>
              )}
            </div>
          </div>

          <div className="cta-mock" aria-hidden="true">
            <div className="mock-header">
              <span>QUICK CHECK</span>
              <span className="mock-pill">1 of 5</span>
            </div>
            <p className="mock-question">
              A caller asks for the OTP sent to your phone “to cancel a fraudulent payment”. What do
              you do?
            </p>
            <div className="mock-option">
              <span className="mock-radio" /> Share it — they sound official
            </div>
            <div className="mock-option is-correct">
              <span className="mock-radio" /> <Icon name="check" size={14} /> Hang up and call your bank
            </div>
            <div className="mock-option">
              <span className="mock-radio" /> Send a screenshot instead
            </div>
            <div className="mock-foot">
              <span>
                <Icon name="spark" size={14} /> +25 XP for the right answer
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
