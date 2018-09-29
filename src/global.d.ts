declare module "vm-browserify" {
  export function runInNewContext<T>(script: string, context: {[index: string]: any}): T;
}
