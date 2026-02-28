export class GrokExpert implements Player {
  level: Level = 1;
  xp: number = 100;

  makeChoice(input: { enemyLevel: Level; xp: number; power: number }): Move {
    const myLevel = this.level;
    const myXP = this.xp;
    const enemyLevel = input.enemyLevel;
    const enemyXP = input.xp;
    const power = input.power;

    // Highest priority: finish the enemy (kill in level 2 or push to level 2) if a full attack can reduce their XP to <= 0
    if (enemyXP <= power) {
      return "attack";
    }

    // Critical self-defense: in level 2 with XP so low that the opponent could potentially end the game next turn (max power = 25)
    if (myLevel === 2 && myXP <= 25) {
      return "revive";
    }

    // Strong pressure on enemy: they are in level 2 and vulnerable (we want to keep attacking to finish them before they recover)
    if (enemyLevel === 2 && enemyXP <= 50) {
      return "attack";
    }

    // We need healing: low XP but not critical
    // In level 2 we fully revive (safer), otherwise use balanced "50" move
    if (myXP < 50 && myXP < 100) {
      return myLevel === 2 ? "revive" : "50";
    }

    // At full health: no point healing, aggressively attack
    if (myXP >= 100) {
      return "attack";
    }

    // Default balanced strategy: split power between self and opponent
    return "50";
  }
}
