import heroBanner from '../assets/hiveai/hero-banner.jpeg'
import competitorAnalysis from '../assets/hiveai/competitor-analysis.jpg'
import zoomPhoto from '../assets/hiveai/discovery-stats.jpg'
import deskPhoto1 from '../assets/hiveai/interview-1.jpg'
import deskPhoto2 from '../assets/hiveai/interview-2.jpg'
import userNeeds from '../assets/hiveai/user-needs.jpg'
import journeyMap from '../assets/hiveai/pain-points.jpg'
import ecologicalDiagram from '../assets/hiveai/fatigue-steps.jpg'
import priorityGrid from '../assets/hiveai/ecological-1.jpg'
import flowDiagram from '../assets/hiveai/ecological-2.jpg'
import designHeader from '../assets/hiveai/design-header.jpg'
// import oldDesign1 from '../assets/hiveai/old-design-1.jpg' // hidden for now — uncomment to restore
import nodeSolution1 from '../assets/hiveai/node-solution-1.jpg'
import nodeSolution2 from '../assets/hiveai/node-solution-2.jpg'
import nodeSolution3 from '../assets/hiveai/node-solution-3.jpg'
import nodeSolution4 from '../assets/hiveai/node-solution-4.jpg'
import connectExplore1 from '../assets/hiveai/connect-explore-1.jpg'
import connectExplore2 from '../assets/hiveai/connect-explore-2.jpg'
import connectExplore3 from '../assets/hiveai/connect-explore-3.jpg'
import connectSolution1 from '../assets/hiveai/connect-solution-1.jpg'
import connectSolution2 from '../assets/hiveai/connect-solution-2.jpg'
import connectSolution3 from '../assets/hiveai/connect-solution-3.jpg'
import connectSolution4 from '../assets/hiveai/connect-solution-4.jpg'
import bridgeSolution from '../assets/hiveai/bridge-solution.jpg'
import panelExplore from '../assets/hiveai/panel-explore.jpg'
import panelSolution from '../assets/hiveai/panel-solution.jpg'
import visuals1 from '../assets/hiveai/visuals-1.jpg'
import visuals2 from '../assets/hiveai/visuals-2.jpg'
import visuals3 from '../assets/hiveai/visuals-3.jpg'
import moreProjectsGallery from '../assets/hiveai/whats-next.jpg'

import feature1 from '../assets/hiveai/videos/feature1.mp4'
import feature2 from '../assets/hiveai/videos/feature2.mp4'
import feature3 from '../assets/hiveai/videos/feature3.mp4'
import feature4 from '../assets/hiveai/videos/feature4.mp4'
import feature5 from '../assets/hiveai/videos/feature5.mp4'
import designNodeExplore from '../assets/hiveai/videos/design-node-explore.mp4'
import designConnect from '../assets/hiveai/videos/design-connect.mp4'
import designBridge1 from '../assets/hiveai/videos/design-bridge1.mp4'
import designBridge2 from '../assets/hiveai/videos/design-bridge2.mp4'
import designPanel from '../assets/hiveai/videos/design-panel.mp4'
import designVisuals1 from '../assets/hiveai/videos/design-visuals1.mp4'
import designVisuals2 from '../assets/hiveai/videos/design-visuals2.mp4'
import designVisuals3 from '../assets/hiveai/videos/design-visuals3.mp4'

import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'
import { Video, Lines, SectionLabel, ExploreSolution } from '../components/caseStudy'
import { useEffect, useState } from 'react'

const HIVE_NAV = [
  { id: 'bg', label: 'Background' },
  { id: 'feature-demo', label: 'Feature Demo' },
  { id: 'research', label: 'Research' },
  { id: 'concept', label: 'Design Concept' },
  { id: 'mvp-ideations', label: 'MVP Ideations' },
  { id: 'reflection', label: 'Reflection' },
]

