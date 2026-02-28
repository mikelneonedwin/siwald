export class GeminiFast implements Player {
  level: Level = 1;
  xp: number = 100;

  makeChoice({
    enemyLevel,
    xp: enemyXp,
    power,
  }: {
    enemyLevel: Level;
    xp: number;
    power: number;
  }): Move {
    const MY_CRITICAL_XP = 30;
    const ENEMY_KILLABLE_THRESHOLD = power;
    const HALF_POWER = power / 2;

    // 1. FINISHING BLOW: If attacking or using '50' can eliminate the enemy's current level
    if (enemyXp <= power) {
      // If '50' is enough to kill, it's strictly better because we also heal
      if (enemyXp <= HALF_POWER) {
        return "50";
      }
      return "attack";
    }

    // 2. SURVIVAL: If our XP is low, we need to recover.
    // We prioritize 'revive' over '50' if we are in a dangerous spot (Level 2 or very low XP).
    if (this.xp <= MY_CRITICAL_XP) {
      // If we are Level 1, we have a safety net, so we can be slightly braver with '50'
      // If we are Level 2, we are on our last life; stick to 'revive'
      if (this.level === 2 || this.xp <= 15) {
        return "revive";
      }
      return "50";
    }

    // 3. MOMENTUM: If we have high health, push the advantage.
    // If the enemy is Level 2 (closer to losing), keep the pressure on.
    if (this.xp > 80) {
      return "attack";
    }

    // 4. BALANCED: Default to '50' for most mid-game turns.
    // It provides a net "value" of power (half heal, half damage) while
    // mitigating the randomness of the next turn's power.
    return "50";
  }
}
