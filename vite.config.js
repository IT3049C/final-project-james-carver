import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        wordle: resolve(__dirname, 'wordle.html'),
        rockpapercissors: resolve(__dirname, 'rps.html'),
        tictactoe: resolve(__dirname, 'tictactoe.html')
      },
    },
  },
});
