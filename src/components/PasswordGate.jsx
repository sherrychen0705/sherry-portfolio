import { useState } from 'react'
import NavBar from './NavBar'

// 项目密码门。包在页面外层，输对密码才显示内容。
//
// ⚠️ 这是「前端密码」，挡的是随手点进来的人，不是真的安全措施：
// 密码写在前端代码里，懂行的人在浏览器里翻一下就能看到。
// 真要防住有心人，得用服务端方案（比如 Vercel 的 Password Protection）。
// 客户的保密资料不要只靠这一层。
const PASSWORD = 'huiyang2026' // ← 改密码就改这一行
const KEY = 'unlocked-projects-v1'

// 一次输对，三个项目页都通。存 sessionStorage：关掉浏览器就失效，
// 比 localStorage 稳妥一点（换成 localStorage 就能长期记住）。
const isUnlocked = () => {
  try {
    return sessionStorage.getItem(KEY) === 'yes'
  } catch {
    return false
  }
}

export default function PasswordGate({ title, children }) {
  const [ok, setOk] = useState(isUnlocked)
  const [value, setValue] = useState('')
  const [wrong, setWrong] = useState(false)

  if (ok) return children

  const submit = (e) => {
    e.preventDefault()
    if (value.trim() !== PASSWORD) {
      setWrong(true)
      return
    }
    try {
      sessionStorage.setItem(KEY, 'yes')
    } catch {
      /* 无痕模式下存不了，至少本次能看 */
    }
    setOk(true)
  }

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-6">
        <form onSubmit={submit} className="w-full max-w-[380px] text-left">
          <p className="text-[13px] uppercase tracking-[0.18em] text-neutral-400">
            Protected project
          </p>
          <h1 className="mt-3 text-[28px] font-bold leading-tight text-black">{title}</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-neutral-500">
            This case study is password protected. Enter the password to continue, or reach out and
            I&rsquo;ll share it with you.
          </p>

          <input
            type="password"
            autoFocus
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setWrong(false)
            }}
            placeholder="Password"
            aria-label="Password"
            className={`mt-6 w-full rounded-[3px] border bg-white px-3 py-2.5 text-[15px] text-black outline-none transition-colors placeholder:text-neutral-400 focus:border-[#5db83c] ${
              wrong ? 'border-red-400' : 'border-neutral-300'
            }`}
          />
          {wrong && <p className="mt-2 text-[13px] text-red-500">Incorrect password — try again.</p>}

          <button
            type="submit"
            className="mt-4 w-full rounded-[3px] bg-black py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-[#5db83c] hover:text-black"
          >
            View project
          </button>
        </form>
      </div>
    </div>
  )
}
