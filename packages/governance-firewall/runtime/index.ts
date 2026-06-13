// packages/governance-firewall/runtime/index.ts
// Runtime Guard - Wraps Node.js, Next.js, build, test execution

import { spawn, ChildProcess } from 'child_process';
import { getFirewall, FirewallResult } from '../engine';

export interface RuntimeGuardConfig {
  wrapNode: boolean;
  wrapNext: boolean;
  wrapBuild: boolean;
  wrapTest: boolean;
  interceptStdio: boolean;
}

export class RuntimeGuard {
  private config: RuntimeGuardConfig = {
    wrapNode: true,
    wrapNext: true,
    wrapBuild: true,
    wrapTest: true,
    interceptStdio: true,
  };
  private firewall = getFirewall();

  async wrapCommand(command: string, args: string[], options?: any): Promise<number> {
    const operation = this.classifyCommand(command);
    
    const result = await this.firewall.preflight(operation, {
      command,
      args,
    });

    if (!result.allowed) {
      console.error('🚫 RUNTIME GUARD BLOCKED EXECUTION');
      if (result.violation) {
        console.error(`   ${result.violation.message}`);
      }
      return 1;
    }

    return this.executeCommand(command, args, options);
  }

  private executeCommand(command: string, args: string[], options?: any): Promise<number> {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        stdio: this.config.interceptStdio ? 'inherit' : 'pipe',
        ...options,
      });

      child.on('close', (code) => {
        resolve(code ?? 0);
      });

      child.on('error', (err) => {
        reject(err);
      });
    });
  }

  private classifyCommand(command: string): string {
    if (command === 'node') return 'node-execution';
    if (command === 'next') return 'nextjs-execution';
    if (command === 'npm' || command === 'yarn' || command === 'pnpm') return 'package-manager';
    if (command.includes('test') || command.includes('vitest') || command.includes('jest')) return 'test-execution';
    if (command.includes('build') || command.includes('webpack') || command.includes('tsc')) return 'build-execution';
    return 'unknown-execution';
  }

  wrapNodeScript(scriptPath: string, args: string[] = []): Promise<number> {
    return this.wrapCommand('node', [scriptPath, ...args]);
  }

  wrapNextDev(): Promise<number> {
    return this.wrapCommand('next', ['dev']);
  }

  wrapNextBuild(): Promise<number> {
    return this.wrapCommand('next', ['build']);
  }

  wrapTest(): Promise<number> {
    return this.wrapCommand('npm', ['run', 'test']);
  }

  getConfig(): RuntimeGuardConfig {
    return { ...this.config };
  }

  setConfig(config: Partial<RuntimeGuardConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

export const runtimeGuard = new RuntimeGuard();
