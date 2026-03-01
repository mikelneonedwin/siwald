type Move = "attack" | "revive" | "50";
type Level = 1 | 2;

interface Player {
  level: Level;
  // 0 - 100;
  xp: number;
  makeChoice: (input: { enemyLevel: Level; xp: number; power: number }) => Move;
}
