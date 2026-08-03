import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// The extension ships everything in public/ (manifest, background, content
// script, DevTools + panel HTML/CSS, icons) copied verbatim to dist/. Vite only
// bundles the React side panel (index.html -> src/main.jsx). The DevTools
// helper scripts live in src/ and are copied as-is since they have no imports.
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: 'src/devtools.js', dest: '' },
        { src: 'src/panel.js', dest: '' },
      ],
    }),
  ],
  build: {
    rollupOptions: {
      input: { sidepanel: 'index.html' },
    },
  },
});
