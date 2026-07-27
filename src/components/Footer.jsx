import linkedinIcon from '../assets/home/linkedin-icon.png'

function Footer({ extraIcons = [], light = false }) {
  return (
    <footer className="container-fluid mt-24 pb-16 text-left">
      <h2 className={`text-2xl md:text-3xl font-bold ${light ? 'text-neutral-900' : 'text-white'}`}>
        Let's talk about the impact we'd like to make together 👋.
      </h2>
      <div className="mt-6 flex items-center gap-3">
        <a
          href="https://www.linkedin.com/in/huiyangchen/"
          target="_blank"
          rel="noreferrer"
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            light ? 'bg-neutral-100' : 'bg-neutral-800'
          }`}
        >
          <img src={linkedinIcon} alt="LinkedIn" className={`h-5 w-5 ${light ? 'invert' : ''}`} />
        </a>
        {extraIcons.map((icon) => (
          <a
            key={icon.alt}
            href={icon.href}
            target="_blank"
            rel="noreferrer"
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              light ? 'bg-neutral-100' : 'bg-neutral-800'
            }`}
          >
            <img src={icon.src} alt={icon.alt} className={`h-5 w-5 ${light ? 'invert' : ''}`} />
          </a>
        ))}
      </div>
      <p className={`mt-10 text-xs ${light ? 'text-neutral-400' : 'text-neutral-500'}`}>@ HUIYANG CHEN 2026 All Rights Reserved.</p>
    </footer>
  )
}

export default Footer
