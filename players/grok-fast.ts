export class GrokFast implements Player {
  level: Level = 1;
  xp: number = 100;

  makeChoice(input: { enemyLevel: Level; xp: number; power: number }): Move {
    const { enemyLevel, xp: enemyXp, power } = input;

    // Current effective health values (clamped)
    const myEffectiveHp = this.xp;
    const enemyEffectiveHp = enemyXp;

    // Special case: very low power → better to save it or revive
    if (power <= 3) {
      if (myEffectiveHp <= 35 && this.level === 1) {
        return "revive";
      }
      if (enemyEffectiveHp <= power * 1.5) {
        return "attack";
      }
      return "50"; // small balanced move
    }

    // Critical situations - we're about to die
    if (this.level === 1 && myEffectiveHp <= power + 8) {
      return "revive"; // desperate self-heal in level 1
    }
    if (this.level === 2 && myEffectiveHp <= power + 5) {
      return "revive"; // even more desperate in level 2
    }

    // Enemy is about to die → finish them
    if (enemyEffectiveHp <= power) {
      return "attack";
    }

    // We're in level 2, enemy in level 1 → they are very dangerous
    if (this.level === 2 && enemyLevel === 1) {
      // Enemy can still one-shot us if they have high power
      if (enemyEffectiveHp > 45 && myEffectiveHp < 60) {
        return "revive"; // stay alive
      }
      if (enemyEffectiveHp <= 30) {
        return "attack"; // finish quickly
      }
      return "50"; // chip + heal
    }

    // Both in same level
    if (this.level === enemyLevel) {
      // We're significantly ahead → finish them
      if (myEffectiveHp > enemyEffectiveHp + 28 && power >= 10) {
        return "attack";
      }

      // We're clearly behind → try to survive / recover
      if (myEffectiveHp < enemyEffectiveHp - 25) {
        if (this.level === 1 && myEffectiveHp < 45) {
          return "revive";
        }
        return "50";
      }

      // Close fight → usually prefer balanced damage
      if (power >= 14) {
        return "attack"; // good power → push damage
      }
      if (power >= 8) {
        return "50"; // medium → balanced
      }
      return "revive"; // low power → better to heal
    }

    // Default / fallback behavior
    // Level 1 → more aggressive
    // Level 2 → more careful
    if (this.level === 1) {
      if (power >= 12) return "attack";
      if (power >= 7) return "50";
      return "revive";
    } else {
      // Level 2: more conservative
      if (power >= 16) return "attack";
      if (power >= 10) return "50";
      return "revive";
    }
  }
}
