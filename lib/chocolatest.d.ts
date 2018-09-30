declare module "chocolatest" {
  type LogEntry = SuiteBeginEntry | SuiteEndEntry | AssertionEntry;

  interface SuiteBeginEntry {
    type: 'test';
    name: string;
    id: number;
  }

  interface SuiteEndEntry {
    type: 'end';
    test: number;
  }

  interface Assertion {
    ok: boolean;
    operator: string;
    args: any[];
    type: 'assert';
  }

  interface AssertionEntry extends Assertion {
    id: number;
    test: number;
    expected: any;
    actual: any;
    message: string;
  }

  interface IReporter {
    generateReport: (logs: LogEntry[]) => Report;
  }

  interface Report {
    testsCount: number;
    testsPassed: number;
    testsFailed: number;
    testsFailedDetails: {
      id: number;
      name: string;
      failures: AssertionEntry[];
    }[];
    assertsCount: number;
    assertsPassed: number;
    assertsFailed: AssertionEntry[];
  }

  export class Reporter implements IReporter {
    generateReport(logs: LogEntry[]): Report;
  }

  export function generateEvaluator(reporter: Reporter): {
    run(src: string, tests: string): Report
  }
}
