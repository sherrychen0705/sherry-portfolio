import { useEffect, useRef, useState } from 'react'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import cover from '../assets/heartie/cover.png'
import vid1 from '../assets/heartie/1.mp4'
import watch from '../assets/heartie/watch.png'
import avatars from '../assets/heartie/avatars.mp4'
import enter from '../assets/heartie/enter.mp4'
import chef1 from '../assets/heartie/Chef1.mp4'
import chef2 from '../assets/heartie/Chef2.mp4'
import chef3 from '../assets/heartie/Chef3.mp4'
import xuefeigame1 from '../assets/heartie/xuefeigame1.mp4'
import onboarding from '../assets/heartie/onboarding.mp4'
import diet from '../assets/heartie/diet.png'
import diet1 from '../assets/heartie/diet1.png'
import merch1 from '../assets/heartie/merch1.png'
import merch2 from '../assets/heartie/merch2.png'
import ad1 from '../assets/heartie/ad1.png'
import merch3 from '../assets/heartie/merch3.png'
import merch4 from '../assets/heartie/merch4.png'
import merch5 from '../assets/heartie/merch5.png'

// 滚动到视口才丝滑淡入（进入一次后保持显示）
function FadeIn({ children, className = '' }) {
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
      { threshold: 0.35 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={`transition-opacity duration-[1200ms] ease-out ${shown ? 'opacity-100' : 'opacity-0'} ${className}`}
    >
      {children}
    </div>
  )
}

// Chef 组：三个视频交错排（左 / 右 / 左）在同一个浅黄底盒里，每个视频圆角 20px、原比例不裁切。
// chef1（第 1 排）右侧空位放 diet.png，滚动到此才丝滑淡入。
function ChefGroup({ videos }) {
  const vidCls = 'rounded-[20px]'
  return (
    <div className="w-full rounded-md bg-[#FFF5E5] px-[5%] py-[7%]">
      <div className="flex flex-col gap-[50px]">
        {/* 第 1 排：chef1（左） + diet.png（右，滚动淡入） */}
        <div className="flex items-center justify-start gap-[4%]">
          <video src={videos[0]} autoPlay loop muted playsInline style={{ width: '66%' }} className={vidCls} />
          <FadeIn className="flex flex-1 justify-center">
            <img src={diet} alt="Diet" className="w-full" />
          </FadeIn>
        </div>
        {/* 第 2 排：diet1.png（左） + chef2（右） */}
        <div className="flex items-center gap-[4%]">
          <div className="flex flex-1 justify-center">
            <img src={diet1} alt="Diet 1" className="w-full" />
          </div>
          <video src={videos[1]} autoPlay loop muted playsInline style={{ width: '72%' }} className={vidCls} />
        </div>
        {/* 第 3 排：chef3（左） */}
        <div className="flex justify-start">
          <video src={videos[2]} autoPlay loop muted playsInline style={{ width: '66%' }} className={vidCls} />
        </div>
      </div>
    </div>
  )
}

// heartie 项目：结构/间距与 HAY(/new-project-2) 一致。
// 前 4 个 slot 按顺序放真实素材（浅灰底、object-contain 不裁切），其余留浅灰空占位待填。
const heartieMedia = [
  { type: 'img', src: cover, alt: 'Cover', fit: 'cover' },
  { type: 'video', src: vid1 },
  { type: 'img', src: watch, alt: 'Watch', fit: 'fill' },
  { type: 'video', src: avatars, fit: 'fill' },
  { type: 'video', src: enter, fit: 'cover' },
  { type: 'group', videos: [chef1, chef2, chef3] },
  { type: 'solo', src: xuefeigame1, bg: '#F2D5F4', width: '66%', justify: 'justify-start' },
  { type: 'video', src: onboarding, fit: 'fill' },
  { type: 'pair', items: [{ src: merch1, ratio: 1350 / 897 }, { src: merch2, ratio: 1112 / 901 }] },
  { type: 'img', src: ad1, alt: 'Ad' },
  { type: 'pair', items: [{ src: merch5 }, { src: merch4 }] },
  { type: 'img', src: merch3, alt: 'Merch 3' },
]
// 等高双列里的单张：读图片真实宽高比设 flex-grow，保证同排各图精确等高、原比例填满列宽
function PairImg({ src }) {
  const ref = useRef(null)
  const [grow, setGrow] = useState(null)
  useEffect(() => {
    const im = ref.current
    if (im && im.complete && im.naturalWidth) setGrow(im.naturalWidth / im.naturalHeight)
  }, [src])
  return (
    <div style={{ flexGrow: grow ?? 1, flexBasis: 0 }} className="overflow-hidden rounded-md bg-[#f1f1f0]">
      <img
        ref={ref}
        src={src}
        alt=""
        className="block w-full"
        onLoad={(e) => setGrow(e.currentTarget.naturalWidth / e.currentTarget.naturalHeight)}
      />
    </div>
  )
}

