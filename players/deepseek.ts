export class Deepseek implements Player {
  level: Level = 1;
  xp: number = 100;

  makeChoice(input: { enemyLevel: Level; xp: number; power: number }): Move {
    const { enemyLevel, xp: enemyXp, power } = input;

    // Calculate effective health thresholds
    const myMaxXp = 100;
    const myDangerZone = this.level === 1 ? 30 : 20; // More cautious in level 2
    const enemyDangerZone = enemyLevel === 1 ? 30 : 20;

    // Check if enemy is in level 2 and low on XP - prioritize killing them
    if (enemyLevel === 2 && enemyXp <= power) {
      return "attack"; // Can finish them off
    }

    // If I'm in level 2 and very low, prioritize survival
    if (this.level === 2 && this.xp <= myDangerZone) {
      if (this.xp + power <= myMaxXp) {
        return "revive"; // Heal to survive
      }
    }

    // If enemy is in level 2, be more aggressive
    if (enemyLevel === 2) {
      // If I can deal significant damage, attack
      if (enemyXp <= power * 1.5 || enemyXp < 50) {
        return "attack";
      }
    }

    // Strategic decision based on power size
    if (power >= 20) {
      // Large power - best used for attack or 50
      if (enemyXp <= power || (enemyLevel === 2 && enemyXp <= power + 10)) {
        return "attack"; // Can eliminate or severely damage
      }

      // If I'm low on XP, consider 50 for balanced approach
      if (this.xp < 40 && enemyXp > 30) {
        return "50"; // Balanced move helps both survival and aggression
      }

      return "attack"; // Default for large power - be aggressive
    }

    if (power <= 8) {
      // Small power - better for healing or 50
      if (this.xp < 60 && this.xp + power <= myMaxXp) {
        return "revive"; // Safe healing when not critical
      }

      // If enemy is low, even small attack might help
      if (enemyXp <= power) {
        return "attack";
      }

      // Default for small power - 50 gives balanced benefit
      return "50";
    }

    // Medium power (9-19) - more nuanced decisions
    const myHealthPercent = this.xp / myMaxXp;
    const enemyHealthPercent = enemyXp / 100;

    // If I'm much healthier than enemy, be aggressive
    if (myHealthPercent > enemyHealthPercent + 0.3) {
      return "attack";
    }

    // If enemy is much healthier, focus on survival
    if (enemyHealthPercent > myHealthPercent + 0.3) {
      if (this.xp + power <= myMaxXp) {
        return "revive";
      }
      return "50";
    }

    // If we're relatively even, use 50 for balanced approach
    if (Math.abs(myHealthPercent - enemyHealthPercent) < 0.2) {
      return "50";
    }

    // Consider level advantage
    if (this.level === 2 && enemyLevel === 1) {
      // I have advantage - be aggressive but not reckless
      if (this.xp > 50) {
        return "attack";
      }
    }

    if (this.level === 1 && enemyLevel === 2) {
      // I'm at disadvantage - play defensively
      if (this.xp < 40) {
        return "revive";
      }
      return "50";
    }

    // Default strategic move
    return "50";
  }
}
