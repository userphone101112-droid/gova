// validate-ssot.ts
// Automated validator for SSOT definitions (Translations, Themes, Permissions)

import { dictionaries } from '../../translations/index';
import { rolePermissions } from '../../auth/index';
import { BUSINESS_RULES } from '../../business-rules/index';

function validateTranslations() {
  console.log('--- Auditing Translations ---');
  const enDict = dictionaries.en;
  const arDict = dictionaries.ar;

  const missingInAr: string[] = [];
  const missingInEn: string[] = [];

  function compareKeys(
    obj1: Record<string, unknown>,
    obj2: Record<string, unknown>,
    path: string = ''
  ) {
    for (const key in obj1) {
      const currentPath = path ? `${path}.${key}` : key;
      if (!(key in obj2)) {
        missingInAr.push(currentPath);
      } else if (typeof obj1[key] === 'object' && obj1[key] !== null) {
        compareKeys(
          obj1[key] as Record<string, unknown>,
          obj2[key] as Record<string, unknown>,
          currentPath
        );
      }
    }
  }

  compareKeys(
    enDict as unknown as Record<string, unknown>,
    arDict as unknown as Record<string, unknown>
  );

  // Reverse check
  function compareKeysReverse(
    obj1: Record<string, unknown>,
    obj2: Record<string, unknown>,
    path: string = ''
  ) {
    for (const key in obj1) {
      const currentPath = path ? `${path}.${key}` : key;
      if (!(key in obj2)) {
        missingInEn.push(currentPath);
      } else if (typeof obj1[key] === 'object' && obj1[key] !== null) {
        compareKeysReverse(
          obj1[key] as Record<string, unknown>,
          obj2[key] as Record<string, unknown>,
          currentPath
        );
      }
    }
  }
  compareKeysReverse(
    arDict as unknown as Record<string, unknown>,
    enDict as unknown as Record<string, unknown>
  );

  if (missingInAr.length > 0) {
    console.error(`❌ Found ${missingInAr.length} keys missing in Arabic (ar) translation:`);
    missingInAr.forEach((key) => console.log(`  - ${key}`));
  } else {
    console.log('✅ Arabic translations are perfectly synced with English!');
  }

  if (missingInEn.length > 0) {
    console.error(`❌ Found ${missingInEn.length} keys missing in English (en) translation:`);
    missingInEn.forEach((key) => console.log(`  - ${key}`));
  } else {
    console.log('✅ English translations are perfectly synced with Arabic!');
  }

  return missingInAr.length === 0 && missingInEn.length === 0;
}

function validatePermissions() {
  console.log('\n--- Auditing Roles & Permissions ---');
  let valid = true;
  for (const role in rolePermissions) {
    const permissions = rolePermissions[role as keyof typeof rolePermissions];
    if (!Array.isArray(permissions)) {
      console.error(`❌ Role "${role}" does not have valid permissions array.`);
      valid = false;
    } else {
      console.log(`✅ Role "${role}" registered with ${permissions.length} permissions.`);
    }
  }
  return valid;
}

function validateBusinessRules() {
  console.log('\n--- Auditing Business Rules ---');
  if (BUSINESS_RULES && typeof BUSINESS_RULES === 'object') {
    console.log(
      `✅ Business rules loaded successfully (${Object.keys(BUSINESS_RULES).length} main sections).`
    );
    return true;
  }
  console.error('❌ Failed to load business rules.');
  return false;
}

function runAll() {
  console.log('=== SSOT Integrity Check ===');
  const tOk = validateTranslations();
  const pOk = validatePermissions();
  const bOk = validateBusinessRules();

  if (tOk && pOk && bOk) {
    console.log('\n🎉 ALL SSOT INTEGRITY CHECKS PASSED!');
    process.exit(0);
  } else {
    console.error('\n❌ SSOT INTEGRITY CHECKS FAILED!');
    process.exit(1);
  }
}

runAll();
