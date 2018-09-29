import { generateProxy } from './proxied-assert';
import { LogEntry, Assertion, AssertionEntry } from './types';

const expandArgs = (assertion: Assertion): AssertionEntry => {
  let assertionEntry = assertion as AssertionEntry;
  const args = assertion.args;
  if (assertion.operator === 'assert') {
    assertionEntry.expected = true;
    if (assertion.ok) {
      assertionEntry.actual = true;
    } else {
      assertionEntry.actual = false;
    }
    if (assertion.args.length === 2) {
      assertionEntry.message = args[1];
    }
  } else {
    assertionEntry.actual = args[0] || 'undefined';
    assertionEntry.expected = args[1];
    assertionEntry.message = args[2];
  }

  delete assertionEntry.args;
  
  return assertionEntry;
}

const generateContext = () => {
  let testId = 0;
  let assertId = 0;

  const logs: LogEntry[] = [];

  const test = (title: string, cb: () => void) => {
    logs.push({'type':'test','name':title,'id':testId})      
    assertId = 0;
    try{
      cb();
    } catch(e) {
      void(0);  
    }
    logs.push({'type':'end','test':testId});
    testId++;
  }

  const log = (assertion: Assertion) => {
    const assertionEntry = expandArgs(assertion);
    logs.push({...assertionEntry, id: assertId++, test: testId});
  }

  const assert = generateProxy(log); 

  return {
    test,
    assert,
    logs
  }
}

export {
  generateContext
}
