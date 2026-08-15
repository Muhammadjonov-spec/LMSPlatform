#!/usr/bin/env node

/**
 * Master E2E Test Runner for EduStack LMS Platform
 * Executes Tiers 1-4 automated opaque-box test suites and generates structured summary reports.
 */

import { buildTier1Suite } from './tier1_feature_coverage.test.js';
import { buildTier2Suite } from './tier2_boundary_corner.test.js';
import { buildTier3Suite } from './tier3_cross_feature.test.js';
import { buildTier4Suite } from './tier4_real_world.test.js';

// Terminal color formatting helpers
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

async function runAllSuites() {
  console.log('\n' + '='.repeat(80));
  console.log(`${colors.bright}${colors.cyan}   EDUSTACK LMS PLATFORM — 4-TIER E2E AUTOMATED TEST SUITE${colors.reset}`);
  console.log('='.repeat(80) + '\n');

  const startTime = Date.now();

  const suites = [
    { tier: 'Tier 1', builder: buildTier1Suite, desc: 'Feature Coverage (>=5 tests per feature across 10 modules)' },
    { tier: 'Tier 2', builder: buildTier2Suite, desc: 'Boundary & Corner Cases (Resilience, errors, limits)' },
    { tier: 'Tier 3', builder: buildTier3Suite, desc: 'Cross-Feature Combinations (Pairwise multi-step workflows)' },
    { tier: 'Tier 4', builder: buildTier4Suite, desc: 'Real-World Scenarios (End-to-end persona journeys)' }
  ];

  let grandTotal = 0;
  let grandPassed = 0;
  let grandFailed = 0;
  const tierReports = [];

  for (const item of suites) {
    const suiteInstance = item.builder();
    console.log(`${colors.bright}${colors.blue}▶ Running ${item.tier}: ${suiteInstance.suiteName}${colors.reset}`);
    console.log(`${colors.dim}  ${item.desc}${colors.reset}\n`);

    const result = await suiteInstance.run();
    grandTotal += result.passed + result.failed;
    grandPassed += result.passed;
    grandFailed += result.failed;

    for (const t of result.tests) {
      if (t.status === 'PASS') {
        console.log(`  ${colors.green}✔ [PASS]${colors.reset} ${t.name} ${colors.dim}(${t.duration}ms)${colors.reset}`);
      } else {
        console.log(`  ${colors.red}✖ [FAIL]${colors.reset} ${t.name} ${colors.dim}(${t.duration}ms)${colors.reset}`);
        console.log(`     ${colors.red}Error: ${t.error}${colors.reset}`);
        if (t.stack) {
          console.log(`     ${colors.dim}${t.stack.split('\n').slice(1, 4).join('\n     ')}${colors.reset}`);
        }
      }
    }

    tierReports.push({
      tier: item.tier,
      name: suiteInstance.suiteName,
      passed: result.passed,
      failed: result.failed,
      total: result.passed + result.failed,
      durationMs: result.durationMs
    });

    console.log(`\n  ${colors.bright}Result:${colors.reset} ${colors.green}${result.passed} passed${colors.reset}, ${result.failed > 0 ? colors.red : colors.dim}${result.failed} failed${colors.reset} (${result.durationMs}ms)\n`);
    console.log('-'.repeat(80) + '\n');
  }

  const totalDuration = Date.now() - startTime;

  // Final Summary Report
  console.log('='.repeat(80));
  console.log(`${colors.bright}${colors.cyan}                      TEST SUITE EXECUTION SUMMARY                      ${colors.reset}`);
  console.log('='.repeat(80));
  console.log(`\n ${'Tier & Name'.padEnd(50)} | ${'Passed'.padEnd(8)} | ${'Failed'.padEnd(8)} | ${'Time'.padEnd(8)}`);
  console.log('-'.repeat(80));

  for (const r of tierReports) {
    const statusColor = r.failed === 0 ? colors.green : colors.red;
    const tierLabel = `${r.tier}: ${r.name.slice(0, 40)}`.padEnd(50);
    const passedLabel = `${statusColor}${String(r.passed).padEnd(8)}${colors.reset}`;
    const failedLabel = `${r.failed > 0 ? colors.red : colors.dim}${String(r.failed).padEnd(8)}${colors.reset}`;
    const timeLabel = `${r.durationMs}ms`.padEnd(8);
    console.log(` ${tierLabel} | ${passedLabel} | ${failedLabel} | ${timeLabel}`);
  }

  console.log('-'.repeat(80));
  console.log(` ${colors.bright}${'TOTAL SUITE METRICS'.padEnd(50)}${colors.reset} | ${colors.green}${String(grandPassed).padEnd(8)}${colors.reset} | ${grandFailed > 0 ? colors.red : colors.green}${String(grandFailed).padEnd(8)}${colors.reset} | ${totalDuration}ms`);
  console.log('='.repeat(80) + '\n');

  if (grandFailed === 0) {
    console.log(`${colors.green}${colors.bright}🎉 ALL ${grandTotal} TESTS PASSED PERFECTLY! 100% SUCCESS RATE ACROSS ALL 4 TIERS.${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.red}${colors.bright}❌ ${grandFailed} OF ${grandTotal} TESTS FAILED.${colors.reset}\n`);
    process.exit(1);
  }
}

runAllSuites().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
