export class GLMDeepthink implements Player {
  level: Level = 1;
  xp: number = 100;

  makeChoice(input: { enemyLevel: Level; xp: number; power: number }): Move {
    const { enemyLevel, xp: enemyXp, power } = input;

    // 1. WIN CONDITION: If the enemy is in Level 2 and we have enough power to reduce their XP to 0, attack to win.
    if (enemyLevel === 2 && enemyXp <= power) {
      return "attack";
    }

    // 2. SURVIVAL CONDITION: If we are in Level 2 and our XP is critically low (<= 25), we are at risk of losing.
    // The maximum power is 25, so being at 25 or below means we can be killed in the next turn.
    // We prioritize healing over attacking to ensure survival.
    if (this.level === 2 && this.xp <= 25) {
      return "revive";
    }

    // 3. DEMOTION CONDITION: If the enemy is in Level 1, try to knock them down to Level 2.
    // Sending them to Level 2 (resetting them to 75 XP) is a strong strategic move.
    if (enemyLevel === 1 && enemyXp <= power) {
      return "attack";
    }

    // 4. DEFAULT STRATEGY: Aggression.
    // If we are safe (Level 1 or high XP in Level 2) and cannot finish the enemy immediately,
    // we attack to chip away at their health.
    // We avoid the "50" move because splitting power is generally less efficient than 
    // focusing on reducing the opponent's XP (which brings us closer to victory conditions).
    return "attack";
  }
}