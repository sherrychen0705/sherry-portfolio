import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Reveal from './Reveal'

// —— 图片（全部在 assets/about/） ——
import gelatoMatcha from '../assets/about/3.JPG'
import gelatoMooHope from '../assets/about/1.JPG'
import gelatoPistachio from '../assets/about/2.JPG'
import tattooWhite from '../assets/about/8.jpg'
import tattooBlack from '../assets/about/7.jpg'
import sourdough1 from '../assets/about/5.png'
import sourdough2 from '../assets/about/6.png'
import piggies from '../assets/about/4.JPG'
import pixelPig from '../assets/about/9.gif'
import teamCafe from '../assets/about/fan4.jpg'
import teamPair from '../assets/about/fan3.jpg'
import teamBlue from '../assets/about/laptop-group.jpg'
import teamGreen from '../assets/about/fan5.jpg'

// About 页的全部内容（文字 + 图片 + 排版），抽出来给两个地方用：
//  · /aboutme 页面：蓝紫天空山丘背景上，白字
//  · 首页广告牌点开后：纯白底，深色字（onWhite）
const Tone = createContext(false)
// 广告牌版专用：逐行聚焦（当前行清晰，其它行 25% + 模糊）
const Spot = createContext(null)

// 倾斜 + 垂直交错(y) + hover 可爱 wiggle 的照片。y<0 上移、y>0 下移，用来做上下错落。
function Photo({ src, className = '', rotate = 0, y = 0, contain = false, plain = false }) {
  return (
    <div
      className={`about-photo shrink-0 ${className}`}
      style={{ transform: `translateY(${y}px) rotate(${rotate}deg)` }}
    >
      <img
        src={src}
        alt=""
        className={`h-full w-full ${contain ? 'object-contain' : 'object-cover'} ${
          plain ? '' : 'rounded-[6px] shadow-[0_10px_28px_rgba(0,0,0,0.28)]'
        }`}
      />
    </div>
  )
}

// 左侧板块标签（20px，不换行）
function Label({ children }) {
  const onWhite = useContext(Tone)
  return (
    <h2 className={`text-[20px] leading-snug ${onWhite ? 'text-neutral-900' : 'whitespace-nowrap text-white'}`}>
      {children}
    </h2>
  )
}

