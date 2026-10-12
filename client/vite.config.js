import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In dev, /api requests are proxied to the Express server, so there are no CORS headaches locally.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:5001",
    },
  },
});
