import heroBanner from '../assets/globbbe/hero-banner.png'
import iconArrow1 from '../assets/globbbe/icon-arrow-1.png'
import iconArrow2 from '../assets/globbbe/icon-arrow-2.png'
import iconUsp from '../assets/globbbe/icon-usp.png'
import findingChildren from '../assets/globbbe/finding-children.png'
import findingParents from '../assets/globbbe/finding-parents.png'
import findingInstructors from '../assets/globbbe/finding-instructors.png'
import keyTakeaway from '../assets/globbbe/key-takeaway.png'
import marketGap from '../assets/globbbe/market-gap.png'
import competitorAnalysis from '../assets/globbbe/competitor-analysis.png'
import decisionMatrix from '../assets/globbbe/decision-matrix.png'
import navSolution from '../assets/globbbe/nav-solution.png'
import navExplore from '../assets/globbbe/nav-explore.png'
import immersiveSolution from '../assets/globbbe/immersive-solution.png'
import immersiveExplore from '../assets/globbbe/immersive-explore.png'
import quizSolution from '../assets/globbbe/quiz-solution.png'
import quizExplore from '../assets/globbbe/quiz-explore.png'
import unlockSolution from '../assets/globbbe/unlock-solution.png'
import unlockExplore from '../assets/globbbe/unlock-explore.png'
import finalBulletIcon from '../assets/globbbe/final-bullet-icon.png'
import closingVisual from '../assets/globbbe/closing-visual.png'

import finalChooseEvent from '../assets/globbbe/videos/final-choose-event.mp4'
import finalMiniTasks from '../assets/globbbe/videos/final-mini-tasks.mp4'
import finalEarnPoints from '../assets/globbbe/videos/final-earn-points.mp4'
import finalCollaborativeQuiz from '../assets/globbbe/videos/final-collaborative-quiz.mp4'
import finalExplorePath from '../assets/globbbe/videos/final-explore-path.mp4'
import scenario1 from '../assets/globbbe/videos/scenario-1.mp4'
import scenario2 from '../assets/globbbe/videos/scenario-2.mp4'
import scenario3 from '../assets/globbbe/videos/scenario-3.mp4'

import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'
import { Video } from '../components/caseStudy'

const TEAL = '#1f7a7a'

const sideNav = [
  { label: 'Background', href: '#bg' },
  { label: 'Discover', href: '#discover-1' },
  { label: 'MVP Ideations', href: '#ideation' },
  { label: 'Final Designs', href: '#final-designs' },
]

const findings = [
  { img: findingChildren, text: 'Children find it difficult to engage in deep learnings.' },
  { img: findingParents, text: "Parents find that children often forget what they've learned and tend to quit after just 20 minutes." },
  { img: findingInstructors, text: 'Instructors find it challenging to explain cross-fields knowledge with the current learning platforms.' },
]

const ideationBlocks = [
  {
    title: 'Four Dimensional Navigation',
    description: 'The navigation is the core framework of Globbbe. It should intuitively connect pieces of information across time and around the globe, creating an experience that feels like time traveling.',
    solutionImg: navSolution,
    insight: 'The previous design allow users to study events by time sequence but not clear on presenting how the same event that involve over time. We want to able users to visualize relations of events that happen in different time periods clearly.',
    exploreImg: navExplore,
  },
  {
    title: 'Immersive Learning',
    description: 'The learning experience should be immersive, allowing users to feel self-exploratory while providing guidance.',
    solutionImg: immersiveSolution,
    insight: 'The previous design allowed users to receive learning materials in text format from a virtual avatar in a chat window. However, it causes unnecessary visual clutter that distracts users from the main interactions on the screen. We want to enable users to obtain the maximum amount of information while focusing on the immersive animation effects of the scenes.',
    exploreImg: immersiveExplore,
  },
  {
    title: 'Collaborative Quiz',
    description: "Quizzes can act as roadblocks and lead to disappointment if users don't earn points after long learning sessions. We aim to make them as enjoyable as possible.",
    solutionImg: quizSolution,
    insight: "The previous design required users to coordinate study times with peers, which could be time-consuming if their learning speeds differed. The individual quiz at the end felt isolating and added to users' stress. The adjusted flow below addresses occasional individual quizzes to reinforce memory and allow for easy point accumulation, while collaboration at the end reduces roadblocks and enables individuals to combine knowledge from different learning paths.",
    exploreImg: quizExplore,
  },
  {
    title: 'Unlocking More Globes',
    description: "When the entire learning path is complete, we want to give users a quick review of what they've learned before unlocking additional globes.",
    solutionImg: unlockSolution,
    insight: "The previous design displays users' learning paths on the globe but doesn't clearly show the sequence of events, weakening the storytelling that aligns with their study flow. We aim to strengthen users' personalized learning sequence to improve memory retention.",
    exploreImg: unlockExplore,
  },
]

