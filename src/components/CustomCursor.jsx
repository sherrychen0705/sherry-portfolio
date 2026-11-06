import { useEffect, useRef } from 'react'
import { getCanvasProbe } from './canvasProbe'

// 自定义鼠标：手绘的「指路手」+ 跟在右下方的黑色标签。
// 想调的东西都在这几行：
const LABEL = "Let's Gooo" // 标签上的字
const HAND_SIZE = 46 // 手的大小（px，整体等比缩放）
const HAND_OFFSET = { x: -16, y: -8 } // 手相对鼠标点的位置（食指尖大致压在鼠标上）
const LABEL_OFFSET = { x: 20, y: 34 } // 标签相对鼠标点的位置（右下方）
const FOLLOW = 0.18 // 标签的跟手程度：越小越慢、拖尾越长（0~1）
const AUTO_INVERT = true // 深色背景上自动反色（手变白、标签变白底黑字）
const SAMPLE_PX = 28 // 在图片/视频上取多大一块来判断明暗（原图像素，越大越稳、越不跳）

// 标签只在带 data-cursor 的区域里出现，其它地方淡出（手一直都在）。
// 首页封面上写的是 data-cursor=""（空值 → 用上面的 LABEL）；
// 想让别处显示别的字，就给那个元素加 data-cursor="View project"。
const LABEL_ATTR = 'data-cursor'
const LABEL_FADE = 260 // 标签淡入淡出时长（ms）

// 相对亮度：<0.5 视为深色背景 → 用白色鼠标
function relLum(r, g, b) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
}

