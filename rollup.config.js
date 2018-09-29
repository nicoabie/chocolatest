import resolve from 'rollup-plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs';

const external = [ 'assert', 'vm-browserify' ]

export default [{
  input: 'dist/es5/index.js',
  output: {
    name: 'matecocido',
    file: 'dist/matecocido.js',
    format: 'cjs'
  },
  context: 'window',
  external,
  plugins: [
    resolve({
      preferBuiltins: false,
      browser: true
    }),
    commonJS({
      // include: 'node_modules/**',
      namedExports: {
        'assert': [ '*' ],
        'vm-browserify': ['runInNewContext']
      }
    })
  ],
  onwarn(warning, warn) {
    // vm-browserify uses eval in a sandboxed iframe
    // rollup has no way to know.
    if (warning.code === 'EVAL') return;
    warn(warning);
  }
},{
  input: 'dist/es6/index.js',
  output: {
    file: 'dist/matecocido.esm.js',
    format: 'esm'
  },
  external
}];
