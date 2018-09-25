declare module "vm-browserify" {
  export function runInNewContext<T>(script: string, context: {[index: string]: any}): T;
}

declare module "assert" {
  export class AssertionError implements Error {
    name:string;
    message:string;
    actual:any;
    expected:any;
    operator:string;
    generatedMessage:boolean;

    constructor(options?:{message?: string; actual?: any; expected?: any; operator?: string; stackStartFunction?: Function});
}

interface Assert {
    
    (value:any, message?:string):void;
    
    fail(actual?:any, expected?:any, message?:string, operator?:string):void;
    
    ok(value:any, message?:string):void;
    
    equal(actual:any, expected:any, message?:string):void;
    
    notEqual(actual:any, expected:any, message?:string):void;
    
    deepEqual(actual:any, expected:any, message?:string):void;
    
    notDeepEqual(acutal:any, expected:any, message?:string):void;
    
    strictEqual(actual:any, expected:any, message?:string):void;
    
    notStrictEqual(actual:any, expected:any, message?:string):void;
    
    throws:{
        (block:Function, message?:string): void;
        (block:Function, error:Function, message?:string): void;
        (block:Function, error:RegExp, message?:string): void;
        (block:Function, error:(err:any) => boolean, message?:string): void;
    };
    
    doesNotThrow:{
        (block:Function, message?:string): void;
        (block:Function, error:Function, message?:string): void;
        (block:Function, error:RegExp, message?:string): void;
        (block:Function, error:(err:any) => boolean, message?:string): void;
    };
    
    ifError(value:any):void;

    // Add index signature to enable calling inner methods such as assert['fail']
    [propName: string]: (...args: any[]) => void;
}

  export var assert: Assert;
}