export class DeepseekDeepthink implements Player {
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
    // Helper: apply damage to a player, handling level transition and death
    const applyDamage = (
      level: Level,
      xp: number,
      dmg: number,
    ): { level: Level; xp: number } => {
      if (level === 1) {
        const total = xp + 75 - dmg; // total life remaining
        if (total > 75) {
          return { level: 1, xp: total - 75 };
        } else if (total > 0) {
          return { level: 2, xp: total };
        } else {
          return { level: 2, xp: 0 }; // dead
        }
      } else {
        const newXp = xp - dmg;
        if (newXp <= 0) return { level: 2, xp: 0 };
        return { level: 2, xp: newXp };
      }
    };

    // Helper: apply healing (cap at 100)
    const applyGain = (xp: number, gain: number): number =>
      Math.min(xp + gain, 100);

    // Helper: compute survival value
    const survival = (level: Level, xp: number): number =>
      level === 1 ? xp + 75 : xp;

    const moves: Move[] = ["attack", "revive", "50"];
    let bestMove: Move = "attack";
    let bestScore = -Infinity;
    let bestRatio = -Infinity;

    for (const move of moves) {
      let newMyXp = this.xp;
      const newMyLevel = this.level; // our level never decreases from our own move
      let newEnemy: { level: Level; xp: number };

      if (move === "attack") {
        newEnemy = applyDamage(enemyLevel, enemyXp, power);
        // our xp unchanged
      } else if (move === "revive") {
        newMyXp = applyGain(this.xp, power);
        newEnemy = { level: enemyLevel, xp: enemyXp };
      } else {
        // "50"
        const gain = Math.floor(power / 2);
        const loss = Math.ceil(power / 2);
        newMyXp = applyGain(this.xp, gain);
        newEnemy = applyDamage(enemyLevel, enemyXp, loss);
      }

      const mySurvival = survival(newMyLevel, newMyXp);
      const enemySurvival = survival(newEnemy.level, newEnemy.xp);

      // Instant win – return immediately
      if (enemySurvival <= 0) {
        return move;
      }

      const score = mySurvival - enemySurvival;
      const ratio = mySurvival / enemySurvival; // enemySurvival > 0 here

      if (score > bestScore || (score === bestScore && ratio > bestRatio)) {
        bestScore = score;
        bestRatio = ratio;
        bestMove = move;
      }
    }

    return bestMove;
  }
}
