import { useEffect, useRef, useState } from 'react'
import heroBanner from '../assets/nexus/hero-banner.png'
import solutionImpact from '../assets/nexus/solution-impact.png'
import dayInLife from '../assets/nexus/day-in-life.png'
import problemDefLeft from '../assets/nexus/problem-def-left.png'
import problemDefRight from '../assets/nexus/problem-def-right.png'
import c1OldLeft from '../assets/nexus/c1-old-left.png'
import c1OldRight from '../assets/nexus/c1-old-right.png'
import c1EventLifecycle from '../assets/nexus/c1-event-lifecycle.png'
import c1TaskTags from '../assets/nexus/c1-task-tags.png'
import c1SolTaxonomy from '../assets/nexus/c1-sol-taxonomy.png'
import c1SolMid from '../assets/nexus/c1-sol-mid.png'
import c1SolComparison from '../assets/nexus/c1-sol-comparison.png'
import c2OldLeft from '../assets/nexus/c2-old-left.png'
import c2OldRight from '../assets/nexus/c2-old-right.png'
import c2OptA from '../assets/nexus/c2-opt-a.png'
import c2OptB from '../assets/nexus/c2-opt-b.png'
import c2OptC from '../assets/nexus/c2-opt-c.png'
import c2SubtaskGrouped from '../assets/nexus/c2-subtask-grouped.png'
import c2EditFailed from '../assets/nexus/c2-edit-failed.gif'
import c2EditSuccess from '../assets/nexus/c2-edit-success.gif'
import c3OldDesign from '../assets/nexus/c3-old-design.png'
import c3OptA from '../assets/nexus/c3-opt-a.png'
import c3OptB from '../assets/nexus/c3-opt-b.png'
import c3SolPanel from '../assets/nexus/c3-sol-panel.gif'
import c3Perspectives from '../assets/nexus/c3-perspectives.gif'
import c4OldDesign from '../assets/nexus/c4-old-design.png'
import c4ReminderA from '../assets/nexus/c4-reminder-r1-left.png'
import c4ReminderB1 from '../assets/nexus/c4-reminder-r1-right.png'
import c4ReminderB2 from '../assets/nexus/c4-reminder-r2-right.png'
import c4ReminderC from '../assets/nexus/c4-reminder-r2-left.png'
import c4SolMethods from '../assets/nexus/c4-sol-methods.gif'
import avatarPm from '../assets/nexus/avatar-pm.jpg'
import avatarSales from '../assets/nexus/avatar-sales.jpg'

import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'

const ACCENT = '#4c8cba'
const ORANGE = '#c26442'
const GREEN = '#5b9c3f'

function H2({ children, className = '' }) {
  return <h2 className={`text-[32px] font-semibold text-black ${className}`}>{children}</h2>
}

function H3({ children, className = '', color = ACCENT }) {
  return (
    <h3 className={`text-[25px] font-semibold ${className}`} style={{ color }}>
      {children}
    </h3>
  )
}

function Eyebrow({ children }) {
  return <p className="text-sm font-semibold" style={{ color: ACCENT }}>{children}</p>
}

// Body copy under Old Design / Design Opportunity / Solution headings.
function Body({ children, className = '' }) {
  return (
    <p className={`font-light ${className}`} style={{ color: '#686868' }}>
      {children}
    </p>
  )
}

// Old Designs block: heading + body copy on the left, image(s) on the right,
// vertically centered against the media. Reused across all challenges.
function OldDesignsBlock({ text, children }) {
  return (
    <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-10">
      <div className="md:w-[20%]">
        <h3 className="text-[25px] font-bold" style={{ color: ORANGE, fontFamily: '"Figtree", sans-serif' }}>Old Designs</h3>
        <Body className="mt-[18px]">{text}</Body>
      </div>
      <div className="md:flex-1">{children}</div>
    </div>
  )
}

// Hand-drawn blue annotation text that sits to the right of a media element.
function SideNote({ children }) {
  return (
    <p
      className="w-[116px] shrink-0 self-center"
      style={{ color: ACCENT, fontSize: '16px', fontWeight: 500, lineHeight: '22.4px' }}
    >
      {children}
    </p>
  )
}

