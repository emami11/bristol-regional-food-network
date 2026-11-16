import { build } from 'esbuild';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
await build({ entryPoints: [path.join(root, 'src/demo/simulation.js')], outdir: path.join(root, 'public/operational-assets'),
  bundle: true, minify: false, sourcemap: false, loader: { '.woff': 'file', '.woff2': 'file', '.ttf': 'file', '.eot': 'file', '.svg': 'file' } });
console.log('Built the local BPMN token simulator.');
