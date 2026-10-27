import { Progress } from '../models/Progress.js';
import { Activity } from '../models/Activity.js';

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(date) {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export async function getOrCreateProgress(userId) {
  let progress = await Progress.findOne({ user: userId });
  if (!progress) {
    progress = await Progress.create({ user: userId });
  }
  return progress;
}

/**
 * Updates the daily learning streak. Called whenever a user does something
 * meaningful (reads an article, completes a quiz).
 */
export function touchStreak(progress, when = new Date()) {
  if (!progress.lastActivityAt) {
    progress.streakDays = 1;
  } else {
    const days = Math.round((startOfDay(when) - startOfDay(progress.lastActivityAt)) / DAY_MS);
    if (days === 1) progress.streakDays += 1;
    else if (days > 1) progress.streakDays = 1;
  }
  progress.lastActivityAt = when;
}

export async function logActivity(userId, type, title, detail = '', meta = undefined) {
  try {
    await Activity.create({ user: userId, type, title, detail, meta });
  } catch (error) {
    // Activity is supplementary; never fail the main request because of it.
    console.warn('[activity] Could not record activity:', error.message);
  }
}

export function levelInfo(xp) {
  const level = Math.floor(xp / 200) + 1;
  const xpIntoLevel = xp % 200;
  return {
    level,
    xp,
    xpIntoLevel,
    xpForNextLevel: 200,
    nextLevelXp: level * 200,
    levelProgress: Math.round((xpIntoLevel / 200) * 100),
  };
}
