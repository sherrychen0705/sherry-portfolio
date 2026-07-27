import { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'

import hero from '../assets/kevzara/hero.png'
import hcpSite from '../assets/kevzara/hcp-2.png'
import bannerLf from '../assets/kevzara/banner-lf.png'
import anim1 from '../assets/kevzara/anim-1.png'
import anim2 from '../assets/kevzara/anim-2.png'
import anim3 from '../assets/kevzara/anim-3.png'

const animatedBanners = [anim1, anim2, anim3]

const IMG = 'w-full'

function Heading({ children }) {
  return <h2 className="text-3xl font-bold text-black md:text-4xl">{children}</h2>
}

function Body({ children }) {
  return <p className="mt-6 max-w-4xl text-neutral-600">{children}</p>
}

const NAV_SECTIONS = [
  { id: 'intro', label: 'intro' },
  { id: 'hcp', label: 'HCP Site' },
  { id: 'banner', label: 'Banner Look and Feel' },
  { id: 'animated', label: 'Animated Banner Campaigns' },
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

function Kevzara() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <SectionNav />

      {/* Hero key visual */}
      <div id="intro" className="container-fluid">
        <img src={hero} alt="Kevzara key visual" className="w-full" />
      </div>

      {/* About this campaign */}
      <section className="container-fluid mt-16 text-left">
        <Reveal>
          <Heading>About this campaign</Heading>
          <Body>
            For this campaign, I primarily focused on website design across desktop and mobile, site
            maps, functional annotations, HCP and DTC animated banner ads, LinkedIn ads, and the overall
            brand look and feel.
          </Body>
        </Reveal>
      </section>

      {/* HCP Site */}
      <section id="hcp" className="container-fluid mt-24 text-left">
        <Reveal>
          <Heading>HCP Site</Heading>
        </Reveal>
        <Reveal strong className="mt-10">
          <img src={hcpSite} alt="Kevzara HCP site design" className={IMG} />
        </Reveal>
      </section>

      {/* Banner Look and Feel */}
      <section id="banner" className="container-fluid mt-24 text-left">
        <Reveal>
          <Heading>Banner Look and Feel</Heading>
        </Reveal>
        <Reveal strong className="mt-10">
          <img src={bannerLf} alt="Banner look and feel system" className={IMG} />
        </Reveal>
      </section>

      {/* Animated Banner Campaigns for HCP and DTC Audiences */}
      <section id="animated" className="container-fluid mt-24 text-left">
        <Reveal>
          <Heading>Animated Banner Campaigns for HCP and DTC Audiences</Heading>
        </Reveal>
        <div className="mt-10 flex flex-col gap-8">
          {animatedBanners.map((src, i) => (
            <Reveal strong key={i}>
              <img src={src} alt={`Animated banner campaign ${i + 1}`} className={IMG} />
            </Reveal>
          ))}
        </div>
      </section>

      <Footer light />
    </div>
  )
}

export default Kevzara
