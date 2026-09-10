import { useCallback, useEffect, useReducer, useRef, useState } from 'react'

// 画廊本地编辑器（只在本机 npm run dev 里生效，线上打包后自动消失）
//  · 拖每个灰色占位图的下边缘 → 自由改高度（宽度由列宽决定，保持统一）
//  · 点项目名 / 下面的小字 → 直接改文案
//  · 底部工具条：撤销（退回上一步）/ 重做 / 保存 / 恢复默认 / 复制给 Claude
// 「保存」写进 localStorage，刷新不丢；「复制给 Claude」把当前数据导出成文字，
// 贴给我，我就能写回真正的代码里（和 PageEditor.jsx 是同一套用法）。
const KEY = 'gallery-edits-v1'

const load = () => {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
const store = (v) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(v))
  } catch {
    /* ignore */
  }
}

// 保存的数据可能是旧版本（少字段 / 少条目），按当前默认值补齐，避免页面炸掉
function merge(defaults, saved) {
  if (!Array.isArray(saved)) return defaults
  return defaults.map((d, i) => ({ ...d, ...(saved[i] || {}) }))
}

// 一个纯 reducer 管全部状态（items / 撤销栈 / 重做栈 / 有没有未保存改动）。
// 必须是纯函数：React 的 StrictMode 在开发模式会把它跑两遍，
// 如果在里面套 setState（之前的写法），重做栈会被塞进重复项、「下一步」就失灵。
function reducer(st, a) {
  switch (a.type) {
    case 'patch': // 拖动 / 打字过程中的实时更新，不记进撤销栈
      return { ...st, items: st.items.map((it, n) => (n === a.i ? { ...it, ...a.next } : it)) }
    case 'end': // 一次交互结束，真的变了才算「一步」
      if (!a.before || JSON.stringify(a.before) === JSON.stringify(st.items)) return st
      return { ...st, past: [...st.past, a.before], future: [], dirty: true }
    case 'undo':
      if (!st.past.length) return st
      return {
        items: st.past[st.past.length - 1],
        past: st.past.slice(0, -1),
        future: [st.items, ...st.future],
        dirty: true,
      }
    case 'redo':
      if (!st.future.length) return st
      return {
        items: st.future[0],
        past: [...st.past, st.items],
        future: st.future.slice(1),
        dirty: true,
      }
    case 'move': { // 换位 = 两格对调。只有这两格互换，其它格子一个都不动。
      const { from, to } = a
      if (from == null || to == null || from === to) return st
      const next = [...st.items]
      ;[next[from], next[to]] = [next[to], next[from]]
      return { ...st, items: next, past: [...st.past, st.items], future: [], dirty: true }
    }
    case 'reset':
      return { items: a.defaults, past: [...st.past, st.items], future: [], dirty: true }
    case 'saved':
      return { ...st, dirty: false }
    default:
      return st
  }
}

export function useGalleryEditor(defaults) {
  const [st, dispatch] = useReducer(reducer, null, () => ({
    items: merge(defaults, load()),
    past: [],
    future: [],
    dirty: false,
  }))
  const snapshot = useRef(null) // 一次交互（一次拖动 / 一次改字）开始前的状态

  const begin = useCallback(() => {
    snapshot.current = st.items
  }, [st.items])
  const patch = useCallback((i, next) => dispatch({ type: 'patch', i, next }), [])
  const end = useCallback(() => {
    dispatch({ type: 'end', before: snapshot.current })
    snapshot.current = null
  }, [])
  const move = useCallback((from, to) => dispatch({ type: 'move', from, to }), [])
  const undo = useCallback(() => dispatch({ type: 'undo' }), [])
  const redo = useCallback(() => dispatch({ type: 'redo' }), [])
  const reset = useCallback(() => dispatch({ type: 'reset', defaults }), [defaults])
  const save = useCallback(() => {
    store(st.items) // 副作用放在 reducer 外面
    // 开发模式下再 POST 一份到 dev server，落成项目根目录的 gallery-edits.json，
    // 这样 Claude 能直接读到你改的内容（见 vite.config.js 的 galleryStore 插件）
    if (import.meta.env.DEV) {
      fetch('/__gallery-save', { method: 'POST', body: JSON.stringify(st.items) }).catch(() => {})
    }
    dispatch({ type: 'saved' })
  }, [st.items])

  return {
    items: st.items,
    begin,
    patch,
    end,
    move,
    undo,
    redo,
    save,
    reset,
    dirty: st.dirty,
    canUndo: st.past.length > 0,
    canRedo: st.future.length > 0,
  }
}

