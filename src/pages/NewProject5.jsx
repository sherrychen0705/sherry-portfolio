import { useEffect, useRef, useState } from 'react'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'
import PageEditor from '../components/PageEditor'
// 占位图素材（命名与 src/assets/heykura/ 文件夹一致，数字=对应占位编号，方便替换）
import vid1 from '../assets/heykura/1.mp4'
import vid2 from '../assets/heykura/2.mp4'
import vid3 from '../assets/heykura/3.mp4'
import vid4 from '../assets/heykura/4.mp4'
import img5 from '../assets/heykura/5.png'
import img6 from '../assets/heykura/6.png'
import img7 from '../assets/heykura/7.png'
import vid8 from '../assets/heykura/8.mp4'
import img9 from '../assets/heykura/9.png'
import img10 from '../assets/heykura/10.png'
import img11 from '../assets/heykura/11.png'
import img12 from '../assets/heykura/12.png'
import vid16 from '../assets/heykura/16.mp4'
import vid19 from '../assets/heykura/19.mp4'
import vid23 from '../assets/heykura/23.mp4'
import img13 from '../assets/heykura/13.png'
import img14 from '../assets/heykura/14.png'
import img15 from '../assets/heykura/15.png'
import img17 from '../assets/heykura/17.png'
import img18 from '../assets/heykura/18.png'
import img21 from '../assets/heykura/21.png'
import img22 from '../assets/heykura/22.png'

// Heykura.ai 案例页 —— 布局参考 Nexus（左侧滚动菜单 + container-fluid 内距）。
// 内容/结构按 PDF；图片全部灰色占位并标注 PDF 里的编号；字体 Figtree（全站默认）。
// hero 用原 Heykura YouTube 视频；intro 内容下方保留「Try Heykura Now」按钮。
const GREEN = '#5b9c3f'

// 大标题（35px；本页试用 Pathway Extreme，见 index.css 的 .font-display）
function H2({ children, className = '' }) {
  return <h2 className={`font-display text-[35px] font-medium leading-[50px] text-black ${className}`}>{children}</h2>
}
// 绿色大标题（大标题同字号，绿色）
function GreenH2({ children, className = '' }) {
  return (
    <h2 className={`font-display text-[35px] font-medium leading-[50px] ${className}`} style={{ color: GREEN }}>
      {children}
    </h2>
  )
}
// 绿色小标题（同 Nexus body copy 大小 = 17.5px，绿色大写）
function Label({ children, className = '' }) {
  return (
    <p className={`font-semibold uppercase tracking-[0.1em] ${className}`} style={{ color: GREEN }}>
      {children}
    </p>
  )
}
// 正文（同 Nexus body copy）
function Body({ children, className = '' }) {
  return <p className={`text-neutral-700 ${className}`}>{children}</p>
}
// 占位框：底色统一 #F3F3F3。
// 默认：object-contain 居中、四周留边；fill=true：object-cover 顶满整个占位（无边）。
// 无 img 时显示编号。imgClass 可额外调整（如 #5 限大小、#21/22 放大 1.1×）。
function Ph({ n, ratio = '4 / 3', img, video, imgClass = '', fill = false, className = '', bg = '#F3F3F3' }) {
  const media = img || video
  const mediaClass = `${fill ? 'h-full w-full object-cover' : 'max-h-full max-w-full object-contain'} ${imgClass}`
  const isDark = bg === '#000' || bg === '#000000' || bg === 'black'
  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${media && !fill ? 'p-4' : ''} ${className}`}
      style={{ aspectRatio: ratio, background: bg }}
    >
      {video ? (
        <video
          src={video}
          autoPlay
          loop
          muted
          playsInline
          className={mediaClass}
          style={{ borderRadius: '7px', boxShadow: '0 3px 12px rgba(0, 0, 0, 0.12)' }}
        />
      ) : img ? (
        <img src={img} alt="" className={mediaClass} />
      ) : (
        n != null && (
          <span className={`text-[22px] font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>{n}</span>
        )
      )}
    </div>
  )
}

const NAV_SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'solutions', label: 'Solutions' },
  { id: 'outcomes', label: 'Outcomes' },
  { id: 'observations', label: 'Observations' },
  { id: 'users', label: 'Users' },
  { id: 'research', label: 'Research' },
  { id: 'competitors', label: 'Competitors' },
  { id: 'process', label: 'Design Process' },
  { id: 'reflection', label: 'Now and Future' },
]

