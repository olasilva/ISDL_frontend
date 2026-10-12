const P: Record<string, string> = {
  globe: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
  cart: 'M3 4h2l2.4 10h9.2L19 7H6M9 19.5a1 1 0 100 .01M16 19.5a1 1 0 100 .01',
  app: 'M3 5h18v14H3zM3 9h18M7 7h.01M10 7h.01M7 13h6M7 16h4',
  bot: 'M5 8h14v10H5zM12 4v4M9 13h.01M15 13h.01M3 12v3M21 12v3M9.5 16h5',
  chat: 'M4 20l1.3-4A8 8 0 118 18.7zM9 10h6M9 13h4',
  search: 'M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-5-5',
  left: 'M15 6l-6 6 6 6',
  right: 'M9 6l6 6-6 6',
  down: 'M6 9l6 6 6-6',
}
export default function Icon({ n, size = 24 }: { n: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {P[n].split('M').filter(Boolean).map((d, i) => <path key={i} d={'M' + d} />)}
    </svg>
  )
}
