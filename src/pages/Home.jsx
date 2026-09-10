import avatar from '../assets/home/avatar.png'
import heroLoop from '../assets/home/videos/hero-loop.mp4'
import workNexus from '../assets/home/work-nexus.jpg'
import workHiveai from '../assets/home/work-hiveai.jpg'
import workLepal from '../assets/home/work-lepal.jpg'
import workSkinlab from '../assets/home/work-skinlab.jpg'
import workGlobbbe from '../assets/home/work-globbbe.jpg'
import hiveRebrandCover from '../assets/home/hiverebrandcover.png'
import hiveBrandingCover from '../assets/hive-branding/poster1.png'
// 画廊封面素材统一放 assets/covers/<项目>/，文件名前缀数字 = 播放顺序（见该目录 README）
import hiveHeroVid from '../assets/covers/hive-rebranding/01-hero.mp4'
import hiveIns1 from '../assets/covers/hive-rebranding/02-ins1.png'
import hivePoster1 from '../assets/covers/hive-rebranding/03-poster1.png'
import hiveDemo1Vid from '../assets/covers/hive-rebranding/04-demo1.mp4'
import hiveKeyVisualVid from '../assets/covers/hive-rebranding/05-keyvisual.mp4'
import htIpad2 from '../assets/covers/heartie/01-ipad2.png'
import htCover from '../assets/covers/heartie/02-cover.png'
import htWatch from '../assets/covers/heartie/03-watch.png'
import htIpad1 from '../assets/covers/heartie/04-ipad1.png'
import htAd1 from '../assets/covers/heartie/05-ad1.png'
import htMerch1 from '../assets/covers/heartie/06-merch1.png'
import hkCover from '../assets/covers/heykura/01-cover.jpg'
import hkVideo from '../assets/covers/heykura/02-covervideo.mp4'
import pmImg31 from '../assets/covers/primus/01-3.1.png'
import pmImg12 from '../assets/covers/primus/02-12.png'
import pmImg18 from '../assets/covers/primus/03-18.png'
import pmVid1 from '../assets/covers/primus/04-1.mp4'
import lpCover from '../assets/covers/lepal/01-work-lepal.jpg'
import hayCoverImg from '../assets/covers/hay/01-14.png'
import flowithBg from '../assets/covers/flowith/bg.png'
import flowithMain from '../assets/covers/flowith/main.mp4'
import pkScreen1 from '../assets/covers/parkinson/01-screen1.png'
import pkScreen2 from '../assets/covers/parkinson/02-screen2.png'
import kevHero from '../assets/covers/kevzara/01-hero.png'
import jakHero from '../assets/covers/jakafi/01-hero.png'
import nikHero from '../assets/covers/niktimvo/01-hero.png'
import soundscapeImg from '../assets/covers/Soundscape/01-soundscape.jpg'
import solarxImg from '../assets/covers/SolarX/01-solarx.jpg'
import foodDeliveryImg from '../assets/covers/Food Delivery/01-food-delivery.jpg'
import hayCover from '../assets/hay/14.png'
import primusVid1 from '../assets/primus/1.mp4'
import primusImg31 from '../assets/primus/3.1.png'
import primusImg12 from '../assets/primus/12.png'
import primusImg18 from '../assets/primus/18.png'
import heartieCover from '../assets/heartie/cover.png'
import heartieWatch from '../assets/heartie/watch.png'
import heartieAd1 from '../assets/heartie/ad1.png'
import heartieMerch1 from '../assets/heartie/merch1.png'
import heartieIpad1 from '../assets/heartie/ipad1.png'
import heartieIpad2 from '../assets/heartie/ipad2.png'
import heykuraCover from '../assets/heykura/cover.jpg'
import heykuraVideo from '../assets/heykura/covervideo.mp4'
import workOmnicom from '../assets/home/work-omnicom.png'
import ohdiCover from '../assets/home/OHDI.png'
import aCover from '../assets/home/a.jpg'
import bCover from '../assets/home/b.jpg'
import cCover from '../assets/home/c.jpg'
import dCover from '../assets/home/d.jpg'
import { Fragment, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import {
  useGalleryEditor,
  useGalleryDnd,
  Editable,
  HeightHandle,
  DragHandle,
  MoveArrows,
  GalleryToolbar,
} from '../components/GalleryEditor'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import GrassHills from '../components/GrassHills'
import IntroReveal from '../components/IntroReveal'

// value=内部过滤值/路由（不变），label=按钮显示文字
const filterTags = [
  { value: 'Branding', label: 'Visual & Campaign' },
  { value: 'Product', label: 'Product' },
]

// 每张卡的占位文字（副标题 + hover 展开的项目介绍），之后逐个替换成真实文案。
const PH_SUB = 'One-line project subtitle placeholder'
const PH_DESC =
  'Placeholder project intro that appears on hover. Replace this with the real description — a sentence or two summarizing what the project did and the impact it created.'

// 主页项目卡片：全部统一成玻璃卡结构（ExperimentCard）——封面(6/5) + 标题 + 副标题占位 +（hover 展开的）介绍占位。
// 主数组=All 顺序。Branding/Product 视图 = 按此顺序过滤 cats 得到。
// 注：GLOBBBE 暂不在主页展示，但保留其 import(workGlobbbe)/路由(/globbbe)/资源，之后可能再用。
const newCovers = [
  {
    img: workNexus,
    title: 'NEXUS',
    subtitle: 'Enterprise Platform: end-to-end Speaker Bureau program operations',
    desc: 'An enterprise-grade, AI-enabled SaaS platform redesigned from IPG Health’s legacy event management system to support end-to-end Healthcare Speaker Bureau program operations.',
    num: '00',
    link: '/nexus',
    cats: ['Product'],
    imgAspect: '6 / 5',
  },
  {
    img: workHiveai,
    title: 'HIVE',
    subtitle: 'AI tool for branching ideas and collecting interconnected thoughts.',
    desc: 'I led the design of an AI tool that helps researchers and learners bridge information gaps, spark inspiration, and independently explore new ideas.',
    num: '01',
    link: '/hiveai',
    cats: ['Product'],
    imgAspect: '6 / 5',
  },
  {
    crossfade: { img: heykuraCover, video: heykuraVideo },
    title: 'Heykura.ai',
    subtitle: 'An AI-powered visual ideation platform that turns vague prompts into clear creative direction.',
    desc: 'Created an AI toolbar, prompt iteration flow, and conversational AI panel that supported the December 2025 product launch and helped the platform reach 10,000 weekly users within its first week.',
    num: '02',
    link: '/new-project-5',
    cats: ['Branding', 'Product'],
    imgAspect: '6 / 5',
  },
  {
    slideshow: 'primus',
    title: 'Primus 2.0',
    subtitle: 'Visual identity and concept redesign for Primus',
    desc: 'Upgraded the brand identity, motion graphics, and digital products for its 2.0 evolution.',
    num: '03',
    link: '/new-project-3',
    cats: ['Branding'],
    imgAspect: '6 / 5',
  },
  {
    img: ohdiCover,
    title: 'OHDI.ai, powered by OMNI ✦',
    subtitle: 'Omnicom’s AI-powered competitive messaging intelligence platform helps pharma teams monitor market shifts.',
    desc: 'Redesigned two user flows for monitoring competitor narratives and predicting message resonance across HCP audiences and channels.',
    num: '04',
    link: '/new-project-6',
    cats: ['Product'], // OHDI 不属于 Visual Branding，只在 Product/All 里显示
    hidden: true, // 暂时不展示（All / Product 里都不出现）。想拿回来把这行删掉就行，
                  // 数据、封面图、路由 /new-project-6 全都留着。
    imgAspect: '6 / 5',
  },
  {
    img: hiveBrandingCover,
    title: 'HIVE.ai Branding',
    subtitle: 'Visual identity and concept redesign for Hive.ai',
    desc: 'I redesigned the visual concept, motion graphics, and merchandise system to elevate the brand identity.',
    num: '05',
    link: '/new-project',
    cats: ['Branding'],
    imgAspect: '6 / 5',
  },
  {
    img: workOmnicom,
    title: 'OMNICOM',
    subtitle: 'Collection of some of visual creative works at Omnicom Health',
    desc: 'Collaborated with a 35+ person team, including art directors, account leads and project managers to create digital experiences for clients including Incyte, Sanofi, Pfizer, AstraZeneca and Merck.',
    num: '06',
    link: '/omnicom-entry',
    cats: ['Branding'],
    imgAspect: '6 / 5',
  },
  {
    slideshow: 'heartie',
    title: 'HEARTIE',
    subtitle: 'Product ecosystem designed for children ages 8–14 with heart conditions.',
    desc: 'I led the interaction design, graphic artwork, and key visual screens to support Heartie’s gamified educational experience for young children.',
    num: '07',
    link: '/new-project-4',
    cats: ['Branding'],
    imgAspect: '6 / 5',
  },
  {
    img: workLepal,
    title: 'LEPAL',
    subtitle: 'AI-powered mental wellness companion app created for GenZ',
    desc: 'I led Lepal.ai’s visual identity, animation, and micro-interaction design from the ground up, helping the app reach 5,000+ weekly active users and increase subscription renewals by 15% within the first two months.',
    num: '08',
    link: '/lepal',
    cats: ['Branding'],
    imgAspect: '6 / 5',
  },
  {
    img: hayCover,
    title: 'HAY - hygge line',
    subtitle: 'HYGGE product line for HAY',
    desc: 'I led the proposal for a new HYGGE product line for HAY, featuring four cohesive products that bring more vitality to home goods.',
    num: '09',
    link: '/new-project-2',
    cats: ['Branding'],
    imgAspect: '6 / 5',
  },
  // SKINLAB 暂时从主页移除（保留 import workSkinlab / 路由 /skinlab / 页面 Skinlab.jsx，之后可恢复）：
  // { img: workSkinlab, title: 'SKINLAB', subtitle: PH_SUB, desc: PH_DESC, num: '08', link: '/skinlab', cats: ['Product'], imgAspect: '6 / 5' },
]

// Hero 山脉上的发光白色方块标记：世界坐标 { x, z }（锚定在地形上，随 pan 一起移动）；
// 最左那个带 "take a peak" 文字。GrassHills 每帧把这些坐标投影到屏幕。
const heroMarkers = [
  {
    x: -30,
    z: 5,
    label: true,
    img: aCover,
    text: "I’m a self-taught illustrator whose creative passion began with a desire to express meaning through brushstrokes, lines, and objects.",
  },
  {
    x: -12,
    z: 18,
    img: bCover,
    text: "I studied Product Design at Parsons, where I became comfortable with pin-up critiques and a fast-paced creative environment. Through iterative and systems thinking, I began exploring digital products and branding.",
  },
  {
    // 下移到前景草地（原 z:-12 在远处浅色山上看不清）
    x: 3,
    z: 12,
    img: cCover,
    text: "After completing the first year of my MS in HCI at the University of Michigan and working on products for multiple clients, I expanded into a larger creative platform that connected me with bold thinkers across art, product, production, UX architecture, and brand strategy.",
  },
  {
    x: 18,
    z: 20,
    img: dCover,
    text: "Last year, my creative projects reached the international stage, and I’m grateful that my ideas were seen and recognized. I hope to continue connecting with more bold and inspiring minds.",
  },
  {
    // 第五张卡：不放图，只有文字
    x: 38,
    z: -8,
    text: "My creative journey, like this endless stretch of grass, will continue to grow. The story is still unfolding.",
  },
]


function Hero() {
  return (
    <header className="container-fluid flex min-h-[39vh] flex-col items-center justify-center pt-11 text-center">
      <div className="mb-6 flex items-center gap-3">
        <img
          src={avatar}
          alt="Sherry Chen"
          className="h-10 w-10 rounded-full object-cover transition-transform duration-500 ease-out hover:scale-[1.3]"
        />
        <span className="text-neutral-600 text-sm">Sherry (Huiyang) Chen</span>
      </div>
      {/* 「设计工具选中物件」入场动效（复刻录屏） */}
      <IntroReveal />
      <p className="mt-6 max-w-2xl text-neutral-600">
        Hi, this is Sherry. I turn complexity into experiences people can trust. I&rsquo;m currently at{' '}
        <span className="text-blue-400">Omnicom Health</span> | Judge at Orpetron | Prev at IPG Health
        ⋄ IKEA ⋄ UMich ⋄ <span className="whitespace-nowrap">Parsons School of Design</span>
      </p>
    </header>
  )
}

function HeroVideo() {
  return (
    <div className="mt-8 w-full">
      <video src={heroLoop} autoPlay loop muted playsInline className="block w-full h-auto object-cover" />
    </div>
  )
}

// hover 项目封面时用 Web Audio 生成一声短促"滴"
let beepCtx
function playBeep() {
  try {
    if (!beepCtx) beepCtx = new (window.AudioContext || window.webkitAudioContext)()
    if (beepCtx.state === 'suspended') beepCtx.resume()
    const t = beepCtx.currentTime
    const osc = beepCtx.createOscillator()
    const gain = beepCtx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, t)
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(0.12, t + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.11)
    osc.connect(gain)
    gain.connect(beepCtx.destination)
    osc.start(t)
    osc.stop(t + 0.12)
  } catch {
    /* 音频不可用时静默忽略 */
  }
}

