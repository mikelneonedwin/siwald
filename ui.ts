import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

interface ScoreEntry {
  name: string;
  score: number;
}

interface TournamentStats {
  playersCount: number;
  totalPairs: number;
  gamesPerWar: number;
  confidenceZ: number;
  durationMs: number;
}

export const generateTournamentHTML = (
  scores: ScoreEntry[],
  stats: TournamentStats,
): void => {
  mkdirSync("dist", { recursive: true });

  const maxScore = Math.max(...scores.map((s) => s.score), 1);

  const rows = scores
    .map((s, index) => {
      const percent = ((s.score / maxScore) * 100).toFixed(2);

      return `
        <tr>
          <td class="rank">#${index + 1}</td>
          <td class="name">${s.name}</td>
          <td class="score">${s.score}</td>
          <td>
            <div class="bar-container">
              <div class="bar" style="width:${percent}%"></div>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Tournament Results</title>
<style>
  body {
    font-family: Inter, system-ui, -apple-system, sans-serif;
    background: #0f172a;
    color: #e2e8f0;
    margin: 0;
    padding: 40px;
  }

  h1 {
    margin-bottom: 10px;
  }

  .meta {
    color: #94a3b8;
    margin-bottom: 30px;
    line-height: 1.6;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background: #1e293b;
    border-radius: 12px;
    overflow: hidden;
  }

  th, td {
    padding: 14px 16px;
    text-align: left;
  }

  th {
    background: #0f172a;
    font-weight: 600;
    font-size: 14px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: #94a3b8;
  }

  tr:nth-child(even) {
    background: #1a2436;
  }

  .rank {
    font-weight: bold;
    color: #facc15;
  }

  .name {
    font-weight: 500;
  }

  .score {
    font-weight: 600;
  }

  .bar-container {
    background: #0f172a;
    border-radius: 999px;
    height: 10px;
    width: 100%;
  }

  .bar {
    background: linear-gradient(90deg, #22d3ee, #6366f1);
    height: 100%;
    border-radius: 999px;
  }

  .footer {
    margin-top: 40px;
    font-size: 14px;
    color: #64748b;
  }
</style>
</head>
<body>

<h1>🏆 Tournament Results</h1>

<div class="meta">
  <div><strong>Total Players:</strong> ${stats.playersCount}</div>
  <div><strong>Total Battles:</strong> ${stats.totalPairs}</div>
  <div><strong>Games Per War:</strong> ${stats.gamesPerWar}</div>
  <div><strong>Confidence Z:</strong> ${stats.confidenceZ}</div>
  <div><strong>Duration:</strong> ${(stats.durationMs / 1000).toFixed(2)}s</div>
</div>

<table>
  <thead>
    <tr>
      <th>Rank</th>
      <th>Player</th>
      <th>Points</th>
      <th>Relative Strength</th>
    </tr>
  </thead>
  <tbody>
    ${rows}
  </tbody>
</table>

<div class="footer">
  Generated automatically by tournament engine.
</div>

</body>
</html>`;

  writeFileSync(join("dist", "index.html"), html, "utf-8");
};
