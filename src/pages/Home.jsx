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
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
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
import billboardImg from '../assets/home/billboard.png'
import AboutContent from '../components/AboutContent'

// value=内部过滤值/路由（不变），label=按钮显示文字
const filterTags = [
  { value: 'Branding', label: 'Visual & Branding' },
  { value: 'Product', label: 'UX Product' },
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


function Hero({ titleRef }) {
  return (
    <header className="container-fluid flex min-h-[39vh] flex-col items-center justify-center pt-11 text-center">
      {/* 「设计工具选中物件」入场动效（复刻录屏） */}
      {/* 往下挪一点。标题在山丘画布「后面」：画布天空透明，山挡住字的底部 */}
      <div ref={titleRef} className="ir-stage mt-10" style={{ willChange: 'transform' }}>
        <IntroReveal />
      </div>
      {/* 自我介绍那段文字挪到了山丘里的广告牌上（见下面 GrassHills 的 billboard.lines） */}
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
      {/* 标题：Pathway Extreme，字重 400（字体在 index.css 顶部已引入）；画廊卡片标题用同一套 */}
      <h3 className="mt-5 text-[26px] font-normal leading-tight text-black [font-family:'Pathway_Extreme',sans-serif]">{c.title}</h3>
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

// Visual & Campaign 画廊和 Product 卡片区共用的左右留白：
//   手机（<640px）20px；640px ~ 1440px（含 1440）90px；1440px 以上 180px。
// 两段范围故意写成互不重叠（max / min 都用 1441px）：Tailwind 排不好 px 和 rem 断点的先后，
// 重叠的话小的会把大的盖掉。
const SIDE_PAD = 'px-5 sm:max-[1441px]:px-[90px] min-[1441px]:px-[180px]'

function WorkShowcaseNew({ activeFilter }) {
  // 先滤掉 hidden 的（暂时收起来、但数据还留着的项目）
  const visible = newCovers.filter((c) => !c.hidden)
  let covers = activeFilter ? visible.filter((c) => c.cats.includes(activeFilter)) : visible
  const order = activeFilter && filterOrder[activeFilter]
  if (order) {
    covers = [...covers].sort((a, b) => order.indexOf(a.link) - order.indexOf(b.link))
  }
  return (
    <section
      className={`${activeFilter === 'Product' ? SIDE_PAD : 'container-fluid'} mt-10 grid grid-cols-1 items-start gap-x-8 gap-y-24 md:grid-cols-2`}
    >
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

// 山丘正下方的 filter 条。
// 草地底部慢慢渐变成下面项目区的浅灰（和 .dot-grid 底色 #f3f3f4 一样），先实色一段放按钮，再往下淡出露出点阵。
//  · All 视图：「View」+ 分段按钮（All / Visual & Branding / UX Product），选中的是黑底白字
//  · 选了某个分类：左边「← See All」回到全部，中间「Featuring」+ 当前分类的灰色胶囊
const FILTER_RGB = '243,243,244'
const FILTER_BLEND_H = 200 // 往上伸进草地的一段：从透明慢慢变成浅灰（深草→浅灰跨度大，拉长一点更柔和）
const FILTER_BAR_H = 64 // 放按钮的那段，最深
const FILTER_FADE_H = 190 // 往下淡出到点阵灰底的一段
const FILTER_GAP = 50 // 条子下面到卡片的额外留白（下面的卡片再有 mt-10）；原来 150，filter 到卡片的距离缩短一半

// 用平滑曲线（smoothstep）铺很多个色标，避免线性渐变那种「一条色带 + 生硬接缝」的感觉
const easedStops = (fromPx, toPx, fromA, toA, steps = 12) =>
  Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps
    const e = t * t * (3 - 2 * t)
    const a = fromA + (toA - fromA) * e
    return `rgba(${FILTER_RGB},${a.toFixed(3)}) ${(fromPx + (toPx - fromPx) * t).toFixed(1)}px`
  })
const FILTER_BG = `linear-gradient(to bottom, ${[
  // 在山丘画布底边之前就加深到完全不透明，画布结束的那条边才不会露出来
  ...easedStops(0, FILTER_BLEND_H, 0, 1),
  ...easedStops(FILTER_BLEND_H + FILTER_BAR_H, FILTER_BLEND_H + FILTER_BAR_H + FILTER_FADE_H, 1, 0),
].join(', ')})`

function WorkShowcase({ activeFilter, setActiveFilter }) {
  const current = filterTags.find((t) => t.value === activeFilter)
  return (
    <div className="relative" style={{ paddingBottom: FILTER_GAP }}>
      {/* 渐变底：绝对定位，往下伸出去一截，垫在卡片后面 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0"
        style={{
          top: -FILTER_BLEND_H,
          height: FILTER_BLEND_H + FILTER_BAR_H + FILTER_FADE_H,
          background: FILTER_BG,
        }}
      />
      <div
        className={`relative grid grid-cols-[1fr_auto_1fr] items-center ${SIDE_PAD}`}
        style={{ height: FILTER_BAR_H }}
      >
        {/* 左：只在分类视图出现 */}
        <div className="justify-self-start">
          {current && (
            <button
              type="button"
              onClick={() => setActiveFilter(null)}
              className="group flex items-center gap-2.5 text-[15px] text-black transition-colors hover:text-black/60"
            >
              <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1">
                ←
              </span>
              See All
            </button>
          )}
        </div>

        {/* 中 */}
        {current ? (
          <div className="flex items-center gap-6">
            <span className="text-[15px] text-black">Featuring</span>
            <span className="rounded-[6px] bg-black/10 px-4 py-1.5 text-[15px] text-black">{current.label}</span>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <span className="text-[15px] text-black">View</span>
            <div className="flex items-center gap-1 rounded-[6px] bg-black/10 p-1">
              {[{ value: null, label: 'All' }, ...filterTags].map((tag) => {
                const isActive = activeFilter === tag.value
                return (
                  <button
                    key={tag.label}
                    type="button"
                    onClick={() => setActiveFilter(tag.value)}
                    className={`rounded-[4px] px-3.5 py-1 text-[15px] transition-colors ${
                      isActive ? 'bg-black text-white' : 'text-black hover:bg-black/10'
                    }`}
                  >
                    {tag.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div />
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
// desc = hover 时展开的项目介绍（文案取自 huiyangcreates.com 首页卡片）。跟着项目名走，换位置不会错位；
//        在页面上编辑过的话，以编辑的内容为准。
// link = 点封面跳去哪：'/xxx' 走站内路由，'http…' 开头的在新标签打开。不填就不可点。
const coverMatchers = [
  // Product 的 HIVE：名字只叫 "HIVE"（或 "HIVE.ai"）才算，必须放在下面 /hive/i 之前，
  // 不然会被 HIVE.ai Rebranding 那条抢走
  { test: /^\s*hive(\.ai)?\s*$/i, seq: [{ type: 'img', src: workHiveai }], link: '/hiveai', desc: "I led the design of an AI tool that helps researchers and learners bridge information gaps, spark inspiration, and independently explore new ideas." },
  { test: /nexus/i, seq: [{ type: 'img', src: workNexus }], link: '/nexus', desc: "An enterprise-grade, AI-enabled SaaS platform redesigned from IPG Health’s legacy event management system to support end-to-end Healthcare Speaker Bureau program operations." },
  { test: /hive/i, seq: hiveCoverSeq, link: '/new-project', desc: 'I redesigned the visual concept, motion graphics, and merchandise system to elevate the brand identity.' },
  { test: /heartie/i, seq: heartieCoverSeq, bg: '#ffffff', link: '/new-project-4', desc: 'I led the interaction design, graphic artwork, and key visual screens to support Heartie’s gamified educational experience for young children.' },
  { test: /heykura/i, seq: heykuraCoverSeq, link: '/new-project-5', desc: 'Created an AI toolbar, prompt iteration flow, and conversational AI panel that supported the December 2025 product launch and helped the platform reach 10,000 weekly users within its first week.' },
  { test: /primus/i, seq: primusCoverSeq, link: '/new-project-3', desc: 'Upgraded the brand identity, motion graphics, and digital products for its 2.0 evolution.' },
  { test: /lepal/i, seq: lepalCoverSeq, link: '/lepal', desc: 'I led Lepal.ai’s visual identity, animation, and micro-interaction design from the ground up, helping the app reach 5,000+ weekly active users and increase subscription renewals by 15% within the first two months.' },
  { test: /\bhay\b/i, seq: hayCoverSeq, link: '/new-project-2', desc: 'I led the proposal for a new HYGGE product line for HAY, featuring four cohesive products that bring more vitality to home goods.' }, // 加词边界，免得误伤别的名字
  { test: /flowith/i, layer: flowithCoverLayer, link: 'https://flowith.io/home/' }, // 站外，新标签打开
  { test: /parkinson|see what they see/i, seq: parkinsonCoverSeq }, // 名字里带任意一个都认
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
  { name: "HIVE.ai Rebranding", sub: "Visual identity and concept redesign for Hive,ai", h: 305 },
  { name: "Primus 2.0", sub: "Visual identity and concept redesign for Primus", h: 345 },
  { name: "Jakafi - Incyte", sub: "Client project at Omnicom Health", h: 233 },
  { name: "Heartie", sub: "Product ecosystem designed for children age 9-14 with heart conditions", h: 349 },
  { name: "See What They See", sub: "Client project at IPG Health - campaign for Parkinson's disease awareness", h: 257 },
  { name: "Kevzara - Sanofi", sub: "Client project at Omnicom Health", h: 220 },
  { name: "Heykura.ai", sub: "An AI-powered visual ideation platform that turns vague prompts into clear creative direction", h: 394 },
  { name: "Niktimvo - Incyte", sub: "Client project at Omnicom Health", h: 217 },
  { name: "HAY - hygge", sub: "HYGGE product line for HAY", h: 321 },
  { name: "Lepal", sub: "Mental wellness companion app created for Gen-Z", h: 402 },
  { name: "Flowith", sub: "Website redesign for Flowith, an AI workspace built on an infinite canvas", h: 458 },
  { name: "Soundscape", sub: "-", h: 596 },
  { name: "SolarX", sub: "-", h: 410 },
  { name: "Food Delivery", sub: "-", h: 297 },
]

// All 视图画廊：在 Visual & Campaign 那一组的基础上，补上 Product 独有的项目，用同一套画廊排版。
// （Heykura 本来就同时属于两类，已经在里面了，不重复加；OHDI 目前隐藏，不加。）
// 顺序 / 高度照本地画廊编辑器里保存的那版写死（线上没有本地存档，只认这里）。
const allGalleryDefaults = [
  { name: "HIVE", sub: "AI tool for branching ideas and collecting interconnected thoughts.", h: 398 },
  { name: "HIVE.ai Rebranding", sub: "Visual identity and concept redesign for Hive,ai", h: 305 },
  { name: "Primus 2.0", sub: "Visual identity and concept redesign for Primus", h: 345 },
  { name: "Heykura.ai", sub: "An AI-powered visual ideation platform that turns vague prompts into clear creative direction", h: 394 },
  { name: "Flowith", sub: "Website redesign for Flowith, an AI workspace built on an infinite canvas", h: 458 },
  { name: "See What They See", sub: "Client project at IPG Health - campaign for Parkinson's disease awareness", h: 257 },
  { name: "Heartie", sub: "Product ecosystem designed for children age 9-14 with heart conditions", h: 349 },
  { name: "NEXUS", sub: "Enterprise Platform: end-to-end Speaker Bureau program operations", h: 374 },
  { name: "Niktimvo - Incyte", sub: "Client project at Omnicom Health", h: 217 },
  { name: "Jakafi - Incyte", sub: "Client project at Omnicom Health", h: 233 },
  { name: "Kevzara - Sanofi", sub: "Client project at Omnicom Health", h: 220 },
  { name: "HAY - hygge", sub: "HYGGE product line for HAY", h: 321 },
  { name: "Lepal", sub: "Mental wellness companion app created for Gen-Z", h: 402 },
  { name: "SolarX", sub: "-", h: 562 },
  { name: "Soundscape", sub: "-", h: 596 },
  { name: "Food Delivery", sub: "-", h: 297 },
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
  // 「前 9 个写死」只在三列时生效（为了保住最初那版三列排版）；其它列数直接按顺序左右轮流排
  const frozen = cols === 3 ? cols * FROZEN_PER_COL : 0
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
// 画廊最多几列（试过 2 列，现在回到 3 列）
const GALLERY_MAX_COLS = 3
const colCountFor = (w) => Math.min(GALLERY_MAX_COLS, w >= 1024 ? 3 : w >= 640 ? 2 : 1)
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

function ExperimentGallery({ defaults = galleryDefaults, storageKey, saveName }) {
  const ed = useGalleryEditor(defaults, { storageKey, saveName })
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
      {/* 左右留白规则见 SIDE_PAD（和 Product 卡片区共用） */}
      <section className={`mt-10 ${SIDE_PAD}`}>
        {/* gap-5 = 20px 列间距；每列等宽，格子高度各自不同 */}
        <div ref={wrapRef} className="flex gap-5">
          {columns.map((col, c) => (
          <div key={c} className="min-w-0 flex-1">
          {col.map(({ it, i }) => {
            const cover = coverFor(it.name)
            // 整张卡可点（和 Product 里的旧卡一样）：站外 http 开头用 a（新标签），站内用 router 的 Link
            const external = cover?.link && /^https?:/i.test(cover.link)
            const Wrapper = cover?.link ? (external ? 'a' : Link) : 'div'
            const wrapperProps = !cover?.link
              ? {}
              : external
                ? { href: cover.link, target: '_blank', rel: 'noopener noreferrer' }
                : { to: cover.link }
            return (
            <Reveal strong key={i} delay={c * 120} className="mb-5 text-left">
              <Wrapper
                {...wrapperProps}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                onMouseEnter={playBeep}
                className="group block"
              >
              {/* 卡片外壳：和 Product 里的 ExperimentCard 同一套样式（半透明白底 + 细边 + 毛玻璃，hover 抬起加阴影） */}
              <div className="border border-white/40 bg-white/30 p-2 backdrop-blur-md transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_24px_60px_rgba(0,0,0,0.12)]">
              {/* 封面：宽度 = 卡片内宽（统一），长宽比按 h 固定；底色由该项目的 bg 决定 */}
              <div
                data-gi={i}
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
                {/* hover 时封面轻微放大，和旧卡一致 */}
                <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.02]">
                  {cover?.seq && <GalleryCover seq={cover.seq} />}
                  {cover?.layer && <GalleryLayerCover {...cover.layer} />}
                </div>
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
              </div>
              {/* 标题 26px bold / 副标题 15px 灰 / hover 展开的介绍 —— 字号间距全部照搬旧卡 */}
              {dev ? (
                <>
                  <Editable
                    value={it.name}
                    onBegin={ed.begin}
                    onCommit={(name) => {
                      ed.patch(i, { name })
                      ed.end()
                    }}
                    className="mt-5 text-[26px] font-normal leading-tight text-black [font-family:'Pathway_Extreme',sans-serif]"
                  />
                  <Editable
                    value={it.sub}
                    onBegin={ed.begin}
                    onCommit={(sub) => {
                      ed.patch(i, { sub })
                      ed.end()
                    }}
                    className="mt-1.5 text-[15px] text-neutral-500"
                  />
                </>
              ) : (
                <>
                  <h3 className="mt-5 text-[26px] font-normal leading-tight text-black [font-family:'Pathway_Extreme',sans-serif]">{it.name}</h3>
                  <p className="mt-1.5 text-[15px] text-neutral-500">{it.sub}</p>
                </>
              )}
              {(dev || it.desc || cover?.desc) && (
                <div className="grid grid-rows-[0fr] transition-all duration-300 ease-out group-hover:mt-3 group-hover:grid-rows-[1fr]">
                  <div className="overflow-hidden">
                    {dev ? (
                      <Editable
                        value={it.desc || cover?.desc || ''}
                        placeholder="Hover 时展开的项目介绍（可留空）"
                        onBegin={ed.begin}
                        onCommit={(desc) => {
                          ed.patch(i, { desc })
                          ed.end()
                        }}
                        className="text-[15px] leading-relaxed text-neutral-400"
                      />
                    ) : (
                      <p className="text-[15px] leading-relaxed text-neutral-400">{it.desc || cover?.desc}</p>
                    )}
                  </div>
                </div>
              )}
              </div>
              </Wrapper>
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

// 同一个组件撑三个地址，都是 hero + 山丘 + filter bar + 项目：
//  · /          ：默认 All
//  · /branding  ：默认 Visual & Campaign
//  · /product   ：默认 Product
// filter 和地址栏绑定：All ↔ /，Visual & Campaign ↔ /branding，Product ↔ /product。
// 点 filter 就是切换地址；直接打开某个地址、或者按浏览器前进后退，filter 也会跟着对上。
const FILTER_PATH = { Branding: '/branding', Product: '/product' }

// 让标题「Clarity With Character」的字底部藏到山丘后面：
// 量出标题文字的基线位置，再把山丘整体往上挪，使标题下方那一段里「最高的山头」
// 刚好盖住字高的底部 TITLE_HIDE；山比较低的地方字就完整露出来，离广告牌也远一些。山丘画布的天空是透明的，挪上去以后标题从天空里透出来，
// 只有被山（和前面的广告牌）挡住的地方看不见。
const TITLE_HIDE = 0.4
// 滚动多少像素完成「标题藏进山后 + 广告牌立起来」
const RISE_SCROLL = 320
const scrollProgress = () => Math.min(1, Math.max(0, window.scrollY / RISE_SCROLL))
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function useTitleTuck(hillsRef, ridgeAt, titleRef) {
  const [shift, setShift] = useState(0)
  const shiftRef = useRef(0)
  const liftRef = useRef(0) // 页面顶部时标题往上抬多少，保证一开始完全露在山上面
  const offsetRef = useRef(0) // 当前实际加在标题上的 translateY

  // 滚动时：标题从「抬高、完全露出」平滑落到「藏一截到山后」
  useEffect(() => {
    const apply = () => {
      const t = titleRef.current
      if (!t) return
      const y = -liftRef.current * (1 - easeInOut(scrollProgress()))
      if (Math.abs(y - offsetRef.current) < 0.1 && t.style.transform) return
      offsetRef.current = y
      t.style.transform = `translateY(${y.toFixed(1)}px)`
    }
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(apply)
    }
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [titleRef, shift])

  useEffect(() => {
    if (!ridgeAt) return
    const measure = () => {
      const brace = document.querySelector('.ir-brace-l')
      const hills = hillsRef.current
      if (!brace || !hills) return
      const cs = getComputedStyle(brace)
      const ctx = document.createElement('canvas').getContext('2d')
      ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
      const m = ctx.measureText('H')
      const asc = m.fontBoundingBoxAscent
      const desc = m.fontBoundingBoxDescent
      const capH = m.actualBoundingBoxAscent
      const r = brace.getBoundingClientRect()
      // 量的时候扣掉当前滚动动画加在标题上的位移，拿到「落定」时的位置
      const baseline = r.top + window.scrollY - offsetRef.current + (r.height - (asc + desc)) / 2 + asc
      liftRef.current = capH * TITLE_HIDE + 18
      const target = baseline - capH * TITLE_HIDE // 山脊线应该落在这里
      const hr = hills.getBoundingClientRect()
      // 标题下方那一段（画面中间 ± 标题大约一半宽）里，最高的山脊（y 最小）
      const half = Math.min(460, hr.width * 0.32)
      let top = Infinity
      for (let x = hr.width / 2 - half; x <= hr.width / 2 + half; x += 8) {
        const y = ridgeAt(x)
        if (y < top) top = y
      }
      if (!Number.isFinite(top)) return
      const naturalTop = hr.top + window.scrollY - shiftRef.current
      const next = Math.round(target - top - naturalTop)
      shiftRef.current = next
      setShift(next)
    }
    let alive = true
    ;(document.fonts?.ready || Promise.resolve()).then(() => alive && measure())
    window.addEventListener('resize', measure)
    return () => {
      alive = false
      window.removeEventListener('resize', measure)
    }
  }, [hillsRef, ridgeAt])
  return shift
}

function Home() {
  const { pathname } = useLocation()
  const hillsRef = useRef(null)
  const titleRef = useRef(null)
  const [ridgeAt, setRidgeAt] = useState(null)
  const tuck = useTitleTuck(hillsRef, ridgeAt, titleRef)
  const navigate = useNavigate()
  const activeFilter = pathname === '/branding' ? 'Branding' : pathname === '/product' ? 'Product' : null
  const setActiveFilter = (filter) => {
    const to = FILTER_PATH[filter] || '/'
    if (to !== pathname) navigate(to)
  }
  return (
    <div className="min-h-screen bg-white">
      <NavBar fixed />
      {/* 外层铺天空灰：山丘画布天空透明，往上挪进 hero 以后，底下露出来的都是这个颜色 */}
      <div style={{ backgroundColor: '#ededed', overflowX: 'clip' }}>
      {/* 顶部白→灰渐变：与山丘天空色 (#ededed) 无缝衔接 */}
      <div style={{ background: 'linear-gradient(to bottom, #ffffff 0%, #ffffff 22%, #ededed 100%)', overflowX: 'clip' }}>
        <div className="h-24" />
        <Hero titleRef={titleRef} />
      </div>
      {/* Hero 场景：程序化起伏绿地（替换原 exploring-creativity 视频）；高度缩到原来的 95%。
          发光白色方块标记锚定在地形上（世界坐标），随 pan 一起移动 —— 由 GrassHills 内部投影渲染 */}
      <div ref={hillsRef} style={{ marginTop: tuck }}>
      <GrassHills
        // 多出来的高度全在底部（extraBottom）：上面广告牌 / 山的画面不变，只是往下多看一截草地。
        // 广告牌走道到 filter 之间的草地加高到原来的 1.5 倍（画布从 78vh 加到 88.3vh，上半截仍是原来的 66vh）
        height="clamp(474px, 88.3vh, 972px)"
        extraBottom={0.2516}
        billboardProgress={scrollProgress}
        // 聚焦广告牌时，把后面的标题淡出（不然会从广告牌上沿露出来）
        // 点开广告牌后，画面上显示完整的 About Me（纯白底），可以在广告牌里上下滚动
        billboardContent={
          <div className="px-[6%] pb-24 pt-14 text-left" style={{ fontFamily: '"Figtree", sans-serif' }}>
            <AboutContent onWhite />
          </div>
        }
        onFocusChange={(on) => {
          const t = titleRef.current
          if (!t) return
          t.style.transition = 'opacity 0.6s ease'
          t.style.opacity = on ? '0' : '1'
        }}
        className=""
        // 「take a peak」发光方块暂时不在首页显示（heroMarkers 数据和 GrassHills 里的方块代码都保留，之后用在别处）
        // 相机拉近、视线抬高：少露一点山丘，把广告牌放大
        fov={31.5}
        lookY={-5} // 比之前 -2 更低 → 画面里的东西整体往上移，广告牌不再贴着 hero 底部
        transparentSky
        onSkyline={(fn) => setRidgeAt(() => fn)}
        billboard={{
          x: 0,
          z: 38,
          image: billboardImg,
          // 广告牌图片右半边（原来的箭头 + click to About Me）换成自己画的：蓝色 Want the full story? + 会弹的箭头。
          // 下面的数字都是原图（1351×634）里的像素位置，照着原来的箭头和文字量出来的
          cta: {
            cropX: 700, // 原图 x=700 以右不画
            color: '#239fe4',
            circle: { cx: 840.5, cy: 186.5, r: 63.5 },
            textX: 778,
            lines: ['Want the', 'full story?'],
            baselines: [370, 483],
            fontSize: 104,
          },
        }}
        sky={0xededed}
        grassLow={0x0d0d0d}
        grassMid={0x616161}
        grassHigh={0xe6e6e6}
      />
      </div>
      </div>
      <div className="dot-grid relative pb-20">
        {/* 深绿粒子从上飘落，接续山脉粒子感 */}
        <FallingParticles />
        <div className="relative z-10">
          <WorkShowcase activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
          {/* 只有 Visual & Campaign 这一个视图换成新画廊 */}
          {activeFilter === 'Branding' && <ExperimentGallery key="branding" />}
          {/* All：Visual & Campaign 的项目 + Product 独有项目，同一套画廊排版。
              高度 / 顺序 / 文字单独保存（和 Visual & Campaign 那边互不影响） */}
          {activeFilter === null && (
            <ExperimentGallery
              key="all"
              defaults={allGalleryDefaults}
              storageKey="gallery-all-edits-v1"
              saveName="all"
            />
          )}
          {/* Product 还是原来的玻璃卡片区。组件、newCovers 数据、图片 import 一个没删。 */}
          {activeFilter === 'Product' && <WorkShowcaseNew activeFilter="Product" />}
        </div>
      </div>
      <Footer light />
    </div>
  )
}

export default Home
