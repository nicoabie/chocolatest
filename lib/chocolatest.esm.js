import * as assert from 'assert';
import { runInNewContext } from 'vm-browserify';

const groupBy = function (xs, fn) {
    return xs.reduce(function (rv, x) {
        (rv[fn(x)] = rv[fn(x)] || []).push(x);
        return rv;
    }, {});
};
class Reporter {
    generateReport(logs) {
        const asserts = logs.filter((d) => d.type === 'assert');
        const assertsPassed = asserts.filter((a) => a.ok).length;
        const assertsFailed = asserts.filter((a) => !a.ok);
        const assertsGroupedByTest = groupBy(asserts, assert$$1 => assert$$1.test);
        const tests = logs.filter((d) => d.type === 'test');
        const testsSummary = Object.values(assertsGroupedByTest)
            .map((asserts) => ({ test: asserts[0].test, ok: asserts.every((a => a.ok)) }));
        const testsPassed = testsSummary.filter((t) => t.ok).length;
        const testsFailedDetails = testsSummary
            .filter((t) => !t.ok)
            .map((t) => ({
            id: t.test,
            // it cannot be undefined 
            name: tests.find((x) => x.id === t.test).name,
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
        };
    }
}

const applyWrapper = (operator, method, thisArg, args, log) => {
    try {
        let result = method.apply(thisArg, args);
        log({ 'ok': true, 'operator': operator, 'args': args, 'type': 'assert' });
        return result;
    }
    catch (e) {
        log({ 'ok': false, 'operator': operator, 'args': args, 'type': 'assert' });
        // we don't want to fast fail, we want to run all asserts in test
        // throw e; 
    }
};
const generateProxy = (log) => {
    return new Proxy(assert, {
        apply(target, thisArg, args) {
            return applyWrapper('assert', target, thisArg, args, log);
        },
        get(target, propKey) {
            const origMethod = target[propKey];
            return function (...args) {
                return applyWrapper(propKey, origMethod, target, args, log);
            };
        }
    });
};

const expandArgs = (assertion) => {
    let assertionEntry = assertion;
    const args = assertion.args;
    if (assertion.operator === 'assert') {
        assertionEntry.expected = true;
        if (assertion.ok) {
            assertionEntry.actual = true;
        }
        else {
            assertionEntry.actual = false;
        }
        if (assertion.args.length === 2) {
            assertionEntry.message = args[1];
        }
    }
    else {
        assertionEntry.actual = args[0] || 'undefined';
        assertionEntry.expected = args[1];
        assertionEntry.message = args[2];
    }
    delete assertionEntry.args;
    return assertionEntry;
};
const generateContext = () => {
    let testId = 0;
    let assertId = 0;
    const logs = [];
    const test = (title, cb) => {
        logs.push({ 'type': 'test', 'name': title, 'id': testId });
        assertId = 0;
        try {
            cb();
        }
        catch (e) {
        }
        logs.push({ 'type': 'end', 'test': testId });
        testId++;
    };
    const log = (assertion) => {
        const assertionEntry = expandArgs(assertion);
        logs.push(Object.assign({}, assertionEntry, { id: assertId++, test: testId }));
    };
    const assert$$1 = generateProxy(log);
    return {
        test,
        assert: assert$$1,
        logs
    };
};

const generateRunner = (fn, tests) => {
    return `
    const run = () => { 
      ${fn}
      
      ${tests}
    };

    run();
    //last line is returned by the vm
    logs;
  `;
};

const generateEvaluator = (reporter) => {
    return ({
        run: (src, tests) => {
            const summary = runInNewContext(generateRunner(src, tests), generateContext());
            return reporter.generateReport(summary);
        }
    });
};

export { Reporter, generateEvaluator };
