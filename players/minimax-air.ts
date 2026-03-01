export class MinimaxAir implements Player {
    level: Level;
    xp: number;

    constructor() {
        this.level = 1;
        this.xp = 100;
    }

    makeChoice(input: { enemyLevel: Level; xp: number; power: number }): Move {
        const { enemyLevel, xp, power } = input;
        
        // Calculate effective power values
        const halfPower = Math.floor(power / 2);
        const fullPower = power;
        
        // If enemy is in level 2 and has very low XP, attack to win
        if (enemyLevel === 2 && xp <= 10) {
            return "attack";
        }
        
        // If own XP is critically low (below 15), prioritize survival
        if (this.xp < 15) {
            // If we can revive to a significant amount, do it
            if (this.xp + fullPower <= 100) {
                return "revive";
            }
            // Otherwise use 50 to get some XP while also attacking
            return "50";
        }
        
        // If own XP is low (below 30) and enemy is also low, use 50 for balance
        if (this.xp < 30 && xp < 30) {
            return "50";
        }
        
        // If enemy has low XP (below 20), attack to finish them
        if (xp < 20) {
            return "attack";
        }
        
        // If enemy is in level 2 and we have decent XP, be aggressive
        if (enemyLevel === 2 && this.xp > 50) {
            return "attack";
        }
        
        // If own XP is moderate (30-50), use 50 for balanced approach
        if (this.xp >= 30 && this.xp <= 50) {
            return "50";
        }
        
        // If we have high XP, attack to reduce enemy
        if (this.xp > 50) {
            // If enemy is in level 1 and has moderate XP, attack
            if (enemyLevel === 1 && xp < 40) {
                return "attack";
            }
            // Otherwise use 50 to maintain advantage
            return "50";
        }
        
        // Default fallback
        return "attack";
    }
}