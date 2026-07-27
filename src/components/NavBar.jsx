import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const ACTIVE_GREEN = '#5db83c'

const NAV_BASE = 'text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500'
const NAV_LINK = `${NAV_BASE} transition-colors duration-200 hover:text-black`

// 实时时钟：按访客本地时区显示时间，不含秒
function Clock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 10000)
    return () => clearInterval(id)
  }, [])
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return <span className={`${NAV_BASE} tabular-nums`}>{time}</span>
}

function NavBar({ fixed = false }) {
  const { pathname } = useLocation()

  // 滚动方向控制显隐：顶部/底部/向上滚 → 显示；向下滚 → 淡出
  const [visible, setVisible] = useState(true)
  const lastY = useRef(0)

  useEffect(() => {
    lastY.current = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      const doc = document.documentElement
      const atTop = y < 8
      const atBottom = y + window.innerHeight >= doc.scrollHeight - 8
      const goingUp = y < lastY.current
      setVisible(atTop || atBottom || goingUp)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 选中（当前页）→ 绿色
  const activeStyle = (isActive) => (isActive ? { color: ACTIVE_GREEN } : undefined)

  return (
    <>
      <div
        className={`fixed left-0 right-0 top-0 z-50 border-b border-neutral-300/50 bg-white/50 backdrop-blur-md transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <nav className="container-fluid flex w-full items-center justify-between py-4">
          {/* Home 移到最左（原时钟位置） */}
          <Link to="/" className={NAV_LINK} style={activeStyle(pathname === '/')}>
            Home
          </Link>
          <div className="flex items-center gap-9">
            <Link to="/aboutme" className={NAV_LINK} style={activeStyle(pathname === '/aboutme')}>
              About
            </Link>
            {/* 时钟移到最右（原 Resume 位置） */}
            <Clock />
          </div>
        </nav>
      </div>

      {/* 非首页原本是随页面流排布的，导航改成固定后，用占位块保持原来的顶部留白 */}
      {!fixed && <div aria-hidden className="h-[72px]" />}
    </>
  )
}

export default NavBar
