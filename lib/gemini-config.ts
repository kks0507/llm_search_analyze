/**
 * Gemini API Configuration and utilities
 * Handles API key validation and model configuration
 */

export interface GeminiConfig {
  apiKey: string
  model: string
  temperature: number
  maxRetries: number
  timeoutMs: number
}

export const DEFAULT_GEMINI_CONFIG: GeminiConfig = {
  apiKey: process.env.GEMINI_API_KEY || "",
  model: "gemini-2.0-flash",
  temperature: 0.7,
  maxRetries: 3,
  timeoutMs: 30000,
}

export function validateGeminiConfig(config: Partial<GeminiConfig> = {}): GeminiConfig {
  const finalConfig = { ...DEFAULT_GEMINI_CONFIG, ...config }

  if (!finalConfig.apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set")
  }

  if (finalConfig.temperature < 0 || finalConfig.temperature > 2) {
    throw new Error("Temperature must be between 0 and 2")
  }

  return finalConfig
}

export function getModelInfo(model: string): { name: string; description: string } {
  const models: Record<string, { name: string; description: string }> = {
    "gemini-2.0-flash": {
      name: "Gemini 2.0 Flash",
      description: "Fastest model, optimized for speed with good quality",
    },
    "gemini-2.0-pro": {
      name: "Gemini 2.0 Pro",
      description: "Most capable model for complex tasks",
    },
  }

  return models[model] || { name: model, description: "Unknown model" }
}
