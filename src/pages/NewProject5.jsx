import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'

// 占位项目页 1 —— 结构参考 Nexus：置顶整宽 hero + 下方 Intro 文字。
// 之后往里填真实内容即可。
function NewProject5() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      {/* Hero —— YouTube 视频：16:9 不拉伸、黑底、自动播放（带声音）、从 27s 开始 */}
      <Reveal className="mt-6 w-full bg-black">
        <div className="mx-auto aspect-video w-[85%]">
          <iframe
            className="h-full w-full"
            src="https://www.youtube.com/embed/scIux3S2DJs?autoplay=1&start=27&rel=0&playsinline=1"
            title="Hero video"
            frameBorder="0"
            allow="autoplay; encrypted-media; picture-in-picture; web-share; fullscreen"
            allowFullScreen
          />
        </div>
      </Reveal>

      {/* Intro —— 标题 + 正文（字体/字号同 Nexus Intro：32px 粗标题 + text-neutral-700 正文） */}
      <div className="container-fluid mt-16 text-left">
        <h2 className="text-[32px] font-semibold text-black">Intro to Heykura.ai</h2>
        <p className="mt-4 text-neutral-700">
          Heykura.ai is an AI driven visual search, ideation, and prototyping platform that bridges the
          communication gap between non designers and designers. It streamlines the repetitive and
          often unproductive 0→0.5 stage, when non designers struggle to translate vague ideas into
          effective creative prompts. KURA helps users explore and clarify their vision, then
          transforms it into design ready visuals that designers can immediately execute, making early
          stage collaboration more effective for everyone involved.{' '}
          <span className="font-bold">
            Heykura.ai launched in December 2025 and reached 10,000 weekly users within its first week.
            Today, it helps tech startups curate marketing assets while cutting production time in half.
          </span>
        </p>
        <a
          href="https://www.heykura.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
        >
          Try Heykura Now
        </a>
        <p className="mt-6 font-bold text-neutral-700">
          I primarily worked on three MVP features: the AI toolbar, prompt iteration, and
          conversational AI panel. I also contributed to the product&rsquo;s visual identity and motion
          graphics in collaboration with a graphic artist, UX designer, and product designer.
        </p>
        <p className="mt-4 text-neutral-700">
          Please note that this was a client project, so only a limited portion of the design process
          can be shared publicly. Contact me for additional details about the design process.
        </p>
      </div>

      <Footer light />
    </div>
  )
}

export default NewProject5
