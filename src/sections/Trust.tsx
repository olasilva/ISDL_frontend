// src/sections/Trust.tsx

const TECH = [
  { name: 'React', icon: 'bx bxl-react' },
  { name: 'Node.js', icon: 'bx bxl-nodejs' },
  { name: 'TypeScript', icon: 'bx bxl-typescript' },
  { name: 'Python', icon: 'bx bxl-python' },
  { name: 'TensorFlow', icon: 'bx bxl-tensorflow' },
  { name: 'SQL', icon: 'bx bx-data' },
  { name: 'Supabase', icon: 'bx bx-cloud' },
  { name: 'Vite', icon: 'bx bxl-vitejs' },
  { name: 'Tailwind', icon: 'bx bxl-tailwind-css' },
  { name: 'MongoDB', icon: 'bx bxl-mongodb' },
];

export default function Trust() {
  // Duplicate the list so the marquee loops seamlessly
  const looped = [...TECH, ...TECH];

  return (
    <div className="trust-marquee" aria-label="Tech stack">
      <div className="trust-marquee-track">
        {looped.map((t, i) => (
          <span className="trust-marquee-item" key={`${t.name}-${i}`}>
            <i className={t.icon} aria-hidden="true" />
            {t.name}
          </span>
        ))}
      </div>
    </div>
  );
}