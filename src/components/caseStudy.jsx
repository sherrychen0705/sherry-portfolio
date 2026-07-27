import { useEffect, useRef } from 'react'
import Reveal from './Reveal'

export function Video({ src, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {})
      },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      src={src}
      loop
      muted
      playsInline
      preload="auto"
      className={`w-full rounded-2xl object-cover ${className}`}
    />
  )
}

export function WindowFrame({ children, className = '' }) {
  return (
    <div className={`mx-auto w-full max-w-[1560px] overflow-hidden rounded-2xl border border-[#45454a] bg-[#202023] ${className}`}>
      <div className="flex items-center gap-1.5 border-b border-neutral-800 px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
      </div>
      {children}
    </div>
  )
}

export function Lines({ items }) {
  return (
    <div className="mt-4 flex flex-col gap-3 text-neutral-300">
      {items.map((t) => (
        <p key={t}>{t}</p>
      ))}
    </div>
  )
}

export function SectionLabel({ children, className = '', color = '#e3c9ff' }) {
  return (
    <p className={`text-sm font-semibold ${className}`} style={{ color }}>
      {children}
    </p>
  )
}

export function ExploreSolution({
  number,
  title,
  exploreText,
  exploreBullets,
  exploreMedia,
  solutionText,
  solutionBullets,
  solutionMedia,
  numberColor = '#bfff00',
  exploreColor = '#cc571d',
  solutionColor = '#58b320',
}) {
  return (
    <Reveal strong className="mt-16 rounded-3xl border border-[#45454a] bg-[#202023] p-8 text-left md:p-10">
      <h3 className="text-xl font-bold text-white">
        <span style={{ color: numberColor }}>{number}.</span> {title}
      </h3>
      <div className="mt-6 flex flex-col gap-8 md:flex-row md:gap-10">
        <div className="min-w-0 md:flex-1">
          <p className="text-xl font-bold" style={{ color: exploreColor }}>(Exploration)</p>
          {exploreText && <p className="mt-4 text-neutral-300">{exploreText}</p>}
          {exploreMedia && <div className="mt-6">{exploreMedia}</div>}
          {exploreBullets && <Lines items={exploreBullets} />}
        </div>
        <div className="hidden w-px shrink-0 self-stretch bg-neutral-700 md:block" />
        <div className="min-w-0 md:flex-1">
          <p className="text-xl font-bold" style={{ color: solutionColor }}>(Solution)</p>
          {solutionText && <p className="mt-4 text-neutral-300">{solutionText}</p>}
          {solutionMedia && <div className="mt-6">{solutionMedia}</div>}
          {solutionBullets && <Lines items={solutionBullets} />}
        </div>
      </div>
    </Reveal>
  )
}
