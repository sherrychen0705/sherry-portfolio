import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import GrassHills from '../components/GrassHills'
import AboutContent from '../components/AboutContent'

// About 页：内容在 components/AboutContent.jsx（首页广告牌点开后也用同一份）
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
        <AboutContent />
      </main>

      <Footer />
    </div>
  )
}

export default AboutMe
