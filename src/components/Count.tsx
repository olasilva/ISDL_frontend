import { useEffect, useRef, useState } from 'react'
export default function Count({ v }: { v: string }) {
  const n = parseInt(v), suf = v.replace(/\d/g, '')
  const [c, setC] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver(es => {
      if (!es[0].isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const step = (t: number) => { const k = Math.min((t - t0) / 1500, 1); setC(Math.round(n * (1 - Math.pow(1 - k, 3)))); if (k < 1) requestAnimationFrame(step) }
      requestAnimationFrame(step)
    })
    io.observe(el)
    return () => io.disconnect()
  }, [n])
  return <span ref={ref}>{c}{suf}</span>
}
