// settings/ 와 manuscript/ 의 Markdown 파일 목록을 manifest.json 으로 만든다.
// 배포할 때 GitHub Actions가 자동으로 실행한다. 로컬 미리보기: node scripts/build-manifest.mjs
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';

const list = dir => {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .sort()
    .map(f => {
      const path = `${dir}/${f}`;
      const text = readFileSync(path, 'utf8');
      const heading = text.match(/^#\s+(.+)$/m);
      return {
        path,
        title: heading ? heading[1].trim() : f.replace(/\.md$/, ''),
        chars: text.replace(/^#.*$/m, '').replace(/\s/g, '').length,
      };
    });
};

const manifest = {
  generatedAt: new Date().toISOString(),
  settings: list('settings'),
  manuscript: list('manuscript'),
};

writeFileSync('manifest.json', JSON.stringify(manifest, null, 2) + '\n');
console.log(`manifest.json: 설정 ${manifest.settings.length}개, 원고 ${manifest.manuscript.length}화`);
