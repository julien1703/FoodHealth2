import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/FoodHealth2/',  // Setze dies auf den Namen deines Repos
})
