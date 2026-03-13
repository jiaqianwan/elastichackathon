import React from 'react';

const history = [
  { item:'Fencing Foil',   grade:'Grade A', co2:3.2, status:'Completed', date:'8 Mar', school:'RI'   },
  { item:'ACS Blazer',     grade:'Grade B', co2:2.1, status:'Completed', date:'22 Feb', school:'ACJC' },
  { item:'Basketball',     grade:'Grade A', co2:1.8, status:'Pending',   date:'12 Mar', school:'HCI'  },
];

/* ── Big stat number component ───────────────────────────────── */
const BigStat = ({ value, unit, label, icon, bg, delay = 0 }) => (
  <div className="stat-card animate-fade-up" style={{ animationDelay:`${delay}s` }}>
    <div className="stat-icon" style={{ background:bg }}>
      <span style={{ fontSize:'1.4rem' }}>{icon}</span>
    </div>
    <div style={{ flex:1 }}>
      <p style={{ fontFamily:'var(--font-body)', fontSize:'0.65rem', fontWeight:800,
        letterSpacing:'0.14em', textTransform:'uppercase',
        color:'var(--color-tan-muted)', margin:'0 0 0.15rem' }}>{label}</p>
      <div style={{ display:'flex', alignItems:'baseline', gap:'0.3rem' }}>
        <span style={{ fontFamily:'var(--font-display)', fontSize:'2rem',
          color:'var(--color-ink)', lineHeight:1 }}>{value}</span>
        <span style={{ fontFamily:'var(--font-body)', fontSize:'0.8rem', fontWeight:800,
          color:'var(--color-ink-light)' }}>{unit}</span>
      </div>
    </div>
  </div>
);

/* ── Botanical corner ── */
const HeroLeaves = () => (
  <svg width="120" height="110" viewBox="0 0 120 110" fill="none"
    style={{ position:'absolute', top:0, right:0, opacity:0.2, pointerEvents:'none' }}>
    <path d="M120 0 C90 15 75 45 90 70 C98 85 115 88 120 72Z" fill="#C8D5A8"/>
    <path d="M120 0 C108 28 110 58 120 78" stroke="#C8D5A8" strokeWidth="2" strokeLinecap="round"/>
    <path d="M114 35 C104 30 98 20 100 8" stroke="#C8D5A8" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    <path d="M95 0 C78 8 70 28 80 46" fill="#C8D5A8" opacity="0.5"/>
    <circle cx="72" cy="4"  r="3" fill="#C8D5A8" opacity="0.4"/>
    <circle cx="60" cy="10" r="2" fill="#C8D5A8" opacity="0.3"/>
  </svg>
);

