import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Icon } from '../components/Icons.jsx';
import { ErrorPanel } from '../components/Feedback.jsx';

export default function Quizzes() {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (authLoading) return undefined;
    let active = true;
    setLoading(true);

    api
      .get('/quizzes')
      .then((data) => {
        if (active) {
          setQuizzes(data.quizzes || []);
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

  return (
    <>
      <section className="page-hero page-hero-compact">
        <div className="container page-hero-inner">
          <span className="eyebrow">
            <Icon name="brain" size={14} /> Safety quizzes
          </span>
          <h1>
            Knowledge is good. <span className="gradient-text">Instinct is better.</span>
          </h1>
          <p>
            Scenario-based quizzes that test what you would actually do. Every answer is graded on
            the server, saved to your account, and explained immediately.
          </p>
          <div className="page-hero-actions">
            <Link to="/learn" className="btn btn-outline">
              <Icon name="book" size={16} /> Brush up first
            </Link>
            {user ? (
              <Link to="/dashboard" className="btn btn-ghost">
                <Icon name="chart" size={16} /> View your scores
              </Link>
            ) : (
              <Link
                to="/register"
                state={{ from: location.pathname }}
                className="btn btn-primary"
              >
                Create account to track scores
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="section container">
        {!user && !authLoading && (
          <div className="inline-notice">
            <Icon name="info" size={18} />
            <span>
              You can preview the quizzes below. Log in to submit answers, earn XP, and keep a
              record of your attempts.
            </span>
          </div>
        )}

        {error ? (
          <ErrorPanel
            title="Quizzes could not be loaded"
            message={error}
            onRetry={() => setReloadKey((key) => key + 1)}
          />
        ) : loading ? (
          <div className="quiz-grid">
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
        ) : (
          <div className="quiz-grid">
            {quizzes.map((quiz) => (
              <article key={quiz.slug} className="quiz-card" style={{ '--accent': quiz.accent }}>
                <div className="quiz-card-head">
                  <span className="quiz-emoji" aria-hidden="true">
                    {quiz.emoji}
                  </span>
                  <span className={`badge difficulty-${quiz.difficulty.toLowerCase()}`}>
                    {quiz.difficulty}
                  </span>
                </div>

                <span className="quiz-category">{quiz.category}</span>
                <h2>{quiz.title}</h2>
                <p>{quiz.description}</p>

                <div className="quiz-meta">
                  <span>
                    <Icon name="target" size={15} /> {quiz.questionCount} questions
                  </span>
                  <span>
                    <Icon name="clock" size={15} /> {quiz.estimatedMinutes} min
                  </span>
                  <span>
                    <Icon name="spark" size={15} /> {quiz.xpPerCorrect} XP each
                  </span>
                </div>

                {quiz.attemptCount > 0 ? (
                  <div className="quiz-best">
                    <span>
                      Best score <strong>{quiz.bestPercentage}%</strong>
                    </span>
                    <span className="quiz-best-meta">
                      {quiz.attemptCount} {quiz.attemptCount === 1 ? 'attempt' : 'attempts'}
                    </span>
                  </div>
                ) : (
                  <div className="quiz-best quiz-best-empty">
                    <span>
                      <Icon name="info" size={14} /> Not attempted yet
                    </span>
                  </div>
                )}

                <Link
                  to={user ? `/quizzes/${quiz.slug}` : '/login'}
                  state={user ? undefined : { from: `/quizzes/${quiz.slug}` }}
                  className="btn btn-primary btn-block"
                >
                  {user ? (quiz.attemptCount > 0 ? 'Try again' : 'Start quiz') : 'Log in to start'}
                  <Icon name="arrowRight" size={16} />
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="section container">
        <div className="three-up">
          <div className="mini-feature">
            <span className="mini-feature-icon">
              <Icon name="lock" size={19} />
            </span>
            <h3>Graded securely</h3>
            <p>Correct answers stay on the server until you submit, so the score is genuine.</p>
          </div>
          <div className="mini-feature">
            <span className="mini-feature-icon">
              <Icon name="chart" size={19} />
            </span>
            <h3>Saved to your account</h3>
            <p>Every attempt, answer, score, and completion date is stored in your dashboard.</p>
          </div>
          <div className="mini-feature">
            <span className="mini-feature-icon">
              <Icon name="brain" size={19} />
            </span>
            <h3>Explained instantly</h3>
            <p>Review the right answer and the reasoning behind it after every attempt.</p>
          </div>
        </div>
      </section>
    </>
  );
}
