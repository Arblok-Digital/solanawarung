import {defineConfig} from 'vite';
import {createRequire} from 'module';

const require = createRequire(import.meta.url);
const {default: motionCanvas} = require('@motion-canvas/vite-plugin');

export default defineConfig({
  plugins: [
    ...motionCanvas({
      project: './src/project.ts',
    }),
    {
      name: 'motion-ui-override',
      enforce: 'pre',
      transformIndexHtml(html) {
        return html.replace(
          '</head>',
          '    <link rel="stylesheet" href="/override.css" />\n  </head>'
        );
      }
    }
  ],
});