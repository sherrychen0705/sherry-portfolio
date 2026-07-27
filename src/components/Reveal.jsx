import { useEffect, useRef, useState } from 'react'

function Reveal({ children, className = '', strong = false, id, delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const duration = strong ? 'duration-[1100ms]' : 'duration-[900ms]'
  const hidden = strong ? 'opacity-0 translate-y-20' : 'opacity-0 translate-y-10'

  return (
    <div
      ref={ref}
      id={id}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`transition-all ${duration} ease-[cubic-bezier(0.22,1,0.36,1)] ${
        visible ? 'opacity-100 translate-y-0' : hidden
      } ${className}`}
    >
      {children}
    </div>
  )
}

export default Reveal
