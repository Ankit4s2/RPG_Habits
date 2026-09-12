/**
 * Central game-balance config and logic.
 * Keeping all the "numbers that make the game feel good" in one file
 * makes it easy to tune later without touching route logic.
 */

// XP/gold reward per quest difficulty tier
const DIFFICULTY_REWARDS = {
  easy: { xp: 10, gold: 5 },
  medium: { xp: 25, gold: 12 },
  hard: { xp: 50, gold: 25 },
  epic: { xp: 100, gold: 60 },
};

// How much max HP a character has at a given level (simple linear scale)
const getMaxHP = (level) => 100 + (level - 1) * 10;

// XP required to go from `level` to `level + 1`
// Classic RPG-style curve: increases each level, not linear.
const xpToNextLevel = (level) => Math.floor(50 * Math.pow(level, 1.5));

/**
 * Apply the effects of completing a quest to a user document (in memory).
 * Does NOT save to DB — caller is responsible for that, so it can be
 * combined with other updates in one write.
 */
function applyQuestCompletion(user, difficulty) {
  const reward = DIFFICULTY_REWARDS[difficulty] || DIFFICULTY_REWARDS.medium;

  // Streak multiplier: every 5-day streak adds +10% XP, capped at +50%
  const streakBonusMultiplier = 1 + Math.min(Math.floor(user.streak / 5) * 0.1, 0.5);
  const xpGained = Math.round(reward.xp * streakBonusMultiplier);
  const goldGained = reward.gold;

  user.xp += xpGained;
  user.gold += goldGained;

  const leveledUp = [];
  // Handle possibly multiple level-ups from one big XP gain
  while (user.xp >= xpToNextLevel(user.level)) {
    user.xp -= xpToNextLevel(user.level);
    user.level += 1;
    user.maxHp = getMaxHP(user.level);
    user.hp = user.maxHp; // full heal on level up — feels rewarding
    leveledUp.push(user.level);
  }

  return { xpGained, goldGained, leveledUp, xpToNext: xpToNextLevel(user.level) };
}

/**
 * Apply HP penalty for a missed/overdue quest.
 * Returns whether the character "died" (hp hit 0) — you can decide
 * what that means in-game (e.g. lose streak, lose gold, respawn at lvl-appropriate HP).
 */
function applyMissedQuestPenalty(user, difficulty) {
  const penalties = { easy: 5, medium: 10, hard: 15, epic: 25 };
  const damage = penalties[difficulty] || 10;

  user.hp = Math.max(0, user.hp - damage);
  user.streak = 0; // missing a quest breaks the streak

  const died = user.hp === 0;
  if (died) {
    user.hp = user.maxHp; // respawn at full HP
    user.gold = Math.floor(user.gold * 0.5); // lose half gold as a penalty
  }

  return { damage, died };
}

module.exports = {
  DIFFICULTY_REWARDS,
  getMaxHP,
  xpToNextLevel,
  applyQuestCompletion,
  applyMissedQuestPenalty,
};