// 封面轮播：图片各停 1 秒，视频完整播完，每轮回到起点时强制视频重播
const primusSeq = [
  { type: 'img', src: primusImg31 },
  { type: 'img', src: primusImg12 },
  { type: 'img', src: primusImg18 },
  { type: 'video', src: primusVid1 },
]
// heartie 封面：cover → watch → ad1 → merch1（各 1 秒）→ Chef1 视频（播完）→ 循环
const heartieSeq = [
  { type: 'img', src: heartieIpad2 },
  { type: 'img', src: heartieCover },
  { type: 'img', src: heartieWatch, fit: 'contain' }, // watch 完整显示、不裁切
  { type: 'img', src: heartieIpad1 },
  { type: 'img', src: heartieAd1 },
  { type: 'img', src: heartieMerch1 },
]
const slideshowSeqs = { primus: primusSeq, heartie: heartieSeq }
function SlideshowCover({ seq }) {
  const [i, setI] = useState(0)
  const [cycle, setCycle] = useState(0) // 每轮回到起点时 +1，用于强制视频重播
  const cur = seq[i]
  const advance = () =>
    setI((prev) => {
      const next = (prev + 1) % seq.length
      if (next === 0) setCycle((c) => c + 1)
      return next
    })
  useEffect(() => {
    if (cur.type !== 'img') return // 视频靠 onEnded 推进；图片停 1 秒
    const t = setTimeout(advance, 1000)
    return () => clearTimeout(t)
  }, [i, cycle])
  // 与其它封面图完全相同的尺寸/样式（6/5、object-cover、白底盒内）
  const cls = `block w-full rounded-[2px] ${
    cur.fit === 'contain' ? 'object-contain' : 'object-cover'
  } shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-transform duration-500 ease-out group-hover:scale-[1.02]`
  const style = { aspectRatio: '6 / 5' }
  return cur.type === 'video' ? (
    <video key={`v${cycle}`} src={cur.src} draggable={false} autoPlay muted playsInline onEnded={advance} style={style} className={cls} />
  ) : (
    <img src={cur.src} alt="" style={style} className={cls} />
  )
}

