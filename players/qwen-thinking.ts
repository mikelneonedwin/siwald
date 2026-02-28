export class QwenThinking implements Player {
  level: Level = 1;
  xp: number = 100;

  makeChoice = (input: {
    enemyLevel: Level;
    xp: number;
    power: number;
  }): Move => {
    const { enemyLevel, xp: enemyXp, power } = input;
    const myLevel = this.level;
    const myXp = this.xp;

    // Priority 1: Finish off opponent if possible
    if (enemyXp <= power) {
      return "attack";
    }

    // Priority 2: Critical survival mode (very low XP)
    if (myXp <= 25) {
      // If we can survive and potentially finish opponent, attack
      if (enemyXp <= power * 2 && myLevel === 2) {
        return "attack";
      }
      // Otherwise, prioritize survival
      return "revive";
    }

    // Priority 3: Opponent is vulnerable (low XP)
    if (enemyXp <= 50) {
      // Aggressive mode - try to finish them
      if (power >= 15) {
        return "attack";
      }
      // Use 50 move to damage while healing slightly
      return "50";
    }

    // Priority 4: Level advantage considerations
    if (myLevel === 2 && enemyLevel === 1) {
      // We have advantage, be aggressive but careful
      if (myXp >= 50) {
        return "attack";
      }
      return "50";
    }

    if (myLevel === 1 && enemyLevel === 2) {
      // We're at disadvantage, play defensively
      if (myXp <= 40) {
        return "revive";
      }
      return "50";
    }

    // Priority 5: Balanced gameplay (both level 2 or both level 1)
    if (myXp >= 75 && enemyXp >= 75) {
      // Both healthy - aggressive stance
      return "attack";
    }

    if (myXp >= 50 && enemyXp < 50) {
      // We're healthier - press advantage
      return "attack";
    }

    if (myXp < 50 && enemyXp >= 50) {
      // Opponent healthier - play safe
      return "revive";
    }

    // Priority 6: Power-based decisions
    if (power >= 20) {
      // High power - maximize damage
      return "attack";
    }

    if (power <= 5) {
      // Low power - not worth attacking, heal instead
      return "revive";
    }

    // Default: Balanced approach
    return "50";
  };
}
