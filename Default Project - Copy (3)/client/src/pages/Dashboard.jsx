import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api, fieldErrors } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import ArticleCard from '../components/ArticleCard.jsx';
import { Icon } from '../components/Icons.jsx';
import { EmptyState, ErrorPanel, PageLoader } from '../components/Feedback.jsx';
import { firstName, formatDate, formatDateTime, initials, timeAgo } from '../utils/format.js';

const TABS = [
  { id: 'overview', label: 'Overview', icon: 'chart' },
  { id: 'saved', label: 'Saved articles', icon: 'bookmark' },
  { id: 'quizzes', label: 'Quiz history', icon: 'trophy' },
  { id: 'profile', label: 'Profile & preferences', icon: 'settings' },
];

const activityIcons = {
  register: 'spark',
  login: 'user',
  logout: 'logout',
  bookmark: 'bookmark',
  unbookmark: 'bookmark',
  article_read: 'book',
  quiz_completed: 'trophy',
  profile_updated: 'settings',
  password_changed: 'lock',
};

function StatCard({ icon, label, value, hint, accent = 'cyan' }) {
  return (
    <div className={`stat-card stat-${accent}`}>
      <span className="stat-icon">
        <Icon name={icon} size={18} />
      </span>
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
      {hint && <span className="stat-hint">{hint}</span>}
    </div>
  );
}

function ProgressRow({ label, value, total, caption }) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="goal-row">
      <div className="goal-row-head">
        <span>{label}</span>
        <strong>
          {value}/{total}
        </strong>
      </div>
      <div className="progress-track">
        <span className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <span className="goal-caption">{caption}</span>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <section className="section container">
      <div className="skeleton skeleton-line short" />
      <div className="skeleton skeleton-title" />
      <div className="dash-top">
        <div className="skeleton skeleton-block" />
        <div className="skeleton skeleton-block" />
      </div>
      <div className="skeleton skeleton-block" />
    </section>
  );
}

