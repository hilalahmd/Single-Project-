import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

try {
  const chubbySrc = 'C:/Users/hilal/.gemini/antigravity-ide/brain/bc6ccd36-a41b-4ade-9435-d2d0a15068a3/athlete_chubby_dark_1785386243373.png'
  const fitSrc = 'C:/Users/hilal/.gemini/antigravity-ide/brain/bc6ccd36-a41b-4ade-9435-d2d0a15068a3/athlete_fit_dark_1785386268788.png'
  const destDir = path.resolve(__dirname, 'public/images')
  if (fs.existsSync(chubbySrc)) fs.copyFileSync(chubbySrc, path.join(destDir, 'athlete-chubby.png'))
  if (fs.existsSync(fitSrc)) fs.copyFileSync(fitSrc, path.join(destDir, 'athlete-fit.png'))
  console.log('Successfully updated dark background transformation images in public/images/')
} catch (e) {
  console.error('Error copying transformation images:', e)
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      strict: false,
    },
  },
})
