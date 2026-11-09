import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { setCanvasProbe } from './canvasProbe'

// 广告牌上自己写的字用系统字体（苹果设备上是 SF Pro，和广告牌图片里的字一致）
const CTA_FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, 'Helvetica Neue', Arial, sans-serif"

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
function GrassHills({
  height = 'clamp(320px, 58vh, 560px)',
  className = 'mt-24',
  markers = [],
  sky = 0xeef1ea, // 单色天空/雾（默认淡雾）
  skyTop, // 传入 skyTop+skyBottom 则用竖向渐变天空（如蓝天）
  skyBottom,
  particleScale = 1, // 漂浮粒子数量倍率（<1 更稀疏）
  grassLow = 0x1f4216, // 谷底色
  grassMid = 0x59902f, // 中间色
  grassHigh = 0xb6d982, // 山顶色
  billboard = null, // { x, z, yaw?, scale?, pole?, lines? } 传入就在这块地形上立一块户外广告牌
  fov = 50, // 相机视角：越小越「拉近」，画面里的山丘越少、东西越大
  lookY = -12, // 相机看向的高度：越大画面越往上抬
  transparentSky = false, // 天空透明：透出页面背景，放在后面的 DOM（比如标题）能被广告牌挡住
  onSkyline, // (ridgeAt) => void：ridgeAt(x像素) 返回该列山脊线在画布里的 y（静止相机下），尺寸变化时会再报一次
  extraBottom = 0, // 画布底部多出来的比例（0~0.5）：上面的画面保持原样，只是往下多看一截地面
  billboardProgress, // () => 0~1：广告牌「立起来」的进度，每帧读一次（0 = 低低地斜在草里，1 = 完全立好）
  onFocusChange, // (focused) => void：点击广告牌进入 / 退出聚焦时通知外面
  billboardContent = null, // 聚焦（zoom in）后铺在广告牌画面上的网页内容，可以在里面上下滚动
  autoFocus = null, // true/false：从外面控制广告牌聚焦（比如导航栏点 About 就直接进聚焦画面）
  layoutShift = 0, // 外面把画布整体上下挪了多少（首页标题测量完会挪一次）：聚焦状态下跟着重新居中
}) {
  const mountRef = useRef(null)
  const onSkylineRef = useRef(onSkyline)
  onSkylineRef.current = onSkyline
  const progressRef = useRef(billboardProgress)
  progressRef.current = billboardProgress
  // 点击广告牌 → 镜头推近、正对广告牌（focused）；再点空白 / Esc / Back 退出
  const [focused, setFocused] = useState(autoFocus === true)
  // 挂载时就是聚焦状态吗（从别的页面点 About 直接进来）→ 场景一建好就是对焦画面，省掉一次镜头飞行
  const mountFocusRef = useRef(autoFocus === true)
  const focusTargetRef = useRef(0)
  const focusApiRef = useRef({})
  const overlayRef = useRef(null) // 聚焦后盖在广告牌画面上的内容层（外层：定位 + 圆角裁切）
  const scrollRef = useRef(null) // 内层：真正滚动的那一层
  const thumbRef = useRef(null) // 自绘滚动条的滑块
  // 滑块位置 / 长度跟着内容滚动
  const updateThumb = () => {
    const sc = scrollRef.current
    const th = thumbRef.current
    if (!sc || !th) return
    const track = th.parentElement.clientHeight
    const ratio = sc.clientHeight / Math.max(1, sc.scrollHeight)
    const h = Math.max(32, track * ratio)
    const maxTop = track - h
    const top = sc.scrollHeight > sc.clientHeight ? (sc.scrollTop / (sc.scrollHeight - sc.clientHeight)) * maxTop : 0
    th.style.height = `${h}px`
    th.style.transform = `translateY(${top}px)`
    th.parentElement.style.opacity = ratio >= 1 ? '0' : '1'
  }
  const updateThumbRef = useRef(null)
  updateThumbRef.current = updateThumb
  const onFocusChangeRef = useRef(onFocusChange)
  onFocusChangeRef.current = onFocusChange
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
    // 建这个场景（地形 + 24 万根草 + 阴影）要几百毫秒，同步建会把页面切换卡住。
    // 先让浏览器把新页面画出来，隔两帧再建，切过来就不顿了。
    let cancelled = false
    let dispose = null
    const build = () => {
    const mount = mountRef.current
    if (!mount) return

    const SKY = sky // 淡雾色：天空与雾同色，远处山丘消融进雾里
    const REDUCE = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    // --- 渲染器（WebGL 不可用时回退成 CSS 渐变） ---
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: transparentSky })
    } catch {
      mount.style.background = 'linear-gradient(#eef1ea,#cfe0bf)'
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // 提高清晰度，减少锯齿/像素感
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    if (billboard) {
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
    }
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.opacity = '0' // 第一帧画完再淡入
    renderer.domElement.style.transition = 'opacity 260ms ease'
    mount.appendChild(renderer.domElement)

    // --- 场景 / 雾 / 相机 ---
    const scene = new THREE.Scene()
    if (skyTop != null && skyBottom != null) {
      // 竖向渐变天空（深蓝→近地平浅蓝），雾色取地平线浅蓝让远山融进去
      const gc = document.createElement('canvas')
      gc.width = 4
      gc.height = 256
      const gx = gc.getContext('2d')
      const hex = (n) => '#' + n.toString(16).padStart(6, '0')
      const grad = gx.createLinearGradient(0, 0, 0, 256)
      grad.addColorStop(0, hex(skyTop))
      grad.addColorStop(1, hex(skyBottom))
      gx.fillStyle = grad
      gx.fillRect(0, 0, 4, 256)
      const skyTex = new THREE.CanvasTexture(gc)
      skyTex.colorSpace = THREE.SRGBColorSpace
      scene.background = skyTex
      scene.fog = new THREE.Fog(skyBottom, 34, 168)
    } else {
      scene.background = transparentSky ? null : new THREE.Color(SKY)
      scene.fog = new THREE.Fog(SKY, 34, 168)
    }
    if (transparentSky) renderer.setClearColor(0x000000, 0)

    const camera = new THREE.PerspectiveCamera(fov, mount.clientWidth / mount.clientHeight, 0.1, 400)
    // 画布底部加高时：想象一个「上下各多出 E」的大画面，相机按它算视角，只取上面对齐原画面、往下多一截的那部分。
    // 这样画布变高，原来那部分（广告牌、标题后面的山）位置和大小都不变，只是底下多露出一段草地。
    const applyProjection = (cam, w, h, bottomK = 1) => {
      const E = h * extraBottom * bottomK
      const H0 = h - E
      const k = (H0 + 2 * E) / H0
      cam.fov = 2 * THREE.MathUtils.radToDeg(Math.atan(Math.tan(THREE.MathUtils.degToRad(fov) / 2) * k))
      cam.aspect = w / (h + E)
      if (E > 0) cam.setViewOffset(w, h + E, 0, E, w, h)
      else cam.clearViewOffset()
      cam.updateProjectionMatrix()
    }
    applyProjection(camera, mount.clientWidth, mount.clientHeight)
    camera.position.set(0, 17, 60)

    // --- 灯光 ---
    scene.add(new THREE.HemisphereLight(0xffffff, 0x2a2a2a, 0.55)) // 中性环境光（去绿色地面反射）
    const sun = new THREE.DirectionalLight(0xffffff, 1.45) // 纯白阳光 → 保持灰阶不偏色
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
    const SEG = 360 // 更高网格精度 → 山体更精细、silhouette 更平滑
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
    const cLow = new THREE.Color(grassLow) // 谷底
    const cMid = new THREE.Color(grassMid) // 中绿
    const cHigh = new THREE.Color(grassHigh) // 山顶
    const tmp = new THREE.Color()
    const colors = new Float32Array(pos.count * 3)
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i)
      const h = heightAt(x, z)
      pos.setY(i, h)
      let t = THREE.MathUtils.clamp((h + 13) / 36, 0, 1)
      t = THREE.MathUtils.clamp((t - 0.5) * 1.4 + 0.5, 0, 1) // 提高对比 → 明暗层次更分明
      if (t < 0.5) tmp.copy(cLow).lerp(cMid, t / 0.5)
      else tmp.copy(cMid).lerp(cHigh, (t - 0.5) / 0.5)
      const grain = 0.93 + vnoise(x * 0.5, z * 0.5) * 0.14 // 平滑杂色（非逐点随机）→ 无噪点/像素感
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

    // --- 山脊线：静止相机下，每一列屏幕像素上「最高的那座山」的顶边在哪 ---
    // 用来让外面的 DOM（标题）刚好藏到山后面。远处的山虽然有雾，但还是不透明的灰，一样会挡字，所以都要算。
    const reportSkyline = () => {
      const cb = onSkylineRef.current
      const w = mount.clientWidth, h = mount.clientHeight
      if (!cb || !w || !h) return
      const c = camera.clone()
      c.position.set(0, 17, 60)
      applyProjection(c, w, h)
      c.lookAt(0, lookY, -30)
      c.updateMatrixWorld()
      const BINS = 240
      const ridge = new Float32Array(BINS).fill(Infinity)
      const v = new THREE.Vector3()
      // z 方向隔一个点采一次：山脊线肉眼看不出差别，这一步能省掉一半时间
      for (let x = -100; x <= 100; x += 1) {
        for (let z = -100; z <= 100; z += 2) {
          v.set(x, heightAt(x, z), z)
          v.project(c)
          if (v.z > 1 || v.x < -1 || v.x > 1) continue
          const bin = Math.min(BINS - 1, Math.floor((v.x * 0.5 + 0.5) * BINS))
          const sy = (-v.y * 0.5 + 0.5) * h
          if (sy < ridge[bin]) ridge[bin] = sy
        }
      }
      cb((px) => ridge[Math.max(0, Math.min(BINS - 1, Math.floor((px / w) * BINS)))])
    }
    reportSkyline()

    // --- 户外广告牌（可选） ---
    // 全部用几何体 + PBR 材质搭：镀锌钢立柱、背后桁架、白色画面、底部检修走道 + 栏杆、顶部射灯。
    // 金属件单独挂一张环境反射贴图（不设成全场景 environment，免得把山丘也照亮），
    // 太阳投影只开给广告牌 → 地面上有它的影子，但山丘本身的明暗不变。
    const bbDispose = []
    const billboardRefs = {} // 渲染循环要用：草的时间 uniform、广告牌 group（算遮挡）
    if (billboard) {
      const bx = billboard.x
      const bz = billboard.z
      const ground = heightAt(bx, bz)
      const g = new THREE.Group()
      g.position.set(bx, ground, bz)
      g.scale.setScalar(billboard.scale ?? 1.04) // 原 1.3，缩小 20%
      // 默认朝向相机，再带一点侧转，像照片里那种 3/4 视角
      // 往左侧转一些：画面迎着左边低角度的太阳，被照亮；同时是照片里那种 3/4 斜视角
      g.rotation.y = Math.atan2(0 - bx, 60 - bz) + (billboard.yaw ?? -0.35)
      scene.add(g)

      const pmrem = new THREE.PMREMGenerator(renderer)
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
      pmrem.dispose()
      bbDispose.push(envTex)

      const steel = new THREE.MeshStandardMaterial({
        color: 0xd7dadc, metalness: 0.75, roughness: 0.38, envMap: envTex, envMapIntensity: 0.9,
      })
      const steelDark = new THREE.MeshStandardMaterial({
        color: 0x8e9396, metalness: 0.7, roughness: 0.5, envMap: envTex, envMapIntensity: 0.7,
      })
      bbDispose.push(steel, steelDark)

      // ===== 广告牌：上下两块牌子 =====
      //  · 上牌（大）：自我介绍，由两根立柱托着，底下是检修走道
      //  · 下牌（小）：Welcome to sherry-land + 箭头 + 三张圆形照片，
      //    用两条链子吊在走道横梁下面，会跟着风轻轻晃（见渲染循环里的 hang 摆动）
      // 文案都在 Home.jsx 的 billboard.face 里改。
      const W = 10.6 // 上牌画面宽
      const PAD_Y = 0.62 // 上牌文字上下各留多少（世界单位；原来是 1.23，缩一半）
      const W2 = 7.2 // 下牌画面宽
      const H2 = 2.9 // 下牌画面高
      const POLE_H = billboard.pole ?? 4.8 // 立柱露出地面的高度（到走道下方）
      const D = 0.42 // 面板厚度
      const BORDER = 0.3 // 外框宽度
      const RADIUS = 0.75 // 圆角
      const BORDER_SIDE = 0.15 // 下牌（吊着那块）的边框，比上牌细一半
      const TOTAL_W = W
      const MAIN_X = 0
      const CHAIN_LEN = 0.68 // 链子长度（两块牌子之间的距离）
      const CHAIN_X = W2 * 0.3 // 两条链子离中线多远
      const HANG_Z = 0.9 // 下牌挂得比上牌靠前，链子才不会被走道射灯挡住

      const FACE = billboard.face || { intro: [], cta: { lines: [] }, photos: [] }
      const FACE_BLUE = FACE.blue || '#239fe4'

      // 一段文字：一行里可以混排不同颜色的片段，按宽度自动换行，左对齐。返回这段占的高度。
      // 片段写成 ['文字', '颜色']；写成 { inline: 'wave', w: 1 } 则空出一块正方形，
      // 留给会动的小面片（比如挥手的手），位置记到 boxes 里，外面照着放 mesh。
      const drawPara = (ctx, segments, font, lineH, x, y, maxW, boxes, measureOnly) => {
        ctx.font = font
        const words = []
        segments.forEach((seg) => {
          if (seg && seg.inline) {
            words.push({ inline: seg.inline, ww: lineH * (seg.w ?? 1) })
            return
          }
          const [text, color] = seg
          text.split(/(\s+)/).forEach((w) => w && words.push({ w, color }))
        })
        const lines = [[]]
        let lineW = 0
        words.forEach((it) => {
          const ww = it.inline ? it.ww : ctx.measureText(it.w).width
          const solid = it.inline || /\S/.test(it.w)
          if (lineW + ww > maxW && solid && lines[lines.length - 1].length) {
            lines.push([])
            lineW = 0
          }
          if (!lines[lines.length - 1].length && !solid) return
          lines[lines.length - 1].push({ ...it, ww })
          lineW += ww
        })
        lines.forEach((ln, li) => {
          while (ln.length && !ln[ln.length - 1].inline && !/\S/.test(ln[ln.length - 1].w)) ln.pop()
          let cx = x
          const baseline = y + li * lineH
          ln.forEach((it) => {
            if (!measureOnly) {
              if (it.inline) {
                boxes?.push({ name: it.inline, cx: cx + it.ww / 2, cy: baseline - lineH * 0.3, size: it.ww })
              } else {
                ctx.fillStyle = it.color
                ctx.fillText(it.w, cx, baseline)
              }
            }
            cx += it.ww
          })
        })
        return lines.length * lineH
      }

      // 一块牌子的画面贴图。PX = 每个世界单位多少像素，两块牌子用同一个精度，
      // 所以两边的字号写成「世界单位」就能保证大小一致。
      const PX = 260
      const mkFace = (w, h) => {
        const cv = document.createElement('canvas')
        cv.width = Math.round(w * PX)
        cv.height = Math.round(h * PX)
        const tex = new THREE.CanvasTexture(cv)
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy()
        // 画面不受场景光照影响（MeshBasicMaterial + 不做色调映射），白底就是纯白
        const mat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })
        bbDispose.push(tex, mat)
        return { ctx: cv.getContext('2d'), tex, mat, FW: cv.width, FH: cv.height, w, h }
      }
      // 上牌多高，由文字自己决定：量一遍整段文字的高度，上下各留 PAD_Y。
      // 这样画面里不会上下空一大块（原来是固定 5.0 高）。
      const bodyFS = Math.round(0.44 * PX) // 正文字号（世界单位 0.44）
      const bodyLH = Math.round(bodyFS * 1.34)
      const layoutIntro = (ctx, startY, colW, padX, boxes, measureOnly) => {
        let y = startY
        FACE.intro.forEach((par) => {
          // 段落可以写成数组，也可以写成 { seg: [...], scale: 0.7 } 单独缩小字号
          const segs = Array.isArray(par) ? par : par.seg
          const sc = (Array.isArray(par) ? 1 : par.scale) || 1
          const fs = Math.round(bodyFS * sc)
          const lh = Math.round(bodyLH * sc)
          y += drawPara(ctx, segs, `400 ${fs}px ${CTA_FONT}`, lh, padX, y, colW, boxes, measureOnly)
          y += lh * 0.6
        })
        return y - startY
      }
      const PAD_X = 0.62 // 上牌文字左右留白（世界单位）
      const MAIN_COL_W = (W - PAD_X * 2) * PX
      const introH = layoutIntro(document.createElement('canvas').getContext('2d'), 0, MAIN_COL_W, 0, null, true)
      const Hh = introH / PX + PAD_Y * 2 // 上牌画面高
      const panelY = POLE_H + 0.9 + Hh / 2

      const faceMain = mkFace(W, Hh)
      const faceSide = mkFace(W2, H2)

      let faceBoxes = [] // 主牌文字里空出来的行内小动画位置（挥手、气球）
      const drawMain = () => {
        const { ctx, FW, FH } = faceMain
        ctx.clearRect(0, 0, FW, FH)
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, FW, FH)
        ctx.textAlign = 'left'
        ctx.textBaseline = 'alphabetic'
        faceBoxes = []
        // 画面高度就是按这段文字算出来的，所以从上留白 + 一行基线的位置开始画正好
        layoutIntro(ctx, PAD_Y * PX + bodyLH * 0.76, MAIN_COL_W, PAD_X * PX, faceBoxes, false)
      }
      // 副牌上会动的小面片的位置（副牌贴图上的像素）
      const ARROW = { cx: faceSide.FW * 0.575, cy: faceSide.FH * 0.46, r: 0.43 * PX }
      const PHOTO_R = 0.32 * PX
      const PHOTOS = (FACE.photos || []).map((src, i) => ({
        src,
        cx: faceSide.FW * 0.7 + i * PHOTO_R * 2.2,
        cy: ARROW.cy,
        r: PHOTO_R,
      }))
      const drawSide = () => {
        const { ctx, FW, FH } = faceSide
        ctx.clearRect(0, 0, FW, FH)
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, FW, FH)
        ctx.textAlign = 'left'
        ctx.textBaseline = 'alphabetic'
        const fs = Math.round(0.5 * PX)
        ctx.font = `400 ${fs}px ${CTA_FONT}`
        ctx.fillStyle = FACE_BLUE
        FACE.cta.lines.forEach((ln, i) => ctx.fillText(ln, FW * 0.06, FH * 0.45 + i * fs * 1.12))
      }
      drawMain()
      drawSide()

      const add = (geo, mat, x, y, z, rx = 0, ry = 0, rz = 0, parent = g) => {
        const m = new THREE.Mesh(geo, mat)
        m.position.set(x, y, z)
        m.rotation.set(rx, ry, rz)
        m.castShadow = true
        m.receiveShadow = true
        parent.add(m)
        bbDispose.push(geo)
        return m
      }

      // 外框：磨砂玻璃。transmission = 光能透过去（看得到后面山丘的模糊影子），
      // roughness 让透过去的东西糊掉 = 磨砂；clearcoat 给表面一层很淡的高光。
      const glassRim = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        vertexColors: true, // 颜色来自几何体上的粉→灰渐变
        transmission: 1,
        thickness: 0.6,
        ior: 1.45,
        roughness: 0.42,
        metalness: 0,
        clearcoat: 0.6,
        clearcoatRoughness: 0.35,
        attenuationColor: new THREE.Color(0xe9ecef),
        attenuationDistance: 2.5,
        envMap: envTex,
        envMapIntensity: 1.1,
      })
      // 柱子用同一种磨砂玻璃，但不带渐变，偏冷一点的浅灰
      // 柱子后面是深色草地，全透明会整根发黑；透光调到一半多一点，保留乳白的磨砂感
      const glassLeg = new THREE.MeshPhysicalMaterial({
        color: 0xeceef0,
        transmission: 0.55,
        thickness: 0.5,
        ior: 1.45,
        roughness: 0.45,
        metalness: 0,
        clearcoat: 0.6,
        clearcoatRoughness: 0.35,
        attenuationColor: new THREE.Color(0xdfe2e5),
        attenuationDistance: 2.5,
        envMap: envTex,
        envMapIntensity: 1.1,
      })
      bbDispose.push(glassRim, glassLeg)

      // 圆角矩形轮廓（以中心为原点）
      const roundedRect = (w, h, r) => {
        const sh = new THREE.Shape()
        const x = -w / 2, y = -h / 2
        sh.moveTo(x + r, y)
        sh.lineTo(x + w - r, y)
        sh.quadraticCurveTo(x + w, y, x + w, y + r)
        sh.lineTo(x + w, y + h - r)
        sh.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
        sh.lineTo(x + r, y + h)
        sh.quadraticCurveTo(x, y + h, x, y + h - r)
        sh.lineTo(x, y + r)
        sh.quadraticCurveTo(x, y, x + r, y)
        return sh
      }

      // 做一块牌子：磨砂玻璃圆角外框（带厚度） + 前面嵌一块白色圆角画面。
      // 外框的粉→灰渐变按「整组宽度」算，所以两块牌子接在一起时渐变是连贯的。
      const makePanel = (f, cx, cy, cz, parent = g, border = BORDER) => {
        const rimGeo = new THREE.ExtrudeGeometry(roundedRect(f.w + border * 2, f.h + border * 2, RADIUS), {
          depth: D, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 3, curveSegments: 16,
        })
        rimGeo.translate(0, 0, -D / 2)
        {
          const pink = new THREE.Color(0xf4c3d6)
          const gray = new THREE.Color(0xc4c8cd)
          const rp = rimGeo.attributes.position
          const cols = new Float32Array(rp.count * 3)
          const cc = new THREE.Color()
          const halfW = (f.w + border * 2) / 2
          const halfH = (f.h + border * 2) / 2
          for (let i = 0; i < rp.count; i++) {
            const u = (rp.getX(i) / halfW + 1) / 2 // 0 左 → 1 右
            const v = (1 - rp.getY(i) / halfH) / 2 // 0 上 → 1 下
            let t = THREE.MathUtils.clamp(u * 0.55 + v * 0.45, 0, 1)
            t = t * t * (3 - 2 * t)
            cc.copy(pink).lerp(gray, t)
            cols[i * 3] = cc.r
            cols[i * 3 + 1] = cc.g
            cols[i * 3 + 2] = cc.b
          }
          rimGeo.setAttribute('color', new THREE.BufferAttribute(cols, 3))
        }
        add(rimGeo, glassRim, cx, cy, cz, 0, 0, 0, parent)
        const faceGeo = new THREE.ShapeGeometry(roundedRect(f.w, f.h, Math.max(0.05, RADIUS - border)), 16)
        // ShapeGeometry 的 uv 是原始坐标，换算成 0~1 才能正确贴图
        const fuv = faceGeo.attributes.uv
        const fpos = faceGeo.attributes.position
        for (let i = 0; i < fuv.count; i++) fuv.setXY(i, fpos.getX(i) / f.w + 0.5, fpos.getY(i) / f.h + 0.5)
        const m = add(faceGeo, f.mat, cx, cy, cz + D / 2 + 0.045, 0, 0, 0, parent)
        m.castShadow = false
        // 贴图像素 → 广告牌自己的坐标，给上面要放的小面片用
        return {
          cx, cy, cz,
          x: (px) => cx + (px / f.FW - 0.5) * f.w,
          y: (py) => cy + (0.5 - py / f.FH) * f.h,
          s: (r) => ((2 * r) / f.FW) * f.w,
          z: cz + D / 2 + 0.055,
        }
      }
      const panelMain = makePanel(faceMain, MAIN_X, panelY, 0)

      // 下牌：吊在走道横梁下面。hang 这个组的原点就是链子的吊点，
      // 渲染循环里绕原点左右轻轻转一点点 → 整串（链子 + 牌子）像被风吹着晃。
      const walkY = panelY - Hh / 2 - BORDER - 0.75 // 走道高度（下面做走道时还要用）
      const hang = new THREE.Group()
      hang.position.set(0, walkY - 0.26, HANG_Z)
      g.add(hang)
      billboardRefs.hang = hang
      const panelSide = makePanel(faceSide, 0, -(CHAIN_LEN + H2 / 2 + BORDER_SIDE), 0, hang, BORDER_SIDE)

      // 两条链子：一节一节的小圆环，相邻两节转 90°，就是一条真链子的样子
      {
        const linkGeo = new THREE.TorusGeometry(0.13, 0.038, 8, 14)
        bbDispose.push(linkGeo)
        const STEP = 0.2
        const n = Math.max(2, Math.round((CHAIN_LEN - 0.1) / STEP))
        for (const sx of [-CHAIN_X, CHAIN_X]) {
          // 吊点上的小挂耳
          add(new THREE.BoxGeometry(0.22, 0.22, 0.22), steelDark, sx, 0.04, 0, 0, 0, 0, hang)
          for (let i = 0; i < n; i++) {
            add(linkGeo, steelDark, sx, -0.18 - i * STEP, 0, 0, (i % 2) * (Math.PI / 2), 0, hang)
          }
          // 牌子顶上的小挂耳
          add(new THREE.BoxGeometry(0.22, 0.26, 0.22), steelDark, sx, -CHAIN_LEN + 0.06, 0, 0, 0, 0, hang)
        }
      }

      // 蓝色圆形箭头：单独一小块面片贴在画面上，渲染循环里让它每隔一会儿左右弹一下
      {
        const ac = document.createElement('canvas')
        ac.width = ac.height = 512
        const ax = ac.getContext('2d')
        ax.fillStyle = FACE_BLUE
        ax.beginPath()
        ax.arc(256, 256, 250, 0, Math.PI * 2)
        ax.fill()
        // 白色 ↗：一根斜线 + 箭头两边
        ax.strokeStyle = '#ffffff'
        ax.lineWidth = 34
        ax.lineCap = 'round'
        ax.lineJoin = 'round'
        const a = 88
        ax.beginPath()
        ax.moveTo(256 - a, 256 + a)
        ax.lineTo(256 + a, 256 - a)
        ax.moveTo(256 + a - 118, 256 - a)
        ax.lineTo(256 + a, 256 - a)
        ax.lineTo(256 + a, 256 - a + 118)
        ax.stroke()
        const arrowTex = new THREE.CanvasTexture(ac)
        arrowTex.colorSpace = THREE.SRGBColorSpace
        arrowTex.anisotropy = renderer.capabilities.getMaxAnisotropy()
        const arrowMat = new THREE.MeshBasicMaterial({ map: arrowTex, transparent: true, toneMapped: false, depthWrite: false })
        const arrowGeo = new THREE.PlaneGeometry(1, 1)
        bbDispose.push(arrowTex, arrowMat, arrowGeo)
        const arrow = new THREE.Mesh(arrowGeo, arrowMat)
        const size = panelSide.s(ARROW.r)
        arrow.position.set(panelSide.x(ARROW.cx), panelSide.y(ARROW.cy), panelSide.z)
        arrow.scale.set(size, size, 1)
        arrow.renderOrder = 2
        hang.add(arrow)
        billboardRefs.arrow = arrow
        billboardRefs.arrowBase = arrow.position.x
        billboardRefs.arrowSize = size
      }

      // 「Hi」不写在画面上，而是两个漂浮的铝膜字母气球（就是派对上那种 H / I 字母球）。
      // 位置用文字里给它留的那块空位，尺寸也照着那块空位算，所以不会压到旁边的字。
      if (FACE.balloon) {
        const box = faceBoxes.find((b) => b.name === FACE.balloon.at)
        if (box) {
          const slotW = panelMain.s(box.size) // 文字里留出来的空位有多宽（世界单位）
          const grp = new THREE.Group()
          // 字母整体比一行字高一些，往上长（上面是留白，不会盖到第二行）
          grp.position.set(panelMain.x(box.cx), panelMain.y(box.cy) + slotW * 0.2, panelMain.z + slotW * 0.45)
          g.add(grp)

          // 铝膜表面的褶皱：画一张「揉皱的锡纸」灰度图，当凹凸 + 粗糙度贴图用。
          // 不加这个的话表面是光滑的镜面，一点气球的质感都没有。
          const crinkle = (() => {
            const S = 512
            const bc = document.createElement('canvas')
            bc.width = bc.height = S
            const bx = bc.getContext('2d')
            bx.fillStyle = '#808080'
            bx.fillRect(0, 0, S, S)
            // 一块块不规则的小面（像揉过的锡纸那样的折面）
            for (let i = 0; i < 260; i++) {
              const x = Math.random() * S
              const y = Math.random() * S
              const r = 16 + Math.random() * 54
              const n = 3 + ((Math.random() * 3) | 0)
              bx.beginPath()
              for (let k = 0; k < n; k++) {
                const a = (k / n) * Math.PI * 2 + Math.random() * 0.9
                const rr = r * (0.45 + Math.random() * 0.85)
                const px = x + Math.cos(a) * rr
                const py = y + Math.sin(a) * rr
                if (k) bx.lineTo(px, py)
                else bx.moveTo(px, py)
              }
              bx.closePath()
              const v = Math.round(128 + (Math.random() - 0.5) * 76)
              bx.fillStyle = `rgb(${v},${v},${v})`
              bx.fill()
            }
            // 折痕：一道亮一道暗的细线
            bx.lineCap = 'round'
            for (let i = 0; i < 200; i++) {
              const x = Math.random() * S
              const y = Math.random() * S
              const a = Math.random() * Math.PI * 2
              const len = 24 + Math.random() * 130
              bx.strokeStyle = Math.random() < 0.5 ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.5)'
              bx.lineWidth = 1 + Math.random() * 2.6
              bx.beginPath()
              bx.moveTo(x, y)
              bx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len)
              bx.stroke()
            }
            try {
              bx.filter = 'blur(1.1px)' // 柔一点，不然像噪点
              bx.drawImage(bc, 0, 0)
              bx.filter = 'none'
            } catch {
              /* 老浏览器不支持 canvas filter，不糊也能用 */
            }
            const tex = new THREE.CanvasTexture(bc)
            tex.wrapS = tex.wrapT = THREE.RepeatWrapping
            tex.repeat.set(4.5, 4.5)
            return tex
          })()
          bbDispose.push(crinkle)

          // 铝膜材质：金属 + 清漆，褶皱同时作用在凹凸和粗糙度上，
          // 所以高光是碎的、一块块的，而不是一整片镜面。每个字母可以有自己的颜色。
          const mkFoil = (color) => {
            const m = new THREE.MeshPhysicalMaterial({
              color: new THREE.Color(color),
              metalness: 0.32, // 金属度越高颜色越灰，压低才鲜艳
              roughness: 0.22,
              roughnessMap: crinkle,
              bumpMap: crinkle,
              bumpScale: 0.03,
              clearcoat: 1,
              clearcoatRoughness: 0.08,
              envMap: envTex,
              envMapIntensity: 0.95,
            })
            bbDispose.push(m)
            return m
          }

          // 一节「吹鼓的笔画」：圆角矩形往外鼓一圈（厚倒角）= 气球那种圆滚滚的边。
          // 鼓起来的量按这节笔画自己的粗细算 —— 写死一个值的话，细的横杠会被吃没。
          const puffyBar = (w, h) => {
            const puff = Math.min(w, h) * 0.62 // 鼓起来的量：越大越像吹饱的气球（太大字形会糊）
            const iw = Math.max(0.02, w - puff)
            const ih = Math.max(0.02, h - puff)
            const depth = puff * 0.5 // 前后也要有厚度，不然只是一块鼓边的饼
            const geo = new THREE.ExtrudeGeometry(roundedRect(iw, ih, Math.min(iw, ih) * 0.45), {
              depth,
              bevelEnabled: true,
              bevelThickness: puff * 0.62,
              bevelSize: puff / 2,
              bevelSegments: 9,
              curveSegments: 16,
            })
            geo.translate(0, 0, -depth / 2)
            bbDispose.push(geo)
            return geo
          }
          // 字母都按「高度 = 1」来做，最后整体缩放
          const letters = {
            H: (foil) => {
              const l = new THREE.Group()
              const stem = 0.32
              const span = 1.06
              for (const sx of [-(span - stem) / 2, (span - stem) / 2]) {
                const m = new THREE.Mesh(puffyBar(stem, 1), foil)
                m.position.x = sx
                l.add(m)
              }
              l.add(new THREE.Mesh(puffyBar(span - stem * 1.35, stem * 0.95), foil))
              return { grp: l, w: span }
            },
            I: (foil) => {
              const l = new THREE.Group()
              l.add(new THREE.Mesh(puffyBar(0.36, 1), foil))
              return { grp: l, w: 0.36 }
            },
          }

          const text = (FACE.balloon.text || 'HI').toUpperCase()
          const GAP = 0.2
          const colors = FACE.balloon.colors || []
          const built = [...text].map((ch, i) =>
            (letters[ch] || letters.I)(mkFoil(colors[i] || FACE.balloon.color || '#9ea7b1')),
          )
          const totalW = built.reduce((s, b) => s + b.w, 0) + GAP * (built.length - 1)
          // 整排字母正好塞进留出来的空位（留一点点边）
          const scale = (slotW * 1.02) / totalW
          let x = -totalW / 2
          const TILT = [-0.1, 0.12, -0.08, 0.09] // 每个字母歪一点点，别站得太规矩
          const parts = built.map((b, i) => {
            b.grp.position.x = x + b.w / 2
            b.grp.rotation.z = TILT[i % TILT.length]
            x += b.w + GAP
            grp.add(b.grp)
            return b.grp
          })
          grp.scale.setScalar(scale)

          billboardRefs.balloon = {
            grp,
            parts,
            baseX: grp.position.x,
            baseY: grp.position.y,
            size: slotW,
            scale,
          }
        }
      }

      // 行内小动画（比如 Hi, 后面挥手的手）：贴图是一张逐帧横排的 png，渲染循环里按帧率换帧。
      // 位置是上面画文字时量出来的（faceBoxes），所以文案一改它会跟着挪。
      if (FACE.inline && faceBoxes.length) {
        billboardRefs.sprites = faceBoxes
          .map((box) => {
            const cfg = FACE.inline[box.name]
            if (!cfg) return null
            const tex = new THREE.TextureLoader().load(cfg.sprite)
            tex.colorSpace = THREE.SRGBColorSpace
            tex.anisotropy = renderer.capabilities.getMaxAnisotropy()
            tex.magFilter = THREE.LinearFilter
            tex.minFilter = THREE.LinearMipmapLinearFilter
            tex.repeat.set(1 / cfg.frames, 1)
            const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, depthWrite: false })
            const geo = new THREE.PlaneGeometry(1, 1)
            bbDispose.push(tex, mat, geo)
            const m = new THREE.Mesh(geo, mat)
            const size = panelMain.s(box.size)
            m.position.set(panelMain.x(box.cx), panelMain.y(box.cy), panelMain.z)
            m.scale.set(size, size, 1)
            m.renderOrder = 2
            g.add(m) // 挥手在上牌上，不跟着晃
            return { tex, frames: cfg.frames, fps: cfg.fps ?? 12 }
          })
          .filter(Boolean)
      }

      // 三张圆形照片：贴在画面右边，广告牌立起来的过程中一张张「冒」出来（见渲染循环）
      if (PHOTOS.length) {
        billboardRefs.photos = PHOTOS.map((ph, i) => {
          // 照片先裁成正方形（居中 cover），再用圆形面片贴上去
          const pc = document.createElement('canvas')
          pc.width = pc.height = 512
          const px = pc.getContext('2d')
          px.fillStyle = '#eeeeee'
          px.fillRect(0, 0, 512, 512)
          const tex = new THREE.CanvasTexture(pc)
          tex.colorSpace = THREE.SRGBColorSpace
          tex.anisotropy = renderer.capabilities.getMaxAnisotropy()
          const img = new Image()
          img.onload = () => {
            const k = Math.max(512 / img.naturalWidth, 512 / img.naturalHeight)
            const w = img.naturalWidth * k
            const h = img.naturalHeight * k
            px.drawImage(img, (512 - w) / 2, (512 - h) / 2, w, h)
            tex.needsUpdate = true
          }
          img.src = ph.src

          const size = panelSide.s(ph.r)
          const grp = new THREE.Group()
          grp.position.set(panelSide.x(ph.cx), panelSide.y(ph.cy), panelSide.z)
          hang.add(grp)

          // 白色描边（后面大一圈的圆）
          const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false, transparent: true, depthWrite: false })
          const ringGeo = new THREE.CircleGeometry(0.56, 48)
          const ring = new THREE.Mesh(ringGeo, ringMat)
          ring.renderOrder = 2
          grp.add(ring)

          const photoMat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, transparent: true, depthWrite: false })
          const photoGeo = new THREE.CircleGeometry(0.5, 48)
          const photo = new THREE.Mesh(photoGeo, photoMat)
          photo.position.z = 0.006
          photo.renderOrder = 3
          grp.add(photo)

          bbDispose.push(tex, ringMat, ringGeo, photoMat, photoGeo)
          grp.scale.setScalar(0.001)
          return { grp, size, baseY: grp.position.y, delay: i * 0.12 }
        })
      }

      // 底部走道：一块平台 + 前面一排栏杆 + 平台下面一根横梁，横梁上挂一排朝上的灯
      const WW = TOTAL_W - 0.4 // 走道比整组牌子略窄
      add(new THREE.BoxGeometry(WW, 0.12, 1.3), steel, 0, walkY, 0.25)
      add(new THREE.BoxGeometry(WW, 0.22, 0.22), steelDark, 0, walkY - 0.2, 0.0) // 平台下横梁
      add(new THREE.CylinderGeometry(0.045, 0.045, WW, 12), steel, 0, walkY + 0.85, 0.88, 0, 0, Math.PI / 2)
      add(new THREE.CylinderGeometry(0.035, 0.035, WW, 12), steel, 0, walkY + 0.45, 0.88, 0, 0, Math.PI / 2)
      for (let k = 0; k <= 10; k++) {
        const xx = -WW / 2 + (k * WW) / 10
        add(new THREE.CylinderGeometry(0.035, 0.035, 0.86, 10), steel, xx, walkY + 0.43, 0.88)
      }
      // 面板和走道之间的几根短连接
      for (const xx of [-TOTAL_W * 0.38, -TOTAL_W * 0.13, TOTAL_W * 0.13, TOTAL_W * 0.38]) {
        add(new THREE.BoxGeometry(0.12, 0.8, 0.12), steelDark, xx, walkY + 0.45, -0.15)
      }
      // 平台前沿下方一排朝上的小灯
      for (let k = 0; k < 6; k++) {
        const xx = -TOTAL_W * 0.4 + (k * TOTAL_W * 0.8) / 5
        add(new THREE.CylinderGeometry(0.03, 0.03, 0.35, 8), steelDark, xx, walkY - 0.28, 0.75)
        add(new THREE.CylinderGeometry(0.26, 0.18, 0.12, 20), steelDark, xx, walkY - 0.48, 0.75)
      }

      // 两根细长立柱（埋进地里一截） + 底部一根横撑
      const LEG_X = TOTAL_W * 0.26
      for (const xx of [-LEG_X, LEG_X]) {
        const legH = walkY - 0.3 + 2.2
        add(new THREE.CylinderGeometry(0.2, 0.22, legH, 28), glassLeg, xx, legH / 2 - 2.2, -0.05)
      }
      add(new THREE.CylinderGeometry(0.08, 0.08, LEG_X * 2, 14), glassLeg, 0, 1.6, -0.05, 0, 0, Math.PI / 2)
      // 左柱上的检修爬梯
      for (const dx of [-0.32, 0.32]) {
        add(new THREE.CylinderGeometry(0.03, 0.03, walkY + 0.2, 8), steelDark, -LEG_X - 0.9 + dx, (walkY + 0.2) / 2, 0.15)
      }
      for (let yy = 0.8; yy < walkY; yy += 0.55) {
        add(new THREE.CylinderGeometry(0.025, 0.025, 0.64, 8), steelDark, -LEG_X - 0.9, yy, 0.15, 0, 0, Math.PI / 2)
      }
      // --- 广告牌周围的真草 ---
      // 地形本身是平滑网格，近看像塑料。这里在广告牌周围撒十几万根立体草叶（InstancedMesh），
      // 每根：底部暗、尖端亮；颜色取所在高度的地形色；随风轻轻摆；接收广告牌的影子。
      // 越靠外越稀、越矮，边缘自然融回原来的山丘。
      const GRASS_R = billboard.grassRadius ?? 42
      // 手机 / 小屏上草少一点，免得卡
      const GRASS_N = billboard.grassCount ?? (window.innerWidth < 768 ? 70000 : 240000)
      const bladeGeo = (() => {
        // 一根草：4 段、越往上越窄、带一点向前的弯，尖端收成一点
        const segs = 4
        const wBase = 0.13
        const pos = []
        const col = []
        const idx = []
        for (let i = 0; i <= segs; i++) {
          const t = i / segs
          const w = wBase * (1 - t) * (1 - t * 0.15)
          const bend = t * t * 0.22
          pos.push(-w / 2, t, bend, w / 2, t, bend)
          const c = 0.72 + t * 0.9 // 根部暗 → 尖端亮
          col.push(c, c, c, c, c, c)
        }
        for (let i = 0; i < segs; i++) {
          const a = i * 2
          idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
        }
        const bg = new THREE.BufferGeometry()
        bg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
        bg.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
        // 法线统一朝上：草丛整体受光柔和一致，不会因为叶片朝向乱闪
        const nrm = new Float32Array(pos.length)
        for (let i = 1; i < nrm.length; i += 3) nrm[i] = 1
        bg.setAttribute('normal', new THREE.BufferAttribute(nrm, 3))
        bg.setIndex(idx)
        return bg
      })()
      const grassUniforms = { uTime: { value: 0 } }
      const grassMat = new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide })
      grassMat.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = grassUniforms.uTime
        shader.vertexShader = shader.vertexShader
          .replace('#include <common>', '#include <common>\nuniform float uTime;')
          .replace(
            '#include <begin_vertex>',
            `#include <begin_vertex>
            vec4 gRoot = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
            float gw = sin(uTime * 1.3 + gRoot.x * 0.21 + gRoot.z * 0.17) * 0.6
                     + sin(uTime * 2.9 + gRoot.x * 0.83 - gRoot.z * 0.51) * 0.25;
            float gk = position.y * position.y;
            transformed.z += gw * gk * 0.16;
            transformed.x += gw * gk * 0.07;`,
          )
      }
      bbDispose.push(bladeGeo, grassMat)

      const grass = new THREE.InstancedMesh(bladeGeo, grassMat, GRASS_N)
      grass.receiveShadow = true
      const gM = new THREE.Matrix4()
      const gQ = new THREE.Quaternion()
      const gE = new THREE.Euler()
      const gS = new THREE.Vector3()
      const gP = new THREE.Vector3()
      const gC = new THREE.Color()
      let placed = 0
      let tries = 0
      while (placed < GRASS_N && tries < GRASS_N * 4) {
        tries++
        const r = GRASS_R * Math.sqrt(Math.random())
        const a = Math.random() * Math.PI * 2
        const edge = r / GRASS_R // 0 中心 → 1 边缘
        if (Math.random() < edge * edge * edge) continue // 越往外越稀
        const x = bx + Math.cos(a) * r
        const z = bz + Math.sin(a) * r
        const h = heightAt(x, z)
        // 草色 = 所在高度的地形色，带一点随机明暗；成簇的地方稍亮
        let t = THREE.MathUtils.clamp((h + 13) / 36, 0, 1)
        t = THREE.MathUtils.clamp((t - 0.5) * 1.4 + 0.5, 0, 1)
        if (t < 0.5) gC.copy(cLow).lerp(cMid, t / 0.5)
        else gC.copy(cMid).lerp(cHigh, (t - 0.5) / 0.5)
        const clump = vnoise(x * 0.35, z * 0.35)
        // 草叶法线朝上、受光比斜坡上的地面少，所以整体提亮一截，才能和旁边的地面对上
        gC.multiplyScalar((0.75 + clump * 0.5 + (Math.random() - 0.5) * 0.22) * 1.75)
        const tall = (0.55 + Math.random() * 0.75) * (1 - edge * 0.55) * (0.8 + clump * 0.45)
        gE.set((Math.random() - 0.5) * 0.35, Math.random() * Math.PI * 2, (Math.random() - 0.5) * 0.35)
        gQ.setFromEuler(gE)
        gS.set(0.8 + Math.random() * 0.6, tall, 0.8 + Math.random() * 0.6)
        gP.set(x, h - 0.04, z)
        gM.compose(gP, gQ, gS)
        grass.setMatrixAt(placed, gM)
        grass.setColorAt(placed, gC)
        placed++
      }
      grass.count = placed
      grass.instanceMatrix.needsUpdate = true
      if (grass.instanceColor) grass.instanceColor.needsUpdate = true
      grass.frustumCulled = false
      scene.add(grass)
      billboardRefs.grassUniforms = grassUniforms
      billboardRefs.group = g
      billboardRefs.baseY = g.position.y
      // 聚焦（点开 About）对准的是主牌：About 内容铺在主牌那块白画面上
      billboardRefs.faceLocal = new THREE.Vector3(MAIN_X, panelY, D / 2 + 0.045)
      billboardRefs.faceW = W + BORDER * 2
      billboardRefs.faceTL = new THREE.Vector3(MAIN_X - W / 2, panelY + Hh / 2, D / 2 + 0.045)
      billboardRefs.faceBR = new THREE.Vector3(MAIN_X + W / 2, panelY - Hh / 2, D / 2 + 0.045)
      billboardRefs.faceRadius = Math.max(0.05, RADIUS - BORDER) / W // 圆角占画面宽度的比例
      billboardRefs.faceH = Hh + BORDER * 2
      billboardRefs.rise = 11.7 * g.scale.y * 0.45 // 没立起来时往下沉多少（大约整块高度的 45%）

      // 太阳只给广告牌投影：光的方向不变（和原来的 sun 同方向），阴影相机框住广告牌周围
      const sunDir = new THREE.Vector3(-46, 20, 14).normalize()
      const sPos = g.position.clone().add(new THREE.Vector3(0, panelY * 0.5 * g.scale.y, 0))
      sun.position.copy(sPos).addScaledVector(sunDir, 70)
      sun.target.position.copy(sPos)
      scene.add(sun.target)
      sun.castShadow = true
      sun.shadow.mapSize.set(2048, 2048)
      sun.shadow.camera.near = 10
      sun.shadow.camera.far = 160
      sun.shadow.camera.left = -45
      sun.shadow.camera.right = 45
      sun.shadow.camera.top = 45
      sun.shadow.camera.bottom = -45
      sun.shadow.bias = -0.0006
      sun.shadow.normalBias = 0.04
      sun.shadow.radius = 3
      terrain.receiveShadow = true

    }

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
    const PCOUNT = Math.max(1, Math.round(460 * particleScale))
    const pPos = new Float32Array(PCOUNT * 3)
    const pBase = new Float32Array(PCOUNT * 3) // 原始位置，浮动围绕它抖
    const pPhase = new Float32Array(PCOUNT)
    const pColArr = new Float32Array(PCOUNT * 3)
    const cWhite = new THREE.Color(0xffffff)
    const cDark = new THREE.Color(0x141414) // 深灰近黑（配合灰阶山丘）
    for (let i = 0; i < PCOUNT; i++) {
      const x = (Math.random() - 0.5) * 170
      const z = (Math.random() - 0.5) * 120 - 8
      const y = 2 + Math.random() * 36
      pBase[i * 3] = x; pBase[i * 3 + 1] = y; pBase[i * 3 + 2] = z
      pPos[i * 3] = x; pPos[i * 3 + 1] = y; pPos[i * 3 + 2] = z
      pPhase[i] = Math.random() * Math.PI * 2
      const c = Math.random() < 0.5 ? cWhite : cDark
      pColArr[i * 3] = c.r; pColArr[i * 3 + 1] = c.g; pColArr[i * 3 + 2] = c.b
    }
    const pgeo = new THREE.BufferGeometry()
    pgeo.setAttribute('position', new THREE.Float32BufferAttribute(pPos, 3))
    pgeo.setAttribute('color', new THREE.Float32BufferAttribute(pColArr, 3))
    // 清晰硬边小圆点贴图（不要柔化模糊）：实心圆 + alphaTest 裁出锐利边缘
    const dotC = document.createElement('canvas')
    dotC.width = dotC.height = 32
    const dctx = dotC.getContext('2d')
    dctx.fillStyle = '#fff'
    dctx.beginPath()
    dctx.arc(16, 16, 12, 0, Math.PI * 2)
    dctx.fill()
    const dotTex = new THREE.CanvasTexture(dotC)
    const particles = new THREE.Points(
      pgeo,
      new THREE.PointsMaterial({
        size: 0.45, // 更细
        map: dotTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
        sizeAttenuation: true,
        fog: true,
        alphaTest: 0.5, // 锐利边缘、清晰颗粒
      }),
    )
    scene.add(particles)

    // --- 交互：hover 时鼠标位置驱动相机平移（pan to move） ---
    let targetX = 0, targetY = 0, curX = 0, curY = 0
    // 监听挂在 mount（外层容器）上，而非 canvas：鼠标移到方块（容器的子元素）上时
    // 不会触发容器的 pointerleave，避免「pan→方块移动→leave→回正」的抖动死循环。
    // 鼠标在画布里的像素位置（含 devicePixelRatio），给「读一个像素判断明暗」用
    let probeX = -1
    let probeY = -1
    const onMove = (e) => {
      const r = mount.getBoundingClientRect()
      targetX = ((e.clientX - r.left) / r.width) * 2 - 1
      targetY = ((e.clientY - r.top) / r.height) * 2 - 1
      const dpr = renderer.getPixelRatio()
      probeX = Math.round((e.clientX - r.left) * dpr)
      probeY = Math.round((e.clientY - r.top) * dpr)
    }
    const onLeave = () => {
      targetX = 0
      targetY = 0
      probeX = -1
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
    const probePixel = new Uint8Array(4) // 读像素用的小缓冲，只建一次
    let probeFrame = 0 // 帧计数：每 4 帧才读一次像素
    const occRay = new THREE.Raycaster()
    const occDir = new THREE.Vector3()
    const look = new THREE.Vector3(0, 2, -30)
    const camPos = new THREE.Vector3()
    const faceC = new THREE.Vector3()
    const faceN = new THREE.Vector3()
    const focusPos = new THREE.Vector3()
    const tmpQ = new THREE.Quaternion()
    const ovA = new THREE.Vector3()
    const ovB = new THREE.Vector3()
    let focusF = mountFocusRef.current ? 1 : 0
    let lastFe = -1 // 先设成不可能的值，保证第一帧一定按当前聚焦程度重算一次投影
    let lastT = 0

    // --- 点击广告牌 → 聚焦；聚焦时点别处 / Esc / Back → 退出 ---
    const pickRay = new THREE.Raycaster()
    const pickNdc = new THREE.Vector2()
    const hitsBillboard = (e) => {
      if (!billboardRefs.group) return false
      const r = el.getBoundingClientRect()
      pickNdc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
      pickRay.setFromCamera(pickNdc, camera)
      return pickRay.intersectObject(billboardRefs.group, true).length > 0
    }
    // 把画布滚到屏幕正中，聚焦时整块广告牌都在视野里
    const centerCanvas = (instant = false) => {
      const r = mount.getBoundingClientRect()
      const top = Math.max(0, window.scrollY + r.top - Math.max(0, (window.innerHeight - r.height) / 2))
      if (Math.abs(top - window.scrollY) < 24) return
      window.scrollTo({ top, behavior: instant ? 'auto' : 'smooth' })
    }
    const setFocus = (on) => {
      focusTargetRef.current = on ? 1 : 0
      setFocused(on)
      onFocusChangeRef.current?.(on)
      if (on) {
        centerCanvas()
        // 直接从 /aboutme 打开时，标题测量完会把山丘整体上移（marginTop），
        // 刚才算的位置就偏了 —— 等布局落定再校正一次。
        setTimeout(() => focusTargetRef.current === 1 && centerCanvas(), 500)
      }
    }
    focusApiRef.current.setFocus = setFocus
    focusApiRef.current.center = centerCanvas
    // 进来时就该是聚焦状态（从别的页面点 About）：直接摆成对焦画面，不播动画、不平滑滚动
    if (mountFocusRef.current) {
      mountFocusRef.current = false
      focusTargetRef.current = 1
      setFocused(true)
      onFocusChangeRef.current?.(true)
      centerCanvas(true)
      setTimeout(() => focusTargetRef.current === 1 && centerCanvas(true), 400) // 等标题测量把山丘挪完再校一次
    }
    const onClick = (e) => {
      if (e.target.closest?.('[data-marker], [data-hillcard], [data-bb-ui]')) return
      const hit = hitsBillboard(e)
      if (focusTargetRef.current === 0 && hit) setFocus(true)
      else if (focusTargetRef.current === 1 && !hit) setFocus(false)
    }
    const onHover = (e) => {
      if (!billboardRefs.group) return
      mount.style.cursor = focusTargetRef.current === 0 && hitsBillboard(e) ? 'pointer' : 'grab'
    }
    const onKey = (e) => {
      if (e.key === 'Escape' && focusTargetRef.current === 1) setFocus(false)
    }
    mount.addEventListener('click', onClick)
    mount.addEventListener('pointermove', onHover)
    window.addEventListener('keydown', onKey)

    let running = true
    let raf = 0
    const loop = () => {
      if (!running) return
      raf = requestAnimationFrame(loop)
      const t = clock.getElapsedTime()
      const dt = Math.min(0.1, t - lastT)
      lastT = t
      // 聚焦进度：指数逼近目标，再套一层 smoothstep，进出都是慢起慢停
      focusF += (focusTargetRef.current - focusF) * (REDUCE ? 1 : 1 - Math.exp(-dt * 2.6))
      if (Math.abs(focusTargetRef.current - focusF) < 0.0005) focusF = focusTargetRef.current
      const fe = focusF * focusF * (3 - 2 * focusF)

      // 广告牌随滚动「立起来」：从沉在草里、往后仰，平滑升到完全竖直；聚焦时强制完全立好、不倾斜
      let riseE = 1 // 广告牌立起来的进度，照片的弹出跟着它走
      if (billboardRefs.group) {
        const raw = !progressRef.current || REDUCE ? 1 : Math.min(1, Math.max(0, progressRef.current()))
        let e = raw < 0.5 ? 4 * raw * raw * raw : 1 - Math.pow(-2 * raw + 2, 3) / 2
        e += (1 - e) * fe
        riseE = e
        const gg = billboardRefs.group
        gg.position.y = billboardRefs.baseY - billboardRefs.rise * (1 - e)
        gg.rotation.x = -0.2 * (1 - e)
        gg.updateMatrixWorld()
      }

      // 箭头：弹 0.8 秒（左右晃两下、越晃越小，同时轻轻放大一下），然后停 2 秒
      if (billboardRefs.arrow) {
        const ARROW_BOUNCE = 0.8
        const ARROW_REST = 2
        const ph = REDUCE ? ARROW_BOUNCE : t % (ARROW_BOUNCE + ARROW_REST)
        let dx = 0
        let pop = 1
        if (ph < ARROW_BOUNCE) {
          const p = ph / ARROW_BOUNCE
          const damp = (1 - p) * (1 - p)
          dx = Math.sin(p * Math.PI * 4) * damp * billboardRefs.arrowSize * 0.22
          pop = 1 + Math.sin(p * Math.PI) * 0.08 * (1 - p)
        }
        billboardRefs.arrow.position.x = billboardRefs.arrowBase + dx
        billboardRefs.arrow.scale.set(billboardRefs.arrowSize * pop, billboardRefs.arrowSize * pop, 1)
      }

      // 吊在链子上的下牌：绕吊点左右轻轻晃（两个频率叠加，不那么机械）
      if (billboardRefs.hang) {
        billboardRefs.hang.rotation.z = REDUCE
          ? 0
          : Math.sin(t * 0.62) * 0.028 + Math.sin(t * 0.37 + 1.3) * 0.014
      }

      // HI 字母气球：整排上下慢慢漂 + 轻微倾斜，每个字母再各自错开一点，像各飘各的
      if (billboardRefs.balloon && !REDUCE) {
        const b = billboardRefs.balloon
        b.grp.position.y = b.baseY + Math.sin(t * 0.8) * b.size * 0.09
        b.grp.position.x = b.baseX + Math.sin(t * 0.51 + 1.1) * b.size * 0.04
        b.grp.rotation.z = Math.sin(t * 0.63 + 0.4) * 0.05
        b.parts.forEach((pGrp, i) => {
          pGrp.position.y = Math.sin(t * 1.05 + i * 1.6) * 0.05
          pGrp.rotation.z = Math.sin(t * 0.77 + i * 2.1) * 0.06
        })
      }

      // 行内小动画：按帧率切贴图上的一格
      if (billboardRefs.sprites) {
        for (const sp of billboardRefs.sprites) {
          sp.tex.offset.x = (Math.floor(t * sp.fps) % sp.frames) / sp.frames
        }
      }

      // 三张圆形照片：跟着广告牌立起来一张张弹出（带一点回弹），之后轻轻上下浮
      if (billboardRefs.photos) {
        for (const ph of billboardRefs.photos) {
          const k = Math.min(1, Math.max(0, (riseE - 0.25 - ph.delay) / 0.4))
          // easeOutBack：冲过头一点再回来，看起来是「冒」出来的
          const kk = k >= 1 ? 1 : 1 + 2.7 * Math.pow(k - 1, 3) + 1.7 * Math.pow(k - 1, 2)
          const bob = REDUCE ? 0 : Math.sin(t * 1.1 + ph.delay * 14) * 0.035
          ph.grp.scale.setScalar(Math.max(0.0001, ph.size * kk * (1 + bob * 0.4)))
          ph.grp.position.y = ph.baseY + bob * ph.size * 0.5
        }
      }

      curX += (targetX - curX) * 0.05
      curY += (targetY - curY) * 0.05
      const calm = 1 - fe // 聚焦时不再跟着鼠标晃、也不漂移
      const drift = REDUCE ? 0 : Math.sin(t * 0.08) * 1.0 // 自身缓慢漂移（更弱）
      const zoomK = fov / 50 // 视角拉近后画面被放大，平移幅度跟着按比例缩小，手感不变
      camPos.set((curX * 4 + drift) * zoomK * calm, 17 - curY * 1.2 * zoomK * calm, 60)
      look.set((curX * 13 + drift * 0.6) * zoomK * calm, lookY + curY * 1.0 * zoomK * calm, -30)

      if (fe > 0 && billboardRefs.group) {
        const w0 = mount.clientWidth, h0 = mount.clientHeight
        // 正对画面：相机放在画面中心沿法线往外的位置，距离刚好把整块广告牌（含边框）装进画布
        faceC.copy(billboardRefs.faceLocal).applyMatrix4(billboardRefs.group.matrixWorld)
        faceN.set(0, 0, 1).applyQuaternion(billboardRefs.group.getWorldQuaternion(tmpQ)).normalize()
        const tanV = Math.tan(THREE.MathUtils.degToRad(fov) / 2)
        const sc = billboardRefs.group.scale.y
        const margin = 1.1
        const distV = (billboardRefs.faceH * sc * margin) / 2 / tanV
        const distH = (billboardRefs.faceW * sc * margin) / 2 / (tanV * (w0 / h0))
        focusPos.copy(faceC).addScaledVector(faceN, Math.max(distV, distH))
        camPos.lerp(focusPos, fe)
        look.lerp(faceC, fe)
      }
      if (fe !== lastFe) {
        // 聚焦时把「底部加高」的偏移去掉，画面中心 = 广告牌中心
        applyProjection(camera, mount.clientWidth, mount.clientHeight, 1 - fe)
        lastFe = fe
      }
      camera.position.copy(camPos)
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
      if (billboardRefs.grassUniforms && !REDUCE) billboardRefs.grassUniforms.uTime.value = t
      renderer.render(scene, camera)
      if (el.style.opacity !== '1') el.style.opacity = '1' // 第一帧画完，淡入

      // 刚画完，趁缓冲还在，读鼠标底下那一个像素，告诉自定义鼠标这里是深是浅。
      // 每 4 帧一次、只读 1 像素；鼠标不在画布上就不读。
      if (probeX >= 0 && probeFrame++ % 4 === 0) {
        const gl = renderer.getContext()
        const w = gl.drawingBufferWidth
        const h = gl.drawingBufferHeight
        if (probeX < w && probeY < h) {
          gl.readPixels(probeX, h - probeY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, probePixel)
          const [pr, pg, pb, pa] = probePixel
          setCanvasProbe(renderer.domElement, {
            // 天空是透明的（alpha 很低）→ 交回给外面按页面背景色判断
            dark: pa > 120 ? (0.2126 * pr + 0.7152 * pg + 0.0722 * pb) / 255 < 0.5 : null,
            t: performance.now(),
          })
        }
      }

      // 聚焦快结束时，把内容层淡入、盖在白色画面的屏幕位置上（相机停住了，位置基本不变；pan / 缩放窗口也会跟上）
      const ov = overlayRef.current
      if (ov && billboardRefs.faceTL) {
        if (fe > 0.001) {
          const w1 = mount.clientWidth, h1 = mount.clientHeight
          ovA.copy(billboardRefs.faceTL).applyMatrix4(billboardRefs.group.matrixWorld).project(camera)
          ovB.copy(billboardRefs.faceBR).applyMatrix4(billboardRefs.group.matrixWorld).project(camera)
          const l = (ovA.x * 0.5 + 0.5) * w1
          const tp = (-ovA.y * 0.5 + 0.5) * h1
          const wd = (ovB.x * 0.5 + 0.5) * w1 - l
          const ht = (-ovB.y * 0.5 + 0.5) * h1 - tp
          const o = THREE.MathUtils.smoothstep(fe, 0.85, 1)
          ov.style.visibility = 'visible'
          ov.style.transform = `translate(${l.toFixed(1)}px, ${tp.toFixed(1)}px)`
          ov.style.width = `${wd.toFixed(1)}px`
          ov.style.height = `${ht.toFixed(1)}px`
          ov.style.borderRadius = `${(billboardRefs.faceRadius * wd).toFixed(1)}px`
          ov.style.opacity = o.toFixed(3)
          updateThumbRef.current?.()
          ov.style.pointerEvents = o > 0.9 ? 'auto' : 'none'
        } else if (ov.style.visibility !== 'hidden') {
          ov.style.visibility = 'hidden'
          ov.style.opacity = '0'
          ov.style.pointerEvents = 'none'
          if (scrollRef.current) scrollRef.current.scrollTop = 0 // 下次点开从头看
        }
      }
      // 标记：把世界坐标投影到屏幕，让方块贴合地形随 pan 一起移动
      const w = mount.clientWidth, h = mount.clientHeight
      for (let i = 0; i < markerWorld.length; i++) {
        projV.copy(markerWorld[i]).project(camera)
        const sx = (projV.x * 0.5 + 0.5) * w
        const sy = (-projV.y * 0.5 + 0.5) * h
        let visible = projV.z <= 1
        // 方块在广告牌后面 → 被挡住，隐藏（DOM 方块本身不会被 3D 物体遮挡，只能自己判断）
        if (visible && billboardRefs.group) {
          occDir.copy(markerWorld[i]).sub(camera.position)
          const d = occDir.length()
          occRay.set(camera.position, occDir.normalize())
          occRay.far = d
          if (occRay.intersectObject(billboardRefs.group, true).length) visible = false
        }
        screen[i][0] = sx; screen[i][1] = sy; screen[i][2] = visible
        const elm = markerRefs.current[i]
        if (elm) {
          elm.style.transform = `translate(-50%, -50%) translate(${sx}px, ${sy}px)`
          elm.style.opacity = visible ? '1' : '0' // 转到相机背后 / 被广告牌挡住就隐藏
          elm.style.pointerEvents = visible ? '' : 'none'
        }
      }
      // 选中的方块：卡片 + 连接线跟随（每帧根据方块屏幕位置更新）
      const ai = activeRef.current
      if (ai != null && screen[ai] && cardRef.current && linePathRef.current) {
        const [msx, msy] = screen[ai]
        let cx = msx + 70, cy = msy - 175 // 卡片放在方块右上方
        cx = Math.max(8, Math.min(cx, w - CARD_W - 8)) // 夹在容器内，任意宽度可见
        // 用卡片真实高度夹取，避免内容变多后底部被容器裁掉（iPad+ 尤其明显）
        const cardH = cardRef.current.offsetHeight || CARD_H
        cy = Math.max(8, Math.min(cy, h - cardH - 8))
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
      applyProjection(camera, w, h, 1 - lastFe)
      renderer.setSize(w, h)
      reportSkyline()
    })
    ro.observe(mount)

    // --- 清理 ---
    return () => {
      running = false
      cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', onVis)
      document.removeEventListener('pointerdown', onDocDown)
      mount.removeEventListener('click', onClick)
      mount.removeEventListener('pointermove', onHover)
      window.removeEventListener('keydown', onKey)
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
      dotTex.dispose()
      bbDispose.forEach((d) => d.dispose())
      renderer.dispose()
      if (el.parentNode === mount) mount.removeChild(el)
    }
    }
    // 正常情况下等两帧（页面先画出来）；页面在后台时 rAF 会被降频，所以再加一个定时器兜底，谁先到用谁
    let started = false
    const start = () => {
      if (started || cancelled) return
      started = true
      dispose = build()
    }
    const raf0 = requestAnimationFrame(() => requestAnimationFrame(start))
    const timer0 = setTimeout(start, 150)
    return () => {
      cancelled = true
      cancelAnimationFrame(raf0)
      clearTimeout(timer0)
      dispose?.()
    }
  }, [])

  // 外面传进来的聚焦状态（跟着地址栏走）：和组件内部点击聚焦共用一套状态。
  // 必须放在上面那个主 effect 之后 —— setFocus 是在主 effect 里准备好的。
  // 已经是这个状态就不重复触发，避免「点广告牌 → 改地址 → 又触发一次」绕圈。
  // 画布被整体挪动后（首页量完标题会挪一次），聚焦中的话重新居中
  useEffect(() => {
    if (focusTargetRef.current === 1) focusApiRef.current.center?.()
  }, [layoutShift])

  useEffect(() => {
    if (autoFocus == null) return
    if (autoFocus && focusTargetRef.current !== 1) focusApiRef.current.setFocus?.(true)
    else if (!autoFocus && focusTargetRef.current === 1) focusApiRef.current.setFocus?.(false)
  }, [autoFocus])

  return (
    <div
      ref={mountRef}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ height, cursor: 'grab' }}
    >
      {/* 聚焦后铺在广告牌白色画面上的内容，可滚动 */}
      {billboard && billboardContent && (
        <div
          ref={overlayRef}
          data-bb-ui
          className="absolute left-0 top-0 z-20 overflow-hidden bg-white"
          style={{ visibility: 'hidden', opacity: 0, pointerEvents: 'none', cursor: 'auto' }}
        >
          <div
            ref={scrollRef}
            data-about-scroll
            className="bb-scroll h-full w-full overflow-y-auto overflow-x-hidden overscroll-contain"
            onScroll={updateThumb}
          >
            {billboardContent}
          </div>
          {/* 自绘滚动条：缩在白框里面，上下各让开圆角 */}
          <div className="pointer-events-none absolute bottom-8 right-3 top-8 w-[5px] rounded-full bg-black/[0.06]">
            <div ref={thumbRef} className="absolute left-0 right-0 top-0 rounded-full bg-black/25" />
          </div>
        </div>
      )}
      {/* 聚焦广告牌时的返回按钮 */}
      {billboard && (
        <button
          type="button"
          data-bb-ui
          onClick={() => focusApiRef.current.setFocus?.(false)}
          className={`absolute left-6 top-6 z-30 flex items-center gap-2 rounded-full bg-black/55 px-4 py-2 text-[14px] text-white backdrop-blur-md transition-all duration-500 hover:bg-black/75 ${
            focused ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
          }`}
        >
          <span aria-hidden>←</span> Back
        </button>
      )}
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
