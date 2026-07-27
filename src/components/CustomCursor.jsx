import { useEffect, useRef } from 'react'

// 小方块相对鼠标尖端的落点：左上方，保持一段距离
const SQUARE_OFFSET = { x: -26, y: -30 }
// 追随的"跟手程度"：越小越慢、拖尾越长（0~1）
const FOLLOW = 0.16

// 相对亮度：<0.5 视为深色背景 → 用白色鼠标
function relLum(r, g, b) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
}

function CustomCursor() {
  const wrapRef = useRef(null)
  const arrowRef = useRef(null)
  const squareRef = useRef(null)

  const mouse = useRef({ x: -100, y: -100 })
  const square = useRef({ x: -100, y: -100 })
  const ready = useRef(false)
  const dark = useRef(false)

  useEffect(() => {
    // 只在有精确指针的设备（鼠标/触控板）上启用，触屏跳过
    if (!window.matchMedia('(pointer: fine)').matches) return

    // 1×1 画布，用于采样图片/视频的像素颜色
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 1
    const ctx = canvas.getContext('2d', { willReadFrequently: true })

    // 判断某点下方的背景是不是深色
    const isDarkAt = (x, y) => {
      const el = document.elementFromPoint(x, y)
      if (!el) return dark.current
      const tag = el.tagName
      // 图片 / 视频：直接采样像素
      if ((tag === 'IMG' && el.naturalWidth) || (tag === 'VIDEO' && el.videoWidth)) {
        try {
          const r = el.getBoundingClientRect()
          const nw = tag === 'IMG' ? el.naturalWidth : el.videoWidth
          const nh = tag === 'IMG' ? el.naturalHeight : el.videoHeight
          const sx = Math.max(0, Math.min(nw - 1, ((x - r.left) / r.width) * nw))
          const sy = Math.max(0, Math.min(nh - 1, ((y - r.top) / r.height) * nh))
          ctx.clearRect(0, 0, 1, 1)
          ctx.drawImage(el, sx, sy, 1, 1, 0, 0, 1, 1)
          const d = ctx.getImageData(0, 0, 1, 1).data
          if (d[3] > 10) return relLum(d[0], d[1], d[2]) < 0.5
        } catch {
          /* 跨域图片会污染画布，退回到背景色判断 */
        }
      }
      // 其它元素：向上找第一个不透明的背景色
      let node = el
      while (node && node.nodeType === 1) {
        const bg = getComputedStyle(node).backgroundColor
        const m = bg.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/)
        if (m) {
          const a = m[4] === undefined ? 1 : parseFloat(m[4])
          if (a > 0.4) return relLum(+m[1], +m[2], +m[3]) < 0.5
        }
        node = node.parentElement
      }
      return false
    }

    const show = (v) => {
      ready.current = v
      if (wrapRef.current) wrapRef.current.style.opacity = v ? '1' : '0'
    }
    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      if (!ready.current) show(true)
    }
    const onLeave = () => show(false)
    const onEnter = () => show(true)

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    let raf
    let frame = 0
    const tick = () => {
      const m = mouse.current
      // 箭头：尖端精确贴住鼠标
      if (arrowRef.current) arrowRef.current.style.transform = `translate3d(${m.x}px, ${m.y}px, 0)`
      // 小方块：缓动追向"鼠标 + 偏移"的落点，产生拖尾
      square.current.x += (m.x + SQUARE_OFFSET.x - square.current.x) * FOLLOW
      square.current.y += (m.y + SQUARE_OFFSET.y - square.current.y) * FOLLOW
      if (squareRef.current) {
        squareRef.current.style.transform = `translate3d(${square.current.x}px, ${square.current.y}px, 0)`
      }
      // 每 ~4 帧检测一次背景明暗（省性能），深色→白，浅色→黑
      if (ready.current && frame++ % 4 === 0) {
        const d = isDarkAt(m.x, m.y)
        if (d !== dark.current) {
          dark.current = d
          if (wrapRef.current) wrapRef.current.style.color = d ? '#fff' : '#000'
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999] hidden md:block"
      style={{ color: '#000', opacity: 0, transition: 'opacity 200ms ease' }}
    >
      {/* 箭头：左上尖角在 (0,0)，指向左上，细圆头 */}
      <div ref={arrowRef} className="absolute left-0 top-0">
        <svg
          width="30"
          height="30"
          viewBox="0 0 100 100"
          fill="none"
          className="block -translate-x-[5px] -translate-y-[5px]"
        >
          {/* 斜向尾杆：从尖角甩到右下 */}
          <path d="M20 20 L80 80" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
          {/* 左上尖角：竖边 + 横边 */}
          <path d="M20 64 L20 20 L64 20" stroke="currentColor" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* 小方块：左上方拖尾跟随，带轻微黑色阴影 */}
      <div
        ref={squareRef}
        className="absolute left-0 top-0 h-2.5 w-2.5"
        style={{ backgroundColor: 'currentColor', boxShadow: '0 1px 4px rgba(0, 0, 0, 0.35)' }}
      />
    </div>
  )
}

export default CustomCursor
