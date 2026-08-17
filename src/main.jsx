import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.jsx'

// 排除自己的访问：
// 在自己浏览器打开一次 https://www.huiyangcreates.com/?disable-analytics
// 之后这个浏览器的访问就不再计入 Vercel 分析。想恢复用 ?enable-analytics
const params = new URLSearchParams(window.location.search)
if (params.has('disable-analytics')) localStorage.setItem('va-disable', '1')
if (params.has('enable-analytics')) localStorage.removeItem('va-disable')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Analytics beforeSend={(event) => (localStorage.getItem('va-disable') ? null : event)} />
  </StrictMode>,
)
