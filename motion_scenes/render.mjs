import { render } from '@motion-canvas/core';
import { makeProject } from './src/project';

async function renderVideo() {
  const project = makeProject({
    scenes: [
      // scenes will be imported from project file
    ]
  });

  // Render the project
  await render(project, {
    output: './dist/output.mp4',
    format: 'mp4',
    quality: 100,
    width: 1920,
    height: 1080,
    fps: 30,
  });
}

renderVideo().catch(console.error);