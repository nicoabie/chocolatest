import * as vm from "vm-browserify";
import * as context from "./context";
import { generateRunner } from "./test-composer";
import { LogEntry, Reporter } from "./types";

const generateEvaluatorWithReporter = (reporter: Reporter) => {
  return ({ 
    getTestResults: (src: string, tests: string) => {
      const summary = vm.runInNewContext<LogEntry[]>(
        generateRunner(src, tests),
        context.generate()
      );
      return reporter.generateTestsResults(summary);
    }
  });
}

export {
  generateEvaluatorWithReporter
}
