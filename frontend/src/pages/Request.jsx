import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpDown, Leaf, GraduationCap, X, Calendar, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ── Shared primitives ───────────────────────────────────────── */
const LogoMark = () => (
  <svg width="30" height="30" viewBox="0 0 36 36" fill="none">
    <rect x="2" y="2" width="20" height="20" stroke="var(--color-ink)" strokeWidth="1.2"/>
    <rect x="14" y="14" width="20" height="20" stroke="var(--color-ink)" strokeWidth="1.2"/>
    <line x1="2" y1="2" x2="14" y2="14" stroke="var(--color-ink)" strokeWidth="1.2"/>
  </svg>
);

const Arrow = ({ size = 13, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.5" strokeLinecap="round">
    <path d="M5 12h14M13 6l6 6-6 6"/>
  </svg>
);

const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="var(--color-ink-light)" strokeWidth="1.5" strokeLinecap="round">
    <path d="M6 9l6 6 6-6"/>
  </svg>
);

/* ── Custom select ───────────────────────────────────────────── */
const SelectField = ({ label, value, onChange, children }) => (
  <div style={{ flex: 1, minWidth: 110 }}>
    {label && (
      <label style={{
        display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.55rem', fontWeight: 600,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        color: 'var(--color-ink-light)', marginBottom: '0.3rem',
      }}>{label}</label>
    )}
    <div style={{ position: 'relative' }}>
      <select value={value} onChange={onChange} style={{
        width: '100%', appearance: 'none', borderRadius: 0,
        background: 'var(--color-cream)', border: '1px solid var(--color-border)',
        padding: '0.65rem 2rem 0.65rem 0.85rem',
        fontFamily: 'var(--font-body)', fontSize: '0.78rem',
        color: 'var(--color-ink)', cursor: 'pointer', outline: 'none',
        transition: 'border-color 0.18s',
      }}
        onFocus={e => e.target.style.borderColor = 'var(--color-sage-dark)'}
        onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
      >{children}</select>
      <div style={{
        position: 'absolute', right: '0.65rem', top: '50%',
        transform: 'translateY(-50%)', pointerEvents: 'none',
      }}><ChevronDown/></div>
    </div>
  </div>
);

