const external = [ 'assert', 'vm-browserify' ]

export default [{
  input: 'lib/es5/index.js',
  output: {
    name: 'matecocido',
    file: 'lib/matecocido.js',
    format: 'cjs'
  },
  context: 'window',
  external,
  onwarn(warning, warn) {
    // vm-browserify uses eval in a sandboxed iframe
    // rollup has no way to know.
    if (warning.code === 'EVAL') return;
    warn(warning);
  }
},{
  input: 'lib/es6/index.js',
  output: {
    file: 'lib/matecocido.esm.js',
    format: 'esm'
  },
  external
}];