function CustomCursor() {
  const wrapRef = useRef(null)
  const handRef = useRef(null)
  const labelRef = useRef(null)
  const labelTextRef = useRef(null)

  const mouse = useRef({ x: -200, y: -200 })
  const label = useRef({ x: -200, y: -200 })
  const ready = useRef(false)
  const dark = useRef(false)
  const text = useRef(null) // 当前标签文字；null = 不在任何 data-cursor 区域里

  useEffect(() => {
    // 只在有精确指针的设备（鼠标/触控板）上启用，触屏跳过
    if (!window.matchMedia('(pointer: fine)').matches) return

    // 1×1 画布，用于采样图片/视频的像素颜色
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 1
    const ctx = canvas.getContext('2d', { willReadFrequently: true })

    // 判断某点下方的背景是不是深色
    const isDarkAt = (el, x, y) => {
      if (!el) return dark.current
      const tag = el.tagName
      // 图片 / 视频：采样鼠标底下那一小块的平均色（只取 1 个像素的话，
      // 深色图上偶尔踩到一个高光点就会闪成黑手，所以把一小片缩成 1×1 求平均）
      if ((tag === 'IMG' && el.naturalWidth) || (tag === 'VIDEO' && el.videoWidth)) {
        try {
          const r = el.getBoundingClientRect()
          const nw = tag === 'IMG' ? el.naturalWidth : el.videoWidth
          const nh = tag === 'IMG' ? el.naturalHeight : el.videoHeight
          // object-fit 会裁切 / 留白，先换算回原图坐标（object-position 用默认的居中）
          const fit = getComputedStyle(el).objectFit
          const k =
            fit === 'contain'
              ? Math.min(r.width / nw, r.height / nh)
              : fit === 'none'
                ? 1
                : Math.max(r.width / nw, r.height / nh) // cover / fill 都按铺满算
          const ox = (r.width - nw * k) / 2
          const oy = (r.height - nh * k) / 2
          const cx = (x - r.left - ox) / k
          const cy = (y - r.top - oy) / k
          const S = SAMPLE_PX
          const sx = Math.max(0, Math.min(nw - S, cx - S / 2))
          const sy = Math.max(0, Math.min(nh - S, cy - S / 2))
          ctx.clearRect(0, 0, 1, 1)
          ctx.drawImage(el, sx, sy, S, S, 0, 0, 1, 1)
          const d = ctx.getImageData(0, 0, 1, 1).data
          if (d[3] > 10) return relLum(d[0], d[1], d[2]) < 0.5
        } catch {
          /* 跨域图片会污染画布，退回到背景色判断 */
        }
      }
      // canvas（比如首页的山丘画面）：
      // WebGL 画布画完就清缓冲，外面读不到，所以由画布自己在渲染后登记一个结果（canvasProbe.js）。
      // 登记的值超过 300ms 没更新就不信（说明鼠标已经离开画布了）。
      if (tag === 'CANVAS') {
        const probe = getCanvasProbe(el)
        if (probe && probe.dark != null && performance.now() - probe.t < 300) return probe.dark
      }
      // 普通 2D canvas：还能按像素取色；透明的地方会落到下面的背景色判断
      if (tag === 'CANVAS' && el.width && el.height) {
        try {
          const r = el.getBoundingClientRect()
          const cx = ((x - r.left) / r.width) * el.width
          const cy = ((y - r.top) / r.height) * el.height
          const S = Math.min(SAMPLE_PX, el.width, el.height)
          const sx = Math.max(0, Math.min(el.width - S, cx - S / 2))
          const sy = Math.max(0, Math.min(el.height - S, cy - S / 2))
          ctx.clearRect(0, 0, 1, 1)
          ctx.drawImage(el, sx, sy, S, S, 0, 0, 1, 1)
          const d = ctx.getImageData(0, 0, 1, 1).data
          if (d[3] > 120) return relLum(d[0], d[1], d[2]) < 0.5
        } catch {
          /* 读不到就退回背景色判断 */
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
      if (!ready.current) {
        // 第一次出现时标签直接落位，不从屏幕角上飞过来
        label.current = { x: e.clientX + LABEL_OFFSET.x, y: e.clientY + LABEL_OFFSET.y }
        show(true)
      }
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
      // 手：紧紧贴着鼠标
      if (handRef.current) {
        handRef.current.style.transform = `translate3d(${m.x + HAND_OFFSET.x}px, ${m.y + HAND_OFFSET.y}px, 0)`
      }
      // 标签：缓动追向「鼠标 + 偏移」的落点，产生一点拖尾
      label.current.x += (m.x + LABEL_OFFSET.x - label.current.x) * FOLLOW
      label.current.y += (m.y + LABEL_OFFSET.y - label.current.y) * FOLLOW
      if (labelRef.current) {
        labelRef.current.style.transform = `translate3d(${label.current.x}px, ${label.current.y}px, 0)`
      }
      // 每 ~4 帧检测一次鼠标底下是什么（省性能）：背景明暗 + 要不要换文案
      if (ready.current && frame++ % 4 === 0) {
        const el = document.elementFromPoint(m.x, m.y)
        if (AUTO_INVERT) {
          const d = isDarkAt(el, m.x, m.y)
          if (d !== dark.current) {
            dark.current = d
            if (wrapRef.current) wrapRef.current.style.color = d ? '#fff' : '#000'
            if (labelRef.current) {
              labelRef.current.style.backgroundColor = d ? '#fff' : '#000'
              labelRef.current.style.color = d ? '#000' : '#fff'
            }
          }
        }
        const zone = el?.closest?.(`[${LABEL_ATTR}]`)
        // 不在区域里 → null（淡出）；在区域里 → 该元素写的字，没写就用默认 LABEL
        const next = zone ? zone.getAttribute(LABEL_ATTR) || LABEL : null
        if (next !== text.current) {
          text.current = next
          if (next && labelTextRef.current) labelTextRef.current.textContent = next
          if (labelRef.current) labelRef.current.style.opacity = next ? '1' : '0'
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
      {/* 手：手绘线条，食指朝上，其余手指蜷起来，左边伸出拇指。
          线条用 currentColor，所以深色背景上会整只变白。 */}
      <div ref={handRef} className="absolute left-0 top-0" style={{ willChange: 'transform' }}>
        <svg
          width={HAND_SIZE}
          height={(HAND_SIZE * 68) / 60}
          viewBox="0 0 60 68"
          fill="none"
          className="block"
          style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.18))' }}
        >
          {/* 整只手的轮廓：食指 → 指关节的几个小鼓包 → 右侧和底部 → 拇指 → 回到食指根部 */}
          <path
            d="M24 36 L24 15 C24 9 34 9 34 15 L34 29
               C37 26 43 27 44 32
               C47 30 51 33 50 38
               C52 41 51 47 47 49
               C46 56 40 60 32 60
               L28 60
               C19 60 14 54 14 46
               C10 44 7 38 10 34
               C13 30 18 32 20 36 Z"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* 蜷起来的手指之间的一道折痕，让手型更好认 */}
          <path
            d="M34 34 C38 35 40 38 40 42"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* 标签：黑底白字的小方块，缓动跟在手的右下方 */}
      <div
        ref={labelRef}
        className="absolute left-0 top-0 whitespace-nowrap"
        style={{
          willChange: 'transform',
          opacity: 0, // 只在 data-cursor 区域里淡入
          transition: `opacity ${LABEL_FADE}ms ease`,
          backgroundColor: '#000',
          color: '#fff',
          padding: '9px 18px',
          fontFamily: "'Figtree', sans-serif",
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: '0.01em',
          lineHeight: 1.1,
          boxShadow: '0 2px 10px rgba(0,0,0,0.18)',
        }}
      >
        <span ref={labelTextRef}>{LABEL}</span>
      </div>
    </div>
  )
}

export default CustomCursor
