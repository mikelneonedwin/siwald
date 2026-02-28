export class KimiThinking implements Player {
  level: Level = 1;
  xp: number = 100;

  makeChoice(input: { enemyLevel: Level; xp: number; power: number }): Move {
    const { enemyLevel, xp: enemyXp, power } = input;

    // Critical thresholds
    const isInLevel2 = this.level === 2;
    const enemyInLevel2 = enemyLevel === 2;

    // Calculate effective health (Level 2 starts at 75, so it's more vulnerable)
    const myEffectiveHealth = isInLevel2 ? this.xp : this.xp + 75; // Potential health if knocked to L2
    const enemyEffectiveHealth = enemyInLevel2 ? enemyXp : enemyXp + 75;

    // Can we kill enemy this turn?
    const canKillEnemy =
      (enemyInLevel2 && power >= enemyXp) ||
      (!enemyInLevel2 && power >= enemyXp);

    // Are we in immediate danger of being killed?
    const inDanger = enemyXp >= 20; // Max enemy power is 25, so if they have 20+ they might kill us

    // Level 2 is critical - no second chances
    if (isInLevel2) {
      // If we can finish them, do it
      if (canKillEnemy) return "attack";

      // If we're low and they're threatening, try to survive
      if (this.xp <= 25 && enemyXp >= 15) {
        // Heal if it keeps us alive against their potential max hit
        return "revive";
      }

      // If we have good health and can pressure, attack
      if (this.xp >= 50 && enemyXp > power) {
        return "attack";
      }

      // Balanced approach when unsure
      if (this.xp < 50 && enemyXp < 50) {
        return "50";
      }

      // Default to aggression in level 2
      return enemyXp > this.xp ? "attack" : "revive";
    }

    // Level 1 strategy
    if (!isInLevel2) {
      // If we can knock them to level 2, strongly consider it
      if (!enemyInLevel2 && power >= enemyXp) {
        // Check if this puts us in a good position
        if (this.xp >= 50 || enemyXp <= 25) {
          return "attack";
        }
      }

      // If enemy is already in level 2 and we can kill them
      if (enemyInLevel2 && power >= enemyXp) {
        return "attack";
      }

      // If we're about to be knocked to level 2 and can't prevent it, prepare
      if (!enemyInLevel2 && enemyXp >= this.xp && this.xp <= 25) {
        // We're going to level 2 anyway, might as well deal damage or balance
        if (enemyXp <= power) return "attack"; // Take them with us
        return "50"; // Mitigate the fall
      }

      // Build advantage when safe
      if (this.xp >= 75 && enemyXp < 50) {
        return "revive"; // Max out while ahead
      }

      // Pressure when we have advantage
      if (this.xp > enemyXp + 20) {
        return "attack";
      }

      // Catch up when behind
      if (enemyXp > this.xp + 20) {
        if (this.xp + power <= 100) return "revive";
        return "50";
      }

      // Default balanced play
      return "50";
    }

    return "attack"; // Fallback
  }
}
