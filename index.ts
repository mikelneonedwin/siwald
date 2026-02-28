import { ChatGPT } from "./players/chatgpt";
import { ChatGPTThinking } from "./players/chatgpt-thinking";
import { Claude } from "./players/claude";
import { ClaudeExtended } from "./players/claude-extended";
import { Deepseek } from "./players/deepseek";
import { DeepseekDeepthink } from "./players/deepseek-deepthink";
import { GeminiFast } from "./players/gemini-fast";
import { GeminiPro } from "./players/gemini-pro";
import { GLM } from "./players/glm";
import { GLMDeepthink } from "./players/glm-deepthink";
import { GrokExpert } from "./players/grok-expert";
import { GrokFast } from "./players/grok-fast";
import { KimiInstant } from "./players/kimi-instant";
import { KimiThinking } from "./players/kimi-thinking";
import { MetaFast } from "./players/meta-fast";
import { MetaThinking } from "./players/meta-thinking";
import { Mistral } from "./players/mistral";
import { MistralThink } from "./players/mistral-think";
import { NovaHigh } from "./players/nova-high";
import { NovaLow } from "./players/nova-low";
import { QwenFast } from "./players/qwen-fast";
import { QwenThinking } from "./players/qwen-thinking";

const PLAYERS: Array<new () => Player> = [
  ChatGPT,
  ChatGPTThinking,
  Claude,
  ClaudeExtended,
  Deepseek,
  DeepseekDeepthink,
  GeminiFast,
  GeminiPro,
  GLM,
  GLMDeepthink,
  GrokFast,
  GrokExpert,
  KimiInstant,
  KimiThinking,
  MetaFast,
  MetaThinking,
  Mistral,
  MistralThink,
  NovaHigh,
  NovaLow,
  QwenFast,
  QwenThinking,
];

const GAMES_PER_WAR = 1500;
const CONFIDENCE_Z = 1.96;
const MAX_TURNS_PER_GAME = Infinity; // 40 * 100;
const MAX_WAR_ROUNDS = Infinity; //30;

type MatchResult = "A" | "B";

interface FighterState {
  level: Level;
  xp: number;
}

const getDisplayNames = (constructors: Array<new () => Player>): string[] => {
  const counts = new Map<string, number>();

  return constructors.map((Ctor) => {
    const base = Ctor.name;
    const next = (counts.get(base) ?? 0) + 1;
    counts.set(base, next);
    return next === 1 ? base : `${base}#${next}`;
  });
};

const applyDamage = (state: FighterState, damage: number): FighterState => {
  if (state.level === 1) {
    if (state.xp - damage > 0) {
      return { level: 1, xp: state.xp - damage };
    }

    return { level: 2, xp: 75 };
  }

  return {
    level: 2,
    xp: Math.max(0, state.xp - damage),
  };
};

const applyHeal = (state: FighterState, heal: number): FighterState => ({
  level: state.level,
  xp: Math.min(100, state.xp + heal),
});

const applyMove = (
  attacker: FighterState,
  defender: FighterState,
  move: Move,
  power: number,
): { nextAttacker: FighterState; nextDefender: FighterState } => {
  if (move === "attack") {
    return {
      nextAttacker: attacker,
      nextDefender: applyDamage(defender, power),
    };
  }

  if (move === "revive") {
    return {
      nextAttacker: applyHeal(attacker, power),
      nextDefender: defender,
    };
  }

  const heal = Math.floor(power / 2);
  const damage = Math.ceil(power / 2);

  return {
    nextAttacker: applyHeal(attacker, heal),
    nextDefender: applyDamage(defender, damage),
  };
};

const validateMove = (move: Move): Move => {
  if (move === "attack" || move === "revive" || move === "50") {
    return move;
  }

  return "attack";
};

const effectiveLife = (state: FighterState): number =>
  state.level === 1 ? state.xp + 75 : state.xp;

