import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'

// 占位项目页 2 —— 结构参考 Nexus：置顶整宽 hero + 下方 Intro 文字。
// 之后往里填真实内容即可。
function NewProject6() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      {/* Hero 占位 —— 同 Nexus hero：整宽、置顶、mt-6，比例同 hero-banner (2738×1137) */}
      <Reveal className="mt-6 overflow-hidden">
        <div className="w-full bg-neutral-200" style={{ aspectRatio: '2738 / 1137' }} />
      </Reveal>

      {/* Intro 占位 —— 一行占位文字，字号同 Nexus Intro 标题（32px） */}
      <div className="container-fluid mt-16 text-left">
        <h2 className="text-[32px] font-semibold text-neutral-400">Placeholder text</h2>
      </div>

      <Footer light />
    </div>
  )
}

export default NewProject6
