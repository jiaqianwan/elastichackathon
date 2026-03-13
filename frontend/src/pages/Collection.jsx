import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ── Shared primitives ───────────────────────────────────────── */
const LogoMark = () => (
  <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
    <rect x="2" y="2" width="20" height="20" stroke="var(--color-ink)" strokeWidth="1.2"/>
    <rect x="14" y="14" width="20" height="20" stroke="var(--color-ink)" strokeWidth="1.2"/>
    <line x1="2" y1="2" x2="14" y2="14" stroke="var(--color-ink)" strokeWidth="1.2"/>
  </svg>
);

const Arrow = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.5" strokeLinecap="round">
    <path d="M5 12h14M13 6l6 6-6 6"/>
  </svg>
);

/* ── Rethemed QR code — ink on cream ────────────────────────── */
const QRCode = () => (
  <svg width="160" height="160" viewBox="0 0 156 156" fill="none">
    {/* TL finder */}
    <rect x="8"   y="8"   width="48" height="48" rx="0" fill="none" stroke="var(--color-ink)" strokeWidth="4"/>
    <rect x="20"  y="20"  width="24" height="24" rx="0" fill="var(--color-ink)"/>
    {/* TR finder */}
    <rect x="100" y="8"   width="48" height="48" rx="0" fill="none" stroke="var(--color-ink)" strokeWidth="4"/>
    <rect x="112" y="20"  width="24" height="24" rx="0" fill="var(--color-ink)"/>
    {/* BL finder */}
    <rect x="8"   y="100" width="48" height="48" rx="0" fill="none" stroke="var(--color-ink)" strokeWidth="4"/>
    <rect x="20"  y="112" width="24" height="24" rx="0" fill="var(--color-ink)"/>
    {/* Data modules */}
    {[
      [72,8],[82,8],[92,8],[72,18],[82,18],[92,18],[72,28],[92,28],[72,38],[82,38],[92,38],
      [72,48],[92,48],[82,58],[72,68],[92,68],[102,68],[112,68],[122,68],
      [8,72],[18,72],[28,72],[48,72],[8,82],[28,82],[38,82],[48,82],
      [8,92],[18,92],[38,92],[8,102],[28,102],[48,102],[18,112],[38,112],
      [72,72],[82,72],[92,72],[102,72],[112,72],[122,72],[132,72],[142,72],
      [72,82],[102,82],[132,82],[72,92],[82,92],[112,92],[142,92],
      [72,102],[92,102],[112,102],[132,102],[82,112],[102,112],[122,112],[142,112],
      [72,122],[82,122],[92,122],[102,122],[112,122],[122,122],[132,122],[142,122],
      [132,82],[142,82],[132,92],[142,102],[132,112],
    ].map(([x, y], i) => (
      <rect key={i} x={x} y={y} width="8" height="8" rx="0" fill="var(--color-ink)"/>
    ))}
    {/* Centre logo mark — small SHH geometry */}
    <rect x="66" y="66" width="24" height="24" fill="var(--color-cream-card)" stroke="var(--color-ink)" strokeWidth="1"/>
    <text x="78" y="82" textAnchor="middle"
      fontFamily="'DM Sans', sans-serif" fontSize="7" fontWeight="700"
      fill="var(--color-ink)" letterSpacing="0.5">SHH</text>
  </svg>
);

/* ── Perforated divider ──────────────────────────────────────── */
const Perforation = () => (
  <div style={{ position: 'relative', padding: '0 0' }}>
    {/* Left notch */}
    <div style={{
      position: 'absolute', left: -14, top: '50%', transform: 'translateY(-50%)',
      width: 24, height: 24, borderRadius: '50%',
      background: 'var(--color-cream)', border: '1px solid var(--color-border)',
      zIndex: 2,
    }}/>
    {/* Right notch */}
    <div style={{
      position: 'absolute', right: -14, top: '50%', transform: 'translateY(-50%)',
      width: 24, height: 24, borderRadius: '50%',
      background: 'var(--color-cream)', border: '1px solid var(--color-border)',
      zIndex: 2,
    }}/>
    {/* Dashed line */}
    <div style={{
      borderTop: '1.5px dashed var(--color-border)',
      margin: '0 6px',
    }}/>
  </div>
);

