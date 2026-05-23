// render-promo.mjs
// Jalur B: CLI Render (bypass editor HMR bug)
// Produces image sequence + ready ffmpeg command for MP4

import { makeProject } from '@motion-canvas/core';
import { Renderer } from '@motion-canvas/core/lib/app/Renderer.js';
import { ImageExporter } from '@motion-canvas/core/lib/app/ImageExporter.js';
import { Logger } from '@motion-canvas/core/lib/app/Logger.js';
import projectMeta from './src/project.js';

async function main() {
  console.log('🚀 Building project...');
  // Note: user should run `npm run build` first for best results, but we can also load src directly in some cases

  const project = makeProject(projectMeta);

  const renderer = new Renderer(project);

  const settings = {
    name: 'SolanaWarung-Promo',
    range: [0, Infinity],
    fps: 30,
    size: { x: 1920, y: 1080 },
    resolutionScale: 1,
    colorSpace: 'srgb',

    exporter: {
      name: ImageExporter.id,
      options: {
        fileType: 'image/png',
        quality: 1,
        groupByScene: false,
      },
    },
  };

  console.log('🎥 Starting headless render (this will take 1-3 minutes)...');
  console.log('   Output will be in: dist/SolanaWarung-Promo/');

  try {
    await renderer.render(settings);
    console.log('\n✅ Render complete!');
    console.log('\nNext step: Encode to MP4 with this command:');
    console.log('ffmpeg -y -framerate 30 -i "dist/SolanaWarung-Promo/%06d.png" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p "dist/SolanaWarung-Promo.mp4"');
  } catch (err) {
    console.error('❌ Render failed:', err);
    console.log('\nTip: Run `npm run build` first, then try again.');
  }
}

main().catch(console.error);
