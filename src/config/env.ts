
// Environment variables and configuration
// Note: In production, these should be set as actual environment variables

export const API_KEYS = {
  TOGETHER_API_KEY: "tgp_v1_qgxCBe0k1wqAVamtAz6jvWTjEb7OURkx4wSE79XGicM",
  HF_API_KEY: "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",
  OPENROUTER_API_KEY: "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",
  ASSEMBLY_AI_KEY: "cd04fa734f3c4d888093b1c54f1c46bf"
};

export const API_ENDPOINTS = {
  TOGETHER_API: "https://api.together.xyz/v1/chat/completions",
  HF_API: "https://api-inference.huggingface.co/models/meta-llama/Llama-3-8b-chat-hf",
  OPENROUTER_API: "https://openrouter.ai/api/v1/chat/completions"
};

export const DEFAULT_MODEL = "meta-llama/Llama-3-8b-chat-hf";
export const FALLBACK_MODEL = "meta-llama/Llama-3-8b-chat-hf";
