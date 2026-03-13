import React, { useState } from 'react';

/* ── Pin SVG ── */
const Pin = ({ color = '#C87D3A', style = {} }) => (
  <svg width="22" height="28" viewBox="0 0 22 28" fill="none" style={style}>
    <ellipse cx="11" cy="9" rx="8" ry="8" fill={color} stroke="#2C2416" strokeWidth="1.5"/>
    <ellipse cx="11" cy="9" rx="4" ry="4" fill="rgba(255,255,255,0.3)"/>
    <path d="M11 17 L11 28" stroke="#2C2416" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

/* ── Botanical corner ── */
const CornerLeaf = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none"
    style={{ position:'absolute', bottom:'-4px', right:'-4px', opacity:0.18, pointerEvents:'none' }}>
    <path d="M80 80 C55 65 40 40 55 18 C62 8 76 6 80 20Z" fill="#4A5E2F"/>
    <path d="M80 80 C70 55 72 30 80 15" stroke="#4A5E2F" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const Donate = () => {
  const [image,     setImage]     = useState(null);
  const [isGrading, setIsGrading] = useState(false);
  const [grade,     setGrade]     = useState(null);

  const simulateGrading = () => {
    setIsGrading(true);
    setTimeout(() => {
      setGrade({ level:'Grade A', condition:'Near New', impact:'5.2kg CO₂ saved' });
      setIsGrading(false);
    }, 2500);
  };

  return (
    <div style={{ background:'var(--color-tan-warm)', minHeight:'100vh' }}>

      {/* ── Hero ── */}
      <header className="page-hero" style={{ paddingBottom:'5rem' }}>
        {/* Botanical corner decoration */}
        <div style={{ position:'absolute', top:0, right:0, width:140, height:140,
          background:'radial-gradient(circle at 100% 0%, rgba(200,213,168,0.2) 0%, transparent 65%)',
          pointerEvents:'none' }}/>
        <svg width="90" height="100" viewBox="0 0 90 100" fill="none"
          style={{ position:'absolute', top:'-5px', right:'-5px', opacity:0.25, pointerEvents:'none' }}>
          <path d="M90 0 C65 20 50 50 68 75 C76 86 90 88 90 70Z" fill="#C8D5A8"/>
          <path d="M90 0 C80 30 82 60 90 80" stroke="#C8D5A8" strokeWidth="2" strokeLinecap="round"/>
          <path d="M85 35 C75 30 70 22 72 12" stroke="#C8D5A8" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
        </svg>

        <div style={{ position:'relative', zIndex:5 }}>
          <p style={{ fontFamily:'var(--font-body)', fontSize:'0.75rem', fontWeight:800,
            color:'var(--color-olive-mist)', letterSpacing:'0.12em',
            textTransform:'uppercase', marginBottom:'0.75rem', cursor:'pointer' }}>← Home</p>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'2.8rem',
            color:'var(--color-tan-warm)', margin:'0 0 0.4rem',
            textShadow:'2px 3px 0px rgba(46,61,24,0.4)' }}>Donate Gear</h1>
          <p style={{ fontFamily:'var(--font-body)', fontSize:'0.875rem',
            color:'var(--color-olive-mist)', fontWeight:600, maxWidth:240 }}>
            Your gear gets graded, listed with dignity.
          </p>
        </div>
      </header>

      <main style={{ padding:'0 1.25rem 3rem', maxWidth:480, margin:'0 auto' }}>

        {/* ── Upload / preview ── */}
        <div style={{ marginTop:'-1.5rem', position:'relative' }}>

          {!image ? (
            <>
              {/* Corkboard-pinned notice feel */}
              <Pin style={{ position:'absolute', top:'-12px', left:'50%',
                transform:'translateX(-50%)', zIndex:20 }} />
              <input type="file" accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="hidden" id="upload" />
              <label htmlFor="upload">
                <div className="upload-zone" style={{ borderRadius:'1.25rem', paddingTop:'3.5rem',
                  boxShadow:'4px 5px 0px var(--color-tan-shadow)',
                  border:'2.5px dashed var(--color-tan-border)', overflow:'hidden',
                  position:'relative' }}>
                  <CornerLeaf />
                  <div style={{ width:68, height:68, borderRadius:'1.1rem',
                    background:'var(--color-olive-pale)',
                    border:'2.5px solid var(--color-olive-mist)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    margin:'0 auto 1.1rem',
                    boxShadow:'3px 3px 0px var(--color-olive-mist)' }}>
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="var(--color-olive-mid)">
                      <path d="M9 3L7.17 5H4C2.9 5 2 5.9 2 7V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V7C22 5.9 21.1 5 20 5H16.83L15 3H9Z"/>
                      <circle cx="12" cy="13" r="3.5" fill="var(--color-olive-mid)"/>
                    </svg>
                  </div>
                  <p style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem',
                    color:'var(--color-ink)', marginBottom:'0.4rem' }}>
                    Snap a photo of your gear
                  </p>
                  <p style={{ fontFamily:'var(--font-body)', fontSize:'0.8rem',
                    color:'var(--color-ink-light)', fontWeight:600 }}>
                    JPG · PNG · HEIC · Max 10MB
                  </p>
                </div>
              </label>
            </>
          ) : (
            <div style={{ borderRadius:'1.25rem', overflow:'hidden',
              border:'2.5px solid var(--color-tan-border)',
              boxShadow:'4px 5px 0px var(--color-tan-shadow)', position:'relative' }}>
              <img src={URL.createObjectURL(image)} alt="Gear"
                style={{ width:'100%', height:220, objectFit:'cover', display:'block' }}/>
              {/* Gradient overlay at bottom of image */}
              <div style={{ position:'absolute', bottom:0, left:0, right:0, height:80,
                background:'linear-gradient(to top, rgba(46,61,24,0.6), transparent)' }}/>
              <button onClick={() => { setImage(null); setGrade(null); }}
                style={{ position:'absolute', top:'0.75rem', right:'0.75rem',
                  background:'rgba(242,237,227,0.92)', border:'1.5px solid var(--color-tan-border)',
                  borderRadius:'0.625rem', padding:'0.35rem 0.75rem',
                  fontFamily:'var(--font-body)', fontSize:'0.75rem', fontWeight:700,
                  color:'var(--color-ink)', cursor:'pointer', backdropFilter:'blur(4px)' }}>
                ✕ Retake
              </button>
            </div>
          )}
        </div>

        {/* ── Tips ── */}
        {!image && (
          <div style={{ marginTop:'1.25rem', display:'flex', flexDirection:'column', gap:'0.6rem' }}>
            {[
              { e:'☀️', t:'Good lighting helps the AI grade accurately' },
              { e:'📐', t:'Show the full item, not just part of it' },
              { e:'🔍', t:'Include any wear, tears or damage clearly' },
            ].map((tip, i) => (
              <div key={i} className="hero-card" style={{ padding:'0.75rem 1rem',
                display:'flex', alignItems:'center', gap:'0.75rem' }}>
                <span style={{ fontSize:'1.1rem' }}>{tip.e}</span>
                <p style={{ fontFamily:'var(--font-body)', fontSize:'0.8rem',
                  color:'var(--color-ink-light)', fontWeight:600, margin:0 }}>{tip.t}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── AI grading ── */}
        {image && !grade && (
          <button onClick={simulateGrading} disabled={isGrading} className="btn-primary"
            style={{ marginTop:'1rem' }}>
            {isGrading ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--color-tan-warm)"
                  style={{ animation:'spin 1s linear infinite' }}>
                  <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
                </svg>
                AI Grading in progress...
              </>
            ) : '✦ Run AI Quality Check' }
          </button>
        )}

        {/* ── Grade result ribbon ── */}
        {grade && (
          <div className="animate-pop-in" style={{ marginTop:'1rem', position:'relative' }}>
            {/* Ribbon stamp */}
            <div style={{ position:'absolute', top:'-14px', right:'1.25rem',
              background:'var(--color-olive-mid)',
              border:'2.5px solid var(--color-olive-deep)',
              borderRadius:'0.5rem 0.5rem 0 0',
              padding:'0.15rem 0.85rem', zIndex:10,
              boxShadow:'2px 2px 0px var(--color-olive-deep)' }}>
              <p style={{ fontFamily:'var(--font-display)', fontSize:'0.8rem',
                color:'var(--color-tan-warm)', margin:0, letterSpacing:'0.05em' }}>
                🌿 {grade.impact}
              </p>
            </div>

            <div style={{ background:'var(--color-olive-pale)',
              border:'2.5px solid var(--color-olive-mist)', borderRadius:'1.25rem',
              padding:'1.5rem', boxShadow:'4px 5px 0px var(--color-olive-light)', paddingTop:'2rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.85rem', marginBottom:'0.85rem' }}>
                <div style={{ width:42, height:42, borderRadius:'0.75rem',
                  background:'var(--color-olive-mid)',
                  border:'2.5px solid var(--color-olive-deep)',
                  boxShadow:'2px 2px 0px var(--color-olive-deep)',
                  display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--color-tan-warm)">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
                <div>
                  <p style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem',
                    color:'var(--color-olive-deep)', margin:'0 0 0.1rem' }}>
                    {grade.level}: {grade.condition}
                  </p>
                  <p style={{ fontFamily:'var(--font-body)', fontSize:'0.78rem',
                    color:'var(--color-olive-light)', fontWeight:700, margin:0 }}>
                    Quality verified · Recipient dignity ensured
                  </p>
                </div>
              </div>
              <button className="btn-success">List for Next Cohort →</button>
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin    { to{ transform:rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Donate;
