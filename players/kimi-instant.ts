export class KimiInstant implements Player {
  level: Level = 1;
  xp: number = 100;

  makeChoice(input: { enemyLevel: Level; xp: number; power: number }): Move {
    const { enemyLevel, xp: enemyXp, power } = input;
    const myLevel = this.level;
    const myXp = this.xp;

    // 1. FINISHING BLOW: If we can kill the enemy this turn, always do it.
    // Level 1 kill: Enemy XP <= Power
    // Level 2 kill: Enemy XP <= Power (since 0 means death)
    if (enemyXp <= power) {
      return "attack";
    }

    // 2. CRITICAL SURVIVAL: If we are in Level 2 and low on health, prioritize survival.
    // If enemy can kill us next turn (assuming they roll max power ~25), we need to heal.
    // However, if we are very low (e.g., <= 12) and power is high, pure revive is safer.
    if (myLevel === 2) {
      // If we are in danger zone where a decent hit could kill us, heal.
      // If enemy is also L2, they are dangerous.
      if (myXp < 30) {
        // If we are very low, pure revive is usually better to get out of danger zone
        return "revive";
      }
    }

    // 3. LEVEL 2 SNOWBALL: If we are L2 and enemy is L1, we are winning. Stay alive and finish.
    if (myLevel === 2 && enemyLevel === 1) {
      // If enemy is close to dying (XP <= power * 1.5), use "50" to secure kill while healing
      if (enemyXp <= power * 1.5) return "50";
      // Otherwise, keep pressure with attack or heal if needed. Default to pressure.
      if (myXp > 50) return "attack";
      return "revive";
    }

    // 4. LEVEL 1 STRATEGY: We are both in Level 1 or Enemy is L2 (we are behind).

    // If enemy is L2 and we are L1, we are losing. We need to survive to L2.
    // However, we can't heal past 100.
    // If we are healthy, try to get to L2 safely or damage enemy.

    // If we are low in L1 (< 30), we should heal to ensure we enter L2 with good health (75 is fixed, but we need to survive the hit).
    // Actually, entering L2 resets to 75. So in L1, we just need to survive until we hit 0.
    // So if we are low in L1, we should heal to prolong the time until we drop to L2.
    if (myLevel === 1 && myXp < 25) {
      return "revive";
    }

    // 5. EFFICIENCY & PRESSURE (Mid-game)
    // If we are relatively healthy (> 50), we can be aggressive.
    if (myXp > 50) {
      // If enemy is mid-health, "50" is efficient for trading.
      if (enemyXp > power && enemyXp <= power * 2) {
        return "50";
      }
      return "attack";
    }

    // 6. BALANCED STATE: Both are moderately healthy.
    // "50" is generally a good move if we are not too low and enemy is not too high.
    // It provides sustain while dealing damage.
    if (myXp >= 25 && myXp <= 50 && enemyXp > power) {
      // Don't use 50 if it puts us at risk (e.g., we are 25, enemy is 30, power is 10. 50 gives us 30, enemy 20. Good.)
      // But if enemy is L2 and strong, pure attack might be better to finish.
      if (enemyLevel === 2 && enemyXp < 40) return "attack";
      return "50";
    }

    // 7. DEFAULT FALLBACK
    // If none of the specific conditions met, default to Attack to maintain pressure.
    return "attack";
  }
}
