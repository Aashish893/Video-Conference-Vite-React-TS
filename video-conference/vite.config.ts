import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTest.ts",
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    e2e: {
      setupNodeEvents(on) {
        on('file:preprocessor', vitePreprocessor())
      },
    },
  },
  server: {
    host: true,
    port: 3000,
  },
})
