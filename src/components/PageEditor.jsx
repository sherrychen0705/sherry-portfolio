import { useCallback, useEffect, useRef, useState } from 'react'

// 本地页面编辑器（只在本机浏览器里生效，不影响线上）
//  · 改字模式：点任意 h2 / p / a 直接改文案
//  · 间距模式：点选任意元素 → 拖四条边改 margin（按住 Option 拖 = padding），
//              右侧小面板可精确微调 margin / padding / gap
// 两种改动都存在 localStorage，刷新不丢；「复制给 Claude」把改动导出成文字，
// 贴给我就能写回真正的代码里。
const TEXT_KEY = 'heykura-edits-v1'
const SPACE_KEY = 'heykura-spacing-v1'
const SIDES = ['Top', 'Right', 'Bottom', 'Left']

const load = (k) => {
  try {
    return JSON.parse(localStorage.getItem(k) || '{}')
  } catch {
    return {}
  }
}
const store = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v))
  } catch {
    /* ignore */
  }
}
const kebab = (s) => s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())

// 元素定位：从内容根节点一路数「第几个孩子」，拼成 "2.0.3"，刷新后还能找回同一个元素
function pathOf(root, el) {
  const parts = []
  let cur = el
  while (cur && cur !== root) {
    const p = cur.parentElement
    if (!p) return null
    parts.unshift([...p.children].indexOf(cur))
    cur = p
  }
  return cur === root ? parts.join('.') : null
}
function elByPath(root, path) {
  let cur = root
  for (const i of path.split('.')) {
    cur = cur && cur.children[Number(i)]
    if (!cur) return null
  }
  return cur
}

// 可拖动的数字输入：横向拖 = 加减，点一下 = 直接打字
function Num({ label, value, onChange }) {
  const st = useRef(null)
  const down = (e) => {
    st.current = { x: e.clientX, v: value }
    const move = (ev) => {
      document.body.style.userSelect = 'none'
      onChange(Math.round(st.current.v + (ev.clientX - st.current.x)))
    }
    const up = () => {
      document.body.style.userSelect = ''
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
  }
  return (
    <label className="flex flex-col items-center gap-[3px]">
      <span className="text-[9px] uppercase tracking-wide text-neutral-400">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(Math.round(Number(e.target.value) || 0))}
        onMouseDown={down}
        className="num-scrub w-[42px] rounded border border-neutral-200 bg-neutral-50 py-[3px] text-center text-[11px] text-black outline-none focus:border-[#5b9c3f]"
      />
    </label>
  )
}

