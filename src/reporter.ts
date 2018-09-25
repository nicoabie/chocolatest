import { LogEntry, AssertionEntry, SuiteBeginEntry, Report } from "./types";

const groupBy = function<T, K extends number>(xs: T[], fn: (v: T) => K ): {[key: number]: T[]} {
  return xs.reduce(function(rv: {[index: number]: T[] }, x) {
    (rv[fn(x)] = rv[fn(x)] || []).push(x);
    return rv;
  }, {});
};

const generateTestsResults = (logs: LogEntry[]): Report => {
  
  const asserts = logs.filter((d) => d.type === 'assert') as AssertionEntry[];
  const assertsPassed = asserts.filter((a) => a.ok).length;
  const assertsFailed = asserts.filter((a) => !a.ok);
  const assertsGroupedByTest = groupBy(asserts, assert => assert.test);
  
  const tests = logs.filter((d) => d.type === 'test') as SuiteBeginEntry[];
  const testsSummary = Object.values(assertsGroupedByTest)
  .map((asserts) => ({ test: asserts[0].test, ok: asserts.every((a => a.ok))}));
  
  const testsPassed = testsSummary.filter((t) => t.ok).length
  
  const testsFailedDetails = testsSummary
  .filter((t) => !t.ok)
  .map((t) => ({
    id: t.test,
    // it cannot be undefined 
    name: (tests.find((x)=> x.id === t.test) as SuiteBeginEntry).name,
    failures: assertsFailed.filter((a) => a.test === t.test)
  }));
    
  return {
    assertsCount: asserts.length,
    testsCount: tests.length,
    testsPassed: testsPassed,
    testsFailed: tests.length - testsPassed,
    assertsPassed: assertsPassed,
    assertsFailed: assertsFailed,
    testsFailedDetails: testsFailedDetails
  }
}

export {
  generateTestsResults
}