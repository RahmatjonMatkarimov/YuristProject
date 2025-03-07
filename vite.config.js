import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  base: './', // ✅ Statik fayllarni to‘g‘ri yuklash uchun
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    host: '0.0.0.0', // ✅ Barcha IP-larda ochish uchun
    port: 5000, // ✅ 5000-portda ochish
    strictPort: true, // ✅ 5000-port band bo‘lsa, xatolik chiqarish
  },
  preview: {
    host: '0.0.0.0',
    port: 5000, // ✅ `vite preview` ham 5000-portda ochiladi
    strictPort: true,
  }
})