const Dashboard = () => (
  <div style={{ background:'var(--color-tan-warm)', minHeight:'100vh' }}>

    {/* ── Hero ── */}
    <header className="page-hero" style={{ paddingBottom:'5rem' }}>
      <HeroLeaves />

      {/* Decorative large bg number */}
      <div style={{ position:'absolute', right:'1rem', bottom:'0.5rem', zIndex:1,
        pointerEvents:'none' }}>
        <span style={{ fontFamily:'var(--font-display)', fontSize:'7rem', lineHeight:1,
          color:'rgba(255,255,255,0.07)', display:'block' }}>12.4</span>
        <span style={{ fontFamily:'var(--font-body)', fontSize:'0.7rem', fontWeight:800,
          color:'rgba(255,255,255,0.1)', letterSpacing:'0.15em',
          display:'block', textAlign:'right' }}>KG CO₂</span>
      </div>

      <div style={{ position:'relative', zIndex:5 }}>
        <p style={{ fontFamily:'var(--font-body)', fontSize:'0.75rem', fontWeight:800,
          color:'var(--color-olive-mist)', letterSpacing:'0.12em',
          textTransform:'uppercase', marginBottom:'0.75rem' }}>← Home</p>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'2.8rem',
          color:'var(--color-tan-warm)', margin:'0 0 0.4rem',
          textShadow:'2px 3px 0px rgba(46,61,24,0.4)' }}>Your Impact</h1>
        <p style={{ fontFamily:'var(--font-body)', fontSize:'0.875rem',
          color:'var(--color-olive-mist)', fontWeight:600 }}>
          Every donation counts. Here's yours.
        </p>
      </div>
    </header>

    <main style={{ padding:'0 1.25rem 3rem', maxWidth:560, margin:'0 auto' }}>

      {/* ── Stats ── */}
      <div style={{ marginTop:'-1.75rem', display:'flex', flexDirection:'column', gap:'0.85rem' }}>
        <BigStat value="12.4" unit="kg CO₂ saved" label="Environment"   icon="🌿" bg="var(--color-olive-pale)"  delay={0}    />
        <BigStat value="$450" unit="saved for peers" label="Social Equity" icon="💛" bg="var(--color-amber-pale)" delay={0.07} />
        <BigStat value="3"    unit="items · 2 matched" label="Donations"   icon="📦" bg="var(--color-tan-warm)"   delay={0.14} />
      </div>

      {/* ── History ── */}
      <div style={{ marginTop:'2.25rem' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
          marginBottom:'0.85rem' }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.3rem',
            color:'var(--color-ink)', margin:0 }}>Donation History</h2>
          <span style={{ fontFamily:'var(--font-body)', fontSize:'0.75rem', fontWeight:800,
            color:'var(--color-olive-mid)', cursor:'pointer', textDecoration:'underline' }}>
            See all →
          </span>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'0.7rem' }}>
          {history.map((d, i) => (
            <div key={i} className="hero-card animate-fade-up"
              style={{ padding:'0.9rem 1rem', animationDelay:`${0.06*i}s`,
                display:'flex', alignItems:'center', gap:'0.85rem' }}>

              {/* Left icon */}
              <div style={{ width:44, height:44, borderRadius:'0.875rem', flexShrink:0,
                background: d.grade==='Grade A' ? 'var(--color-olive-pale)' : 'var(--color-amber-pale)',
                border:`2px solid ${d.grade==='Grade A' ? 'var(--color-olive-mist)' : '#E8C898'}`,
                display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24"
                  fill={d.grade==='Grade A' ? 'var(--color-olive-mid)' : 'var(--color-amber-accent)'}>
                  <path d="M20 6H4V4H20V6ZM21 8H3L2 10V20C2 21.1 2.9 22 4 22H20C21.1 22 22 21.1 22 20V10L21 8Z"/>
                </svg>
              </div>

              {/* Middle info */}
              <div style={{ flex:1 }}>
                <p style={{ fontFamily:'var(--font-display)', fontSize:'1rem',
                  color:'var(--color-ink)', margin:'0 0 0.2rem' }}>{d.item}</p>
                <p style={{ fontFamily:'var(--font-body)', fontSize:'0.72rem',
                  color:'var(--color-tan-muted)', fontWeight:700, margin:0 }}>
                  🌿 {d.co2}kg · {d.date} · {d.school}
                </p>
              </div>

              {/* Right badges */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'0.3rem' }}>
                <span className={d.grade==='Grade A' ? 'badge-grade-a' : 'badge-grade-b'}>
                  {d.grade}
                </span>
                <span style={{ fontFamily:'var(--font-body)', fontSize:'0.68rem', fontWeight:800,
                  color:      d.status==='Completed' ? 'var(--color-olive-mid)' : 'var(--color-amber-accent)',
                  background: d.status==='Completed' ? 'var(--color-olive-pale)' : 'var(--color-amber-pale)',
                  padding:'0.15rem 0.5rem', borderRadius:'0.375rem',
                  border:`1.5px solid ${d.status==='Completed' ? 'var(--color-olive-mist)' : '#E8C898'}` }}>
                  {d.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Kampong nudge ── */}
      <div style={{ marginTop:'2rem', position:'relative', overflow:'hidden',
        background:'var(--color-olive-deep)',
        border:'2.5px solid #1A2410', borderRadius:'1.5rem',
        padding:'1.5rem', boxShadow:'4px 5px 0px #111908' }}>

        {/* Leaf in bg */}
        <svg width="80" height="90" viewBox="0 0 80 90" fill="none"
          style={{ position:'absolute', right:'-8px', bottom:'-8px', opacity:0.12, pointerEvents:'none' }}>
          <path d="M80 90 C55 70 38 40 54 18 C63 6 78 4 80 22Z" fill="#C8D5A8"/>
        </svg>

        <p style={{ fontFamily:'var(--font-display)', fontSize:'1.15rem',
          color:'var(--color-tan-warm)', margin:'0 0 0.35rem',
          position:'relative', zIndex:1 }}>
          Keep the Kampong spirit alive 🌿
        </p>
        <p style={{ fontFamily:'var(--font-body)', fontSize:'0.82rem',
          color:'var(--color-olive-mist)', fontWeight:600, margin:'0 0 1.1rem',
          position:'relative', zIndex:1 }}>
          1 more donation = another student fully equipped.
        </p>
        <button className="btn-secondary"
          style={{ background:'var(--color-tan-warm)', border:'2.5px solid rgba(255,255,255,0.15)',
            boxShadow:'3px 4px 0px #111908', color:'var(--color-olive-deep)',
            position:'relative', zIndex:1 }}>
          Donate Another Item →
        </button>
      </div>
    </main>
  </div>
);

export default Dashboard;
