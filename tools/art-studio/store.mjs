import fs from 'node:fs/promises';
import path from 'node:path';

export async function readJson(file, fallback) {
  try { return JSON.parse(await fs.readFile(file, 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return structuredClone(fallback); throw error; }
}

export async function writeJsonAtomic(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const temp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(temp, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
  await fs.rename(temp, file);
}

export async function updateJson(file, fallback, fn) {
  const current = await readJson(file, fallback);
  const next = await fn(current);
  await writeJsonAtomic(file, next);
  return next;
}
