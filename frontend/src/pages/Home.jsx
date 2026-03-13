import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/* ── Botanical SVG doodles ───────────────────────────────────── */
const LeafCluster = () => (
  <svg width="110" height="130" viewBox="0 0 110 130" fill="none"
    style={{ position:'absolute', top:'-12px', right:'-8px', opacity:0.22, pointerEvents:'none' }}>
    <path d="M55 120 C30 95 10 65 25 38 C35 18 62 12 78 30 C94 48 84 85 55 120Z"
      fill="#C8D5A8" stroke="#C8D5A8" strokeWidth="1"/>
    <path d="M72 15 C85 5 100 8 105 22 C110 36 98 50 80 48 C62 46 58 26 72 15Z"
      fill="#C8D5A8" opacity="0.7"/>
    <path d="M55 118 C55 122 52 126 50 130" stroke="#C8D5A8" strokeWidth="2" strokeLinecap="round"/>
    <path d="M55 100 C46 88 40 75 44 60" stroke="#C8D5A8" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    <path d="M50 80 C42 74 36 70 34 62" stroke="#C8D5A8" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
    <circle cx="28" cy="112" r="3" fill="#C8D5A8" opacity="0.4"/>
    <circle cx="18" cy="98"  r="2" fill="#C8D5A8" opacity="0.3"/>
    <path d="M8 55 L14 50 M6 62 L13 62" stroke="#C8D5A8" strokeWidth="1.5" strokeLinecap="round" opacity="0.35"/>
  </svg>
);

const StampBadge = () => (
  <svg width="68" height="68" viewBox="0 0 68 68" fill="none"
    style={{ position:'absolute', bottom:'-18px', left:'1.4rem',
      filter:'drop-shadow(2px 3px 0px rgba(46,61,24,0.4))', zIndex:20 }}>
    <circle cx="34" cy="34" r="30" fill="#E4EDD4" stroke="#4A5E2F" strokeWidth="3"/>
    <circle cx="34" cy="34" r="24" fill="none"  stroke="#4A5E2F" strokeWidth="1.5" strokeDasharray="3 3"/>
    <text x="34" y="30" textAnchor="middle" fontFamily="'Lilita One',cursive"
      fontSize="7" fill="#2E3D18" letterSpacing="1.5">CERTIFIED</text>
    <text x="34" y="41" textAnchor="middle" fontFamily="'Lilita One',cursive"
      fontSize="9.5" fill="#4A5E2F">🌿 HERO</text>
    <text x="34" y="52" textAnchor="middle" fontFamily="'Lilita One',cursive"
      fontSize="6.5" fill="#6B7C4A" letterSpacing="1">SG • 2025</text>
  </svg>
);

/* ── Nav card icons ──────────────────────────────────────────── */
const icons = {
  camera: (c) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill={c}>
      <path d="M9 3L7.17 5H4C2.9 5 2 5.9 2 7V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V7C22 5.9 21.1 5 20 5H16.83L15 3H9Z"/>
      <circle cx="12" cy="13" r="3.5" fill={c}/>
    </svg>
  ),
  search: (c) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill={c}>
      <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14Z"/>
    </svg>
  ),
  chart: (c) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill={c}>
      <path d="M5 9.2H8V19H5V9.2ZM10.6 5H13.4V19H10.6V5ZM16.2 13H19V19H16.2V13Z"/>
    </svg>
  ),
  box: (c) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill={c}>
      <path d="M20 6H4V4H20V6ZM21 8H3L2 10V20C2 21.1 2.9 22 4 22H20C21.1 22 22 21.1 22 20V10L21 8ZM9 14H7V12H9V14ZM11 14V12H13V14H11ZM17 14H15V12H17V14Z"/>
    </svg>
  ),
};

const navItems = [
  { label:'Donate Gear',       sub:'Snap a photo · AI grades instantly',    route:'/donate',     iconKey:'camera', iconColor:'#4A5E2F', iconBg:'#E4EDD4', dark:false },
  { label:'Request Items',     sub:'Find verified CCA gear near you',       route:'/request',    iconKey:'search', iconColor:'#7A6030', iconBg:'#F0E8D0', dark:false },
  { label:'Impact Dashboard',  sub:'CO₂ saved · cost impact · history',    route:'/dashboard',  iconKey:'chart',  iconColor:'#3D5C28', iconBg:'#E0EAC8', dark:false },
  { label:'My Pickups',        sub:'QR codes for private collection',       route:'/collection', iconKey:'box',    iconColor:'#C8D5A8', iconBg:'rgba(255,255,255,0.1)', dark:true },
];

