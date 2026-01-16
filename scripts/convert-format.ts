import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, isAbsolute, resolve } from 'path';
import { detectFormat, convertToAntigravity, convertToClaude } from '../src/lib/utils/format-converter';

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: npx tsx scripts/convert-format.ts <file_path> [to-antigravity|to-claude]');
  process.exit(1);
}

const filePath = args[0];
const targetFormat = args[1]; // optional

const absolutePath = isAbsolute(filePath) ? filePath : resolve(process.cwd(), filePath);

if (!existsSync(absolutePath)) {
  console.error(`Error: File not found at ${absolutePath}`);
  process.exit(1);
}

const content = readFileSync(absolutePath, 'utf-8');
const currentFormat = detectFormat(content);

console.log(`Detected format: ${currentFormat}`);

let newContent = content;
let actionTaken = false;

if (targetFormat === 'to-antigravity' || (currentFormat === 'claude' && !targetFormat)) {
  console.log('Converting to Antigravity (Markdown)...');
  newContent = convertToAntigravity(content);
  actionTaken = true;
} else if (targetFormat === 'to-claude' || (currentFormat === 'antigravity' && !targetFormat)) {
  console.log('Converting to Claude (XML)...');
  newContent = convertToClaude(content);
  actionTaken = true;
} else {
  console.log('No conversion needed or format unknown.');
}

if (actionTaken) {
  writeFileSync(absolutePath, newContent, 'utf-8');
  console.log(`✅ File updated: ${absolutePath}`);
}
