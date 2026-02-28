export class GeminiPro implements Player {
  level: Level = 1;
  xp: number = 100;

  makeChoice(input: { enemyLevel: Level; xp: number; power: number }): Move {
    const { enemyLevel, xp: enemyXp, power } = input;

    // 1. LETHAL/PROGRESSION CHECK
    // If the enemy is on Level 2 and we have enough power to finish them off, win the game.
    if (enemyLevel === 2 && enemyXp <= power) {
      return "attack";
    }

    // If the enemy is on Level 1 and we can force them down to Level 2 right now.
    if (enemyLevel === 1 && enemyXp <= power) {
      return "attack";
    }

    // 2. SURVIVAL CHECK
    // The maximum possible enemy power next turn is 25. If we are at 25 xp or below,
    // we are in critical danger of losing the game or dropping to Level 2.
    if (this.xp <= 25) {
      return "revive";
    }

    // 3. VALUE OPTIMIZATION (Prevent Overhealing)
    const missingXp = 100 - this.xp;

    // If we are at full health, or if healing using "50" would waste power, focus entirely on attacking.
    if (missingXp === 0 || missingXp < power / 2) {
      return "attack";
    }

    // If a full "revive" would waste power by overflowing past 100, but a "50" wouldn't, choose "50".
    if (missingXp < power) {
      return "50";
    }

    // 4. GENERAL STRATEGY
    // If we are relatively healthy, maintain pressure.
    if (this.xp >= 70) {
      return "attack";
    }

    // If we've taken some damage but aren't in lethal range, take a balanced approach.
    return "50";
  }
}
