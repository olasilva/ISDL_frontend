export const PHONE = '2348136319393'
export const MAIL = 'olasilvaolunleke@gmail.com'

export const SERVICES = [
  { icon: 'globe', title: 'Business Websites', text: 'Fast, mobile-first sites that make your brand look credible and bring in customers.' },
  { icon: 'cart', title: 'Online Stores', text: 'Catalogues, carts and local payment integration so you can sell around the clock.' },
  { icon: 'app', title: 'Web Apps & Dashboards', text: 'Custom tools, booking systems and admin panels built around how you work.' },
  { icon: 'bot', title: 'AI & Automation', text: 'Chatbots, smart forms and data features that save hours every week.' },
] as const

export const STATS = [['4+', 'Years of experience'], ['40+', 'Projects delivered'], ['6+', 'Live apps maintained']] as const
export const STEPS = ['Discovery call', 'Proposal & price', 'Design & build', 'Launch & support']

export const WORK = [
  { title: 'Temporary Plate Number App', text: 'Registration cut from 3 days to under 2 minutes.', url: 'https://tpn-react.vercel.app/' },
  { title: 'AI Resume Builder', text: 'Keyword-optimised resumes for job seekers.', url: 'https://find-resumebuilder-ai.vercel.app/' },
  { title: 'CBT Testing Platform', text: '1,000+ concurrent users with live analytics.', url: '' },
  { title: 'Query Bot', text: 'NLP chatbot handling 10K+ daily queries.', url: '' },
]

export const SLIDES = [
  { eyebrow: 'Business made easy', title: 'Websites that work as hard as you do.', text: 'From a first landing page to a full custom platform, we design, build and maintain digital products for businesses and individuals.' },
  { eyebrow: 'Online stores', title: 'Sell around the clock with local payments.', text: 'Catalogues, carts and Nigerian payment gateways, built mobile-first and ready to grow with your business.' },
  { eyebrow: 'Web apps & AI', title: 'Custom tools that save you hours every week.', text: 'Booking systems, dashboards, chatbots and automation built around the way your team actually works.' },
]

export const PACKAGES = [
  { name: 'Starter', note: 'Landing page or portfolio', items: ['1-5 pages', 'Mobile-first design', 'Contact form', 'Basic SEO'] },
  { name: 'Business', note: 'Best for growing companies', items: ['Up to 12 pages', 'Custom branding', 'Admin dashboard', 'Analytics & SEO', '1 month support'] },
  { name: 'Custom', note: 'Web apps & online stores', items: ['Custom features', 'Payments & integrations', 'Database & user login', 'Ongoing maintenance'] },
]

export const QA = [
  ['How long does a website take?', 'Landing pages usually take 1-2 weeks. Larger sites and web apps take 4-8 weeks depending on scope.'],
  ['How is pricing decided?', 'We scope your goals and pages, then send a fixed-price proposal with no hidden costs.'],
  ['Do you offer support after launch?', 'Yes. Every project includes a support period, and monthly maintenance plans are available.'],
  ['Will my site work on phones?', 'Always. Every site is designed mobile-first and tested across screen sizes.'],
  ['Can you integrate payments?', 'Yes, including popular Nigerian payment gateways.'],
]

export const WHY = [
  ['Clear milestones', 'Weekly progress updates so you always know where your project stands.'],
  ['Secure by default', 'HTTPS, validated forms and careful data handling in every project.'],
  ['Mobile-first', 'Designed for the phone first, then scaled up for tablets and desktops.'],
  ['Transparent pricing', 'A fixed-price proposal before we start, with no hidden costs.'],
]

export const TECH = ['React', 'Node.js', 'TypeScript', 'Python', 'TensorFlow', 'SQL', 'Supabase']

export const LEGAL: Record<string, [string, string[]]> = {
  privacy: ['Privacy Policy', [
    'We collect only what you send us through our forms: your name, email, phone number, project details and, for reviews, your name and comments.',
    'We use this information to reply to you, scope and deliver projects, and publish approved reviews. We never sell your data.',
    'This site does not use advertising cookies or third-party tracking.',
    `You may ask us to access, correct or delete your data at any time by emailing ${MAIL}.`]],
  terms: ['Terms of Service', [
    'Projects start once a written proposal is accepted and any agreed deposit is paid.',
    'Quotes are fixed for the scope described. Changes to scope may change the price and timeline, agreed in writing first.',
    'Ownership of final deliverables transfers to you on full payment. We may show completed work in our portfolio unless you ask us not to.',
    'Each project includes a support period stated in your proposal. Ongoing maintenance is available separately.',
    'These terms are governed by the laws of the Federal Republic of Nigeria.']],
}
