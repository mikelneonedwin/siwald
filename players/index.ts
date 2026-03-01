import { ChatGPT } from "./chatgpt";
import { ChatGPTThinking } from "./chatgpt-thinking";
import { Claude } from "./claude";
import { ClaudeExtended } from "./claude-extended";
import { Deepseek } from "./deepseek";
import { DeepseekDeepthink } from "./deepseek-deepthink";
import { GeminiFast } from "./gemini-fast";
import { GeminiPro } from "./gemini-pro";
import { GLM } from "./glm";
import { GLMDeepthink } from "./glm-deepthink";
import { GrokExpert } from "./grok-expert";
import { GrokFast } from "./grok-fast";
import { KimiInstant } from "./kimi-instant";
import { KimiThinking } from "./kimi-thinking";
import { MetaFast } from "./meta-fast";
import { MetaThinking } from "./meta-thinking";
import { MinimaxAir } from "./minimax-air";
import { MinimaxMax } from "./minimax-max";
import { Mistral } from "./mistral";
import { MistralThink } from "./mistral-think";
import { NovaHigh } from "./nova-high";
import { NovaLow } from "./nova-low";
import { QwenFast } from "./qwen-fast";
import { QwenThinking } from "./qwen-thinking";

export const PLAYERS: Array<new () => Player> = [
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
  MinimaxAir,
  MinimaxMax,
  Mistral,
  MistralThink,
  NovaHigh,
  NovaLow,
  QwenFast,
  QwenThinking,
];
