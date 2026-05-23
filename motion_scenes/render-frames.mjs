import { makeProject } from '@motion-canvas/core';
import { Renderer } from '@motion-canvas/core/lib/app/Renderer.js';
import { ImageExporter } from '@motion-canvas/core/lib/app/ImageExporter.js';
import meta from './src/project.js';

async function renderAll() {
  console.log('Creating project...');
  const project = makeProject(meta as any);

  const renderer = new Renderer(project);

  const settings = {
    name: 'SolanaWarung-Promo',
    range: [0, Infinity],
    fps: 30,
    exporter: {
      name: ImageExporter.id,
      options: {
        fileType: 'image/png',
        quality: 1,
        groupByScene: true,
      },
    },
    // resolution from the editor default
    size: { x: 1920, y: 1080 },
    resolutionScale: 1,
    colorSpace: 'srgb',
  };

  console.log('Starting render (this may take a minute)...');
  await renderer.render(settings as any);
  console.log('Render finished! Frames are in dist/');
}

renderAll().catch((e) => {
  console.error('Render failed:', e);
  process.exit(1);
});
