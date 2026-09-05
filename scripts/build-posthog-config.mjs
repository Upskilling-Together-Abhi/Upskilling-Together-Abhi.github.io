import { readFile, writeFile } from 'node:fs/promises';

const envPath = new URL('../.env', import.meta.url);
const outputPath = new URL('../posthog-config.js', import.meta.url);

function parseEnv(source) {
  return Object.fromEntries(
    source
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => {
        const separator = line.indexOf('=');
        if (separator === -1) return [line, ''];

        const key = line.slice(0, separator).trim();
        const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '');
        return [key, value];
      }),
  );
}

let fileEnv = {};

try {
  fileEnv = parseEnv(await readFile(envPath, 'utf8'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY || fileEnv.NEXT_PUBLIC_POSTHOG_KEY;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || fileEnv.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

if (!key) {
  throw new Error('NEXT_PUBLIC_POSTHOG_KEY is missing from .env.');
}

await writeFile(
  outputPath,
  `window.ABC_POSTHOG_CONFIG = ${JSON.stringify({ key, host })};\n`,
  'utf8',
);

console.log('Generated PostHog browser configuration.');
