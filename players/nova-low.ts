export class NovaLow implements Player {
  level: Level = 1;
  xp: number = 100;

  makeChoice(input: { enemyLevel: Level; xp: number; power: number }): Move {
    const { enemyLevel, xp: enemyXp, power } = input;
    const ownXp = this.xp;
    const ownLevel = this.level;

    // If we can eliminate opponent in one hit, attack
    if (enemyXp <= power) {
      return "attack";
    }

    // If own xp is already at max, no point in reviving or 50 (which increase own xp)
    if (ownXp >= 100) {
      return "attack";
    }

    // In second level, be more defensive when low on xp
    if (ownLevel === 2) {
      // Very low own xp -> revive to survive
      if (ownXp <= 20) {
        return "revive";
      }
      // Moderate need for xp, use balanced move if power is decent
      if (ownXp < 70 && power > 5) {
        return "50";
      }
      // Otherwise attack
      return "attack";
    }

    // In first level strategies
    // If very low on xp, revive
    if (ownXp <= 30) {
      return "revive";
    }

    // If close to max xp, prefer attack
    if (ownXp >= 80) {
      return "attack";
    }

    // Default balanced choice
    return "50";
  }
}
