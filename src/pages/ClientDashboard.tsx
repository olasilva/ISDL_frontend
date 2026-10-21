// src/pages/ClientDashboard.tsx
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import api from '../lib/api';
import LiveChat from '../components/LiveChat';


/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface Project {
  id: number;
  project_name: string;
  domain_name: string | null;
  status: string;
  progress: number;
  amount_due: number | string;
  is_paid: boolean;
  payment_claimed: boolean;
}

interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
}

type Tab = 'overview' | 'billing' | 'requests';
type LoadState = 'loading' | 'ready' | 'error';
type ToastTone = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  tone: ToastTone;
  text: string;
}

interface SentRequest {
  id: number;
  type: RequestType;
  summary: string;
  sentAt: Date;
}

type RequestType =
  | 'New Website'
  | 'Website Maintenance'
  | 'Buy a Domain'
  | 'Connect Existing Domain';

/* -------------------------------------------------------------------------- */
/*  Constants & helpers                                                       */
/* -------------------------------------------------------------------------- */

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: 'bx-grid-alt' },
  { id: 'billing', label: 'Billing', icon: 'bx-receipt' },
  { id: 'requests', label: 'Requests', icon: 'bx-message-square-detail' },
];

const STAGES = [
  { label: 'Discovery and planning', min: 10, hint: 'Scope, sitemap and requirements are agreed.' },
  { label: 'UI/UX design', min: 30, hint: 'Layouts and visual direction are prepared for your review.' },
  { label: 'Development', min: 60, hint: 'Pages, features and integrations are built.' },
  { label: 'Review and launch', min: 90, hint: 'Final checks, fixes and go-live.' },
];

const REQUEST_TYPES: { value: RequestType; label: string; hint: string; icon: string; placeholder: string }[] = [
  {
    value: 'New Website',
    label: 'New website',
    hint: 'Start a fresh build',
    icon: 'bx-layout',
    placeholder: 'Describe the website you want: who it is for, the pages you need, and any sites you like.',
  },
  {
    value: 'Website Maintenance',
    label: 'Maintenance',
    hint: 'Fix or update your site',
    icon: 'bx-wrench',
    placeholder: 'What needs fixing or updating? Include the page and what you expected to see.',
  },
  {
    value: 'Buy a Domain',
    label: 'Buy a domain',
    hint: 'We register it for you',
    icon: 'bx-purchase-tag-alt',
    placeholder: 'Anything we should know, such as alternative names you would accept?',
  },
  {
    value: 'Connect Existing Domain',
    label: 'Connect a domain',
    hint: 'Point one you own',
    icon: 'bx-link-alt',
    placeholder: 'Anything we should know, such as where the DNS is managed?',
  },
];

const REGISTRARS = ['GoDaddy', 'Namecheap', 'Google Domains', 'Cloudflare', 'Other'];

const DOMAIN_PATTERN = /^(?!-)([a-z0-9-]{1,63}\.)+[a-z]{2,}$/i;

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

const toNumber = (v: number | string | null | undefined) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const sentenceCase = (s: string) => {
  const t = (s || '').replace(/[_-]+/g, ' ').trim().toLowerCase();
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : 'Pending';
};

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const normaliseDomain = (raw: string) =>
  raw.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '');

const httpStatus = (err: unknown): number | undefined =>
  (err as { response?: { status?: number } })?.response?.status;

const timeLabel = (d: Date) =>
  d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

/* -------------------------------------------------------------------------- */
/*  Small presentational pieces                                               */
/* -------------------------------------------------------------------------- */

function Skeleton({ w, h = 14, r = 6 }: { w: number | string; h?: number; r?: number }) {
  return <span className="cd-skel" style={{ width: w, height: h, borderRadius: r }} aria-hidden="true" />;
}

