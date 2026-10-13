// src/sections/Contact.tsx
import { useState, type FormEvent } from 'react';
import Field from '../components/Field';
import { useForm } from '../hooks/useForm';
import { openLegal, wa } from '../lib/utils';
import { MAIL, PHONE } from '../data/content';
import api from '../lib/api';

const blank = {
  name: '',
  email: '',
  phone: '',
  type: 'Business website',
  body: '',
};

export default function Contact() {
  const { f, bind, reset } = useForm(blank);
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    setDone(false);

    try {
      const messageParts = [`Project type: ${f.type}`];
      if (f.phone) messageParts.push(`Phone: ${f.phone}`);
      messageParts.push('', f.body);

      await api.post('/inbox', {
        name: f.name,
        email: f.email,
        message: messageParts.join('\n'),
      });

      reset();
      setDone(true);
    } catch (err: any) {
      console.error('Contact form error:', err.response?.data || err.message);
      setError(
        err.response?.data?.error ||
          'Could not send message. Please try WhatsApp or email instead.'
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="alt-bg">
      <div className="wrap">
        <h2>Tell us about your project</h2>
        <p className="sub">
          We reply within 24 hours (Mon–Fri, WAT / GMT+1). Prefer chat?{' '}
          <a
            href={wa(PHONE, 'Hi, I would like a website.')}
            target="_blank"
            rel="noopener noreferrer"
            className="lnk"
          >
            WhatsApp us
          </a>{' '}
          or email{' '}
          <a href={`mailto:${MAIL}`} className="lnk">
            {MAIL}
          </a>
          .
        </p>

        <form className="card" onSubmit={submit} style={{ maxWidth: 640 }}>
          <div className="two">
            <Field label="Name">
              <input required {...bind('name')} />
            </Field>
            <Field label="Email">
              <input required type="email" {...bind('email')} />
            </Field>
          </div>

          <div className="two">
            <Field label="Phone / WhatsApp">
              <input {...bind('phone')} />
            </Field>
            <Field label="I need">
              <select {...bind('type')}>
                {[
                  'Business website',
                  'Online store',
                  'Web app',
                  'AI / automation',
                  'Not sure yet',
                ].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Project details">
            <textarea required {...bind('body')} />
          </Field>

          <label className="chk">
            <input type="checkbox" required />
            <span>
              I agree to the{' '}
              <a
                href="#/"
                onClick={(e) => {
                  e.preventDefault();
                  openLegal('privacy');
                }}
              >
                Privacy Policy
              </a>{' '}
              and consent to being contacted about my enquiry.
            </span>
          </label>

          <button className="btn" disabled={sending}>
            {sending ? 'Sending…' : 'Send message'}
          </button>

          <div aria-live="polite">
            {done && <p className="ok">Message sent. We will be in touch shortly.</p>}
            {error && <p className="err">{error}</p>}
          </div>
        </form>
      </div>
    </section>
  );
}