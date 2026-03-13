import React from 'react';

/* ── Torn edge SVG divider ───────────────────────────────────── */
const TornEdge = ({ flip = false }) => (
  <svg viewBox="0 0 320 18" width="100%" height="18" preserveAspectRatio="none"
    style={{ display:'block', transform: flip ? 'scaleY(-1)' : 'none' }}>
    <path d="M0,0 L0,10 C20,18 40,4 60,12 C80,20 100,6 120,14 C140,22 160,8 180,16 C200,24 220,6 240,14 C260,22 280,8 300,12 C310,14 316,10 320,8 L320,0 Z"
      fill="var(--color-tan-card)"/>
  </svg>
);

/* ── Mock QR as styled SVG ───────────────────────────────────── */
const QRCode = () => (
  <svg width="156" height="156" viewBox="0 0 156 156" fill="none">
    {/* TL finder */}
    <rect x="8"   y="8"   width="48" height="48" rx="6" fill="none" stroke="var(--color-olive-deep)" strokeWidth="4.5"/>
    <rect x="20"  y="20"  width="24" height="24" rx="3" fill="var(--color-olive-deep)"/>
    {/* TR finder */}
    <rect x="100" y="8"   width="48" height="48" rx="6" fill="none" stroke="var(--color-olive-deep)" strokeWidth="4.5"/>
    <rect x="112" y="20"  width="24" height="24" rx="3" fill="var(--color-olive-deep)"/>
    {/* BL finder */}
    <rect x="8"   y="100" width="48" height="48" rx="6" fill="none" stroke="var(--color-olive-deep)" strokeWidth="4.5"/>
    <rect x="20"  y="112" width="24" height="24" rx="3" fill="var(--color-olive-deep)"/>
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
    ].map(([x,y],i) => (
      <rect key={i} x={x} y={y} width="8" height="8" rx="1.5" fill="var(--color-olive-deep)"/>
    ))}
    {/* Centre logo mark */}
    <circle cx="78" cy="78" r="12" fill="var(--color-tan-card)" stroke="var(--color-olive-deep)" strokeWidth="2"/>
    <text x="78" y="82" textAnchor="middle" fontFamily="'Lilita One',cursive"
      fontSize="9" fill="var(--color-olive-mid)">SHH</text>
  </svg>
);

