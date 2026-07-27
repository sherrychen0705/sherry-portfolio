import omnicomHero from '../assets/omnicom/omnicom-hero.png'
import clientJakafi from '../assets/omnicom/client-jakafi.png'
import clientKevzara from '../assets/omnicom/client-kevzara.png'
import clientNiktimvo from '../assets/omnicom/client-niktimvo.png'
import clientWainua from '../assets/omnicom/client-wainua.png'
import coverEpioxa from '../assets/omnicom/epioxa-cover.png'
import coverBimzelx from '../assets/omnicom/bimzelx-cover.png'
import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'

// 2 列网格顺序：Jakafi+Niktimvo / Kevzara+Epioxa / Bimzelx+Wainua
// link 以 http 开头的走外链（新标签打开）
const clients = [
  { img: clientJakafi, title: 'Client: Jakafi - Incyte', tag: 'Campaign Branding | Advertising', link: '/jakafi' },
  { img: clientNiktimvo, title: 'Client: Niktimvo - Incyte', tag: 'Campaign Branding | Advertising', link: '/niktimvo' },
  { img: clientKevzara, title: 'Client: Kevzara - Sanofi', tag: 'Campaign Branding | Advertising', link: '/kevzara' },
  { img: coverEpioxa, title: 'Client: Epioxa', tag: 'Campaign Branding | Advertising', link: 'https://www.epioxa.com/' },
  { img: coverBimzelx, title: 'Client: Bimzelx', tag: 'Campaign Branding | Advertising', link: 'https://www.bimzelxhcp.com/' },
  { img: clientWainua, title: 'Client: Wainua - AstraZeneca', tag: 'Campaign Branding | Advertising' },
]

function Omnicom() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      {/* OMNICOM 环形 hero 图 */}
      <div className="container-fluid">
        <img src={omnicomHero} alt="OMNICOM" className="h-auto w-full" />
      </div>

      {/* 标题 + 描述 */}
      <section className="container-fluid mt-8 text-left">
        <Reveal>
          <h1 className="text-4xl font-bold leading-tight text-black md:text-5xl">
            Exploring creativity in healthcare experiences — til ∞.
          </h1>
          <p className="mt-6 max-w-4xl text-neutral-600">
            Currently working at NEON (Omnicom Health, prev IPG Health) as a product designer who owns
            end to end creative process of blueprint brands from top pharmaceutical clients, including
            Incyte, Sanofi and Merck.
          </p>
          <p className="mt-4 max-w-4xl text-neutral-600">
            Collaborated with a 35+ person team to design websites, apps, and campaigns. Led end-to-end
            design across ~10 brands, building design systems and high-fidelity UI, and translating
            complex requirements into scalable, production-ready designs with developers.
          </p>
        </Reveal>
      </section>

      {/* 4 张客户卡片（2×2） */}
      <section className="container-fluid mt-16 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
        {clients.map((c) => {
          const isExternal = c.link && /^https?:\/\//.test(c.link)
          const Wrapper = c.link ? (isExternal ? 'a' : Link) : 'div'
          const wrapperProps = c.link
            ? isExternal
              ? { href: c.link, target: '_blank', rel: 'noreferrer' }
              : { to: c.link }
            : {}
          return (
            <Reveal key={c.title} className="text-left">
              <Wrapper {...wrapperProps} className="group block">
                <img
                  src={c.img}
                  alt={c.title}
                  className={`aspect-[4/3] w-full rounded-xl object-cover transition-opacity duration-300 ${
                    c.link ? 'group-hover:opacity-90' : ''
                  }`}
                />
                <p className="mt-3 text-sm font-semibold text-black">{c.title}</p>
                <p className="mt-1 text-xs text-neutral-500">{c.tag}</p>
              </Wrapper>
            </Reveal>
          )
        })}
      </section>

      <Footer light />
    </div>
  )
}

export default Omnicom
