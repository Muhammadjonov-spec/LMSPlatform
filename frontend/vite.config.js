import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
// PWA o'chirildi — service worker saytni sekinlatmoqda edi
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
});
