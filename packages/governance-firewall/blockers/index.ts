// packages/governance-firewall/blockers/index.ts
// Operation Blockers - Hard block rules for specific operations

import { existsSync } from 'fs';
import { join } from 'path';

export interface BlockRule {
  id: string;
  name: string;
  description: string;
  check: (operation: string, context?: any) => boolean;
  severity: 'error' | 'warning' | 'critical';
  block: boolean;
  message: string;
  suggestedFix: string;
}

export class BlockerEngine {
  private rules: BlockRule[] = [
    {
      id: 'page-without-ssot',
      name: 'Page Without SSOT',
      description: 'Block page.tsx creation without Pages SSOT registration',
      check: (op, ctx) => {
        return op === 'file-write' && ctx?.path?.includes('page.tsx');
      },
      severity: 'error',
      block: true,
      message: 'Cannot create page.tsx without Pages SSOT registration',
      suggestedFix: 'Register page in @gv/pages-ssot before creating the file',
    },
    {
      id: 'route-without-ssot',
      name: 'Route Without SSOT',
      description: 'Block route creation without Routes SSOT registration',
      check: (op, ctx) => {
        return op === 'file-write' && ctx?.path?.includes('route.') && ctx?.path?.endsWith('.ts');
      },
      severity: 'error',
      block: true,
      message: 'Cannot create route without Routes SSOT registration',
      suggestedFix: 'Register route in @gv/routes-ssot before creating the file',
    },
    {
      id: 'schema-outside-ssot',
      name: 'Schema Outside SSOT',
      description: 'Block schema creation outside @gv/schemas',
      check: (op, ctx) => {
        if (op !== 'file-write') return false;
        if (!ctx?.path) return false;
        const isSchema = ctx.path.includes('schema') && ctx.path.endsWith('.ts');
        const inSSOT = ctx.path.includes('packages/schemas');
        return isSchema && !inSSOT;
      },
      severity: 'error',
      block: true,
      message: 'Cannot create schema outside @gv/schemas',
      suggestedFix: 'Create schema in packages/schemas/ directory',
    },
    {
      id: 'translation-without-ssot',
      name: 'Translation Without SSOT',
      description: 'Block translation creation without Translations SSOT',
      check: (op, ctx) => {
        return op === 'file-write' && (ctx?.path?.includes('translation') || ctx?.path?.includes('i18n'));
      },
      severity: 'error',
      block: true,
      message: 'Cannot create translation without Translations SSOT',
      suggestedFix: 'Register translation in @gv/translations before creating the file',
    },
    {
      id: 'dto-outside-contracts',
      name: 'DTO Outside Contracts',
      description: 'Block DTO creation outside @gv/contracts',
      check: (op, ctx) => {
        if (op !== 'file-write') return false;
        if (!ctx?.path) return false;
        const isDTO = ctx.path.includes('dto') || ctx.path.includes('contract');
        const inContracts = ctx.path.includes('packages/contracts');
        return isDTO && !inContracts;
      },
      severity: 'error',
      block: true,
      message: 'Cannot create DTO outside @gv/contracts',
      suggestedFix: 'Create DTO in packages/contracts/ directory',
    },
    {
      id: 'feature-without-ssot',
      name: 'Feature Without SSOT',
      description: 'Block feature implementation without Features SSOT registration',
      check: (op, ctx) => {
        return op === 'file-write' && ctx?.path?.includes('features') && !ctx?.path?.includes('packages/features-ssot');
      },
      severity: 'error',
      block: true,
      message: 'Cannot implement feature without Features SSOT registration',
      suggestedFix: 'Register feature in @gv/features-ssot before implementation',
    },
    {
      id: 'permission-without-ssot',
      name: 'Permission Without SSOT',
      description: 'Block permission definition without Permissions SSOT',
      check: (op, ctx) => {
        return op === 'file-write' && ctx?.path?.includes('permission') && !ctx?.path?.includes('packages/permissions-ssot');
      },
      severity: 'critical',
      block: true,
      message: 'Cannot define permission without Permissions SSOT',
      suggestedFix: 'Register permission in @gv/permissions-ssot before defining',
    },
    {
      id: 'form-without-ssot',
      name: 'Form Without SSOT',
      description: 'Block form creation without Forms SSOT',
      check: (op, ctx) => {
        return op === 'file-write' && ctx?.path?.includes('form') && !ctx?.path?.includes('packages/forms-ssot');
      },
      severity: 'error',
      block: true,
      message: 'Cannot create form without Forms SSOT',
      suggestedFix: 'Register form in @gv/forms-ssot before creation',
    },
  ];

  check(operation: string, context?: any): BlockRule | null {
    for (const rule of this.rules) {
      if (rule.check(operation, context)) {
        return rule;
      }
    }
    return null;
  }

  addRule(rule: BlockRule): void {
    this.rules.push(rule);
  }

  removeRule(ruleId: string): void {
    this.rules = this.rules.filter(r => r.id !== ruleId);
  }

  getRules(): BlockRule[] {
    return [...this.rules];
  }

  getBlockingRules(): BlockRule[] {
    return this.rules.filter(r => r.block);
  }
}

export const blockerEngine = new BlockerEngine();
