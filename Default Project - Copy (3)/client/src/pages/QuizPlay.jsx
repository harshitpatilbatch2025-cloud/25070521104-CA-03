import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client.js';
import { useToast } from '../context/ToastContext.jsx';
import { Icon } from '../components/Icons.jsx';
import { ErrorPanel } from '../components/Feedback.jsx';

function formatSeconds(total) {
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export default function QuizPlay() {
  const { slug } = useParams();
  const { toast } = useToast();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setResult(null);
    setAnswers({});
    setCurrent(0);
    setSeconds(0);

    api
      .get(`/quizzes/${slug}`)
      .then((data) => {
        if (active) {
          setQuiz(data.quiz);
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
  }, [slug, reloadKey]);

  useEffect(() => {
    if (!quiz || result) return undefined;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [quiz, result]);

  const answeredCount = useMemo(
    () => (quiz ? quiz.questions.filter((question) => answers[question.id] !== undefined).length : 0),
    [quiz, answers]
  );

  const question = quiz?.questions[current];
  const allAnswered = quiz ? answeredCount === quiz.questions.length : false;

  function selectOption(index) {
    if (!question || submitting) return;
    setAnswers((currentAnswers) => ({ ...currentAnswers, [question.id]: index }));
  }

  async function handleSubmit() {
    if (!quiz) return;
    if (!allAnswered) {
      toast.info('Answer every question before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        answers: quiz.questions.map((item) => ({
          questionId: item.id,
          selectedIndex: answers[item.id],
        })),
        durationSeconds: seconds,
      };
      const data = await api.post(`/quizzes/${quiz.slug}/attempt`, payload);
      setResult(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function retake() {
    setResult(null);
    setAnswers({});
    setCurrent(0);
    setSeconds(0);
    setReloadKey((key) => key + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (loading) {
    return (
      <section className="section container quiz-loading">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-block" />
      </section>
    );
  }

  if (error || !quiz) {
    return (
      <section className="section container">
        <ErrorPanel
          title="Quiz unavailable"
          message={error || 'This quiz could not be found.'}
          onRetry={() => setReloadKey((key) => key + 1)}
        />
        <div className="center-actions">
          <Link to="/quizzes" className="btn btn-outline">
            <Icon name="arrowLeft" size={16} /> All quizzes
          </Link>
        </div>
      </section>
    );
  }

  if (result) {
    const { attempt, review, progress } = result;
    return (
      <section className="section container quiz-result-section">
        <div className={`result-hero ${attempt.passed ? 'is-passed' : 'is-failed'}`}>
          <div className="score-ring" style={{ '--pct': `${attempt.percentage}%` }}>
            <div className="score-ring-inner">
              <strong>{attempt.percentage}%</strong>
              <span>{attempt.score}/{attempt.totalQuestions}</span>
            </div>
          </div>
          <div className="result-copy">
            <span className={`badge ${attempt.passed ? 'badge-success' : 'badge-warn'}`}>
              {attempt.passed ? 'Quiz passed' : 'Keep practising'}
            </span>
            <h1>{attempt.passed ? 'Nicely spotted.' : 'Almost there.'}</h1>
            <p>
              You scored <strong>{attempt.score}</strong> out of <strong>{attempt.totalQuestions}</strong>{' '}
              on {attempt.quizTitle}. This attempt has been saved to your account.
            </p>
            <div className="result-stats">
              <div>
                <span>XP earned</span>
                <strong>+{attempt.xpEarned}</strong>
              </div>
              <div>
                <span>Level</span>
                <strong>{progress?.level ?? 1}</strong>
              </div>
              <div>
                <span>Streak</span>
                <strong>{progress?.streakDays ?? 0}d</strong>
              </div>
              <div>
                <span>Time</span>
                <strong>{formatSeconds(seconds)}</strong>
              </div>
            </div>
            <div className="result-actions">
              <button type="button" className="btn btn-outline" onClick={retake}>
                <Icon name="refresh" size={16} /> Retake quiz
              </button>
              <Link to="/dashboard?tab=quizzes" className="btn btn-primary">
                <Icon name="chart" size={16} /> View quiz history
              </Link>
              <Link to="/quizzes" className="btn btn-ghost">
                All quizzes
              </Link>
            </div>
          </div>
        </div>

        <div className="review-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Answer review</span>
              <h2>What you got right — and why</h2>
              <p>Correct answers are shown below with a short explanation.</p>
            </div>
          </div>

          <div className="review-list">
            {review.map((item, index) => (
              <article
                key={item.questionId}
                className={`review-item ${item.isCorrect ? 'is-correct' : 'is-wrong'}`}
              >
                <div className="review-head">
                  <span className="review-number">{index + 1}</span>
                  <h3>{item.prompt}</h3>
                  <span className={`review-status ${item.isCorrect ? 'correct' : 'wrong'}`}>
                    {item.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                <ul className="review-options">
                  {item.options.map((option, optionIndex) => {
                    const isCorrect = optionIndex === item.correctIndex;
                    const isSelected = optionIndex === item.selectedIndex;
                    return (
                      <li
                        key={option}
                        className={`review-option ${isCorrect ? 'is-correct' : ''} ${
                          isSelected && !isCorrect ? 'is-selected-wrong' : ''
                        }`}
                      >
                        <span className="review-option-mark">
                          {isCorrect ? (
                            <Icon name="check" size={14} />
                          ) : isSelected ? (
                            <Icon name="close" size={14} />
                          ) : null}
                        </span>
                        <span>{option}</span>
                        {isSelected && <span className="review-tag">Your answer</span>}
                        {isCorrect && <span className="review-tag review-tag-correct">Correct</span>}
                      </li>
                    );
                  })}
                </ul>
                {item.explanation && (
                  <div className="review-explanation">
                    <Icon name="info" size={16} />
                    <p>{item.explanation}</p>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section container quiz-section">
      <div className="quiz-topbar">
        <Link to="/quizzes" className="back-link">
          <Icon name="arrowLeft" size={16} /> All quizzes
        </Link>
        <span className="quiz-timer">
          <Icon name="clock" size={15} /> {formatSeconds(seconds)}
        </span>
      </div>

      <div className="quiz-header">
        <div className="quiz-header-main">
          <div className="quiz-header-badge" style={{ '--accent': quiz.accent }} aria-hidden="true">
            {quiz.emoji}
          </div>
          <div>
            <span className="eyebrow">{quiz.category}</span>
            <h1>{quiz.title}</h1>
            <p>{quiz.description}</p>
          </div>
        </div>
        <div className="quiz-header-meta">
          <span className={`badge difficulty-${quiz.difficulty.toLowerCase()}`}>{quiz.difficulty}</span>
          <span className="badge badge-soft">{quiz.questionCount} questions</span>
        </div>
      </div>

      <div className="quiz-progress-wrap">
        <div className="quiz-progress-label">
          <span>
            Question {current + 1} of {quiz.questionCount}
          </span>
          <span>{answeredCount} answered</span>
        </div>
        <div className="progress-track">
          <span
            className="progress-fill"
            style={{ width: `${((current + 1) / quiz.questionCount) * 100}%` }}
          />
        </div>
      </div>

      <div className="question-card">
        <h2>{question.prompt}</h2>
        <div className="quiz-options" role="radiogroup" aria-label="Answer options">
          {question.options.map((option, index) => {
            const selected = answers[question.id] === index;
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={selected}
                className={`quiz-option ${selected ? 'is-selected' : ''}`}
                onClick={() => selectOption(index)}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
                <span className="option-check">
                  {selected ? <Icon name="check" size={15} /> : null}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="quiz-dots" role="group" aria-label="Jump to a question">
        {quiz.questions.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`quiz-dot ${index === current ? 'is-current' : ''} ${
              answers[item.id] !== undefined ? 'is-answered' : ''
            }`}
            onClick={() => setCurrent(index)}
            aria-label={`Go to question ${index + 1}${answers[item.id] !== undefined ? ', answered' : ''}`}
            aria-current={index === current ? 'step' : undefined}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div className="quiz-nav">
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => setCurrent((value) => Math.max(0, value - 1))}
          disabled={current === 0}
        >
          <Icon name="arrowLeft" size={16} /> Previous
        </button>

        {current < quiz.questions.length - 1 ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setCurrent((value) => Math.min(quiz.questions.length - 1, value + 1))}
          >
            Next question <Icon name="arrowRight" size={16} />
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={submitting || !allAnswered}
            title={!allAnswered ? 'Answer every question to submit' : undefined}
          >
            {submitting ? 'Grading…' : 'Submit answers'}
            <Icon name="check" size={16} />
          </button>
        )}
      </div>

      {!allAnswered && (
        <p className="quiz-hint">
          <Icon name="info" size={14} /> Answer all {quiz.questionCount} questions to submit. Use the
          numbers above to jump back.
        </p>
      )}
    </section>
  );
}
