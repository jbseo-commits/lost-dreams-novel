const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'manuscript');
const files = fs.readdirSync(dir)
  .filter(f => f.startsWith('ep') && f.endsWith('.md'))
  .sort((a, b) => {
    const numA = parseFloat(a.replace('ep', '').replace('.md', '').replace('-', '.'));
    const numB = parseFloat(b.replace('ep', '').replace('.md', '').replace('-', '.'));
    return numA - numB;
  });

console.log(`Total manuscript files: ${files.length}`);

const report = {
  totalFiles: files.length,
  lengthStats: [],
  under3500: [],
  tabooViolations: {
    doyunHyung: [],
    messageWriteDelete: [],
    signatureHesitate: [],
    refrigeratorMotor: [],
    couldNotKnowEnding: [],
    seoinFemale: []
  },
  titleFormatIssues: [],
  settingsTimelineIssues: []
};

files.forEach(f => {
  const filePath = path.join(dir, f);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const totalChars = content.length;
  const nonWsChars = content.replace(/\s/g, '').length;

  report.lengthStats.push({ file: f, total: totalChars, nonWs: nonWsChars });

  if (nonWsChars < 3500) {
    report.under3500.push({ file: f, nonWs: nonWsChars });
  }

  // 1. Title format check
  const firstLine = lines[0] ? lines[0].trim() : '';
  if (!firstLine.startsWith('# 제') && !firstLine.startsWith('# [범퍼') && !firstLine.startsWith('# ')) {
    report.titleFormatIssues.push({ file: f, title: firstLine });
  }

  // 2. Taboo 1: 도윤에게 "형" 호칭
  // '도윤 형', '도윤이 형', '도윤형' 등 또는 도윤과의 대화에서 호칭 '형'
  const doyunHyungRegex = /(?:도윤\s*(?:이\s*)?형|“[^”]*\b형\b[^”]*”)/g;
  let match;
  while ((match = doyunHyungRegex.exec(content)) !== null) {
    // 도윤에게 직접 형이라 부른 건지 문맥 확인
    const snippet = content.substring(Math.max(0, match.index - 30), Math.min(content.length, match.index + 50));
    // 형제, 인형, 형태, 모형, 혁명 등 제외
    if (!/인형|모형|유형|전형|조형|대형|소형|성형|원형|형태|형식|형편|형사|사형|형벌|형안|형형/.test(match[0])) {
      report.tabooViolations.doyunHyung.push({ file: f, snippet: snippet.replace(/\n/g, ' ') });
    }
  }

  // 3. Taboo 2: 메시지 작성/삭제
  const msgRegex = /(?:메시지|문자)[^.\n]*(?:작성|썼다|보내려|입력)[^.\n]*(?:지웠|삭제|지우고)/g;
  while ((match = msgRegex.exec(content)) !== null) {
    const snippet = content.substring(Math.max(0, match.index - 30), Math.min(content.length, match.index + 50));
    report.tabooViolations.messageWriteDelete.push({ file: f, snippet: snippet.replace(/\n/g, ' ') });
  }

  // 4. Taboo 3: 서명란 앞 망설임
  const signRegex = /(?:서명란|사인란|계약서|동의서)[^.\n]*(?:망설|주저|머뭇)/g;
  while ((match = signRegex.exec(content)) !== null) {
    const snippet = content.substring(Math.max(0, match.index - 30), Math.min(content.length, match.index + 50));
    report.tabooViolations.signatureHesitate.push({ file: f, snippet: snippet.replace(/\n/g, ' ') });
  }

  // 5. Taboo 4: 냉장고 모터 회전
  const fridgeRegex = /(?:냉장고)[^.\n]*(?:모터|컴프레서|회전|진동|소음)/g;
  while ((match = fridgeRegex.exec(content)) !== null) {
    const snippet = content.substring(Math.max(0, match.index - 30), Math.min(content.length, match.index + 50));
    report.tabooViolations.refrigeratorMotor.push({ file: f, snippet: snippet.replace(/\n/g, ' ') });
  }

  // 6. Taboo 5: ...알 수 없었다 결말
  const lastLines = lines.filter(l => l.trim().length > 0).slice(-3).join(' ');
  if (/알\s*수\s*없었다[.]?$/.test(lastLines.trim())) {
    report.tabooViolations.couldNotKnowEnding.push({ file: f, lastLine: lastLines.trim() });
  }

  // 7. Taboo 6: 서인 여성 지칭 (그녀, 언니, 따님, 아가씨)
  // 서인을 직접 '그녀'라고 칭한 경우 찾기
  const femaleRegex = /서인[^.\n]*(?:그녀|언니|따님|아가씨)|(?:그녀는|그녀의|그녀를)[^.\n]*서인/g;
  while ((match = femaleRegex.exec(content)) !== null) {
    const snippet = content.substring(Math.max(0, match.index - 30), Math.min(content.length, match.index + 50));
    report.tabooViolations.seoinFemale.push({ file: f, snippet: snippet.replace(/\n/g, ' ') });
  }
});

console.log('=== 검사 결과 요약 ===');
console.log(`전체 파일 수: ${report.totalFiles}`);
console.log(`3,500자 미만 파일 수: ${report.under3500.length}`);
if (report.under3500.length > 0) {
  console.log('3,500자 미만 파일 목록:');
  report.under3500.forEach(u => console.log(`  - ${u.file}: ${u.nonWs}자`));
}

console.log('\n=== 금기 위반 점검 ===');
console.log(`도윤 형 호칭: ${report.tabooViolations.doyunHyung.length}건`);
report.tabooViolations.doyunHyung.forEach(e => console.log(`  [${e.file}] ${e.snippet}`));

console.log(`메시지 작성/삭제: ${report.tabooViolations.messageWriteDelete.length}건`);
report.tabooViolations.messageWriteDelete.forEach(e => console.log(`  [${e.file}] ${e.snippet}`));

console.log(`서명란 망설임: ${report.tabooViolations.signatureHesitate.length}건`);
report.tabooViolations.signatureHesitate.forEach(e => console.log(`  [${e.file}] ${e.snippet}`));

console.log(`냉장고 모터: ${report.tabooViolations.refrigeratorMotor.length}건`);
report.tabooViolations.refrigeratorMotor.forEach(e => console.log(`  [${e.file}] ${e.snippet}`));

console.log(`알 수 없었다 결말: ${report.tabooViolations.couldNotKnowEnding.length}건`);
report.tabooViolations.couldNotKnowEnding.forEach(e => console.log(`  [${e.file}] ${e.lastLine}`));

console.log(`서인 여성 지칭: ${report.tabooViolations.seoinFemale.length}건`);
report.tabooViolations.seoinFemale.forEach(e => console.log(`  [${e.file}] ${e.snippet}`));

fs.writeFileSync('scripts/audit-result.json', JSON.stringify(report, null, 2), 'utf8');
console.log('\n결과가 scripts/audit-result.json에 저장되었습니다.');
