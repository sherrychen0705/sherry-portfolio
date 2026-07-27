import { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'

import hero from '../assets/niktimvo/hero.png'
import a1 from '../assets/niktimvo/a1.png'
import a2 from '../assets/niktimvo/a2.png'
import a3 from '../assets/niktimvo/a3.png'
import a4 from '../assets/niktimvo/a4.png'
import a5 from '../assets/niktimvo/a5.png'
import a6 from '../assets/niktimvo/a6.png'
import b1 from '../assets/niktimvo/b1.png'
import b2 from '../assets/niktimvo/b2.png'
import b3 from '../assets/niktimvo/b3.png'
import b4 from '../assets/niktimvo/b4.png'
import b5 from '../assets/niktimvo/b5.png'
import b6 from '../assets/niktimvo/b6.png'
import c1 from '../assets/niktimvo/c1.png'
import c2 from '../assets/niktimvo/c2.png'

const kolGrid = [a1, a2, a3, a4, a5, a6]
const kolMockups = [b1, b2, b3, b4, b5, b6]

const IMG = 'w-full'

function Heading({ children }) {
  return <h2 className="text-3xl font-bold text-black md:text-4xl">{children}</h2>
}

function Body({ children }) {
  return <p className="mt-6 max-w-4xl text-neutral-600">{children}</p>
}

const NAV_SECTIONS = [
  { id: 'intro', label: 'intro' },
  { id: 'superkol', label: 'Super KOL Video' },
  { id: 'hcp', label: 'HCP Site' },
  { id: 'wireframes', label: 'Wireframes Samples' },
]

// 右侧滚动联动菜单：外观与 Nexus 的 SectionNav 一致
function SectionNav() {
  const [active, setActive] = useState('intro')

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

function Niktimvo() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <SectionNav />

      {/* Hero key visual */}
      <div id="intro" className="container-fluid">
        <img src={hero} alt="Niktimvo key visual" className="w-full" />
      </div>

      {/* About this campaign */}
      <section className="container-fluid mt-16 text-left">
        <Reveal>
          <Heading>About this campaign</Heading>
          <Body>
            For this campaign, I primarily focused on thew new AI-assisted Super KOL, website design
            across desktop and mobile, site maps, functional annotations, HCP and DTC animated banner
            ads, and wireframes.
          </Body>
        </Reveal>
      </section>

      {/* Super KOL Video */}
      <section id="superkol" className="container-fluid mt-24 text-left">
        <Reveal>
          <Heading>Super KOL Video</Heading>
          <Body>
            The experience was designed to reduce barriers to patient education by making complex
            treatment information easier to navigate through natural conversations with a virtual HCP.
            This approach encourages patients to engage with educational content earlier in their care
            journey, leading to more informed discussions with healthcare providers and greater
            confidence in treatment decisions.
          </Body>
        </Reveal>

        {/* Strategy diagrams + avatar screens (2 per row) */}
        <Reveal strong className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {kolGrid.map((src, i) => (
            <img key={i} src={src} alt={`Super KOL exploration ${i + 1}`} className={IMG} />
          ))}
        </Reveal>

        {/* Annotated UI mockups (full width) */}
        <div className="mt-8 flex flex-col gap-8">
          {kolMockups.map((src, i) => (
            <Reveal strong key={i}>
              <img src={src} alt={`Super KOL interface ${i + 1}`} className={IMG} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* HCP Site */}
      <section id="hcp" className="container-fluid mt-24 text-left">
        <Reveal>
          <Heading>HCP Site</Heading>
        </Reveal>
        <Reveal strong className="mt-10">
          <img src={c1} alt="HCP site design" className={IMG} />
        </Reveal>
      </section>

      {/* Wireframes Samples */}
      <section id="wireframes" className="container-fluid mt-24 text-left">
        <Reveal>
          <Heading>Wireframes Samples</Heading>
        </Reveal>
        <Reveal strong className="mt-10">
          <img src={c2} alt="Wireframe samples" className={IMG} />
        </Reveal>
      </section>

      <Footer light />
    </div>
  )
}

export default Niktimvo
