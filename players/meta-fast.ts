export class MetaFast implements Player {
  level: Level = 1;
  xp: number = 100;

  makeChoice(input: { enemyLevel: Level; xp: number; power: number }): Move {
    const { enemyLevel, xp: playerXp, power } = input;

    // Prioritize survival if player XP is low, especially if enemy is Level 2
    if (playerXp <= 25 && this.level === 1) {
      // Player is in danger, needs to revive
      return "revive";
    }

    if (playerXp <= 35 && this.level === 2) {
      // Player in Level 2 is in critical danger
      return "revive";
    }

    // If enemy is low XP and we have a strong attack, go for the kill
    // Consider enemy level: Level 2 enemy at 0 XP means game over for them.
    if (enemyLevel === 1 && playerXp > 50 && power >= 20 && input.xp <= 25) {
      return "attack";
    }
    if (enemyLevel === 2 && playerXp > 50 && power >= 20 && input.xp <= 35) {
      return "attack";
    }

    // If player XP is high, focus on attacking or balancing (50/50)
    if (playerXp > 70) {
      // If enemy XP is relatively high, try to chip away with 50/50 or attack
      if (input.xp > 50) {
        // If power is high, 50/50 is efficient for damage and self-heal
        if (power >= 15) {
          return "50";
        } else {
          // Small power, just attack to reduce their XP
          return "attack";
        }
      } else {
        // Enemy XP is low, go for attack
        return "attack";
      }
    }

    // If player XP is moderate (between 25/35 and 70), balance strategies
    // Use 50/50 to gain XP and deal damage
    if (power > 10 && playerXp < 90) {
      // If player isn't near max XP, 50/50 is good
      return "50";
    }

    // If enemy XP is very low, and player XP is not critically low, attack
    if (input.xp < 30 && playerXp > 40) {
      return "attack";
    }

    // Default strategy: If none of the above conditions met, 50/50 is a good balanced move
    // It heals and damages, which is generally safer.
    return "50";
  }
}