// 可直接点着改的文字。外部值变了（撤销 / 恢复默认）而且当前没在编辑，才回写 DOM，
// 这样打字时光标不会被 React 重渲染打断。
export function Editable({ value, onBegin, onCommit, className }) {
  const ref = useRef(null)
  const last = useRef(value)
  useEffect(() => {
    const el = ref.current
    if (el && value !== last.current && document.activeElement !== el) {
      el.textContent = value
      last.current = value
    }
  }, [value])
  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      onFocus={onBegin}
      onBlur={(e) => {
        const t = e.currentTarget.textContent.trim()
        last.current = t
        onCommit(t)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          e.currentTarget.blur()
        }
        if (e.key === 'Escape') e.currentTarget.blur()
      }}
      className={`cursor-text rounded-[2px] outline-none ring-offset-2 transition-shadow hover:ring-1 hover:ring-[#5db83c]/40 focus:ring-2 focus:ring-[#5db83c] ${className}`}
    >
      {value}
    </div>
  )
}

// 灰盒下边缘的拖动条：按住上下拖 = 改高度；拖动时显示当前像素值
// scale = 当前列宽 / 基准列宽。高度按基准列宽存，拖动时换算一下，
// 这样不管窗口多宽，拖 10px 就是屏幕上真的移动 10px。
export function HeightHandle({ height, scale = 1, onBegin, onChange, onEnd }) {
  const [dragging, setDragging] = useState(false)
  const start = useRef(null)
  const down = (e) => {
    e.preventDefault()
    start.current = { y: e.clientY, h: height }
    setDragging(true)
    onBegin()
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'ns-resize'
    const move = (ev) =>
      onChange(Math.max(60, Math.round(start.current.h + (ev.clientY - start.current.y) / scale)))
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
      setDragging(false)
      onEnd()
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }
  return (
    <>
      <div
        onPointerDown={down}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        title="上下拖动改高度"
        className="absolute inset-x-0 bottom-0 z-10 flex h-3 cursor-ns-resize items-center justify-center opacity-0 transition-opacity group-hover/box:opacity-100"
      >
        <div className="h-[3px] w-16 rounded-full bg-[#5db83c]" />
      </div>
      <div
        className={`pointer-events-none absolute bottom-2 right-2 z-10 rounded bg-black/75 px-1.5 py-0.5 font-mono text-[11px] text-white transition-opacity ${
          dragging ? 'opacity-100' : 'opacity-0 group-hover/box:opacity-100'
        }`}
      >
        {height}px
      </div>
    </>
  )
}

// 左上角的拖动手柄：按住它把整格拖到别的位置
export function DragHandle({ onStart }) {
  return (
    <div
      onPointerDown={onStart}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
      title="按住拖到别的位置"
      className="absolute left-2 top-2 z-20 flex cursor-grab select-none items-center gap-1 rounded bg-black/75 px-2 py-1 text-[11px] text-white opacity-0 transition-opacity group-hover/box:opacity-100 active:cursor-grabbing"
    >
      <span className="text-[13px] leading-none">⠿</span>
      拖我
    </div>
  )
}

// 右上角的方向键：把这一格和上下左右相邻的那一格对调。
// 拖不动的时候用这个最稳，也最精确。
export function MoveArrows({ can, onMove }) {
  const btn = (dir, label, title) => (
    <button
      type="button"
      title={title}
      disabled={!can(dir)}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onMove(dir)
      }}
      className="flex h-6 w-6 items-center justify-center rounded bg-black/75 text-[12px] leading-none text-white transition-colors hover:bg-[#5db83c] hover:text-black disabled:cursor-not-allowed disabled:bg-black/30 disabled:text-white/30"
    >
      {label}
    </button>
  )
  return (
    <div className="absolute right-2 top-2 z-20 flex gap-1 opacity-0 transition-opacity group-hover/box:opacity-100">
      {btn('left', '←', '和左边那格对调')}
      {btn('up', '↑', '和上面那格对调')}
      {btn('down', '↓', '和下面那格对调')}
      {btn('right', '→', '和右边那格对调')}
    </div>
  )
}