const finalSteps = [
  { caption: 'Choose an event to begin your learning adventure.', video: finalChooseEvent },
  { caption: 'Challenge yourself with pop-up mini tasks throughout the learning journey.', video: finalMiniTasks },
  { caption: 'Earn points by collecting starts as you learn.', video: finalEarnPoints },
  { caption: 'Engage in collaborative quizzes with peers to enhance your learning.', video: finalCollaborativeQuiz },
  { caption: 'Explore your learning path and get ready to unlock the next globe.', video: finalExplorePath },
]

const scenarioVideos = [scenario1, scenario2, scenario3]

function SideNav() {
  return (
    <nav
      className="fixed left-6 top-1/3 z-40 hidden flex-col gap-3 text-sm font-medium lg:flex"
      style={{ color: TEAL }}
    >
      {sideNav.map((item) => (
        <a key={item.label} href={item.href} className="hover:opacity-70">
          {item.label}
        </a>
      ))}
    </nav>
  )
}

function IdeationBlock({ title, description, solutionImg, insight, exploreImg }) {
  return (
    <div className="mt-20">
      <h3 className="text-2xl font-bold text-black">{title}</h3>
      <p className="mt-4 text-neutral-600">{description}</p>

      <Reveal className="mt-8">
        <img src={solutionImg} alt={title} className="mx-auto w-full max-w-2xl rounded-2xl object-cover" />
      </Reveal>

      <div className="mx-auto mt-8 flex max-w-2xl items-start gap-3">
        <span className="text-2xl leading-none">💡</span>
        <p className="text-neutral-600">{insight}</p>
      </div>

      <Reveal className="mt-8">
        <img src={exploreImg} alt={`${title} previous design`} className="mx-auto w-full max-w-2xl rounded-2xl object-cover" />
      </Reveal>
    </div>
  )
}