function NewProject4() {
  return (
    <div className="new-project-page min-h-screen bg-white">
      <NavBar />

      {/* 左侧固定文字 */}
      <aside className="fixed left-6 top-1/2 z-40 hidden w-[clamp(200px,25vw,430px)] -translate-y-1/2 text-left text-[15px] leading-[1.55] text-neutral-600 md:block">
        <p>
          Heartie is a child-centered hybrid health solution designed for children ages 8&ndash;14 with
          heart conditions. It integrates a wearable ECG patch with a multi-platform app ecosystem across
          tablet, smartwatch, and mobile, combining real-time cardiac monitoring, emergency support,
          personalized health insights, and emotional well-being tools for both children and caregivers.
          Through a child-friendly AI companion and an interstellar gamified experience, Heartie helps
          children better understand their conditions, learn how to care for themselves, and build healthy
          habits&mdash;reducing fear for both children and caregivers while empowering every child to
          become the superhero of their own health journey.
        </p>

        {/* 空一行后：小窗自动静音播放（宽度=文字宽度）；点击在新标签打开该视频 */}
        <a
          href="https://www.youtube.com/watch?v=DUM7uEkWqeE"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 block"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-md">
            <iframe
              src="https://www.youtube.com/embed/DUM7uEkWqeE?autoplay=1&mute=1&loop=1&playlist=DUM7uEkWqeE&controls=0&modestbranding=1&playsinline=1&rel=0"
              title="Heartie video"
              allow="autoplay; encrypted-media; picture-in-picture"
              className="pointer-events-none absolute inset-0 h-full w-full"
            />
          </div>
          <p className="mt-2 text-[13px] text-neutral-400">Click to watch full demo video</p>
        </a>

        {/* 左栏最下方：获奖信息 */}
        <div className="mt-6 space-y-1 text-[13px] leading-[1.45] text-neutral-500">
          <p>2025 Red Dot Design Awards Brands and Communication Winner</p>
          <p>2025 IF Design Awards Winner</p>
        </div>
      </aside>

      {/* Intro：标题 + 正文 */}
      <div className="container-fluid mt-16 text-left">
        <h2 className="text-[32px] font-semibold text-black">Intro to Heartie</h2>
        <p className="mt-6 text-neutral-700">
          I owned the product-level visual and motion direction, character and game design, and product
          rendering for Heartie, focusing on how interaction design could support emotional understanding
          and communication.
        </p>
        <p className="mt-4 text-neutral-700">
          Visual design was treated as a core part of the UX, reinforcing meaning and interaction rather
          than serving as decoration. Working closely with the broader product strategy, I developed a
          cohesive visual language that balanced clarity, empathy, and usability, contributing to an
          award-recognized product experience.
        </p>
      </div>

      {/* 图片区：每个 slot 都是整宽、等宽的盒子；默认浅灰底(#f1f1f0)、素材 object-contain 完整不裁切。
          单个 slot 可通过 bg / scale / radius 自定义底色、缩放、圆角，间距 mt-3 */}
      <div className="container-fluid mt-16">
        {heartieMedia.map((m, i) => {
          if (m?.type === 'group') {
            return (
              <div key={i} className={i > 0 ? 'mt-3' : ''}>
                <ChefGroup videos={m.videos} />
              </div>
            )
          }
          if (m?.type === 'row2') {
            // 双列：各自 w-full 填满列宽、原比例（高度随图自适应），顶部对齐
            return (
              <div key={i} className={`grid grid-cols-2 items-start gap-3 ${i > 0 ? 'mt-3' : ''}`}>
                {m.srcs.map((s, j) => (
                  <div key={j} className="overflow-hidden rounded-md bg-[#f1f1f0]">
                    <img src={s} alt="" className="block w-full" />
                  </div>
                ))}
              </div>
            )
          }
          if (m?.type === 'pair') {
            // flexbox 等高：每列 flex-grow=图片真实宽高比 → 同排各图精确等高、原比例填满列宽、不裁切
            return (
              <div key={i} className={`flex gap-3 ${i > 0 ? 'mt-3' : ''}`}>
                {m.items.map((it, j) => (
                  <PairImg key={j} src={it.src} />
                ))}
              </div>
            )
          }
          if (m?.type === 'solo') {
            return (
              <div key={i} className={i > 0 ? 'mt-3' : ''}>
                <div className="w-full rounded-md px-[5%] py-[7%]" style={{ backgroundColor: m.bg }}>
                  <div className={`flex ${m.justify ?? 'justify-start'}`}>
                    <video
                      src={m.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      style={{ width: m.width ?? '66%' }}
                      className="rounded-[20px]"
                    />
                  </div>
                </div>
              </div>
            )
          }
          // fit: 'fill' → 盒子高度=媒体实际高度（w-full 原比例，不裁不留白）
          if (m?.fit === 'fill') {
            return (
              <div key={i} className={`overflow-hidden rounded-md bg-[#f1f1f0] ${i > 0 ? 'mt-3' : ''}`}>
                {m.type === 'img' ? (
                  <img src={m.src} alt={m.alt} className="block w-full" />
                ) : (
                  <video src={m.src} autoPlay loop muted playsInline className="block w-full" />
                )}
              </div>
            )
          }
          const framed = m && (m.scale || m.radius) // 缩放/圆角的定制样式
          // fit: 'cover' → 填满 aspect-[3/2] slot（object-cover，必要时裁切）
          const mediaCls =
            m?.fit === 'cover' ? 'h-full w-full object-cover' : framed ? 'block' : 'h-full w-full object-contain'
          const mediaStyle = framed
            ? {
                maxWidth: `${(m.scale ?? 1) * 100}%`,
                maxHeight: `${(m.scale ?? 1) * 100}%`,
                borderRadius: m.radius ? `${m.radius}px` : undefined,
              }
            : undefined
          return (
            <div
              key={i}
              style={{ backgroundColor: m?.bg ?? '#f1f1f0' }}
              className={`flex aspect-[3/2] w-full items-center justify-center overflow-hidden rounded-md ${
                i > 0 ? 'mt-3' : ''
              }`}
            >
              {m?.type === 'img' && (
                <img src={m.src} alt={m.alt} className={mediaCls} style={mediaStyle} />
              )}
              {m?.type === 'video' && (
                <video
                  src={m.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className={mediaCls}
                  style={mediaStyle}
                />
              )}
            </div>
          )
        })}
      </div>

      <Footer light />
    </div>
  )
}

export default NewProject4
