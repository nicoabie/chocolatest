# matecocido

A simple and tiny test framework that evaluates javascript in the browser

```bash
npm i -S matecocido
```

## Usage

```javascript
import { generateEvaluatorWithReporter, Reporter } from 'matecocido';

const evaluator = generateEvaluatorWithReporter(new Reporter());

const src = `
//define the function below
const isPrime = (from) => {
  return from === 2;
};
`;

const tests = `
test('returns true for prime numbers', () => {
  assert(isPrime(2));
  assert(isPrime(3));
  assert(isPrime(5));
  assert(isPrime(7));
  assert(isPrime(23));
  assert(isPrime(24), 'must fail, 24 not prime');
});
`;

const report = evaluator.getTestResults(src, tests);
```

### Report object has the following interface

```typescript
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

interface AssertionEntry {
  id: number;
  test: number;
  expected: any;
  actual: any;
  message: string;
}
```

From here you can format the report the way you like and show it to the user.
