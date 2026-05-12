// src/test/setup.ts
// Configuración global que se ejecuta antes de cada test.

import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Limpia el DOM y el localStorage entre tests para que no se contaminen.
afterEach(() => {
  cleanup();
  localStorage.clear();
});