/* ── Main ────────────────────────────────────────────────────── */
const Home = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  return (
    <div style={{ background:'var(--color-tan-warm)', minHeight:'100vh', fontFamily:'var(--font-body)' }}>

      {/* ── Hero ── */}
      <header className="page-hero" style={{ paddingBottom:'5rem', marginBottom:'0' }}>
        <LeafCluster />

        {/* Floating circles for depth */}
        <div style={{ position:'absolute', top:'1rem', left:'-2rem', width:160, height:160,
          borderRadius:'50%', background:'rgba(255,255,255,0.04)',
          border:'2px solid rgba(255,255,255,0.07)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:'-3rem', right:'4rem', width:100, height:100,
          borderRadius:'50%', background:'rgba(255,255,255,0.05)',
          border:'2px solid rgba(255,255,255,0.08)', pointerEvents:'none' }}/>

        <div style={{ position:'relative', zIndex:5 }}>
          {/* Eyebrow */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem',
            background:'rgba(255,255,255,0.12)', borderRadius:'999px',
            padding:'0.25rem 0.85rem', marginBottom:'1rem',
            border:'1px solid rgba(255,255,255,0.18)' }}>
            <span style={{ fontSize:'0.75rem', fontWeight:800, letterSpacing:'0.12em',
              textTransform:'uppercase', color:'var(--color-olive-mist)',
              fontFamily:'var(--font-body)' }}>Singapore</span>
            <span style={{ fontSize:'0.6rem', color:'var(--color-olive-mist)', opacity:0.6 }}>●</span>
            <span style={{ fontSize:'0.75rem', fontWeight:800, letterSpacing:'0.12em',
              textTransform:'uppercase', color:'var(--color-olive-mist)',
              fontFamily:'var(--font-body)' }}>2025</span>
          </div>

          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'3rem',
            color:'var(--color-tan-warm)', margin:'0 0 0.5rem',
            textShadow:'2px 3px 0px rgba(46,61,24,0.4)', lineHeight:1.05 }}>
            Second<br/>Hand Hero
          </h1>

          <p style={{ fontFamily:'var(--font-body)', fontSize:'0.9rem',
            color:'var(--color-olive-mist)', fontWeight:600,
            maxWidth:240, lineHeight:1.65 }}>
            Bridging the gap. Ending the graduation waste cycle.
          </p>
        </div>

        {/* Stamp badge breaking out of hero bottom */}
        <StampBadge />
      </header>

      {/* ── Cards ── */}
      <main style={{ padding:'0 1.25rem 3rem', maxWidth:480, margin:'0 auto' }}>
        <div style={{ marginTop:'2.5rem', display:'flex', flexDirection:'column', gap:'0.9rem' }}>
          {navItems.map((item, i) => (
            <div key={item.route}
              className={item.dark ? 'hero-card-dark' : 'hero-card'}
              onClick={() => navigate(item.route)}
              style={{
                display:'flex', alignItems:'center', gap:'1rem',
                cursor:'pointer', padding:'1rem 1.15rem',
                animation: mounted ? `fadeSlideUp 0.4s ease ${0.06 * i}s both` : 'none',
              }}>

              {/* Icon container with slight float on dark card */}
              <div style={{ width:52, height:52, borderRadius:'1rem', flexShrink:0,
                background: item.iconBg, border:'2px solid rgba(0,0,0,0.08)',
                display:'flex', alignItems:'center', justifyContent:'center',
                ...(item.dark ? { border:'2px solid rgba(255,255,255,0.1)' } : {}) }}>
                {icons[item.iconKey](item.iconColor)}
              </div>

              <div style={{ flex:1 }}>
                <p style={{ fontFamily:'var(--font-display)', fontSize:'1.15rem',
                  color: item.dark ? 'var(--color-tan-warm)' : 'var(--color-ink)',
                  margin:'0 0 0.15rem' }}>{item.label}</p>
                <p style={{ fontFamily:'var(--font-body)', fontSize:'0.78rem', fontWeight:700,
                  color: item.dark ? 'var(--color-olive-mist)' : 'var(--color-ink-light)',
                  margin:0 }}>{item.sub}</p>
              </div>

              {/* Arrow */}
              <div style={{ width:28, height:28, borderRadius:'50%',
                background: item.dark ? 'rgba(255,255,255,0.1)' : 'var(--color-olive-pale)',
                border: item.dark ? '1.5px solid rgba(255,255,255,0.15)' : '1.5px solid var(--color-olive-mist)',
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24"
                  fill={item.dark ? 'var(--color-olive-mist)' : 'var(--color-olive-mid)'}>
                  <path d="M8 5l8 7-8 7" stroke="currentColor" strokeWidth="2.5"
                    strokeLinecap="round" fill="none"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer style={{ textAlign:'center', paddingBottom:'2.5rem' }}>
        <div style={{ display:'inline-flex', gap:'1rem', alignItems:'center' }}>
          <div style={{ width:28, height:1, background:'var(--color-tan-border)' }}/>
          <p style={{ fontFamily:'var(--font-body)', fontSize:'0.65rem', fontWeight:800,
            letterSpacing:'0.18em', textTransform:'uppercase',
            color:'var(--color-tan-muted)', margin:0 }}>
            Dignified · Verified · Sustainable
          </p>
          <div style={{ width:28, height:1, background:'var(--color-tan-border)' }}/>
        </div>
      </footer>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Home;
