const esbuild = require('esbuild');
const package = require('../package.json');

esbuild.build({
  entryPoints: ['src/AppInsightsLite.ts'],
  bundle: true,
  format: 'esm',
  outfile: 'dist/appinsights-lite.js',
  target: [
    'chrome55',
    'firefox52',
    'safari11',
    'edge15'
  ],
  banner: {
    js: `// ${package.name} v${package.version} - ${package.repository}\n`
  },
}).catch(() => process.exit(1));
