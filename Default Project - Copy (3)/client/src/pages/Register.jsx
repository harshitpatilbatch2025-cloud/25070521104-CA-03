import { useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { fieldErrors } from '../api/client.js';
import { Icon } from '../components/Icons.jsx';
import Logo, { LogoMark } from '../components/Logo.jsx';

function passwordChecks(password) {
  return {
    length: password.length >= 8,
    letter: /[A-Za-z]/.test(password),
    number: /[0-9]/.test(password),
    strong: password.length >= 12,
  };
}

export default function Register() {
  const { user, loading, register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from =
    typeof location.state?.from === 'string' && location.state.from.startsWith('/')
      ? location.state.from
      : '/dashboard';

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const checks = useMemo(() => passwordChecks(form.password), [form.password]);
  const strength = Object.values(checks).filter(Boolean).length;

  if (!loading && user) {
    return <Navigate to={from === '/register' ? '/dashboard' : from} replace />;
  }

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFormError('');
  }

  function validate() {
    const nextErrors = {};
    if (form.name.trim().length < 2) nextErrors.name = 'Enter your name (at least 2 characters).';
    if (!form.email.trim()) nextErrors.email = 'Enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      nextErrors.email = 'Enter a valid email address.';
    if (form.password.length < 8) nextErrors.password = 'Password must be at least 8 characters.';
    else if (!checks.letter || !checks.number)
      nextErrors.password = 'Password must include at least one letter and one number.';
    if (form.confirmPassword !== form.password)
      nextErrors.confirmPassword = 'Passwords do not match.';
    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    setFormError('');
    try {
      const data = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      toast.success(data.message || 'Your account is ready.');
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
        <aside className="auth-aside auth-aside-register">
          <Logo />
          <div className="auth-aside-body">
            <span className="eyebrow">Join ScamShield</span>
            <h2>One account. A safer digital life.</h2>
            <p>
              Create a free account to save guides, take quizzes, and see your learning progress
              whenever you come back.
            </p>
            <ul className="auth-benefits">
              <li>
                <span>
                  <Icon name="bookmark" size={16} />
                </span>
                Bookmark and revisit practical guides
              </li>
              <li>
                <span>
                  <Icon name="trophy" size={16} />
                </span>
                Quiz scores, answers, and completion dates saved
              </li>
              <li>
                <span>
                  <Icon name="chart" size={16} />
                </span>
                Personalized dashboard and learning statistics
              </li>
              <li>
                <span>
                  <Icon name="settings" size={16} />
                </span>
                Your preferences, your control
              </li>
            </ul>
          </div>
          <div className="auth-trust">
            <Icon name="shield" size={18} />
            <div>
              <strong>Private by design</strong>
              <span>Passwords are hashed with bcrypt and never stored in the browser.</span>
            </div>
          </div>
        </aside>

        <div className="auth-card">
          <span className="eyebrow">Create account</span>
          <h1>Start your safety journey</h1>
          <p className="auth-sub">
            Already have an account?{' '}
            <Link to="/login" state={{ from }}>
              Log in
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
            <div className={`field ${errors.name ? 'has-error' : ''}`}>
              <label htmlFor="register-name">Full name</label>
              <div className="input-wrap">
                <Icon name="user" size={17} className="input-icon" />
                <input
                  id="register-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(event) => update('name', event.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'register-name-error' : undefined}
                />
              </div>
              {errors.name && (
                <span className="field-error" id="register-name-error">
                  {errors.name}
                </span>
              )}
            </div>

            <div className={`field ${errors.email ? 'has-error' : ''}`}>
              <label htmlFor="register-email">Email address</label>
              <div className="input-wrap">
                <Icon name="mail" size={17} className="input-icon" />
                <input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(event) => update('email', event.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'register-email-error' : undefined}
                />
              </div>
              {errors.email && (
                <span className="field-error" id="register-email-error">
                  {errors.email}
                </span>
              )}
            </div>

            <div className={`field ${errors.password ? 'has-error' : ''}`}>
              <label htmlFor="register-password">Password</label>
              <div className="input-wrap">
                <Icon name="lock" size={17} className="input-icon" />
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={(event) => update('password', event.target.value)}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby="password-requirements"
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
              <div className="password-meter" aria-hidden="true">
                {[1, 2, 3, 4].map((level) => (
                  <span
                    key={level}
                    className={`password-meter-segment ${
                      strength >= level ? `level-${strength}` : ''
                    }`}
                  />
                ))}
              </div>
              <ul className="password-rules" id="password-requirements">
                <li className={checks.length ? 'is-met' : ''}>
                  <Icon name="check" size={12} /> 8+ characters
                </li>
                <li className={checks.letter ? 'is-met' : ''}>
                  <Icon name="check" size={12} /> A letter
                </li>
                <li className={checks.number ? 'is-met' : ''}>
                  <Icon name="check" size={12} /> A number
                </li>
                <li className={checks.strong ? 'is-met' : ''}>
                  <Icon name="check" size={12} /> 12+ for extra strength
                </li>
              </ul>
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <div className={`field ${errors.confirmPassword ? 'has-error' : ''}`}>
              <label htmlFor="register-confirm">Confirm password</label>
              <div className="input-wrap">
                <Icon name="lock" size={17} className="input-icon" />
                <input
                  id="register-confirm"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={(event) => update('confirmPassword', event.target.value)}
                  aria-invalid={Boolean(errors.confirmPassword)}
                  aria-describedby={errors.confirmPassword ? 'register-confirm-error' : undefined}
                />
              </div>
              {errors.confirmPassword && (
                <span className="field-error" id="register-confirm-error">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="button-spinner" aria-hidden="true" /> Creating account…
                </>
              ) : (
                <>
                  Create my free account <Icon name="arrowRight" size={17} />
                </>
              )}
            </button>
          </form>

          <div className="auth-security-note">
            <Icon name="lock" size={14} />
            <span>
              We store your name, email, and a hashed password. No payment details, no selling of
              personal data.
            </span>
          </div>

          <p className="auth-browse">
            By creating an account you agree to use ScamShield for education and awareness. Read our
            <Link to="/scam-types"> safety guidance</Link>.
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
