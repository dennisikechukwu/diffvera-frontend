import type { Finding } from '~/types/workspace'

/**
 * Detects code block language identifier from a file path.
 */
export function detectCodeLanguage(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase() ?? ''
  switch (ext) {
    case 'ts':
    case 'mts':
    case 'cts':
      return 'typescript'
    case 'tsx':
      return 'tsx'
    case 'js':
    case 'mjs':
    case 'cjs':
      return 'javascript'
    case 'jsx':
      return 'jsx'
    case 'vue':
      return 'vue'
    case 'java':
      return 'java'
    case 'kt':
    case 'kts':
      return 'kotlin'
    case 'py':
      return 'python'
    case 'go':
      return 'go'
    case 'rs':
      return 'rust'
    case 'cs':
      return 'csharp'
    case 'cpp':
    case 'cc':
    case 'cxx':
      return 'cpp'
    case 'c':
    case 'h':
      return 'c'
    case 'rb':
      return 'ruby'
    case 'php':
      return 'php'
    case 'swift':
      return 'swift'
    case 'sql':
      return 'sql'
    case 'json':
      return 'json'
    case 'yaml':
    case 'yml':
      return 'yaml'
    case 'md':
      return 'markdown'
    case 'sh':
    case 'bash':
    case 'zsh':
      return 'bash'
    default:
      return 'text'
  }
}

export interface FindingPromptOptions {
  ruleName?: string
  repositoryName?: string
  prNumber?: number
}

export interface BatchPromptOptions {
  repositoryName?: string
  prNumber?: number
  prTitle?: string
}

/**
 * Generates an agent-ready prompt for a single code review finding,
 * guiding autonomous coding agents (Claude Code, Cursor, Copilot Workspace, Aider)
 * to inspect the full workspace for existing helpers and produce a verified report.
 */
export function buildFindingPrompt(finding: Finding, options?: FindingPromptOptions): string {
  const lang = detectCodeLanguage(finding.file)
  const repoHeader = options?.repositoryName ? ` in ${options.repositoryName}` : ''
  const ruleLine = (finding.ruleName || options?.ruleName || finding.ruleId)
    ? `- **Architecture Rule**: ${finding.ruleName || options?.ruleName || finding.ruleId}\n`
    : ''

  const codeExcerptBlock = finding.codeExcerpt
    ? `\n### Code Excerpt\n\`\`\`${lang}\n${finding.codeExcerpt}\n\`\`\`\n`
    : ''

  return `# TASK: Remediate Code Review Finding${repoHeader}

You are an expert autonomous coding agent. Diffvera (an automated architecture and code review engine) identified an issue in this repository. Resolve this issue while adhering to codebase conventions.

================================================================================
CONTEXT & FINDING DETAILS
================================================================================
- **Target File**: \`${finding.file}\`
- **Lines**: L${finding.startLine}–L${finding.endLine}
- **Category**: ${finding.category.toUpperCase()}
- **Severity**: ${finding.severity.toUpperCase()}
- **Issue**: ${finding.title}
${ruleLine}${codeExcerptBlock}
### Problem Explanation
${finding.explanation}

### Diffvera Suggested Direction (Reference Only)
${finding.suggestion}

\`\`\`${lang}
${finding.correction}
\`\`\`

================================================================================
INSTRUCTIONS FOR CODING AGENT
================================================================================
1. **Explore Full Workspace Scope**: Diffvera's analysis is strictly scoped to the Pull Request diff. Before creating new abstractions or writing repetitive boilerplate, search this repository to check if existing helper functions, service wrappers, shared clients, or utility modules already provide this functionality. Re-use existing codebase patterns and utilities wherever possible.
2. **Preserve Architectural Invariants**: Address the root cause of the issue without introducing cross-layer coupling, security regressions, or broken contract invariants.
3. **Validate & Test**: Run relevant project test suites, type checks, or linters to verify that your changes compile cleanly and do not break existing behavior.

================================================================================
REPORT FORMAT (produce exactly this)
================================================================================

## Summary
Two to four sentences: what was built/fixed, build status.

## Verification Checklist
- [ ] Resolved ${finding.title} in ${finding.file}:${finding.startLine}–${finding.endLine}
- [ ] Reused existing codebase utilities/helpers where applicable
- [ ] Preserved architectural boundaries (no cross-layer leaks or regressions)
- [ ] Automated tests and typechecks pass

## Files modified
Grouped by folder, one line each on purpose.
`
}

/**
 * Generates a consolidated agent-ready prompt for all findings in a pull request review.
 */
export function buildBatchReviewPrompt(findings: Finding[], options?: BatchPromptOptions): string {
  if (findings.length === 0) return ''

  const repoText = options?.repositoryName ? ` in ${options.repositoryName}` : ''
  const prText = options?.prNumber ? ` (PR #${options.prNumber}${options.prTitle ? `: ${options.prTitle}` : ''})` : ''

  const findingsList = findings
    .map((finding, idx) => {
      const lang = detectCodeLanguage(finding.file)
      const rule = finding.ruleName ? `- **Rule**: ${finding.ruleName}\n` : ''
      return `### Finding ${idx + 1}: ${finding.title}
- **File**: \`${finding.file}\` (Lines L${finding.startLine}–L${finding.endLine})
- **Category**: ${finding.category.toUpperCase()} | **Severity**: ${finding.severity.toUpperCase()}
${rule}**Explanation**: ${finding.explanation}
**Suggested Direction**: ${finding.suggestion}

\`\`\`${lang}
${finding.correction}
\`\`\`
`
    })
    .join('\n')

  const checklistItems = findings
    .map((finding, idx) => `- [ ] Finding ${idx + 1}: ${finding.title} (${finding.file}:L${finding.startLine})`)
    .join('\n')

  return `# TASK: Remediate ${findings.length} Code Review Findings${repoText}${prText}

You are an expert autonomous coding agent. Diffvera identified ${findings.length} code review findings across this Pull Request. Resolve each finding while adhering to codebase conventions.

================================================================================
REVIEW FINDINGS TO RESOLVE
================================================================================

${findingsList}
================================================================================
INSTRUCTIONS FOR CODING AGENT
================================================================================
1. **Explore Full Workspace Scope**: Diffvera only inspects the Pull Request diff. Before creating new abstractions or writing repetitive boilerplate, search this repository to check if existing helper functions, service wrappers, shared clients, or utility modules already provide this functionality. Re-use existing codebase patterns and utilities wherever possible.
2. **Sequential Resolution**: Fix each finding carefully without introducing cross-layer coupling or regressions.
3. **Validate & Test**: Run relevant project test suites, type checks, or linters to verify that all changes compile cleanly and pass tests.

================================================================================
REPORT FORMAT (produce exactly this)
================================================================================

## Summary
Two to four sentences: what was built/fixed across all findings, build status.

## Verification Checklist
${checklistItems}
- [ ] Reused existing codebase utilities/helpers where applicable
- [ ] Preserved architectural boundaries (no cross-layer leaks or regressions)
- [ ] Automated tests and typechecks pass

## Files modified
Grouped by folder, one line each on purpose.
`
}

export function useAgentPrompt() {
  return {
    detectCodeLanguage,
    buildFindingPrompt,
    buildBatchReviewPrompt
  }
}