/* ── Gear card ───────────────────────────────────────────────── */
const GearCard = ({ item, index, onClick }) => {
  const [hov, setHov] = useState(false);
  const isA = item.grade === 'Grade A';

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:   hov ? 'var(--color-sage-pale)'  : 'var(--color-cream-card)',
        border:       `1px solid ${hov ? 'var(--color-sage)' : 'var(--color-border)'}`,
        borderRadius: 0, padding: '1.5rem', cursor: 'pointer',
        transform:    hov ? 'translateY(-3px)' : 'none',
        transition:   'background 0.2s, border-color 0.2s, transform 0.2s',
        animation:    `reqFadeUp 0.38s ease ${Math.min(0.06 * index, 0.36)}s both`,
        display: 'flex', flexDirection: 'column', gap: '0.85rem',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Grade accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: 3,
        background: isA ? 'var(--color-sage-dark)' : 'var(--color-amber-accent)',
      }}/>

      {/* Top row */}
      <div style={{ paddingLeft: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{
            fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontStyle: 'italic',
            color: 'var(--color-ink)', margin: '0 0 0.2rem', lineHeight: 1.2,
          }}>{item.name || 'Unnamed Item'}</p>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.65rem',
            color: 'var(--color-ink-light)', margin: 0,
          }}>{item.school || 'Unknown School'}{item.category ? ` · ${item.category}` : ''}</p>
        </div>
        <span className={isA ? 'badge-grade-a' : 'badge-grade-b'} style={{ flexShrink: 0 }}>
          {item.grade || 'Ungraded'}
        </span>
      </div>

      {/* Description */}
      {item.description && (
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '0.76rem',
          color: 'var(--color-ink-mid)', margin: 0, lineHeight: 1.7, paddingLeft: '0.75rem',
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{item.description}</p>
      )}

      {/* Bottom row */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingLeft: '0.75rem', paddingTop: '0.75rem',
        borderTop: '1px solid var(--color-border-light)',
      }}>
        <span style={{
          background: 'var(--color-sage-pale)', border: '1px solid var(--color-sage-mid)',
          padding: '0.2rem 0.6rem',
          fontFamily: 'var(--font-body)', fontSize: '0.6rem', fontWeight: 600,
          letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-sage-dark)',
        }}>{item.co2_saved || 0}kg CO₂ saved</span>

        <div style={{
          width: 28, height: 28,
          border: `1px solid ${hov ? 'var(--color-sage-dark)' : 'var(--color-border)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: hov ? 'rotate(-45deg)' : 'none',
          transition: 'border-color 0.2s, transform 0.2s',
        }}>
          <Arrow size={11} color={hov ? 'var(--color-sage-dark)' : 'var(--color-ink-light)'}/>
        </div>
      </div>
    </div>
  );
};

/* ── Skeleton ────────────────────────────────────────────────── */
const SkeletonCard = ({ index }) => (
  <div style={{
    border: '1px solid var(--color-border)', background: 'var(--color-cream-card)',
    padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem',
    animation: `reqShimmer 1.6s ease-in-out ${0.15 * index}s infinite`,
  }}>
    {[80, 50, 100, 40].map((w, i) => (
      <div key={i} style={{ height: i === 0 ? 16 : 12, width: `${w}%`, background: 'var(--color-border)' }}/>
    ))}
  </div>
);

/* ── Item detail modal ───────────────────────────────────────── */
const ItemModal = ({ item, onClose, onRequest }) => {
  const isA = item.grade === 'Grade A';

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'rgba(28,26,21,0.65)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem', animation: 'reqFadeIn 0.2s ease both',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--color-cream)', border: '1px solid var(--color-border)',
        maxWidth: 680, width: '100%', maxHeight: '90vh', overflowY: 'auto',
        animation: 'reqSlideUp 0.28s ease both', position: 'relative',
      }}>

        {/* Image */}
        {item.image_data ? (
          <div style={{ height: 300, overflow: 'hidden', position: 'relative' }}>
            <img
              src={`data:${item.image_type || 'image/jpeg'};base64,${item.image_data}`}
              alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(245,240,232,0.55) 0%, transparent 55%)',
              pointerEvents: 'none',
            }}/>
          </div>
        ) : (
          <div style={{
            height: 220, background: 'var(--color-sage-pale)',
            border: '1.5px dashed var(--color-sage-mid)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
          }}>
            <ImageIcon size={44} color="var(--color-sage-mid)"/>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.62rem', fontWeight: 500,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'var(--color-sage-dark)', margin: 0,
            }}>No image available</p>
          </div>
        )}

        {/* Close button */}
        <button onClick={onClose} style={{
          position: 'absolute', top: 12, right: 12, width: 32, height: 32,
          background: 'var(--color-cream)', border: '1px solid var(--color-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'background 0.18s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--color-cream-warm)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--color-cream)'}
        >
          <X size={15} color="var(--color-ink)"/>
        </button>

        {/* Content */}
        <div style={{ padding: '1.75rem 2rem 1.5rem' }}>

          {/* Title + badges */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '0.58rem', fontWeight: 500,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                color: 'var(--color-ink-light)', margin: '0 0 0.35rem',
              }}>{item.category || 'School Equipment'}</p>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                fontStyle: 'italic', fontWeight: 400,
                color: 'var(--color-ink)', margin: 0, lineHeight: 1.1,
              }}>{item.name}</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'flex-end', flexShrink: 0 }}>
              <span className={isA ? 'badge-grade-a' : 'badge-grade-b'}>{item.grade}</span>
              {item.condition && (
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.62rem',
                  color: 'var(--color-ink-light)', border: '1px solid var(--color-border)',
                  padding: '0.12rem 0.5rem', borderRadius: '999px',
                }}>{item.condition}</span>
              )}
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.5rem' }}>
                <div style={{ width: 2, height: 13, background: 'var(--color-sage-dark)' }}/>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.58rem', fontWeight: 600,
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: 'var(--color-ink-mid)', margin: 0,
                }}>Description</p>
              </div>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '0.85rem',
                color: 'var(--color-ink-mid)', margin: 0, lineHeight: 1.75,
              }}>{item.description}</p>
            </div>
          )}

          {/* Details grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 1, background: 'var(--color-border)',
            border: '1px solid var(--color-border)',
            marginBottom: '1.5rem',
          }}>
            {[
              { label: 'School',        val: item.school,                      accent: false, icon: <GraduationCap size={13}/> },
              { label: 'CO₂ Impact',    val: `${item.co2_saved}kg saved`,      accent: true,  icon: <Leaf size={13}/>          },
              { label: 'Quality Score', val: `${item.quality_score || 'N/A'}/10`, accent: false, icon: <Filter size={13}/>    },
              { label: 'Listed',        val: item.created_at
                  ? new Date(item.created_at).toLocaleDateString()
                  : 'Recently',                                                 accent: false, icon: <Calendar size={13}/>     },
            ].map(s => (
              <div key={s.label} style={{
                padding: '1rem 1.25rem',
                background: s.accent ? 'var(--color-sage-pale)' : 'var(--color-cream-card)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: s.accent ? 'var(--color-sage-dark)' : 'var(--color-ink-light)' }}>
                    {s.icon}
                  </span>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.56rem', fontWeight: 600,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: s.accent ? 'var(--color-sage-dark)' : 'var(--color-ink-light)', margin: 0,
                  }}>{s.label}</p>
                </div>
                <p style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontStyle: 'italic',
                  color: 'var(--color-ink)', margin: 0, lineHeight: 1.1,
                }}>{s.val}</p>
              </div>
            ))}
          </div>

          {/* Request CTA */}
          <button onClick={onRequest} style={{
            width: '100%', border: 'none', borderRadius: 0, padding: '1rem',
            background: 'var(--color-ink)', color: 'var(--color-cream)',
            fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600,
            letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
            transition: 'background 0.2s', marginBottom: '1rem',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-sage-deep)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--color-ink)'}
          >
            <Sparkles size={14}/> Request This Item <Arrow size={12} color="var(--color-cream)"/>
          </button>

          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.68rem',
            color: 'var(--color-ink-light)', textAlign: 'center',
            lineHeight: 1.65, margin: 0,
          }}>
            By requesting, you agree to collect the item with dignity and care.<br/>
            Your identity remains private throughout the process.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   REQUEST PAGE
════════════════════════════════════════════════════════════════ */
const RequestPage = () => {
  const navigate = useNavigate();
  const [query,        setQuery]        = useState('');
  const [school,       setSchool]       = useState('All');
  const [grade,        setGrade]        = useState('All');
  const [sortBy,       setSortBy]       = useState('relevance');
  const [results,      setResults]      = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const schools = ['All', 'RI', 'HCI', 'NYP', 'VJC', 'ACJC'];
  const grades  = ['All', 'Grade A', 'Grade B'];

  /* ── All original API logic preserved verbatim ── */
  const fetchGear = async (q = '', s = 'All', g = 'All', sort = 'relevance') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        query: q,
        school: s === 'All' ? '' : s,
        grade: g === 'All' ? '' : g,
        sort_by: sort,
      });
      const fullUrl = `http://localhost:8000/api/matches/search?${params.toString()}`;
      console.log('🌐 API CALL:', fullUrl);
      const response = await fetch(fullUrl);
      if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
      const data = await response.json();
      console.log('📦 RAW DATA RECEIVED:', data);
      const items = Array.isArray(data) ? data : (data.hits || []);
      setResults(items);
    } catch (error) {
      console.error('❌ FETCH FAILED:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGear(query, school, grade, sortBy); }, [school, grade, sortBy]);

  const handleSearch = (e) => { e.preventDefault(); fetchGear(query, school, grade, sortBy); };

  const openDetails  = (item) => setSelectedItem(item);
  const closeDetails = ()     => setSelectedItem(null);

  const handleRequestItem = () => {
    const orderId    = `SHH-${Math.floor(1000 + Math.random() * 9000)}`;
    const validUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
    navigate('/collection', { state: { item: selectedItem, orderId, validUntil } });
  };

  return (
    <div style={{
      background: 'var(--color-cream)', minHeight: '100vh',
      fontFamily: 'var(--font-body)', position: 'relative', overflowX: 'hidden',
    }}>

      {/* Grain */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.042,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat', backgroundSize: '256px 256px',
      }}/>

      {/* ── Nav ── */}
      <nav style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.75rem 2.5rem', maxWidth: 1200, margin: '0 auto',
        borderBottom: '1px solid var(--color-border-light)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}
          onClick={() => navigate('/')}>
          <LogoMark/>
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: '0.72rem',
            letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-ink)',
          }}>Secondhand Heroes</span>
        </div>
        <button onClick={() => navigate('/')} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 500,
          letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-ink-light)',
          transition: 'color 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--color-ink)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--color-ink-light)'}
        >← Home</button>
      </nav>

      {/* ── Header ── */}
      <header style={{
        position: 'relative', zIndex: 5, maxWidth: 1200, margin: '0 auto',
        padding: '3.5rem 2.5rem 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        flexWrap: 'wrap', gap: '1.5rem',
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
            Request<br/><span style={{ fontStyle: 'normal' }}>Gear.</span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.88rem',
            color: 'var(--color-ink-light)', margin: '0.75rem 0 0', lineHeight: 1.65,
          }}>Browse quality items donated by your community</p>
        </div>

        {!loading && results.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-sage-dark)' }}/>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 500,
              letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-ink-light)',
            }}>
              Found <strong style={{ color: 'var(--color-ink)' }}>{results.length}</strong> items
            </span>
          </div>
        )}
      </header>

      {/* ── Search bar ── */}
      <div style={{ position: 'relative', zIndex: 5, maxWidth: 1200, margin: '2.5rem auto 0', padding: '0 2.5rem' }}>
        <form onSubmit={handleSearch}>
          <div style={{
            border: '1px solid var(--color-border)', background: 'var(--color-cream-card)',
            padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem',
          }}>
            {/* Text search row */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.55rem',
                  fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: 'var(--color-ink-light)', marginBottom: '0.3rem',
                }}>Search</label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute', left: '0.85rem', top: '50%',
                    transform: 'translateY(-50%)', pointerEvents: 'none',
                  }}>
                    <Search size={15} color="var(--color-ink-light)"/>
                  </div>
                  <input type="text"
                    placeholder="Search for backpacks, calculators, uniforms..."
                    value={query} onChange={e => setQuery(e.target.value)}
                    style={{
                      width: '100%', outline: 'none', borderRadius: 0,
                      background: 'var(--color-cream)', border: '1px solid var(--color-border)',
                      padding: '0.65rem 1rem 0.65rem 2.4rem',
                      fontFamily: 'var(--font-body)', fontSize: '0.88rem',
                      color: 'var(--color-ink)', transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--color-sage-dark)'}
                    onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                  />
                </div>
              </div>
              <button type="submit" style={{
                background: 'var(--color-ink)', border: 'none', borderRadius: 0,
                padding: '0.65rem 1.75rem', alignSelf: 'flex-end', whiteSpace: 'nowrap',
                fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'var(--color-cream)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--color-sage-deep)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--color-ink)'}
              >
                Search <Arrow size={12} color="var(--color-cream)"/>
              </button>
            </div>

            {/* Filter row */}
            <div style={{
              display: 'flex', gap: '1rem', flexWrap: 'wrap',
              paddingTop: '1rem', borderTop: '1px solid var(--color-border-light)',
              alignItems: 'flex-end',
            }}>
              <SelectField label="School" value={school} onChange={e => setSchool(e.target.value)}>
                {schools.map(s => <option key={s} value={s}>{s === 'All' ? 'All Schools' : s}</option>)}
              </SelectField>
              <SelectField label="Grade" value={grade} onChange={e => setGrade(e.target.value)}>
                {grades.map(g => <option key={g} value={g}>{g === 'All' ? 'All Grades' : g}</option>)}
              </SelectField>
              <SelectField label="Sort By" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="relevance">Relevance</option>
                <option value="co2">Max CO2 Saved</option>
                <option value="grade">Grade (A-Z)</option>
              </SelectField>
            </div>
          </div>
        </form>
      </div>

      {/* ── Results ── */}
      <section style={{
        position: 'relative', zIndex: 5, maxWidth: 1200,
        margin: '2.5rem auto 0', padding: '0 2.5rem 5rem',
      }}>
        {loading ? (
          <div className="req-grid">
            {[0,1,2,3,4,5].map(i => <SkeletonCard key={i} index={i}/>)}
          </div>
        ) : results.length > 0 ? (
          <div className="req-grid">
            {results.map((item, i) => (
              <GearCard
                key={item._id || item.id || i}
                item={item._source || item}
                index={i}
                onClick={() => openDetails(item._source || item)}
              />
            ))}
          </div>
        ) : (
          <div style={{
            border: '1.5px dashed var(--color-border)',
            padding: '4rem 2rem', textAlign: 'center',
          }}>
            <div style={{
              width: 52, height: 52, border: '1px solid var(--color-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem',
            }}>
              <Search size={22} color="var(--color-ink-light)"/>
            </div>
            <p style={{
              fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontStyle: 'italic',
              color: 'var(--color-ink-light)', margin: '0 0 0.4rem',
            }}>No items found</p>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.78rem',
              color: 'var(--color-ink-light)', margin: '0 0 1.5rem', lineHeight: 1.65,
            }}>Try adjusting your search or filters</p>
            <button onClick={() => { setQuery(''); setSchool('All'); setGrade('All'); }} style={{
              background: 'none', border: '1px solid var(--color-ink)', borderRadius: 0,
              padding: '0.7rem 1.5rem',
              fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'var(--color-ink)', cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-ink)'; e.currentTarget.style.color = 'var(--color-cream)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none';             e.currentTarget.style.color = 'var(--color-ink)'; }}
            >Reset Filters</button>
          </div>
        )}
      </section>

      {/* ── Modal ── */}
      {selectedItem && (
        <ItemModal item={selectedItem} onClose={closeDetails} onRequest={handleRequestItem}/>
      )}

      <style>{`
        @keyframes reqFadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes reqShimmer { 0%,100%{opacity:.6} 50%{opacity:1} }
        @keyframes reqFadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes reqSlideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
        .req-grid {
          display: grid; grid-template-columns: 1fr;
          gap: 1px; background: var(--color-border);
          border: 1px solid var(--color-border);
        }
        @media (min-width: 600px)  { .req-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 1024px) { .req-grid { grid-template-columns: repeat(3,1fr); } }
        input:focus, select:focus { outline: none; }
      `}</style>
    </div>
  );
};

export default RequestPage;
