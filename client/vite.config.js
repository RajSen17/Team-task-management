import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true
      }
    }
  },

  preview: {
    allowedHosts: [
      "team-task-manager-client-production-11a9.up.railway.app"
    ]
  }
});