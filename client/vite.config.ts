import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Asegúrate de tener este plugin

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Si los errores persisten, puedes añadir esto:
  css: {
    transformer: 'postcss', 
  }
})