export default function Dashboard() {
  const { user, logout, updateUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const tab = TABS.some((item) => item.id === searchParams.get('tab'))
    ? searchParams.get('tab')
    : 'overview';

  const [dashboard, setDashboard] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busySlug, setBusySlug] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const loadData = useCallback(
    async ({ silent = false } = {}) => {
      if (!silent) setLoading(true);
      try {
        const [statsData, bookmarksData, attemptsData] = await Promise.all([
          api.get('/users/me/stats'),
          api.get('/bookmarks'),
          api.get('/quizzes/attempts/mine?limit=50'),
        ]);
        setDashboard(statsData.dashboard);
        setBookmarks(bookmarksData.bookmarks || []);
        setAttempts(attemptsData.attempts || []);
        setError('');
      } catch (err) {
        setError(err.message);
        if (err.status === 401) navigate('/login', { state: { from: '/dashboard' } });
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    loadData();
  }, [loadData, reloadKey]);

  function selectTab(nextTab) {
    if (nextTab === 'overview') setSearchParams({}, { replace: true });
    else setSearchParams({ tab: nextTab }, { replace: true });
  }

  async function removeBookmark(article) {
    setBusySlug(article.slug);
    try {
      await api.delete(`/bookmarks/${article.slug}`);
      toast.success('Bookmark removed.');
      await loadData({ silent: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusySlug('');
    }
  }

  if (loading) return <DashboardSkeleton />;

  if (error || !dashboard) {
    return (
      <section className="section container">
        <ErrorPanel
          title="Your dashboard could not load"
          message={error || 'Please try again.'}
          onRetry={() => setReloadKey((key) => key + 1)}
        />
      </section>
    );
  }

  const { stats, recentAttempts, recentActivity } = dashboard;

  return (
    <div className="dashboard-page">
      <section className="dash-hero">
        <div className="container dash-hero-inner">
          <div className="dash-identity">
            <span className="avatar avatar-lg">{initials(user?.name)}</span>
            <div>
              <span className="eyebrow">Your dashboard</span>
              <h1>Welcome back, {firstName(user?.name)}.</h1>
              <p>
                Your bookmarks, quiz scores, and learning progress are loaded from your account.
                {stats.lastActivityAt ? ` Last activity ${timeAgo(stats.lastActivityAt)}.` : ' Start with a guide or a quiz today.'}
              </p>
            </div>
          </div>
          <div className="dash-hero-actions">
            <Link to="/learn" className="btn btn-outline">
              <Icon name="book" size={16} /> Learning hub
            </Link>
            <Link to="/quizzes" className="btn btn-primary">
              <Icon name="play" size={15} /> Take a quiz
            </Link>
          </div>
        </div>
      </section>

      <div className="container">
        <nav className="dash-tabs" aria-label="Dashboard sections">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`dash-tab ${tab === item.id ? 'is-active' : ''}`}
              onClick={() => selectTab(item.id)}
              aria-current={tab === item.id ? 'page' : undefined}
            >
              <Icon name={item.icon} size={16} />
              <span>{item.label}</span>
              {item.id === 'saved' && stats.bookmarks > 0 && (
                <span className="dash-tab-count">{stats.bookmarks}</span>
              )}
            </button>
          ))}
        </nav>

        {tab === 'overview' && (
          <section className="dash-panel" aria-label="Learning overview">
            <div className="dash-top">
              <div className="level-card">
                <div
                  className="level-ring"
                  style={{ '--pct': `${stats.levelProgress}%` }}
                  aria-hidden="true"
                >
                  <div>
                    <span>Level</span>
                    <strong>{stats.level}</strong>
                  </div>
                </div>
                <div className="level-copy">
                  <span className="eyebrow">Learning progress</span>
                  <h2>{stats.xp} XP earned</h2>
                  <p>
                    {Math.max(stats.xpForNextLevel - stats.xpIntoLevel, 0)} XP to reach level{' '}
                    {stats.level + 1}. Read guides (+10 XP) and complete quizzes to keep moving.
                  </p>
                  <div className="progress-track progress-track-lg">
                    <span className="progress-fill" style={{ width: `${stats.levelProgress}%` }} />
                  </div>
                </div>
                <div className="streak-card">
                  <Icon name="flame" size={20} />
                  <strong>{stats.streakDays}</strong>
                  <span>day streak</span>
                </div>
              </div>

              <div className="stat-grid">
                <StatCard
                  icon="bookmark"
                  label="Saved articles"
                  value={stats.bookmarks}
                  hint="Bookmarked in the database"
                  accent="cyan"
                />
                <StatCard
                  icon="target"
                  label="Quizzes taken"
                  value={stats.quizAttempts}
                  hint={`${stats.quizzesPassed} passed`}
                  accent="violet"
                />
                <StatCard
                  icon="chart"
                  label="Average score"
                  value={`${stats.averageScore}%`}
                  hint={`Best ${stats.bestScore}%`}
                  accent="green"
                />
                <StatCard
                  icon="book"
                  label="Articles read"
                  value={stats.articlesRead}
                  hint={`of ${stats.totalArticles} guides`}
                  accent="amber"
                />
              </div>
            </div>

            <div className="dash-columns">
              <div className="dash-card">
                <div className="dash-card-head">
                  <div>
                    <span className="eyebrow">Learning path</span>
                    <h2>Your progress at a glance</h2>
                  </div>
                  <span className="dash-card-icon">
                    <Icon name="target" size={18} />
                  </span>
                </div>

                <div className="goal-list">
                  <ProgressRow
                    label="Guides completed"
                    value={stats.articlesRead}
                    total={stats.totalArticles}
                    caption="Mark a guide as read to add it here."
                  />
                  <ProgressRow
                    label="Quizzes attempted"
                    value={dashboard.progress.completedQuizzes.length}
                    total={stats.totalQuizzes}
                    caption="Try every quiz at least once."
                  />
                </div>

                <div className="goal-footer">
                  <div>
                    <span className="goal-footer-label">Daily learning goal</span>
                    <strong>{stats.learningGoalMinutes} minutes</strong>
                  </div>
                  <button type="button" className="text-button" onClick={() => selectTab('profile')}>
                    Change preference
                  </button>
                </div>

                <div className="dash-cta-row">
                  <Link to="/learn" className="btn btn-primary btn-sm">
                    Continue learning <Icon name="arrowRight" size={15} />
                  </Link>
                  <Link to="/quizzes" className="btn btn-outline btn-sm">
                    Practice a quiz
                  </Link>
                </div>
              </div>

              <div className="dash-card">
                <div className="dash-card-head">
                  <div>
                    <span className="eyebrow">Recent activity</span>
                    <h2>What you have done</h2>
                  </div>
                  <span className="dash-card-icon">
                    <Icon name="clock" size={18} />
                  </span>
                </div>

                {recentActivity.length === 0 ? (
                  <EmptyState
                    icon="spark"
                    title="No activity yet"
                    text="Read a guide or take a quiz and your activity will appear here."
                    actionTo="/learn"
                    actionLabel="Start learning"
                  />
                ) : (
                  <ul className="activity-list">
                    {recentActivity.map((item) => (
                      <li key={item.id}>
                        <span className={`activity-icon activity-${item.type}`}>
                          <Icon name={activityIcons[item.type] || 'spark'} size={15} />
                        </span>
                        <div>
                          <strong>{item.title}</strong>
                          {item.detail && <span>{item.detail}</span>}
                        </div>
                        <time dateTime={item.createdAt}>{timeAgo(item.createdAt)}</time>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="dash-card">
              <div className="dash-card-head">
                <div>
                  <span className="eyebrow">Recent results</span>
                  <h2>Your latest quiz attempts</h2>
                </div>
                <button type="button" className="text-button" onClick={() => selectTab('quizzes')}>
                  View all attempts
                </button>
              </div>

              {recentAttempts.length === 0 ? (
                <EmptyState
                  icon="trophy"
                  title="No quiz attempts yet"
                  text="Take your first quiz to test your instincts and earn XP."
                  actionTo="/quizzes"
                  actionLabel="Browse quizzes"
                />
              ) : (
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Quiz</th>
                        <th>Score</th>
                        <th>Result</th>
                        <th>XP</th>
                        <th>Completed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentAttempts.map((attempt) => (
                        <tr key={attempt.id}>
                          <td>
                            <span className="table-quiz">
                              <span aria-hidden="true">{attempt.quiz?.emoji || '🧠'}</span>
                              {attempt.quiz?.title || attempt.quizTitle}
                            </span>
                          </td>
                          <td>
                            {attempt.score}/{attempt.totalQuestions}{' '}
                            <span className="table-muted">({attempt.percentage}%)</span>
                          </td>
                          <td>
                            <span className={`badge ${attempt.passed ? 'badge-success' : 'badge-warn'}`}>
                              {attempt.passed ? 'Passed' : 'Retry'}
                            </span>
                          </td>
                          <td>+{attempt.xpEarned}</td>
                          <td className="table-muted">{formatDateTime(attempt.completedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}

        {tab === 'saved' && (
          <section className="dash-panel" aria-label="Saved articles">
            <div className="dash-panel-head">
              <div>
                <span className="eyebrow">Your library</span>
                <h2>Saved articles</h2>
                <p>{bookmarks.length} {bookmarks.length === 1 ? 'guide' : 'guides'} saved to your account.</p>
              </div>
              <Link to="/learn" className="btn btn-outline btn-sm">
                Browse more guides <Icon name="arrowRight" size={15} />
              </Link>
            </div>

            {bookmarks.length === 0 ? (
              <EmptyState
                icon="bookmark"
                title="No saved articles yet"
                text="Use the bookmark button on any guide to keep it here for later."
                actionTo="/learn"
                actionLabel="Explore the learning hub"
              />
            ) : (
              <div className="article-grid">
                {bookmarks.map((bookmark) => (
                  <ArticleCard
                    key={bookmark.id}
                    article={{ ...bookmark.article, bookmarked: true }}
                    onToggleBookmark={removeBookmark}
                    busy={busySlug === bookmark.article.slug}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {tab === 'quizzes' && (
          <section className="dash-panel" aria-label="Quiz history">
            <div className="dash-panel-head">
              <div>
                <span className="eyebrow">Every attempt, saved</span>
                <h2>Quiz history</h2>
                <p>
                  {attempts.length} {attempts.length === 1 ? 'attempt' : 'attempts'} recorded in
                  your account.
                </p>
              </div>
              <Link to="/quizzes" className="btn btn-primary btn-sm">
                Take another quiz <Icon name="play" size={14} />
              </Link>
            </div>

            <div className="stat-grid stat-grid-inline">
              <StatCard icon="target" label="Attempts" value={stats.quizAttempts} accent="violet" />
              <StatCard icon="chart" label="Average" value={`${stats.averageScore}%`} accent="green" />
              <StatCard icon="trophy" label="Best score" value={`${stats.bestScore}%`} accent="amber" />
              <StatCard icon="check" label="Quizzes passed" value={stats.quizzesPassed} accent="cyan" />
            </div>

            {attempts.length === 0 ? (
              <EmptyState
                icon="brain"
                title="Your quiz history is empty"
                text="Each attempt stores your answers, score, and completion date on your account."
                actionTo="/quizzes"
                actionLabel="Take your first quiz"
              />
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Quiz</th>
                      <th>Score</th>
                      <th>Percentage</th>
                      <th>Result</th>
                      <th>XP earned</th>
                      <th>Completed on</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attempts.map((attempt) => (
                      <tr key={attempt.id}>
                        <td>
                          <span className="table-quiz">
                            <span aria-hidden="true">{attempt.quiz?.emoji || '🧠'}</span>
                            {attempt.quiz?.title || attempt.quizTitle}
                          </span>
                          {attempt.quiz?.category && (
                            <span className="table-sub">{attempt.quiz.category}</span>
                          )}
                        </td>
                        <td>
                          {attempt.score}/{attempt.totalQuestions}
                        </td>
                        <td>{attempt.percentage}%</td>
                        <td>
                          <span className={`badge ${attempt.passed ? 'badge-success' : 'badge-warn'}`}>
                            {attempt.passed ? 'Passed' : 'Retry'}
                          </span>
                        </td>
                        <td>+{attempt.xpEarned}</td>
                        <td className="table-muted">{formatDate(attempt.completedAt, { hour: 'numeric', minute: '2-digit' })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {tab === 'profile' && (
          <ProfileTab
            user={user}
            stats={stats}
            updateUser={updateUser}
            onSaved={() => loadData({ silent: true })}
            toast={toast}
            logout={logout}
            navigate={navigate}
          />
        )}
      </div>
    </div>
  );
}

function ProfileTab({ user, stats, updateUser, onSaved, toast, logout, navigate }) {
  const [profile, setProfile] = useState({
    name: user?.name || '',
    emailNotifications: user?.preferences?.emailNotifications ?? true,
    weeklyDigest: user?.preferences?.weeklyDigest ?? true,
    theme: user?.preferences?.theme || 'dark',
    learningGoalMinutes: user?.preferences?.learningGoalMinutes ?? 15,
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [savingPassword, setSavingPassword] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function saveProfile(event) {
    event.preventDefault();
    if (profile.name.trim().length < 2) {
      setProfileErrors({ name: 'Name must be at least 2 characters.' });
      return;
    }

    setSavingProfile(true);
    setProfileErrors({});
    try {
      const data = await api.patch('/users/me', {
        name: profile.name.trim(),
        preferences: {
          emailNotifications: profile.emailNotifications,
          weeklyDigest: profile.weeklyDigest,
          theme: profile.theme,
          learningGoalMinutes: Number(profile.learningGoalMinutes),
        },
      });
      updateUser(data.user);
      toast.success(data.message || 'Profile updated.');
      onSaved();
    } catch (err) {
      setProfileErrors(fieldErrors(err));
      toast.error(err.message);
    } finally {
      setSavingProfile(false);
    }
  }

  async function changePassword(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!passwords.currentPassword) nextErrors.currentPassword = 'Enter your current password.';
    if (passwords.newPassword.length < 8) nextErrors.newPassword = 'Use at least 8 characters.';
    else if (!/[A-Za-z]/.test(passwords.newPassword) || !/[0-9]/.test(passwords.newPassword))
      nextErrors.newPassword = 'Include at least one letter and one number.';
    if (passwords.newPassword !== passwords.confirmPassword)
      nextErrors.confirmPassword = 'Passwords do not match.';

    if (Object.keys(nextErrors).length) {
      setPasswordErrors(nextErrors);
      return;
    }

    setSavingPassword(true);
    setPasswordErrors({});
    try {
      const data = await api.put('/users/me/password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success(data.message || 'Password changed.');
    } catch (err) {
      setPasswordErrors(fieldErrors(err));
      toast.error(err.message);
    } finally {
      setSavingPassword(false);
    }
  }

  async function deleteAccount() {
    setDeleting(true);
    try {
      await api.delete('/users/me');
      await logout();
      toast.success('Your account and all associated data have been deleted.');
      navigate('/');
    } catch (err) {
      toast.error(err.message);
      setDeleting(false);
    }
  }

  return (
    <section className="dash-panel profile-panel" aria-label="Profile and preferences">
      <div className="dash-panel-head">
        <div>
          <span className="eyebrow">Your account</span>
          <h2>Profile &amp; preferences</h2>
          <p>These details are stored in MongoDB and loaded whenever you log in.</p>
        </div>
      </div>

      <div className="profile-grid">
        <form className="dash-card profile-form" onSubmit={saveProfile}>
          <div className="dash-card-head">
            <div>
              <h3>Personal details</h3>
              <p className="dash-card-sub">Update how your account appears.</p>
            </div>
            <span className="dash-card-icon">
              <Icon name="user" size={18} />
            </span>
          </div>

          <div className={`field ${profileErrors.name ? 'has-error' : ''}`}>
            <label htmlFor="profile-name">Full name</label>
            <div className="input-wrap">
              <Icon name="user" size={17} className="input-icon" />
              <input
                id="profile-name"
                type="text"
                value={profile.name}
                onChange={(event) => setProfile({ ...profile, name: event.target.value })}
                aria-invalid={Boolean(profileErrors.name)}
              />
            </div>
            {profileErrors.name && <span className="field-error">{profileErrors.name}</span>}
          </div>

          <div className="field">
            <label htmlFor="profile-email">Email address</label>
            <div className="input-wrap">
              <Icon name="mail" size={17} className="input-icon" />
              <input id="profile-email" type="email" value={user?.email || ''} disabled />
            </div>
            <span className="field-hint">Email changes are disabled to keep your account secure.</span>
          </div>

          <div className="field">
            <label htmlFor="profile-theme">Theme preference</label>
            <select
              id="profile-theme"
              className="select-input"
              value={profile.theme}
              onChange={(event) => setProfile({ ...profile, theme: event.target.value })}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">Match my system</option>
            </select>
            <span className="field-hint">Your chosen theme applies to this browser immediately.</span>
          </div>

          <div className="field">
            <label htmlFor="profile-goal">Daily learning goal</label>
            <select
              id="profile-goal"
              className="select-input"
              value={profile.learningGoalMinutes}
              onChange={(event) =>
                setProfile({ ...profile, learningGoalMinutes: Number(event.target.value) })
              }
            >
              {[5, 10, 15, 20, 30, 45, 60].map((minutes) => (
                <option key={minutes} value={minutes}>
                  {minutes} minutes per day
                </option>
              ))}
            </select>
          </div>

          <div className="switch-list">
            <label className="switch-row">
              <span>
                <strong>Email notifications</strong>
                <small>Send me occasional safety alerts and account notices.</small>
              </span>
              <input
                type="checkbox"
                checked={profile.emailNotifications}
                onChange={(event) =>
                  setProfile({ ...profile, emailNotifications: event.target.checked })
                }
              />
              <span className="switch" aria-hidden="true" />
            </label>

            <label className="switch-row">
              <span>
                <strong>Weekly learning digest</strong>
                <small>A short summary of new guides and scam trends.</small>
              </span>
              <input
                type="checkbox"
                checked={profile.weeklyDigest}
                onChange={(event) => setProfile({ ...profile, weeklyDigest: event.target.checked })}
              />
              <span className="switch" aria-hidden="true" />
            </label>
          </div>

          <div className="form-footer">
            <button type="submit" className="btn btn-primary" disabled={savingProfile}>
              {savingProfile ? 'Saving…' : 'Save changes'}
            </button>
            <span className="form-footer-note">
              {stats.lastActivityAt ? `Profile loaded from your account · ${formatDate(user?.createdAt)}` : ''}
            </span>
          </div>
        </form>

        <div className="profile-side">
          <form className="dash-card" onSubmit={changePassword}>
            <div className="dash-card-head">
              <div>
                <h3>Change password</h3>
                <p className="dash-card-sub">Use a unique password you do not reuse elsewhere.</p>
              </div>
              <span className="dash-card-icon">
                <Icon name="key" size={18} />
              </span>
            </div>

            <div className={`field ${passwordErrors.currentPassword ? 'has-error' : ''}`}>
              <label htmlFor="current-password">Current password</label>
              <div className="input-wrap">
                <Icon name="lock" size={17} className="input-icon" />
                <input
                  id="current-password"
                  type="password"
                  autoComplete="current-password"
                  value={passwords.currentPassword}
                  onChange={(event) =>
                    setPasswords({ ...passwords, currentPassword: event.target.value })
                  }
                />
              </div>
              {passwordErrors.currentPassword && (
                <span className="field-error">{passwordErrors.currentPassword}</span>
              )}
            </div>

            <div className={`field ${passwordErrors.newPassword ? 'has-error' : ''}`}>
              <label htmlFor="new-password">New password</label>
              <div className="input-wrap">
                <Icon name="lock" size={17} className="input-icon" />
                <input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  value={passwords.newPassword}
                  onChange={(event) => setPasswords({ ...passwords, newPassword: event.target.value })}
                />
              </div>
              {passwordErrors.newPassword && (
                <span className="field-error">{passwordErrors.newPassword}</span>
              )}
            </div>

            <div className={`field ${passwordErrors.confirmPassword ? 'has-error' : ''}`}>
              <label htmlFor="confirm-new-password">Confirm new password</label>
              <div className="input-wrap">
                <Icon name="lock" size={17} className="input-icon" />
                <input
                  id="confirm-new-password"
                  type="password"
                  autoComplete="new-password"
                  value={passwords.confirmPassword}
                  onChange={(event) =>
                    setPasswords({ ...passwords, confirmPassword: event.target.value })
                  }
                />
              </div>
              {passwordErrors.confirmPassword && (
                <span className="field-error">{passwordErrors.confirmPassword}</span>
              )}
            </div>

            <button type="submit" className="btn btn-outline btn-block" disabled={savingPassword}>
              {savingPassword ? 'Updating…' : 'Update password'}
            </button>
          </form>

          <div className="dash-card">
            <div className="dash-card-head">
              <div>
                <h3>Session</h3>
                <p className="dash-card-sub">Your login is secured with an httpOnly cookie.</p>
              </div>
              <span className="dash-card-icon">
                <Icon name="shield" size={18} />
              </span>
            </div>
            <div className="session-row">
              <span className="session-dot" aria-hidden="true" />
              <div>
                <strong>Signed in as {user?.name}</strong>
                <span>{user?.email}</span>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-outline btn-block"
              onClick={async () => {
                await logout();
                toast.success('You have been logged out securely.');
                navigate('/');
              }}
            >
              <Icon name="logout" size={16} /> Log out of this device
            </button>
          </div>

          <div className="dash-card danger-zone">
            <div className="dash-card-head">
              <div>
                <h3>Delete account</h3>
                <p className="dash-card-sub">
                  Permanently remove your profile, bookmarks, quiz attempts, and progress.
                </p>
              </div>
              <span className="dash-card-icon danger-icon">
                <Icon name="alert" size={18} />
              </span>
            </div>

            {confirmDelete ? (
              <div className="danger-confirm">
                <p>This cannot be undone. Delete all of your ScamShield data?</p>
                <div className="danger-actions">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={deleteAccount}
                    disabled={deleting}
                  >
                    {deleting ? 'Deleting…' : 'Yes, delete everything'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setConfirmDelete(false)}
                    disabled={deleting}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-danger-outline"
                onClick={() => setConfirmDelete(true)}
              >
                Delete my account
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