/* ════════════════════════════════════════════════════════════════
   COLLECTION
════════════════════════════════════════════════════════════════ */
const Collection = () => {
  const navigate = useNavigate();
  const [hoveredStep, setHoveredStep] = useState(null);

  const steps = [
    { n: '01', title: 'Go to Block B',        body: 'Head to School Locker #12 at Block B during any free period.' },
    { n: '02', title: 'Scan the QR code',     body: 'Hold your phone up to the terminal scanner. No app needed.'  },
    { n: '03', title: 'Item released',         body: 'The locker opens automatically. No staff interaction needed.' },
  ];

  return (
    <div style={{
      background: 'var(--color-cream)', minHeight: '100vh',
      fontFamily: 'var(--font-body)', position: 'relative', overflowX: 'hidden',
    }}>

      {/* ── Grain overlay ── */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.042,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat', backgroundSize: '256px 256px',
      }}/>

      {/* ══ NAV ══════════════════════════════════════════════════ */}
      <nav style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.75rem 2.5rem',
        maxWidth: 1200, margin: '0 auto',
        borderBottom: '1px solid var(--color-border-light)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}
          onClick={() => navigate('/')}>
          <LogoMark />
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: '0.72rem',
            letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-ink)',
          }}>Secondhand Heroes</span>
        </div>

        <button onClick={() => navigate('/')} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 500,
          letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-ink-light)',
          display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--color-ink)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--color-ink-light)'}
        >
          ← Home
        </button>
      </nav>

      {/* ══ PAGE HEADER ══════════════════════════════════════════ */}
      <header style={{
        position: 'relative', zIndex: 5,
        maxWidth: 1200, margin: '0 auto',
        padding: '3.5rem 2.5rem 0',
      }}>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '0.63rem', fontWeight: 500,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'var(--color-sage-dark)', margin: '0 0 0.75rem',
        }}>Pass on your passion for a second chance</p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.4rem, 5vw, 4rem)',
          fontWeight: 400, fontStyle: 'italic',
          color: 'var(--color-ink)', lineHeight: 1.06,
          letterSpacing: '-0.01em', margin: 0,
        }}>
          Private<br/>
          <span style={{ fontStyle: 'normal' }}>Collection.</span>
        </h1>
      </header>

      {/* ══ MAIN ═════════════════════════════════════════════════ */}
      <main style={{
        position: 'relative', zIndex: 5,
        maxWidth: 1200, margin: '0 auto',
        padding: '3rem 2.5rem 5rem',
        display: 'grid', gap: '4rem',
        alignItems: 'start',
      }} className="col-layout">

        {/* ══ LEFT — ticket ════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* ── The ticket ── */}
          <div style={{
            border: '1px solid var(--color-border)',
            background: 'var(--color-cream-card)',
            animation: 'colFadeUp 0.4s ease both',
            position: 'relative',
            overflow: 'visible',
          }}>

            {/* Ticket top — main body */}
            <div style={{ padding: '1.75rem 1.75rem 1.5rem' }}>

              {/* Header row */}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', marginBottom: '1.5rem',
              }}>
                <div>
                  <p style={{
                    fontFamily: 'var(--font-display)', fontSize: '1.2rem',
                    fontStyle: 'italic', color: 'var(--color-ink)', margin: '0 0 0.25rem',
                  }}>Fencing Foil</p>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.62rem', fontWeight: 500,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: 'var(--color-ink-light)', margin: 0,
                  }}>Order #SHH-2847</p>
                </div>
                <span className="badge-grade-a">Grade A</span>
              </div>

              {/* QR block */}
              <div style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                padding: '1.5rem',
                background: 'var(--color-cream)',
                border: '1px solid var(--color-border)',
                marginBottom: '1.5rem',
              }}>
                <QRCode />
              </div>

              {/* Meta row */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                borderTop: '1px solid var(--color-border)',
                paddingTop: '1.25rem',
                gap: '1rem',
              }}>
                {[
                  { label: 'Valid Until', val: '30 Mar 2025' },
                  { label: 'Location',    val: 'Block B · L#12' },
                ].map(m => (
                  <div key={m.label}>
                    <p style={{
                      fontFamily: 'var(--font-body)', fontSize: '0.58rem', fontWeight: 600,
                      letterSpacing: '0.16em', textTransform: 'uppercase',
                      color: 'var(--color-ink-light)', margin: '0 0 0.3rem',
                    }}>{m.label}</p>
                    <p style={{
                      fontFamily: 'var(--font-display)', fontSize: '0.95rem',
                      fontStyle: 'italic', color: 'var(--color-ink)', margin: 0,
                    }}>{m.val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Perforation divider */}
            <Perforation />

            {/* Ticket stub — sage footer */}
            <div style={{
              background: 'var(--color-sage-deep)',
              padding: '1.1rem 1.75rem',
              display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
            }}>
              <div style={{
                width: 28, height: 28, flexShrink: 0,
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.1rem',
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                color: 'rgba(245,240,232,0.7)', lineHeight: 1.65, margin: 0,
              }}>
                This code is unique to your item.
                Your identity is <span style={{ color: 'var(--color-cream)', fontWeight: 600 }}>never revealed</span> during pickup.
              </p>
            </div>
          </div>

          {/* ── Expiry warning ── */}
          <div style={{
            background: 'var(--color-amber-pale)',
            border: '1px solid var(--color-amber-border)',
            padding: '1rem 1.25rem',
            display: 'flex', alignItems: 'center', gap: '0.75rem',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="var(--color-amber-accent)" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
            </svg>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.72rem',
              color: 'var(--color-amber-accent)', margin: 0, lineHeight: 1.6,
            }}>
              This QR code expires on <strong>30 Mar 2025</strong>. Collect before then.
            </p>
          </div>
        </div>

        {/* ══ RIGHT — sidebar ══════════════════════════════════ */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* ── How to collect ── */}
          <div style={{ border: '1px solid var(--color-border)', background: 'var(--color-cream-card)' }}>
            <div style={{
              padding: '1rem 1.25rem',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '0.62rem', fontWeight: 600,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                color: 'var(--color-ink-mid)', margin: 0,
              }}>How to Collect</p>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: '0.7rem', fontStyle: 'italic',
                color: 'var(--color-ink-light)',
              }}>3 steps</span>
            </div>

            {steps.map((s, i) => (
              <div key={s.n}
                onMouseEnter={() => setHoveredStep(i)}
                onMouseLeave={() => setHoveredStep(null)}
                style={{
                  padding: '1rem 1.25rem',
                  borderBottom: i < steps.length - 1 ? '1px solid var(--color-border-light)' : 'none',
                  display: 'flex', gap: '0.85rem',
                  background: hoveredStep === i ? 'var(--color-sage-pale)' : 'transparent',
                  transition: 'background 0.2s',
                  animation: `colFadeUp 0.38s ease ${0.1 * i}s both`,
                }}>
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: '0.78rem', fontStyle: 'italic',
                  color: hoveredStep === i ? 'var(--color-sage-dark)' : 'var(--color-ink-light)',
                  flexShrink: 0, marginTop: '0.1rem', transition: 'color 0.2s',
                }}>{s.n}</span>
                <div>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600,
                    color: 'var(--color-ink)', margin: '0 0 0.25rem',
                  }}>{s.title}</p>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.74rem',
                    color: 'var(--color-ink-light)', margin: 0, lineHeight: 1.65,
                  }}>{s.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Item summary ── */}
          <div style={{ border: '1px solid var(--color-border)', background: 'var(--color-cream-card)' }}>
            <div style={{
              padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)',
            }}>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '0.62rem', fontWeight: 600,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                color: 'var(--color-ink-mid)', margin: 0,
              }}>Item Summary</p>
            </div>
            {[
              { label: 'Item',     val: 'Fencing Foil'  },
              { label: 'Donor',    val: 'Anonymous'      },
              { label: 'Grade',    val: 'Grade A'        },
              { label: 'School',   val: 'RI'             },
              { label: 'CO₂',      val: '3.2kg saved'    },
            ].map((row, i, arr) => (
              <div key={row.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.75rem 1.25rem',
                borderBottom: i < arr.length - 1 ? '1px solid var(--color-border-light)' : 'none',
              }}>
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.7rem',
                  color: 'var(--color-ink-light)', fontWeight: 500,
                }}>{row.label}</span>
                <span style={{
                  fontFamily: row.label === 'Item' ? 'var(--font-display)' : 'var(--font-body)',
                  fontStyle: row.label === 'Item' ? 'italic' : 'normal',
                  fontSize: '0.82rem', color: 'var(--color-ink)', fontWeight: 500,
                }}>{row.val}</span>
              </div>
            ))}
          </div>

          {/* ── Navigate back ── */}
          <button onClick={() => navigate('/dashboard')} style={{
            background: 'none', border: '1px solid var(--color-border)', borderRadius: 0,
            padding: '0.85rem 1.25rem',
            fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 500,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'var(--color-ink-light)', cursor: 'pointer', width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            transition: 'color 0.2s, border-color 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-sage-dark)'; e.currentTarget.style.borderColor = 'var(--color-sage)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-ink-light)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
          >
            View Impact Dashboard <Arrow size={12}/>
          </button>
        </aside>
      </main>

      <style>{`
        @keyframes colFadeUp {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .col-layout {
          grid-template-columns: 1fr;
        }
        @media (min-width: 860px) {
          .col-layout { grid-template-columns: 480px 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Collection;
