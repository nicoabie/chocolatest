'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var assert = require('assert');
var vmBrowserify = require('vm-browserify');

var groupBy = function (xs, fn) {
    return xs.reduce(function (rv, x) {
        (rv[fn(x)] = rv[fn(x)] || []).push(x);
        return rv;
    }, {});
};
var Reporter = /** @class */ (function () {
    function Reporter() {
    }
    Reporter.prototype.generateReport = function (logs) {
        var asserts = logs.filter(function (d) { return d.type === 'assert'; });
        var assertsPassed = asserts.filter(function (a) { return a.ok; }).length;
        var assertsFailed = asserts.filter(function (a) { return !a.ok; });
        var assertsGroupedByTest = groupBy(asserts, function (assert$$1) { return assert$$1.test; });
        var tests = logs.filter(function (d) { return d.type === 'test'; });
        var testsSummary = Object.values(assertsGroupedByTest)
            .map(function (asserts) { return ({ test: asserts[0].test, ok: asserts.every((function (a) { return a.ok; })) }); });
        var testsPassed = testsSummary.filter(function (t) { return t.ok; }).length;
        var testsFailedDetails = testsSummary
            .filter(function (t) { return !t.ok; })
            .map(function (t) { return ({
            id: t.test,
            // it cannot be undefined 
            name: tests.find(function (x) { return x.id === t.test; }).name,
            failures: assertsFailed.filter(function (a) { return a.test === t.test; })
        }); });
        return {
            assertsCount: asserts.length,
            testsCount: tests.length,
            testsPassed: testsPassed,
            testsFailed: tests.length - testsPassed,
            assertsPassed: assertsPassed,
            assertsFailed: assertsFailed,
            testsFailedDetails: testsFailedDetails
        };
    };
    return Reporter;
}());

var applyWrapper = function (operator, method, thisArg, args, log) {
    try {
        var result = method.apply(thisArg, args);
        log({ 'ok': true, 'operator': operator, 'args': args, 'type': 'assert' });
        return result;
    }
    catch (e) {
        log({ 'ok': false, 'operator': operator, 'args': args, 'type': 'assert' });
        // we don't want to fast fail, we want to run all asserts in test
        // throw e; 
    }
};
var generateProxy = function (log) {
    return new Proxy(assert, {
        apply: function (target, thisArg, args) {
            return applyWrapper('assert', target, thisArg, args, log);
        },
        get: function (target, propKey) {
            var origMethod = target[propKey];
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return applyWrapper(propKey, origMethod, target, args, log);
            };
        }
    });
};

var __assign = (window && window.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var expandArgs = function (assertion) {
    var assertionEntry = assertion;
    var args = assertion.args;
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
var generateContext = function () {
    var testId = 0;
    var assertId = 0;
    var logs = [];
    var test = function (title, cb) {
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
    var log = function (assertion) {
        var assertionEntry = expandArgs(assertion);
        logs.push(__assign({}, assertionEntry, { id: assertId++, test: testId }));
    };
    var assert$$1 = generateProxy(log);
    return {
        test: test,
        assert: assert$$1,
        logs: logs
    };
};

var generateRunner = function (fn, tests) {
    return "\n    const run = () => { \n      " + fn + "\n      \n      " + tests + "\n    };\n\n    run();\n    //last line is returned by the vm\n    logs;\n  ";
};

var generateEvaluator = function (reporter) {
    return ({
        run: function (src, tests) {
            var summary = vmBrowserify.runInNewContext(generateRunner(src, tests), generateContext());
            return reporter.generateReport(summary);
        }
    });
};

exports.Reporter = Reporter;
exports.generateEvaluator = generateEvaluator;
