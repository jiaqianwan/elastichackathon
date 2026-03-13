import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/* ── SVG Logo mark — thin geometric line art ─────────────────── */
const LogoMark = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect x="2" y="2" width="20" height="20" stroke="var(--color-ink)" strokeWidth="1.2"/>
    <rect x="14" y="14" width="20" height="20" stroke="var(--color-ink)" strokeWidth="1.2"/>
    <line x1="2" y1="2" x2="14" y2="14" stroke="var(--color-ink)" strokeWidth="1.2"/>
  </svg>
);

/* ── Arrow icon ──────────────────────────────────────────────── */
const Arrow = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.5" strokeLinecap="round">
    <path d="M5 12h14M13 6l6 6-6 6"/>
  </svg>
);

/* ── Nav links ───────────────────────────────────────────────── */
const navLinks = [
  { label: 'Donate',     route: '/donate'     },
  { label: 'Request',    route: '/request'    },
  { label: 'Dashboard',  route: '/dashboard'  },
  { label: 'Collection', route: '/collection' },
];

/* ── Action cards ────────────────────────────────────────────── */
const navItems = [
  { label: 'Donate Gear',       sub: 'Snap a photo · AI grades instantly',  route: '/donate',     num: '01', tag: 'AI-Graded' },
  { label: 'Request Items',     sub: 'Find verified CCA gear near you',      route: '/request',    num: '02', tag: 'Verified'  },
  { label: 'Impact Dashboard',  sub: 'CO₂ saved · cost impact · history',   route: '/dashboard',  num: '03', tag: 'Stats'     },
  { label: 'My Pickups',        sub: 'QR codes for private collection',      route: '/collection', num: '04', tag: 'Private'   },
];

