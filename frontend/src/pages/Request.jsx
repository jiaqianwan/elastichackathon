import React, { useState, useEffect } from 'react';
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

/* ── Inline SVG icons (no lucide dependency needed for these) ── */
const SearchIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.5" strokeLinecap="round">
    <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
  </svg>
);

const ChevronIcon = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.5" strokeLinecap="round">
    <path d="M6 9l6 6 6-6"/>
  </svg>
);

/* ── Select wrapper ──────────────────────────────────────────── */
const SelectField = ({ value, onChange, children, label }) => (
  <div style={{ position: 'relative', flex: 1, minWidth: 110 }}>
    <label style={{
      display: 'block',
      fontFamily: 'var(--font-body)', fontSize: '0.55rem', fontWeight: 600,
      letterSpacing: '0.18em', textTransform: 'uppercase',
      color: 'var(--color-ink-light)', marginBottom: '0.35rem',
    }}>{label}</label>
    <div style={{ position: 'relative' }}>
      <select value={value} onChange={onChange} style={{
        width: '100%', appearance: 'none',
        background: 'var(--color-cream-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 0,
        padding: '0.65rem 2rem 0.65rem 0.85rem',
        fontFamily: 'var(--font-body)', fontSize: '0.78rem',
        color: 'var(--color-ink)', cursor: 'pointer', outline: 'none',
        transition: 'border-color 0.2s',
      }}
        onFocus={e => e.target.style.borderColor = 'var(--color-sage-dark)'}
        onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
      >
        {children}
      </select>
      <div style={{
        position: 'absolute', right: '0.7rem', top: '50%', transform: 'translateY(-50%)',
        pointerEvents: 'none',
      }}>
        <ChevronIcon size={12} color="var(--color-ink-light)"/>
      </div>
    </div>
  </div>
);

