export class Claude implements Player {
  level: Level = 1;
  xp: number = 100;

  makeChoice(input: { enemyLevel: Level; xp: number; power: number }): Move {
    const { enemyLevel, xp: enemyXp, power } = input;

    const myXp = this.xp;
    const myLevel = this.level;

    const attackResult = enemyXp - power;
    const reviveResult = Math.min(100, myXp + power);
    const halfPower = power / 2;
    const fiftyAttackResult = enemyXp - halfPower;
    const fiftyReviveResult = Math.min(100, myXp + halfPower);

    // Can we finish the enemy off?
    const attackKillsEnemy = enemyLevel === 2 && attackResult <= 0;
    const fiftyKillsEnemy = enemyLevel === 2 && fiftyAttackResult <= 0;

    if (attackKillsEnemy) return "attack";
    if (fiftyKillsEnemy && fiftyReviveResult > myXp) return "50";

    // Are we in critical danger? (xp <= 20)
    const iCritical = myXp <= 20;
    // Is enemy in critical danger?
    const enemyCritical = enemyXp <= 20;

    // If I'm about to die (level 2, critical xp), prioritize reviving
    if (myLevel === 2 && iCritical) {
      if (reviveResult > fiftyReviveResult) return "revive";
      return "revive";
    }

    // If enemy is critical and we can push them to 0 on level 1 (drops to level 2),
    // or finish them on level 2, attack
    if (enemyCritical) {
      if (attackResult <= 0 && enemyLevel === 1) return "attack"; // drops them to level 2
      if (attackResult <= 0 && enemyLevel === 2) return "attack"; // kills them
      return "attack"; // keep pressure
    }

    // Evaluate a score for each move. Higher is better.
    // Score considers: damage dealt to enemy, xp gained, risk assessment

    const myDanger = myLevel === 2 ? 2 : 1; // dying in level 2 is game over
    const enemyDanger = enemyLevel === 2 ? 2 : 1;

    // Damage dealing weight increases when enemy is closer to death
    const aggressionWeight = (100 - enemyXp) / 100 + enemyDanger * 0.3;
    // Healing weight increases when I'm closer to death
    const defenseWeight = (100 - myXp) / 100 + myDanger * 0.3;

    const attackScore = power * aggressionWeight;
    const reviveScore = (reviveResult - myXp) * defenseWeight;
    const fiftyScore =
      halfPower * aggressionWeight + (fiftyReviveResult - myXp) * defenseWeight;

    if (attackScore >= reviveScore && attackScore >= fiftyScore)
      return "attack";
    if (reviveScore >= attackScore && reviveScore >= fiftyScore)
      return "revive";
    return "50";
  }
}
