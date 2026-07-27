import { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'

import hero from '../assets/jakafi/hero.png'
import lookDark1 from '../assets/jakafi/look-dark-1.png'
import lookLight1 from '../assets/jakafi/look-light-1.png'
import lookDark2 from '../assets/jakafi/look-dark-2.png'
import lookLight2 from '../assets/jakafi/look-light-2.png'
import phone1 from '../assets/jakafi/phone-1.png'
import phone2 from '../assets/jakafi/phone-2.png'
import phone3 from '../assets/jakafi/phone-3.png'
import phone4 from '../assets/jakafi/phone-4.png'
import banner1 from '../assets/jakafi/banner-1.png'
import banner2 from '../assets/jakafi/banner-2.png'
import banner3 from '../assets/jakafi/banner-3.png'
import banner4 from '../assets/jakafi/banner-4.png'
import banner5 from '../assets/jakafi/banner-5.png'
import banner6 from '../assets/jakafi/banner-6.png'
import banner7 from '../assets/jakafi/banner-7.png'
import banner8 from '../assets/jakafi/banner-8.png'
import banner9 from '../assets/jakafi/banner-9.png'
import system1 from '../assets/jakafi/system-1.png'
import systemHcp from '../assets/jakafi/system-hcp.png'
import systemGvhd from '../assets/jakafi/system-gvhd.png'
import bannerAnimated from '../assets/jakafi/banner-animated.gif'

const directions = [phone1, phone2, phone3, phone4]
const banners = [banner1, banner2, banner3, banner4, banner5, banner6, banner7, banner8, banner9]

const IMG = 'w-full'

function Heading({ children }) {
  return <h2 className="text-3xl font-bold text-black md:text-4xl">{children}</h2>
}

function Body({ children, className = '' }) {
  return <p className={`mt-6 max-w-4xl text-neutral-600 ${className}`}>{children}</p>
}

function Label({ children }) {
  return <p className="mb-3 text-sm font-semibold text-neutral-500">{children}</p>
}

const NAV_SECTIONS = [
  { id: 'intro', label: 'intro' },
  { id: 'look', label: 'Brand look and feel 3.0' },
  { id: 'system', label: 'Brand system 2.0' },
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

function Jakafi() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <SectionNav />

      {/* Hero key visual */}
      <div id="intro" className="container-fluid">
        <img src={hero} alt="Jakafi XR key visual" className="w-full" />
      </div>

      {/* About this project */}
      <section className="container-fluid mt-16 text-left">
        <Reveal>
          <Heading>About this project</Heading>
          <Body>
            For this project, I was the primary designer responsible for creating the 0 to 1 visual
            identity for the launch of Jakafi XR, working closely with my design manager, art directors,
            developers, account partners, and strategists. My responsibilities included developing mood
            boards to establish the creative direction, designing the website across desktop and mobile,
            creating site maps and functional annotations, and producing a cohesive suite of launch
            assets including key visuals, HCP and DTC animated banner campaigns, iCVAs, email designs,
            and the overall brand look and feel.
          </Body>
          <Body>
            As a blueprint brand for Incyte, Jakafi serves as the visual foundation for future campaigns
            across the portfolio. The primary objective was to build awareness of the newly approved once
            daily extended release formulation while maintaining the trust and equity of the existing
            Jakafi brand. The visual system was designed to clearly communicate innovation without losing
            brand familiarity, creating a flexible design language that could scale consistently across
            channels and touchpoints.
          </Body>
          <p className="mt-6 max-w-4xl text-sm italic text-neutral-400">
            Please note that projects currently in development, unpublished work, or materials containing
            confidential client information cannot be displayed.
          </p>
        </Reveal>
      </section>

      {/* Brand look and feel 3.0 */}
      <section id="look" className="container-fluid mt-24 text-left">
        <Reveal>
          <Heading>Brand look and feel 3.0</Heading>
          <Body>
            Designed bold conceptual rebrand directions for Incyte&rsquo;s Blueprint brand, exploring
            refreshed dark and light mode visual systems for Jakafi XR. The work focused on creating a
            stronger brand presence through high-contrast layouts, cinematic imagery, modular content
            cards, and clearer clinical data hierarchy, while maintaining usability across desktop and
            responsive experiences.
          </Body>
        </Reveal>

        {/* Dark / Light mode desktop directions (2 x 2) */}
        <Reveal strong className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8">
          <div>
            <Label>Dark Mode</Label>
            <img src={lookDark1} alt="Dark mode direction" className={IMG} />
          </div>
          <div>
            <Label>Light Mode</Label>
            <img src={lookLight1} alt="Light mode direction" className={IMG} />
          </div>
          <img src={lookDark2} alt="Dark mode direction" className={IMG} />
          <img src={lookLight2} alt="Light mode direction" className={IMG} />
        </Reveal>

        <Body>
          Examples of visual directions to reimagine the Incyte Blueprint brand with a bolder and more
          distinctive look and feel. These concepts included both dark and light mode applications,
          allowing me to test how different levels of contrast, color intensity, imagery, and layout
          structure could shift the tone of the experience. Through these explorations, I focused on
          finding a balance between clinical credibility and stronger visual impact, making key efficacy
          data, educational modules, and calls to action feel clearer, more engaging, and more memorable
          across the digital experience.
        </Body>

        {/* Four additional direction mockups */}
        <Reveal strong className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {directions.map((src, i) => (
            <img key={i} src={src} alt={`Visual direction ${i + 1}`} className={IMG} />
          ))}
        </Reveal>

        <Body>
          I also explored a KOL video look and feel to bring the brand into expert-led storytelling. The
          direction used bold typography, clinical data callouts, and cinematic framing to make
          physician-led content feel more credible, engaging, and campaign-ready.
        </Body>

        {/* Key visuals — 3 x 3 */}
        <Reveal strong className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {banners.map((src, i) => (
            <img key={i} src={src} alt={`Key visual ${i + 1}`} className={IMG} />
          ))}
        </Reveal>
      </section>

      {/* Brand system 2.0 */}
      <section id="system" className="container-fluid mt-24 text-left">
        <Reveal>
          <Heading>Brand system 2.0</Heading>
          <Body>
            The V2 key visual refresh unifies Jakafi XR&rsquo;s primary purple and green brand colors into
            a cohesive visual system. Smooth gradients and seamless color transitions create stronger
            harmony between the core brand and the XR extension, giving the identity a more modern and
            elevated look. The refined color treatment improves consistency across campaign assets while
            reinforcing brand recognition and providing a flexible design language that adapts across
            multiple digital formats.
          </Body>
        </Reveal>

        <Reveal strong className="mt-12">
          <img src={system1} alt="V2 key visual system" className={IMG} />
        </Reveal>

        <Reveal strong className="mt-16">
          <Label>HCP Site</Label>
          <img src={systemHcp} alt="HCP site look and feel" className={IMG} />
        </Reveal>

        <Reveal strong className="mt-16">
          <Label>GVHD site look and feel</Label>
          <img src={systemGvhd} alt="GVHD site look and feel" className={IMG} />
        </Reveal>

        <Reveal strong className="mt-16">
          <img src={bannerAnimated} alt="Animated banner campaign" className={IMG} />
        </Reveal>
      </section>

      <Footer light />
    </div>
  )
}

export default Jakafi