function Globbbe() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <SideNav />

      <Reveal className="mt-6 overflow-hidden">
        <img src={heroBanner} alt="Globbbe" className="w-full object-cover" />
      </Reveal>

      <section id="bg" className="container-fluid mt-16 text-left">
        <Reveal>
          <h2 className="text-[32px] font-semibold" style={{ color: TEAL }}>What is Globbbe</h2>
          <p className="mt-4 text-neutral-600">
            Globbbe introduces an innovative visualization concept of "four-dimensional" navigation, where time
            becomes an integral dimension alongside space. It guides children through an immersive experience,
            allowing them to explore and learn about the world.
          </p>
          <h2 className="mt-10 text-[32px] font-semibold" style={{ color: TEAL }}>Our Mission</h2>
          <p className="mt-4 text-neutral-600">
            Our goal is to create a multidimensional knowledge web that connects information domains to show how
            complex subject and events influence each other comprehensively. We aim to bridge the gaps in other
            educational platforms by enhancing memory retention and fostering connections across different areas
            of knowledge.
          </p>
          <h2 className="mt-10 text-[32px] font-semibold" style={{ color: TEAL }}>Challenge</h2>
          <p className="mt-4 text-neutral-600">
            The design challenge is to present sleek four-dimensional visualizations on a 2D digital platform
            while creating a self-exploratory and collaborative learning environment.
          </p>
        </Reveal>

        <Reveal className="mt-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="font-semibold" style={{ color: TEAL }}>Project Type</h3>
              <p className="mt-2 text-black">Interaction Design</p>
              <p className="text-black">Game Design</p>
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: TEAL }}>My Role</h3>
              <p className="mt-2 text-black">UXUI Design Lead of a team of 8 designers.</p>
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: TEAL }}>Time Length</h3>
              <p className="mt-2 text-black">Jan 2024 - May 2024</p>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-16">
          <h2 className="text-[32px] font-bold text-black">Overview</h2>
          <p className="mt-4 text-neutral-600">
            Complex knowledge often spans multiple fields or disciplines. Existing education platforms tend to
            compartmentalize subjects rather than providing opportunities for interdisciplinary learning for
            children.
          </p>
          <p className="mt-4 text-neutral-600">
            This creates a gap when trying to draw connections between multifaceted ideas or systems, which is
            often essential for understanding complex knowledge.
          </p>
          <img src={iconArrow1} alt="" className="mx-auto mt-6 h-8 w-auto" />
          <p className="mt-6 text-neutral-600">
            Many existing tools still adhere to a traditional, linear learning model, where instructors upload
            materials and students follow a rigid course structure.
          </p>
          <img src={iconArrow2} alt="" className="mx-auto mt-6 h-10 w-auto" />
          <p className="mt-6 text-neutral-600">
            We aim to promote self-exploratory learning paths driven by meaningful interactions and collaborative
            experiences.
          </p>
          <img src={iconUsp} alt="" className="mx-auto mt-6 h-24 w-auto" />
          <p className="mt-6 text-neutral-600">
            Globeee's unique selling point is its ability to balance a gamified, immersive learning environment
            with rich educational content.
          </p>
          <h3 className="mt-10 text-2xl font-bold text-black">
            How might we address complex, cross-disciplinary topics while maximizing knowledge retention?
          </h3>
        </Reveal>
      </section>

      <section id="discover-1" className="container-fluid mt-24 text-left">
        <Reveal>
          <h2 className="text-[32px] font-bold text-black">Discover &amp; Define</h2>
        </Reveal>
      </section>

      <Reveal className="container-fluid mt-10 text-left">
        <h3 className="text-2xl font-semibold" style={{ color: TEAL }}>Interviews &amp; Key Findings</h3>
        <p className="mt-4 text-neutral-600">
          My team and I interviewed 47 children aged 6-12, along with one or both of their parents, as well as
          22 instructors from elementary and middle schools. Through these interviews, we identified common
          patterns in the challenges of learning new concepts and reviewing past material, as well as insights
          into the popular tools they use.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {findings.map((f) => (
            <div key={f.text}>
              <img src={f.img} alt={f.text} className="w-full rounded-2xl object-cover" />
              <p className="mt-3 text-neutral-600">{f.text}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className="container-fluid mt-16 text-left">
        <h3 className="text-2xl font-semibold" style={{ color: TEAL }}>Key Takeaway from User Interview</h3>
        <p className="mt-4 text-neutral-600">
          The interviewers all seemed satisfied with the platforms they had been using until they began
          discussing how quickly they drop off after about a month. This user journey reflects a key takeaway
          that the root cause is the fragmented information which prevents individuals from seeking patterns and
          connections among information.
        </p>
        <img src={keyTakeaway} alt="Key takeaway from user interview" className="mx-auto mt-8 w-full max-w-2xl rounded-2xl object-cover" />
      </Reveal>

      <Reveal className="container-fluid mt-16 text-left">
        <h3 className="text-2xl font-semibold" style={{ color: TEAL }}>Market Gap</h3>
        <p className="mt-4 text-neutral-600">
          By analyzing and categorizing the products mentioned by the interviewees based on the breadth of
          topics and whether they offer a closed or open learning path, we were able to identify the market gap
          that most educational platforms struggle to address.
        </p>
        <img src={marketGap} alt="Market gap matrix" className="mx-auto mt-8 w-full max-w-2xl rounded-2xl object-cover" />
        <p className="mt-8 text-neutral-600">
          We then analyzed four products positioned closer to the center of the axis, representing diverse
          product types, to identify effective features and current trends in educational platforms.
        </p>
        <img src={competitorAnalysis} alt="Competitor analysis" className="mx-auto mt-8 w-full max-w-2xl rounded-2xl object-cover" />
      </Reveal>

      <Reveal className="container-fluid mt-16 text-left">
        <h3 className="text-2xl font-bold text-black">
          So, how do we weave compelling narrative across topics to build up engaging learning?
        </h3>
        <p className="mt-4 text-neutral-600">
          At this stage, my team is brimming with ideas and inspiration. So I created a decision matrix to
          identify the MVP features (highlighted in red) that will move forward to the next phase of sketching.
        </p>
        <img src={decisionMatrix} alt="MVP decision matrix" className="mx-auto mt-8 w-full max-w-2xl rounded-2xl object-cover" />
      </Reveal>

      <section id="ideation" className="container-fluid mt-24 text-left">
        <Reveal>
          <h2 className="text-[32px] font-bold text-black">Ideations and Solutions</h2>
        </Reveal>
        {ideationBlocks.map((b) => (
          <IdeationBlock key={b.title} {...b} />
        ))}
      </section>

      <section id="final-designs" className="container-fluid mt-24 text-left">
        <Reveal>
          <h2 className="text-[32px] font-bold text-black">Final Designs</h2>
        </Reveal>

        {finalSteps.map((s) => (
          <Reveal key={s.caption} className="mt-14">
            <div className="mx-auto flex max-w-2xl items-center gap-3">
              <img src={finalBulletIcon} alt="" className="h-9 w-auto" />
              <p className="text-xl font-semibold text-black">{s.caption}</p>
            </div>
            <div className="mx-auto mt-6 max-w-2xl overflow-hidden rounded-2xl">
              <Video src={s.video} className="rounded-none" />
            </div>
          </Reveal>
        ))}

        <Reveal className="mt-20">
          <p className="mx-auto max-w-2xl text-xl font-semibold text-black">
            We offer more real-world scenarios. Learn as you travel the globe with us.
          </p>
          <div className="mt-8 flex flex-col items-center gap-8">
            {scenarioVideos.map((v, i) => (
              <div key={i} className="w-full max-w-2xl overflow-hidden rounded-2xl">
                <Video src={v} className="rounded-none" />
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <Reveal className="container-fluid mt-24 text-left">
        <h2 className="text-[32px] font-bold text-black">Reflection &amp; Learning</h2>
        <h3 className="mt-8 text-2xl font-semibold" style={{ color: TEAL }}>Globbbe's Impact</h3>
        <p className="mt-4 text-neutral-600">
          At Globbbe, we aim to educate children on how the evolution of humanity, civilization, and technology
          is intricately connected to a wide array of events and complex knowledge from all corners of the
          globe.
        </p>
        <p className="mt-4 text-neutral-600">
          Rather than delivering information in isolated fragments, Globbbe creates an interconnected web of
          knowledge that enables children to understand the relationships and conflicts between various events.
        </p>
        <p className="mt-4 text-neutral-600">
          Our goal is to cultivate critical thinking, adaptability, and teamwork skills in future learners. By
          offering a multidisciplinary teaching tool, Globbbe benefits young students, parents, educators, and
          educational institutions alike, fostering a richer and more engaging learning experience.
        </p>

        <h3 className="mt-10 text-2xl font-semibold" style={{ color: TEAL }}>What I've Learned</h3>
        <p className="mt-4 text-neutral-600">
          One of the biggest lessons I've learned is the importance of balancing creativity with practicality.
        </p>
        <p className="mt-4 text-neutral-600">
          We had to adapt to the situation when the team felt disappointed with the outcomes of usability tests,
          which didn't align with our expectations for the original design flows. I believe it's crucial to
          design based on honest data and to avoid letting personal biases influence our decisions.
        </p>
      </Reveal>

      <Reveal className="mt-12 overflow-hidden">
        <img src={closingVisual} alt="Globbbe closing visual" className="w-full object-cover" />
      </Reveal>

      <Footer light />
    </div>
  )
}

export default Globbbe
