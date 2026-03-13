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

/* ── Donation history data ───────────────────────────────────── */
const history = [
  { item: 'Fencing Foil', grade: 'Grade A', co2: 3.2, status: 'Completed', date: '8 Mar',  school: 'RI'   },
  { item: 'ACS Blazer',   grade: 'Grade B', co2: 2.1, status: 'Completed', date: '22 Feb', school: 'ACJC' },
  { item: 'Basketball',   grade: 'Grade A', co2: 1.8, status: 'Pending',   date: '12 Mar', school: 'HCI'  },
];

/* ── Stat block ──────────────────────────────────────────────── */
const StatBlock = ({ value, unit, label, index }) => (
  <div style={{
    padding: '1.5rem 1.75rem',
    borderRight: index < 2 ? '1px solid var(--color-border)' : 'none',
    animation: `dashFadeUp 0.4s ease ${0.08 * index}s both`,
  }}>
    <p style={{
      fontFamily: 'var(--font-body)', fontSize: '0.58rem', fontWeight: 600,
      letterSpacing: '0.18em', textTransform: 'uppercase',
      color: 'var(--color-ink-light)', margin: '0 0 0.5rem',
    }}>{label}</p>
    <p style={{
      fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
      fontStyle: 'italic', fontWeight: 400,
      color: 'var(--color-ink)', margin: '0 0 0.2rem', lineHeight: 1,
    }}>{value}</p>
    <p style={{
      fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 400,
      color: 'var(--color-ink-light)', margin: 0,
    }}>{unit}</p>
  </div>
);

