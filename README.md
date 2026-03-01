# Siwald: LLM Strategy Battle Tournament

Siwald is a competition platform for LLM-generated strategies in a simple turn-based game. Each "player" is a strategy implemented in TypeScript that decides the best move based on current game states and random power.

The project runs a tournament between multiple player implementations (named after LLMs like ChatGPT, Claude, Deepseek, etc.) to see which strategy performs best over thousands of games.

## The Game Rules

Two players battle in a turn-based system. Each turn, a random **power** (1-25) is assigned to the active player.

### Life & Levels
- **Level 1**: Players start at 100 XP.
- **Level 2**: If XP reaches 0 at Level 1, the player "levels up" to Level 2 with 75 XP.
- **Losing**: If XP reaches 0 at Level 2, the player loses.
- **Max XP**: XP can never exceed 100.
- **Irreversibility**: A player in Level 2 cannot return to Level 1.

### Moves
A player can choose one of three moves:
- **`attack`**: Subtract the full power from the opponent's XP.
- **`revive`**: Increase their own XP by the full power.
- **`50`**: Split the power: half heals themselves, half damages the opponent.

## Tournament Structure

The tournament is a round-robin head-to-head battle between all registered players.
- For each pair of players, a series of "wars" are fought.
- Each war consists of 1,500 games.
- The tournament uses a confidence interval (Wald CI) to determine a decisive winner for each battle.
- If a winner is not determined after a maximum number of rounds, a tie-break or majority winner is chosen.

## Getting Started

### Prerequisites
- [Bun](https://bun.com) runtime (v1.x)

### Installation
```bash
bun install
```

### Running the Tournament
```bash
bun run index.ts
```
This will run the tournament in the terminal and generate a `dist/index.html` file with the final scoreboard.

## Project Structure

- `index.ts`: The tournament runner and game engine.
- `ui.ts`: Handles HTML report generation.
- `players/`: Directory containing player (strategy) implementations.
- `types.d.ts`: Type definitions for the game and players.

## License
MIT
