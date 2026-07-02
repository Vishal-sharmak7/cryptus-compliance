import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],

  server:{
    allowedHosts:[
      "stride-plunging-emit.ngrok-free.dev"
    ]
  }
})