// 封面淡入淡出循环：cover 图停 1.5s → 丝滑淡入视频 → 视频播完 → 停 1.5s → 淡回 cover。视频静音。
// 尺寸/样式与其它封面完全一致（6/5、object-cover、白底盒内）。
function CrossfadeCover({ img, video }) {
  const [showVideo, setShowVideo] = useState(false)
  const vidRef = useRef(null)
  useEffect(() => {
    // 只在显示 cover 图时计时：停 1.5s 后从头播放视频并淡入
    if (showVideo) return
    const t = setTimeout(() => {
      const v = vidRef.current
      if (v) {
        v.currentTime = 0
        v.play().catch(() => {})
      }
      setShowVideo(true)
    }, 1500)
    return () => clearTimeout(t)
  }, [showVideo])
  const base =
    'absolute inset-0 h-full w-full rounded-[2px] object-cover transition-opacity duration-700 ease-in-out'
  return (
    <div
      className="relative w-full overflow-hidden rounded-[2px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-transform duration-500 ease-out group-hover:scale-[1.02]"
      style={{ aspectRatio: '6 / 5' }}
    >
      <img src={img} alt="" className={`${base} ${showVideo ? 'opacity-0' : 'opacity-100'}`} />
      <video
        ref={vidRef}
        src={video}
        muted
        playsInline
        preload="auto"
        onEnded={() => setShowVideo(false)}
        className={`${base} ${showVideo ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}

// 实验卡片（参考 Statsig 卡）：封面 + 标题 + 副标题 +（hover 平滑展开的）灰字项目介绍 + 底部标签。
// 默认态只显示 标题/副标题/标签；hover 时整卡抬起、白底加阴影，并用 grid-rows 0fr→1fr 展开介绍。
// group 类在外层 Wrapper(Link) 上，这里用 group-hover 响应。
function ExperimentCard({ c }) {
  return (
    <div className="border border-white/40 bg-white/30 p-2 backdrop-blur-md transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_24px_60px_rgba(0,0,0,0.12)]">
      {/* 封面（统一 6/5，无圆角）：按类型渲染 视频轮播 / 淡入淡出 / 占位灰盒 / 静态图 */}
      <div className="overflow-hidden bg-neutral-50/40">
        {c.crossfade ? (
          <CrossfadeCover img={c.crossfade.img} video={c.crossfade.video} />
        ) : c.slideshow ? (
          <SlideshowCover seq={slideshowSeqs[c.slideshow]} />
        ) : c.placeholder ? (
          <div style={{ aspectRatio: c.imgAspect || '6 / 5' }} className="block w-full bg-neutral-200" />
        ) : (
          <img
            src={c.img}
            alt={c.title}
            style={{ aspectRatio: c.imgAspect || '6 / 5' }}
            className="block w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        )}
      </div>
      {/* 标题 */}
      <h3 className="mt-5 text-[26px] font-bold leading-tight text-black">{c.title}</h3>
      {/* 副标题 */}
      <p className="mt-1.5 text-[15px] text-neutral-500">{c.subtitle}</p>
      {/* hover 展开的项目介绍（灰字占位）：grid-rows 0fr→1fr 平滑展开高度 */}
      <div className="grid grid-rows-[0fr] transition-all duration-300 ease-out group-hover:mt-3 group-hover:grid-rows-[1fr]">
        <div className="overflow-hidden">
          <p className="text-[15px] leading-relaxed text-neutral-400">{c.desc}</p>
        </div>
      </div>
    </div>
  )
}

// 各筛选视图下的显式排序（用 link 作标识）。不影响 All 视图的顺序。
const filterOrder = {
  // Visual · Branding: primus → heykura → hive.ai branding → heartie → omnicom → lepal → hay
  Branding: ['/new-project-3', '/new-project-5', '/new-project', '/new-project-4', '/omnicom-entry', '/lepal', '/new-project-2'],
}

function WorkShowcaseNew({ activeFilter }) {
  // 先滤掉 hidden 的（暂时收起来、但数据还留着的项目）
  const visible = newCovers.filter((c) => !c.hidden)
  let covers = activeFilter ? visible.filter((c) => c.cats.includes(activeFilter)) : visible
  const order = activeFilter && filterOrder[activeFilter]
  if (order) {
    covers = [...covers].sort((a, b) => order.indexOf(a.link) - order.indexOf(b.link))
  }
  return (
    <section className="container-fluid mt-10 grid grid-cols-1 items-start gap-x-8 gap-y-24 md:grid-cols-2">
      {covers.map((c, i) => {
        const Wrapper = c.link ? Link : 'div'
        const wrapperProps = c.link ? { to: c.link } : {}
        return (
          <Reveal strong key={c.num} delay={(i % 2) * 120} className="text-left">
            <Wrapper {...wrapperProps} onMouseEnter={playBeep} className="group block">
              <ExperimentCard c={c} />
            </Wrapper>
          </Reveal>
        )
      })}
    </section>
  )
}

// 小方块：每秒顺时针丝滑转 90°，颜色循环 黑 → 绿 → 橘 → 黑
function RotatingSquare() {
  const [step, setStep] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setStep((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [])
  const colors = ['#000000', '#5db83c', '#f97316']
  return (
    <span
      aria-hidden
      className="inline-block h-2.5 w-2.5 shrink-0"
      style={{
        backgroundColor: colors[step % 3],
        transform: `rotate(${step * 90}deg)`,
        transition: 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.4s ease',
      }}
    />
  )
}

function WorkShowcase({ activeFilter, setActiveFilter }) {
  return (
    <div className="pt-8">
      <div className="container-fluid flex flex-wrap items-center gap-x-4 gap-y-2 text-left">
        <RotatingSquare />
        <span className="text-sm text-neutral-500">Filter by:</span>
        {/* All：显示全部（Branding + UX），activeFilter 为 null 时高亮；huiyangcreates 直接打开即此视图 */}
        <button
          type="button"
          onClick={() => setActiveFilter(null)}
          className={`text-sm transition-colors ${
            activeFilter === null
              ? 'font-bold text-[#5db83c]'
              : 'font-normal text-neutral-400 hover:text-black'
          }`}
        >
          All
        </button>
        {filterTags.map((tag) => {
          const isActive = activeFilter === tag.value
          return (
            <Fragment key={tag.value}>
              <span className="text-sm text-neutral-300">/</span>
              <button
                type="button"
                onClick={() => setActiveFilter(isActive ? null : tag.value)}
                className={`text-sm transition-colors ${
                  isActive
                    ? 'font-bold text-[#5db83c]'
                    : 'font-normal text-neutral-400 hover:text-black'
                }`}
              >
                {tag.label}
              </button>
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}

// 深色粒子从上缓缓飘落（接续上方山脉的粒子感）。canvas 铺满父容器，父容器需 relative。
// 多色深调色板：深绿 / 暗橄榄 / 暗紫，呼应山脉里的深绿点与紫粉小花。
const FALL_COLORS = ['#26310f', '#31401d', '#3f5228', '#4d6033', '#5f5a2e', '#4f3f66', '#6b4f7a']
const FALL_BAND_H = 360 // 只在顶部 filter bar 附近这条带里飘
function FallingParticles() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    const parent = canvas?.parentElement
    if (!canvas || !parent) return
    const ctx = canvas.getContext('2d')
    let raf, w, h, dpr, running = true
    const parts = []
    const spawn = (anywhere) => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : -10,
      r: 0.6 + Math.random() * 1.5, // 更小
      vy: 0.12 + Math.random() * 0.42, // 下落速度
      sway: Math.random() * Math.PI * 2,
      swayAmp: 0.2 + Math.random() * 0.6, // 水平轻微摇摆
      op: 0.3 + Math.random() * 0.5, // 更深更明显
      col: FALL_COLORS[(Math.random() * FALL_COLORS.length) | 0],
    })
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = parent.offsetWidth
      h = FALL_BAND_H // 固定为顶部带高度，不铺满整段
      if (!w || !h) return
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const target = Math.min(70, Math.round((w * h) / 13000)) // 带内密度（更稀疏）
      while (parts.length < target) parts.push(spawn(true))
      parts.length = Math.min(parts.length, target)
    }
    const tick = () => {
      if (!running) return
      ctx.clearRect(0, 0, w, h)
      for (const p of parts) {
        p.sway += 0.01
        p.y += p.vy
        p.x += Math.cos(p.sway) * p.swayAmp * 0.3
        if (p.y > h + 12) {
          p.y = -10
          p.x = Math.random() * w
        }
        // 底部 100px 内淡出，避免带子有硬边
        const a = p.y > h - 100 ? p.op * Math.max(0, (h - p.y) / 100) : p.op
        ctx.globalAlpha = a
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.col
        ctx.fill()
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(tick)
    }
    resize()
    window.addEventListener('resize', resize)
    const ro = new ResizeObserver(resize)
    ro.observe(parent)
    tick()
    const onVis = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      } else if (!running) {
        running = true
        tick()
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])
  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-0" />
}

// ── 实验区：Gallery 画廊（宽度/间距参照 martacerda.com/works）──────
// 参考站实测：页面左右 padding 20px（几乎通栏，不走 container-fluid）、3 列、列间距 20px；
// 图片占满列宽，下方 16px 放标题（18px / bold）+ 6px 小字，标题块下再 16px 接下一张。
// 高度用 px 存（宽度由列宽决定，所以每张宽度永远一致、高度各自可调）。
// 开发模式下可以直接在页面上拖高度 / 改文案，见 components/GalleryEditor.jsx。
// ── 画廊格子的封面序列 ──────────────────────────────────────────────
// 规则：视频完整播完才进下一帧；图片各停 2 秒；整体无限循环。
// fit: 'contain' 的帧不裁切、等比居中放，四周露出灰色底板（给尺寸偏小的素材用）。
const hiveCoverSeq = [
  { type: 'video', src: hiveHeroVid }, // 14.9s
  { type: 'img', src: hiveIns1 }, // 2s
  { type: 'img', src: hivePoster1 }, // 2s
  { type: 'video', src: hiveDemo1Vid, fit: 'contain' }, // 9.6s，948×938 偏小 → 居中留白
  { type: 'video', src: hiveKeyVisualVid }, // 6.0s，1882×1016 够大 → 裁切填满
]

// HEARTIE：沿用原来主页卡片上的那一组、那个顺序（ipad2 → cover → watch → ipad1 → ad1 → merch1）
const heartieCoverSeq = [
  { type: 'img', src: htIpad2 },
  { type: 'img', src: htCover },
  { type: 'img', src: htWatch, fit: 'contain' }, // 手表产品图，不裁切 → 居中留白
  { type: 'img', src: htIpad1 },
  { type: 'img', src: htAd1 },
  { type: 'img', src: htMerch1 },
]

// HEYKURA：沿用原来主页卡片的顺序（封面图 → 封面视频）
const heykuraCoverSeq = [
  { type: 'img', src: hkCover },
  { type: 'video', src: hkVideo }, // 14.2s
]

// PRIMUS：沿用原来主页卡片的顺序（3.1 → 12 → 18 → 视频）
const primusCoverSeq = [
  { type: 'img', src: pmImg31 },
  { type: 'img', src: pmImg12 },
  { type: 'img', src: pmImg18 },
  { type: 'video', src: pmVid1 }, // 7.8s
]

// LEPAL / HAY：原来主页卡片上就各只有一张静态封面图，所以这两组只有一帧（不会动）
const lepalCoverSeq = [{ type: 'img', src: lpCover }]
const hayCoverSeq = [{ type: 'img', src: hayCoverImg }]

// FLOWITH：不是轮播，是叠加 —— bg.png 铺满做底，main.mp4 居中循环播
const flowithCoverLayer = { bg: flowithBg, video: flowithMain, videoWidth: '78%' }

// PARKINSON：你自己放进 covers/parkinson/ 的两张截图，各停 2s
const parkinsonCoverSeq = [
  { type: 'img', src: pkScreen1 },
  { type: 'img', src: pkScreen2 },
]

// KEVZARA / JAKAFI / NIKTIMVO：用各自 case study 页的 hero 图，各只有一张（静止）
const kevzaraCoverSeq = [{ type: 'img', src: kevHero }]
const jakafiCoverSeq = [{ type: 'img', src: jakHero }]
const niktimvoCoverSeq = [{ type: 'img', src: nikHero }]

// Soundscape / SolarX / Food Delivery：各一张静态图（不会动）
const soundscapeCoverSeq = [{ type: 'img', src: soundscapeImg }]
const solarxCoverSeq = [{ type: 'img', src: solarxImg }]
const foodDeliveryCoverSeq = [{ type: 'img', src: foodDeliveryImg }]

// 按项目名匹配封面：名字你在页面上随便改都行，只要还带得上这个关键词就认得出来，
// 不依赖它排在第几格。以后加新封面就往这个表里加一行。
// bg = 这一格 placeholder 的底色（不填默认灰 #e9e9e7）；contain 的素材四周露的就是它。
// link = 点封面跳去哪：'/xxx' 走站内路由，'http…' 开头的在新标签打开。不填就不可点。
const coverMatchers = [
  { test: /hive/i, seq: hiveCoverSeq, link: '/new-project' },
  { test: /heartie/i, seq: heartieCoverSeq, bg: '#ffffff', link: '/new-project-4' },
  { test: /heykura/i, seq: heykuraCoverSeq, link: '/new-project-5' },
  { test: /primus/i, seq: primusCoverSeq, link: '/new-project-3' },
  { test: /lepal/i, seq: lepalCoverSeq, link: '/lepal' },
  { test: /\bhay\b/i, seq: hayCoverSeq, link: '/new-project-2' }, // 加词边界，免得误伤别的名字
  { test: /flowith/i, layer: flowithCoverLayer, link: 'https://flowith.io/home/' }, // 站外，新标签打开
  { test: /parkinson/i, seq: parkinsonCoverSeq },
  { test: /kev/i, seq: kevzaraCoverSeq, link: '/kevzara' },
  { test: /jak/i, seq: jakafiCoverSeq, link: '/jakafi' },
  { test: /nik/i, seq: niktimvoCoverSeq, link: '/niktimvo' },
  { test: /soundscape/i, seq: soundscapeCoverSeq },
  { test: /solar\s*x/i, seq: solarxCoverSeq },
  { test: /food\s*delivery/i, seq: foodDeliveryCoverSeq },
]
const coverFor = (name) => coverMatchers.find((m) => m.test.test(name || ''))
const BOX_BG = '#e9e9e7' // placeholder 默认底色

// 叠加型封面：一张图铺满做背景 + 一段视频居中叠在上面循环播，四周露出背景。
// videoWidth 控制视频占格子宽度的百分比（越小四周留白越多）。
function GalleryLayerCover({ bg, video, videoWidth = '78%' }) {
  return (
    <>
      <img src={bg} alt="" draggable={false} className="absolute inset-0 h-full w-full object-cover" />
      <video
        src={video}
        draggable={false}
        autoPlay
        muted
        loop
        playsInline
        style={{ width: videoWidth }}
        className="absolute left-1/2 top-1/2 h-auto -translate-x-1/2 -translate-y-1/2"
      />
    </>
  )
}

function GalleryCover({ seq }) {
  const [i, setI] = useState(0)
  const [cycle, setCycle] = useState(0) // 每轮回到起点 +1，用来强制视频重播
  // 拖动换位后，同一个组件实例可能被复用给另一个项目（帧数不一样），
  // 所以换了 seq 就把进度归零；再兜一层 || seq[0]，越界时不至于整页崩掉。
  useEffect(() => {
    setI(0)
    setCycle(0)
  }, [seq])
  const cur = seq[i] || seq[0]
  const advance = () =>
    setI((prev) => {
      const next = (prev + 1) % seq.length
      if (next === 0) setCycle((c) => c + 1)
      return next
    })
  useEffect(() => {
    if (cur.type !== 'img') return // 视频靠 onEnded 推进；图片停 2 秒
    const t = setTimeout(advance, 2000)
    return () => clearTimeout(t)
  }, [i, cycle])
  const cls = `block h-full w-full ${cur.fit === 'contain' ? 'object-contain' : 'object-cover'}`
  return cur.type === 'video' ? (
    <video
      key={`${cycle}-${i}`}
      src={cur.src}
      autoPlay
      muted
      playsInline
      onEnded={advance}
      className={cls}
    />
  ) : (
    <img src={cur.src} alt="" draggable={false} className={cls} />
  )
}

const galleryDefaults = [
  { name: "HIVE.ai Rebranding", sub: "Visual identity and concept redesign for Hive,ai", h: 334 },
  { name: "Primus 2.0", sub: "Visual identity and concept redesign for Primus", h: 303 },
  { name: "Jakafi - Incyte", sub: "Client project at Omnicom Health", h: 233 },
  { name: "Heartie", sub: "Product ecosystem designed for children age 9-14 with heart conditions", h: 447 },
  { name: "\"See What They See — a campaign for Parkinson's disease awareness\"", sub: "Client project at IPG Health", h: 257 },
  { name: "Kevzara - Sanofi", sub: "Client project at Omnicom Health", h: 220 },
  { name: "Heykura.ai", sub: "An AI-powered visual ideation platform that turns vague prompts into clear creative direction", h: 546 },
  { name: "Niktimvo - Incyte", sub: "Client project at Omnicom Health", h: 217 },
  { name: "HAY - hygge", sub: "HYGGE product line for HAY", h: 378 },
  { name: "Lepal", sub: "Mental wellness companion app created for Gen-Z", h: 598 },
  { name: "Flowith", sub: "Website redesign for Flowith, an AI workspace built on an infinite canvas", h: 502 },
  { name: "Soundscape", sub: "-", h: 650 },
  { name: "SolarX", sub: "-", h: 483 },
  { name: "Food Delivery", sub: "-", h: 380 },
]

// 画廊分列：**已有格子的位置永远不动**。
// 以前用 CSS multi-column，浏览器会按高度自动平衡，一加新格子上面全部重排；
// 现在改成自己算：前 9 个（最早那批）每列 3 个竖着分 —— 1-3 左列、4-6 中列、7-9 右列，
// 和最初的排版完全一致；之后新增的格子依次轮流补到各列底部。
// 所以以后再加多少格，上面已经排好的都不会动。
const FROZEN_PER_COL = 3
function splitColumns(items, cols) {
  if (cols <= 1) return [items.map((it, i) => ({ it, i }))]
  const out = Array.from({ length: cols }, () => [])
  const frozen = cols * FROZEN_PER_COL
  items.forEach((it, i) => {
    const c = i < frozen ? Math.floor(i / FROZEN_PER_COL) : (i - frozen) % cols
    out[c].push({ it, i })
  })
  return out
}

// 高度按「基准列宽」来存：1440 屏下三列时每列正好 448px。
// 渲染时用 aspect-ratio，所以窗口变宽变窄，格子只是等比缩放，长宽比永远不变。
const REF_COL_W = 448
const COL_GAP = 20

// 量一下当前实际列宽，只用来换算拖动的手感（渲染不依赖它，所以不会闪）
function useColWidth(ref, cols) {
  const [w, setW] = useState(REF_COL_W)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setW((e.contentRect.width - COL_GAP * (cols - 1)) / cols))
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref, cols])
  return w
}

// 列数跟着窗口宽度走（断点和原来的 sm / lg 一致）
const colCountFor = (w) => (w >= 1024 ? 3 : w >= 640 ? 2 : 1)
function useColCount() {
  const [n, setN] = useState(() => colCountFor(window.innerWidth))
  useEffect(() => {
    const on = () => setN(colCountFor(window.innerWidth))
    on()
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return n
}

function ExperimentGallery() {
  const ed = useGalleryEditor(galleryDefaults)
  const dev = import.meta.env.DEV
  const columns = splitColumns(ed.items, useColCount())
  const dnd = useGalleryDnd(ed.move)
  const wrapRef = useRef(null)
  const cols = columns.length
  const scale = useColWidth(wrapRef, cols) / REF_COL_W
  // 每一格在网格里的 (列, 行)，用来算「上下左右」是哪一格
  const pos = new Map()
  columns.forEach((col, c) => col.forEach(({ i }, r) => pos.set(i, [c, r])))
  // 左右跳到相邻列的同一行；那列要是没这么长，就落到它的最后一格
  const neighbor = (i, dir) => {
    const p = pos.get(i)
    if (!p) return null
    const [c, r] = p
    if (dir === 'up') return columns[c]?.[r - 1]?.i ?? null
    if (dir === 'down') return columns[c]?.[r + 1]?.i ?? null
    const tc = dir === 'left' ? c - 1 : c + 1
    const col = columns[tc]
    if (!col?.length) return null
    return col[Math.min(r, col.length - 1)].i
  }
  return (
    <>
      <section className="mt-10 px-5">
        {/* gap-5 = 20px 列间距；每列等宽，格子高度各自不同 */}
        <div ref={wrapRef} className="flex gap-5">
          {columns.map((col, c) => (
          <div key={c} className="min-w-0 flex-1">
          {col.map(({ it, i }) => {
            const cover = coverFor(it.name)
            // 有 link 的格子整块可点：站外 http 开头用 a（新标签），站内用 router 的 Link
            const external = cover?.link && /^https?:/i.test(cover.link)
            const Box = cover?.link ? (external ? 'a' : Link) : 'div'
            const boxProps = !cover?.link
              ? {}
              : external
                ? { href: cover.link, target: '_blank', rel: 'noopener noreferrer' }
                : { to: cover.link }
            return (
            <Reveal key={i} delay={(i % 3) * 120} className="break-inside-avoid text-left">
              {/* 图片占位：宽度 = 列宽（统一），高度可拖；底色由该项目的 bg 决定 */}
              <Box
                data-gi={i}
                {...boxProps}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                className={`group/box relative block w-full overflow-hidden transition-[opacity,outline-color] ${
                  dnd.dragging === i
                    ? 'opacity-40'
                    : dnd.dragging != null && dnd.over === i
                      ? 'outline outline-2 outline-offset-2 outline-[#5db83c]'
                      : ''
                }`}
                style={{
                  aspectRatio: `${REF_COL_W} / ${it.h}`,
                  backgroundColor: cover?.bg || BOX_BG,
                }}
              >
                {cover?.seq && <GalleryCover seq={cover.seq} />}
                {cover?.layer && <GalleryLayerCover {...cover.layer} />}
                {dev && <DragHandle onStart={dnd.start(i)} />}
                {dev && (
                  <MoveArrows
                    can={(d) => neighbor(i, d) != null}
                    onMove={(d) => ed.move(i, neighbor(i, d))}
                  />
                )}
                {dev && (
                  <HeightHandle
                    height={it.h}
                    scale={scale}
                    onBegin={ed.begin}
                    onChange={(h) => ed.patch(i, { h })}
                    onEnd={ed.end}
                  />
                )}
              </Box>
              {/* 标题 + 副标题小字：整块上下各 16px */}
              <div className="my-4">
                {dev ? (
                  <>
                    <Editable
                      value={it.name}
                      onBegin={ed.begin}
                      onCommit={(name) => {
                        ed.patch(i, { name })
                        ed.end()
                      }}
                      className="text-[18px] font-bold leading-[1.3] text-black"
                    />
                    <Editable
                      value={it.sub}
                      onBegin={ed.begin}
                      onCommit={(sub) => {
                        ed.patch(i, { sub })
                        ed.end()
                      }}
                      className="mt-1.5 text-[15px] leading-snug text-neutral-500"
                    />
                  </>
                ) : (
                  <>
                    <div className="text-[18px] font-bold leading-[1.3] text-black">{it.name}</div>
                    <p className="mt-1.5 text-[15px] leading-snug text-neutral-500">{it.sub}</p>
                  </>
                )}
              </div>
            </Reveal>
            )
          })}
          </div>
          ))}
        </div>
      </section>
      {dev && <GalleryToolbar {...ed} />}
    </>
  )
}

function Home({ defaultFilter = null }) {
  // defaultFilter 由路由传入（/product → 'Product'，/branding → 'Branding'），进页面即预选该 tag
  const [activeFilter, setActiveFilter] = useState(defaultFilter)
  return (
    <div className="min-h-screen bg-white">
      <NavBar fixed />
      {/* 顶部白→浅绿渐变：intro 文字落在过渡段，向下与山脉天空色 (#eef1ea) 无缝衔接 */}
      <div style={{ background: 'linear-gradient(to bottom, #ffffff 0%, #ffffff 22%, #ededed 100%)', overflowX: 'clip' }}>
        <div className="h-24" />
        <Hero />
      </div>
      {/* Hero 场景：程序化起伏绿地（替换原 exploring-creativity 视频）；高度缩到原来的 95%。
          发光白色方块标记锚定在地形上（世界坐标），随 pan 一起移动 —— 由 GrassHills 内部投影渲染 */}
      <GrassHills
        height="clamp(355px, 66vh, 727px)"
        className=""
        markers={heroMarkers}
        sky={0xededed}
        grassLow={0x0d0d0d}
        grassMid={0x616161}
        grassHigh={0xe6e6e6}
      />
      <div className="dot-grid pb-20 relative">
        {/* 深绿粒子从上飘落，接续山脉粒子感 */}
        <FallingParticles />
        <div className="relative z-10">
          <WorkShowcase activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
          {/* 新画廊 = Visual & Campaign 的作品。Product 视图下不出现。
              背景沿用外层 dot-grid 的灰底点阵。 */}
          {/* 只有 Visual & Campaign 这一个视图换成新画廊 */}
          {activeFilter === 'Branding' && <ExperimentGallery />}
          {/* All 和 Product 都还是原来的玻璃卡片区，行为和以前完全一样：
              All 显示全部 10 张，Product 显示 Product 那几张。
              组件、newCovers 数据、图片 import 一个没删。 */}
          {activeFilter !== 'Branding' && <WorkShowcaseNew activeFilter={activeFilter} />}
        </div>
      </div>
      <Footer light />
    </div>
  )
}

export default Home
