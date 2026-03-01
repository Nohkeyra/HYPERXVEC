import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.STABILITY_API_KEY': JSON.stringify(env.STABILITY_API_KEY),
      'process.env.OPENAI_API_KEY': JSON.stringify(env.OPENAI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      allowedHosts: true,
    },
    build: {
      minify: "esbuild",
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom"],
            vendor: ["lucide-react", "motion"]
          }
        }
      }
    }
  };
});
