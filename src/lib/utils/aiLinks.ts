export type AIPlatform = "gemini" | "chatgpt" | "claude" | "perplexity";

interface AIPlatformConfig {
  name: string;
  baseUrl: string;
  queryParam: string;
  supportsDeepLink: boolean;
}

const platformConfigs: Record<AIPlatform, AIPlatformConfig> = {
  gemini: {
    name: "Gemini",
    baseUrl: "https://gemini.google.com/app",
    queryParam: "q",
    supportsDeepLink: true,
  },
  chatgpt: {
    name: "ChatGPT",
    baseUrl: "https://chat.openai.com/",
    queryParam: "", // ChatGPT doesn't support query params, opens fresh
    supportsDeepLink: false,
  },
  claude: {
    name: "Claude",
    baseUrl: "https://claude.ai/new",
    queryParam: "",
    supportsDeepLink: false,
  },
  perplexity: {
    name: "Perplexity",
    baseUrl: "https://www.perplexity.ai/",
    queryParam: "q",
    supportsDeepLink: true,
  },
};

/**
 * Generate a deep link to an AI platform with the prompt pre-filled
 * Note: Not all platforms support direct prompt injection
 */
export function generateAiLink(prompt: string, platform: AIPlatform): string {
  const config = platformConfigs[platform];

  if (!config.supportsDeepLink || !config.queryParam) {
    // For platforms that don't support deep links, just return the base URL
    // The user will need to paste the prompt manually
    return config.baseUrl;
  }

  const encodedPrompt = encodeURIComponent(prompt);
  return `${config.baseUrl}?${config.queryParam}=${encodedPrompt}`;
}

/**
 * Get platform display name
 */
export function getPlatformName(platform: AIPlatform): string {
  return platformConfigs[platform].name;
}

/**
 * Check if platform supports deep linking with prompt
 */
export function supportsDeepLink(platform: AIPlatform): boolean {
  return platformConfigs[platform].supportsDeepLink;
}

/**
 * Get all available platforms
 */
export function getAvailablePlatforms(): AIPlatform[] {
  return Object.keys(platformConfigs) as AIPlatform[];
}
