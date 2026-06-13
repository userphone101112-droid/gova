// packages/governance-gate/cli/index.ts
// CLI interface for Governance Gate

import { createGate, approveGate, preflightValidation } from '../engine';

interface CLIOptions {
  title?: string;
  description?: string;
  requester?: string;
  category?: string;
  riskLevel?: string;
  gateId?: string;
  approver?: string;
  comments?: string;
}

function parseArgs(args: string[]): CLIOptions {
  const options: CLIOptions = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];
    
    switch (arg) {
      case '--title':
        options.title = nextArg;
        i++;
        break;
      case '--description':
        options.description = nextArg;
        i++;
        break;
      case '--requester':
        options.requester = nextArg;
        i++;
        break;
      case '--category':
        options.category = nextArg;
        i++;
        break;
      case '--risk-level':
        options.riskLevel = nextArg;
        i++;
        break;
      case '--gate-id':
        options.gateId = nextArg;
        i++;
        break;
      case '--approver':
        options.approver = nextArg;
        i++;
        break;
      case '--comments':
        options.comments = nextArg;
        i++;
        break;
    }
  }
  
  return options;
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const options = parseArgs(args.slice(1));
  
  switch (command) {
    case 'create':
      if (!options.title || !options.description || !options.requester) {
        console.error('Usage: npm run governance:plan -- --title "Title" --description "Description" --requester "Requester" [--category "category"] [--risk-level "risk-level"]');
        process.exit(1);
      }
      
      const response = createGate({
        title: options.title,
        description: options.description,
        requester: options.requester,
        category: options.category as any,
        riskLevel: options.riskLevel as any,
      });
      
      if (response.success) {
        console.log('✅ Governance Gate created successfully\n');
        console.log(`Gate ID: ${response.gateId}\n`);
        console.log('Governance Plan:\n');
        console.log(JSON.stringify(response.plan, null, 2));
      } else {
        console.error('❌ Failed to create Governance Gate\n');
        response.errors.forEach(err => console.error(`  - ${err}`));
        if (response.warnings.length > 0) {
          console.warn('\nWarnings:\n');
          response.warnings.forEach(warn => console.warn(`  - ${warn}`));
        }
        process.exit(1);
      }
      break;
      
    case 'approve':
      if (!options.gateId || !options.approver) {
        console.error('Usage: npm run governance:approve -- --gate-id "GATE-ID" --approver "Approver" [--comments "Comments"]');
        process.exit(1);
      }
      
      const approveResponse = approveGate(options.gateId, options.approver, options.comments);
      
      if (approveResponse.success) {
        console.log('✅ Gate approved successfully\n');
      } else {
        console.error('❌ Failed to approve Gate\n');
        approveResponse.errors.forEach(err => console.error(`  - ${err}`));
        process.exit(1);
      }
      break;
      
    case 'preflight':
      if (!options.gateId) {
        console.error('Usage: npm run governance:preflight -- --gate-id "GATE-ID"');
        process.exit(1);
      }
      
      const preflightResponse = preflightValidation(options.gateId);
      
      if (preflightResponse.success) {
        console.log('✅ Preflight validation passed\n');
      } else {
        console.error('❌ Preflight validation failed\n');
        preflightResponse.errors.forEach(err => console.error(`  - ${err}`));
        if (preflightResponse.warnings.length > 0) {
          console.warn('\nWarnings:\n');
          preflightResponse.warnings.forEach(warn => console.warn(`  - ${warn}`));
        }
        process.exit(1);
      }
      break;
      
    default:
      console.error('Unknown command. Available commands: create, approve, preflight');
      process.exit(1);
  }
}

if (require.main === module) {
  main();
}
