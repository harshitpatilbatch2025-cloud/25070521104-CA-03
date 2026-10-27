/**
 * ScamShield API smoke test
 *
 * Usage:
 *   node scripts/smoke-test.mjs
 *   API_URL=http://localhost:5000/api node scripts/smoke-test.mjs
 *
 * Creates two temporary accounts, exercises the full authenticated workflow,
 * then deletes both accounts. It never touches seeded content.
 */

const API = (process.env.API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
const stamp = Date.now();
const emailA = `smoke.a.${stamp}@example.com`;
const emailB = `smoke.b.${stamp}@example.com`;
const password = 'ShieldTest123';
const newPassword = 'ShieldTest456';

let passed = 0;
const failures = [];

function check(name, condition, detail = '') {
  if (condition) {
    passed += 1;
    console.log(`  PASS  ${name}`);
  } else {
    failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
    console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

class Session {
  constructor(label) {
    this.label = label;
    this.cookie = '';
  }

  async request(path, { method = 'GET', body, expected = 200 } = {}) {
    const headers = { Accept: 'application/json' };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (this.cookie) headers.Cookie = this.cookie;

    const response = await fetch(`${API}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    const setCookies = response.headers.getSetCookie?.() ?? [];
    for (const raw of setCookies) {
      const [pair] = raw.split(';');
      if (pair.startsWith('scamshield_token=')) {
        this.cookie = pair.endsWith('=') ? '' : pair;
      }
    }

    const text = await response.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { raw: text };
    }

    if (expected !== null && response.status !== expected) {
      throw new Error(
        `${this.label} ${method} ${path} expected ${expected}, got ${response.status}: ${text.slice(0, 300)}`
      );
    }

    return { status: response.status, data, headers: response.headers };
  }
}

async function main() {
  console.log(`ScamShield API smoke test against ${API}\n`);

  const health = await fetch(`${API}/health`).then((response) => response.json());
  check('health endpoint reports a connected database', health.status === 'ok' && health.database === 'connected');
  check('seeded articles exist', health.counts?.articles >= 10, `found ${health.counts?.articles}`);
  check('seeded quizzes exist', health.counts?.quizzes >= 4, `found ${health.counts?.quizzes}`);

  const publicSession = new Session('public');
  const articlesResponse = await publicSession.request('/articles');
  const articles = articlesResponse.data.articles;
  check('public article list loads', Array.isArray(articles) && articles.length >= 10);

  const quizzesResponse = await publicSession.request('/quizzes');
  const quizzes = quizzesResponse.data.quizzes;
  check('public quiz list loads', Array.isArray(quizzes) && quizzes.length >= 4);

  const featured = await publicSession.request('/articles?featured=true&limit=4');
  check('featured filter works', featured.data.articles.length > 0 && featured.data.articles.every((a) => a.featured));

  const article = articles[0];
  const articleDetail = await publicSession.request(`/articles/${article.slug}`);
  check('article detail includes body and related guides', Boolean(articleDetail.data.article?.body?.length));
  check('anonymous article detail is not bookmarked', articleDetail.data.bookmarked === false);

  const quizSummary = quizzes[0];
  const quizDetail = await publicSession.request(`/quizzes/${quizSummary.slug}`);
  const quiz = quizDetail.data.quiz;
  check('quiz detail hides correct answers', quiz.questions.every((question) => question.correctIndex === undefined));
  check('quiz detail exposes answerable options', quiz.questions.every((question) => question.options.length >= 2));

  console.log('\nAccount A — register and authenticated workflow');

  const sessionA = new Session('account A');
  const registration = await sessionA.request('/auth/register', {
    method: 'POST',
    expected: 201,
    body: {
      name: 'Smoke Tester A',
      email: emailA,
      password,
      confirmPassword: password,
    },
  });
  check('registration creates an account', registration.data.user?.email === emailA);
  check('registration sets an auth cookie', sessionA.cookie.startsWith('scamshield_token='));
  check('password hash is never returned', !JSON.stringify(registration.data).includes('passwordHash'));

  const me = await sessionA.request('/auth/me');
  check('session restores the current user', me.data.user?.email === emailA);

  const duplicate = await sessionA.request('/auth/register', {
    method: 'POST',
    expected: 409,
    body: { name: 'Duplicate', email: emailA, password, confirmPassword: password },
  });
  check('duplicate registration is rejected', duplicate.status === 409);

  const badLogin = await publicSession.request('/auth/login', {
    method: 'POST',
    expected: 401,
    body: { email: emailA, password: 'WrongPassword1' },
  });
  check('wrong password is rejected', badLogin.status === 401);

  const bookmark = await sessionA.request('/bookmarks', {
    method: 'POST',
    expected: 201,
    body: { articleSlug: article.slug },
  });
  check('bookmark is created', bookmark.data.bookmarked === true);

  const bookmarks = await sessionA.request('/bookmarks');
  check('bookmark list is user-specific and populated', bookmarks.data.bookmarks.length === 1 && bookmarks.data.bookmarks[0].article.slug === article.slug);

  const detailAfterSave = await sessionA.request(`/articles/${article.slug}`);
  check('article detail reflects bookmark state', detailAfterSave.data.bookmarked === true);

  const read = await sessionA.request(`/progress/read/${article.slug}`, {
    method: 'POST',
    expected: 201,
  });
  check('article read awards XP once', read.data.xpAwarded === 10);

  const readAgain = await sessionA.request(`/progress/read/${article.slug}`, { method: 'POST' });
  check('duplicate read awards no extra XP', readAgain.data.xpAwarded === 0 && readAgain.data.alreadyRead === true);

  const answers = quiz.questions.map((question) => ({ questionId: question.id, selectedIndex: 0 }));
  const attempt = await sessionA.request(`/quizzes/${quiz.slug}/attempt`, {
    method: 'POST',
    expected: 201,
    body: { answers, durationSeconds: 42 },
  });
  check('quiz is graded server-side', attempt.data.attempt?.totalQuestions === quiz.questions.length);
  check('quiz result returns explanations', attempt.data.review.every((item) => typeof item.correctIndex === 'number' && item.explanation));
  const expectedXp =
    attempt.data.attempt.score * quiz.xpPerCorrect + (attempt.data.attempt.percentage === 100 ? 25 : 0);
  check('quiz XP follows the grading rules', attempt.data.attempt.xpEarned === expectedXp);

  const attempts = await sessionA.request('/quizzes/attempts/mine');
  check('quiz attempt is persisted for the user', attempts.data.attempts.some((item) => item.id === attempt.data.attempt.id));

  const incomplete = await sessionA.request(`/quizzes/${quiz.slug}/attempt`, {
    method: 'POST',
    expected: 422,
    body: { answers: answers.slice(0, 1), durationSeconds: 5 },
  });
  check('incomplete quiz submission is rejected', incomplete.status === 422);

  const progress = await sessionA.request('/progress');
  check('learning progress is persisted', progress.data.progress.articlesRead.some((entry) => entry.article?.slug === article.slug));
  check('completed quiz is persisted', progress.data.progress.completedQuizzes.some((entry) => entry.quiz?.slug === quiz.slug));

  const stats = await sessionA.request('/users/me/stats');
  check('dashboard stats reflect real activity', stats.data.dashboard.stats.articlesRead === 1 && stats.data.dashboard.stats.quizAttempts === 1);
  check('dashboard includes activity feed', stats.data.dashboard.recentActivity.length > 0);

  const profile = await sessionA.request('/users/me', {
    method: 'PATCH',
    body: {
      name: 'Smoke Tester A Updated',
      preferences: { theme: 'light', learningGoalMinutes: 30, weeklyDigest: false },
    },
  });
  check('profile update is persisted', profile.data.user.name === 'Smoke Tester A Updated' && profile.data.user.preferences.theme === 'light');
  check('preference update is persisted', profile.data.user.preferences.learningGoalMinutes === 30 && profile.data.user.preferences.weeklyDigest === false);

  const passwordChange = await sessionA.request('/users/me/password', {
    method: 'PUT',
    body: { currentPassword: password, newPassword },
  });
  check('password change succeeds', Boolean(passwordChange.data.message));

  const reLogin = await sessionA.request('/auth/login', {
    method: 'POST',
    body: { email: emailA, password: newPassword },
  });
  check('login works with the new password', reLogin.data.user.email === emailA);

  const oldPasswordLogin = await publicSession.request('/auth/login', {
    method: 'POST',
    expected: 401,
    body: { email: emailA, password },
  });
  check('old password no longer works', oldPasswordLogin.status === 401);

  console.log('\nAccount B — data isolation');

  const sessionB = new Session('account B');
  await sessionB.request('/auth/register', {
    method: 'POST',
    expected: 201,
    body: {
      name: 'Smoke Tester B',
      email: emailB,
      password,
      confirmPassword: password,
    },
  });

  const bookmarksB = await sessionB.request('/bookmarks');
  check('account B sees no bookmarks from account A', bookmarksB.data.bookmarks.length === 0);

  const attemptsB = await sessionB.request('/quizzes/attempts/mine');
  check('account B sees no attempts from account A', attemptsB.data.attempts.length === 0);

  const statsB = await sessionB.request('/users/me/stats');
  check('account B has independent stats', statsB.data.dashboard.stats.quizAttempts === 0 && statsB.data.dashboard.stats.articlesRead === 0);

  console.log('\nLogout and account deletion');

  const logout = await sessionA.request('/auth/logout', { method: 'POST' });
  check('logout confirms', Boolean(logout.data.message));

  const unauthorized = await sessionA.request('/auth/me', { expected: 401 });
  check('protected route rejects the cleared session', unauthorized.status === 401);
  check('logout clears the auth cookie', sessionA.cookie === '');

  await sessionA.request('/auth/login', {
    method: 'POST',
    body: { email: emailA, password: newPassword },
  });
  const deleteA = await sessionA.request('/users/me', { method: 'DELETE' });
  check('account A deletes itself', Boolean(deleteA.data.message));
  check('account A session is cleared after deletion', sessionA.cookie === '');

  const deleteB = await sessionB.request('/users/me', { method: 'DELETE' });
  check('account B deletes itself', Boolean(deleteB.data.message));

  const deletedLogin = await publicSession.request('/auth/login', {
    method: 'POST',
    expected: 401,
    body: { email: emailB, password },
  });
  check('deleted account can no longer log in', deletedLogin.status === 401);

  console.log(`\n${passed} checks passed, ${failures.length} failed.`);
  if (failures.length) {
    console.log('\nFailures:');
    failures.forEach((failure) => console.log(`  - ${failure}`));
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('\nSmoke test crashed:', error.message);
  process.exitCode = 1;
});
