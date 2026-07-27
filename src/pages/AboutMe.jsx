import fan1 from '../assets/about/fan1.jpg'
import fan2 from '../assets/about/fan2.jpg'
import fan3 from '../assets/about/fan3.jpg'
import fan4 from '../assets/about/fan4.jpg'
import fan5 from '../assets/about/fan5.jpg'
import fan6 from '../assets/about/fan6.jpg'
import awardsGrid from '../assets/about/awards-grid.png'
import internHero from '../assets/about/intern-hero.jpg'
import laptopGroup from '../assets/about/laptop-group.jpg'
import mailIcon from '../assets/about/mail-icon.png'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'
import Carousel from '../components/Carousel'

const fanPhotos = [
  { src: fan1, rotate: '-rotate-6' },
  { src: fan2, rotate: '-rotate-3' },
  { src: fan3, rotate: 'rotate-0' },
  { src: fan4, rotate: 'rotate-2' },
  { src: fan5, rotate: 'rotate-4' },
  { src: fan6, rotate: 'rotate-6' },
]

function PhotoFan() {
  return (
    <div className="mt-16 flex justify-center pb-6">
      <div className="flex -space-x-8">
        {fanPhotos.map((p, i) => (
          <img
            key={i}
            src={p.src}
            alt=""
            className={`h-48 w-36 flex-none rounded-xl border-2 border-neutral-200 object-cover shadow-xl transition-all duration-300 ease-out ${p.rotate} hover:rotate-0 hover:scale-110 hover:z-10 hover:-translate-y-3`}
          />
        ))}
      </div>
    </div>
  )
}

function AboutMe() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      <header className="container-fluid pt-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-black">Hey again 😎</h1>
        <p className="mt-6 text-neutral-600 max-w-2xl mx-auto">
          I'm no stranger to design. I've worked at enterprise-level corporations, mid-sized design
          agencies, and fast-growing unicorn startups, tackling projects across UX, visual art, video
          editing, 3D prototyping, and marketing. While I'm now pursuing a career in UX/UI, my past
          experiences have equipped me with a range of transferable skills that shape the designer I am
          today.
        </p>
      </header>

      <Reveal>
        <PhotoFan />
      </Reveal>

      <h2 className="container-fluid mt-16 text-3xl font-bold text-black text-center">
        On my creative desk …
      </h2>

      <section className="container-fluid mt-12 grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <Reveal>
          <img
            src={awardsGrid}
            alt="International awards"
            className="w-full rounded-2xl object-cover aspect-[4/3]"
          />
        </Reveal>
        <Reveal className="text-left">
          <h3 className="text-2xl font-bold text-black">International Awards Team Lead</h3>
          <p className="mt-4 text-neutral-600">
            I feel a deep sense of pride and joy knowing that the work I create with my friends resonates
            with audiences around the world. Seeing our collaborative efforts exhibited internationally
            makes all the long hours and creative challenges feel truly worthwhile.
          </p>
        </Reveal>
      </section>

      <section className="container-fluid mt-16 grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <Reveal className="text-left md:order-1">
          <h3 className="text-2xl font-bold text-black">UX Design Intern at IPG Health</h3>
          <p className="mt-4 text-neutral-600">
            This summer, I worked as a UX Design Intern at one of the 50+ agencies within IPG Health, a
            global healthcare network providing full-service design and medical communications solutions
            worldwide. In addition to designing a B2B SaaS web platform and visual assets for pharmaceutical
            companies, I gained valuable experience navigating regulatory constraints while maintaining a
            commitment to pushing creative boundaries.
          </p>
        </Reveal>
        <Reveal className="md:order-2">
          <Carousel
            slides={[
              { src: internHero, alt: 'IPG Health project' },
              { src: fan5, alt: 'Team collaboration' },
            ]}
          />
        </Reveal>
      </section>

      <section className="container-fluid mt-16 grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <Reveal>
          <img
            src={laptopGroup}
            alt="Team working together"
            className="w-full rounded-2xl object-cover aspect-[4/3]"
          />
        </Reveal>
        <Reveal className="text-left">
          <h3 className="text-2xl font-bold text-black">What kind of designer am I?</h3>
          <p className="mt-4 text-neutral-600">
            One thing I might be prouder of than my actual designs is this little nugget of feedback I've
            gotten from teammates:{' '}
            <span className="italic text-neutral-700">
              "You're easy to work with, and we'd totally work with you again."
            </span>{' '}
            I've been lucky to team up with some amazing design pals along the way.
          </p>
        </Reveal>
      </section>

      <Footer light extraIcons={[{ src: mailIcon, alt: 'Email', href: '#' }]} />
    </div>
  )
}

export default AboutMe
