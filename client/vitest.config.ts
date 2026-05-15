/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Config dedicada de Vitest. Vitest la usa con prioridad sobre vite.config.ts.
// Mantenemos esta config separada (sin Tailwind ni el resto) para tests más
// rápidos y aislados.
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
});
