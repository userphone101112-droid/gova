// packages/governance-gate/approvals/index.ts
// Approval engine - determines required approvals

import { ChangeCategory, RiskLevel } from '../registry';

export interface ApprovalRequirement {
  role: string;
  required: boolean;
  reason: string;
  autoApprove: boolean;
}

export function determineRequiredApprovals(
  category: ChangeCategory,
  riskLevel: RiskLevel
): ApprovalRequirement[] {
  const approvals: ApprovalRequirement[] = [];
  
  // Base approvals based on category
  switch (category) {
    case 'new-feature':
      approvals.push({
        role: 'product-lead',
        required: true,
        reason: 'Product lead must approve new features',
        autoApprove: false,
      });
      approvals.push({
        role: 'frontend-lead',
        required: true,
        reason: 'Frontend lead must approve UI changes',
        autoApprove: false,
      });
      break;
      
    case 'new-page':
      approvals.push({
        role: 'frontend-lead',
        required: true,
        reason: 'Frontend lead must approve new pages',
        autoApprove: false,
      });
      break;
      
    case 'new-route':
      approvals.push({
        role: 'api-lead',
        required: true,
        reason: 'API lead must approve new routes',
        autoApprove: false,
      });
      break;
      
    case 'new-form':
      approvals.push({
        role: 'fullstack-lead',
        required: true,
        reason: 'Fullstack lead must approve new forms',
        autoApprove: false,
      });
      break;
      
    case 'new-api':
      approvals.push({
        role: 'api-lead',
        required: true,
        reason: 'API lead must approve new APIs',
        autoApprove: false,
      });
      approvals.push({
        role: 'security-lead',
        required: true,
        reason: 'Security lead must review API security',
        autoApprove: false,
      });
      break;
      
    case 'new-schema':
      approvals.push({
        role: 'fullstack-lead',
        required: true,
        reason: 'Fullstack lead must approve new schemas',
        autoApprove: false,
      });
      break;
      
    case 'new-contract':
      approvals.push({
        role: 'api-lead',
        required: true,
        reason: 'API lead must approve new contracts',
        autoApprove: false,
      });
      break;
      
    case 'new-translation':
      approvals.push({
        role: 'i18n-lead',
        required: true,
        reason: 'i18n lead must approve new translations',
        autoApprove: false,
      });
      break;
      
    case 'new-permission':
      approvals.push({
        role: 'security-lead',
        required: true,
        reason: 'Security lead must approve new permissions',
        autoApprove: false,
      });
      approvals.push({
        role: 'platform-architect',
        required: true,
        reason: 'Platform architect must review permission changes',
        autoApprove: false,
      });
      break;
      
    case 'new-business-rule':
      approvals.push({
        role: 'product-lead',
        required: true,
        reason: 'Product lead must approve business rules',
        autoApprove: false,
      });
      break;
      
    case 'new-database-entity':
      approvals.push({
        role: 'backend-lead',
        required: true,
        reason: 'Backend lead must approve database changes',
        autoApprove: false,
      });
      approvals.push({
        role: 'database-admin',
        required: true,
        reason: 'Database admin must approve schema changes',
        autoApprove: false,
      });
      break;
      
    case 'storage-change':
      approvals.push({
        role: 'devops-lead',
        required: true,
        reason: 'DevOps lead must approve storage changes',
        autoApprove: false,
      });
      break;
      
    case 'infrastructure-change':
      approvals.push({
        role: 'devops-lead',
        required: true,
        reason: 'DevOps lead must approve infrastructure changes',
        autoApprove: false,
      });
      approvals.push({
        role: 'platform-architect',
        required: true,
        reason: 'Platform architect must review infrastructure',
        autoApprove: false,
      });
      break;
      
    case 'documentation-change':
      approvals.push({
        role: 'docs-lead',
        required: true,
        reason: 'Docs lead must approve documentation changes',
        autoApprove: true,
      });
      break;
      
    case 'bug-fix':
      approvals.push({
        role: 'tech-lead',
        required: true,
        reason: 'Tech lead must approve bug fixes',
        autoApprove: false,
      });
      break;
      
    case 'refactor':
      approvals.push({
        role: 'tech-lead',
        required: true,
        reason: 'Tech lead must approve refactoring',
        autoApprove: false,
      });
      break;
      
    case 'performance':
      approvals.push({
        role: 'tech-lead',
        required: true,
        reason: 'Tech lead must approve performance changes',
        autoApprove: false,
      });
      break;
      
    case 'security':
      approvals.push({
        role: 'security-lead',
        required: true,
        reason: 'Security lead must approve security changes',
        autoApprove: false,
      });
      approvals.push({
        role: 'platform-architect',
        required: true,
        reason: 'Platform architect must review security changes',
        autoApprove: false,
      });
      break;
      
    default:
      approvals.push({
        role: 'platform-architect',
        required: true,
        reason: 'Platform architect must review other changes',
        autoApprove: false,
      });
  }
  
  // Risk-based additional approvals
  if (riskLevel === 'high' || riskLevel === 'critical') {
    approvals.push({
      role: 'platform-architect',
      required: true,
      reason: 'Platform architect must approve high-risk changes',
      autoApprove: false,
    });
  }
  
  return approvals;
}
