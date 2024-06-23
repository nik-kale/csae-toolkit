import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: 'src/devtools.js', dest: '' },
        { src: 'src/panel.js', dest: '' },
        { src: 'public/styles.css', dest: '' },
        { src: 'src/devtools.js', dest: '' },
      ]
    })
  ],
  build: {
    rollupOptions: {
      input: {
        popup: 'index.html',
        devtools: 'public/devtools.html',
        panel: 'public/panel.html',
        sidepanel: 'index.html'
      },
      external: ['devtools.js', 'panel.js'] // Externalize these modules
    }
  }
});
