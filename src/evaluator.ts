import { runInNewContext } from "vm-browserify";
import { generateContext } from "./context";
import { generateRunner } from "./test-composer";
import { LogEntry, Reporter } from "./types";

const generateEvaluator = (reporter: Reporter) => {
  return ({ 
    run: (src: string, tests: string) => {
      const summary = runInNewContext<LogEntry[]>(
        generateRunner(src, tests),
        generateContext()
      );
      return reporter.generateReport(summary);
    }
  });
}

export {
  generateEvaluator
}
