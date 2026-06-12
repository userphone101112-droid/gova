#!/usr/bin/env node

/**
 * Documentation Link Validation Script
 * 
 * This script validates that all internal links in documentation are valid.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');

const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

function getAllMarkdownFiles(dir, excludeDirs = ['node_modules', '.git', '.next', 'dist', 'build']) {
  const files = [];
  
  if (!fs.existsSync(dir)) {
    return files;
  }
  
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      if (!excludeDirs.includes(item.name)) {
        files.push(...getAllMarkdownFiles(fullPath, excludeDirs));
      }
    } else if (item.isFile() && (item.name.endsWith('.md') || item.name.endsWith('.mdx'))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function extractLinks(content) {
  const links = [];
  let match;
  
  while ((match = markdownLinkRegex.exec(content)) !== null) {
    const [, text, url] = match;
    links.push({ text, url });
  }
  
  return links;
}

function isExternalLink(url) {
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('#');
}

function resolveLinkPath(linkUrl, currentFilePath) {
  const currentDir = path.dirname(currentFilePath);
  
  // Handle relative paths
  if (linkUrl.startsWith('./') || linkUrl.startsWith('../')) {
    return path.resolve(currentDir, linkUrl);
  }
  
  // Handle absolute paths from docs/
  if (linkUrl.startsWith('/')) {
    return path.join(ROOT_DIR, linkUrl);
  }
  
  // Handle relative paths without ./
  return path.resolve(currentDir, linkUrl);
}

function validateLinks() {
  console.log('🔗 Validating documentation links...');
  
  const docsFiles = getAllMarkdownFiles(DOCS_DIR);
  let brokenLinks = [];
  let checkedLinks = 0;
  
  for (const filePath of docsFiles) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const links = extractLinks(content);
    
    for (const link of links) {
      if (isExternalLink(link.url)) {
        continue; // Skip external links
      }
      
      checkedLinks++;
      
      const resolvedPath = resolveLinkPath(link.url, filePath);
      
      // Remove anchor if present
      const pathWithoutAnchor = resolvedPath.split('#')[0];
      
      if (!fs.existsSync(pathWithoutAnchor)) {
        brokenLinks.push({
          file: path.relative(ROOT_DIR, filePath),
          link: link.url,
          text: link.text,
          resolved: pathWithoutAnchor
        });
      }
    }
  }
  
  console.log(`✓ Checked ${checkedLinks} internal links`);
  
  if (brokenLinks.length > 0) {
    console.log(`\n❌ Found ${brokenLinks.length} broken links:`);
    brokenLinks.forEach(broken => {
      console.log(`  - ${broken.file}: "${broken.text}" -> ${broken.link} (${broken.resolved})`);
    });
    return false;
  }
  
  console.log('✅ All internal links are valid');
  return true;
}

function main() {
  console.log('🔗 Documentation Link Validation');
  console.log('================================\n');
  
  const success = validateLinks();
  
  console.log('\n================================');
  
  if (success) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

main();
