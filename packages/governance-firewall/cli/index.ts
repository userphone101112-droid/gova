// packages/governance-firewall/cli/index.ts
// Firewall CLI - Global execution wrapper

import { spawn } from 'child_process';
import { getFirewall } from '../engine';

interface CLIOptions {
  command: string;
  args: string[];
  gateId?: string;
  strict?: boolean;
}

function parseArgs(args: string[]): CLIOptions {
  const options: CLIOptions = {
    command: '',
    args: [],
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    switch (arg) {
      case '--gate-id':
        options.gateId = nextArg;
        i++;
        break;
      case '--strict':
        options.strict = true;
        break;
      case '--':
        options.command = nextArg || '';
        options.args = args.slice(i + 2);
        break;
      default:
        if (!options.command) {
          options.command = arg;
        } else {
          options.args.push(arg);
        }
    }
  }

  return options;
}

async function main() {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  if (!options.command) {
    console.error('Usage: governance-firewall <command> [args...] [--gate-id GATE-ID] [--strict]');
    console.error('');
    console.error('Examples:');
    console.error('  governance-firewall npm run dev');
    console.error('  governance-firewall npm run build --gate-id GATE-2026-0001');
    console.error('  governance-firewall npm run test --strict');
    process.exit(1);
  }

  const firewall = getFirewall();

  // Set gate ID if provided
  if (options.gateId) {
    firewall.setGateId(options.gateId);
  }

  // Set strict mode if requested
  if (options.strict) {
    firewall.setConfig({ mode: 'strict' });
  }

  // Run preflight
  const result = await firewall.preflight('command-execution', {
    command: options.command,
    args: options.args,
  });

  if (!result.allowed) {
    console.error('🚫 FIREWALL BLOCKED EXECUTION');
    if (result.violation) {
      console.error(`   Type: ${result.violation.type}`);
      console.error(`   Message: ${result.violation.message}`);
      console.error(`   Severity: ${result.violation.severity}`);
      console.error(`   Suggested Fix: ${result.violation.suggestedFix}`);
    }
    if (result.rollbackPerformed) {
      console.error('   Auto-rollback performed');
    }
    process.exit(1);
  }

  // Execute the command
  console.log('✅ Firewall preflight passed');
  console.log(`🚀 Executing: ${options.command} ${options.args.join(' ')}`);
  console.log('');

  const child = spawn(options.command, options.args, {
    stdio: 'inherit',
    shell: true,
  });

  child.on('close', (code) => {
    process.exit(code ?? 0);
  });

  child.on('error', (err) => {
    console.error('Failed to execute command:', err);
    process.exit(1);
  });
}

if (require.main === module) {
  main();
}
