import avatar from '../assets/home/avatar.png'
import heroLoop from '../assets/home/videos/hero-loop.mp4'
import workNexus from '../assets/home/work-nexus.jpg'
import workHiveai from '../assets/home/work-hiveai.jpg'
import workLepal from '../assets/home/work-lepal.jpg'
import workSkinlab from '../assets/home/work-skinlab.jpg'
import workGlobbbe from '../assets/home/work-globbbe.jpg'
import workOmnicom from '../assets/home/work-omnicom.png'
import icon1 from '../assets/home/gallery/icon1.png'
import icon2 from '../assets/home/gallery/icon2.png'
import icon3 from '../assets/home/gallery/icon3.png'
import g1 from '../assets/home/gallery/g1.jpg'
import g2 from '../assets/home/gallery/g2.jpg'
import g3 from '../assets/home/gallery/g3.jpg'
import g4 from '../assets/home/gallery/g4.jpg'
import g5 from '../assets/home/gallery/g5.jpg'
import g6 from '../assets/home/gallery/g6.jpg'
import g7 from '../assets/home/gallery/g7.jpg'
import g8 from '../assets/home/gallery/g8.jpg'
import g9 from '../assets/home/gallery/g9.jpg'
import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

const filterTags = ['Healthcare Digital Experience', 'UX', 'Visual']

// 新排版：浅灰底盒子内嵌封面图。顺序在 2 列网格里排成
// OMNICOM|NEXUS / HIVE|SKINLAB / LEPAL|GLOBBBE
const newCovers = [
  { img: workOmnicom, title: 'OMNICOM', category: 'Healthcare · Branding', num: '00', link: '/omnicom-entry', cats: ['Healthcare Digital Experience', 'Visual'], imgAspect: '6 / 5' },
  { img: workNexus, title: 'NEXUS', category: 'B2B · UX Design', num: '01', link: '/nexus', cats: ['Healthcare Digital Experience', 'UX'], imgAspect: '6 / 5' },
  { img: workHiveai, title: 'HIVE', category: 'AI Tool · UX Design', num: '02', link: '/hiveai', cats: ['UX'] },
  { img: workLepal, title: 'LEPAL', category: 'Visual Design · Product Strategy', num: '03', link: '/lepal', cats: ['Visual'] },
  { img: workSkinlab, title: 'SKINLAB', category: 'UX Research · Design System', num: '04', link: '/skinlab', cats: ['UX'] },
  { img: workGlobbbe, title: 'GLOBBBE', category: 'UX Design · Game Design', num: '05', link: '/globbbe', cats: ['UX', 'Visual'] },
]

const gallery = [g1, g2, g3, g4, g5, g6, g7, g8, g9]

const deskItems = [
  {
    icon: icon1,
    title: 'Design Competition Winner',
    desc: 'Had a blast creating work that won prestigious international design awards.',
  },
  {
    icon: icon2,
    title: 'Healthcare Creative Designs',
    desc: 'Creating branding campaigns for pharmaceutical companies + designing SaaS product.',
  },
  {
    icon: icon3,
    title: 'Industrial design to UXUX',
    desc: 'Rooted in product design thinking, I made the leap from industrial design to digital UI/UX design three years ago.',
  },
]

