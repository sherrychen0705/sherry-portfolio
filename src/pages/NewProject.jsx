import { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import heroVid from '../assets/hive-branding/hero.mp4'
import keyvisualVid from '../assets/hive-branding/keyvisual.mp4'
import keyvisual2Vid from '../assets/hive-branding/keyvisual2.mp4'
import posterImg from '../assets/hive-branding/poster.png'
import colorImg from '../assets/hive-branding/color.png'
import bag1Img from '../assets/hive-branding/bag1.png'
import box1Img from '../assets/hive-branding/box1.png'
import ins1Img from '../assets/hive-branding/ins1.png'
import board1Img from '../assets/hive-branding/board1.png'
import board2Img from '../assets/hive-branding/board2.png'
import poster1Img from '../assets/hive-branding/poster1.png'
import screen1Img from '../assets/hive-branding/screen1.png'
import demo1Vid from '../assets/hive-branding/demo1.mp4'
import demo2Vid from '../assets/hive-branding/demo2.mp4'

// 灰色媒体占位块（可带编号）
function Ph({ label, className = '' }) {
  return (
    <div className={`flex items-center justify-center rounded-md bg-neutral-200 ${className}`}>
      {label && <span className="text-3xl font-semibold text-neutral-400">{label}</span>}
    </div>
  )
}
// 灰色文字条占位
function Bar({ w = '100%', className = 'h-3.5' }) {
  return <div className={`rounded bg-neutral-200 ${className}`} style={{ width: w }} />
}

// 左侧固定说明文字：滚动到 Intro 时淡入（参考 Lepal 的 SectionNav）
function SideNote() {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById('intro')
      if (!el) return
      setShown(el.getBoundingClientRect().top < window.innerHeight * 0.7)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div
      aria-hidden={!shown}
      className={`pointer-events-none fixed left-6 top-1/2 z-40 hidden w-[clamp(200px,25vw,430px)] -translate-y-1/2 text-left text-[15px] leading-[1.55] text-neutral-600 transition-opacity duration-500 md:block ${
        shown ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <p>
        Hive.ai is a platform for people who gather large volumes of information and dig deep into
        it — researchers, writers, and creative professionals. It lets them collect scattered
        pieces of knowledge, merge ideas across sources, and build them into connected
        &ldquo;hives&rdquo; of thinking. Hive helps users iterate on, expand, and reshape their
        ideas, and — most importantly — surfaces connections they would never have thought to make
        on their own.
      </p>
    </div>
  )
}

function NewProject() {
  return (
    <div className="new-project-page min-h-screen bg-white">
      <NavBar />

      {/* 左侧固定说明文字（滚动到 Intro 淡入） */}
      <SideNote />

      {/* Hero —— hero.mp4，整宽按视频原始比例（高度=视频高度） */}
      <div className="mt-6">
        <video src={heroVid} autoPlay loop muted playsInline className="w-full" />
      </div>

      {/* Intro —— 标题 + 两段文字（参考 Lepal 格式） */}
      <div id="intro" className="container-fluid mt-16 text-left">
        <h2 className="text-[32px] font-semibold text-black">Intro to Hive.ai Rebranding</h2>
        <p className="mt-4 text-neutral-700">
          Hive.ai helps researchers and creative professionals turn scattered information into
          connected thinking.
        </p>
        <p className="mt-4 text-neutral-700">
          Hive.ai has been in design and development since August 2024, built with a group of
          friends from CMU and UChicago as our entrepreneurship project. As the sole designer,
          I&rsquo;ve been responsible for evolving the product continuously over time.
        </p>
      </div>

      {/* 正文顺流：keyvisual → demo1|demo2 → screen1灰盒 → color|box1 → ins1 → poster1 → board → poster|bag1 → 占位12 */}
      <div className="container-fluid mt-16">
        <video src={keyvisualVid} autoPlay loop muted playsInline className="w-full rounded-md" />

        {/* demo1 | demo2（移到 keyvisual 下面） */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <video src={demo1Vid} autoPlay loop muted playsInline className="aspect-square w-full rounded-md object-cover" />
          <video src={demo2Vid} autoPlay loop muted playsInline className="aspect-square w-full rounded-md object-cover" />
        </div>

        {/* screen1 灰盒（移到 demo1|demo2 下面）：灰底比图内浅色稍深、整图不裁切 */}
        <div className="mt-3 rounded-md bg-[#e8e8e8] p-6">
          <img src={screen1Img} alt="Screen" className="mx-auto block w-full rounded-sm" />
        </div>

        {/* color.png（整图不裁、底色=图自身底色 #fcfcfc） | box1 */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-md bg-[#fcfcfc]">
            <img src={colorImg} alt="Color system" className="w-full object-contain" />
          </div>
          <img src={box1Img} alt="Box" className="aspect-square w-full rounded-md object-cover" />
        </div>

        {/* ins1 */}
        <img src={ins1Img} alt="Instagram" className="mt-3 w-full rounded-md" />
        {/* poster1.png：ins1 下方，整宽 */}
        <img src={poster1Img} alt="Poster 1" className="mt-3 w-full rounded-md" />
        {/* keyvisual2.mp4：poster1 下面，整宽 */}
        <video src={keyvisual2Vid} autoPlay loop muted playsInline className="mt-3 w-full rounded-md" />

        {/* board1 | board2 */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <img src={board1Img} alt="Mood board" className="aspect-square w-full rounded-md object-cover" />
          <img src={board2Img} alt="Mood board 2" className="aspect-square w-full rounded-md object-cover" />
        </div>

        {/* poster.png | bag1（slot 8/9） */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <img src={posterImg} alt="Poster" className="aspect-square w-full rounded-md object-cover" />
          <img src={bag1Img} alt="Bag" className="aspect-square w-full rounded-md object-cover" />
        </div>
      </div>

      <Footer light />
    </div>
  )
}

export default NewProject