/* ════════════════════════════════════════════════════════════════
   HOME
════════════════════════════════════════════════════════════════ */
const Home = () => {
  const navigate = useNavigate();
  const [mounted,     setMounted]     = useState(false);
  const [hoveredNav,  setHoveredNav]  = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => { setTimeout(() => setMounted(true), 40); }, []);

  return (
    <div style={{
      background: 'var(--color-cream)',
      minHeight:  '100vh',
      fontFamily: 'var(--font-body)',
      position:   'relative',
      overflowX:  'hidden',
    }}>

      {/* ── Full-page grain overlay ── */}
      <div aria-hidden="true" style={{
        position:  'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        opacity:   0.042,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat', backgroundSize: '256px 256px',
      }}/>

      {/* ══ NAV ══════════════════════════════════════════════════ */}
      <nav style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.75rem 2.5rem',
        maxWidth: 1200, margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}
          onClick={() => navigate('/')}>
          <LogoMark />
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: '0.72rem',
            letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-ink)',
          }}>Secondhand Heros</span>
        </div>

        <div className="shh-nav-links">
          {navLinks.map(l => (
            <button key={l.route} onClick={() => navigate(l.route)}
              onMouseEnter={() => setHoveredNav(l.route)}
              onMouseLeave={() => setHoveredNav(null)}
              style={{
                background: 'none', border: 'none',
                fontFamily: 'var(--font-body)', fontSize: '0.7rem',
                fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase',
                color:      hoveredNav === l.route ? 'var(--color-sage-dark)' : 'var(--color-ink-mid)',
                cursor:     'pointer', padding: '0.25rem 0',
                borderBottom: hoveredNav === l.route
                  ? '1px solid var(--color-sage-dark)' : '1px solid transparent',
                transition: 'color 0.2s, border-color 0.2s',
              }}>{l.label}</button>
          ))}
        </div>

        <div style={{
          fontFamily: 'var(--font-body)', fontSize: '0.67rem',
          fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'var(--color-ink-light)',
          display: 'flex', alignItems: 'center', gap: '0.4rem',
        }}>
          <span style={{
            width: 5, height: 5, borderRadius: '50%',
            background: 'var(--color-sage)', display: 'inline-block',
          }}/>
          Singapore
        </div>
      </nav>

      {/* ══ HERO ═════════════════════════════════════════════════ */}
      <header style={{
        position: 'relative', zIndex: 5,
        maxWidth: 1200, margin: '0 auto',
        padding: '2.5rem 2.5rem 0',
      }}>
        <div className="shh-hero-grid">

          {/* ── Left: text ── */}
          <div style={{ paddingTop: '1.5rem' }}>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.63rem', fontWeight: 500,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'var(--color-sage-dark)', margin: '0 0 1.5rem',
            }}>Pass on your passion for a second chance · Singapore 2025</p>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.8rem, 6vw, 5rem)',
              fontWeight: 400, fontStyle: 'italic',
              color: 'var(--color-ink)',
              lineHeight: 1.06, letterSpacing: '-0.01em',
              margin: '0 0 2rem',
            }}>
              SecondHand<br/>
              {' '}Heros
            </h1>

            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 400,
              color: 'var(--color-ink-mid)', lineHeight: 1.8,
              maxWidth: 340, margin: '0 0 2.5rem',
            }}>
              Bridging the gap between students who have and those who need.
              Verified CCA gear, passed forward with dignity. No questions asked.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/donate')}
                className="shh-cta-btn"
                style={{
                  background: 'none', border: '1px solid var(--color-ink)', borderRadius: 0,
                  padding: '0.75rem 1.75rem',
                  fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 500,
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: 'var(--color-ink)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  transition: 'background 0.2s, color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-ink)'; e.currentTarget.style.color = 'var(--color-cream)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--color-ink)'; }}
              >
                Get Started <Arrow size={13}/>
              </button>

              <button onClick={() => navigate('/request')}
                style={{
                  background: 'none', border: 'none',
                  fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 500,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: 'var(--color-ink-light)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: 0, transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-sage-dark)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-ink-light)'}
              >
                —— Browse Gear
              </button>
            </div>

            {/* Stats */}
            <div style={{
              display: 'flex', gap: '2.5rem', flexWrap: 'wrap',
              marginTop: '3.5rem', paddingTop: '2rem',
              borderTop: '1px solid var(--color-border)',
            }}>
              {[
                { val: '12.4kg', label: 'CO₂ saved'      },
                { val: '$450',   label: 'peer savings'    },
                { val: '3',      label: 'items matched'   },
              ].map(s => (
                <div key={s.label}>
                  <p style={{
                    fontFamily: 'var(--font-display)', fontSize: '1.55rem',
                    fontWeight: 400, color: 'var(--color-ink)',
                    margin: '0 0 0.15rem', lineHeight: 1,
                  }}>{s.val}</p>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.6rem', fontWeight: 500,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: 'var(--color-ink-light)', margin: 0,
                  }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: editorial image block ── */}
          <div className="shh-image-block" style={{ position: 'relative', paddingTop: '1rem' }}>
            {/* Offset border frame */}
            <div style={{
              position: 'absolute', top: '2.5rem', left: '1.5rem',
              right: '-1.5rem', bottom: '-1.5rem',
              border: '1px solid var(--color-sage)', zIndex: 1, pointerEvents: 'none',
            }}/>

            {/* Image */}
            <div style={{
              position: 'relative', zIndex: 2,
              aspectRatio: '4/5', overflow: 'hidden',
              background: 'var(--color-sage-pale)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: '0.75rem',
            }}>
              <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                <rect x="4" y="4" width="44" height="44" rx="2"
                  stroke="var(--color-sage-dark)" strokeWidth="1" strokeDasharray="4 4"/>
                <path d="M14 38 L22 28 L28 33 L34 24 L42 38 Z"
                  fill="none" stroke="var(--color-sage-dark)" strokeWidth="1"/>
                <circle cx="20" cy="21" r="4"
                  stroke="var(--color-sage-dark)" strokeWidth="1" fill="none"/>
              </svg>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '0.6rem', fontWeight: 500,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'var(--color-sage-dark)', margin: 0,
              }}>Your image here</p>
            </div>

            {/* Floating caption tag */}
            <div style={{
              position: 'absolute', bottom: '2rem', left: '-2rem', zIndex: 3,
              background: 'var(--color-cream)', border: '1px solid var(--color-border)',
              padding: '0.6rem 1.1rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-sage-dark)' }}/>
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: '0.6rem', fontWeight: 500,
                letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-ink-mid)',
              }}>Let's make it reality.</span>
            </div>
          </div>
        </div>
      </header>

      {/* ══ ACTION CARDS ══════════════════════════════════════════ */}
      <section style={{
        position: 'relative', zIndex: 5,
        maxWidth: 1200, margin: '6rem auto 0',
        padding: '0 2.5rem',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem',
        }}>
          <div style={{ width: 28, height: '1px', background: 'var(--color-sage-dark)' }}/>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.6rem', fontWeight: 500,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'var(--color-sage-dark)', margin: 0,
          }}>What would you like to do?</p>
        </div>

        <div className="shh-card-grid">
          {navItems.map((item, i) => {
            const isHov = hoveredCard === i;
            return (
              <div key={item.route}
                onClick={() => navigate(item.route)}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  position:   'relative',
                  background: isHov ? 'var(--color-sage-pale)' : 'var(--color-cream-card)',
                  border:     `1px solid ${isHov ? 'var(--color-sage)' : 'var(--color-border)'}`,
                  borderRadius: 0, padding: '1.75rem', cursor: 'pointer',
                  transition: 'background 0.25s, border-color 0.25s, transform 0.22s',
                  transform:  isHov ? 'translateY(-3px)' : 'none',
                  animation:  mounted ? `shhFadeUp 0.4s ease ${0.07 * i}s both` : 'none',
                  display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: 180,
                  overflow: 'hidden',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{
                    fontFamily: 'var(--font-display)', fontSize: '0.8rem',
                    fontStyle: 'italic', color: 'var(--color-ink-light)',
                  }}>{item.num}</span>
                  <span style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.57rem', fontWeight: 500,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: 'var(--color-sage-dark)', border: '1px solid var(--color-sage)',
                    padding: '0.18rem 0.55rem', borderRadius: '999px',
                  }}>{item.tag}</span>
                </div>

                <p style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 400,
                  color: 'var(--color-ink)', margin: '0.2rem 0 0', lineHeight: 1.25, flex: 1,
                }}>{item.label}</p>

                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-end', marginTop: 'auto',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.74rem', fontWeight: 400,
                    color: 'var(--color-ink-light)', margin: 0,
                    lineHeight: 1.6, maxWidth: '68%',
                  }}>{item.sub}</p>

                  <div style={{
                    width: 30, height: 30,
                    border: `1px solid ${isHov ? 'var(--color-sage-dark)' : 'var(--color-border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, transition: 'border-color 0.2s, transform 0.22s',
                    transform: isHov ? 'rotate(-45deg)' : 'none',
                  }}>
                    <Arrow size={12} color={isHov ? 'var(--color-sage-dark)' : 'var(--color-ink-light)'}/>
                  </div>
                </div>

                {/* Bottom sage accent on hover */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
                  background: 'var(--color-sage)',
                  transform: isHov ? 'scaleX(1)' : 'scaleX(0)',
                  transformOrigin: 'left', transition: 'transform 0.3s ease',
                }}/>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════════ */}
      <footer style={{
        position: 'relative', zIndex: 5,
        maxWidth: 1200, margin: '5rem auto 0',
        padding: '2rem 2.5rem 3rem',
        borderTop: '1px solid var(--color-border)',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
      }}>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '0.6rem', fontWeight: 500,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: 'var(--color-ink-light)', margin: 0,
        }}>Dignified · Verified · Sustainable</p>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '0.6rem',
          color: 'var(--color-ink-light)', margin: 0,
        }}>SecondHand Heros © 2025</p>
      </footer>

      <style>{`
        @keyframes shhFadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .shh-hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: start;
        }
        .shh-image-block { display: none; }
        @media (min-width: 900px) {
          .shh-hero-grid { grid-template-columns: 1fr 1fr; }
          .shh-image-block { display: block; }
        }
        .shh-card-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1px;
          background: var(--color-border);
          border: 1px solid var(--color-border);
        }
        @media (min-width: 600px) {
          .shh-card-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 1024px) {
          .shh-card-grid { grid-template-columns: repeat(4, 1fr); }
        }
        .shh-nav-links {
          display: none;
          align-items: center;
          gap: 2rem;
        }
        @media (min-width: 768px) {
          .shh-nav-links { display: flex; }
        }
      `}</style>
    </div>
  );
};

export default Home;
