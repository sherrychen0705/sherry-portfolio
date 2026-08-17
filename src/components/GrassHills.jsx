import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

// 卡片四周的白色扩散粒子：每颗从卡边（椭圆分布）向外飘、边淡出，方向/大小/时长随机 → 无规则发散。
function CardParticles({ count = 100 }) {
  const parts = useMemo(
    () =>
      Array.from({ length: count }, () => {
        const a = Math.random() * Math.PI * 2
        const ja = a + (Math.random() - 0.5) * 0.7 // 出射方向带抖动
        const dist = 30 + Math.random() * 120 // 向外飘的距离更大 → 扩散雾感
        const tx = Math.cos(ja) * dist + (Math.random() - 0.5) * 30
        const ty = Math.sin(ja) * dist + (Math.random() - 0.5) * 30
        // 路径中点加垂直偏移 → 弯曲、无规则的飘动轨迹
        const perp = (Math.random() - 0.5) * 44
        const mx = tx * 0.5 + Math.cos(ja + Math.PI / 2) * perp
        const my = ty * 0.5 + Math.sin(ja + Math.PI / 2) * perp
        return {
          left: 50 + 47 * Math.cos(a) + (Math.random() - 0.5) * 8, // 起点贴卡边椭圆、略散布
          top: 50 + 47 * Math.sin(a) + (Math.random() - 0.5) * 8,
          tx,
          ty,
          mx,
          my,
          size: 1 + Math.random() * 2.6, // 更细小 → 雾感
          dur: 2.6 + Math.random() * 3.4,
          delay: Math.random() * 5,
          op: 0.4 + Math.random() * 0.4,
        }
      }),
    [count],
  )
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      {parts.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            boxShadow: '0 0 4px rgba(255,255,255,0.85)',
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`,
            '--mx': `${p.mx}px`,
            '--my': `${p.my}px`,
            '--op': p.op,
            animation: `card-particle ${p.dur}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

// 程序化「起伏绿地」——纯 code 生成，不用贴图。
// 噪声位移地形 + 顶点渐变上色（谷底深绿→山顶亮绿）+ 半球光/暖阳 + 雾气纵深 + 撒紫粉小花。
// 交互：鼠标 hover 到场景上移动（pan）时，相机平移，做出「pan to move」的漫游感；
// 不 hover 时相机自身缓慢漂移，保持画面有呼吸感。
// markers: 锚定在地形上的发光白色方块。每个 { x, z, label? } 是世界坐标（非屏幕百分比），
// 每帧投影到屏幕位置，因此 pan 山脉时方块会「粘」在同一处地形上一起移动。
function GrassHills({ height = 'clamp(320px, 58vh, 560px)', className = 'mt-24', markers = [] }) {
  const mountRef = useRef(null)
  const markerRefs = useRef([])
  // 点击方块后弹出的连接线 + 卡片
  const [active, setActive] = useState(null) // 当前选中的方块下标（null=无）
  const activeRef = useRef(null) // 供渲染循环读取当前选中项（避免闭包拿到旧值）
  const cardRef = useRef(null) // 卡片 DOM，位置每帧跟随方块更新
  const linePathRef = useRef(null) // 连接线 path，d 每帧更新
  useEffect(() => {
    activeRef.current = active
  }, [active])
  const CARD_W = 330
  const CARD_H = 250

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const SKY = 0xeef1ea // 淡雾色：天空与雾同色，远处山丘消融进雾里
    const REDUCE = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    // --- 渲染器（WebGL 不可用时回退成 CSS 渐变） ---
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true })
    } catch {
      mount.style.background = 'linear-gradient(#eef1ea,#cfe0bf)'
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.domElement.style.display = 'block'
    mount.appendChild(renderer.domElement)

    // --- 场景 / 雾 / 相机 ---
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(SKY)
    scene.fog = new THREE.Fog(SKY, 34, 168)

    const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 400)
    camera.position.set(0, 17, 60)

    // --- 灯光 ---
    scene.add(new THREE.HemisphereLight(0xffffff, 0x3f5622, 0.55)) // 环境光调低 → 暗部更暗
    const sun = new THREE.DirectionalLight(0xfff0cf, 1.45)
    sun.position.set(-46, 20, 14) // 压低太阳高度 → 掠射，山体明暗对比更强、立体
    scene.add(sun)

    // --- 噪声：hash value-noise + 多倍频 fbm ---
    const hash = (x, y) => {
      const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
      return s - Math.floor(s)
    }
    const vnoise = (x, y) => {
      const xi = Math.floor(x), yi = Math.floor(y)
      const xf = x - xi, yf = y - yi
      const u = xf * xf * (3 - 2 * xf)
      const v = yf * yf * (3 - 2 * yf)
      const a = hash(xi, yi), b = hash(xi + 1, yi)
      const c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1)
      return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
    }
    const fbm = (x, y) => {
      let val = 0, amp = 0.5, freq = 1
      for (let o = 0; o < 5; o++) {
        val += amp * vnoise(x * freq, y * freq)
        freq *= 2
        amp *= 0.5
      }
      return val
    }

    // 地形高度：大丘陵（幂函数拔高山峰、压平谷底 → 更 dramatic）+ 中/细节起伏
    const SIZE = 200
    const SEG = 220
    const heightAt = (x, z) => {
      const big = fbm(x * 0.014 + 10, z * 0.014 + 10) // 0..1
      const mid = fbm(x * 0.05 + 40, z * 0.05 + 40)
      const detail = fbm(x * 0.13 + 70, z * 0.13 + 70)
      return Math.pow(big, 1.4) * 32 + mid * 5 + detail * 1.3 - 13
    }

    // 标记的世界坐标（贴在地形表面上方一点点），每帧投影到屏幕 → 随相机 pan 移动
    const markerWorld = markers.map((m) => new THREE.Vector3(m.x, heightAt(m.x, m.z) + 1.6, m.z))
    const projV = new THREE.Vector3()
    const screen = markers.map(() => [0, 0, true]) // 每帧存 [sx, sy, visible]，供卡片/连接线跟随

    // --- 地形网格 ---
    const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEG, SEG)
    geo.rotateX(-Math.PI / 2)
    const pos = geo.attributes.position
    const cLow = new THREE.Color(0x1f4216) // 谷底更深绿（加强明暗对比）
    const cMid = new THREE.Color(0x59902f) // 中绿
    const cHigh = new THREE.Color(0xb6d982) // 山顶更亮绿
    const tmp = new THREE.Color()
    const colors = new Float32Array(pos.count * 3)
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i)
      const h = heightAt(x, z)
      pos.setY(i, h)
      const t = THREE.MathUtils.clamp((h + 13) / 36, 0, 1)
      if (t < 0.5) tmp.copy(cLow).lerp(cMid, t / 0.5)
      else tmp.copy(cMid).lerp(cHigh, (t - 0.5) / 0.5)
      const grain = 0.9 + hash(x * 3.1, z * 3.1) * 0.18 // 细颗粒，模拟草的杂色
      colors[i * 3] = tmp.r * grain
      colors[i * 3 + 1] = tmp.g * grain
      colors[i * 3 + 2] = tmp.b * grain
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    geo.computeVertexNormals()
    const terrain = new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0 }),
    )
    scene.add(terrain)

    // --- 花朵贴图（canvas 画一个柔软圆点当花瓣团） ---
    const fc = document.createElement('canvas')
    fc.width = fc.height = 64
    const fctx = fc.getContext('2d')
    const grad = fctx.createRadialGradient(32, 32, 2, 32, 32, 30)
    grad.addColorStop(0, 'rgba(255,255,255,1)')
    grad.addColorStop(0.5, 'rgba(255,255,255,0.85)')
    grad.addColorStop(1, 'rgba(255,255,255,0)')
    fctx.fillStyle = grad
    fctx.beginPath()
    fctx.arc(32, 32, 30, 0, Math.PI * 2)
    fctx.fill()
    const flowerTex = new THREE.CanvasTexture(fc)

    // --- 撒花（Points，聚簇分布；粉/紫/白抖色，随高度贴合地形） ---
    const flowerCols = [
      new THREE.Color(0xb57edc), // 紫
      new THREE.Color(0xd98fd0), // 粉紫
      new THREE.Color(0xe7a6d6), // 浅粉
      new THREE.Color(0xffffff), // 少量白（小雏菊感）
    ]
    const fp = []
    const fcol = []
    let guard = 0
    while (fp.length / 3 < 1600 && guard < 20000) {
      guard++
      const x = (Math.random() - 0.5) * SIZE * 0.92
      const z = (Math.random() - 0.5) * SIZE * 0.92
      if (fbm(x * 0.05 + 100, z * 0.05 + 100) < 0.56) continue // 只在花簇区域长
      fp.push(x, heightAt(x, z) + 0.35, z)
      const col = Math.random() < 0.12 ? flowerCols[3] : flowerCols[Math.floor(Math.random() * 3)]
      const j = 0.85 + Math.random() * 0.3
      fcol.push(col.r * j, col.g * j, col.b * j)
    }
    const fgeo = new THREE.BufferGeometry()
    fgeo.setAttribute('position', new THREE.Float32BufferAttribute(fp, 3))
    fgeo.setAttribute('color', new THREE.Float32BufferAttribute(fcol, 3))
    const flowers = new THREE.Points(
      fgeo,
      new THREE.PointsMaterial({
        size: 1.5,
        map: flowerTex,
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        sizeAttenuation: true,
        fog: true,
        alphaTest: 0.02,
      }),
    )
    scene.add(flowers)

    // --- 空气中漂浮的粒子（白 + 深绿），缓缓浮动，增强空间层次 ---
    const PCOUNT = 460
    const pPos = new Float32Array(PCOUNT * 3)
    const pBase = new Float32Array(PCOUNT * 3) // 原始位置，浮动围绕它抖
    const pPhase = new Float32Array(PCOUNT)
    const pColArr = new Float32Array(PCOUNT * 3)
    const cWhite = new THREE.Color(0xffffff)
    const cDarkGreen = new THREE.Color(0x2b491c)
    for (let i = 0; i < PCOUNT; i++) {
      const x = (Math.random() - 0.5) * 170
      const z = (Math.random() - 0.5) * 120 - 8
      const y = 2 + Math.random() * 36
      pBase[i * 3] = x; pBase[i * 3 + 1] = y; pBase[i * 3 + 2] = z
      pPos[i * 3] = x; pPos[i * 3 + 1] = y; pPos[i * 3 + 2] = z
      pPhase[i] = Math.random() * Math.PI * 2
      const c = Math.random() < 0.5 ? cWhite : cDarkGreen
      pColArr[i * 3] = c.r; pColArr[i * 3 + 1] = c.g; pColArr[i * 3 + 2] = c.b
    }
    const pgeo = new THREE.BufferGeometry()
    pgeo.setAttribute('position', new THREE.Float32BufferAttribute(pPos, 3))
    pgeo.setAttribute('color', new THREE.Float32BufferAttribute(pColArr, 3))
    const particles = new THREE.Points(
      pgeo,
      new THREE.PointsMaterial({
        size: 0.8,
        map: flowerTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        sizeAttenuation: true,
        fog: true,
        alphaTest: 0.01,
      }),
    )
    scene.add(particles)

    // --- 交互：hover 时鼠标位置驱动相机平移（pan to move） ---
    let targetX = 0, targetY = 0, curX = 0, curY = 0
    // 监听挂在 mount（外层容器）上，而非 canvas：鼠标移到方块（容器的子元素）上时
    // 不会触发容器的 pointerleave，避免「pan→方块移动→leave→回正」的抖动死循环。
    const onMove = (e) => {
      const r = mount.getBoundingClientRect()
      targetX = ((e.clientX - r.left) / r.width) * 2 - 1
      targetY = ((e.clientY - r.top) / r.height) * 2 - 1
    }
    const onLeave = () => {
      targetX = 0
      targetY = 0
    }
    const el = renderer.domElement
    mount.addEventListener('pointermove', onMove)
    mount.addEventListener('pointerleave', onLeave)

    // 点击方块以外的区域（且不是卡片本身）→ 关闭卡片/连接线
    const onDocDown = (e) => {
      if (e.target.closest?.('[data-marker]') || e.target.closest?.('[data-hillcard]')) return
      setActive(null)
    }
    document.addEventListener('pointerdown', onDocDown)

    // --- 渲染循环（切到后台标签自动暂停，省电） ---
    const clock = new THREE.Clock()
    const look = new THREE.Vector3(0, 2, -30)
    let running = true
    let raf = 0
    const loop = () => {
      if (!running) return
      raf = requestAnimationFrame(loop)
      const t = clock.getElapsedTime()
      curX += (targetX - curX) * 0.05
      curY += (targetY - curY) * 0.05
      const drift = REDUCE ? 0 : Math.sin(t * 0.08) * 1.0 // 自身缓慢漂移（更弱）
      camera.position.x = curX * 4 + drift // pan 幅度进一步减弱（原 8）
      camera.position.y = 17 - curY * 1.2
      look.x = curX * 13 + drift * 0.6 // 原 24
      look.y = 4 + curY * 1.0
      camera.lookAt(look)
      // 漂浮粒子：绕原位缓缓浮动
      if (!REDUCE) {
        const pa = pgeo.attributes.position.array
        for (let i = 0; i < PCOUNT; i++) {
          const ph = pPhase[i]
          pa[i * 3] = pBase[i * 3] + Math.sin(t * 0.25 + ph) * 2.4
          pa[i * 3 + 1] = pBase[i * 3 + 1] + Math.sin(t * 0.5 + ph * 1.7) * 1.6
          pa[i * 3 + 2] = pBase[i * 3 + 2] + Math.cos(t * 0.2 + ph) * 2.2
        }
        pgeo.attributes.position.needsUpdate = true
      }
      renderer.render(scene, camera)
      // 标记：把世界坐标投影到屏幕，让方块贴合地形随 pan 一起移动
      const w = mount.clientWidth, h = mount.clientHeight
      for (let i = 0; i < markerWorld.length; i++) {
        projV.copy(markerWorld[i]).project(camera)
        const sx = (projV.x * 0.5 + 0.5) * w
        const sy = (-projV.y * 0.5 + 0.5) * h
        const visible = projV.z <= 1
        screen[i][0] = sx; screen[i][1] = sy; screen[i][2] = visible
        const elm = markerRefs.current[i]
        if (elm) {
          elm.style.transform = `translate(-50%, -50%) translate(${sx}px, ${sy}px)`
          elm.style.opacity = visible ? '1' : '0' // 转到相机背后就隐藏
        }
      }
      // 选中的方块：卡片 + 连接线跟随（每帧根据方块屏幕位置更新）
      const ai = activeRef.current
      if (ai != null && screen[ai] && cardRef.current && linePathRef.current) {
        const [msx, msy] = screen[ai]
        let cx = msx + 70, cy = msy - 175 // 卡片放在方块右上方
        cx = Math.max(8, Math.min(cx, w - CARD_W - 8)) // 夹在容器内，任意宽度可见
        cy = Math.max(8, Math.min(cy, h - CARD_H - 8))
        cardRef.current.style.transform = `translate(${cx}px, ${cy}px)`
        const conx = cx, cony = cy + 52 // 连到卡片左侧偏上
        const stub = msx <= conx ? 34 : -34 // 从方块先横一小段，再斜线拉到卡片
        linePathRef.current.setAttribute('d', `M ${msx} ${msy} L ${msx + stub} ${msy} L ${conx} ${cony}`)
      }
    }
    loop()

    const onVis = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      } else if (!running) {
        running = true
        clock.getDelta()
        loop()
      }
    }
    document.addEventListener('visibilitychange', onVis)

    // --- 自适应尺寸 ---
    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth, h = mount.clientHeight
      if (!w || !h) return
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    })
    ro.observe(mount)

    // --- 清理 ---
    return () => {
      running = false
      cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', onVis)
      document.removeEventListener('pointerdown', onDocDown)
      mount.removeEventListener('pointermove', onMove)
      mount.removeEventListener('pointerleave', onLeave)
      ro.disconnect()
      geo.dispose()
      terrain.material.dispose()
      fgeo.dispose()
      flowers.material.dispose()
      pgeo.dispose()
      particles.material.dispose()
      flowerTex.dispose()
      renderer.dispose()
      if (el.parentNode === mount) mount.removeChild(el)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ height, cursor: 'grab' }}
    >
      {/* 发光白色方块标记层：位置每帧由 JS 投影更新（transform）。z-10 盖在 canvas 上 */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {markers.map((m, i) => (
          <div
            key={i}
            ref={(el) => (markerRefs.current[i] = el)}
            className="absolute left-0 top-0"
            style={{ willChange: 'transform' }}
          >
            <div
              data-marker
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation()
                setActive(active === i ? null : i)
              }}
              className="relative flex items-center justify-center p-2"
              style={{ pointerEvents: 'auto', cursor: 'pointer' }}
            >
              <span
                className={`hero-marker block h-3.5 w-3.5 ${active === i ? 'bg-[#5db83c]' : 'bg-white'}`}
              />
              {m.label && (
                <span
                  className="absolute left-1/2 top-[130%] -translate-x-1/2 whitespace-nowrap text-[13px] font-medium tracking-wide text-white"
                  style={{ textShadow: '0 1px 5px rgba(0,0,0,0.45)' }}
                >
                  take a peak
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 点击方块后：连接线 + 卡片（key=active → 每次切换都重放 cyberpunk 画线动画） */}
      {active != null && (
        <div key={active} className="pointer-events-none absolute inset-0 z-20">
          <svg className="absolute inset-0 h-full w-full overflow-visible">
            <path
              ref={linePathRef}
              className="hillcard-line"
              fill="none"
              stroke="#5db83c"
              strokeWidth="1.5"
              strokeDasharray="1400"
            />
          </svg>
          <div
            ref={cardRef}
            data-hillcard
            className="hillcard-in absolute left-0 top-0"
            style={{ width: CARD_W, transform: 'translate(-9999px,-9999px)', pointerEvents: 'auto' }}
          >
            <CardParticles />
            <div className="relative z-10 border-2 border-[#5db83c] bg-white/70 p-3 shadow-[0_12px_44px_rgba(0,0,0,0.2)] backdrop-blur-md">
              <div className="mb-2 text-sm font-medium text-black">
                {String(active + 1).padStart(2, '0')}
              </div>
              {/* 图片区：marker 有 img 才放图；没有 img 则完全不显示（如第五张卡） */}
              {markers[active]?.img && (
                <img
                  src={markers[active].img}
                  alt=""
                  className="block w-full object-cover"
                  style={{ aspectRatio: '4 / 3' }}
                />
              )}
              <p className="mt-3 text-[16px] leading-snug text-black">
                {markers[active]?.text || (
                  <>
                    placeholder text
                    <br />
                    placeholder text
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GrassHills
