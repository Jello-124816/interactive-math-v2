
import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: '/interactive-math-v2/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        free: resolve(import.meta.dirname, 'free.html'),
        premium: resolve(import.meta.dirname, 'premium.html'),
        account: resolve(import.meta.dirname, 'account.html'),
        linear: resolve(import.meta.dirname, 'linear.html'),
        pythagorean: resolve(import.meta.dirname, 'pythagorean.html'),
        satPractice: resolve(import.meta.dirname, 'sat-practice.html')
      }
    }
  }
});
