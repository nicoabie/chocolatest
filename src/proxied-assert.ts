import { Assertion } from './types';
import * as assert from 'assert';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

const applyWrapper = (operator: string, method: (...args: any[]) => any, thisArg: any, args: any[], log: (assertion: Assertion) => void) => {
  try {
    let result = method.apply(thisArg, args);
    log({'ok': true, 'operator': operator, 'args': args, 'type': 'assert'});
    return result;
  } catch (e) {
    log({'ok': false, 'operator': operator, 'args': args, 'type': 'assert'});
    // we don't want to fast fail, we want to run all asserts in test
    // throw e; 
  }
}

const generateProxy = (log: (assertion: Assertion) => void) => {
  return new Proxy(assert,
  {
    apply(target, thisArg, args) {
      return applyWrapper('assert', target, thisArg, args, log);
    },
    get(target, propKey: keyof Omit<typeof assert, 'AssertionError'>) {
      const origMethod = target[propKey];
      return function (...args: any[]) {
        return applyWrapper(propKey, origMethod, target, args, log);
      };
    }
  });
}

export {
  generateProxy
} 
