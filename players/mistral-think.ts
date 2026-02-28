export class MistralThink implements Player {
  level: Level = 1;
  xp: number = 100;

  makeChoice(input: { enemyLevel: Level; xp: number; power: number }): Move {
    const { enemyLevel, xp: enemyXp, power } = input;

    // If enemy is in level 2 and their xp is <= power, attack to win
    if (enemyLevel === 2 && enemyXp <= power) {
      return "attack";
    }

    // If I'm in level 2 and my xp is <= power, revive to avoid losing
    if (this.level === 2 && this.xp <= power) {
      return "revive";
    }

    // If enemy is in level 2 and their xp > power, attack to reduce their xp
    if (enemyLevel === 2 && enemyXp > power) {
      return "attack";
    }

    // If enemy is in level 1 and their xp > power, attack (won't reset them)
    if (enemyLevel === 1 && enemyXp > power) {
      return "attack";
    }

    // If my xp is low (less than 30), revive to increase it
    if (this.xp < 30) {
      return "revive";
    }

    // If 50 would reset the enemy (enemyXp <= power / 2), revive instead
    if (enemyXp <= power / 2) {
      return "revive";
    }

    // Otherwise, use the 50 move
    return "50";
  }
}