function Hero() {
  return (
    <header className="container-fluid pt-16 text-left">
      <div className="flex items-center gap-3 mb-6">
        <img
          src={avatar}
          alt="Sherry Chen"
          className="h-10 w-10 rounded-full object-cover transition-transform duration-500 ease-out hover:scale-[1.3]"
        />
        <span className="text-neutral-600 text-sm">Sherry (Huiyang) Chen</span>
      </div>
      <h1 className="max-w-4xl text-[40px] font-medium leading-[1.2] text-black md:text-[60px]">
        {'Turning complexity into experiences people can trust.'.split(' ').map((word, i) => (
          <span
            key={i}
            className="word-in mr-[0.28em] inline-block"
            style={{ animationDelay: `${i * 85}ms` }}
          >
            {word}
          </span>
        ))}
      </h1>
      <p className="mt-6 text-neutral-600 max-w-4xl">
        Currently at <span className="text-blue-400">Omnicom Health</span> | Judge at Orpetron | Prev
        at IPG Health ⋄ IKEA ⋄ UMich ⋄{' '}
        <span className="whitespace-nowrap">Parsons School of Design</span>
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

function WorkShowcaseNew({ activeFilter }) {
  const covers = activeFilter ? newCovers.filter((c) => c.cats.includes(activeFilter)) : newCovers
  return (
    <section className="container-fluid mt-24 grid grid-cols-1 items-start gap-x-8 gap-y-24 md:grid-cols-2">
      {covers.map((c, i) => {
        const Wrapper = c.link ? Link : 'div'
        const wrapperProps = c.link ? { to: c.link } : {}
        return (
          <Reveal strong key={c.title} delay={(i % 2) * 120} className="text-left">
            <Wrapper {...wrapperProps} onMouseEnter={playBeep} className="group block">
              {/* 顶部细线 + 标题/分类（左） + 编号（右） */}
              <div className="flex items-start justify-between border-t border-[#BEBEBE] pt-3">
                <div>
                  <h3 className="text-sm font-semibold text-black">{c.title}</h3>
                  <p className="mt-0.5 text-sm text-neutral-400">{c.category}</p>
                </div>
                <span className="text-sm text-neutral-400">{c.num}</span>
              </div>
              {/* 白底盒子：比例随封面图，图片放大填充（约 1.7×） */}
              <div className="mt-4 overflow-hidden rounded-[3px] bg-white p-3 md:p-4">
                <img
                  src={c.img}
                  alt={c.title}
                  style={c.imgAspect ? { aspectRatio: c.imgAspect } : undefined}
                  className={`block w-full rounded-[2px] object-cover shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-transform duration-500 ease-out ${
                    c.link ? 'group-hover:scale-[1.02]' : ''
                  }`}
                />
              </div>
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
    <div>
      {/* 横跨整个屏幕的灰色横线 */}
      <div className="border-t border-neutral-300" />
      <div className="container-fluid mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-left">
        <RotatingSquare />
        <span className="text-sm text-neutral-500">Filter by:</span>
        {filterTags.map((tag, i) => {
          const isActive = activeFilter === tag
          return (
            <Fragment key={tag}>
              {i > 0 && <span className="text-sm text-neutral-300">/</span>}
              <button
                type="button"
                onClick={() => setActiveFilter(isActive ? null : tag)}
                className={`text-sm transition-colors ${
                  isActive
                    ? 'font-bold text-[#5db83c]'
                    : 'font-normal text-neutral-400 hover:text-black'
                }`}
              >
                {tag}
              </button>
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}

function MoreWorks() {
  const track = [...gallery, ...gallery]
  return (
    <section className="mt-24 text-center">
      <div className="container-fluid">
        <h2 className="text-[40px] font-medium text-black leading-[1.2] md:text-[60px]">More works I'm passionate about</h2>
        <p className="mt-3 text-neutral-500">
          A peek into what fuels me. Take a look at more of my work at:
          <br />
          B2B SaaS | App Visual | User Research | Service Design | XR Concept | Industrial Design
        </p>
      </div>
      <div className="mt-8 overflow-hidden py-10">
        <div className="flex gap-4 w-max animate-marquee hover:[animation-play-state:paused]">
          {track.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="relative h-56 w-auto flex-none rounded-[3px] object-cover transition-transform duration-500 ease-out hover:z-10 hover:scale-[1.3]"
            />
          ))}
        </div>
      </div>
      <div className="mt-6 flex items-center justify-center gap-3">
        <RotatingSquare />
        <a href="#" className="text-sm text-neutral-700 transition-colors hover:text-black">
          Browse All Works
        </a>
      </div>
    </section>
  )
}

function CreativeDesk() {
  return (
    <section className="container-fluid mt-24 text-center">
      <h2 className="text-[40px] font-medium text-black leading-[1.2] md:text-[60px]">Currently on my creative desk…</h2>
      <p className="mt-3 text-neutral-500 max-w-2xl mx-auto">
        Being a design-aholic means the work I've done, and the projects I'm working on now, keep me
        constantly excited and fulfilled. Design feels more like a passion-fueled hobby than a job. Here
        are a few snapshots of what's currently on my creative desk.
      </p>
      <div className="mt-10 grid md:grid-cols-3 gap-8 text-left">
        {deskItems.map((d) => (
          <div key={d.title}>
            <img src={d.icon} alt="" className="h-12 w-auto mb-4" />
            <h3 className="text-black font-semibold">{d.title}</h3>
            <p className="mt-2 text-sm text-neutral-500">{d.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Home() {
  const [activeFilter, setActiveFilter] = useState(null)
  return (
    <div className="min-h-screen bg-white">
      <NavBar fixed />
      <div className="h-24" />
      <Hero />
      <HeroVideo />
      <div className="dot-grid mt-24 pb-20">
        <WorkShowcase activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
        <WorkShowcaseNew activeFilter={activeFilter} />
      </div>
      <MoreWorks />
      <CreativeDesk />
      <Footer light />
    </div>
  )
}

export default Home
