# Chocolatest

A simple and tiny test framework that evaluates synchronous javascript (for now) in the browser

```bash
npm i -S chocolatest
```

## Usage

```javascript
import { generateEvaluator, Reporter } from 'chocolatest';

const evaluator = generateEvaluator(new Reporter());

const src = `
  //define the function below
  const isPrime = (n) => {
    return n === 2;
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

const report = evaluator.run(src, tests);
```

### Outputs (rendering the Report object to HTML)

<html>
  <div>
    <div style="color: black;">Ran 6 assertions in 1 tests</div>
    <div style="color: green;">Asserts passed 1</div>
    <div style="color: red;">Asserts failed 5</div>
    <div style="color: green;">Tests passed 0</div>
    <div style="color: red;">Tests failed 1</div>
    <ul style="color: red;"><li>
        returns true for prime numbers
        <ul>
          <li>
            Expected: true
            Actual: false
          </li>
          <li>
            Expected: true
            Actual: false
          </li>
          <li>
            Expected: true
            Actual: false
          </li>
          <li>
            Expected: true
            Actual: false
          </li>
          <li>
            Expected: true
            Actual: false
            Message: must fail, 24 not prime
          </li>
        </ul>
      </li>
    </ul>
  </div>
</html>

## API

The assertion api is best described in one of the two dependencies chocolatest uses.\
[Browserify's commonjs-assert module](https://github.com/browserify/commonjs-assert)

And the method to group assertions is ```test(name: string, body: () => void)```\
as you have already seen in the example. Note that you can have more than one call to\
test for every run.

### Report object

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

## License

MIT © [Nico Gallinal](https://github.com/nicoabie)