function LoadingView() {
  return (
    <div className="cd-grid" role="status" aria-label="Loading your dashboard">
      <section className="cd-panel cd-panel--lg">
        <Skeleton w="48%" h={26} />
        <div style={{ height: 10 }} />
        <Skeleton w="30%" />
        <div style={{ height: 36 }} />
        <Skeleton w="22%" h={48} r={8} />
        <div style={{ height: 18 }} />
        <Skeleton w="100%" h={10} r={99} />
        <div style={{ height: 36 }} />
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 22 }}>
            <Skeleton w={28} h={28} r={99} />
            <div style={{ flex: 1 }}>
              <Skeleton w="45%" />
              <div style={{ height: 8 }} />
              <Skeleton w="70%" h={11} />
            </div>
          </div>
        ))}
      </section>
      <aside className="cd-stack">
        <section className="cd-panel">
          <Skeleton w="40%" h={18} />
          <div style={{ height: 14 }} />
          <Skeleton w="90%" />
          <div style={{ height: 8 }} />
          <Skeleton w="70%" />
          <div style={{ height: 22 }} />
          <Skeleton w="100%" h={40} r={10} />
        </section>
      </aside>
    </div>
  );
}

function CopyButton({ value, label, onResult }: { value: string; label: string; onResult: (ok: boolean, label: string) => void }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      onResult(true, label);
    } catch {
      onResult(false, label);
    }
  };
  return (
    <button type="button" className="cd-copy" onClick={copy} aria-label={`Copy ${label}`}>
      <i className="bx bx-copy" aria-hidden="true" />
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */

export default function ClientDashboard() {
  const navigate = useNavigate();

  /* ---- data ---- */
  const [project, setProject] = useState<Project | null>(null);
  const [bank, setBank] = useState<BankDetails | null>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [state, setState] = useState<LoadState>('loading');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  /* ---- ui ---- */
  const [tab, setTab] = useState<Tab>(() => {
    const h = window.location.hash.replace('#', '') as Tab;
    return TABS.some(t => t.id === h) ? h : 'overview';
  });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);
  const mounted = useRef(true);

  /* ---- request modal ---- */
  const [modalOpen, setModalOpen] = useState(false);
  const [requestType, setRequestType] = useState<RequestType>('New Website');
  const [requestDetails, setRequestDetails] = useState('');
  const [domainName, setDomainName] = useState('');
  const [domainRegistrar, setDomainRegistrar] = useState(REGISTRARS[0]);
  const [requestSending, setRequestSending] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [sentRequests, setSentRequests] = useState<SentRequest[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  /* ---- payment claim ---- */
  const [reference, setReference] = useState('');
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState('');

  /* ------------------------------------------------------------------ */
  /*  Toasts                                                            */
  /* ------------------------------------------------------------------ */

  const pushToast = useCallback((tone: ToastTone, text: string) => {
    const id = ++toastId.current;
    setToasts(t => [...t, { id, tone, text }]);
    window.setTimeout(() => {
      if (mounted.current) setToasts(t => t.filter(x => x.id !== id));
    }, 4500);
  }, []);

  const onCopied = useCallback(
    (ok: boolean, label: string) =>
      ok ? pushToast('success', `${label} copied`) : pushToast('error', `Could not copy ${label.toLowerCase()}`),
    [pushToast],
  );

  /* ------------------------------------------------------------------ */
  /*  Data loading                                                      */
  /* ------------------------------------------------------------------ */

  const load = useCallback(
    async (silent = false) => {
      if (silent) setRefreshing(true);
      else setState('loading');

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          navigate('/login', { replace: true });
          return;
        }

        const meta = session.user.user_metadata as { full_name?: string } | undefined;
        setUserName(meta?.full_name || session.user.email?.split('@')[0] || 'Client');
        setUserEmail(session.user.email ?? '');

        try {
          const res = await api.get('/projects/my-project');
          if (!mounted.current) return;
          setProject(res.data?.data ?? null);
          setBank(res.data?.bankDetails ?? null);
          setLastUpdated(new Date());
          setState('ready');
        } catch (err) {
          if (!mounted.current) return;
          if (httpStatus(err) === 404) {
            // A client without a project is a valid state, not a failure.
            setProject(null);
            setState('ready');
          } else if (silent) {
            pushToast('error', 'Could not refresh. Showing the last saved view.');
          } else {
            console.error('Error fetching project:', err);
            setState('error');
          }
        }
      } finally {
        if (mounted.current) setRefreshing(false);
      }
    },
    [navigate, pushToast],
  );

  useEffect(() => {
    mounted.current = true;
    load();

    const { data: sub } = supabase.auth.onAuthStateChange(event => {
      if (event === 'SIGNED_OUT') navigate('/login', { replace: true });
    });

    return () => {
      mounted.current = false;
      sub.subscription.unsubscribe();
    };
  }, [load, navigate]);

  useEffect(() => {
    document.title = 'Dashboard | ISDL Studio';
  }, []);

  useEffect(() => {
    window.history.replaceState(null, '', `#${tab}`);
  }, [tab]);

  /* ------------------------------------------------------------------ */
  /*  Derived values                                                    */
  /* ------------------------------------------------------------------ */

  const progress = clamp(toNumber(project?.progress), 0, 100);
  const amountDue = toNumber(project?.amount_due);
  const isComplete = project?.status === 'completed';

  const stageIndex = useMemo(() => {
    const firstOpen = STAGES.findIndex(s => progress < s.min);
    return firstOpen === -1 ? STAGES.length : firstOpen;
  }, [progress]);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const paymentState: 'paid' | 'verifying' | 'due' | 'none' = !project
    ? 'none'
    : project.is_paid
    ? 'paid'
    : project.payment_claimed
    ? 'verifying'
    : amountDue > 0
    ? 'due'
    : 'none';

  /* ------------------------------------------------------------------ */
  /*  Request modal                                                     */
  /* ------------------------------------------------------------------ */

  const openRequest = useCallback((type?: RequestType) => {
    lastFocused.current = document.activeElement as HTMLElement | null;
    if (type) setRequestType(type);
    setRequestError('');
    setModalOpen(true);
  }, []);

  const closeRequest = useCallback(() => {
    setModalOpen(false);
    lastFocused.current?.focus?.();
  }, []);

  useEffect(() => {
    if (!modalOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusables = () =>
      Array.from(
        modalRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select, textarea, [href]',
        ) ?? [],
      );
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRequest();
      if (e.key === 'Tab') {
        const items = focusables();
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [modalOpen, closeRequest]);

  const needsDomain = requestType === 'Buy a Domain' || requestType === 'Connect Existing Domain';
  const activeType = REQUEST_TYPES.find(t => t.value === requestType)!;

  const handleServiceRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestError('');

    const details = requestDetails.trim();
    const domain = normaliseDomain(domainName);

    if (needsDomain && !DOMAIN_PATTERN.test(domain)) {
      setRequestError('Enter a valid domain, for example mybusiness.com.');
      return;
    }
    if (details.length < 10) {
      setRequestError('Add a little more detail so we can act on this without a follow-up.');
      return;
    }

    let body = `--- NEW REQUEST: ${requestType} ---\n\n`;
    if (requestType === 'Buy a Domain') body += `Desired Domain: ${domain}\n`;
    if (requestType === 'Connect Existing Domain') body += `Domain Name: ${domain}\nRegistrar: ${domainRegistrar}\n`;
    body += `\nDetails:\n${details}`;

    setRequestSending(true);
    try {
      await api.post('/inbox', { name: userName, email: userEmail, message: body });
      setSentRequests(list => [
        { id: Date.now(), type: requestType, summary: needsDomain ? domain : details.slice(0, 90), sentAt: new Date() },
        ...list,
      ]);
      setRequestDetails('');
      setDomainName('');
      closeRequest();
      setTab('requests');
      pushToast('success', 'Request sent. We will reply by email or chat.');
    } catch (err) {
      console.error('Service request failed:', err);
      setRequestError('The request did not go through. Try again, or message us in the live chat.');
    } finally {
      setRequestSending(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /*  Payment claim                                                     */
  /* ------------------------------------------------------------------ */

  const handleClaimPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    const ref = reference.trim();
    if (ref.length < 4) {
      setClaimError('Enter the reference shown on your transfer receipt.');
      return;
    }

    setClaimError('');
    setClaiming(true);
    try {
      await api.post('/projects/claim-payment', { project_id: project.id, payment_reference: ref });
      setProject({ ...project, payment_claimed: true });
      setReference('');
      pushToast('success', 'Thanks. We are verifying your transfer.');
    } catch (err) {
      console.error('Claim failed:', err);
      setClaimError('We could not record your payment. Try again, or tell us in the live chat.');
    } finally {
      setClaiming(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  };

  /* ------------------------------------------------------------------ */
  /*  Sections                                                          */
  /* ------------------------------------------------------------------ */

  const nextStep = (() => {
    if (!project) return null;
    if (paymentState === 'due')
      return {
        tone: 'warn' as const,
        title: `${currency.format(amountDue)} is due`,
        body: 'Pay by bank transfer, then enter your reference so we can match it.',
        action: { label: 'Go to billing', run: () => setTab('billing') },
      };
    if (paymentState === 'verifying')
      return {
        tone: 'info' as const,
        title: 'Transfer under verification',
        body: 'We have your reference. This page updates once the payment is confirmed.',
        action: null,
      };
    if (isComplete)
      return {
        tone: 'ok' as const,
        title: 'Your project is complete',
        body: 'Need a change after launch? Send a maintenance request and we will pick it up.',
        action: { label: 'Request maintenance', run: () => openRequest('Website Maintenance') },
      };
    const stage = STAGES[Math.min(stageIndex, STAGES.length - 1)];
    return {
      tone: 'info' as const,
      title: `Now: ${stage.label}`,
      body: stage.hint,
      action: null,
    };
  })();

  const renderOverview = () => {
    if (!project) {
      return (
        <div className="cd-grid">
          <section className="cd-panel cd-panel--lg cd-empty">
            <i className="bx bx-folder-open cd-empty__icon" aria-hidden="true" />
            <h2>No active project yet</h2>
            <p>
              Tell us what you need and we will set up your project here, with progress, billing and updates in one place.
            </p>
            <button className="cd-btn cd-btn--primary" onClick={() => openRequest('New Website')}>
              Start a project request
            </button>
          </section>
          <aside className="cd-stack">
            <section className="cd-panel cd-panel--ink">
              <h3>Questions first?</h3>
              <p>Use the chat bubble at the bottom right. Messages go straight to our team.</p>
            </section>
          </aside>
        </div>
      );
    }

    return (
      <div className="cd-grid">
        <section className="cd-panel cd-panel--lg" aria-labelledby="cd-project-title">
          <div className="cd-project__head">
            <div>
              <h2 id="cd-project-title" className="cd-project__name">
                {project.project_name}
              </h2>
              <p className="cd-project__domain">
                <i className="bx bx-globe" aria-hidden="true" />
                {project.domain_name ? (
                  <a href={`https://${project.domain_name}`} target="_blank" rel="noopener noreferrer">
                    {project.domain_name}
                  </a>
                ) : (
                  <span>Domain not connected yet</span>
                )}
              </p>
            </div>
            <span className={`cd-pill ${isComplete ? 'cd-pill--ok' : 'cd-pill--info'}`}>{sentenceCase(project.status)}</span>
          </div>

          <div className="cd-progress">
            <div className="cd-progress__figure">
              <span className="cd-progress__num">{progress}</span>
              <span className="cd-progress__unit">%</span>
              <span className="cd-progress__cap">complete</span>
            </div>
            <div
              className="cd-bar"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              aria-label="Build progress"
            >
              <div className="cd-bar__fill" style={{ width: `${progress}%` }} />
              {STAGES.map(s => (
                <span key={s.label} className="cd-bar__tick" style={{ left: `${s.min}%` }} aria-hidden="true" />
              ))}
            </div>
          </div>

          <h3 className="cd-section-title">Project timeline</h3>
          <ol className="cd-stages">
            {STAGES.map((s, i) => {
              const done = progress >= s.min;
              const current = i === stageIndex && !isComplete;
              return (
                <li
                  key={s.label}
                  className={`cd-stage ${done ? 'is-done' : ''} ${current ? 'is-current' : ''}`}
                  aria-current={current ? 'step' : undefined}
                >
                  <span className="cd-stage__node" aria-hidden="true">
                    {done ? <i className="bx bx-check" /> : null}
                  </span>
                  <div className="cd-stage__body">
                    <b>
                      {s.label}
                      {current && <span className="cd-stage__tag">In progress</span>}
                    </b>
                    <span>{s.hint}</span>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <aside className="cd-stack">
          {nextStep && (
            <section className={`cd-panel cd-next cd-next--${nextStep.tone}`}>
              <h3>{nextStep.title}</h3>
              <p>{nextStep.body}</p>
              {nextStep.action && (
                <button className="cd-btn cd-btn--primary" onClick={nextStep.action.run}>
                  {nextStep.action.label}
                </button>
              )}
            </section>
          )}

          <section className="cd-panel">
            <h3>Need something else?</h3>
            <p className="cd-muted">Domains, maintenance or a new build. Pick one and we will take it from there.</p>
            <div className="cd-quick">
              {REQUEST_TYPES.map(t => (
                <button key={t.value} className="cd-quick__item" onClick={() => openRequest(t.value)}>
                  <i className={`bx ${t.icon}`} aria-hidden="true" />
                  {t.label}
                </button>
              ))}
            </div>
          </section>
        </aside>
      </div>
    );
  };

  const renderBilling = () => {
    if (!project) {
      return (
        <section className="cd-panel cd-empty">
          <i className="bx bx-receipt cd-empty__icon" aria-hidden="true" />
          <h2>Nothing to pay yet</h2>
          <p>Billing appears here once your project is set up.</p>
        </section>
      );
    }

    return (
      <div className="cd-grid cd-grid--billing">
        <section className="cd-panel" aria-labelledby="cd-bill-title">
          <h2 id="cd-bill-title" className="cd-section-title">
            Amount due
          </h2>
          <div className="cd-amount">{currency.format(amountDue)}</div>
          <p className="cd-muted">{project.project_name}</p>

          <div className={`cd-status cd-status--${paymentState}`}>
            {paymentState === 'paid' && (
              <>
                <i className="bx bx-check-circle" aria-hidden="true" /> Paid in full
              </>
            )}
            {paymentState === 'verifying' && (
              <>
                <i className="bx bx-time-five" aria-hidden="true" /> Verifying your transfer
              </>
            )}
            {paymentState === 'due' && (
              <>
                <i className="bx bx-error-circle" aria-hidden="true" /> Awaiting payment
              </>
            )}
            {paymentState === 'none' && (
              <>
                <i className="bx bx-minus-circle" aria-hidden="true" /> No balance
              </>
            )}
          </div>
        </section>

        {paymentState === 'due' ? (
          <section className="cd-panel" aria-labelledby="cd-transfer-title">
            <h2 id="cd-transfer-title" className="cd-section-title">
              Pay by bank transfer
            </h2>

            <div className="cd-stepline">
              <span className="cd-stepline__n">1</span>
              <div>
                <b>Transfer {currency.format(amountDue)}</b>
                {bank ? (
                  <dl className="cd-bank">
                    <div>
                      <dt>Bank</dt>
                      <dd>{bank.bankName}</dd>
                    </div>
                    <div>
                      <dt>Account name</dt>
                      <dd>{bank.accountName}</dd>
                    </div>
                    <div>
                      <dt>Account number</dt>
                      <dd className="cd-bank__num">
                        {bank.accountNumber}
                        <CopyButton value={bank.accountNumber} label="Account number" onResult={onCopied} />
                      </dd>
                    </div>
                  </dl>
                ) : (
                  <p className="cd-muted">
                    Bank details are not available right now. Ask us in the live chat and we will send them.
                  </p>
                )}
              </div>
            </div>

            <form className="cd-stepline" onSubmit={handleClaimPayment} noValidate>
              <span className="cd-stepline__n">2</span>
              <div style={{ flex: 1 }}>
                <b>Confirm your payment</b>
                <label className="cd-field" htmlFor="cd-ref">
                  <span>Transfer reference</span>
                  <input
                    id="cd-ref"
                    value={reference}
                    onChange={e => setReference(e.target.value)}
                    placeholder="e.g. TRX-12345"
                    autoComplete="off"
                    aria-invalid={!!claimError}
                    aria-describedby={claimError ? 'cd-ref-err' : undefined}
                  />
                </label>
                {claimError && (
                  <p id="cd-ref-err" className="cd-error" role="alert">
                    {claimError}
                  </p>
                )}
                <button className="cd-btn cd-btn--primary" type="submit" disabled={claiming}>
                  {claiming ? 'Sending…' : 'I have paid'}
                </button>
              </div>
            </form>
          </section>
        ) : (
          <section className="cd-panel cd-panel--quiet">
            <h2 className="cd-section-title">
              {paymentState === 'paid' ? 'Payment received' : paymentState === 'verifying' ? 'We have your reference' : 'No action needed'}
            </h2>
            <p className="cd-muted">
              {paymentState === 'paid'
                ? 'Thank you. There is nothing further to pay on this project.'
                : paymentState === 'verifying'
                ? 'Our team is matching your transfer to this invoice. The status here updates once it is confirmed.'
                : 'There is no outstanding balance on this project.'}
            </p>
          </section>
        )}
      </div>
    );
  };

  const renderRequests = () => (
    <div className="cd-grid">
      <section className="cd-panel cd-panel--lg">
        <div className="cd-row">
          <h2 className="cd-section-title" style={{ margin: 0 }}>
            Sent this session
          </h2>
          <button className="cd-btn cd-btn--primary" onClick={() => openRequest()}>
            <i className="bx bx-plus" aria-hidden="true" /> New request
          </button>
        </div>

        {sentRequests.length === 0 ? (
          <div className="cd-empty cd-empty--inline">
            <p>
              Requests you send appear here while this page is open. Our replies come by email or in the live chat.
            </p>
          </div>
        ) : (
          <ul className="cd-list">
            {sentRequests.map(r => (
              <li key={r.id}>
                <div>
                  <b>{r.type}</b>
                  <span>{r.summary}</span>
                </div>
                <time dateTime={r.sentAt.toISOString()}>{timeLabel(r.sentAt)}</time>
              </li>
            ))}
          </ul>
        )}
      </section>

      <aside className="cd-stack">
        <section className="cd-panel">
          <h3>What we can do</h3>
          <div className="cd-quick cd-quick--col">
            {REQUEST_TYPES.map(t => (
              <button key={t.value} className="cd-quick__item cd-quick__item--wide" onClick={() => openRequest(t.value)}>
                <i className={`bx ${t.icon}`} aria-hidden="true" />
                <span>
                  <b>{t.label}</b>
                  <small>{t.hint}</small>
                </span>
              </button>
            ))}
          </div>
        </section>
        <section className="cd-panel cd-panel--ink">
          <h3>Prefer to talk?</h3>
          <p>The chat bubble at the bottom right reaches our team directly.</p>
        </section>
      </aside>
    </div>
  );

  /* ------------------------------------------------------------------ */
  /*  Render                                                            */
  /* ------------------------------------------------------------------ */

  return (
    <div className="cd-root">
      <a href="#cd-main" className="cd-skip">
        Skip to content
      </a>

      <aside className="cd-rail">
        <div className="cd-brand">
          <span className="cd-brand__mark">IS</span>
          <span className="cd-brand__name">ISDL Studio</span>
        </div>

        <nav className="cd-nav" aria-label="Dashboard sections">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`cd-nav__item ${tab === t.id ? 'is-active' : ''}`}
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id ? 'page' : undefined}
            >
              <i className={`bx ${t.icon}`} aria-hidden="true" />
              <span>{t.label}</span>
              {t.id === 'billing' && paymentState === 'due' && <span className="cd-dot" aria-label="Payment due" />}
            </button>
          ))}
        </nav>

        <div className="cd-user">
          <span className="cd-user__avatar" aria-hidden="true">
            {userName.charAt(0).toUpperCase() || '?'}
          </span>
          <div className="cd-user__meta">
            <b>{userName}</b>
            <span>{userEmail}</span>
          </div>
          <button className="cd-iconbtn" onClick={handleLogout} aria-label="Log out" title="Log out">
            <i className="bx bx-log-out" aria-hidden="true" />
          </button>
        </div>
      </aside>

      <main id="cd-main" className="cd-main">
        <header className="cd-top">
          <div>
            <h1>
              {greeting()}, {userName || 'there'}
            </h1>
            <p>
              {today}
              {lastUpdated && <span className="cd-top__sync"> · Updated {timeLabel(lastUpdated)}</span>}
            </p>
          </div>
          <div className="cd-top__actions">
            <button
              className="cd-btn cd-btn--ghost"
              onClick={() => load(true)}
              disabled={refreshing || state === 'loading'}
              aria-label="Refresh dashboard"
            >
              <i className={`bx bx-refresh ${refreshing ? 'is-spinning' : ''}`} aria-hidden="true" />
              <span className="cd-hide-sm">Refresh</span>
            </button>
            <button className="cd-btn cd-btn--primary" onClick={() => openRequest()}>
              <i className="bx bx-plus" aria-hidden="true" /> <span>New request</span>
            </button>
          </div>
        </header>

        {state === 'loading' && <LoadingView />}

        {state === 'error' && (
          <section className="cd-panel cd-empty" role="alert">
            <i className="bx bx-wifi-off cd-empty__icon" aria-hidden="true" />
            <h2>We could not load your dashboard</h2>
            <p>This is usually a connection problem. Your data is safe. Check your connection and try again.</p>
            <button className="cd-btn cd-btn--primary" onClick={() => load()}>
              Try again
            </button>
          </section>
        )}

        {state === 'ready' && (
          <>
            {tab === 'overview' && renderOverview()}
            {tab === 'billing' && renderBilling()}
            {tab === 'requests' && renderRequests()}
          </>
        )}
      </main>

      {/* ---------- Request dialog ---------- */}
      {modalOpen && (
        <div className="cd-overlay" onMouseDown={e => e.target === e.currentTarget && closeRequest()}>
          <div className="cd-dialog" role="dialog" aria-modal="true" aria-labelledby="cd-dialog-title" ref={modalRef}>
            <div className="cd-dialog__head">
              <h2 id="cd-dialog-title">New request</h2>
              <button className="cd-iconbtn" onClick={closeRequest} aria-label="Close dialog">
                <i className="bx bx-x" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleServiceRequest} noValidate>
              <fieldset className="cd-types">
                <legend>What do you need?</legend>
                {REQUEST_TYPES.map(t => (
                  <label key={t.value} className={`cd-type ${requestType === t.value ? 'is-selected' : ''}`}>
                    <input
                      type="radio"
                      name="request-type"
                      value={t.value}
                      checked={requestType === t.value}
                      onChange={() => {
                        setRequestType(t.value);
                        setRequestError('');
                      }}
                    />
                    <i className={`bx ${t.icon}`} aria-hidden="true" />
                    <span>
                      <b>{t.label}</b>
                      <small>{t.hint}</small>
                    </span>
                  </label>
                ))}
              </fieldset>

              {needsDomain && (
                <div className="cd-fields">
                  <label className="cd-field" htmlFor="cd-domain">
                    <span>{requestType === 'Buy a Domain' ? 'Domain you want' : 'Your domain'}</span>
                    <input
                      id="cd-domain"
                      value={domainName}
                      onChange={e => setDomainName(e.target.value)}
                      placeholder="mybusiness.com"
                      autoComplete="off"
                      inputMode="url"
                    />
                  </label>
                  {requestType === 'Connect Existing Domain' && (
                    <label className="cd-field" htmlFor="cd-registrar">
                      <span>Where is it registered?</span>
                      <select id="cd-registrar" value={domainRegistrar} onChange={e => setDomainRegistrar(e.target.value)}>
                        {REGISTRARS.map(r => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                    </label>
                  )}
                </div>
              )}

              <label className="cd-field" htmlFor="cd-details">
                <span>Details</span>
                <textarea
                  id="cd-details"
                  rows={5}
                  value={requestDetails}
                  maxLength={1500}
                  onChange={e => setRequestDetails(e.target.value)}
                  placeholder={activeType.placeholder}
                />
                <small className="cd-count">{requestDetails.length}/1500</small>
              </label>

              {requestError && (
                <p className="cd-error" role="alert">
                  {requestError}
                </p>
              )}

              <div className="cd-dialog__foot">
                <button type="button" className="cd-btn cd-btn--ghost" onClick={closeRequest}>
                  Cancel
                </button>
                <button type="submit" className="cd-btn cd-btn--primary" disabled={requestSending}>
                  {requestSending ? 'Sending…' : 'Send request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------- Toasts ---------- */}
      <div className="cd-toasts" aria-live="polite" aria-atomic="false">
        {toasts.map(t => (
          <div key={t.id} className={`cd-toast cd-toast--${t.tone}`}>
            {t.text}
          </div>
        ))}
      </div>

      <LiveChat />
    </div>
  );
}