// 一行：左标签(可空) + 文字 + 右侧图片簇，底部细线；标签与文字同一行(items-end)，图片在文字上方；
// 随 scroll 从下往上淡入跳入。
// 广告牌版（onWhite）：图片放大 2 倍、紧挨着文字；上方多留一些空间给往上错落的大图；
// 放不下时图片自动换到文字下面一行。
function Row({ idx, label, text, children, padTop = 'pt-16', padBottom = 'pb-4' }) {
  const onWhite = useContext(Tone)
  const spot = useContext(Spot)
  const ref = useRef(null)
  useEffect(() => {
    if (spot && idx != null) spot.register(idx, ref.current)
  }, [spot, idx])
  const dim = spot && idx != null && spot.active !== idx
  // 广告牌版：图片默认放大 2 倍；这一行放不下时自动缩小到刚好放得下（最小保持原大小），不会被裁掉或盖住文字
  const areaRef = useRef(null)
  const textRef = useRef(null)
  const innerRef = useRef(null)
  const [box, setBox] = useState({ z: 2, w: 0, h: 0 })
  useLayoutEffect(() => {
    if (!onWhite) return
    const fit = () => {
      const area = areaRef.current
      const inner = innerRef.current
      const txt = textRef.current
      if (!area || !inner || !txt) return
      const nw = inner.offsetWidth
      const nh = inner.offsetHeight
      const avail = area.clientWidth - txt.offsetWidth - 32
      const z = Math.max(1, Math.min(2, avail / Math.max(1, nw)))
      setBox((b) => (Math.abs(b.z - z) < 0.01 && b.w === nw && b.h === nh ? b : { z, w: nw, h: nh }))
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(areaRef.current)
    ro.observe(innerRef.current)
    return () => ro.disconnect()
  }, [onWhite])
  return (
    <Reveal strong>
      <div
        ref={ref}
        data-about-row
        className={`grid grid-cols-1 gap-y-3 ${onWhite ? '' : 'border-b'} ${
          onWhite
            ? 'md:grid-cols-[200px_1fr] md:items-center md:gap-x-10' // 广告牌版：标签、文字、图片三者按水平中线对齐
            : 'md:grid-cols-[300px_1fr] md:items-end md:gap-x-14'
        } ${
          onWhite ? '' : 'border-white/40' // 广告牌版不要分隔线
        } ${onWhite ? 'pt-44' : padTop} ${padBottom}`}
        style={
          spot && idx != null
            ? {
                opacity: dim ? 0.25 : 1,
                filter: dim ? 'blur(4px)' : 'blur(0px)',
                transition: 'opacity 0.45s ease, filter 0.45s ease',
              }
            : undefined
        }
      >
        <div>{label ? <Label>{label}</Label> : null}</div>
        {onWhite ? (
          <div ref={areaRef} className="flex min-w-0 items-center gap-8">
            <p ref={textRef} className="w-[200px] shrink-0 text-[17px] text-neutral-800">
              {text}
            </p>
            {/* 外层占住放大后的尺寸，内层按比例放大（从左下角放大，贴着文字） */}
            <div className="relative shrink-0" style={{ width: box.w * box.z, height: box.h * box.z }}>
              <div
                ref={innerRef}
                className="absolute bottom-0 left-0 flex items-end"
                style={{ transform: `scale(${box.z})`, transformOrigin: 'bottom left' }}
              >
                {children}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-end justify-between gap-6">
            <p className="text-[17px] text-white">{text}</p>
            <div className="flex items-end">{children}</div>
          </div>
        )}
      </div>
    </Reveal>
  )
}

// 逐行聚焦：找到外面那个可滚动的容器（data-about-scroll），滚动时离容器中线最近的那一行是「当前行」
function useSpotlight(enabled, rootRef) {
  const [active, setActive] = useState(0)
  const rows = useRef([])
  const register = useRef((i, el) => {
    rows.current[i] = el
  }).current
  useEffect(() => {
    if (!enabled) return
    const scroller = rootRef.current?.closest('[data-about-scroll]')
    if (!scroller) return
    let raf = 0
    const update = () => {
      const box = scroller.getBoundingClientRect()
      const mid = box.top + box.height * 0.5
      let best = 0
      let bestD = Infinity
      rows.current.forEach((el, i) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        const d = Math.abs((r.top + r.bottom) / 2 - mid)
        if (d < bestD) {
          bestD = d
          best = i
        }
      })
      setActive(best)
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    update()
    scroller.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      scroller.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [enabled, rootRef])
  return enabled ? { active, register } : null
}

export default function AboutContent({ onWhite = false }) {
  const body = onWhite ? 'text-neutral-800' : 'text-white'
  const cols = onWhite ? 'md:grid-cols-[200px_1fr] md:gap-x-10' : 'md:grid-cols-[300px_1fr] md:gap-x-14'
  const rootRef = useRef(null)
  const spot = useSpotlight(onWhite, rootRef)
  return (
    <Tone.Provider value={onWhite}>
    <Spot.Provider value={spot}>
    <div ref={rootRef}>

        {/* About Me */}
        <section className={`grid grid-cols-1 gap-y-4 ${cols}`}>
          <Label>About Me</Label>
          <div className={`max-w-2xl space-y-6 text-[17px] leading-relaxed ${body}`}>
            <p>
              I&rsquo;m Huiyang Chen, a creative with 2.5 years of experience across agencies, in-house
              teams, startups, and helped 6+ clients launched brands and products. I enter my mind flow
              quickly when I&rsquo;m doing creative work, which makes me fullfilling. Creatings products
              and brands with intention, character, and lasting impact.
            </p>
            <p>
              I&rsquo;m currently a designer at Omnicom Health, bringing new digital experiences to
              pharma brand campaigns and creating enterprise-grade tools.
            </p>
            <p>
              I also build projects with code. I use AI tools to develop real applications, prototypes,
              and experiments. It keeps me close to the medium and helps me understand what&rsquo;s
              possible.
            </p>
          </div>
        </section>

        {/* Awards */}
        <section className={`mt-24 grid grid-cols-1 gap-y-4 ${cols}`}>
          <Label>Awards</Label>
          <ul className={`space-y-5 text-[17px] ${body}`}>
            <li>Red Dot Design Award - Brand and Communication Winner, 2024 &amp; 2025</li>
            <li>IF Design Award - Product Design Winner, 2025</li>
            <li>A&rsquo; Design Award - Silver, 2025</li>
            <li>Indigo Design Award Gold - Shortlisted for Best in Digital Design, 2025</li>
            <li>New York Product Design - Gold, 2024 &amp; 025</li>
          </ul>
        </section>

        {/* People have described me as —— 标签与 “a team cheerleader” 同一行 */}
        <div className="mt-24">
          <Row idx={0} label="People Have Described Me As" text="a team cheerleader">
            <div className="flex items-end pl-4">
              <Photo src={teamCafe} className="h-24 w-32" rotate={-6} y={-6} />
              <Photo src={teamPair} className="-ml-4 h-28 w-24" rotate={5} y={-44} />
              <Photo src={teamBlue} className="-ml-4 h-24 w-36" rotate={-4} y={-14} />
              <Photo src={teamGreen} className="-ml-4 h-24 w-32" rotate={6} y={-34} />
            </div>
          </Row>
        </div>

        {/* Outside of Work —— 标签与第一行 “I own a growing collection…” 同一行 */}
        <div className="mt-24">
          <Row idx={1}
            label="Outside of Work"
            text="I own a growing collection of New York City gelato map"
            padTop="pt-8"
            padBottom="pb-2"
          >
            <Photo src={gelatoMatcha} className="h-32 w-24" rotate={-6} y={-24} />
            <Photo src={gelatoMooHope} className="-ml-4 h-28 w-20" rotate={5} y={-4} />
            <Photo src={gelatoPistachio} className="-ml-4 h-36 w-24" rotate={-4} y={-42} />
          </Row>

          <Row idx={2} text="I do tattoo designs" padTop="pt-8" padBottom="pb-2">
            <Photo src={tattooWhite} className="h-24 w-32" rotate={-5} y={-6} />
            <Photo src={tattooBlack} className="-ml-3 h-32 w-24" rotate={7} y={-40} />
          </Row>

          <Row idx={3} text="I&rsquo;m a sourdough girl" padTop="pt-8" padBottom="pb-2">
            <Photo src={sourdough2} className="h-28 w-36" rotate={-5} y={-34} />
            <Photo src={sourdough1} className="-ml-4 h-32 w-28" rotate={6} y={-6} />
          </Row>

          <Row idx={4} text="I feed little piggies" padTop="pt-8" padBottom="pb-2">
            <Photo src={piggies} className="h-28 w-44" rotate={-3} y={-22} />
          </Row>

          <Row idx={5}
            text="I use Claude agents and Notion AI to manage my daily life"
            padTop="pt-8"
            padBottom="pb-2"
          >
            <Photo src={pixelPig} className="h-28 w-28" contain plain y={16} />
          </Row>
        </div>
    </div>
    </Spot.Provider>
    </Tone.Provider>
  )
}
