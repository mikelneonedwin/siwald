export class MetaThinking implements Player {
  level: Level = 1;
  xp: number = 100;

  makeChoice(input: { enemyLevel: Level; xp: number; power: number }): Move {
    const { enemyLevel, xp: enemyXp, power } = input;
    const myXp = this.xp;

    // Offensive Strategy: If the opponent is close to losing a level, attack.
    if (enemyXp <= power) {
      return "attack";
    }

    // Defensive Strategy: If my health is critically low, prioritize healing.
    // The threshold is lower if I'm on level 2, as it's the last stand.
    const criticalHealthThreshold = this.level === 1 ? 25 : 35;
    if (myXp < criticalHealthThreshold && myXp + power <= 100) {
      return "revive";
    }

    // Balanced Strategy: If my health is low but not critical, or the opponent has more health
    if (myXp < 50 || myXp < enemyXp) {
      // If reviving won't waste power by exceeding the 100xp cap, choose a balanced move.
      if (myXp + power / 2 <= 100) {
        return "50";
      }
    }

    // Default Strategy: If none of the above conditions are met, attack.
    // This is a good default when I have a health advantage and the opponent isn't in immediate danger.
    return "attack";
  }
}
