// packages/governance-firewall/engine/index.ts
// Firewall Engine - Core execution control engine

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export interface FirewallConfig {
  mode: 'strict' | 'lenient' | 'off';
  enforceGate: boolean;
  blockUnauthorized: boolean;
  autoRollback: boolean;
  logViolations: boolean;
}

export interface FirewallResult {
  allowed: boolean;
  gateId?: string;
  violation?: {
    type: string;
    message: string;
    severity: 'error' | 'warning' | 'critical';
    suggestedFix: string;
  };
  rollbackPerformed?: boolean;
}

const DEFAULT_CONFIG: FirewallConfig = {
  mode: process.env.GOVERNANCE_MODE === 'HARD' ? 'strict' : 'lenient',
  enforceGate: true,
  blockUnauthorized: true,
  autoRollback: true,
  logViolations: true,
};

export class FirewallEngine {
  private config: FirewallConfig;
  private activeGateId?: string;

  constructor(config: Partial<FirewallConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  setGateId(gateId: string): void {
    this.activeGateId = gateId;
  }

  getGateId(): string | undefined {
    return this.activeGateId;
  }

  async preflight(operation: string, context?: Record<string, any>): Promise<FirewallResult> {
    // In strict mode, all operations require gate approval
    if (this.config.mode === 'strict') {
      if (!this.activeGateId) {
        const violation = {
          type: 'NO_GATE_ID',
          message: `Operation '${operation}' requires a valid Governance Gate ID in strict mode`,
          severity: 'critical' as const,
          suggestedFix: 'Run: npm run governance:plan to create a gate, then set GATE_ID environment variable',
        };
        
        if (this.config.logViolations) {
          this.logViolation(violation, operation, context);
        }
        
        return { allowed: false, violation };
      }

      // Validate gate exists and is approved
      const gateValid = await this.validateGate(this.activeGateId);
      if (!gateValid) {
        const violation = {
          type: 'INVALID_GATE',
          message: `Gate ${this.activeGateId} is not valid or not approved`,
          severity: 'critical' as const,
          suggestedFix: 'Ensure the gate is approved before proceeding',
        };
        
        if (this.config.logViolations) {
          this.logViolation(violation, operation, context);
        }
        
        return { allowed: false, gateId: this.activeGateId, violation };
      }
    }

    // Check for unauthorized SSOT operations
    if (this.config.blockUnauthorized) {
      const unauthorized = await this.checkUnauthorizedOperation(operation, context);
      if (unauthorized) {
        if (this.config.logViolations) {
          this.logViolation(unauthorized, operation, context);
        }
        
        if (this.config.autoRollback) {
          await this.rollbackOperation(operation, context);
        }
        
        return { allowed: false, gateId: this.activeGateId, violation: unauthorized, rollbackPerformed: true };
      }
    }

    return { allowed: true, gateId: this.activeGateId };
  }

  async validateGate(gateId: string): Promise<boolean> {
    try {
      // Call governance-gate preflight validation
      const output = execSync(`npm run governance:preflight -- --gate-id ${gateId}`, {
        encoding: 'utf-8',
        stdio: 'pipe',
      });
      
      return output.includes('✅');
    } catch (error) {
      return false;
    }
  }

  async checkUnauthorizedOperation(operation: string, context?: Record<string, any>): Promise<{
    type: string;
    message: string;
    severity: 'error' | 'warning' | 'critical';
    suggestedFix: string;
  } | null> {
    // Check for unauthorized page creation
    if (operation === 'file-write' && context?.path?.includes('page.tsx')) {
      const pagesSSOT = join(process.cwd(), 'packages', 'pages-ssot');
      if (!existsSync(pagesSSOT)) {
        return {
          type: 'UNAUTHORIZED_PAGE',
          message: 'Cannot create page.tsx without Pages SSOT registration',
          severity: 'error',
          suggestedFix: 'Register page in @gv/pages-ssot before creating the file',
        };
      }
    }

    // Check for unauthorized route creation
    if (operation === 'file-write' && context?.path?.includes('route.') && context?.path?.includes('.ts')) {
      const routesSSOT = join(process.cwd(), 'packages', 'routes-ssot');
      if (!existsSync(routesSSOT)) {
        return {
          type: 'UNAUTHORIZED_ROUTE',
          message: 'Cannot create route without Routes SSOT registration',
          severity: 'error',
          suggestedFix: 'Register route in @gv/routes-ssot before creating the file',
        };
      }
    }

    // Check for unauthorized schema creation
    if (operation === 'file-write' && context?.path?.includes('schema') && context?.path?.endsWith('.ts')) {
      const schemasSSOT = join(process.cwd(), 'packages', 'schemas');
      if (!existsSync(schemasSSOT)) {
        return {
          type: 'UNAUTHORIZED_SCHEMA',
          message: 'Cannot create schema outside @gv/schemas',
          severity: 'error',
          suggestedFix: 'Create schema in packages/schemas/ directory',
        };
      }
    }

    // Check for unauthorized translation creation
    if (operation === 'file-write' && context?.path?.includes('translation') || context?.path?.includes('i18n')) {
      const translationsSSOT = join(process.cwd(), 'packages', 'translations');
      if (!existsSync(translationsSSOT)) {
        return {
          type: 'UNAUTHORIZED_TRANSLATION',
          message: 'Cannot create translation without Translations SSOT',
          severity: 'error',
          suggestedFix: 'Register translation in @gv/translations before creating the file',
        };
      }
    }

    // Check for unauthorized DTO creation
    if (operation === 'file-write' && context?.path?.includes('dto') || context?.path?.includes('contract')) {
      const contractsSSOT = join(process.cwd(), 'packages', 'contracts');
      if (!existsSync(contractsSSOT)) {
        return {
          type: 'UNAUTHORIZED_CONTRACT',
          message: 'Cannot create DTO outside @gv/contracts',
          severity: 'error',
          suggestedFix: 'Create DTO in packages/contracts/ directory',
        };
      }
    }

    return null;
  }

  async rollbackOperation(operation: string, context?: Record<string, any>): Promise<void> {
    if (operation === 'file-write' && context?.path) {
      try {
        execSync(`git checkout -- ${context.path}`, { stdio: 'pipe' });
        console.log(`🔄 Rolled back: ${context.path}`);
      } catch (error) {
        console.error(`Failed to rollback: ${context.path}`);
      }
    }
  }

  private logViolation(violation: any, operation: string, context?: Record<string, any>): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      operation,
      violation,
      context,
      gateId: this.activeGateId,
    };

    const auditsDir = join(process.cwd(), 'docs', 'audits', 'governance-violations');
    if (!existsSync(auditsDir)) {
      // Create directory if needed (would need fs.mkdir in real implementation)
    }

    const logFile = join(auditsDir, `violation-${timestamp.replace(/[:.]/g, '-')}.json`);
    // writeFileSync(logFile, JSON.stringify(logEntry, null, 2));
    
    console.error(`🚨 FIREWALL VIOLATION: ${violation.type}`);
    console.error(`   Message: ${violation.message}`);
    console.error(`   Severity: ${violation.severity}`);
    console.error(`   Suggested Fix: ${violation.suggestedFix}`);
  }

  getConfig(): FirewallConfig {
    return { ...this.config };
  }

  setConfig(config: Partial<FirewallConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Singleton instance
let firewallInstance: FirewallEngine | null = null;

export function getFirewall(): FirewallEngine {
  if (!firewallInstance) {
    firewallInstance = new FirewallEngine();
  }
  return firewallInstance;
}

export function resetFirewall(): void {
  firewallInstance = null;
}