const runSingleGame = (
  A: new () => Player,
  B: new () => Player,
): MatchResult => {
  const playerA = new A();
  const playerB = new B();

  let stateA: FighterState = { level: 1, xp: 100 };
  let stateB: FighterState = { level: 1, xp: 100 };

  playerA.level = stateA.level;
  playerA.xp = stateA.xp;
  playerB.level = stateB.level;
  playerB.xp = stateB.xp;

  let turnIsA = Math.random() < 0.5;

  for (let turn = 0; turn < MAX_TURNS_PER_GAME; turn += 1) {
    const power = Math.floor(Math.random() * 25) + 1;

    if (turnIsA) {
      const move = validateMove(
        playerA.makeChoice({
          enemyLevel: stateB.level,
          xp: stateB.xp,
          power,
        }),
      );

      const { nextAttacker, nextDefender } = applyMove(
        stateA,
        stateB,
        move,
        power,
      );
      stateA = nextAttacker;
      stateB = nextDefender;
      playerA.level = stateA.level;
      playerA.xp = stateA.xp;
      playerB.level = stateB.level;
      playerB.xp = stateB.xp;

      if (stateB.level === 2 && stateB.xp === 0) {
        return "A";
      }
    } else {
      const move = validateMove(
        playerB.makeChoice({
          enemyLevel: stateA.level,
          xp: stateA.xp,
          power,
        }),
      );

      const { nextAttacker, nextDefender } = applyMove(
        stateB,
        stateA,
        move,
        power,
      );
      stateB = nextAttacker;
      stateA = nextDefender;
      playerB.level = stateB.level;
      playerB.xp = stateB.xp;
      playerA.level = stateA.level;
      playerA.xp = stateA.xp;

      if (stateA.level === 2 && stateA.xp === 0) {
        return "B";
      }
    }

    turnIsA = !turnIsA;
  }

  const lifeA = effectiveLife(stateA);
  const lifeB = effectiveLife(stateB);

  if (lifeA === lifeB) {
    return Math.random() < 0.5 ? "A" : "B";
  }

  return lifeA > lifeB ? "A" : "B";
};

const waldCI = (
  wins: number,
  total: number,
): { p: number; low: number; high: number } => {
  const p = wins / total;
  const error = CONFIDENCE_Z * Math.sqrt((p * (1 - p)) / total);
  return {
    p,
    low: Math.max(0, p - error),
    high: Math.min(1, p + error),
  };
};

const runWarUntilDecisive = (
  A: new () => Player,
  B: new () => Player,
  nameA: string,
  nameB: string,
): MatchResult => {
  let winsA = 0;
  let winsB = 0;
  let warRound = 0;

  while (warRound < MAX_WAR_ROUNDS) {
    warRound += 1;

    for (let game = 0; game < GAMES_PER_WAR; game += 1) {
      const result = runSingleGame(A, B);
      if (result === "A") {
        winsA += 1;
      } else {
        winsB += 1;
      }
    }

    const total = winsA + winsB;
    const leader = winsA >= winsB ? "A" : "B";
    const leaderWins = leader === "A" ? winsA : winsB;
    const { p, low, high } = waldCI(leaderWins, total);

    const shouldLog = warRound <= 3 || warRound % 5 === 0 || low > 0.5;
    if (shouldLog) {
      console.log(
        `[war ${warRound}] ${nameA} vs ${nameB} -> wins ${winsA}:${winsB}, leader ${leader} p=${(
          p * 100
        ).toFixed(
          2,
        )}% CI=[${(low * 100).toFixed(2)}%, ${(high * 100).toFixed(2)}%]`,
      );
    }

    if (low > 0.5) {
      return leader;
    }
  }

  if (winsA === winsB) {
    const tiebreak = Math.random() < 0.5 ? "A" : "B";
    console.log(
      `[war cap] ${nameA} vs ${nameB} stayed inconclusive after ${MAX_WAR_ROUNDS} wars. Tiebreak winner: ${tiebreak}`,
    );
    return tiebreak;
  }

  const majorityWinner = winsA > winsB ? "A" : "B";
  console.log(
    `[war cap] ${nameA} vs ${nameB} stayed inconclusive after ${MAX_WAR_ROUNDS} wars. Majority winner: ${majorityWinner}`,
  );
  return majorityWinner;
};

const runTournament = () => {
  const names = getDisplayNames(PLAYERS);
  const points = new Map<string, number>();

  for (const name of names) {
    points.set(name, 0);
  }

  const totalPairs = (PLAYERS.length * (PLAYERS.length - 1)) / 2;
  console.log(
    `Starting tournament with ${PLAYERS.length} players and ${totalPairs} head-to-head battles.`,
  );

  let pairNumber = 0;

  for (let i = 0; i < PLAYERS.length; i += 1) {
    for (let j = i + 1; j < PLAYERS.length; j += 1) {
      pairNumber += 1;

      const playerA = PLAYERS[i]!;
      const playerB = PLAYERS[j]!;
      const nameA = names[i]!;
      const nameB = names[j]!;

      console.log(
        `\n[battle ${pairNumber}/${totalPairs}] ${nameA} vs ${nameB}`,
      );

      const winner = runWarUntilDecisive(playerA, playerB, nameA, nameB);
      const winnerName = winner === "A" ? nameA : nameB;
      points.set(winnerName, (points.get(winnerName) ?? 0) + 1);

      console.log(`[battle done] Winner: ${winnerName} (+1 point)`);
    }
  }

  const sorted = [...points.entries()].sort((a, b) => b[1] - a[1]);

  console.log("\n=== FINAL SCOREBOARD ===");
  for (const [name, score] of sorted) {
    console.log(`${name}: ${score}`);
  }
};

console.time("Game");
runTournament();
console.timeEnd("Game");
