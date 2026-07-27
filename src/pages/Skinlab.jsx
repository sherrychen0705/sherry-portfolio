import heroMockups from '../assets/skinlab/hero-mockups.png'
import challengesChart from '../assets/skinlab/challenges-chart.png'
import interviewMethod from '../assets/skinlab/interview-method.png'
import quote1 from '../assets/skinlab/quote-1.png'
import quote2 from '../assets/skinlab/quote-2.png'
import affinityWall from '../assets/skinlab/affinity-wall.png'
import persona1 from '../assets/skinlab/persona-1.png'
import persona2 from '../assets/skinlab/persona-2.png'
import competitorAnalysis from '../assets/skinlab/competitor-analysis.png'
import hmwStatements from '../assets/skinlab/hmw-statements.png'
import mvpSketches from '../assets/skinlab/mvp-sketches.png'
import wireframes from '../assets/skinlab/wireframes.png'
import designGuidelines from '../assets/skinlab/design-guidelines.png'
import statIconLow from '../assets/skinlab/stat-icon-2.png'
import statIconHigh from '../assets/skinlab/stat-icon-1.png'
import nextSteps from '../assets/skinlab/next-steps.png'

import feature1Video from '../assets/skinlab/videos/feature-1-skin-profiling.mp4'
import feature2Video from '../assets/skinlab/videos/feature-2-report.mp4'
import feature3Video from '../assets/skinlab/videos/feature-3-evaluation.mp4'

import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'
import { Video, SectionLabel } from '../components/caseStudy'

const PINK = '#e0399e'
const ACCENT = '#4c8cba'
const GREEN = '#5b9c3f'

const sideNav = [
  { label: 'Background', href: '#skinlab-bg' },
  { label: 'MVP Ideations', href: '#skinlab-bg' },
  { label: 'Discover', href: '#skinlab-discover' },
  { label: 'Ideations', href: '#skinlab-ideation' },
  { label: 'Reflections', href: '#skinlab-reflections' },
]

// Content column matches the original site: 1000px wide, left edge at 140px @1280.
function C({ children, className = '', id }) {
  return (
    <div id={id} className={`mx-auto w-full max-w-[1040px] px-5 ${className}`}>
      {children}
    </div>
  )
}

const features = [
  {
    n: '1',
    line1: 'AI-Driven',
    line2: 'Skin Profiling',
    desc: 'Follow the instructions to allow the phone camera to capture facial views from multiple angles, utilizing multi-layer perceptron technology.',
    video: feature1Video,
    side: 'right',
  },
  {
    n: '2',
    line1: 'SKINLab',
    line2: 'Report',
    desc: 'Swipe to explore personalized analysis segments, including skin type, ingredient recommendations, hydration levels, firmness, and discoloration.',
    video: feature2Video,
    side: 'left',
  },
  {
    n: '3',
    line1: 'Personalized',
    line2: 'Evaluation',
    desc: 'After the skin assessment, all products will be evaluated on a scale to indicate how well they meet individual skin needs.',
    video: feature3Video,
    side: 'right',
  },
  {
    n: '4',
    line1: 'Product',
    line2: 'Comparison',
    desc: 'Use the personalized evaluation scale to discover the product that best suits your skin.',
    video: null,
    side: 'left',
  },
]

function SideNav() {
  return (
    <nav
      className="fixed left-6 top-1/3 z-40 hidden flex-col gap-3 text-sm font-medium lg:flex"
      style={{ color: ACCENT }}
    >
      {sideNav.map((item) => (
        <a key={item.label} href={item.href} className="hover:opacity-70">
          {item.label}
        </a>
      ))}
    </nav>
  )
}

