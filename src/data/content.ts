// src/data/content.ts

// ---------- Contact Info ----------
export const MAIL = 'info@isdl.tech';
export const PHONE = '+16625456734';
export const PHONE_DISPLAY = '+1 662 545-6734';

// ---------- Navigation ----------
export const NAV = [
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#work' },
  { label: 'Packages', href: '#packages' },
  { label: 'FAQ', href: '#faq' },
];

// ---------- Recent Work ----------
export const WORK = [
  {
    title: 'Temporary Plate Number App',
    text: 'Registration cut from 3 days to under 2 minutes.',
    url: '',
  },
  {
    title: 'AI Resume Builder',
    text: 'Keyword-optimised resumes for job seekers.',
    url: '',
  },
  {
    title: 'CBT Testing Platform',
    text: '1,000+ concurrent users with live analytics.',
    url: '',
  },
  {
    title: 'Query Bot',
    text: 'NLP chatbot handling 10K+ daily queries.',
    url: '',
  },
  {
    title: 'E-Commerce Platform',
    text: 'Full-stack store with global payment integration and inventory management.',
    url: '',
  },
  {
    title: 'Logistics Tracking Dashboard',
    text: 'Real-time shipment tracking with map view for fleet managers.',
    url: '',
  },
  {
    title: 'Healthcare Booking System',
    text: 'Appointment scheduling with SMS reminders and admin dashboard.',
    url: '',
  },
  {
    title: 'School Management Portal',
    text: 'Student records, grades, and parent communication in one place.',
    url: '',
  },
];

// ---------- Services ----------
export const SERVICES = [
  {
    icon: 'bx-code-alt',
    title: 'Web Development',
    text: 'Custom websites and web apps built with modern, proven technology — fast, scalable, and mobile-first.',
  },
  {
    icon: 'bx-cart',
    title: 'E-Commerce',
    text: 'Online stores with global payment gateways, inventory management, and analytics built in.',
  },
  {
    icon: 'bx-mobile',
    title: 'Mobile-First Design',
    text: 'Interfaces designed for phones first, then scaled up beautifully for tablets and desktops.',
  },
  {
    icon: 'bx-brain',
    title: 'AI & Automation',
    text: 'Chatbots, workflow automation, and AI-powered features that save time and reduce costs.',
  },
  {
    icon: 'bx-line-chart',
    title: 'SEO & Performance',
    text: 'Sites engineered to load fast and rank well, with clean code and optimised assets.',
  },
  {
    icon: 'bx-shield',
    title: 'Maintenance & Support',
    text: 'Ongoing updates, security patches, and support so your site always runs smoothly.',
  },
];

// ---------- Process ----------
export const PROCESS = [
  {
    step: '01',
    title: 'Discovery',
    text: 'We learn about your business, goals, and target audience.',
  },
  {
    step: '02',
    title: 'Design',
    text: 'We craft wireframes and visual designs for your approval.',
  },
  {
    step: '03',
    title: 'Build',
    text: 'We develop your site with clean, tested, production-ready code.',
  },
  {
    step: '04',
    title: 'Launch',
    text: 'We deploy, monitor, and hand over — with training included.',
  },
];

// ---------- Why Us ----------
export const WHY = [
  'Mobile-first, always',
  'Global payment integrations',
  'Clean, maintainable code',
  'Fast load times',
  'Ongoing support',
  'Transparent pricing',
];

// ---------- Packages ----------
export const PACKAGES = [
  {
    name: 'Starter',
    price: 'From $499',
    features: [
      'Up to 5 pages',
      'Mobile-responsive',
      'Contact form',
      'Basic SEO',
      '2 weeks delivery',
    ],
    featured: false,
  },
  {
    name: 'Business',
    price: 'From $1,299',
    features: [
      'Up to 15 pages',
      'Custom design',
      'CMS integration',
      'Global payment gateway',
      'Advanced SEO',
      '3–4 weeks delivery',
    ],
    featured: true,
  },
  {
    name: 'Custom',
    price: "Let's talk",
    features: [
      'Unlimited pages',
      'Web app features',
      'AI / automation',
      'Full e-commerce',
      'Priority support',
      'Timeline: scoped',
    ],
    featured: false,
  },
];

// ---------- FAQ ----------
export const FAQ = [
  {
    q: 'How long does a project take?',
    a: 'Most websites take 2–6 weeks depending on complexity. We give you a firm timeline before we start.',
  },
  {
    q: 'Do you work with clients outside Nigeria?',
    a: 'Yes — we work with clients worldwide and accept global payments.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept global payment gateways including Stripe, PayPal, and Paystack.',
  },
  {
    q: 'Do you offer ongoing support?',
    a: 'Yes. All projects come with 30 days of free support, and we offer monthly maintenance plans.',
  },
  {
    q: 'Can you redesign my existing website?',
    a: 'Absolutely. We can refresh the design, improve performance, or rebuild from scratch — your choice.',
  },
  {
    q: 'How do we get started?',
    a: "Send us a message via the contact form or WhatsApp. We'll reply within 24 hours.",
  },
];

// ---------- Legal Content ----------
export const LEGAL = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'Last updated: January 2025',
    body: `We respect your privacy and are committed to protecting your personal data.

What we collect:
- Name, email, phone number, and project details you submit via our contact form.
- Basic analytics data (pages visited, time on site) to improve our services.

How we use it:
- To respond to your enquiry and provide our services.
- To send updates only if you opt in.

We never sell your data to third parties. Data is stored securely using Supabase and accessed only by authorised personnel.

Contact us at info@isdl.tech for any privacy-related questions.`,
  },
  terms: {
    title: 'Terms of Service',
    updated: 'Last updated: January 2025',
    body: `By using this website and our services, you agree to the following terms:

Services:
- We provide web design, development, and maintenance services as agreed in writing before project start.
- Timelines and deliverables are confirmed in a project scope document.

Payment:
- 50% deposit required before work begins; balance due on delivery.
- We accept global payment gateways including Stripe, PayPal, and Paystack.

Ownership:
- Upon full payment, you own the code and content delivered.
- We retain the right to display the completed work in our portfolio unless agreed otherwise.

Liability:
- Our liability is limited to the fees paid for the service.

Contact us at info@isdl.tech for any questions.`,
  },
};