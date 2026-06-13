// packages/governance-firewall/hooks/index.ts
// System Hooks - Git hooks, file system hooks, process hooks

import { execSync } from 'child_process';
import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface HookConfig {
  preCommit: boolean;
  prePush: boolean;
  fileWatch: boolean;
  processWatch: boolean;
}

export class HookManager {
  private config: HookConfig = {
    preCommit: true,
    prePush: true,
    fileWatch: false,
    processWatch: false,
  };

  installGitHooks(): void {
    const huskyDir = join(process.cwd(), '.husky');
    
    if (!existsSync(huskyDir)) {
      console.error('Husky not installed. Run: npm install husky --save-dev');
      return;
    }

    // Update pre-commit hook
    const preCommitPath = join(huskyDir, 'pre-commit');
    const preCommitContent = `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
npm run governance:preflight
`;
    writeFileSync(preCommitPath, preCommitContent, 'utf-8');

    // Update pre-push hook
    const prePushPath = join(huskyDir, 'pre-push');
    const prePushContent = `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run validate:governance:comprehensive
npm run ssot:doctor
npm run detect:drift
npm run governance:preflight
`;
    writeFileSync(prePushPath, prePushContent, 'utf-8');

    console.log('✅ Git hooks installed with firewall enforcement');
  }

  installFileWatcher(): void {
    // This would set up a file system watcher daemon
    // Implementation depends on the watcher library used
    console.log('📝 File watcher installation - requires chokidar or similar');
  }

  installProcessWatcher(): void {
    // This would set up process monitoring
    // Implementation depends on the monitoring approach
    console.log('📝 Process watcher installation - requires process monitoring library');
  }

  getConfig(): HookConfig {
    return { ...this.config };
  }

  setConfig(config: Partial<HookConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

export const hookManager = new HookManager();
