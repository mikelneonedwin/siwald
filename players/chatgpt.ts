export class ChatGPT implements Player {
  level: Level = 1;
  xp: number = 100;

  makeChoice(input: { enemyLevel: Level; xp: number; power: number }): Move {
    const { enemyLevel, xp: enemyXp, power } = input;
    const selfXp = this.xp;
    const selfLevel = this.level;

    const half = Math.floor(power / 2);

    const maxPower = 25;
    const lethalThreshold = maxPower; // worst case opponent roll

    // ---------- 1. CHECK IF WE CAN FINISH THE ENEMY ----------
    if (enemyLevel === 2 && power >= enemyXp) {
      return "attack";
    }

    if (enemyLevel === 1 && power >= enemyXp) {
      return "attack";
    }

    // ---------- 2. IF WE ARE IN LEVEL 2 (NO SECOND CHANCE) ----------
    if (selfLevel === 2) {
      // If we might die next turn, prioritize survival
      if (selfXp <= lethalThreshold) {
        if (selfXp + power <= 100) return "revive";
        return "50";
      }

      // If enemy is also level 2, prioritize aggression
      if (enemyLevel === 2) {
        if (enemyXp <= power + half) return "attack";
        return "attack";
      }

      // Enemy still in level 1 → pressure them
      return "attack";
    }

    // ---------- 3. IF WE ARE LOW HP IN LEVEL 1 ----------
    if (selfXp <= lethalThreshold) {
      if (selfXp + power <= 100) return "revive";
      return "50";
    }

    // ---------- 4. IF ENEMY IS LOW ----------
    if (enemyXp <= power + half) {
      return "attack";
    }

    // ---------- 5. BALANCED MID-GAME STRATEGY ----------
    // If we're healthier than opponent → pressure
    if (selfXp > enemyXp) {
      return "attack";
    }

    // If enemy is much stronger → recover safely
    if (enemyXp - selfXp > 20) {
      if (selfXp + power <= 100) return "revive";
      return "50";
    }

    // Default balanced play
    if (selfXp + half <= 100) {
      return "50";
    }

    return "attack";
  }
}
