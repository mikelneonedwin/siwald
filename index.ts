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

const PLAYERS = [
  ChatGPT,
  ChatGPTThinking,
  QwenFast,
  QwenThinking,
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
