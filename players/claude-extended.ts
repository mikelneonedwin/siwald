export class ClaudeExtended implements Player {
  level: Level = 1;
  xp: number = 100;

  makeChoice(input: { enemyLevel: Level; xp: number; power: number }): Move {
    const { enemyLevel, xp: enemyXp, power } = input;

    const myXp = this.xp;
    const myLevel = this.level;

    const attackResult = enemyXp - power;
    const reviveResult = Math.min(100, myXp + power);
    const halfPower = power / 2;

    // Enemy is close to dying (level 2 and low xp) — finish them off
    if (enemyLevel === 2 && enemyXp <= power) {
      return "attack";
    }

    // I'm in critical condition — prioritize survival
    if (myXp <= 15) {
      // If I'm level 2 and critically low, revive is top priority
      if (myLevel === 2) {
        return "revive";
      }
      // Level 1 and critically low: revive unless attack would finish enemy
      if (enemyLevel === 2 && attackResult <= 0) {
        return "attack";
      }
      return "revive";
    }

    // I'm in level 2 and moderately low — lean toward revive or 50
    if (myLevel === 2 && myXp <= 40) {
      if (enemyLevel === 2 && attackResult <= 0) return "attack";
      if (myXp < enemyXp) return "revive";
      return "50";
    }

    // Enemy is level 1 and low xp — push them to level 2 (weakened state)
    if (enemyLevel === 1 && enemyXp <= power) {
      return "attack";
    }

    // I'm doing well (high xp), press the advantage
    if (myXp >= 60) {
      // If enemy is weak, attack
      if (enemyXp <= 40) return "attack";
      // If I'm much healthier, attack
      if (myXp - enemyXp >= 20) return "attack";
      // Otherwise balanced approach
      return "50";
    }

    // Mid-range xp — balanced decision
    if (myXp >= 30) {
      // Enemy is weaker, attack
      if (enemyXp < myXp - 10) return "attack";
      // I'm weaker and enemy is strong
      if (myXp < enemyXp - 10) {
        // If attack would finish the enemy, do it
        if (enemyLevel === 2 && attackResult <= 0) return "attack";
        return "50"; // chip away while recovering
      }
      // Roughly equal — balanced is good
      return "50";
    }

    // Fallback: low xp, not critical — use 50 to recover while dealing damage
    return "50";
  }
}
