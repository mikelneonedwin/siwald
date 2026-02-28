export class QwenFast implements Player {
  level: Level = 1;
  xp: number = 100;

  makeChoice(input: { enemyLevel: Level; xp: number; power: number }): Move {
    const { enemyLevel, xp: enemyXp, power } = input;

    // Clamp power just in case, though problem says 1-25
    const p = Math.max(1, Math.min(25, power));

    // Calculate potential outcomes
    const attackDamage = p;
    const reviveGain = p;
    const halfDamage = Math.floor(p / 2);
    const halfGain = p - halfDamage; // Ensure total equals p if odd

    // 1. Check for Immediate Win (Reduce enemy to <= 0)
    // If we can kill the enemy now, we should almost always do it.
    if (enemyXp - attackDamage <= 0) {
      return "attack";
    }

    // 2. Check for Critical Survival (Player is in Level 2 and near death)
    // If enemy can kill us next turn, we need to heal aggressively or kill them now.
    // We already checked if we can kill them now. If not, we must heal if we are very low.
    if (this.level === 2 && this.xp <= attackDamage) {
      // If we can't kill them, we must revive to survive the next hit
      return "revive";
    }

    // 3. Strategic Level Drop
    // If enemy is Level 2 and a full attack drops them to Level 1 (xp <= 0 relative to L2, but > 0 relative to L1 logic?
    // Actually, rules say: "After xp reduced to zero in first level... taken to second".
    // Wait, rules say: "After the xp has been reduced to zero in the first level, the player is taken to the second level".
    // This implies: L1 -> 0 -> L2 (starts at 75).
    // L2 -> 0 -> Game Over.
    // So if Enemy is L2, any attack that reduces them to <= 0 is a WIN. We handled this in step 1.

    // However, if Enemy is L1, and we attack them to <= 0, they reset to L2 with 75 XP.
    // Is it better to chip them or burst them? Usually bursting is better to force the reset,
    // but if they reset to 75, that's a high HP pool.
    // But since we can't modify types or add helpers, we stick to heuristic evaluation.

    // 4. Heuristic Scoring based on current state

    // Scenario A: We are low on health (relative to max possible for our level)
    // L1 max is 100, L2 max is 75.
    const myMaxHp = this.level === 1 ? 100 : 75;
    const myHealthPct = this.xp / myMaxHp;

    // Scenario B: Enemy is low on health
    const enemyMaxHp = enemyLevel === 1 ? 100 : 75;
    const enemyHealthPct = enemyXp / enemyMaxHp;

    // Decision Tree

    // If we are critically low (< 30% hp), prioritize healing unless we can win immediately (checked above)
    if (myHealthPct < 0.3) {
      return "revive";
    }

    // If enemy is vulnerable (< 30% hp), prioritize attack to finish them off or force level drop soon
    if (enemyHealthPct < 0.3) {
      return "attack";
    }

    // If both are healthy, "50" is the most efficient move because it simultaneously improves our state
    // and worsens the opponent's state, creating a double swing in momentum.
    // It is safer than pure attack (if we get low) and more aggressive than pure revive.
    return "50";
  }
}