/* ── History row ─────────────────────────────────────────────── */
const HistoryRow = ({ d, i, isLast }) => {
  const [hovered, setHovered] = useState(false);
  const isA = d.grade === 'Grade A';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '1rem',
        alignItems: 'center',
        padding: '1rem 1.25rem',
        borderBottom: isLast ? 'none' : '1px solid var(--color-border-light)',
        background: hovered ? 'var(--color-sage-pale)' : 'transparent',
        transition: 'background 0.2s',
        animation: `dashFadeUp 0.38s ease ${0.06 * i}s both`,
        cursor: 'default',
      }}
    >
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Grade indicator bar */}
        <div style={{
          width: 3, height: 36, flexShrink: 0,
          background: isA ? 'var(--color-sage-dark)' : 'var(--color-amber-accent)',
        }}/>
        <div>
          <p style={{
            fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontStyle: 'italic',
            color: 'var(--color-ink)', margin: '0 0 0.2rem',
          }}>{d.item}</p>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 400,
            color: 'var(--color-ink-light)', margin: 0,
          }}>{d.date} · {d.school} · {d.co2}kg CO₂</p>
        </div>
      </div>

      {/* Right badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
        <span className={isA ? 'badge-grade-a' : 'badge-grade-b'}>{d.grade}</span>
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: '0.58rem', fontWeight: 600,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: d.status === 'Completed' ? 'var(--color-sage-dark)' : 'var(--color-amber-accent)',
          border: `1px solid ${d.status === 'Completed' ? 'var(--color-sage-mid)' : 'var(--color-amber-border)'}`,
          background: d.status === 'Completed' ? 'var(--color-sage-pale)' : 'var(--color-amber-pale)',
          padding: '0.18rem 0.6rem', borderRadius: '999px',
        }}>{d.status}</span>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   DASHBOARD
════════════════════════════════════════════════════════════════ */
const Dashboard = () => {
  const navigate = useNavigate();

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
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem',
      }}>
        <div>
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
            Your<br/>
            <span style={{ fontStyle: 'normal' }}>Impact.</span>
          </h1>
        </div>

        {/* Donate CTA — top right */}
        <button onClick={() => navigate('/donate')} style={{
          background: 'none', border: '1px solid var(--color-ink)', borderRadius: 0,
          padding: '0.75rem 1.5rem',
          fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 500,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: 'var(--color-ink)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          transition: 'background 0.2s, color 0.2s',
          flexShrink: 0,
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-ink)'; e.currentTarget.style.color = 'var(--color-cream)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--color-ink)'; }}
        >
          Donate Another <Arrow size={13}/>
        </button>
      </header>

      {/* ══ MAIN ═════════════════════════════════════════════════ */}
      <main style={{
        position: 'relative', zIndex: 5,
        maxWidth: 1200, margin: '0 auto',
        padding: '3rem 2.5rem 5rem',
        display: 'grid', gap: '3rem',
      }} className="dash-layout">

        {/* ══ LEFT column ════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* ── Stat strip ── */}
          <div style={{
            border: '1px solid var(--color-border)',
            background: 'var(--color-cream-card)',
            display: 'grid',
          }} className="dash-stat-grid">
            <StatBlock value="12.4" unit="kg CO₂ saved"       label="Environmental Impact" index={0}/>
            <StatBlock value="$450" unit="saved for peers"     label="Social Equity"         index={1}/>
            <StatBlock value="3"    unit="items · 2 matched"   label="Total Donations"       index={2}/>
          </div>

          {/* ── CO₂ progress bar ── */}
          <div style={{ border: '1px solid var(--color-border)', background: 'var(--color-cream-card)', padding: '1.5rem 1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '0.62rem', fontWeight: 600,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                color: 'var(--color-ink-mid)', margin: 0,
              }}>CO₂ Reduction Goal</p>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: '0.82rem', fontStyle: 'italic',
                color: 'var(--color-ink-light)',
              }}>12.4 / 20kg</span>
            </div>
            {/* Track */}
            <div style={{
              width: '100%', height: 6,
              background: 'var(--color-border)', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, bottom: 0,
                width: '62%',
                background: 'var(--color-sage-dark)',
                animation: 'dashBarGrow 0.9s ease 0.3s both',
              }}/>
            </div>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.7rem',
              color: 'var(--color-ink-light)', margin: '0.65rem 0 0', lineHeight: 1.6,
            }}>
              62% of your personal goal reached. 1–2 more donations gets you there.
            </p>
          </div>

          {/* ── Donation history ── */}
          <div style={{ border: '1px solid var(--color-border)', background: 'var(--color-cream-card)' }}>
            {/* Header */}
            <div style={{
              padding: '1rem 1.25rem',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '0.62rem', fontWeight: 600,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                color: 'var(--color-ink-mid)', margin: 0,
              }}>Donation History</p>
              <button style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                fontFamily: 'var(--font-body)', fontSize: '0.62rem', fontWeight: 500,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--color-sage-dark)',
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                transition: 'opacity 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = 0.65}
                onMouseLeave={e => e.currentTarget.style.opacity = 1}
              >
                See all <Arrow size={11} color="var(--color-sage-dark)"/>
              </button>
            </div>

            {history.map((d, i) => (
              <HistoryRow key={i} d={d} i={i} isLast={i === history.length - 1}/>
            ))}
          </div>
        </div>

        {/* ══ RIGHT column ═══════════════════════════════════════ */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* ── Kampong nudge ── */}
          <div style={{
            background: 'var(--color-sage-deep)',
            border: '1px solid var(--color-sage-deep)',
            padding: '2rem 1.75rem',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Offset square decoration */}
            <div style={{
              position: 'absolute', bottom: '-1rem', right: '-1rem',
              width: 80, height: 80,
              border: '1px solid rgba(255,255,255,0.1)',
              pointerEvents: 'none',
            }}/>
            <div style={{
              position: 'absolute', bottom: '-1.75rem', right: '-1.75rem',
              width: 80, height: 80,
              border: '1px solid rgba(255,255,255,0.06)',
              pointerEvents: 'none',
            }}/>

            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.6rem', fontWeight: 600,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'var(--color-sage-mid)', margin: '0 0 0.75rem',
            }}>Community</p>
            <p style={{
              fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontStyle: 'italic',
              color: 'var(--color-cream)', lineHeight: 1.25, margin: '0 0 0.65rem',
            }}>Keep the Kampong<br/>spirit alive.</p>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.78rem',
              color: 'rgba(245,240,232,0.6)', lineHeight: 1.7, margin: '0 0 1.5rem',
            }}>
              1 more donation = another student fully equipped for their CCA journey.
            </p>
            <button onClick={() => navigate('/donate')} style={{
              background: 'none', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 0,
              padding: '0.75rem 1.25rem',
              fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 500,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'var(--color-cream)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              transition: 'background 0.2s, border-color 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
            >
              Donate Another Item <Arrow size={12} color="var(--color-cream)"/>
            </button>
          </div>

          {/* ── Per-item breakdown ── */}
          <div style={{ border: '1px solid var(--color-border)', background: 'var(--color-cream-card)' }}>
            <div style={{
              padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '0.62rem', fontWeight: 600,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                color: 'var(--color-ink-mid)', margin: 0,
              }}>Item Breakdown</p>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: '0.7rem', fontStyle: 'italic',
                color: 'var(--color-ink-light)',
              }}>3 items</span>
            </div>

            {history.map((d, i) => (
              <div key={i} style={{
                padding: '0.85rem 1.25rem',
                borderBottom: i < history.length - 1 ? '1px solid var(--color-border-light)' : 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                animation: `dashFadeUp 0.38s ease ${0.1 * i}s both`,
              }}>
                <div>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 500,
                    color: 'var(--color-ink)', margin: '0 0 0.15rem',
                  }}>{d.item}</p>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.65rem',
                    color: 'var(--color-ink-light)', margin: 0,
                  }}>{d.co2}kg CO₂ · {d.school}</p>
                </div>
                {/* Mini progress bar */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }}>
                  <span style={{
                    fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontStyle: 'italic',
                    color: 'var(--color-ink)',
                  }}>{d.co2}kg</span>
                  <div style={{ width: 48, height: 3, background: 'var(--color-border)' }}>
                    <div style={{
                      height: '100%',
                      width: `${(d.co2 / 3.2) * 100}%`,
                      background: d.grade === 'Grade A' ? 'var(--color-sage-dark)' : 'var(--color-amber-accent)',
                    }}/>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Privacy note ── */}
          <div style={{
            background: 'var(--color-sage-pale)',
            border: '1px solid var(--color-sage-mid)',
            padding: '1.1rem 1.25rem',
            display: 'flex', gap: '0.85rem', alignItems: 'flex-start',
          }}>
            <div style={{
              width: 28, height: 28, border: '1px solid var(--color-sage)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="var(--color-sage-dark)" strokeWidth="1.8" strokeLinecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.72rem',
              color: 'var(--color-ink-mid)', margin: 0, lineHeight: 1.65,
            }}>
              Recipient pickups are fully anonymous. Your name is never revealed at any stage.
            </p>
          </div>
        </aside>
      </main>

      <style>{`
        @keyframes dashFadeUp {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes dashBarGrow {
          from { width: 0; }
        }

        /* Stat grid — 3 cols on md+ */
        .dash-stat-grid {
          grid-template-columns: 1fr;
        }
        @media (min-width: 480px) {
          .dash-stat-grid { grid-template-columns: repeat(3, 1fr); }
        }

        /* Main two-col layout on desktop */
        .dash-layout {
          grid-template-columns: 1fr;
          align-items: start;
        }
        @media (min-width: 900px) {
          .dash-layout { grid-template-columns: 1fr 380px; gap: 3.5rem; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
