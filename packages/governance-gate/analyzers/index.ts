// packages/governance-gate/analyzers/index.ts
// Change analyzers - classify and analyze changes

import { ChangeCategory, RiskLevel } from '../registry';

export interface ChangeAnalysis {
  category: ChangeCategory;
  confidence: number;
  reason: string;
  riskLevel: RiskLevel;
  keywords: string[];
}

export function analyzeChange(description: string, files?: string[]): ChangeAnalysis {
  const lowerDesc = description.toLowerCase();
  const lowerFiles = files?.map(f => f.toLowerCase()) || [];
  
  // Analyze based on description and file patterns
  const analysis: ChangeAnalysis = {
    category: 'other',
    confidence: 0,
    reason: '',
    riskLevel: 'medium',
    keywords: [],
  };
  
  // Feature detection
  if (lowerDesc.includes('new feature') || lowerDesc.includes('add feature') || lowerDesc.includes('implement feature')) {
    analysis.category = 'new-feature';
    analysis.confidence = 0.9;
    analysis.reason = 'Description explicitly mentions new feature';
    analysis.riskLevel = 'medium';
    analysis.keywords = ['feature', 'new', 'implement'];
  }
  
  // Page detection
  if (lowerDesc.includes('new page') || lowerDesc.includes('add page') || lowerDesc.includes('create page')) {
    analysis.category = 'new-page';
    analysis.confidence = 0.9;
    analysis.reason = 'Description explicitly mentions new page';
    analysis.riskLevel = 'low';
    analysis.keywords = ['page', 'new', 'create'];
  }
  
  // Route detection
  if (lowerDesc.includes('new route') || lowerDesc.includes('add route') || lowerDesc.includes('api endpoint')) {
    analysis.category = 'new-route';
    analysis.confidence = 0.85;
    analysis.reason = 'Description mentions route or API endpoint';
    analysis.riskLevel = 'medium';
    analysis.keywords = ['route', 'endpoint', 'api'];
  }
  
  // Form detection
  if (lowerDesc.includes('new form') || lowerDesc.includes('add form') || lowerDesc.includes('create form')) {
    analysis.category = 'new-form';
    analysis.confidence = 0.9;
    analysis.reason = 'Description explicitly mentions new form';
    analysis.riskLevel = 'low';
    analysis.keywords = ['form', 'new', 'create'];
  }
  
  // API detection
  if (lowerDesc.includes('new api') || lowerDesc.includes('add api') || lowerDesc.includes('api endpoint')) {
    analysis.category = 'new-api';
    analysis.confidence = 0.85;
    analysis.reason = 'Description mentions API';
    analysis.riskLevel = 'medium';
    analysis.keywords = ['api', 'endpoint', 'new'];
  }
  
  // Schema detection
  if (lowerDesc.includes('new schema') || lowerDesc.includes('add schema') || lowerDesc.includes('validation schema')) {
    analysis.category = 'new-schema';
    analysis.confidence = 0.85;
    analysis.reason = 'Description mentions schema';
    analysis.riskLevel = 'medium';
    analysis.keywords = ['schema', 'validation', 'new'];
  }
  
  // Contract detection
  if (lowerDesc.includes('new contract') || lowerDesc.includes('add contract') || lowerDesc.includes('dto')) {
    analysis.category = 'new-contract';
    analysis.confidence = 0.85;
    analysis.reason = 'Description mentions contract or DTO';
    analysis.riskLevel = 'medium';
    analysis.keywords = ['contract', 'dto', 'new'];
  }
  
  // Translation detection
  if (lowerDesc.includes('new translation') || lowerDesc.includes('add translation') || lowerDesc.includes('localization')) {
    analysis.category = 'new-translation';
    analysis.confidence = 0.9;
    analysis.reason = 'Description mentions translation or localization';
    analysis.riskLevel = 'low';
    analysis.keywords = ['translation', 'localization', 'i18n'];
  }
  
  // Permission detection
  if (lowerDesc.includes('new permission') || lowerDesc.includes('add permission') || lowerDesc.includes('access control')) {
    analysis.category = 'new-permission';
    analysis.confidence = 0.9;
    analysis.reason = 'Description mentions permission or access control';
    analysis.riskLevel = 'high';
    analysis.keywords = ['permission', 'access', 'control'];
  }
  
  // Business rule detection
  if (lowerDesc.includes('new business rule') || lowerDesc.includes('add business rule') || lowerDesc.includes('logic change')) {
    analysis.category = 'new-business-rule';
    analysis.confidence = 0.85;
    analysis.reason = 'Description mentions business rule or logic';
    analysis.riskLevel = 'medium';
    analysis.keywords = ['business rule', 'logic', 'change'];
  }
  
  // Database entity detection
  if (lowerDesc.includes('new table') || lowerDesc.includes('add table') || lowerDesc.includes('database entity')) {
    analysis.category = 'new-database-entity';
    analysis.confidence = 0.9;
    analysis.reason = 'Description mentions database table or entity';
    analysis.riskLevel = 'high';
    analysis.keywords = ['table', 'database', 'entity'];
  }
  
  // Storage change detection
  if (lowerDesc.includes('storage') || lowerDesc.includes('s3') || lowerDesc.includes('file storage')) {
    analysis.category = 'storage-change';
    analysis.confidence = 0.8;
    analysis.reason = 'Description mentions storage';
    analysis.riskLevel = 'medium';
    analysis.keywords = ['storage', 's3', 'file'];
  }
  
  // Infrastructure change detection
  if (lowerDesc.includes('infrastructure') || lowerDesc.includes('deployment') || lowerDesc.includes('ci/cd')) {
    analysis.category = 'infrastructure-change';
    analysis.confidence = 0.85;
    analysis.reason = 'Description mentions infrastructure';
    analysis.riskLevel = 'high';
    analysis.keywords = ['infrastructure', 'deployment', 'ci/cd'];
  }
  
  // Documentation change detection
  if (lowerDesc.includes('documentation') || lowerDesc.includes('docs') || lowerDesc.includes('readme')) {
    analysis.category = 'documentation-change';
    analysis.confidence = 0.85;
    analysis.reason = 'Description mentions documentation';
    analysis.riskLevel = 'low';
    analysis.keywords = ['documentation', 'docs', 'readme'];
  }
  
  // Bug fix detection
  if (lowerDesc.includes('fix') || lowerDesc.includes('bug') || lowerDesc.includes('issue')) {
    analysis.category = 'bug-fix';
    analysis.confidence = 0.8;
    analysis.reason = 'Description mentions fix or bug';
    analysis.riskLevel = 'medium';
    analysis.keywords = ['fix', 'bug', 'issue'];
  }
  
  // Refactor detection
  if (lowerDesc.includes('refactor') || lowerDesc.includes('refactoring') || lowerDesc.includes('cleanup')) {
    analysis.category = 'refactor';
    analysis.confidence = 0.85;
    analysis.reason = 'Description mentions refactoring';
    analysis.riskLevel = 'medium';
    analysis.keywords = ['refactor', 'cleanup', 'restructure'];
  }
  
  // Performance detection
  if (lowerDesc.includes('performance') || lowerDesc.includes('optimize') || lowerDesc.includes('speed')) {
    analysis.category = 'performance';
    analysis.confidence = 0.85;
    analysis.reason = 'Description mentions performance';
    analysis.riskLevel = 'medium';
    analysis.keywords = ['performance', 'optimize', 'speed'];
  }
  
  // Security detection
  if (lowerDesc.includes('security') || lowerDesc.includes('vulnerability') || lowerDesc.includes('auth')) {
    analysis.category = 'security';
    analysis.confidence = 0.9;
    analysis.reason = 'Description mentions security';
    analysis.riskLevel = 'critical';
    analysis.keywords = ['security', 'vulnerability', 'auth'];
  }
  
  // Adjust risk based on keywords
  if (analysis.keywords.includes('security') || analysis.keywords.includes('permission') || analysis.keywords.includes('database')) {
    analysis.riskLevel = 'high';
  }
  
  if (analysis.keywords.includes('infrastructure')) {
    analysis.riskLevel = 'high';
  }
  
  return analysis;
}
