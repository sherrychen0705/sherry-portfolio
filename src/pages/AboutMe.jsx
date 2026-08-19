import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'
import GrassHills from '../components/GrassHills'

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

// 左侧板块标签（20px 白字，不换行）
function Label({ children }) {
  return <h2 className="whitespace-nowrap text-[20px] leading-snug text-white">{children}</h2>
}

// 一行：左标签(可空) + 文字 + 右侧图片簇，底部细线；标签与文字同一行(items-end)，图片在文字上方；
// 随 scroll 从下往上淡入跳入。
function Row({ label, text, children, padTop = 'pt-16', padBottom = 'pb-4' }) {
  return (
    <Reveal strong>
      <div
        className={`grid grid-cols-1 gap-y-3 border-b border-white/40 md:grid-cols-[300px_1fr] md:items-end md:gap-x-14 ${padTop} ${padBottom}`}
      >
        <div>{label ? <Label>{label}</Label> : null}</div>
        <div className="flex items-end justify-between gap-6">
          <p className="text-[17px] text-white">{text}</p>
          <div className="flex items-end">{children}</div>
        </div>
      </div>
    </Reveal>
  )
}

function AboutMe() {
  return (
    <div className="relative min-h-screen text-white" style={{ fontFamily: '"Figtree", sans-serif' }}>
      {/* 整页固定蓝天山丘背景 */}
      <div className="fixed inset-0 -z-10">
        <GrassHills
          className=""
          height="100%"
          skyTop={0x2e2a6e}
          skyBottom={0x6863a6}
          grassLow={0x0f2609}
          grassMid={0x2c5620}
          grassHigh={0x548436}
          particleScale={0.35}
        />
      </div>

      <NavBar />

      <main
        className="container-fluid pt-16 pb-32"
        style={{ textShadow: '0 1px 14px rgba(0,0,0,0.22)' }}
      >
        {/* About Me */}
        <section className="grid grid-cols-1 gap-y-4 md:grid-cols-[300px_1fr] md:gap-x-14">
          <Label>About Me</Label>
          <div className="max-w-2xl space-y-6 text-[17px] leading-relaxed text-white">
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
        <section className="mt-24 grid grid-cols-1 gap-y-4 md:grid-cols-[300px_1fr] md:gap-x-14">
          <Label>Awards</Label>
          <ul className="space-y-5 text-[17px] text-white">
            <li>Red Dot Design Award - Brand and Communication Winner, 2024 &amp; 2025</li>
            <li>IF Design Award - Product Design Winner, 2025</li>
            <li>A&rsquo; Design Award - Silver, 2025</li>
            <li>Indigo Design Award Gold - Shortlisted for Best in Digital Design, 2025</li>
            <li>New York Product Design - Gold, 2024 &amp; 025</li>
          </ul>
        </section>

        {/* People have described me as —— 标签与 “a team cheerleader” 同一行 */}
        <div className="mt-24">
          <Row label="People Have Described Me As" text="a team cheerleader">
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
          <Row
            label="Outside of Work"
            text="I own a growing collection of New York City gelato map"
            padTop="pt-8"
            padBottom="pb-2"
          >
            <Photo src={gelatoMatcha} className="h-32 w-24" rotate={-6} y={-24} />
            <Photo src={gelatoMooHope} className="-ml-4 h-28 w-20" rotate={5} y={-4} />
            <Photo src={gelatoPistachio} className="-ml-4 h-36 w-24" rotate={-4} y={-42} />
          </Row>

          <Row text="I do tattoo designs" padTop="pt-8" padBottom="pb-2">
            <Photo src={tattooWhite} className="h-24 w-32" rotate={-5} y={-6} />
            <Photo src={tattooBlack} className="-ml-3 h-32 w-24" rotate={7} y={-40} />
          </Row>

          <Row text="I&rsquo;m a sourdough girl" padTop="pt-8" padBottom="pb-2">
            <Photo src={sourdough2} className="h-28 w-36" rotate={-5} y={-34} />
            <Photo src={sourdough1} className="-ml-4 h-32 w-28" rotate={6} y={-6} />
          </Row>

          <Row text="I feed little piggies" padTop="pt-8" padBottom="pb-2">
            <Photo src={piggies} className="h-28 w-44" rotate={-3} y={-22} />
          </Row>

          <Row
            text="I use Claude agents and Notion AI to manage my daily life"
            padTop="pt-8"
            padBottom="pb-2"
          >
            <Photo src={pixelPig} className="h-28 w-28" contain plain y={16} />
          </Row>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default AboutMe
