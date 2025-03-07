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
    host: '0.0.0.0', // ✅ Tashqi foydalanuvchilar ham kira oladi
    port: 5000, // ✅ 5000-portda ishga tushirish
    strictPort: true, // ✅ Agar 5000-port band bo‘lsa, boshqa portga o‘tmaydi
    open: false, // ❌ Brauzerni avtomatik ochish yo‘q
    cors: true, // ✅ Cross-Origin Requests (CORS) yoqilgan
  },
  preview: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
  }
})
