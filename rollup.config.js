import typescript from '@rollup/plugin-typescript';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import scss from 'rollup-plugin-scss'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import path from "path";

const isProd = (process.env.BUILD === 'production');

const banner = 
`/*
Obsidian Vocabulary Cards

An easy way to display vocabulary words as flashcards and as a list.
https://github.com/meniam/obsidian-vocabulary-cards

*/
`;

export default {
  input: './src/main.ts',
  output: {
    dir: '.',
    sourcemap: 'none',
    sourcemapExcludeSources: isProd,
    format: 'cjs',
    exports: 'default',
    banner,
  },
  external: ['obsidian'],
  plugins: [
      scss({
          output: "styles.css",
          sourceMap: false,
          sass: require('node-sass'),
          includePaths: [
              path.join(__dirname, '../../node_modules/'),
              'node_modules/'
          ],
          processor: () => postcss([autoprefixer()]),
      }),
    typescript(),
    nodeResolve({browser: true}),
    commonjs()
  ]
};