function Feature({ n, line1, line2, desc, video, side }) {
  return (
    <C className="mt-24">
      <div className={`flex ${side === 'right' ? 'justify-end' : 'justify-start'}`}>
        <div className="w-[305px] max-w-full text-left">
          <SectionLabel color={ACCENT}>FEATURE {n}</SectionLabel>
          <h3 className="mt-1 text-[26px] font-bold leading-tight text-black">
            {line1}
            <br />
            {line2}
          </h3>
          <p className="mt-4 text-neutral-600">{desc}</p>
          {video && (
            <Reveal className="mt-12">
              <div className="w-[290px] max-w-full">
                <Video src={video} className="rounded-none" />
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </C>
  )
}

function Skinlab() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <SideNav />

      {/* Hero — full-bleed banner */}
      <Reveal className="mx-auto mt-6 max-w-[1240px]">
        <img src={heroMockups} alt="SKINLab app mockups" className="w-full object-cover" />
      </Reveal>

      <C id="skinlab-bg" className="mt-16 text-left">
        <Reveal>
          <h2 className="text-[32px] font-semibold" style={{ color: PINK }}>What is SkinLab</h2>
          <p className="mt-4 text-neutral-600">
            SKINLab is an all-in-one AI-powered solution that offers dermatologist-approved skin assessments and
            personalized skincare recommendations.
          </p>
          <h2 className="mt-10 text-[32px] font-semibold" style={{ color: PINK }}>Design Goal</h2>
          <p className="mt-4 text-neutral-600">To help users feel more confident in their purchasing decisions.</p>
          <p className="text-neutral-600">To advocate for skin health.</p>
          <p className="text-neutral-600">To reduce product return rate.</p>
        </Reveal>
      </C>

      <C className="mt-16">
        <Reveal>
          <div className="grid grid-cols-1 gap-8 text-left md:grid-cols-3">
            <div>
              <h3 className="font-semibold" style={{ color: PINK }}>Project Type</h3>
              <p className="mt-2 text-black">Interaction Design</p>
              <p className="text-black">Design System</p>
              <p className="text-black">Healthcare B2C</p>
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: PINK }}>My Role</h3>
              <p className="mt-2 text-black">UX Research</p>
              <p className="text-black">UXUI Design</p>
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: PINK }}>Time Length</h3>
              <p className="mt-2 text-black">May 2022 - Dec 2022</p>
            </div>
          </div>
        </Reveal>
      </C>

      <C className="mt-16 text-left">
        <Reveal>
          <h2 className="text-[32px] font-bold leading-snug text-black">
            Amid the saturated beauty e-commerce landscape and rising product return rates, how might we provide
            trustworthy guidance to alleviate decision fatigue and help customers navigate uncertainty about their
            needs?
          </h2>
        </Reveal>
      </C>

      {features.map((f) => (
        <Feature key={f.n} {...f} />
      ))}

      <C id="skinlab-discover" className="mt-24 text-left">
        <Reveal>
          <h2 className="text-[32px] font-bold text-black">Discover &amp; Define</h2>
        </Reveal>
      </C>

      <C className="mt-10 text-left">
        <Reveal>
          <h3 className="text-2xl font-semibold" style={{ color: PINK }}>Challenges in Today's Market</h3>
          <p className="mt-4 text-neutral-600">
            The Beauty industry in 2025 is still a growing powerhouse with +6.2% dollar growth across online
            channels. Yet, many people remain dissatisfied with their purchases. Why is that?
          </p>
          <img src={challengesChart} alt="Beauty industry growth chart" className="mt-8 w-[669px] max-w-full object-cover" />
        </Reveal>
      </C>

      <C className="mt-16 text-left">
        <Reveal>
          <h3 className="text-2xl font-semibold" style={{ color: PINK }}>Interviews</h3>
          <p className="mt-4 text-neutral-600">
            To explore the reasons behind consumer dissatisfaction, 47 beauty e-commerce users (38 women and 9 men,
            aged 20 to 43 with diverse skin conditions) were invited to discuss their shopping pain points and
            habits.
          </p>
          <img src={interviewMethod} alt="Interview method" className="mt-8 w-[362px] max-w-full object-cover" />
          <p className="mt-8 font-semibold text-black">"What are your in-store &amp; on-line shopping experiences?"</p>
          <div className="mt-6 flex items-start gap-5">
            <img src={quote1} alt="Interview participant" className="h-[98px] w-[98px] flex-none object-cover" />
            <p className="italic text-neutral-600">
              "It's frustrating to spend time researching ingredients and carefully choosing a product, only to
              discover it doesn't work for you. You feel like you did everything right, but now you're stuck
              returning it all over again."
            </p>
          </div>
          <div className="mt-6 flex items-start gap-5">
            <img src={quote2} alt="Interview participant" className="h-[98px] w-[98px] flex-none object-cover" />
            <p className="italic text-neutral-600">
              "I have 100 products in my wishlist and can't decide which one to buy. Everyone recommends 'great
              products,' but are they actually right for me?"
            </p>
          </div>
        </Reveal>
      </C>

      <C className="mt-16 text-left">
        <Reveal>
          <h3 className="text-2xl font-semibold" style={{ color: PINK }}>Affinity Wall</h3>
          <p className="mt-4 text-neutral-600">
            The affinity wall consolidated information from the interviews and revealed several recurring themes
            (on the left). These themes helped clarify the main concerns of users (on the right).
          </p>
          <img src={affinityWall} alt="Affinity wall" className="mx-auto mt-8 w-[703px] max-w-full object-cover" />
        </Reveal>
      </C>

      <C className="mt-16 text-left">
        <Reveal>
          <h3 className="text-2xl font-semibold" style={{ color: PINK }}>Personas</h3>
          <p className="mt-4 text-neutral-600">
            Through an in-depth analysis of consumer needs, two primary target customer groups emerged as requiring
            the most focus. These groups formed the foundation upon which the product MVPs would be developed.
          </p>
          <div className="mx-auto mt-8 grid w-[709px] max-w-full grid-cols-2 gap-[29px]">
            <img src={persona1} alt="Persona one" className="w-full object-cover" />
            <img src={persona2} alt="Persona two" className="w-full object-cover" />
          </div>
        </Reveal>
      </C>

      <C className="mt-16 text-left">
        <Reveal>
          <h3 className="text-2xl font-semibold" style={{ color: PINK }}>A Peek Into The Current Products</h3>
          <p className="mt-4 text-neutral-600">
            The personas revealed that the product detail page was the primary source of frustration and
            confusion.
          </p>
          <p className="mt-4 text-neutral-600">
            To address this, a competitor analysis of the three e-commerce platforms that were frequently used by
            the participants would provide valuable insights into gaps and areas needing improvement.
          </p>
          <img src={competitorAnalysis} alt="Competitor analysis" className="mx-auto mt-8 w-[722px] max-w-full object-cover" />
        </Reveal>
      </C>

      <C className="mt-16 text-left">
        <Reveal>
          <h3 className="text-2xl font-bold text-black">How might we alleviate decision fatigue?</h3>
          <h3 className="text-2xl font-bold text-black">How might we navigate uncertainty about customer needs?</h3>
          <img src={hmwStatements} alt="How might we statements" className="mt-8 w-[698px] max-w-full object-cover" />
        </Reveal>
      </C>

      <C id="skinlab-ideation" className="mt-24 text-left">
        <Reveal>
          <h2 className="text-[32px] font-bold text-black">Ideation</h2>
        </Reveal>
      </C>

      <C className="mt-10 text-left">
        <Reveal>
          <h3 className="text-2xl font-semibold" style={{ color: PINK }}>How MVPs were selected</h3>
          <p className="mt-4 text-neutral-600">
            The initial rough sketches of design opportunities helped refine and prioritize the MVP features.
          </p>
          <img src={mvpSketches} alt="MVP sketches" className="mx-auto mt-8 w-[701px] max-w-full object-cover" />
        </Reveal>
      </C>

      <C className="mt-16 text-left">
        <Reveal>
          <h3 className="text-2xl font-semibold" style={{ color: PINK }}>Wireframes</h3>
          <p className="mt-4 text-neutral-600">
            Final wireflows were selected based on A/B testing that focused on how user psychology influences
            interface design within the main features.
          </p>
          <img src={wireframes} alt="Wireframes" className="mx-auto mt-8 w-[721px] max-w-full object-cover" />
        </Reveal>
      </C>

      <C className="mt-16 text-left">
        <Reveal>
          <h3 className="text-2xl font-semibold" style={{ color: PINK }}>Design Guidelines</h3>
          <img src={designGuidelines} alt="Design guidelines" className="mx-auto mt-6 w-[714px] max-w-full object-cover" />
        </Reveal>
      </C>

      <C id="skinlab-reflections" className="mt-24 text-left">
        <Reveal>
          <h2 className="text-[32px] font-bold text-black">Reflections</h2>
          <h3 className="mt-8 text-2xl font-semibold" style={{ color: PINK }}>Results &amp; Feedback</h3>
          <p className="mt-4 text-neutral-600">
            For key feature usability testing, I revisited 47 interviewees and received responses from 45
            participants.
          </p>
          <p className="mt-4 text-neutral-600">
            During the tests, users rated the app on a scale from 1 to 5, with ratings of 4.5 or higher indicating
            satisfaction. The goal of this testing was to evaluate whether SKINLab effectively addresses the
            major pain points identified in competing products.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <img src={statIconLow} alt="" className="h-[98px] w-[98px] object-contain" />
              <p className="mt-4 text-xl font-bold text-black">12 out of 47 participants expressed satisfaction.</p>
              <p className="mt-2 text-sm text-neutral-500">
                Test result based on users' choices of their frequently used shopping app.
              </p>
            </div>
            <div>
              <img src={statIconHigh} alt="" className="h-[98px] w-[98px] object-contain" />
              <p className="mt-4 text-xl font-bold" style={{ color: GREEN }}>40 out of 45 participants expressed satisfaction.</p>
              <p className="mt-2 text-sm text-neutral-500">Test result based on Skinlab.</p>
            </div>
          </div>
        </Reveal>
      </C>

      <C className="mt-16 text-left">
        <Reveal>
          <h3 className="text-2xl font-semibold" style={{ color: PINK }}>Next Steps</h3>
          <p className="mt-4 text-neutral-600">
            The next step is to integrate the skin management and product comparison feature into existing
            e-commerce platforms as an add-on tool. This integration would involve embedding the feature as an
            optional tool on product pages or in the shopping cart, enabling users to compare products based on
            their unique skin needs. Additionally, leveraging APIs for data syncing and personalized recommendations
            will ensure a smooth, scalable experience.
          </p>
        </Reveal>
      </C>

      {/* Closing — full-bleed banner */}
      <Reveal className="mx-auto mt-8 max-w-[1240px]">
        <img src={nextSteps} alt="Next steps visual" className="w-full object-cover" />
      </Reveal>

      <Footer light />
    </div>
  )
}

export default Skinlab
