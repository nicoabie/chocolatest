export type LogEntry = SuiteBeginEntry | SuiteEndEntry | AssertionEntry;

export interface SuiteBeginEntry {
  type: 'test';
  name: string;
  id: number;
}

export interface SuiteEndEntry {
  type: 'end';
  test: number;
}

export interface Assertion {
  ok: boolean;
  operator: string;
  args: any[];
  type: 'assert';
}

export interface AssertionEntry extends Assertion {
  id: number;
  test: number;
  expected: any;
  actual: any;
  message: string;
}

export interface Reporter {
  generateReport: (logs: LogEntry[]) => Report;
}

export interface Report {
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
