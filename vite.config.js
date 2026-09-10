import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

// 开发模式专用：画廊编辑器点「保存」时，除了写浏览器 localStorage，
// 还 POST 一份到这里，落成项目根目录的 gallery-edits.json。
// 这样 Claude 直接读这个文件就能看到你在页面上改的项目名 / 小字 / 高度，
// 不用再手动复制粘贴。只在 npm run dev 生效，打包上线不受影响。
function galleryStore() {
  const file = path.resolve(process.cwd(), 'gallery-edits.json')
  return {
    name: 'gallery-store',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__gallery-save', (req, res, next) => {
        if (req.method !== 'POST') return next()
        let body = ''
        req.on('data', (c) => (body += c))
        req.on('end', () => {
          try {
            const data = JSON.parse(body)
            fs.writeFileSync(
              file,
              JSON.stringify({ savedAt: new Date().toISOString(), items: data }, null, 2),
            )
            res.statusCode = 200
            res.end('ok')
          } catch (e) {
            res.statusCode = 400
            res.end(String(e))
          }
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), galleryStore()],
  // 上面那个 json 是编辑器的产物，不该触发页面热重载
  server: { watch: { ignored: ['**/gallery-edits.json'] } },
})