// 拖动换位的逻辑：用 pointer 事件自己算（不用 HTML5 拖拽，免得和改字/拖高度打架）。
// 松手时看光标底下是哪一格（data-gi），把拖着的那格插到它的位置。
export function useGalleryDnd(move) {
  const [dragging, setDragging] = useState(null)
  const [over, setOver] = useState(null)
  const cur = useRef({})
  const start = (i) => (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(i)
    setOver(i)
    cur.current = { from: i, to: i, x: e.clientX, y: e.clientY }
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'grabbing'

    // 判断光标底下是哪一格。鼠标一动就立刻算（不依赖 requestAnimationFrame —— 
    // 标签页在后台时 rAF 会被浏览器暂停，之前就是这么失灵的）
    const hit = () => {
      const { x, y } = cur.current
      const el = document.elementFromPoint(x, y)?.closest('[data-gi]')
      const t = el ? Number(el.dataset.gi) : null
      if (t !== cur.current.to) {
        cur.current.to = t
        setOver(t)
      }
    }

    // 拖到屏幕上下边缘时自动滚页，不然够不着远处的格子。滚完要重新判定目标。
    const EDGE = 90
    const timer = setInterval(() => {
      const { y } = cur.current
      let dy = 0
      if (y < EDGE) dy = -Math.ceil((EDGE - y) / 5)
      else if (y > window.innerHeight - EDGE) dy = Math.ceil((y - (window.innerHeight - EDGE)) / 5)
      if (dy) {
        window.scrollBy(0, dy)
        hit()
      }
    }, 16)

    const mv = (ev) => {
      cur.current.x = ev.clientX
      cur.current.y = ev.clientY
      hit()
    }
    const up = () => {
      clearInterval(timer)
      window.removeEventListener('pointermove', mv)
      window.removeEventListener('pointerup', up)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
      const { from, to } = cur.current
      if (to != null && to !== from) move(from, to)
      setDragging(null)
      setOver(null)
    }
    window.addEventListener('pointermove', mv)
    window.addEventListener('pointerup', up)
  }
  return { dragging, over, start }
}

// 底部固定工具条
export function GalleryToolbar({ items, undo, redo, save, reset, dirty, canUndo, canRedo }) {
  const [flash, setFlash] = useState('')
  const say = (m) => {
    setFlash(m)
    setTimeout(() => setFlash(''), 1600)
  }

  // 快捷键：⌘Z 撤销 / ⌘⇧Z 重做 / ⌘S 保存（正在改字时不抢，交给浏览器自己的撤销）
  useEffect(() => {
    const onKey = (e) => {
      if (document.activeElement?.isContentEditable) return
      if (!(e.metaKey || e.ctrlKey)) return
      const k = e.key.toLowerCase()
      if (k === 'z') {
        e.preventDefault()
        e.shiftKey ? redo() : undo()
      } else if (k === 's') {
        e.preventDefault()
        save()
        say('已保存')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, redo, save])

  const btn =
    'rounded-full px-3 py-1.5 text-[12px] transition-colors disabled:cursor-not-allowed disabled:opacity-30'
  return (
    <div className="fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-black/85 px-2 py-1.5 text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur">
      <span className="px-2 text-[11px] uppercase tracking-[0.14em] text-white/40">Gallery</span>
      <button className={`${btn} hover:bg-white/15`} onClick={undo} disabled={!canUndo}>
        ← 上一步
      </button>
      <button className={`${btn} hover:bg-white/15`} onClick={redo} disabled={!canRedo}>
        下一步 →
      </button>
      <span className="mx-1 h-4 w-px bg-white/15" />
      <button
        className={`${btn} ${dirty ? 'bg-[#5db83c] font-medium text-black hover:bg-[#6fce4a]' : 'hover:bg-white/15'}`}
        onClick={() => {
          save()
          say('已保存')
        }}
      >
        保存
      </button>
      <button
        className={`${btn} hover:bg-white/15`}
        onClick={() => {
          navigator.clipboard?.writeText(JSON.stringify(items, null, 2))
          say('已复制，贴给 Claude 就能写回代码')
        }}
      >
        复制给 Claude
      </button>
      <button className={`${btn} text-white/50 hover:bg-white/15 hover:text-white`} onClick={reset}>
        恢复默认
      </button>
      <span className="min-w-[7rem] px-2 text-[11px] text-white/55">
        {flash || (dirty ? '有未保存的改动' : '已是保存状态')}
      </span>
    </div>
  )
}
