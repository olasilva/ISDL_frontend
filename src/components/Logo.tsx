export function Mark({ s = 34 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 6 54 19v26L32 58 10 45V19Z" fill="#ffc83d" />
      <path d="M32 18 44.5 25.5 32 33 19.5 25.5Z" fill="#0a1b33" />
      <path d="M19.5 25.5 32 33v15l-12.5-7.5Z" fill="#0a1b33" fillOpacity=".7" />
      <path d="M32 33l12.5-7.5v15L32 48Z" fill="#0a1b33" fillOpacity=".45" />
    </svg>
  )
}
export function Logo() {
  return (
    <a className="logo" href="#/" aria-label="ISDL home">
      <Mark />
      <span><b>ISDL</b><small>Built . Better</small></span>
    </a>
  )
}
