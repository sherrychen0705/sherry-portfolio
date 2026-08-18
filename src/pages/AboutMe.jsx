import { useEffect, useState } from 'react'
import fan5 from '../assets/about/fan5.jpg'
import awardsGrid from '../assets/about/awards-grid.png'
import internHero from '../assets/about/intern-hero.jpg'
import laptopGroup from '../assets/about/laptop-group.jpg'
import mailIcon from '../assets/about/mail-icon.png'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'
import Carousel from '../components/Carousel'

// 5 张灰色带编号占位卡簇拥成一团：1、2 横向在上，3、4、5 在下。
// 入场时依次从中心（背后）冒出、放大到各自位置，最后聚成一团。
const clusterCards = [
  { n: 1, size: 'h-40 w-56', x: 0, y: 0, r: -8 },
  { n: 2, size: 'h-40 w-56', x: 214, y: 22, r: 7 },
  { n: 3, size: 'h-52 w-40', x: 22, y: 176, r: -7 },
  { n: 4, size: 'h-52 w-40', x: 166, y: 208, r: 4 },
  { n: 5, size: 'h-52 w-40', x: 300, y: 182, r: -3 },
]

function PhotoCluster({ animate = true }) {
  const [shown, setShown] = useState(!animate)
  useEffect(() => {
    if (!animate) return
    const t = setTimeout(() => setShown(true), 120)
    return () => clearTimeout(t)
  }, [animate])
  return (
    <div className="relative h-[430px] w-[476px] flex-none">
      {clusterCards.map((c, i) => (
        <div
          key={c.n}
          className={`absolute left-0 top-0 flex items-center justify-center rounded-[15px] bg-neutral-200 shadow-xl ${c.size}`}
          style={{
            transform: shown
              ? `translate(${c.x}px, ${c.y}px) rotate(${c.r}deg) scale(1)`
              : 'translate(180px, 130px) rotate(0deg) scale(0.35)',
            opacity: shown ? 1 : 0,
            transition: 'transform 750ms cubic-bezier(0.34, 1.35, 0.5, 1), opacity 450ms ease',
            transitionDelay: `${i * 150}ms`,
            zIndex: i,
          }}
        >
          <span className="text-2xl font-semibold text-neutral-400">{c.n}</span>
        </div>
      ))}
    </div>
  )
}

// 深色统计卡（照参考图）
function StatCard({ num, label, dot }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#141414] px-6 py-8 text-center">
      <div className="flex items-center justify-center gap-3">
        <span className="text-5xl font-light text-white">{num}</span>
        {dot && <span className="h-2.5 w-2.5 rounded-full bg-neutral-500" />}
      </div>
      <p className="mt-2 text-sm text-neutral-400">{label}</p>
    </div>
  )
}