function SectionNav() {
  const [active, setActive] = useState('overview')
  useEffect(() => {
    const onScroll = () => {
      const offset = 160
      let current = NAV_SECTIONS[0].id
      for (const s of NAV_SECTIONS) {
        const el = document.getElementById(s.id)
        if (el && el.getBoundingClientRect().top <= offset) current = s.id
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const go = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' })
  }
  return (
    <nav
      className="fixed left-6 top-1/2 z-40 hidden w-[156px] -translate-y-1/2 flex-col items-end gap-2.5 text-right lg:flex"
      style={{ fontSize: '13px' }}
    >
      {NAV_SECTIONS.map((s) => {
        const isActive = active === s.id
        return (
          <button key={s.id} type="button" onClick={() => go(s.id)} className="group flex items-center gap-2 leading-none">
            <span
              className={`inline-block shrink-0 rounded-full transition-opacity duration-200 ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ width: '4.5px', height: '4.5px', background: '#5db83c', boxShadow: '0 0 6px 1.5px rgba(93, 184, 60, 0.75)' }}
            />
            <span
              className={`transition-colors group-hover:font-bold group-hover:text-black ${
                isActive ? 'font-bold text-black' : 'font-medium text-[#555f66]'
              }`}
            >
              {s.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

// 右侧箭头分隔（HMW 两栏之间）
function Arrow() {
  return (
    <svg viewBox="0 0 80 24" className="my-4 h-5 w-16 shrink-0 md:my-0" fill="none">
      <path d="M2 12h72M62 4l12 8-12 8" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function NewProject5() {
  const contentRef = useRef(null)
  return (
    <div className="nexus-page min-h-screen bg-white">
      <NavBar />
      <SectionNav />

      {/* 本地编辑器：改字 + 拖拽调间距。
          import.meta.env.DEV 只有 `npm run dev` 时为 true，
          正式构建会把整段连同组件一起摇掉，线上访客看不到也加载不到。 */}
      {import.meta.env.DEV && <PageEditor rootRef={contentRef} />}

      <div ref={contentRef}>
      {/* Hero —— 原 Heykura YouTube 视频（16:9、黑底、85% 宽、从 27s 自动播放） */}
      <Reveal className="mt-6 w-full bg-black">
        <div className="mx-auto aspect-video w-[85%]">
          <iframe
            className="h-full w-full"
            src="https://www.youtube.com/embed/scIux3S2DJs?autoplay=1&mute=1&start=27&rel=0&playsinline=1"
            title="Hero video"
            frameBorder="0"
            allow="autoplay; encrypted-media; picture-in-picture; web-share; fullscreen"
            allowFullScreen
          />
        </div>
      </Reveal>

      {/* 标题 + 简介 + 元信息 + 按钮 */}
      <Reveal id="overview" className="container-fluid mt-16 text-left">
        <H2>Heykura.ai</H2>
        <Body className="mt-4">
          Heykura.ai is an AI driven visual search, ideation, and prototyping platform that bridges the
          communication gap between non designers and designers. It streamlines the repetitive and often
          unproductive 0→0.5 stage, when non designers struggle to translate vague ideas into effective
          creative prompts. KURA helps users explore and clarify their vision, then transforms it into
          design ready visuals that designers can immediately execute, making early stage collaboration
          more effective for everyone involved. Heykura.ai launched in December 2025 and reached 10,000
          weekly users within its first week. Today, it helps tech startups curate marketing assets while
          cutting production time in half.
        </Body>
        <Body className="mt-3">
          Please note that this was a client project, so only a limited portion of the design process can
          be shared publicly. Contact me for additional details about the design process.
        </Body>

        <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
          {[
            { k: 'ROLE', v: ['Design Lead'] },
            { k: 'TIMELINE', v: ['Aug 2025 - Jan 2026'] },
            { k: 'TEAM', v: ['1 PM', '1 Designer (me!)', '1 UX Architect', '2 Engineers'] },
            { k: 'SKILLS', v: ['Product Design', 'User Research'] },
          ].map((c) => (
            <div key={c.k}>
              <p className="font-semibold text-black">{c.k}</p>
              {c.v.map((line, i) => (
                <p key={line} className={`${i === 0 ? 'mt-3' : ''} text-neutral-500`}>
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* 按钮：放在新 intro 内容的下方 */}
        <a
          href="https://www.heykura.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-block rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
        >
          Try Heykura Now
        </a>
      </Reveal>

      {/* OVERVIEW */}
      <Reveal className="container-fluid mt-24 text-left">
        <Label>OVERVIEW</Label>
        <H2 className="mt-4">
          What if non-designers could describe what they want, without knowing how to describe it?
        </H2>
        <Body className="mt-5">
          Anyone can tell a good design from a bad one. Almost no one can say why. That gap—between
          recognizing and articulating—is where creative work breaks down: between clients and designers,
          and between people and the AI tools built to serve them.
        </Body>
      </Reveal>

      {/* SOLUTIONS —— 4 行 图+右侧说明。每行各自一个 Reveal：
          滚到谁谁才从下往上淡入，而不是整块一起出现。 */}
      <div id="solutions" className="container-fluid mt-24 text-left">
        <Reveal>
          <Label>TAKE A PEAK INTO SOLUTIONS</Label>
          <H2 className="mt-4">KURA turns vague taste into structured visual direction.</H2>
        </Reveal>
        <div className="mt-10 flex flex-col gap-12">
          {[
            { n: 1, t: 'Fill in a brief, not a blank prompt box', video: vid1 },
            { n: 2, t: 'Adjust one parameter without losing the rest', video: vid2 },
            { n: 3, t: "Search by how it feels, not what it's called", video: vid3 },
            { n: 4, t: 'Share the prompt history, not just the result', video: vid4 },
          ].map((r) => (
            <Reveal key={r.n} strong className="grid grid-cols-1 items-center gap-6 md:grid-cols-12">
              <Ph
                n={r.n}
                video={r.video}
                imgClass="scale-[0.968]"
                ratio="16 / 10"
                bg="#000"
                className="md:col-span-7"
              />
              {/* 说明文字：30px 深灰。颜色写成内联样式，避免和 Body 自带的
                  text-neutral-700 撞车（同权重时谁生效取决于 CSS 顺序，不可靠）。 */}
              <p
                className="md:col-span-4 md:col-start-9 font-display text-[30px] font-medium leading-[1.3]"
                style={{ color: '#525252' }}
              >
                {r.t}
              </p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* OUTCOMES */}
      <Reveal id="outcomes" className="container-fluid mt-24 text-left">
        <Label>OUTCOMES</Label>
        <H2 className="mt-4">We launched in Dec 2025 and have reached 3000 users within the first week!</H2>
        <Ph n={5} img={img5} imgClass="max-w-[48%]" ratio="16 / 6" className="mt-8 w-full" />
      </Reveal>

      {/* 绿色金句 */}
      <Reveal className="container-fluid mt-24 text-left">
        <GreenH2 className="max-w-4xl">
          Non-designers have high visual judgment and near-zero visual vocabulary. Every existing tool
          assumes the opposite.
        </GreenH2>
      </Reveal>

      {/* INITIAL OBSERVATIONS */}
      <Reveal id="observations" className="container-fluid mt-24 text-left">
        <Label>INITIAL OBSERVATIONS</Label>
        <H2 className="mt-4">As designers, we were the wrong people to design this.</H2>
        <Body className="mt-5">
          We ran a test on ourselves: describe a website you want, without using a single design term. No
          "minimal," no "editorial," no "grid." It was almost impossible—and it made obvious how much of
          our workflow runs on vocabulary our clients don't have. We also sat with non-designers as they
          used AI tools cold. The most common thing they typed first was nothing at all.
        </Body>
        <Ph n={6} img={img6} ratio="16 / 7" className="mt-8 w-full" />
      </Reveal>

      {/* UNDERSTANDING USERS —— 3 列（移到 RESEARCH 之前、INITIAL OBSERVATIONS 之后） */}
      <Reveal id="users" className="container-fluid mt-24 text-left">
        <Label>UNDERSTANDING USERS</Label>
        <H2 className="mt-4">People know what they like. They just can't say it.</H2>
        <Body className="mt-5">
          We watched people use the tools they already had—Pinterest, AI image generators, and design
          studios like ours. And these happened:
        </Body>
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              n: 8,
              video: vid8,
              imgClass: 'scale-[0.85]', // 8 号视频缩到 85%，不顶满、四周留边
              t: '1. Scrolling is not searching',
              d: 'On Pinterest, users scroll until something feels right. They can judge an image in a second—but they have no vocabulary to search for the next one. Discovery is passive by default.',
            },
            {
              n: 9,
              img: img9,
              t: '2. "Upload anything" is confusing',
              d: "AI tools promise total freedom. For non-designers, an empty prompt box is not freedom—it's a blank exam paper. They don't know what \"anything\" is supposed to be.",
            },
            {
              n: 10,
              img: img10,
              t: '3. Briefs get lost in translation',
              d: 'As a design studio, we watched it happen every project: "elegant but playful," "minimal but colorful." Designers guess, clients react, and the loop costs days.',
            },
          ].map((c) => (
            <div key={c.n}>
              <Ph n={c.n} img={c.img} video={c.video} imgClass={c.imgClass} ratio="1 / 1" fill />
              <p className="mt-5 font-display font-bold text-black">{c.t}</p>
              <Body className="mt-3">{c.d}</Body>
            </div>
          ))}
        </div>
      </Reveal>

      {/* RESEARCH */}
      <Reveal id="research" className="container-fluid mt-24 text-left">
        <Label>RESEARCH</Label>
        <Body className="mt-3">Kura’s position</Body>
        <Ph n={7} img={img7} ratio="16 / 8" className="mt-6 w-full" />
      </Reveal>

      {/* CURRENT PRODUCTS —— 2 列 */}
      <Reveal id="competitors" className="container-fluid mt-24 text-left">
        <Label>CURRENT PRODUCTS</Label>
        <H2 className="mt-4">Competitor interfaces are not beginner-friendly</H2>
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <Ph n={11} img={img11} ratio="3 / 2" />
            <Body className="mt-5">
              Inspiration platforms（Pinterest, Savee）— 海量素材，但检索依赖关键词，而关键词正是用户缺的。收藏夹越大，方向越模糊。
            </Body>
          </div>
          <div>
            <Ph n={12} img={img12} ratio="3 / 2" />
            <Body className="mt-5">
              Generative AI tools（c）— 能力极强，门槛全压在 prompt 上。风格词汇是隐性知识，非设计师无从习得。
            </Body>
          </div>
        </div>
      </Reveal>

      {/* HMW 两栏 —— 整宽浅绿背景带（参考 Challenge 的浅蓝背景处理） */}
      <Reveal className="mt-24">
        <div className="py-14" style={{ background: '#ecf6e5' }}>
          <div className="container-fluid text-left">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
              <H2 className="md:flex-1">
                How might we help people articulate visual intent without teaching them design language?
              </H2>
              <Arrow />
              <div className="md:flex-1">
                <GreenH2>How might we do better than a prompt box—when the model is the same?</GreenH2>
                <p className="mt-4" style={{ color: GREEN }}>
                  The bottleneck was never the model. It was the input. So instead of making a better
                  generator, we made a better way to arrive at the prompt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* DESIGN PROCESS —— 三个 section 各自「从下往上 fade in」 */}
      <div id="process" className="container-fluid mt-24 text-left">
        {/* 01 Guided prompt */}
        <Reveal strong>
          <Label>DESIGN PROCESS</Label>
          <p className="mt-8 font-semibold" style={{ color: GREEN }}>01</p>
          <H2 className="mt-2">Guided prompt</H2>
          <Body className="mt-4">
            At the start of each project, there will be initial prompt guidance to set the overall
            direction. This process should be concise and quickly capture the key design elements.
          </Body>
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                n: 13,
                img: img13,
                t: 'Idea 1',
                d: 'It’s closer to a traditional AI initial dialogue box, with prompt-based guidance. However, there is only one place to attach files, so it may be inconvenient if users need to modify the attachment.',
              },
              {
                n: 14,
                img: img14,
                t: 'Idea 2',
                d: 'Each page will be a prompt that requires users to provide additional information, completed through selection and file uploads. However, it is still difficult to modify the information afterward, and it is hard to see the full picture of all the information at once.',
              },
              {
                n: 15,
                img: img15,
                t: 'Idea 3',
                d: 'It is easy to edit and offers flexible interface options, but it does not feel lively enough. The UI needs to capture Kura’s playful and energetic feel.',
              },
            ].map((c) => (
              <div key={c.n}>
                <Ph n={c.n} img={c.img} ratio="4 / 3" />
                <p className="mt-5 text-black">{c.t}</p>
                <Body className="mt-3">{c.d}</Body>
              </div>
            ))}
          </div>
          <Ph n={16} video={vid16} imgClass="scale-[0.85]" ratio="16 / 8.1" className="mt-8 w-full" />
          <p className="mt-8 text-black">Selected Idea</p>
          <Body className="mt-2">
            The final interaction format makes it easier to edit and add information. Turning the prompts
            into first-person statements like “I have…” creates a more immersive and relatable experience,
            while aligning with Kura’s light, playful, and simple personality.
          </Body>
        </Reveal>

        {/* 02 Tool Bar */}
        <Reveal strong className="mt-16">
          <p className="font-semibold" style={{ color: GREEN }}>02</p>
          <H2 className="mt-2">Tool Bar for Continuous Prompt Editing</H2>
          <Body className="mt-4">
            After the project starts, there should be a prompt toolbar at the bottom of the page, allowing
            users to quickly edit or add information while also reinforcing the connection between the
            existing information and the generated images.
          </Body>
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <Ph n={17} img={img17} ratio="4 / 3" />
              <p className="mt-5 text-black">Idea 1</p>
              <Body className="mt-2">
                Although this prompt bar design is clear and easy to read, it takes up too much space,
                especially since screen space is limited.
              </Body>
            </div>
            <div>
              <Ph n={18} img={img18} ratio="4 / 3" />
              <p className="mt-5 text-black">Idea 2</p>
              <Body className="mt-2">
                The trade-off is that the bar is simple and space-efficient, but users need to click more
                to view the prompt’s supporting materials. Also, some icons are a bit ambiguous, so users
                may not immediately understand what they represent.
              </Body>
            </div>
          </div>
          {/* 19：宽度和其它一样（全宽），只减高度（16/9 → 16/7.65，约 -15%），视频 scale 0.85 */}
          <Ph n={19} video={vid19} imgClass="scale-[0.85]" ratio="16 / 7.65" className="mt-8 w-full" />
        </Reveal>

        {/* 03 Search Tags */}
        <Reveal strong className="mt-16">
          <p className="font-semibold" style={{ color: GREEN }}>03</p>
          <H2 className="mt-2">Search Tags</H2>
          <Body className="mt-4">
            "Style is a hierarchy, not a keyword." After users select an aesthetic in the prompt, the top
            bar will display different sub-style elements within that aesthetic for them to choose from.
            This guides users toward more precise decisions. This thinking model of gradually narrowing
            down choices also mirrors the way creative professionals think.
          </Body>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <Ph n={21} img={img21} imgClass="scale-110" ratio="3 / 2" />
              <p className="mt-5 text-black">Idea 1</p>
              <Body className="mt-2">
                Fastest to scan and lightest on space, but the hierarchy is stated in a single line rather
                than visually shown, making the parent–child relationship easy to miss.
              </Body>
            </div>
            <div>
              <Ph n={22} img={img22} imgClass="scale-110" ratio="3 / 2" />
              <p className="mt-5 text-black">Idea 2</p>
              <Body className="mt-2">
                The distance between the circles represents the degree of aesthetic trending, making the
                visual more interesting and immersive. However, not all users may quickly understand what
                the circles mean, and this layout cannot accommodate much information.
              </Body>
            </div>
          </div>
          {/* 23 占位高度减少 40%（比例 16/8.1 → 16/4.86） */}
          <Ph n={23} video={vid23} imgClass="scale-[0.85]" ratio="16 / 4.86" className="mt-8 w-full" />
          <p className="mt-8 text-black">Selected Idea</p>
          <Body className="mt-2">
            The relationship between parent styles and sub-styles is clear at a glance. An intensity slider
            has been added to help users better customize the strength of a style and visualize it
            directly. The panel can hold as much information as possible without taking up too much space.
          </Body>
        </Reveal>
      </div>

      {/* REFLECTION */}
      <Reveal id="reflection" className="container-fluid mt-24 text-left">
        <Label>REFLECTION</Label>
        <H2 className="mt-4">What I learned</H2>
        <Body className="mt-5">Taste doesn't need to be taught. Vocabulary does.</Body>
        <Body className="mt-2">
          We started out thinking non-designers needed help developing taste. They don't have a taste
          problem—they have a retrieval problem. Every consumer tool we studied conflated the two, and
          ended up either patronizing users or overwhelming them.
        </Body>
      </Reveal>

      <div className="mt-24" />
      </div>
      <Footer light />
    </div>
  )
}

export default NewProject5
