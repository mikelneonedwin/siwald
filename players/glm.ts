export class GLM implements Player {
  level: Level = 1;
  xp: number = 1000;

  makeChoice(input: { enemyLevel: Level; xp: number; power: number }): Move {
    const { enemyLevel, xp: enemyXp, power } = input;

    const myXp = this.xp;
    const myLevel = this.level;

    // Calculate XP limits based on level
    const myMaxXp = myLevel === 1 ? 100 : 75;
    const enemyEffectiveMaxXp = enemyLevel === 1 ? 100 : 75;

    // 1. Winning Move: Can we defeat the opponent immediately?
    // If opponent drops to 0 XP in Level 2, they lose.
    // If opponent drops to 0 XP in Level 1, they drop to Level 2 (we survive/advance).
    if (enemyXp - power <= 0) {
      return "attack";
    }

    // 2. Survival Move: Are we in immediate danger?
    // If we are at very low HP, we risk losing (if L2) or losing our L1 status.
    // Prioritize healing if we are critically low.
    if (myXp <= 15) {
      return "revive";
    }

    // 3. Efficiency Calculations
    const healNeeded = myMaxXp - myXp;
    const potentialHeal = power;
    const potentialSplitHeal = Math.floor(power / 2);

    // Calculate value of Attack
    // Attacking an L1 opponent pushes them to L2 (starts at 75).
    // Effectively removing 100 + 75 = 175 total HP pool capacity? Or just strategizing the phase change.
    // Pushing them to L2 is a massive tactical advantage (they are closer to death, lower max HP).
    const attackValue = enemyXp - power; // Lower is better (closer to 0)

    // Calculate value of Revive
    // Healing is wasted if it exceeds max HP.
    const reviveGain = Math.min(potentialHeal, healNeeded);

    // Calculate value of "50"
    // Half damage to enemy, half heal to self.
    const splitDamage = Math.floor(power / 2);
    const splitHeal = Math.min(potentialSplitHeal, healNeeded);
    // We already checked if "attack" kills. "50" deals less damage, so it won't kill if "attack" didn't.
    // But it applies pressure and heals.

    // Strategy: Aggression vs Efficiency
    // If we are significantly ahead in HP, play aggressive to push L1 enemies to L2 or finish L2.
    // If we are even or behind, prioritize efficiency (Split or Heal).

    // Define an 'aggression threshold'.
    const hpAdvantage = myXp - enemyXp;

    if (hpAdvantage > 20) {
      // We are winning comfortably. Maintain pressure.
      // Compare Attack vs 50.
      // "attack" deals full damage.
      // "50" deals half damage + heal.
      // If we don't need much healing, Attack is better to close the game.
      if (healNeeded < 10) {
        return "attack";
      }
      // If we can use some healing, "50" is great.
      if (splitHeal > 0) {
        return "50";
      }
      return "attack";
    }

    if (hpAdvantage < -20) {
      // We are losing. Survival is key.
      // If "revive" gives full value (or close to it), take it.
      if (reviveGain >= power * 0.8) {
        return "revive";
      }
      // Otherwise "50" allows us to deal damage while healing.
      if (splitHeal > 0) {
        return "50";
      }
      return "revive";
    }

    // Neutral State (Close game)
    // Default to "50" (Split) as it provides dual value: small heal + small damage.
    // It is the most mathematically efficient move per turn when neither defense nor full offense is strictly forced.
    // However, check if "revive" is significantly better (e.g., we are hurt, enemy is full).
    if (myXp < 50 && enemyXp > 50) {
      // We are hurt, they are healthy. Heal up.
      return "revive";
    }

    // If enemy is L1 and low, we want to hit them hard to force L2.
    if (enemyLevel === 1 && enemyXp <= power + 20) {
      // Check if "50" also forces L2?
      // No, "50" deals half damage.
      // Force the issue with Attack.
      return "attack";
    }

    // Default to "50" for balanced gameplay.
    if (healNeeded > 0) {
      return "50";
    }

    // If we are full HP, attack.
    return "attack";
  }
}
