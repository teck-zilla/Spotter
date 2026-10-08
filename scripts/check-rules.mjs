import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const privateModels = [
  'Member',
  'CheckIn',
  'LedgerEntry',
  'Payment',
  'PaymentAttempt',
  'MembershipChange',
  'MemberSession',
  'ActivationCode',
  'QuestionLog',
  'PrivateAccessLog'
];

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (file === 'node_modules' || file === '.next' || file === '.git' || file === 'public') {
      continue;
    }
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  }

  return arrayOfFiles;
}

let violations = 0;

console.log('Running Spotter PRD 8.3 CI Rules Verification...\n');

// Check 1: No route handler touches Prisma directly
// Grep app/api/** for 'prisma.' and fail on a match.
console.log('Check 1: Grepping app/api/** for direct prisma. access...');
const apiFiles = getAllFiles(path.join(rootDir, 'app', 'api')).filter(f => !f.endsWith('.gitkeep'));
for (const file of apiFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (line.includes('prisma.')) {
      console.error(`  [VIOLATION Check 1] ${path.relative(rootDir, file)}:${index + 1}: direct prisma call detected`);
      violations++;
    }
  });
}
console.log(`  Passed api route handlers checked: ${apiFiles.length}`);

// Check 2: No CardChunk write through the Prisma client
// Grep for 'cardChunk.create' and 'cardChunk.update' and fail on a match.
console.log('\nCheck 2: Grepping codebase for cardChunk.create and cardChunk.update...');
const allSrcFiles = getAllFiles(rootDir).filter(f => 
  (f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js') || f.endsWith('.mjs')) &&
  !f.includes(path.join('scripts', 'check-rules.mjs'))
);

for (const file of allSrcFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (line.includes('cardChunk.create') || line.includes('cardChunk.update')) {
      console.error(`  [VIOLATION Check 2] ${path.relative(rootDir, file)}:${index + 1}: cardChunk write through Prisma client detected`);
      violations++;
    }
  });
}
console.log(`  Passed files checked: ${allSrcFiles.length}`);

// Check 3: No private model reachable from retrieval
// Grep src/server/retrieval/** for every private model name and fail on a match.
console.log('\nCheck 3: Grepping src/server/retrieval/** for private model names...');
const retrievalFiles = getAllFiles(path.join(rootDir, 'src', 'server', 'retrieval')).filter(f => !f.endsWith('.gitkeep'));
for (const file of retrievalFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    for (const model of privateModels) {
      const regex = new RegExp(`\\b${model}\\b`);
      if (regex.test(line)) {
        console.error(`  [VIOLATION Check 3] ${path.relative(rootDir, file)}:${index + 1}: private model '${model}' referenced in retrieval`);
        violations++;
      }
    }
  });
}
console.log(`  Passed retrieval files checked: ${retrievalFiles.length}`);

console.log('\n----------------------------------------');
if (violations > 0) {
  console.error(`Verification FAILED: ${violations} rule violation(s) found.`);
  process.exit(1);
} else {
  console.log('Verification PASSED: All 3 PRD 8.3 CI rules passed with 0 violations.');
  process.exit(0);
}
