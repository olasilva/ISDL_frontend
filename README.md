# ISDL website (React + TypeScript + Vite)

    npm install
    npm run dev        # http://localhost:5173
    npm run build      # outputs dist/

## Structure
    src/
      pages/Home.tsx          public site (assembles sections)
      sections/               Hero, Trust, Services, Process, Work, Why, Packages, Updates, Reviews, FAQ, Contact
      components/             Navbar, Footer, Logo, Icon, Field, Count, Legal, Extras
      admin/                  admin app, kept apart from the public site
        AdminApp.tsx, Login.tsx
        sections/             Inbox, PostUpdates, Outreach, ReviewsAdmin
      data/content.ts         all site copy, services, packages, FAQ
      lib/                    db.ts (data layer), auth.ts, utils.ts
    public/hero.jpg           (optional) drop your hero photo here

Admin lives at `/#/admin` (footer link "Admin login").

## Data and login
- Demo mode (no `.env`): messages, reviews and updates are stored in the browser's localStorage. Admin password comes from `VITE_ADMIN_PASSWORD`. This is NOT secure for production.
- Production: create a Supabase project, run `supabase.sql`, create your owner user under Authentication > Users, then copy `.env.example` to `.env` and fill in the URL and anon key. Admin then signs in with Supabase Auth and visitors can only submit messages and reviews.