function AboutMe() {
  // ⚠️ 临时「施工中」占位。恢复真实 About 页：删掉下面这个 return（到 “施工中占位结束” 注释为止）即可。
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <div className="container-fluid flex min-h-[calc(100vh-72px)] flex-col items-center justify-center text-center">
        <p className="text-6xl">🚧</p>
        <h1 className="mt-6 text-[28px] font-semibold text-black">This page is under construction</h1>
        <p className="mt-3 text-neutral-500">
          The About page is being redesigned — check back soon.
        </p>
      </div>
      <Footer light />
    </div>
  )
  // —— 施工中占位结束；以下为原始 About 页内容，恢复时删掉上面的 return —— // eslint-disable-line no-unreachable

  // eslint-disable-next-line no-unreachable
  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      <header className="container-fluid flex min-h-[calc(100vh-72px)] items-center">
        <div className="flex w-full flex-col items-center justify-center gap-y-24 md:flex-row md:items-center md:gap-x-[100px]">
          <PhotoCluster />
          <div className="max-w-xl text-center md:text-left">
            <h1 className="text-[22px] font-normal text-neutral-700">Hey again 😎</h1>
            <p className="mt-6 text-[18px] text-neutral-600">
              I'm no stranger to design. I've worked at enterprise-level corporations, mid-sized design
              agencies, and fast-growing unicorn startups, tackling projects across UX, visual art,
              video editing, 3D prototyping, and marketing. While I'm now pursuing a career in UX/UI, my
              past experiences have equipped me with a range of transferable skills that shape the
              designer I am today.
            </p>
            <p className="mt-12 text-[18px] text-neutral-600">Outside of work, I'm a fine artist.</p>
          </div>
        </div>
      </header>

      {/* Experience Snapshot —— 左侧同样 5 张占位卡，右侧内容与 Hey again 文字左对齐 */}
      <section className="container-fluid mt-6">
        <div className="flex flex-col gap-y-12 md:flex-row md:items-start md:gap-x-[100px]">
          <PhotoCluster animate={false} />
          <div className="min-w-0 flex-1 text-left">
            <h2 className="text-[22px] font-normal text-neutral-700">Experience Snapshot</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard num="5" label="Years designing" dot />
              <StatCard num="6" label="Case studies" />
              <StatCard num="10" label="Platform design system" />
            </div>
            <p className="mt-6 text-[15px] leading-relaxed text-neutral-600">
              I started as a computer science graduate in India, but I cared more about why the code
              existed than the code itself, and that pulled me into design. Four years later I design the
              front end, direct AI agents to build it, and write the checks that catch them when they
              fake done. I have worked across video, 3D, and product interfaces, and the part I will not
              hand off is the judgment about what good looks like.
            </p>
          </div>
        </div>
      </section>

      {/* Awards —— 占位 */}
      <section className="container-fluid mt-16 text-left">
        <h2 className="text-[22px] font-normal text-neutral-700">Awards</h2>
        <div className="mt-6 max-w-3xl space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-3.5 rounded bg-neutral-200"
              style={{ width: i === 3 ? '55%' : '100%' }}
            />
          ))}
        </div>
      </section>

      <h2 className="container-fluid mt-16 text-3xl font-bold text-black text-center">
        On my creative desk …
      </h2>

      <section className="container-fluid mt-12 grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <Reveal>
          <img
            src={awardsGrid}
            alt="International awards"
            className="w-full rounded-2xl object-cover aspect-[4/3]"
          />
        </Reveal>
        <Reveal className="text-left">
          <h3 className="text-2xl font-bold text-black">International Awards Team Lead</h3>
          <p className="mt-4 text-neutral-600">
            I feel a deep sense of pride and joy knowing that the work I create with my friends resonates
            with audiences around the world. Seeing our collaborative efforts exhibited internationally
            makes all the long hours and creative challenges feel truly worthwhile.
          </p>
        </Reveal>
      </section>

      <section className="container-fluid mt-16 grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <Reveal className="text-left md:order-1">
          <h3 className="text-2xl font-bold text-black">UX Design Intern at IPG Health</h3>
          <p className="mt-4 text-neutral-600">
            This summer, I worked as a UX Design Intern at one of the 50+ agencies within IPG Health, a
            global healthcare network providing full-service design and medical communications solutions
            worldwide. In addition to designing a B2B SaaS web platform and visual assets for pharmaceutical
            companies, I gained valuable experience navigating regulatory constraints while maintaining a
            commitment to pushing creative boundaries.
          </p>
        </Reveal>
        <Reveal className="md:order-2">
          <Carousel
            slides={[
              { src: internHero, alt: 'IPG Health project' },
              { src: fan5, alt: 'Team collaboration' },
            ]}
          />
        </Reveal>
      </section>

      <section className="container-fluid mt-16 grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <Reveal>
          <img
            src={laptopGroup}
            alt="Team working together"
            className="w-full rounded-2xl object-cover aspect-[4/3]"
          />
        </Reveal>
        <Reveal className="text-left">
          <h3 className="text-2xl font-bold text-black">What kind of designer am I?</h3>
          <p className="mt-4 text-neutral-600">
            One thing I might be prouder of than my actual designs is this little nugget of feedback I've
            gotten from teammates:{' '}
            <span className="italic text-neutral-700">
              "You're easy to work with, and we'd totally work with you again."
            </span>{' '}
            I've been lucky to team up with some amazing design pals along the way.
          </p>
        </Reveal>
      </section>

      <Footer light extraIcons={[{ src: mailIcon, alt: 'Email', href: '#' }]} />
    </div>
  )
}

export default AboutMe
