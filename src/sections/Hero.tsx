import { useEffect, useState } from 'react'
import Icon from '../components/Icon'
import { go } from '../lib/utils'
import { SLIDES } from '../data/content'

export default function Hero() {
  const [i, setI] = useState(0)
  const n = SLIDES.length
  useEffect(() => { const t = setInterval(() => setI(v => (v + 1) % n), 8000); return () => clearInterval(t) }, [n, i])
  const s = SLIDES[i]
  return (
    <header className="hero" id="top">
      <div className="hero-img" aria-hidden="true" />
      <button className="arrow l" aria-label="Previous slide" onClick={() => setI((i + n - 1) % n)}><Icon n="left" size={16} /></button>
      <div className="wrap">
        <div className="slide" key={i}>
          <span className="eyebrow"><i />{s.eyebrow}</span>
          <h1>{s.title}</h1>
          <p>{s.text}</p>
          <div className="row">
            <button className="btn" onClick={() => go('services')}>Discover more</button>
            <button className="link" onClick={() => go('contact')}>Get a quote</button>
          </div>
        </div>
      </div>
      <button className="arrow r" aria-label="Next slide" onClick={() => setI((i + 1) % n)}><Icon n="right" size={16} /></button>
    </header>
  )
}
