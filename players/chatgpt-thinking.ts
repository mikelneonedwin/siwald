export class ChatGPTThinking implements Player {
  level: Level = 1;
  xp: number = 100;

  // All algorithm is contained in this function (no extra methods).
  makeChoice(input: { enemyLevel: Level; xp: number; power: number }): Move {
    const enemyLevel = input.enemyLevel;
    const enemyXp = Math.max(0, Math.min(100, Math.floor(input.xp)));
    const power = Math.max(1, Math.min(25, Math.floor(input.power))); // sanitize input

    const selfLevel = this.level;
    const selfXp = Math.max(0, Math.min(100, Math.floor(this.xp)));

    // half-power used by the "50" move (round down to keep integers)
    const half = Math.floor(power / 2);

    // --- 1) Immediate kill if possible (only possible in level 2)
    // If opponent is in level 2 and this attack would reduce them to 0 or less, finish them.
    if (enemyLevel === 2 && power >= enemyXp) {
      return "attack";
    }

    // --- 2) If we can push a level-1 opponent to level-2 with this attack, that's strong.
    // Prefer attack unless we desperately need healing (very low xp).
    if (enemyLevel === 1 && power >= enemyXp) {
      const criticalForThisLevel = selfLevel === 1 ? 20 : 35;
      if (selfXp <= criticalForThisLevel) {
        // If we're critical and half-power gives meaningful heal, choose "50" to both heal and damage.
        if (half > 0 && selfXp + half <= 100) return "50";
        return "revive";
      }
      return "attack";
    }

    // --- 3) If we are critically low on xp, prioritize healing/survival.
    const criticalThreshold = selfLevel === 1 ? 20 : 35; // level 2 is more fragile
    if (selfXp <= criticalThreshold) {
      // If "50" offers a reasonable heal and also damages the opponent, prefer it.
      if (half > 0 && selfXp + half > selfXp) {
        // prefer "50" when it actually moves us out of critical or is at least a decent heal
        if (selfXp + half >= Math.min(100, criticalThreshold + 5)) return "50";
      }
      // If power alone can revive us above critical, do revive.
      if (power >= criticalThreshold - selfXp) return "revive";

      // If the power is very small and won't help much, try to attack to change board state.
      if (power <= 3) return "attack";

      // Otherwise heal to survive.
      return "revive";
    }

    // --- 4) If we're ahead, play aggressively
    // If our xp is comfortably greater than the opponent's, attack to press advantage.
    if (selfXp >= enemyXp + 10) {
      if (power >= 4) return "attack";
      return "50";
    }

    // --- 5) If opponent is low in level 1 (vulnerable), press the attack
    if (enemyLevel === 1 && enemyXp <= 30) {
      if (power >= 4) return "attack";
      return "50";
    }

    // --- 6) Small power -> prefer modest healing unless we are near full hp
    if (power <= 4) {
      if (selfXp <= 90) return "revive";
      return "50"; // small nibble damage if we don't need much heal
    }

    // --- 7) Medium power -> split if it meaningfully helps us, else attack
    if (power <= 12) {
      // If we can heal a lot (not near cap) choose "50" for balanced play
      if (selfXp <= 85) return "50";
      return "attack";
    }

    // --- 8) High power -> attack (big swing)
    return "attack";
  }
}
