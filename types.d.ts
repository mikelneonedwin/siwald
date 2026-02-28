type Move = "attack" | "revive" | "50";
type Level = 1 | 2;

interface Player {
  level: Level;
  // 0 - 100;
  xp: number;
  makeChoice: (input: { enemyLevel: Level; xp: number; power: number }) => Move;
}

/**
 * Consider a game where two players have an xp that goes from 1 to 100 and two levels of life.
 * In the game, a random power is given to each player everytime it is their turn to play and they
 * can use this power to make a move in the game after considering their own level and life, the power
 * given, and their opponent's level and life. The moves allowed are
 * - Attack: The `power` is subtracted from the opponent's xp
 * - Revive: The `power` increases their own xp
 * - 50: Half the `power` is used to increase their xp while the other half is subtracted from their opponent's
 * The `power` might be any number between 1 to 25, inclusive of both.
 * After the xp has been reduced to zero in the first level, the player is taken to the second level,
 * however their life starts from 75 instead of 100 this time. A user in the second level cannot be returned
 * to the first level. If in the second level, their xp is reduced to 0, then they have lost the game.
 * xp's can never exceed 100.
 * Given this info, make an algorithm in TS, that consider's all the variables and makes a move for
 * any player. Define it as a class that implements the `Player` interface.
 * Your entire algorithm should be in the `makeChoice` function. You are not to make any other methods
 * or properties in the class that do not exist in the `Player` interface.
 * You are not to modify the `Player`, `Level` or `Move` types. Write your code accordingly!
 */
