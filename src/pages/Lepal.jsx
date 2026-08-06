import { useEffect, useRef, useState } from 'react'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

import vid1 from '../assets/lepal/1.mp4'
import vid2 from '../assets/lepal/2.mp4'
import vid3a from '../assets/lepal/3a.mp4'
import vid4a from '../assets/lepal/4a.mp4'
import vid4b from '../assets/lepal/4b.mp4'
import vid5c from '../assets/lepal/5c.mp4'
import vid5d from '../assets/lepal/5d.mp4'
import vid5e from '../assets/lepal/5e.mp4'
import vid5 from '../assets/lepal/5.mp4'
import vid6 from '../assets/lepal/6.mp4'
import vid8 from '../assets/lepal/8.mp4'
import vid10 from '../assets/lepal/10.mp4'
import vid11 from '../assets/lepal/11.mp4'
import productImg from '../assets/lepal/ny-product.png'
import museImg from '../assets/lepal/MUSE.png'
import cardVid from '../assets/lepal/card.mp4'
import vidStreak1 from '../assets/lepal/streak1.mp4'
import heroImg from '../assets/lepal/hero.png'

// 进入视口才播放：返回 [ref, ...] 的 hook
function useInViewPlay() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) el.play().catch(() => {})
        else el.pause()
      },
      { threshold: 0.2 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

// 设计说明文字：水平垂直居中、仅当滚到 About Lepal(#intro) 区块时淡入。奖项徽章固定左下角。
function SectionNav() {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById('slot2')
      if (!el) return
      // 滚到 slot2 才出现，之后往下一直显示；slot2 以上不显示
      setShown(el.getBoundingClientRect().top < window.innerHeight * 0.7)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <>
      <div
        aria-hidden={!shown}
        className={`pointer-events-none fixed left-6 top-1/2 z-40 hidden w-[clamp(200px,25vw,430px)] -translate-y-1/2 space-y-3 text-left text-[15px] leading-[1.55] text-neutral-600 transition-opacity duration-500 md:block ${
          shown ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <p>
          As the lead visual designer, I built Lepal&rsquo;s visual identity from the ground up,
          crafting a playful and emotionally engaging brand that brings mental wellness to life through
          expressive characters, dynamic motion, and interactive experiences. From the animated spirit
          companions to the onboarding flow, launch campaign, and marketing assets, every touchpoint
          was designed to make self care feel approachable, rewarding, and enjoyable.
        </p>
        <p>
          The branding marked a significant milestone in Lepal&rsquo;s evolution, establishing a
          distinctive visual language that transformed the product into an experience users could build
          an emotional connection with. By combining lively animations, character driven storytelling,
          and thoughtful interactions, the experience encourages users to return because it feels
          comforting, personal, and genuinely fun.
        </p>
      </div>
      <div className="fixed bottom-8 left-6 z-40 hidden items-end gap-[40px] md:flex">
        <img src={productImg} alt="NY Product Design Awards" className="h-16 w-auto" />
        <img src={museImg} alt="MUSE Design Awards" className="h-16 w-auto" />
      </div>
    </>
  )
}

function H2({ children, className = '' }) {
  return <h2 className={`text-[32px] font-semibold text-black ${className}`}>{children}</h2>
}

// 灰色图片占位块（显示编号，方便对应真实素材）
function Ph({ label, className = '' }) {
  return (
    <div className={`flex w-full items-center justify-center rounded-md bg-neutral-200 ${className}`}>
      <span className="select-none text-3xl font-semibold text-neutral-400">{label}</span>
    </div>
  )
}

// 视频：进入视口才播放，循环、静音
function Vid({ src, className = '' }) {
  const ref = useInViewPlay()
  return (
    <video
      ref={ref}
      src={src}
      loop
      muted
      playsInline
      preload="metadata"
      className={`rounded-md object-cover ${className}`}
    />
  )
}

// slot：固定裁剪的视频（外层裁剪，内层放大定格取景）。
// 注意：观察外层容器而非被放大的 video，否则放大后交叠比例过低导致不播放。
function CropVid({ src, className = '', scale = 2, origin = '50% 84%' }) {
  const wrapRef = useRef(null)
  const vidRef = useRef(null)
  useEffect(() => {
    const wrap = wrapRef.current
    const v = vidRef.current
    if (!wrap || !v) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.1 },
    )
    obs.observe(wrap)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={wrapRef} className={`overflow-hidden rounded-md ${className}`}>
      <video
        ref={vidRef}
        src={src}
        loop
        muted
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
        style={{ transform: `scale(${scale})`, transformOrigin: origin }}
      />
    </div>
  )
}

// 整屏装入：黑底盒子，视频按高度装下（去掉样机边框），两侧留黑与底色融合
// scale 放大倍数；offsetY 上移像素（负值=上移，切掉顶部状态栏）
function FitVid({ src, className = '', heightPct = 110, scale = 1, offsetY = 0 }) {
  const ref = useInViewPlay()
  return (
    <div className={`flex items-center justify-center overflow-hidden rounded-md bg-black ${className}`}>
      <video
        ref={ref}
        src={src}
        loop
        muted
        playsInline
        preload="metadata"
        className="w-auto max-w-none"
        style={{ height: `${heightPct}%`, transform: `translateY(${offsetY}px) scale(${scale})` }}
      />
    </div>
  )
}

// slot4：滚动进入视口时，左视频从画布下方上滑淡入、右视频从画布上方下滑淡入。
// 每次滚入都重播（离开视口后重置），背景用 bg.png。
function SlideInPair({ left, right }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio >= 0.35) setShown(true)
        else if (!e.isIntersecting) setShown(false)
      },
      { threshold: [0, 0.35] },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  const base = 'w-[22.5%] transition-all duration-[2667ms] ease-[cubic-bezier(0.22,1,0.36,1)]'
  return (
    <div ref={ref} className="overflow-hidden rounded-md bg-black px-6 py-[103px]">
      <div className="flex justify-center gap-24">
        <div className={`${base} ${shown ? 'translate-y-0 opacity-100' : 'translate-y-[135%] opacity-0'}`}>
          <Vid src={left} className="aspect-[814/1588] w-full" />
        </div>
        <div className={`${base} ${shown ? 'translate-y-0 opacity-100' : '-translate-y-[135%] opacity-0'}`}>
          <Vid src={right} className="aspect-[814/1588] w-full" />
        </div>
      </div>
    </div>
  )
}

// slot7：滚动进入视口时，视频从黑底里慢慢 dissolve（透明度淡入）出现
function DissolveIn({ children, className = '' }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          obs.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={`transition-opacity duration-[1800ms] ease-out ${shown ? 'opacity-100' : 'opacity-0'} ${className}`}
    >
      {children}
    </div>
  )
}

/* ---- 水晶球发光特效 ---- */

// 四角星（静态形状，由父级控制动画/位置）
function StarShape({ size = 10, color = '#fff' }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className="block">
      <path d="M12 0C12.8 7.6 16.4 11.2 24 12 16.4 12.8 12.8 16.4 12 24 11.2 16.4 7.6 12.8 0 12 7.6 11.2 11.2 7.6 12 0Z" fill={color} />
    </svg>
  )
}

// 水晶球图 + 发光/闪星/冒星特效（定位在球上 ~29.5%,49%）
function CrystalCard({ src, className = '' }) {
  const twinkle = (dur, delay) => ({ animation: `l5cTwinkle ${dur}s ease-in-out infinite`, animationDelay: `${delay}s` })
  const rise = (delay) => ({ animation: `crystalRise 2.6s ease-out infinite`, animationDelay: `${delay}s` })
  return (
    <div className={`relative overflow-hidden rounded-md ${className}`}>
      <img src={src} alt="Crystal ball" className="h-full w-full object-cover" />
      <div
        className="pointer-events-none absolute"
        style={{ left: '29.5%', top: '49%', width: '30%', transform: 'translate(-50%,-50%)' }}
      >
        <div className="relative" style={{ paddingTop: '100%' }}>
          {/* 忽明忽暗的发光 */}
          <div
            className="absolute inset-[-24%] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(150,230,255,.85), rgba(210,130,255,.5) 42%, rgba(210,130,255,0) 68%)',
              filter: 'blur(5px)',
              mixBlendMode: 'screen',
              animation: 'crystalGlow 2.2s ease-in-out infinite',
            }}
          />
          {/* 闪烁的四角星 */}
          <span className="absolute" style={{ left: '50%', top: '-12%', ...twinkle(1.4, 0) }}>
            <StarShape size={14} />
          </span>
          <span className="absolute" style={{ left: '90%', top: '12%', ...twinkle(1.7, 0.5) }}>
            <StarShape size={10} />
          </span>
          <span className="absolute" style={{ left: '0%', top: '22%', ...twinkle(1.5, 0.9) }}>
            <StarShape size={11} />
          </span>
          <span className="absolute" style={{ left: '82%', top: '74%', ...twinkle(1.9, 0.3) }}>
            <StarShape size={9} />
          </span>
          {/* 上冒的星星 */}
          <span className="absolute" style={{ left: '38%', top: '8%', ...rise(0) }}>
            <StarShape size={9} color="#bff0ff" />
          </span>
          <span className="absolute" style={{ left: '62%', top: '20%', ...rise(1.3) }}>
            <StarShape size={7} color="#ffd7f5" />
          </span>
        </div>
      </div>
    </div>
  )
}

function Lepal() {
  return (
    <div className="lepal-page min-h-screen bg-white">
      <NavBar />
      <SectionNav />

      {/* Hero —— hero.png 整宽 */}
      <div className="mt-6">
        <img src={heroImg} alt="Lepal hero" className="w-full" />
      </div>

      {/* Intro —— 和 Nexus 一样的文字段 */}
      <div id="intro" className="container-fluid mt-16 text-left">
        <H2>About Lepal</H2>
        <p className="mt-4 text-neutral-700">
          Lepal.ai is an AI-powered mental wellness companion designed to make emotional well-being
          more approachable through CBT-inspired micro-interactions, gamified bite-sized exercises, and
          personalized spirit companions. Created for Gen Z, Lepal transforms self-reflection into an
          engaging daily habit, helping users recognize, understand, and regulate their emotions in a
          supportive, low-pressure environment.
        </p>
        <p className="mt-4 text-neutral-700">
          Rather than simply tracking moods, Lepal empowers users to build emotional resilience by
          guiding them toward healthier thought patterns and coping strategies. Through a friendly AI
          companion that grows alongside each user, the experience encourages mindful self-awareness,
          enabling people to better manage their emotions instead of letting their emotions dictate
          their lives.
        </p>
        <p className="mt-4 text-neutral-700">
          Within two weeks of launch, Lepal reached <strong className="font-bold text-black">5,000+</strong>{' '}
          weekly active users, and subscription renewals increased{' '}
          <strong className="font-bold text-black">15%</strong> within the first two months,
          demonstrating the impact of a cohesive brand experience on user engagement and long term
          retention.
        </p>
      </div>

      {/* 正文 —— 图片/视频，无淡入（唯一动效是 slot4 的滑入） */}
      <div id="section-1" className="container-fluid mt-16">
        <Vid src={vid3a} className="aspect-[16/9] w-full" />
        <div id="slot2" className="mt-3 grid grid-cols-2 gap-3">
          <div className="flex aspect-square w-full items-center justify-center rounded-md bg-black">
            <Vid src={vid2} className="aspect-square w-[65%] rounded-md" />
          </div>
          <div className="flex aspect-square w-full items-center justify-center rounded-md bg-black">
            <Vid src={vid1} className="aspect-[16/9] w-[80%] rounded-md" />
          </div>
        </div>
      </div>

      <div id="section-2" className="container-fluid mt-3">
        {/* slot 4：滚动滑入动画（每次滚入都重播），背景 bg.png */}
        <SlideInPair left={vid4a} right={vid4b} />
        {/* slot 5：黑底，5c/5d/5e 三个视频完整展示（无裁剪）、居中并排 */}
        <div className="mt-3 rounded-md bg-black px-6 py-[115px]">
          <div className="flex items-center justify-center gap-[120px]">
            <Vid src={vid5c} className="aspect-[814/1588] w-[21%]" />
            <Vid src={vid5d} className="aspect-[814/1588] w-[21%]" />
            <Vid src={vid5e} className="aspect-[1166/1164] w-[21%]" />
          </div>
        </div>
        {/* slot 8 & 9（streak1.mp4）：单独一排两个（移到 6&7 上方） */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <FitVid src={vid8} className="aspect-square w-full" heightPct={110} scale={0.79} offsetY={-34} />
          <div className="flex aspect-square w-full items-center justify-center rounded-md bg-black">
            <Vid src={vidStreak1} className="aspect-[1810/1710] w-[75%] rounded-md" />
          </div>
        </div>
        {/* slot 6 & 7：单独一排两个 */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="flex aspect-square w-full items-center justify-center rounded-md bg-black">
            <Vid src={vid5} className="h-[75%] w-auto rounded-md" />
          </div>
          <div className="flex aspect-square w-full items-center justify-center rounded-md bg-black">
            <DissolveIn className="flex w-1/2 items-center justify-center">
              <CropVid src={vid6} className="aspect-[3/4] w-full rounded-[20px]" scale={2.5} origin="50% 80%" />
            </DissolveIn>
          </div>
        </div>
      </div>

      <div id="section-3" className="container-fluid mt-3">
        <Vid src={cardVid} className="aspect-[845/390] w-full" />
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="flex aspect-square w-full items-center justify-center rounded-md bg-black">
            <Vid src={vid10} className="aspect-[930/844] w-[75%] rounded-md" />
          </div>
          <div className="flex aspect-square w-full items-center justify-center rounded-md bg-black">
            <Vid src={vid11} className="aspect-[540/518] w-[75%] rounded-md" />
          </div>
        </div>
      </div>

      <Footer light />
    </div>
  )
}

export default Lepal
