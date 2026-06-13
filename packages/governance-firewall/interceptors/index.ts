// packages/governance-firewall/interceptors/index.ts
// Execution Interceptors - Wrap and intercept all operations

import { getFirewall, FirewallResult } from '../engine';

export interface InterceptorContext {
  operation: string;
  args: any[];
  cwd?: string;
  env?: Record<string, string>;
}

export class ExecutionInterceptor {
  private firewall = getFirewall();

  async intercept(command: string, args: string[] = [], context?: Partial<InterceptorContext>): Promise<FirewallResult> {
    const operation = this.classifyOperation(command, args);
    
    const result = await this.firewall.preflight(operation, {
      command,
      args,
      ...context,
    });

    if (!result.allowed) {
      console.error('🚫 FIREWALL BLOCKED OPERATION');
      if (result.violation) {
        console.error(`   ${result.violation.message}`);
      }
      process.exit(1);
    }

    return result;
  }

  async interceptFileWrite(filePath: string, content: string): Promise<FirewallResult> {
    const result = await this.firewall.preflight('file-write', {
      path: filePath,
      size: content.length,
    });

    if (!result.allowed) {
      console.error('🚫 FIREWALL BLOCKED FILE WRITE');
      if (result.violation) {
        console.error(`   ${result.violation.message}`);
      }
      if (result.rollbackPerformed) {
        console.error('   Auto-rollback performed');
      }
      process.exit(1);
    }

    return result;
  }

  async interceptNpmScript(scriptName: string): Promise<FirewallResult> {
    const result = await this.firewall.preflight('npm-script', {
      script: scriptName,
    });

    if (!result.allowed) {
      console.error('🚫 FIREWALL BLOCKED NPM SCRIPT');
      if (result.violation) {
        console.error(`   ${result.violation.message}`);
      }
      process.exit(1);
    }

    return result;
  }

  async interceptGitOperation(operation: 'commit' | 'push' | 'pull'): Promise<FirewallResult> {
    const result = await this.firewall.preflight(`git-${operation}`, {
      operation,
    });

    if (!result.allowed) {
      console.error('🚫 FIREWALL BLOCKED GIT OPERATION');
      if (result.violation) {
        console.error(`   ${result.violation.message}`);
      }
      process.exit(1);
    }

    return result;
  }

  private classifyOperation(command: string, args: string[]): string {
    if (command === 'npm' || command === 'yarn' || command === 'pnpm') {
      return 'package-manager';
    }
    if (command === 'git') {
      return 'git-operation';
    }
    if (command === 'next') {
      return 'nextjs-operation';
    }
    if (command === 'node') {
      return 'node-execution';
    }
    if (command === 'tsx' || command === 'ts-node') {
      return 'typescript-execution';
    }
    return 'unknown-operation';
  }
}

export const interceptor = new ExecutionInterceptor();
