import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import ts from '@rollup/plugin-typescript';
// import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import analyze from 'rollup-plugin-analyzer';

export default [
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist',
      format: 'cjs'
    },
    external: ['path', 'fs'],
    plugins: [
      peerDepsExternal(),
      ts({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: './dist'
      }),
      /* terser({
        ecma: 2018,
        mangle: { toplevel: true },
        compress: {
          module: true,
          toplevel: true,
          unsafe_arrows: true
        },
        output: { quote_style: 1 }
      }), */
      commonjs(),
      analyze()
    ]
  }
];
