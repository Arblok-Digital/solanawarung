import { renderProject } from '@motion-canvas/core';
import project from './src/project.ts';

await renderProject(project, {
  format: { name: 'mp4', codec: 'h264' },
  output: './dist/output.mp4',
  console: true,
});