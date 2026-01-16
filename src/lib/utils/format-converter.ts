export type AIFormat = 'claude' | 'antigravity' | 'unknown';

/**
 * Detects whether the content is in Claude (XML) or Antigravity (Markdown) format.
 */
export function detectFormat(content: string): AIFormat {
  if (/<objective>[\s\S]*<\/objective>/i.test(content) || /<process>[\s\S]*<\/process>/i.test(content)) {
    return 'claude';
  }
  if (/^##\s+Objective/m.test(content) && /^##\s+Process/m.test(content)) {
    return 'antigravity';
  }
  return 'unknown';
}

/**
 * Converts Claude XML format to Antigravity Markdown format.
 */
export function convertToAntigravity(content: string): string {
  let result = content;

  // 1. Specific Mappings (Priority)
  result = result.replace(/<objective>([\s\S]*?)<\/objective>/gi, (_, inner) => `## Objective\n\n${inner.trim()}\n`);
  result = result.replace(/<process>([\s\S]*?)<\/process>/gi, (_, inner) => `## Process\n\n${inner.trim()}\n`);
  result = result.replace(/<success_criteria>([\s\S]*?)<\/success_criteria>/gi, (_, inner) => `## Assessment\n\n${inner.trim()}\n`);
  result = result.replace(/<context>([\s\S]*?)<\/context>/gi, (_, inner) => `## Context\n\n${inner.trim()}\n`);
  
  // 2. Generic Fallback for other top-level tags
  // Matches <tag_name>...content...</tag_name>
  // Converts snake_case to Title Case (e.g., visual_analysis_protocol -> Visual Analysis Protocol)
  result = result.replace(/<([a-z0-9_]+)>([\s\S]*?)<\/\1>/gi, (_, tag, inner) => {
    const title = tag.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    console.log(title)
    return `## ${title}\n\n${inner.trim()}\n`;
  });

  // Terminology Updates
  result = result.replace(/\bClaude\b/g, 'Antigravity');
  result = result.replace(/XML tags/g, 'Markdown headers');
  result = result.replace(/Legacy Format/g, 'Antigravity Format');

  // Fix spacing (max 2 newlines)
  result = result.replace(/\n{3,}/g, '\n\n');

  return result.trim();
}

/**
 * Converts Antigravity Markdown format to Claude XML format.
 */
export function convertToClaude(content: string): string {
  let result = content;

  // 1. Specific Mappings
  result = result.replace(/^##\s+Objective\s*\n([\s\S]*?)(?=\n##\s+|$)/gm, (_, inner) => `<objective>\n${inner.trim()}\n</objective>\n\n`);
  result = result.replace(/^##\s+Process\s*\n([\s\S]*?)(?=\n##\s+|$)/gm, (_, inner) => `<process>\n${inner.trim()}\n</process>\n\n`);
  result = result.replace(/^##\s+Assessment\s*\n([\s\S]*?)(?=\n##\s+|$)/gm, (_, inner) => `<success_criteria>\n${inner.trim()}\n</success_criteria>\n\n`);
  result = result.replace(/^##\s+Context\s*\n([\s\S]*?)(?=\n##\s+|$)/gm, (_, inner) => `<context>\n${inner.trim()}\n</context>\n\n`);

  // 2. Generic Fallback for other headers
  // Matches ## Title Case -> <title_case>
  result = result.replace(/^##\s+(.+?)\s*\n([\s\S]*?)(?=\n##\s+|$)/gm, (_, title, inner) => {
    const tag = title.trim().toLowerCase().replace(/\s+/g, '_');
    return `<${tag}>\n${inner.trim()}\n</${tag}>\n\n`;
  });

  // Terminology Updates
  result = result.replace(/\bAntigravity\b/g, 'Claude');
  result = result.replace(/Markdown headers/g, 'XML tags');
  result = result.replace(/Antigravity Format/g, 'Legacy Format');

  // Fix spacing
  result = result.replace(/\n{3,}/g, '\n\n');

  return result.trim();
}