/* ── Result card ─────────────────────────────────────────────── */
const GearCard = ({ hit, index }) => {
  const [hovered, setHovered] = useState(false);
  const item = hit._source;
  const isA  = item.grade === 'Grade A';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--color-sage-pale)' : 'var(--color-cream-card)',
        border: `1px solid ${hovered ? 'var(--color-sage)' : 'var(--color-border)'}`,
        borderRadius: 0,
        padding: '1.5rem',
        cursor: 'pointer',
        transition: 'background 0.22s, border-color 0.22s, transform 0.22s',
        transform: hovered ? 'translateY(-3px)' : 'none',
        animation: `reqFadeUp 0.38s ease ${0.06 * index}s both`,
        display: 'flex', flexDirection: 'column', gap: '0.85rem',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {/* Grade accent bar */}
        <div style={{
          width: 3, height: 36, flexShrink: 0,
          background: isA ? 'var(--color-sage-dark)' : 'var(--color-amber-accent)',
          position: 'absolute', top: 0, left: 0, bottom: 0, height: '100%',
        }}/>
        <div style={{ paddingLeft: '0.75rem' }}>
          <p style={{
            fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontStyle: 'italic',
            color: 'var(--color-ink)', margin: '0 0 0.2rem', lineHeight: 1.2,
          }}>{item.name || 'Unnamed Item'}</p>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.65rem',
            color: 'var(--color-ink-light)', margin: 0,
          }}>{item.school || 'Unknown School'}</p>
        </div>
        <span className={isA ? 'badge-grade-a' : 'badge-grade-b'} style={{ flexShrink: 0 }}>
          {item.grade || 'Ungraded'}
        </span>
      </div>

      {/* Description */}
      {item.description && (
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '0.76rem',
          color: 'var(--color-ink-mid)', margin: 0, lineHeight: 1.7,
          paddingLeft: '0.75rem',
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{item.description}</p>
      )}

      {/* Bottom row */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingLeft: '0.75rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid var(--color-border-light)',
      }}>
        <div style={{
          background: 'var(--color-sage-pale)',
          border: '1px solid var(--color-sage-mid)',
          padding: '0.2rem 0.65rem',
          fontFamily: 'var(--font-body)', fontSize: '0.62rem', fontWeight: 600,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'var(--color-sage-dark)',
        }}>
          {item.co2_saved || 0}kg CO₂ saved
        </div>

        <div style={{
          width: 28, height: 28,
          border: `1px solid ${hovered ? 'var(--color-sage-dark)' : 'var(--color-border)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'border-color 0.2s, transform 0.2s',
          transform: hovered ? 'rotate(-45deg)' : 'none',
        }}>
          <Arrow size={11} color={hovered ? 'var(--color-sage-dark)' : 'var(--color-ink-light)'}/>
        </div>
      </div>
    </div>
  );
};

/* ── Skeleton loader ─────────────────────────────────────────── */
const SkeletonCard = ({ index }) => (
  <div style={{
    border: '1px solid var(--color-border)',
    background: 'var(--color-cream-card)',
    padding: '1.5rem',
    display: 'flex', flexDirection: 'column', gap: '0.85rem',
    animation: `reqShimmer 1.6s ease-in-out ${0.15 * index}s infinite`,
  }}>
    {[80, 55, 100, 40].map((w, i) => (
      <div key={i} style={{
        height: i === 0 ? 18 : 13,
        width: `${w}%`,
        background: 'var(--color-border)',
        borderRadius: 0,
      }}/>
    ))}
  </div>
);

/* ════════════════════════════════════════════════════════════════
   REQUEST PAGE
════════════════════════════════════════════════════════════════ */
const RequestPage = () => {
  const navigate = useNavigate();

  const [query,   setQuery]   = useState('');
  const [school,  setSchool]  = useState('All');
  const [grade,   setGrade]   = useState('All');
  const [sortBy,  setSortBy]  = useState('relevance');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const schools = ['All', 'RI', 'HCI', 'NYP', 'VJC', 'ACJC'];
  const grades  = ['All', 'Grade A', 'Grade B'];

  const fetchGear = async (q = '', s = 'All', g = 'All', sort = 'relevance') => {
    setLoading(true);
    setSearched(true);
    try {
      const params  = new URLSearchParams({ query: q, school: s, grade: g, sort_by: sort });
      const fullUrl = `/api/matches/search?${params.toString()}`;
      console.log('🌐 API CALL:', fullUrl);
      const response = await fetch(fullUrl);
      if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
      const data = await response.json();
      console.log('📦 RAW DATA RECEIVED:', data);
      setResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('❌ FETCH FAILED:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGear(query, school, grade, sortBy); }, [school, grade, sortBy]);

  const handleSearch = (e) => { e.preventDefault(); fetchGear(query, school, grade, sortBy); };

  const handleReset = () => {
    setQuery(''); setSchool('All'); setGrade('All'); setSortBy('relevance');
    setResults([]); setSearched(false);
  };

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
        alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem',
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
            Request<br/>
            <span style={{ fontStyle: 'normal' }}>Gear.</span>
          </h1>
        </div>

        {/* Result count pill */}
        {searched && !loading && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            animation: 'reqFadeUp 0.3s ease both',
          }}>
            <div style={{ width: 6, height: 6, background: results.length > 0 ? 'var(--color-sage-dark)' : 'var(--color-ink-light)', borderRadius: '50%' }}/>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 500,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--color-ink-light)',
            }}>
              {results.length} {results.length === 1 ? 'item' : 'items'} found
            </span>
          </div>
        )}
      </header>

      {/* ══ SEARCH BAR ═══════════════════════════════════════════ */}
      <div style={{
        position: 'relative', zIndex: 5,
        maxWidth: 1200, margin: '2.5rem auto 0',
        padding: '0 2.5rem',
      }}>
        <form onSubmit={handleSearch}>
          <div style={{
            border: '1px solid var(--color-border)',
            background: 'var(--color-cream-card)',
            padding: '1.25rem 1.5rem',
            display: 'flex', flexDirection: 'column', gap: '1.25rem',
          }}>
            {/* Search input row */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'block',
                  fontFamily: 'var(--font-body)', fontSize: '0.55rem', fontWeight: 600,
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: 'var(--color-ink-light)', marginBottom: '0.35rem',
                }}>Search</label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute', left: '0.85rem', top: '50%',
                    transform: 'translateY(-50%)', pointerEvents: 'none',
                  }}>
                    <SearchIcon size={15} color="var(--color-ink-light)"/>
                  </div>
                  <input
                    type="text"
                    placeholder="Fencing foil, school blazer, basketball…"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    style={{
                      width: '100%', outline: 'none',
                      background: 'var(--color-cream)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 0,
                      padding: '0.65rem 1rem 0.65rem 2.4rem',
                      fontFamily: 'var(--font-body)', fontSize: '0.88rem',
                      color: 'var(--color-ink)',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--color-sage-dark)'}
                    onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                  />
                </div>
              </div>

              {/* Submit */}
              <button type="submit" style={{
                background: 'var(--color-ink)', border: 'none', borderRadius: 0,
                padding: '0.65rem 1.75rem',
                fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'var(--color-cream)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                transition: 'background 0.2s',
                whiteSpace: 'nowrap', alignSelf: 'flex-end',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--color-sage-deep)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--color-ink)'}
              >
                Find <Arrow size={12} color="var(--color-cream)"/>
              </button>
            </div>

            {/* Filter row */}
            <div style={{
              display: 'flex', gap: '1rem', flexWrap: 'wrap',
              paddingTop: '1rem',
              borderTop: '1px solid var(--color-border-light)',
            }}>
              <SelectField label="School" value={school} onChange={e => setSchool(e.target.value)}>
                {schools.map(s => <option key={s} value={s}>{s === 'All' ? 'All Schools' : s}</option>)}
              </SelectField>

              <SelectField label="Grade" value={grade} onChange={e => setGrade(e.target.value)}>
                {grades.map(g => <option key={g} value={g}>{g === 'All' ? 'All Grades' : g}</option>)}
              </SelectField>

              <SelectField label="Sort By" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="relevance">Relevance</option>
                <option value="co2">Max CO₂ Saved</option>
                <option value="grade">Grade (A → B)</option>
              </SelectField>

              {/* Active filter chips */}
              {(school !== 'All' || grade !== 'All') && (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {school !== 'All' && (
                    <div style={{
                      background: 'var(--color-sage-pale)', border: '1px solid var(--color-sage-mid)',
                      padding: '0.3rem 0.6rem',
                      fontFamily: 'var(--font-body)', fontSize: '0.62rem', fontWeight: 600,
                      letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-sage-dark)',
                      display: 'flex', alignItems: 'center', gap: '0.4rem',
                    }}>
                      {school}
                      <button onClick={() => setSchool('All')} style={{
                        background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                        color: 'var(--color-sage-dark)', lineHeight: 1, fontSize: '0.8rem',
                      }}>×</button>
                    </div>
                  )}
                  {grade !== 'All' && (
                    <div style={{
                      background: 'var(--color-sage-pale)', border: '1px solid var(--color-sage-mid)',
                      padding: '0.3rem 0.6rem',
                      fontFamily: 'var(--font-body)', fontSize: '0.62rem', fontWeight: 600,
                      letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-sage-dark)',
                      display: 'flex', alignItems: 'center', gap: '0.4rem',
                    }}>
                      {grade}
                      <button onClick={() => setGrade('All')} style={{
                        background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                        color: 'var(--color-sage-dark)', lineHeight: 1, fontSize: '0.8rem',
                      }}>×</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* ══ RESULTS ══════════════════════════════════════════════ */}
      <section style={{
        position: 'relative', zIndex: 5,
        maxWidth: 1200, margin: '2.5rem auto 0',
        padding: '0 2.5rem 5rem',
      }}>
        {loading ? (
          /* Skeleton grid */
          <div className="req-grid">
            {[0, 1, 2, 3, 4, 5].map(i => <SkeletonCard key={i} index={i}/>)}
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="req-grid">
              {results.map((hit, i) => (
                <GearCard key={hit._id || i} hit={hit} index={i}/>
              ))}
            </div>
          </>
        ) : searched ? (
          /* Empty state */
          <div style={{
            border: '1.5px dashed var(--color-border)',
            padding: '4rem 2rem',
            textAlign: 'center',
            animation: 'reqFadeUp 0.35s ease both',
          }}>
            <p style={{
              fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontStyle: 'italic',
              color: 'var(--color-ink-light)', margin: '0 0 0.5rem',
            }}>No gear found.</p>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.78rem',
              color: 'var(--color-ink-light)', margin: '0 0 1.5rem', lineHeight: 1.65,
            }}>
              Try different keywords, or remove filters to browse everything available.
            </p>
            <button onClick={handleReset} style={{
              background: 'none', border: '1px solid var(--color-ink)', borderRadius: 0,
              padding: '0.7rem 1.5rem',
              fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'var(--color-ink)', cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-ink)'; e.currentTarget.style.color = 'var(--color-cream)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--color-ink)'; }}
            >
              Reset &amp; Browse All
            </button>
          </div>
        ) : (
          /* Pre-search state */
          <div style={{
            border: '1px solid var(--color-border-light)',
            background: 'var(--color-cream-card)',
            padding: '3rem 2rem', textAlign: 'center',
          }}>
            <p style={{
              fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontStyle: 'italic',
              color: 'var(--color-ink-light)', margin: '0 0 0.4rem',
            }}>Find what you need with dignity.</p>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.75rem',
              color: 'var(--color-ink-light)', margin: 0,
            }}>Search above or select a filter to browse available gear.</p>
          </div>
        )}
      </section>

      <style>{`
        @keyframes reqFadeUp {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes reqShimmer {
          0%,100% { opacity: 0.6; }
          50%      { opacity: 1; }
        }
        .req-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1px;
          background: var(--color-border);
          border: 1px solid var(--color-border);
        }
        @media (min-width: 600px) {
          .req-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 1024px) {
          .req-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </div>
  );
};

export default RequestPage;
