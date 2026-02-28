export class NovaHigh implements Player {
  level: Level = 1;
  xp: number = 100;

  makeChoice(input: { enemyLevel: Level; xp: number; power: number }): Move {
    const { enemyLevel, xp: enemyXp, power } = input;
    const ownLevel = this.level;
    const ownXp = this.xp;

    // Helper to compute half power (integer division like game usually does)
    const halfPower = Math.floor(power / 2);

    // 1. If we can finish opponent in level 2 – attack to win
    if (enemyLevel === 2 && enemyXp <= power) {
      return "attack";
    }

    // 2. If we are desperately low on XP and can safely revive – revive
    if (ownXp <= 30 && ownXp + power <= 100) {
      return "revive";
    }

    // 3. If opponent is in level 1 and we can reduce them to 0,
    // we avoid a simple kill (which would promote them to level 2 with 75 XP) unless we have no better option.
    if (enemyLevel === 1 && enemyXp <= power) {
      // Prefer "50" if we can heal without overflow
      if (ownXp + halfPower <= 100) {
        return "50";
      }
      // If we are low and can revive, do that
      if (ownXp <= 40 && ownXp + power <= 100) {
        return "revive";
      }
      // Otherwise, just attack (even though it revives them)
      return "attack";
    }

    // 4. If we are in level 2 and low on XP, prioritize revive
    if (ownLevel === 2 && ownXp <= 40 && ownXp + power <= 100) {
      return "revive";
    }

    // 5. Use "50" when it is safe and we want both healing and damage
    if (ownXp + halfPower <= 100) {
      // Avoid using "50" when we could finish a level‑2 opponent;
      // that case already handled in #1, so we’re safe.
      return "50";
    }

    // 6. Default aggressive move
    return "attack";
  }
}
