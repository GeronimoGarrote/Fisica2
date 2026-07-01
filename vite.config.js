import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'dev-no-immutable-cache',
      apply: 'serve',
      configureServer(server) {
        server.middlewares.use((_req, res, next) => {
          const origSetHeader = res.setHeader.bind(res)
          res.setHeader = function (name, value) {
            if (name === 'Cache-Control') value = 'no-store'
            return origSetHeader(name, value)
          }
          next()
        })
      },
    },
  ],
})