// Media element with an optional blue side annotation (and, for the subtask
// image, a hand-drawn "]" bracket + connector). The bracket is positioned by
// percentage so it stays glued to the same rows as the image scales.
function AnnotatedMedia({ src, alt, note, bracket = false }) {
  return (
    <div className="flex items-start gap-3">
      <div className="relative min-w-0 flex-1">
        <img src={src} alt={alt} className="w-full rounded-lg object-cover" />
        {bracket && (
          <>
            <span
              className="pointer-events-none absolute"
              style={{
                top: '40.7%',
                height: '33%',
                right: '2.3%',
                width: '2.5%',
                borderStyle: 'solid',
                borderColor: '#6ed6ff',
                borderWidth: '1.5px 1.5px 1.5px 0',
              }}
            />
            <span
              className="pointer-events-none absolute"
              style={{ top: '49.9%', left: '97.5%', right: '-14px', borderTop: '1.5px solid #6ed6ff' }}
            />
          </>
        )}
      </div>
      <SideNote>{note}</SideNote>
    </div>
  )
}

function ChallengeBox({ number, question, intro }) {
  return (
    <div className="w-full" style={{ background: 'rgba(223, 234, 245, 0.5)' }}>
      <div className="container-fluid py-8 text-left md:py-10">
        <p className="text-[28px] font-semibold" style={{ color: ACCENT }}>Challenge {number}:</p>
        <p className="mt-2 text-[28px] font-light" style={{ color: ACCENT }}>
          {question}
        </p>
        {intro && <p className="mt-3 text-lg text-neutral-700">{intro}</p>}
      </div>
    </div>
  )
}

function StatBlock({ label, value }) {
  return (
    <div className="text-left">
      <p className="text-neutral-600">{label}</p>
      <p className="mt-1 text-[26px] font-bold leading-tight" style={{ color: ACCENT }}>{value}</p>
    </div>
  )
}

// ---- Timeline diagram (code replica of the timeline image) ----
const timelineSteps = [
  { flex: '0 0 24%', title: 'Define & Discovery', week: 'Week 0', bullets: ['Research & alignment', 'Scope defining'] },
  { flex: '0 0 25%', title: 'Ideation', week: 'Week 1 - 8', bullets: ['UI audit', 'User flow & wireframing', 'Design iterations', 'Sync meeting with stakeholders'] },
  { flex: '0 0 21%', title: 'Validation', week: 'Week 9 - 11', bullets: ['Final QA', 'End-to-end testing', 'User acceptance testing'] },
  { flex: '1 1 30%', title: 'Handoff and Training', week: 'Week 12 - 13', bullets: ['Compliance & stakeholder review', 'User training'] },
]

