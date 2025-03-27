import esbuild from 'esbuild';
import process from 'process';
import builtins from 'builtin-modules';
import fs from 'fs';
import path from 'path';

const banner = ``;

const prod = process.argv[2] === 'production';

const distDir = 'dist';
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const copyManifest = () => {
  fs.copyFileSync('manifest.json', path.join(distDir, 'manifest.json'));
  console.log('Copied manifest.json to dist folder');

  // Copy styles.css if it exists
  if (fs.existsSync('styles.css')) {
    fs.copyFileSync('styles.css', path.join(distDir, 'styles.css'));
    console.log('Copied styles.css to dist folder');
  }
};

const context = await esbuild.context({
  banner: {
    js: banner,
  },
  entryPoints: ['src/index.ts'],
  bundle: true,
  external: [
    'obsidian',
    'electron',
    '@codemirror/autocomplete',
    '@codemirror/collab',
    '@codemirror/commands',
    '@codemirror/language',
    '@codemirror/lint',
    '@codemirror/search',
    '@codemirror/state',
    '@codemirror/view',
    '@lezer/common',
    '@lezer/highlight',
    '@lezer/lr',
    ...builtins,
  ],
  format: 'cjs',
  target: 'es2018',
  logLevel: 'info',
  sourcemap: prod ? false : 'inline',
  treeShaking: true,
  outfile: path.join(distDir, 'main.js'),
});

if (prod) {
  await context.rebuild();
  copyManifest();
  process.exit(0);
} else {
  fs.watch('manifest.json', () => copyManifest());
  if (fs.existsSync('styles.css')) {
    fs.watch('styles.css', () => copyManifest());
  }
  await context.watch();
}
