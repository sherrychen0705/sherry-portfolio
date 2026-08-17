import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'

// OHDI 项目页 —— 界面结构与 Heykura 页（NewProject5）一致：置顶 hero + Intro 标题/正文/按钮。
// 区别：hero 换成占位图（尺寸同 Nexus hero：2738×1137 整宽）。文字先占位，之后替换成 OHDI 真实文案。
function NewProject6() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      {/* Hero 占位 —— 整宽灰块，比例同 Nexus hero-banner (2738×1137) */}
      <Reveal className="mt-6 overflow-hidden">
        <div className="w-full bg-neutral-200" style={{ aspectRatio: '2738 / 1137' }} />
      </Reveal>

      {/* Intro —— 结构/粗细同 Heykura 页（32px 粗标题 + text-neutral-700 正文 + 按钮）。 */}
      <div className="container-fluid mt-16 text-left">
        <h2 className="text-[32px] font-semibold text-black">Intro to OHDI.ai</h2>
        <p className="mt-4 text-neutral-700">
          OHDI is an OMNI-powered competitive messaging intelligence platform for pharmaceutical
          brands. It monitors competitor narratives, predicts message resonance across HCP audiences
          and channels, and flags risks or market shifts that may require a response. It also helps
          marketing and medical teams generate and validate evidence-based counter-messaging through
          synthetic audience testing, evidence review, and playbook workflows, enabling faster and
          more confident decision-making.
        </p>
        <a
          href="https://www.omc.com/omni/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
        >
          Go to OMNI
        </a>
        <p className="mt-6 font-bold text-neutral-700">
          I primarily worked on redesigning two user flows: monitoring competitor narratives and
          predicting message resonance across HCP audiences and channels.
        </p>
        <p className="mt-4 text-neutral-700">
          Please note that this project is confidential, so I&rsquo;m unable to publish the full process
          publicly. For more details, please contact{' '}
          <a href="mailto:sherrychen0705@gmail.com" className="underline hover:text-black">
            sherrychen0705@gmail.com
          </a>
          .
        </p>
      </div>

      <Footer light />
    </div>
  )
}

export default NewProject6