function SectionNav() {
  const [active, setActive] = useState('bg')

  useEffect(() => {
    const onScroll = () => {
      const offset = 160
      let current = HIVE_NAV[0].id
      for (const s of HIVE_NAV) {
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
      {HIVE_NAV.map((s) => {
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
              className={`transition-colors group-hover:font-bold group-hover:text-white ${
                isActive ? 'font-bold text-white' : 'font-medium text-[#808080]'
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

const features = [
  {
    n: '01',
    title: 'Build From the Ground Up',
    desc: 'Begin creating node elements by dragging or uploading various types of materials, such as videos, voice recordings, links, and text, into an empty container on the freeform canvas.',
    video: feature1,
  },
  {
    n: '02',
    title: 'Co-Create with AI',
    desc: 'View node status, including information scarcity, disparity, and hierarchy, and discover new sources of inspiration by interacting with the intuitive panel.',
    video: feature2,
  },
  {
    n: '03',
    title: 'Smart Grouping',
    desc: 'When topics are identified as interconnected, data points can be regrouped, and color coding will automatically adjust to represent their union.',
    video: feature3,
  },
  {
    n: '04',
    title: 'Bridging Info Gap',
    desc: 'Use the side pane to explore recommended data points that can fill in the missing node connection. Positions and colors of new clusters will be automatically generated.',
    video: feature4,
  },
  {
    n: '05',
    title: 'Presentation and Discovery',
    desc: 'Transform each research project into infographics to showcase progress and findings while gaining insights into personal research and learning strengths across various topics.',
    video: feature5,
  },
]

const renovateCards = [
  {
    title: 'Steep Learning Curve',
    desc: 'Users face a steep learning curve due to the overly complex user interface, hindering efficient usage of the platform.',
  },
  {
    title: 'Lack of Growth Mindset',
    desc: 'AI-generated structures and content offer limited flexibility for changes, failing to foster a growth mindset, identify missing information, or spark inspiration.',
  },
  {
    title: 'Limited Flexibility for Complex Visuals',
    desc: '85% of existing AI tools cannot create or interpret complex data visualizations, which are essential for research and data analysis.',
  },
]

const competitorCards = [
  {
    title: 'Steep Learning Curve',
    desc: 'Users face a steep learning curve due to the overly complex user interface, hindering efficient usage of the platform.',
  },
  {
    title: 'Restricted Growth',
    desc: 'AI-generated structures and content offer limited flexibility for changes, failing to foster a growth mindset, identify missing information, or spark inspiration.',
  },
  {
    title: 'Inaccurate Keyword Filtering',
    desc: 'Filtering information using keywords is often inaccurate, which prolongs the process of finding relevant materials.',
  },
]

const painPointsList = [
  {
    n: '01',
    title: 'Over-reliance on AI',
    desc: 'Over-reliance on pre-set prompts for quick answers diminishes curiosity and ability to self explore, further leads to untrained minds.',
  },
  {
    n: '02',
    title: 'Fail to identify interconnections',
    desc: 'Difficulty adapting to knowledge web as a whole leads to lack of comprehensive understanding across topics.',
  },
  {
    n: '03',
    title: 'Challenges in Tracking Learning Progress',
    desc: 'Failure of seeing how thoughts evolve impedes reflection and motivation.',
  },
  {
    n: '04',
    title: 'Difficulties in presenting collective thoughts',
    desc: 'Time-consuming to create a visual representation of the entire research scope from multiple data perspectives.',
  },
]

function HiveAi() {
  return (
    <div className="hiveai-page min-h-screen bg-black">
      <NavBar />
      <SectionNav />

      <Reveal>
        <img src={heroBanner} alt="HIVE.ai" className="w-full object-cover" />
      </Reveal>

      <section id="bg" className="container-fluid mt-16 text-left">
        <Reveal>
          <h2 className="text-[32px] font-semibold text-[#e3c9ff]">What is HIVE.ai</h2>
          <p className="mt-4 text-neutral-300">
            Hive is a B2B desktop tool powered by large language model, designed to assist researchers and
            learners in organizing and visualizing thought processes. It bridges information gaps to spark
            inspiration and encourages users to independently explore ideas with subtle AI guidance.
          </p>
          <h2 className="mt-10 text-[32px] font-semibold text-[#e3c9ff]">Our Audience</h2>
          <p className="mt-4 text-neutral-300">
            Hive is primariliy designed for researchers who require tools to deeply explore, organize, and
            present their thought processes while expanding their knowledge network with accurate
            information.
          </p>
        </Reveal>
      </section>

      <Reveal className="container-fluid mt-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 text-left">
          <div>
            <h3 className="font-semibold text-[#e3c9ff]">Project Type</h3>
            <p className="mt-2 text-white">B2B</p>
            <p className="text-white">UXUI Design</p>
            <h3 className="mt-8 font-semibold text-[#e3c9ff]">Time Length</h3>
            <p className="mt-2 text-white">June 2024 - Jan 2025</p>
          </div>
          <div>
            <h3 className="font-semibold text-[#e3c9ff]">My Role</h3>
            <p className="mt-2 text-white">UXUI Design Lead</p>
            <p className="text-white">Marketing video creator</p>
            <h3 className="mt-8 font-semibold text-[#e3c9ff]">Team</h3>
            <p className="mt-2 text-white">2 UX Researchers, 2 Visual Designers</p>
            <p className="text-white">3 Developers</p>
          </div>
          <div>
            <h3 className="font-semibold text-[#e3c9ff]">Design Awards (so far)</h3>
            <p className="mt-2 text-white">2025 Red Dot Design Award</p>
            <p className="text-white">2025 A'Design Award</p>
            <p className="text-white">MUSE Design (Gold)</p>
            <p className="text-white">Indigo Design Award (Gold)</p>
          </div>
        </div>
      </Reveal>

      <Reveal className="container-fluid mt-16 text-left">
        <h2 className="text-[32px] font-semibold text-[#e3c9ff]">Product Hunt 2024</h2>
        <p className="mt-4 text-neutral-300">
          In 2024, our beta prototype got a 4/5 rating on "the best designed interface" for emerging AI
          tool.
        </p>
        {/* TODO: swap in the real Product Hunt review cards once we have the exact text */}
      </Reveal>

      <Reveal className="container-fluid mt-16 text-left">
        <h2 className="text-[32px] font-semibold text-[#e3c9ff]">
          Product Demo <span className="ml-2 text-sm italic font-normal text-neutral-500">Video creator: Huiyang Chen</span>
        </h2>
        <div className="mt-6 aspect-video w-full overflow-hidden rounded-2xl border border-neutral-800">
          <iframe
            className="h-full w-full"
            src="https://www.youtube.com/embed/EguNWqQxAso?iv_load_policy=3&rel=0&modestbranding=1&playsinline=1"
            title="HIVE.ai Product Demo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </Reveal>

      <Reveal className="container-fluid mt-16 text-left">
        <h2 className="text-[32px] font-semibold text-[#e3c9ff]">Background</h2>
        <p className="mt-4 text-neutral-300">
          According to a study by Oxford University, <span className="font-semibold text-emerald-400">76% of</span> researchers
          use AI tools in their work. However, <span className="font-semibold text-emerald-400">only 16%</span> of those tools
          are designed for research, learning and data visualization.
        </p>
      </Reveal>

      <section className="container-fluid mt-12 text-left">
        <h3 className="text-2xl font-semibold text-white">What we want to rennovate</h3>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {renovateCards.map((c) => (
            <Reveal key={c.title}>
              <h4 className="font-semibold text-white">{c.title}</h4>
              <p className="mt-2 text-neutral-500">{c.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {features.map((f) => (
        <section key={f.title} id={f.n === '01' ? 'feature-demo' : undefined} className="container-fluid mt-24 text-center">
          <Reveal>
            <SectionLabel className="text-center">Feature {f.n}</SectionLabel>
            <h3 className="mt-2 text-[32px] font-bold text-white">{f.title}</h3>
            <p className="mt-4 text-neutral-300 max-w-2xl mx-auto">{f.desc}</p>
          </Reveal>
          <Reveal strong className="mt-10">
            <Video src={f.video} className="mx-auto max-w-[1188px]" />
          </Reveal>
        </section>
      ))}

      <Reveal id="research" className="container-fluid mt-20 text-left">
        <h2 className="text-[32px] font-bold text-white">Research &amp; Discover</h2>
        <p className="mt-6 text-2xl font-semibold text-[#e3c9ff]">Competitor Analysis</p>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {competitorCards.map((c) => (
            <div key={c.title}>
              <h4 className="font-semibold text-white">{c.title}</h4>
              <p className="mt-2 text-neutral-500">{c.desc}</p>
            </div>
          ))}
        </div>
        <img src={competitorAnalysis} alt="Competitor analysis" className="mt-8 w-full rounded-2xl border border-neutral-800 object-cover" />
      </Reveal>

      <Reveal className="container-fluid mt-16">
        <div className="rounded-3xl border border-[#45454a] bg-[#202023] p-8 text-left md:p-12">
          <h3 className="text-[32px] font-bold text-white">Discovery</h3>
          <p className="mt-4 text-neutral-300">
            Our team conducted 35 semi-structured interviews with graduate researchers from top 50
            universities in the U.S., with 23 participants providing detailed walkthroughs of their current
            tools and research methods.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <blockquote className="rounded-2xl border border-[#45454a] bg-[#202023] p-6 italic text-neutral-300">
              "When I'm deep into research, I tend to focus on isolated pieces of information and{' '}
              <span className="text-[#e3c9ff] not-italic">miss the bigger picture of how everything ties together.</span>"
            </blockquote>
            <blockquote className="rounded-2xl border border-[#45454a] bg-[#202023] p-6 italic text-neutral-300">
              "I sometimes{' '}
              <span className="text-[#e3c9ff] not-italic">lose sight of how my initial thoughts transformed</span> as I dug
              deeper into the research. It feels like the process gets blurred."
            </blockquote>
          </div>
          <img src={zoomPhoto} alt="Zoom interview screenshots" className="mt-8 mx-auto max-w-md w-full object-cover" />
          <p className="mt-2 text-center text-xs text-neutral-500">(Zoom interview screenshots)</p>
          <p className="mt-8 text-neutral-300">
            Through observations from{' '}
            <span className="text-[#e3c9ff]">field research</span>, I discovered that their work space were
            set up <span className="text-[#e3c9ff]">in a modular way</span> that a different areas of the
            desk dedicates to a certain function. The intention was to{' '}
            <span className="text-[#e3c9ff]">
              see hierarchy in tasks and to categorize information into big chunks.
            </span>{' '}
            This helps them to improve memory retension.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <img src={deskPhoto1} alt="Annotated workspace photo" className="w-full rounded-2xl border border-neutral-800 object-cover" />
            <img src={deskPhoto2} alt="Annotated workspace photo" className="w-full rounded-2xl border border-neutral-800 object-cover" />
          </div>
        </div>
      </Reveal>

      <Reveal className="container-fluid mt-8">
        <div className="rounded-3xl border border-[#45454a] bg-[#202023] p-8 text-left md:p-12">
          <h3 className="text-[32px] font-bold text-white">Understanding User Needs</h3>
          <img src={userNeeds} alt="Understanding user needs" className="mt-6 w-full rounded-2xl border border-neutral-800 object-cover" />
          <p className="mt-8 font-semibold text-white">Main pain points</p>
          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
            {painPointsList.map((p) => (
              <div key={p.n}>
                <p className="text-[#e3c9ff] font-bold">{p.n}</p>
                <h4 className="mt-1 font-semibold text-white">{p.title}</h4>
                <p className="mt-2 text-neutral-500">{p.desc}</p>
              </div>
            ))}
          </div>
          <img src={journeyMap} alt="Research journey map" className="mt-8 w-full rounded-2xl border border-neutral-800 object-cover" />
          <p className="mt-2 text-xs text-neutral-500">(Yellow steps are the most likely to cause fatigue)</p>
        </div>
      </Reveal>

      <Reveal id="concept" className="container-fluid mt-16 text-left">
        <h2 className="text-[32px] font-bold text-white">Concept Development</h2>
      </Reveal>

      <Reveal className="container-fluid mt-6">
        <div className="rounded-3xl border border-[#45454a] bg-[#202023] p-8 md:p-12">
          <h3 className="text-2xl font-semibold text-[#e3c9ff] text-left">Ecological Thinking</h3>
          <div className="mt-6 grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <img src={ecologicalDiagram} alt="Ecological thinking diagram" className="w-full rounded-2xl border border-neutral-800 object-cover" />
            <div className="text-left">
              <p className="text-neutral-300">
                Ecological thinking means no single idea dominates for too long. When one idea takes up too
                much attention, we risk falling into cognitive biases, narrow thinking, or even harmful
                thought patterns. This can disrupt the balance of our thinking and limit our ability to
                explore new ideas.
              </p>
              <p className="mt-4 text-neutral-300">
                The goal for Hive.ai is to ecological thinking is to minimize bias as much as possible while
                encouraging divergent thinking and maintaining focus to ensure a healthy, balanced flow of
                ideas.
              </p>
            </div>
          </div>

          <h3 className="mt-12 text-2xl font-semibold text-[#e3c9ff] text-left">Features Map</h3>
          <p className="mt-4 text-neutral-300 text-left">
            After gathering insights from our research, my team and I brainstormed features to address user
            needs. We then prioritized them from high to low, which helped us identify the initial MVP.
          </p>
          <img src={priorityGrid} alt="Feature priority grid" className="mt-6 w-full rounded-2xl border border-neutral-800 object-cover" />
          <img src={flowDiagram} alt="Feature flow diagram" className="mt-6 w-full rounded-2xl border border-neutral-800 object-cover" />
        </div>
      </Reveal>

      <Reveal id="mvp-ideations" className="container-fluid mt-16">
        <h2 className="text-[32px] font-bold text-white text-left">Design</h2>
      </Reveal>

      <div className="container-fluid">
        <ExploreSolution
          number={1}
          title="Starting With a Node Element"
          exploreText="One of the biggest challenges is to ensure efficient material input to quickly build up knowledge assets."
          exploreMedia={<img src={designHeader} alt="Node design wireframe" className="w-full rounded-2xl border border-neutral-800 object-cover" />}
          exploreBullets={[
            'Tag-based information search nodes are very time-consuming to navigate to the target nodes.',
            'A clustered interface makes it very difficult to track information.',
            'An additional step is required to choose the type of node before inserting material.',
          ]}
          solutionText="Our solution is to offer freeform information containers that accommodate all input types—videos, images, text, and voice—minimizing the time required to input data into the correct entry point."
          solutionMedia={
            <div className="flex flex-col gap-4">
              <Video src={designNodeExplore} />
              {/* <img src={oldDesign1} alt="Node solution" className="w-1/2 rounded-2xl border border-neutral-800 object-cover" /> */}
            </div>
          }
          solutionBullets={[
            'Directly drag materials from your computer desktop or input them from any device.',
            'Encourage user-generated inputs instead of over-reliance on AI to initiate ideas.',
            'Supporting idea generation from any source boosts creativity and imagination.',
          ]}
        />

        <ExploreSolution
          number={2}
          title="Connecting Nodes"
          exploreText="Imagine having hundreds of data points with information scattered too widely to form meaningful connections."
          exploreMedia={
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <img src={nodeSolution1} alt="Connecting nodes reference" className="w-full rounded-xl border border-neutral-800 object-cover" />
              <img src={nodeSolution2} alt="Connecting nodes reference" className="w-full rounded-xl border border-neutral-800 object-cover" />
              <img src={nodeSolution3} alt="Connecting nodes reference" className="w-full rounded-xl border border-neutral-800 object-cover" />
              <img src={nodeSolution4} alt="Connecting nodes reference" className="w-full rounded-xl border border-neutral-800 object-cover" />
            </div>
          }
          exploreBullets={[
            'The industry-standard method of string-connecting nodes often turns data points into a visually overwhelming cluster, slowing down the process of targeting and grouping.',
            'Difficult to identify the information hierarchy when data points become complex.',
          ]}
          solutionText="The solution effectively visualizes connections while highlighting information priorities, scarcity, density, and disparity. Furthermore, it incorporates AI-driven support to generate new nodes, fostering inspiration and innovation."
          solutionMedia={
            <div className="flex flex-col gap-4">
              <Video src={designConnect} />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <img src={connectExplore1} alt="Connecting nodes solution" className="w-full rounded-xl border border-neutral-800 object-cover" />
                <img src={connectExplore2} alt="Connecting nodes solution" className="w-full rounded-xl border border-neutral-800 object-cover" />
                <img src={connectExplore3} alt="Connecting nodes solution" className="w-full rounded-xl border border-neutral-800 object-cover" />
              </div>
            </div>
          }
          solutionBullets={[
            'When zoomed out, the rectangular nodes with detailed information transform into hexagons, providing a quick overview of the scope and making it easier to find information.',
            'The hexagon shape represent solid, expandable connections that can easily attach to similar topics, regroup, or detach.',
          ]}
        />

        <ExploreSolution
          number={3}
          title="Bridging info gaps"
          exploreText="Tracking the progress of thinking has been one of the most valuable processes in research. Finding the missing data pieces will strengthen the knowledge web and improve memory retention."
          exploreMedia={
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <img src={connectSolution1} alt="Bridging info gaps reference" className="w-full rounded-xl border border-neutral-800 object-cover" />
              <img src={connectSolution2} alt="Bridging info gaps reference" className="w-full rounded-xl border border-neutral-800 object-cover" />
              <img src={connectSolution3} alt="Bridging info gaps reference" className="w-full rounded-xl border border-neutral-800 object-cover" />
              <img src={connectSolution4} alt="Bridging info gaps reference" className="w-full rounded-xl border border-neutral-800 object-cover" />
            </div>
          }
          exploreBullets={[
            'Using pop-up screens not only requires many clicks but also distracts from the visual when there are hundreds of nodes in the background.',
            'Not giving users the option to choose the bridge outcome or providing too many filtering steps can result in either limited research or an unnecessarily complicated flow.',
          ]}
          solutionText="The solution is to present an animated bridging process that shows how ideas are merged and evolved."
          solutionMedia={
            <div className="grid grid-cols-1 gap-4">
              <Video src={designBridge1} />
              <Video src={designBridge2} />
            </div>
          }
          solutionBullets={[
            'Clearly present to users where the bridging will take place by encouraging them to review the content that needs to be operated on.',
            'Provide alternative recommended bridging points in the side AI panel for users to browse and choose from.',
          ]}
        />

        <ExploreSolution
          number={4}
          title="Understanding AI Panels"
          exploreText="Research indicates that many AI tools experience low user return rates due to prolonged learning curves, often caused by overly complex panels. Since panel content must adapt dynamically to different statuses, transforming complex information into clear and intuitive visuals becomes an even greater challenge. While the visual adjustment bar effectively conveys information hierarchy, displaying excessive information can lead to confusion."
          exploreMedia={<img src={bridgeSolution} alt="AI panel reference" className="w-full rounded-2xl border border-neutral-800 object-cover" />}
          exploreBullets={[
            'The initial idea was to include all AI-supported functions in the panel for every user condition. However, this approach turned the panel into a text-heavy interface, requiring excessive scrolling.',
          ]}
          solutionText="The final approach focused on offering a deeper understanding of potential explorations within a single node and connections among information clusters, all while maintaining visual consistency."
          solutionMedia={
            <div className="flex flex-col gap-4">
              <img src={panelExplore} alt="AI panel solution" className="w-full rounded-2xl border border-neutral-800 object-cover" />
              <Video src={designPanel} />
            </div>
          }
          solutionBullets={[
            "Conversational AI was included but not heavily emphasized at the start of the research, as the tool's primary goal is to spark original ideas. As a result, the chatbox is positioned discreetly at the bottom of the panel.",
            'Information sparsity, density, and scarcity are calculated for each node to represent the information hierarchy. This helps inform the user of how closely the current node relates to the primary research topic.',
            'Recommended information and detected missing information can be directly added to the canvas as new nodes.',
            'When a node is clicked, the panel gently slides into the canvas from the right. The panel can also be accessed by clicking the HIVE logo in the bottom navigation bar.',
          ]}
        />

        <ExploreSolution
          number={5}
          title="Presenting with alternative visuals"
          exploreText="Based on previous user interviews, many researchers expressed that presenting discovery outcomes has been a significant challenge, as extracting key data from long-term projects can be time-consuming. Therefore, the final challenge was to create alternative visuals that facilitate both presenting and self-learning, illustrating how ideas evolve across multiple dimensions and scales."
          exploreMedia={<img src={panelSolution} alt="Alternative visuals reference" className="w-full rounded-2xl border border-neutral-800 object-cover" />}
          exploreBullets={[
            'The timeline mapping successfully captures how ideas evolve while presenting the density and importance of each data point. However, the zoomed-in view can become overwhelming when information overlaps.',
            'Extracting key information is already exhausting, and requiring multiple steps to adjust visuals can make it even more tiring. Offering users too many options for data adjustments can slow down the final refinement of key ideas.',
          ]}
          solutionText="The solution is to offer various data visualizations with built-in view modes, enabling users to switch between a presentation mode that highlights how ideas evolved and their information hierarchy, and a self-discovery mode that reveals how many ideas are AI-assisted versus original."
          solutionMedia={
            <div className="flex flex-col gap-4">
              <Video src={designVisuals1} />
              <Video src={designVisuals2} />
              <Video src={designVisuals3} />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <img src={visuals1} alt="Visuals" className="w-full rounded-xl border border-neutral-800 object-cover" />
                <img src={visuals2} alt="Visuals" className="w-full rounded-xl border border-neutral-800 object-cover" />
                <img src={visuals3} alt="Visuals" className="w-full rounded-xl border border-neutral-800 object-cover" />
              </div>
            </div>
          }
          solutionBullets={[
            'When view modes are switched, the dimension levels of height, size, and length are adjusted to represent different types of information.',
            'Users can easily select the nodes they want to curate visuals for and generate diverse visualizations in seconds. The system will recommend the most suitable mapping for their data inputs, facilitating efficient presentation and discovery.',
            'More visuals are under exploration.',
          ]}
        />
      </div>

      <Reveal id="reflection" className="container-fluid mt-20 grid grid-cols-1 gap-8 text-left md:grid-cols-2">
        <div>
          <h2 className="text-[32px] font-bold text-white">Impact and Outcome</h2>
          <h3 className="mt-6 text-2xl font-semibold text-[#e3c9ff]">User-Driven Design Process</h3>
          <p className="mt-4 text-neutral-300">
            One of the key takeaways was the importance of user feedback and iterative design. Conducting
            usability tests with target users has been crucial for B2B product designs, as each feature
            development requires a deep understanding of the specific challenges faced by stakeholders and
            identifying market gaps.
          </p>
          <p className="mt-4 text-neutral-300">
            Navigating through uncertainty and making informed decisions, both individually and as a group,
            was a significant growth experience.
          </p>
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-[#e3c9ff]">What's Next</h3>
          <p className="mt-4 text-neutral-300">
            Looking ahead, we envision expanding the reach of our solution through the development of
            extensions that can absorb information from existing research papers to generate data points.
          </p>
          <p className="mt-4 text-neutral-300">
            We also look forward to diversifying our team by bringing in more engineers and psychologists to
            help develop a more comprehensive HIVE family. With a diverse team, we can benefit from a range
            of skill sets and backgrounds, providing us with unique insights.
          </p>
        </div>
      </Reveal>

      <Reveal className="mt-12 overflow-hidden">
        <img src={moreProjectsGallery} alt="More HIVE.ai project visuals" className="w-full object-cover" />
      </Reveal>

      <Footer />
    </div>
  )
}

export default HiveAi
