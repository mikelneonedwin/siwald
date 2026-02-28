export class Mistral implements Player {
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
    // If the player is in level 2 and their XP is critically low, prioritize revival
    if (this.level === 2 && this.xp <= 30) {
      return "revive";
    }

    // If the opponent is in level 2 and their XP is low, attack to finish them off
    if (enemyLevel === 2 && enemyXp <= power) {
      return "attack";
    }

    // If the player's XP is high and the opponent's XP is low, attack
    if (this.xp >= 80 && enemyXp <= 50) {
      return "attack";
    }

    // If the player's XP is low and the opponent's XP is high, revive
    if (this.xp <= 40 && enemyXp >= 70) {
      return "revive";
    }

    // If the player's XP is moderately low and the opponent's XP is moderately high, use "50"
    if (this.xp <= 60 && enemyXp >= 60) {
      return "50";
    }

    // If the player's XP is high and the opponent's XP is high, use "50" to balance
    if (this.xp >= 70 && enemyXp >= 70) {
      return "50";
    }

    // Default to attacking if none of the above conditions are met
    return "attack";
  }
}
