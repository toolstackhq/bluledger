#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const currentProcess = globalThis.process;
const envPath = path.resolve(currentProcess.cwd(), '.env');

if (fs.existsSync(envPath)) {
  currentProcess.exit(0);
}

const envContents = [
  'TEST_ENV=dev',
  'TEST_RUN_ID=local',
  'DEV_UI_BASE_URL=http://127.0.0.1:5173',
  'DEV_APP_USERNAME=92718463',
  'DEV_APP_PASSWORD=Harbour!92'
].join('\n');

fs.writeFileSync(envPath, `${envContents}\n`, 'utf8');
currentProcess.stdout.write('Generated local .env for BluLedger local login\n');
