import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { fieldErrors } from '../api/client.js';
import { Icon } from '../components/Icons.jsx';
import Logo, { LogoMark } from '../components/Logo.jsx';

export default function Login() {
  const { user, loading, login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from =
    typeof location.state?.from === 'string' && location.state.from.startsWith('/')
      ? location.state.from
      : '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Navigate to={from === '/login' ? '/dashboard' : from} replace />;
  }

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFormError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.email.trim()) nextErrors.email = 'Enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      nextErrors.email = 'Enter a valid email address.';
    if (!form.password) nextErrors.password = 'Enter your password.';

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    setFormError('');
    try {
      const data = await login({ email: form.email.trim(), password: form.password });
      toast.success(data.message || 'Logged in successfully.');
      navigate(from, { replace: true });
    } catch (error) {
      setErrors(fieldErrors(error));
      setFormError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-page container">
      <div className="auth-shell">
        <aside className="auth-aside">
          <Logo />
          <div className="auth-aside-body">
            <span className="eyebrow">Welcome back</span>
            <h2>Pick up where you left off.</h2>
            <p>
              Your bookmarks, quiz history, and learning progress are waiting in your ScamShield
              dashboard.
            </p>
            <ul className="auth-benefits">
              <li>
                <span>
                  <Icon name="bookmark" size={16} />
                </span>
                Saved guides stay with your account
              </li>
              <li>
                <span>
                  <Icon name="chart" size={16} />
                </span>
                Every quiz attempt and score is recorded
              </li>
              <li>
                <span>
                  <Icon name="flame" size={16} />
                </span>
                Keep your learning streak alive
              </li>
            </ul>
          </div>
          <div className="auth-quote">
            <blockquote>
              “The best defence is a habit: pause, verify, then act.”
            </blockquote>
            <span>ScamShield learning principle</span>
          </div>
        </aside>

        <div className="auth-card">
          <span className="eyebrow">Log in</span>
          <h1>Welcome back to ScamShield</h1>
          <p className="auth-sub">
            New here?{' '}
            <Link to="/register" state={{ from }}>
              Create a free account
            </Link>
            .
          </p>

          {formError && (
            <div className="alert alert-error" role="alert">
              <Icon name="alert" size={18} />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className={`field ${errors.email ? 'has-error' : ''}`}>
              <label htmlFor="login-email">Email address</label>
              <div className="input-wrap">
                <Icon name="mail" size={17} className="input-icon" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(event) => update('email', event.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'login-email-error' : undefined}
                />
              </div>
              {errors.email && (
                <span className="field-error" id="login-email-error">
                  {errors.email}
                </span>
              )}
            </div>

            <div className={`field ${errors.password ? 'has-error' : ''}`}>
              <label htmlFor="login-password">Password</label>
              <div className="input-wrap">
                <Icon name="lock" size={17} className="input-icon" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Your password"
                  value={form.password}
                  onChange={(event) => update('password', event.target.value)}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'login-password-error' : undefined}
                />
                <button
                  type="button"
                  className="input-action"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Icon name={showPassword ? 'eyeOff' : 'eye'} size={17} />
                </button>
              </div>
              {errors.password && (
                <span className="field-error" id="login-password-error">
                  {errors.password}
                </span>
              )}
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="button-spinner" aria-hidden="true" /> Logging in…
                </>
              ) : (
                <>
                  Log in to your account <Icon name="arrowRight" size={17} />
                </>
              )}
            </button>
          </form>

          <div className="auth-security-note">
            <Icon name="lock" size={14} />
            <span>
              Your session is stored in a secure, httpOnly cookie. ScamShield never stores your
              password in the browser.
            </span>
          </div>

          <div className="auth-divider">
            <span>New to ScamShield?</span>
          </div>

          <Link to="/register" state={{ from }} className="btn btn-outline btn-block">
            <Icon name="user" size={16} /> Create a free account
          </Link>

          <p className="auth-browse">
            Not ready to sign up?{' '}
            <Link to="/learn">Keep exploring the learning hub</Link>.
          </p>
        </div>
      </div>

      <div className="auth-mobile-brand" aria-hidden="true">
        <LogoMark size={30} />
        <span>Recognize scams. Protect yourself.</span>
      </div>
    </section>
  );
}
