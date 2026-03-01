export class MinimaxMax implements Player {
    level: Level;
    xp: number;

    constructor(level: Level = 1, xp: number = 100) {
        this.level = level;
        this.xp = xp;
    }

    makeChoice = (input: { enemyLevel: Level; xp: number; power: number }): Move => {
        const { enemyLevel, xp: enemyXp, power } = input;
        const myLevel = this.level;
        const myXp = this.xp;

        // Calculate move values
        const attackDamage = power;
        const reviveHeal = power;
        const splitHeal = Math.floor(power / 2);
        const splitDamage = Math.floor(power / 2);

        // ============================================
        // TIER 1: IMMEDIATE WIN/LOSS CONDITIONS
        // ============================================

        // Check if we can win immediately (enemy in level 2 and we can reduce their XP to 0)
        if (enemyLevel === 2 && enemyXp <= attackDamage) {
            return "attack";
        }

        // Check if split move can win (enemy in level 2 and half power kills them)
        if (enemyLevel === 2 && enemyXp <= splitDamage) {
            return "50";
        }

        // ============================================
        // TIER 2: SURVIVAL PRIORITY (Level 2)
        // ============================================

        // In Level 2, survival is paramount - we're one mistake away from losing
        if (myLevel === 2) {
            // Critical: One-shot danger zone (max enemy attack is 25)
            if (myXp <= 25) {
                // If we can survive with revive, do it
                if (myXp + reviveHeal > 25) {
                    return "revive";
                }
                // If revive won't save us, try to take them with us
                if (enemyXp <= attackDamage) {
                    return "attack";
                }
                // Last resort: try split to get some heal while damaging
                if (myXp + splitHeal > 25 && enemyXp > splitDamage) {
                    return "50";
                }
                // Desperation: attack anyway
                return "attack";
            }

            // Moderate danger in Level 2 - prioritize healing if behind
            if (myXp < enemyXp || myLevel < enemyLevel) {
                // Don't overheal - if at high XP, attack instead
                if (myXp >= 70) {
                    return "attack";
                }
                // Use split if it gives meaningful heal
                if (myXp + splitHeal > 30) {
                    return "50";
                }
                return "revive";
            }
        }

        // ============================================
        // TIER 3: LEVEL 1 STRATEGY
        // ============================================

        // In Level 1, we have a "second life" - transitioning to Level 2 with 75 XP
        if (myLevel === 1) {
            // If XP is critically low, don't waste a turn reviving
            // Better to die and respawn at Level 2 with 75 XP
            if (myXp < 15) {
                // If we can win while dying, do it
                if (enemyXp <= attackDamage) {
                    return "attack";
                }
                // Use split to deal damage while possibly getting some XP
                return enemyXp <= splitDamage ? "50" : "attack";
            }

            // If enemy is in Level 2 and we're in Level 1, they have advantage
            // We need to be aggressive to force transition or win
            if (enemyLevel === 2) {
                // If we can kill them, do it
                if (enemyXp <= attackDamage) {
                    return "attack";
                }
                // If split can kill them AND give us heal, do it
                if (enemyXp <= splitDamage) {
                    return "50";
                }
                // Otherwise attack to pressure
                return "attack";
            }
        }

        // ============================================
        // TIER 4: EFFICIENCY OPTIMIZATION
        // ============================================

        // Prevent overhealing - if XP is near max, attack instead of revive
        if (myXp >= 90) {
            return "attack";
        }

        // Prevent overkill - if enemy is very low, don't waste high power
        if (enemyXp < 10 && power > 20) {
            // Split gives us heal while still killing
            return enemyXp <= splitDamage ? "50" : "attack";
        }

        // ============================================
        // TIER 5: POWER-BASED GENERAL HEURISTICS
        // ============================================

        // High power: maximize damage output
        if (power >= 18) {
            // If we're winning, press the advantage
            if (myXp > enemyXp || myLevel > enemyLevel) {
                return "attack";
            }
            // If we're losing, still attack to try to catch up
            return "attack";
        }

        // Low power: use split to get value from both sides
        if (power < 10) {
            // Split is most efficient - gives power amount total stat change
            // vs single-sided attack or revive
            return "50";
        }

        // Mid power: make decision based on relative position
        if (myXp > enemyXp) {
            // We're ahead - be aggressive
            return "attack";
        } else if (myXp < enemyXp) {
            // We're behind - be defensive
            return "revive";
        } else {
            // Even - use split for balanced approach
            return "50";
        }
    };
}