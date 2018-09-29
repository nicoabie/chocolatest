import { runInNewContext } from "vm-browserify";
import { generateContext } from "./context";
import { generateRunner } from "./test-composer";
import { LogEntry, Reporter } from "./types";

const generateEvaluatorWithReporter = (reporter: Reporter) => {
  return ({ 
    getTestResults: (src: string, tests: string) => {
      const summary = runInNewContext<LogEntry[]>(
        generateRunner(src, tests),
        generateContext()
      );
      return reporter.generateReport(summary);
    }
  });
}

export {
  generateEvaluatorWithReporter
}