export default function PageEditor({ rootRef }) {
  const [mode, setMode] = useState('text') // 'text' | 'space'
  const [space, setSpace] = useState(() => load(SPACE_KEY))
  const [sel, setSel] = useState(null)
  const [hover, setHover] = useState(null)
  const [drag, setDrag] = useState(null)
  const [tip, setTip] = useState('')
  const dragRef = useRef(null)
  const appliedRef = useRef([])
  const [, tickState] = useState(0)
  const bump = useCallback(() => tickState((n) => n + 1), [])

  const flash = (t) => {
    setTip(t)
    setTimeout(() => setTip(''), 1600)
  }

  // 1) 进页面先把存好的文字套回去（不管当前是哪种模式）
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const saved = load(TEXT_KEY)
    ;[...root.querySelectorAll('h2, p, a')].forEach((el, i) => {
      const v = saved['e' + i]
      if (typeof v === 'string') el.innerHTML = v
    })
  }, [rootRef])

  // 2) 改字模式：挂 contenteditable
  useEffect(() => {
    if (mode !== 'text') return
    const root = rootRef.current
    if (!root) return
    const saved = load(TEXT_KEY)
    const cleanups = []
    ;[...root.querySelectorAll('h2, p, a')].forEach((el, i) => {
      const k = 'e' + i
      el.setAttribute('contenteditable', 'true')
      el.setAttribute('spellcheck', 'false')
      const onInput = () => {
        saved[k] = el.innerHTML
        store(TEXT_KEY, saved)
      }
      el.addEventListener('input', onInput)
      let onClick
      if (el.tagName === 'A') {
        onClick = (e) => e.preventDefault() // 编辑时不跳转链接
        el.addEventListener('click', onClick)
      }
      cleanups.push(() => {
        el.removeAttribute('contenteditable')
        el.removeEventListener('input', onInput)
        if (onClick) el.removeEventListener('click', onClick)
      })
    })
    return () => cleanups.forEach((fn) => fn())
  }, [mode, rootRef])

  // 3) 把存好的间距套到页面上（space 变了就重算，同时清掉上一轮写过的行内样式）
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    appliedRef.current.forEach(({ el, prop }) => {
      el.style[prop] = ''
    })
    const applied = []
    Object.entries(space).forEach(([path, props]) => {
      const el = elByPath(root, path)
      if (!el) return
      Object.entries(props).forEach(([prop, v]) => {
        if (v == null) return
        el.style[prop] = v + 'px'
        applied.push({ el, prop })
      })
    })
    appliedRef.current = applied
    store(SPACE_KEY, space)
  }, [space, rootRef])

  // 4) 间距模式：hover 高亮 + 点击选中
  useEffect(() => {
    if (mode !== 'space') {
      setSel(null)
      setHover(null)
      return
    }
    const root = rootRef.current
    if (!root) return
    const onOver = (e) => {
      if (!dragRef.current && e.target !== root) setHover(e.target)
    }
    const onLeave = () => setHover(null)
    const onClick = (e) => {
      if (!root.contains(e.target) || e.target === root) return
      e.preventDefault()
      e.stopPropagation()
      setSel(e.target)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setSel(null)
    }
    root.addEventListener('mouseover', onOver)
    root.addEventListener('mouseleave', onLeave)
    root.addEventListener('click', onClick, true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('scroll', bump, { passive: true })
    window.addEventListener('resize', bump)
    root.style.userSelect = 'none'
    return () => {
      root.removeEventListener('mouseover', onOver)
      root.removeEventListener('mouseleave', onLeave)
      root.removeEventListener('click', onClick, true)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', bump)
      window.removeEventListener('resize', bump)
      root.style.userSelect = ''
    }
  }, [mode, rootRef, bump])

  const root = rootRef.current
  const selPath = sel && root ? pathOf(root, sel) : null
  const cs = sel ? getComputedStyle(sel) : null
  const isFlexGrid = cs ? /flex|grid/.test(cs.display) : false

  const valOf = (prop) => {
    const s = selPath && space[selPath]
    if (s && s[prop] != null) return s[prop]
    if (!cs) return 0
    return Math.round(parseFloat(prop === 'gap' ? cs.rowGap : cs[prop]) || 0)
  }
  const setVal = (prop, v) => {
    if (!selPath) return
    setSpace((prev) => ({ ...prev, [selPath]: { ...(prev[selPath] || {}), [prop]: v } }))
  }

  // 拖边：默认改 margin，按住 Option 改 padding
  const onHandleDown = (side, e) => {
    e.preventDefault()
    e.stopPropagation()
    const prop = (e.altKey ? 'padding' : 'margin') + side
    const startValue = valOf(prop)
    dragRef.current = { side, prop, startValue, x: e.clientX, y: e.clientY }
    setDrag({ prop, value: startValue, x: e.clientX, y: e.clientY })
    document.body.style.userSelect = 'none'
    const move = (ev) => {
      const d = dragRef.current
      if (!d) return
      const delta = d.side === 'Left' ? ev.clientX - d.x : d.side === 'Right' ? d.x - ev.clientX : ev.clientY - d.y
      let v = Math.round(d.startValue + delta)
      if (d.prop.startsWith('padding')) v = Math.max(0, v)
      setVal(d.prop, v)
      setDrag({ prop: d.prop, value: v, x: ev.clientX, y: ev.clientY })
      bump()
    }
    const up = () => {
      dragRef.current = null
      setDrag(null)
      document.body.style.userSelect = ''
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
  }

  const selectParent = () => {
    if (sel && sel.parentElement && sel.parentElement !== root) setSel(sel.parentElement)
  }
  const clearSel = () => {
    if (!selPath) return
    setSpace((prev) => {
      const next = { ...prev }
      delete next[selPath]
      return next
    })
  }
  const saveNow = () => {
    const r = rootRef.current
    if (r) {
      const t = {}
      ;[...r.querySelectorAll('h2, p, a')].forEach((el, i) => {
        t['e' + i] = el.innerHTML
      })
      store(TEXT_KEY, t)
    }
    store(SPACE_KEY, space)
    flash('已保存 ✓')
  }
  const resetAll = () => {
    if (mode === 'text') {
      if (!window.confirm('把所有文字改动清空、恢复成代码里的原文？')) return
      localStorage.removeItem(TEXT_KEY)
      window.location.reload()
    } else {
      if (!window.confirm('把所有间距改动清空、恢复成代码里的原样？')) return
      setSpace({})
      setSel(null)
      flash('间距已还原')
    }
  }
  const copyForClaude = () => {
    const r = rootRef.current
    const lines = Object.entries(space)
      .map(([path, props]) => {
        const el = r && elByPath(r, path)
        if (!el) return null
        const css = Object.entries(props)
          .filter(([, v]) => v != null)
          .map(([p, v]) => `${kebab(p)}: ${v}px`)
          .join('; ')
        if (!css) return null
        const cls = (el.getAttribute('class') || '').slice(0, 90)
        const txt = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 45)
        return `• <${el.tagName.toLowerCase()} class="${cls}">${txt ? `  「${txt}」` : ''}\n  路径 ${path} → ${css}`
      })
      .filter(Boolean)
    const text = lines.length
      ? `Heykura 页面间距调整（请写进代码）：\n\n${lines.join('\n\n')}`
      : '（暂时没有间距改动）'
    navigator.clipboard?.writeText(text)
    flash(lines.length ? `已复制 ${lines.length} 条` : '没有改动可复制')
  }

  const selRect = mode === 'space' && sel ? sel.getBoundingClientRect() : null
  const hovRect = mode === 'space' && hover && hover !== sel ? hover.getBoundingClientRect() : null
  const box = (r) => ({ left: r.left, top: r.top, width: r.width, height: r.height })
  const handleStyle = (side, r) => {
    const H = 9
    const L = 46
    if (side === 'Top') return { left: r.left + r.width / 2 - L / 2, top: r.top - H / 2, width: L, height: H }
    if (side === 'Bottom') return { left: r.left + r.width / 2 - L / 2, top: r.bottom - H / 2, width: L, height: H }
    if (side === 'Left') return { left: r.left - H / 2, top: r.top + r.height / 2 - L / 2, width: H, height: L }
    return { left: r.right - H / 2, top: r.top + r.height / 2 - L / 2, width: H, height: L }
  }

  return (
    <>
      {/* 高亮框 + 拖拽手柄（间距模式） */}
      {mode === 'space' && (
        <div className="pointer-events-none fixed inset-0 z-[45]">
          {hovRect && (
            <div className="absolute" style={{ ...box(hovRect), outline: '1px dashed rgba(91,156,63,.6)' }} />
          )}
          {selRect && (
            <>
              <div
                className="absolute"
                style={{ ...box(selRect), outline: '1.5px solid #5b9c3f', background: 'rgba(91,156,63,.06)' }}
              />
              {SIDES.map((side) => (
                <div
                  key={side}
                  onMouseDown={(e) => onHandleDown(side, e)}
                  className={`spacing-ui pointer-events-auto absolute rounded-full ${
                    side === 'Top' || side === 'Bottom' ? 'handle-v' : 'handle-h'
                  }`}
                  style={{
                    ...handleStyle(side, selRect),
                    background: '#5b9c3f',
                    boxShadow: '0 1px 4px rgba(0,0,0,.35)',
                  }}
                />
              ))}
            </>
          )}
          {drag && (
            <div
              className="absolute rounded-md bg-black px-2 py-1 text-[11px] font-medium text-white"
              style={{ left: drag.x + 16, top: drag.y - 10 }}
            >
              {kebab(drag.prop)} {drag.value}px
            </div>
          )}
        </div>
      )}

      {/* 选中元素的精确调节面板 */}
      {mode === 'space' && sel && (
        <div className="spacing-ui fixed bottom-[68px] right-4 z-50 w-[236px] rounded-xl bg-white p-3 text-black shadow-[0_8px_30px_rgba(0,0,0,.18)] ring-1 ring-black/10">
          <div className="mb-2 flex items-center justify-between">
            <span className="truncate text-[11px] font-semibold">
              &lt;{sel.tagName.toLowerCase()}&gt;{' '}
              <span className="font-normal text-neutral-400">{selPath}</span>
            </span>
            <button type="button" onClick={selectParent} className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] hover:bg-neutral-200">
              ⬆ 选外层
            </button>
          </div>
          <div className="mb-1 text-[10px] font-semibold text-neutral-500">MARGIN 外间距</div>
          <div className="mb-2 flex justify-between">
            {SIDES.map((s) => (
              <Num key={s} label={s[0]} value={valOf('margin' + s)} onChange={(v) => setVal('margin' + s, v)} />
            ))}
          </div>
          <div className="mb-1 text-[10px] font-semibold text-neutral-500">PADDING 内间距</div>
          <div className="flex justify-between">
            {SIDES.map((s) => (
              <Num key={s} label={s[0]} value={valOf('padding' + s)} onChange={(v) => setVal('padding' + s, Math.max(0, v))} />
            ))}
          </div>
          {isFlexGrid && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] font-semibold text-neutral-500">GAP 元素之间</span>
              <Num label="" value={valOf('gap')} onChange={(v) => setVal('gap', Math.max(0, v))} />
            </div>
          )}
          <button
            type="button"
            onClick={clearSel}
            className="mt-2.5 w-full rounded bg-neutral-100 py-1 text-[10px] text-neutral-600 hover:bg-neutral-200"
          >
            还原这个元素
          </button>
        </div>
      )}

      {/* 底部工具条 */}
      <div className="spacing-ui fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-black/85 px-2 py-1.5 text-xs text-white backdrop-blur">
        <div className="flex rounded-full bg-white/15 p-0.5">
          {[
            ['text', '✏️ 改字'],
            ['space', '📐 调间距'],
          ].map(([m, label]) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-full px-2.5 py-0.5 ${mode === m ? 'bg-white text-black' : 'hover:bg-white/15'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="max-w-[190px] text-[11px] text-white/70">
          {tip || (mode === 'text' ? '点任意文字直接改' : sel ? '拖绿色方块改 margin · 按 Option 拖 = padding' : '点一下想调的地方')}
        </span>
        <button type="button" onClick={saveNow} className="rounded-full bg-white/20 px-3 py-0.5 font-medium hover:bg-white/30">
          保存
        </button>
        <button type="button" onClick={copyForClaude} className="rounded-full bg-white/20 px-3 py-0.5 hover:bg-white/30">
          复制给 Claude
        </button>
        <button type="button" onClick={resetAll} className="rounded-full px-2 py-0.5 text-white/60 hover:bg-white/15 hover:text-white">
          还原
        </button>
      </div>
    </>
  )
}