function TimelineDiagram() {
  return (
    <div className="mt-8 overflow-x-auto">
      <div className="flex min-w-[760px]">
        {timelineSteps.map((m) => (
          <div key={m.title} className="pr-6" style={{ flex: m.flex }}>
            <div className="whitespace-nowrap font-medium" style={{ color: '#5b93d6' }}>{m.title}</div>
            <div className="relative mt-2 flex h-9 items-center">
              <div className="absolute left-0 right-0" style={{ top: '50%', height: '1.5px', background: '#a9c6ea' }} />
              <span
                className="relative z-10 whitespace-nowrap rounded border bg-white px-3 py-1"
                style={{ borderColor: '#b9cfec', color: '#333' }}
              >
                {m.week}
              </span>
            </div>
            <ul className="mt-3 space-y-1.5">
              {m.bullets.map((b) => (
                <li key={b} className="flex gap-2" style={{ color: '#535353' }}>
                  <span className="mt-[11px] inline-block h-1 w-1 shrink-0 rounded-full" style={{ background: '#8a8a8a' }} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---- Project Scope diagram (code replica of the scope image) ----
function ScopeBox({ children, highlight, sub }) {
  return (
    <div
      className="rounded-md border px-4 py-2"
      style={{ borderColor: highlight ? '#73a3e6' : '#a9c6ea', background: highlight ? '#e5f3fe' : '#fff' }}
    >
      <p className={`whitespace-nowrap ${highlight ? 'font-medium' : ''}`} style={{ color: '#4889b8', fontSize: '15px' }}>
        {children}
      </p>
      {sub && (
        <div className="mt-2 space-y-0.5 text-[12px]" style={{ color: '#535353' }}>
          {sub.map((s) => (
            <p key={s} className="whitespace-nowrap">{s}</p>
          ))}
        </div>
      )}
    </div>
  )
}

function ScopeDiagram() {
  return (
    <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-center md:gap-10">
      <div className="relative md:w-[150px] md:shrink-0 md:pt-[34px]">
        <p style={{ color: '#4889b8', fontSize: '15px' }}>
          I primarily focused on redesigning the program management and tracking experience.
        </p>
        <span
          className="absolute hidden md:block"
          style={{ top: '93px', left: '100%', width: '40px', borderTop: '1.5px solid #a9c6ea' }}
        />
      </div>
      <div className="md:w-fit md:shrink-0">
        <p className="text-center font-bold" style={{ color: '#707070', fontSize: '16px' }}>UX Redesign</p>
        <div className="mt-4 space-y-3">
          <ScopeBox highlight sub={['Tracking Dashboard', 'Program Task Management', 'Task Specifics']}>
            Program Tracking and Managing
          </ScopeBox>
          <ScopeBox>System Administration</ScopeBox>
          <ScopeBox>Speaker Mangement</ScopeBox>
          <ScopeBox>Vendor Management</ScopeBox>
        </div>
      </div>
      <div className="md:w-fit md:shrink-0">
        <p className="text-center font-bold" style={{ color: '#707070', fontSize: '16px' }}>System-level Upgrades</p>
        <div className="mt-4 space-y-3">
          <ScopeBox>Attendee Registration</ScopeBox>
          <ScopeBox>Reporting &amp; Analytics</ScopeBox>
          <ScopeBox>AI &amp; Agentic</ScopeBox>
          <ScopeBox>Data Architecture &amp; Integrations</ScopeBox>
        </div>
      </div>
    </div>
  )
}

const painPoints = [
  { title: 'No workflow visibility', desc: 'Unclear cross-road handoff' },
  { title: 'Ambiguous task status', desc: 'No broken task dependency and task order control' },
  { title: 'Premature execution', desc: 'No built-in coordination and fragmented micro-workflow' },
  { title: 'File context and file fragmentation', desc: 'No built in coordination and reminder system' },
]

const takeaways = [
  { title: 'Thriving in ambiguity', desc: 'Learned to break down vague, high-level asks into actionable steps, using quick alignment loops with PMs and engineers to clarify priorities.' },
  { title: 'Designing at speed', desc: 'Built and iterated fast, balancing scrappy solutions with thoughtful design to ship in 8 weeks from concept to launch without compromising usability.' },
  { title: 'Impact focused thinking', desc: 'Learned to prioritize user outcomes and business impact over design perfection, focusing on what truly moves the needle.' },

]

function PainPointsSection() {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          obs.disconnect()
        }
      },
      { threshold: 0, rootMargin: '0px 0px -15% 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
  const TRANS = `opacity 1000ms ${EASE}, transform 1000ms ${EASE}`
  // directional slide-in for the emojis
  const emoji = (dir, size, op, vCenter = false) => {
    const x = shown ? '0px' : dir === 'left' ? '-70px' : '70px'
    return {
      fontSize: size,
      lineHeight: 1,
      opacity: shown ? op : 0,
      transform: `translate(${x}${vCenter ? ', -50%' : ''})`,
      transition: TRANS,
    }
  }

  return (
    <div ref={ref} className="relative mt-16 overflow-hidden px-5">
      {/* far-side large faded emojis */}
      <span aria-hidden className="pointer-events-none absolute left-[3%] top-1/2 hidden md:block" style={emoji('left', '120px', 0.7, true)}>😵‍💫</span>
      <span aria-hidden className="pointer-events-none absolute right-[3%] top-1/2 hidden md:block" style={emoji('right', '120px', 0.7, true)}>😵‍💫</span>

      <div className="mx-auto max-w-[760px]">
        <div className="flex items-center gap-3">
          <span aria-hidden className="hidden md:inline-block" style={emoji('left', '52px', 1)}>😵‍💫</span>
          <H3>All intertwined pains can be summarized into those major 4 issues</H3>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-8">
          {painPoints.map((p) => {
            const isFile = p.title.startsWith('File context')
            return (
              <div key={p.title} className={isFile ? 'relative' : undefined}>
                <h4 className="text-[24px] font-semibold text-black">{p.title}</h4>
                <p className="mt-1 text-neutral-600">{p.desc}</p>
                {isFile && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute hidden md:block"
                    style={{ ...emoji('right', '52px', 1), top: '-6px', left: 'calc(100% + 1.25rem)' }}
                  >
                    😵‍💫
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const NAV_SECTIONS = [
  { id: 'intro', label: 'Intro' },
  { id: 'research', label: 'Research' },
  { id: 'challenge-1', label: 'Challenge 1' },
  { id: 'challenge-2', label: 'Challenge 2' },
  { id: 'challenge-3', label: 'Challenge 3' },
  { id: 'challenge-4', label: 'Challenge 4' },
  { id: 'design-impact', label: 'Design Impact' },
]

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

function Nexus() {
  return (
    <div className="nexus-page min-h-screen bg-white">
      <NavBar />
      <SectionNav />

      <Reveal className="mt-6 overflow-hidden">
        <img src={heroBanner} alt="Nexus" className="w-full object-cover" />
      </Reveal>

      <Reveal id="intro" className="container-fluid mt-16 text-left">
        <H2>About Nexus</H2>
        <p className="mt-4 text-neutral-700">
          Nexus is an enterprise-grade, AI-enabled, cloud-hosted SaaS platform for end-to-end management
          of large-scale Speaker Bureau programs. It's a redesign of IPG Health's previous legacy event
          management platform. New design streamlines medical event scheduling, user roles, reporting and
          compliance check. Nexus supports coordinated execution across Sales, Program Managers, HCPs, and
          medical stakeholders
        </p>
        <p className="mt-4 text-neutral-700">
          The redesign needed to scale globally while ensuring compliance with regulatory requirements,
          including HIPAA, the Sunshine Act, and ISP safeguards, supported by built-in role-based
          permissions and an intuitive UI. Our goal is to attract global partners, reduce training time
          and learning curve and improve cross-team collaboration efficiency.
        </p>
      </Reveal>

      <Reveal className="container-fluid mt-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-left">
          <div>
            <Eyebrow>TEAM</Eyebrow>
            <p className="mt-2 text-neutral-800">Total of 14 people:</p>
            <p className="text-neutral-800">1 PM Lead</p>
            <p className="text-neutral-800">1 Design VP</p>
            <p className="text-neutral-800">1 UX Architect</p>
            <p className="text-neutral-800">4 Product Designers</p>
            <p className="text-neutral-800">7 Software Engineers</p>
          </div>
          <div>
            <Eyebrow>MY ROLE</Eyebrow>
            <p className="mt-2 text-neutral-800">User Research</p>
            <p className="text-neutral-800">Product Design</p>
          </div>
          <div>
            <Eyebrow>TIME LENGTH</Eyebrow>
            <p className="mt-2 text-neutral-800">June 2025 - Dec 2025</p>
          </div>
          <div>
            <Eyebrow>PROJECT TYPE</Eyebrow>
            <p className="mt-2 text-neutral-800">SaaS B2B Web-based App</p>
          </div>
        </div>
      </Reveal>

      <Reveal className="container-fluid mt-16 text-left">
        <H2>Timeline</H2>
        <TimelineDiagram />
      </Reveal>

      <Reveal className="container-fluid mt-16 text-left">
        <H2>Project Scope and My Focus</H2>
        <ScopeDiagram />
      </Reveal>

      <Reveal className="container-fluid mt-16 text-left">
        <H2>Solution Impact</H2>
      </Reveal>

      <Reveal className="mt-8">
        <div style={{ background: '#eaf5fd' }}>
          <div className="container-fluid py-12">
            <div className="flex flex-col items-center gap-8 md:flex-row md:items-center md:gap-12">
              <img src={solutionImpact} alt="Solution impact" className="w-full rounded-lg object-cover md:w-[62%]" />
              <div className="flex w-full flex-col gap-8 md:w-[38%]">
                <StatBlock label="Expand to support" value="3,500+ meetings" />
                <StatBlock label="Able to serve" value="10,000+ users at launch" />
                <StatBlock label="User testing suggests" value="95% positive feedback" />
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal id="research" className="container-fluid mt-20 text-left">
        <H2>Research and Discover</H2>
      </Reveal>

      <Reveal className="container-fluid mt-8 text-left">
        <H3>User's "A Day In Life" Journey</H3>
        <p className="mt-4 text-neutral-700">
          We dedicated our 1st week to condauct a user walk-though sessions to observe and collect their
          interactions with the current product, their goals, focuses on task basis… Then, I created a
          documentation of end to end user flow for each user type to visualize cross-team handoffs,
          compliance timeline and scope in real life.
        </p>
        <img src={dayInLife} alt="A day in life journey" className="mt-6 w-full rounded-lg object-cover" />
      </Reveal>

      <Reveal className="container-fluid mt-16 text-left">
        <H3>Problem Definition</H3>
        <p className="mt-4 text-neutral-700">
          Documents fragmented information (user behaviors, quotes and pain points) into an organized
          document.
        </p>
        <p className="mt-4 text-neutral-700">Narrow down user pain points by doing an affinity map</p>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <img src={problemDefLeft} alt="Problem definition" className="w-full rounded-lg object-cover" />
          <img src={problemDefRight} alt="Problem definition" className="w-full rounded-lg object-cover" />
        </div>
      </Reveal>

      <Reveal className="mt-20 px-5">
        <div className="mx-auto flex max-w-[640px] flex-col">
          <div className="flex max-w-[85%] items-start gap-3 self-start">
            <span className="block flex-none" style={{ width: '40px', height: '40px', borderRadius: '4px', backgroundImage: `url(${avatarPm})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="min-w-0">
              <p className="mb-2 font-medium" style={{ color: '#2f6bed', fontSize: '13px' }}>Product Manager, June 6</p>
              <div className="border px-5 py-3.5" style={{ borderColor: '#2f6bed', color: '#2f6bed', borderRadius: '20px', borderTopLeftRadius: '2px' }}>
                remember, task completions orders can differ from projects to projects.
              </div>
            </div>
          </div>
          <div className="mt-5 flex max-w-[85%] items-start gap-3 self-start">
            <span className="block flex-none" style={{ width: '40px', height: '40px', borderRadius: '4px', backgroundImage: `url(${avatarSales})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="min-w-0">
              <div className="px-5 py-3.5" style={{ background: '#eeeef0', color: '#2b2b2b', borderRadius: '20px', borderTopLeftRadius: '2px' }}>
                Yeah… honestly, I can't recall the completion order in a compliance-specific way for all tasks.
              </div>
              <p className="mt-2" style={{ color: '#8a8a8a', fontSize: '13px' }}>Sales Lead, 12:39PM</p>
            </div>
          </div>
          <div className="mt-5 max-w-[80%] self-end">
            <div className="px-5 py-3.5 text-white" style={{ background: '#2f6bed', borderRadius: '20px', borderTopRightRadius: '2px' }}>
              Ah I see, so it's never a one template for all experience for tasks... It needs to allow back and forth, some level of flexibility.
            </div>
            <p className="mt-2 text-right" style={{ color: '#8a8a8a', fontSize: '13px' }}>My mind, Product Designer, 2:00 PM</p>
          </div>
        </div>
      </Reveal>

      <PainPointsSection />

      <Reveal className="container-fluid mt-[120px] text-left">
        <H2>Design Process</H2>
      </Reveal>

      {/* ---------- Challenge 1 ---------- */}
      <div className="case-media-scope">
      <Reveal id="challenge-1" className="mt-6">
        <ChallengeBox
          number={1}
          question="How do we improve workflow visibility?"
          intro="Well, we can start with introducing a more structured tagging system."
        />
      </Reveal>

      <Reveal strong className="container-fluid mt-8 text-left">
        <OldDesignsBlock text="When observing the old dashboard, we noticed a mixed use of the same tagging system for events and tasks, with an unclear use of colors and semantic meaning.">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <img src={c1OldLeft} alt="Old dashboard design" className="w-full rounded-lg object-cover md:w-auto md:min-w-0 md:basis-0 md:grow-[140]" />
            <img src={c1OldRight} alt="Old status panel design" className="w-full rounded-lg object-cover md:w-auto md:min-w-0 md:basis-0 md:grow-[154]" />
          </div>
        </OldDesignsBlock>
      </Reveal>

      <Reveal strong className="container-fluid mt-20 text-left">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-10">
          <div className="md:w-[20%]">
            <H3>Design Opportunity: Differentiate event and task level status</H3>
            <Body className="mt-[18px]">
              Each program follows a phased, sequential workflow. Organizing program-level tags by timeline
              aligns naturally with users' mental models.
            </Body>
            <Body className="mt-4">And for each task, we simplified and reorganized the status tags.</Body>
          </div>
          <div className="flex flex-col gap-3 md:flex-1">
            <img src={c1EventLifecycle} alt="Event program lifecycle" className="w-full rounded-lg object-cover" />
            <img src={c1TaskTags} alt="Task status tag options" className="w-full rounded-lg object-cover" />
          </div>
        </div>
      </Reveal>

      <Reveal strong className="container-fluid mt-20 text-left">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-10">
          <div className="md:w-[20%]">
            <H3 color={GREEN}>Solution: Time-based event status tag + Simplified task status tag</H3>
            <Body className="mt-[18px]">
              We refactored task status taxonomy to separate lifecycle states from computed conditions,
              reducing redundancy and improving reporting clarity across PM and compliance workflows.
            </Body>
          </div>
          <div className="md:flex-1">
            <img src={c1SolTaxonomy} alt="Status taxonomy and lifecycle states" className="w-full rounded-lg object-cover" />
          </div>
        </div>
        <img src={c1SolMid} alt="Old status tags" className="mx-auto mt-16 w-[65%] rounded-lg object-cover" />
        <p className="mt-3 text-center text-neutral-700">Old Design</p>
        <img src={c1SolComparison} alt="Redesigned status tags" className="mx-auto mt-8 w-[89%] rounded-lg object-cover" />
        <p className="mt-3 text-center text-neutral-700">Redesign</p>
      </Reveal>

      {/* ---------- Challenge 2 ---------- */}
      <Reveal id="challenge-2" className="mt-20">
        <ChallengeBox
          number={2}
          question="How can task dependencies be visualized and implemented while respecting role-based permissions?"
        />
      </Reveal>

      <Reveal strong className="container-fluid mt-8 text-left">
        <OldDesignsBlock text="The lack of structured work order guidance can lead to premature task execution and skipped steps, increasing compliance risk.">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <img src={c2OldLeft} alt="Old design" className="w-full rounded-lg object-cover md:w-auto md:min-w-0 md:basis-0 md:grow-[162]" />
            <img src={c2OldRight} alt="Old design" className="w-full rounded-lg object-cover md:w-auto md:min-w-0 md:basis-0 md:grow-[142]" />
          </div>
        </OldDesignsBlock>
      </Reveal>

      <Reveal strong className="container-fluid mt-16 text-left">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-10">
          <div className="md:w-[20%]">
            <H3>Ideation: Differentiate event and task level status</H3>
            <Body className="mt-[18px]">
              To ensure compliance-ready task sequencing, we tested multiple subtask layouts for visual
              scalability.
            </Body>
            <Body className="mt-4">
              Option B provided the most accessible, timeline-oriented view across tasks, while Option C was
              reserved as a secondary upgrade due to mobile usability constraints.
            </Body>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:flex-1 md:grid-cols-2">
            <figure>
              <img src={c2OptA} alt="Option A" className="w-full rounded-lg object-cover" />
              <Body className="mt-3 text-center">Option A</Body>
            </figure>
            <figure>
              <div className="relative origin-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:z-20 hover:scale-[1.4]">
                <img src={c2OptB} alt="Option B" className="w-full rounded-lg object-cover" style={{ border: '2px solid #3f8ed6' }} />
                <svg viewBox="0 0 23 23" aria-hidden className="absolute h-7 w-7" style={{ right: '9px', bottom: '9px' }}>
                  <circle cx="11.5" cy="11.5" r="11.5" fill="#6c9d28" />
                  <path d="M 5.552 11.5 L 10.127 16.259 L 17.448 6.741" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
                </svg>
              </div>
              <Body className="mt-3 text-center">Option B</Body>
            </figure>
            <figure>
              <img src={c2OptC} alt="Option C" className="w-full rounded-lg object-cover" />
              <Body className="mt-3 text-center">Option C</Body>
            </figure>
          </div>
        </div>
      </Reveal>

      <Reveal strong className="container-fluid mt-16 text-left">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-10">
          <div className="md:w-[20%]">
            <H3 color={GREEN}>Solution: Visual Grouping of Tasks</H3>
            <Body className="mt-[18px]">
              Subtasks are nested within each task accordion to visually group related actions while
              maintaining a clean interface.
            </Body>
          </div>
          <div className="md:flex-1">
            <AnnotatedMedia
              src={c2SubtaskGrouped}
              alt="Subtasks grouped"
              bracket
              note="Now subtasks are grouped within their parent task with accordions."
            />
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-8 md:flex-row md:items-center md:gap-10">
          <div className="md:w-[20%]">
            <h4 className="text-lg font-light" style={{ color: GREEN }}>
              The nested task view enables program managers to edit task dependencies and details within only a
              few clicks
            </h4>
            <Body className="mt-[18px]">
              Unlike other healthcare management platforms, Nexus gives program managers more flexibility to
              audit and adapt task workflows across different event programs.
            </Body>
            <Body className="mt-4">
              However in certain cases, program managers are restricted from modifying task workflows; the
              system provides toast warnings and confirmations to indicate whether changes are permitted or
              successfully applied.
            </Body>
          </div>
          <div className="flex flex-col gap-8 md:flex-1">
            <div>
              <AnnotatedMedia
                src={c2EditFailed}
                alt="Edit failed toast"
                note="If move tasks out of dependency area, there will be an error toast warning that indicates not move."
              />
              <p className="mt-3 text-center" style={{ color: '#4d4d4d', fontSize: '18px', fontWeight: 500 }}>Edit Failed</p>
            </div>
            <div>
              <AnnotatedMedia
                src={c2EditSuccess}
                alt="Edit made successfully toast"
                note="If move tasks within the dependency area, there will be an toast warning saying moving was successful."
              />
              <p className="mt-3 text-center" style={{ color: '#4d4d4d', fontSize: '18px', fontWeight: 500 }}>Edit Made Successfully</p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ---------- Challenge 3 ---------- */}
      <Reveal id="challenge-3" className="mt-20">
        <ChallengeBox
          number={3}
          question="How can we support micro-workflows to streamline navigation across tasks, audit trails, and assets?"
        />
      </Reveal>

      <Reveal strong className="container-fluid mt-8 text-left">
        <OldDesignsBlock text="Instead of having a clear visual hierarchy, assets and key information within each task were fragmented and out of order. One program manager described spending over 30 minutes scrolling and digging to locate a single file.">
          <img src={c3OldDesign} alt="Old design" className="w-full rounded-lg object-cover" />
        </OldDesignsBlock>
      </Reveal>

      <Reveal strong className="container-fluid mt-16 text-left">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-10">
          <div className="md:w-[20%]">
            <H3>Ideation: Task Panel</H3>
            <p className="mt-[18px] text-neutral-700">
              We decided to collectively show all task information in a panel. Initially, we decided we have
              everything in a larger panel, but this would block the view of other tasks, making it difficult
              to see how the current task is related to the others. We ended up choosing a side panel that can
              auto slide in when clicks on a task.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:flex-1 md:grid-cols-2">
            <figure>
              <img src={c3OptA} alt="Option A" className="w-full rounded-lg object-cover" />
              <p className="mt-3 text-center text-neutral-700">Option A</p>
            </figure>
            <figure>
              <div className="relative origin-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:z-20 hover:scale-[1.4]">
                <img src={c3OptB} alt="Option B" className="w-full rounded-lg object-cover" style={{ border: '2px solid #3f8ed6' }} />
                <svg viewBox="0 0 23 23" aria-hidden className="absolute h-7 w-7" style={{ right: '9px', bottom: '9px' }}>
                  <circle cx="11.5" cy="11.5" r="11.5" fill="#6c9d28" />
                  <path d="M 5.552 11.5 L 10.127 16.259 L 17.448 6.741" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
                </svg>
              </div>
              <p className="mt-3 text-center text-neutral-700">Option B</p>
            </figure>
          </div>
        </div>
      </Reveal>

      <Reveal strong className="container-fluid mt-16 text-left">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-10">
          <div className="md:w-[20%]">
            <H3 color={GREEN}>Solution: Key information is organized into tabs within the panel</H3>
            <Body className="mt-[18px]">
              A single, centralized space now surfaces updates, audit history, comments, to-dos, and team
              members, eliminating excessive scrolling and manual searching.
            </Body>
          </div>
          <div className="md:flex-1">
            <img src={c3SolPanel} alt="Task panel slide demo" className="w-full rounded-lg object-cover" />
            <p className="mt-2 text-center text-sm italic text-neutral-500">Task panel auto slide in from the right</p>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-center md:gap-10">
          <Body className="md:w-[20%]">
            On a micro-flow level, this is an example of how two different users interact when handing off
            deliverables.
          </Body>
          <div className="md:flex-1">
            <img src={c3Perspectives} alt="Two user perspectives" className="w-full rounded-lg object-cover" />
            <div className="mt-2 grid grid-cols-2 gap-6">
              <p className="text-center text-sm italic text-neutral-500">Sales Representative Perspective</p>
              <p className="text-center text-sm italic text-neutral-500">Program Manager Perspective</p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ---------- Challenge 4 ---------- */}
      <Reveal id="challenge-4" className="mt-20">
        <ChallengeBox number={4} question="How can we enable more efficient execution and collaboration?" />
      </Reveal>

      <Reveal strong className="container-fluid mt-8 text-left">
        <OldDesignsBlock text="The previous design required users to manually send reminders to prompt check-ins, task reviews, or attention.">
          <img src={c4OldDesign} alt="Old design" className="w-full rounded-lg object-cover" />
        </OldDesignsBlock>
      </Reveal>

      <Reveal strong className="container-fluid mt-16 text-left">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-10">
          <div className="md:w-[20%]">
            <H3>Ideation: Reminder System</H3>
            <p className="mt-[18px] text-neutral-700">
              Option A introduced an automatic bottom bar for overdue tasks, while Option B offered greater
              control over recipients to support multi-stakeholder programs. We ultimately selected Option C, a
              lightweight hover interaction that enables quick notification sending while keeping detailed
              contact information accessible in the side panel, balancing speed, flexibility, and minimal
              disruption to the workflow.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:flex-1 md:grid-cols-2">
            <figure>
              <img src={c4ReminderA} alt="Option A" className="w-full rounded-lg object-cover" />
              <p className="mt-3 text-center text-neutral-700">Option A</p>
            </figure>
            <figure>
              <img src={c4ReminderB1} alt="Option B" className="w-full rounded-lg object-cover" />
              <p className="mt-3 text-center text-neutral-700">Option B</p>
            </figure>
            <figure className="md:col-span-2">
              <div className="relative origin-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:z-20 hover:scale-[1.4]">
                <div className="flex gap-2 overflow-hidden rounded-[5px]" style={{ border: '2px solid #3f8ed6' }}>
                  <img src={c4ReminderC} alt="Option C" className="w-1/2 object-cover" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }} />
                  <img src={c4ReminderB2} alt="Option C" className="w-1/2 object-cover" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }} />
                </div>
                <svg viewBox="0 0 23 23" aria-hidden className="absolute h-7 w-7" style={{ right: '9px', bottom: '9px' }}>
                  <circle cx="11.5" cy="11.5" r="11.5" fill="#6c9d28" />
                  <path d="M 5.552 11.5 L 10.127 16.259 L 17.448 6.741" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
                </svg>
              </div>
              <p className="mt-3 text-center text-neutral-700">Option C</p>
            </figure>
          </div>
        </div>
      </Reveal>

      <Reveal strong className="container-fluid mt-16 text-left">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-10">
          <div className="md:w-[20%]">
            <H3 color={GREEN}>Solution: Two built-in communication methods</H3>
            <Body className="mt-[18px]">
              Developed two built-in communication methods that enable fast, contextual communication within
              the workflow, minimizing reliance on external tools
            </Body>
          </div>
          <div className="md:flex-1">
            <img src={c4SolMethods} alt="Two built-in communication methods demo" className="w-full rounded-lg object-cover" />
            <p className="mt-2 text-center text-sm italic text-neutral-500">Sales Representative Perspective</p>
          </div>
        </div>
      </Reveal>
      </div>

      {/* ---------- Design Impact ---------- */}
      <Reveal id="design-impact" className="container-fluid mt-20 text-left">
        <H2>Design Impact &amp; Next Steps</H2>
        <p className="mt-4 text-neutral-700 max-w-3xl">
          The redesigned Nexus platform offers a scalable and compliant solution that delivers significant
          improvements, reducing manual work, and increasing adoption.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-4">
          <StatBlock label="Reduced administrative overhead by" value="30%" />
          <StatBlock label="Reduced compliance violations by" value="95%" />
          <StatBlock label="Targeted user satisfaction < 6 months with score of" value="9/10" />
          <StatBlock label="In 3 years, will expand to" value="7+ agencies" />
        </div>
        <p className="mt-10 font-semibold text-black">A few takeaways from my side:</p>
        <div className="mt-4 flex flex-col gap-4">
          {takeaways.map((t) => (
            <p key={t.title} className="text-neutral-700">
              <span className="font-semibold text-black">{t.title}</span> – {t.desc}
            </p>
          ))}
        </div>
      </Reveal>

      <Footer light />
    </div>
  )
}

export default Nexus