/* ── Leaf accent ─────────────────────────────────────────────── */
const LeafAccent = () => (
  <svg width="60" height="70" viewBox="0 0 60 70" fill="none"
    style={{ position:'absolute', bottom:0, right:0, opacity:0.15, pointerEvents:'none' }}>
    <path d="M60 70 C38 52 22 28 36 10 C44 0 58 0 60 16Z" fill="var(--color-olive-mid)"/>
    <path d="M60 70 C54 46 56 22 60 8" stroke="var(--color-olive-mid)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const Collection = () => (
  <div style={{ background:'var(--color-tan-warm)', minHeight:'100vh' }}>

    {/* ── Hero ── */}
    <header className="page-hero" style={{ paddingBottom:'5.5rem', textAlign:'center' }}>
      <div style={{ position:'relative', zIndex:5 }}>
        <div style={{ width:68, height:68, borderRadius:'1.25rem',
          background:'rgba(255,255,255,0.12)', border:'2px solid rgba(255,255,255,0.2)',
          display:'flex', alignItems:'center', justifyContent:'center',
          margin:'0 auto 1rem',
          boxShadow:'3px 4px 0px rgba(46,61,24,0.3)' }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="var(--color-tan-warm)">
            <path d="M18 8H17V6C17 3.24 14.76 1 12 1S7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z"/>
          </svg>
        </div>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'2.6rem',
          color:'var(--color-tan-warm)', margin:'0 0 0.4rem',
          textShadow:'2px 3px 0px rgba(46,61,24,0.4)' }}>Private Collection</h1>
        <p style={{ fontFamily:'var(--font-body)', fontSize:'0.875rem',
          color:'var(--color-olive-mist)', fontWeight:600 }}>
          Scan at School Locker #12 · No questions asked
        </p>
      </div>
    </header>

    <main style={{ padding:'0 1.25rem 3rem', maxWidth:420, margin:'0 auto' }}>

      {/* ── Ticket card ── */}
      <div className="animate-fade-up"
        style={{ marginTop:'-2rem', position:'relative' }}>

        {/* Ticket top section */}
        <div style={{ background:'var(--color-tan-card)',
          border:'2.5px solid var(--color-tan-border)',
          borderBottom:'none',
          borderRadius:'1.5rem 1.5rem 0 0',
          padding:'2rem 1.75rem 0',
          boxShadow:'4px 0px 0px var(--color-tan-shadow), -4px 0px 0px var(--color-tan-shadow)',
          position:'relative', overflow:'hidden' }}>

          <LeafAccent />

          {/* Header row */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start',
            marginBottom:'1.5rem' }}>
            <div>
              <p style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem',
                color:'var(--color-ink)', margin:'0 0 0.2rem' }}>Fencing Foil</p>
              <p style={{ fontFamily:'var(--font-body)', fontSize:'0.72rem',
                color:'var(--color-tan-muted)', fontWeight:700, margin:0 }}>
                Order #SHH-2847
              </p>
            </div>
            <span className="badge-grade-a" style={{ marginTop:'0.2rem' }}>Grade A</span>
          </div>

          {/* QR */}
          <div style={{ display:'flex', justifyContent:'center',
            padding:'1rem', background:'var(--color-tan-warm)',
            border:'2px solid var(--color-tan-border)',
            borderRadius:'1rem', marginBottom:'1.5rem' }}>
            <QRCode />
          </div>

          {/* Expiry / validity */}
          <div style={{ display:'flex', justifyContent:'space-between',
            padding:'0.75rem 0', borderTop:'1.5px solid var(--color-tan-border)',
            marginBottom:'0' }}>
            <div>
              <p style={{ fontFamily:'var(--font-body)', fontSize:'0.65rem', fontWeight:800,
                color:'var(--color-tan-muted)', textTransform:'uppercase',
                letterSpacing:'0.1em', margin:'0 0 0.1rem' }}>Valid Until</p>
              <p style={{ fontFamily:'var(--font-display)', fontSize:'0.9rem',
                color:'var(--color-ink)', margin:0 }}>30 Mar 2025</p>
            </div>
            <div style={{ textAlign:'right' }}>
              <p style={{ fontFamily:'var(--font-body)', fontSize:'0.65rem', fontWeight:800,
                color:'var(--color-tan-muted)', textTransform:'uppercase',
                letterSpacing:'0.1em', margin:'0 0 0.1rem' }}>Location</p>
              <p style={{ fontFamily:'var(--font-display)', fontSize:'0.9rem',
                color:'var(--color-ink)', margin:0 }}>Block B · L#12</p>
            </div>
          </div>
        </div>

        {/* Perforation / torn edge */}
        <div style={{ position:'relative',
          borderLeft:'2.5px solid var(--color-tan-border)',
          borderRight:'2.5px solid var(--color-tan-border)',
          background:'var(--color-tan-warm)', zIndex:2 }}>
          {/* Dashed perforation line */}
          <div style={{ borderTop:'2.5px dashed var(--color-tan-border)', margin:'0 -1px' }}/>
          {/* Side notches */}
          <div style={{ position:'absolute', left:'-14px', top:'-12px',
            width:24, height:24, borderRadius:'50%',
            background:'var(--color-tan-warm)',
            border:'2.5px solid var(--color-tan-border)' }}/>
          <div style={{ position:'absolute', right:'-14px', top:'-12px',
            width:24, height:24, borderRadius:'50%',
            background:'var(--color-tan-warm)',
            border:'2.5px solid var(--color-tan-border)' }}/>
          <div style={{ height:12 }}/>
        </div>

        {/* Ticket bottom stub */}
        <div style={{ background:'var(--color-olive-deep)',
          border:'2.5px solid var(--color-tan-border)',
          borderTop:'none',
          borderRadius:'0 0 1.5rem 1.5rem',
          padding:'1rem 1.75rem 1.5rem',
          boxShadow:'4px 5px 0px #111908, -4px 0px 0px #111908' }}>
          <p style={{ fontFamily:'var(--font-body)', fontSize:'0.82rem',
            color:'var(--color-olive-mist)', fontWeight:600,
            textAlign:'center', lineHeight:1.6, margin:0 }}>
            🔒 This code is unique to your item.<br/>
            Your identity is <strong style={{ color:'var(--color-tan-warm)' }}>never revealed</strong> during pickup.
          </p>
        </div>
      </div>

      {/* ── Steps ── */}
      <div style={{ marginTop:'1.75rem', display:'flex', flexDirection:'column', gap:'0.65rem' }}>
        <p style={{ fontFamily:'var(--font-display)', fontSize:'1rem',
          color:'var(--color-ink)', margin:'0 0 0.25rem', paddingLeft:'0.25rem' }}>
          How to collect
        </p>
        {[
          { n:'1', t:'Go to School Locker #12 at Block B' },
          { n:'2', t:'Scan this QR at the terminal' },
          { n:'3', t:'Your item is released — no staff needed' },
        ].map(({ n, t }) => (
          <div key={n} className="hero-card animate-fade-up"
            style={{ padding:'0.75rem 1rem',
              display:'flex', alignItems:'center', gap:'0.85rem' }}>
            <div style={{ width:30, height:30, borderRadius:'50%', flexShrink:0,
              background:'var(--color-olive-mid)',
              border:'2px solid var(--color-olive-deep)',
              boxShadow:'2px 2px 0px var(--color-olive-deep)',
              display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ fontFamily:'var(--font-display)', fontSize:'0.9rem',
                color:'var(--color-tan-warm)' }}>{n}</span>
            </div>
            <p style={{ fontFamily:'var(--font-body)', fontSize:'0.82rem',
              color:'var(--color-ink-light)', fontWeight:600, margin:0 }}>{t}</p>
          </div>
        ))}
      </div>
    </main>
  </div>
);

export default Collection;
