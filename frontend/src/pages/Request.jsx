import React, { useState, useEffect } from 'react';

const schools = ['All','RI','HCI','NYP','VJC','ACJC'];
const grades  = ['All','Grade A','Grade B'];

/* ── Placeholder images (Unsplash) ─────────────────────────── */
const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', // sports shoe
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80', // gym
  'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80', // track
  'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80', // basketball
  'https://images.unsplash.com/photo-1591491719565-9a443f036d9a?w=400&q=80', // fencing
  'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=400&q=80', // football
];

/* ── Mock data for empty-backend state ─────────────────────── */
const MOCK_RESULTS = [
  { _id:'1', _source:{ name:'Fencing Foil',      grade:'Grade A', school:'RI',   co2_saved:3.2, description:'Excellent condition, barely used. Includes protective cover.',           img: PLACEHOLDER_IMAGES[4] } },
  { _id:'2', _source:{ name:'Basketball (Size 7)',grade:'Grade A', school:'HCI',  co2_saved:2.8, description:'Proper grip retained, pumped and ready. Minor scuff on surface.',       img: PLACEHOLDER_IMAGES[3] } },
  { _id:'3', _source:{ name:'Track Spikes',       grade:'Grade B', school:'VJC',  co2_saved:1.9, description:'Size EU42, used for one season. Spikes still sharp.',                  img: PLACEHOLDER_IMAGES[2] } },
  { _id:'4', _source:{ name:'ACS Blazer',         grade:'Grade A', school:'ACJC', co2_saved:4.1, description:'Size M, dry-cleaned before donation. No stains.',                      img: PLACEHOLDER_IMAGES[0] } },
  { _id:'5', _source:{ name:'Gym Gloves',         grade:'Grade B', school:'NYP',  co2_saved:0.8, description:'Lightly used, good velcro. Fits most sizes.',                          img: PLACEHOLDER_IMAGES[1] } },
  { _id:'6', _source:{ name:'Football Boots',     grade:'Grade A', school:'RI',   co2_saved:2.4, description:'Size EU41, used for one season. Clean and polished.',                  img: PLACEHOLDER_IMAGES[5] } },
];

/* ── Star rating ─────────────────────────────────────────────── */
const Stars = ({ n = 4 }) => (
  <span style={{ color:'#C8D5A8', fontSize:'0.72rem', letterSpacing:'-1px' }}>
    {'★'.repeat(n)}{'☆'.repeat(5 - n)}
  </span>
);

/* ── Gear image card (Santorini-style) ───────────────────────── */
const GearCard = ({ hit, delay = 0 }) => {
  const item = hit._source;
  const isA  = item.grade === 'Grade A';

  return (
    <div className="gear-card animate-fade-up"
      style={{ animationDelay:`${delay}s`, display:'flex', flexDirection:'column' }}>

      {/* Full-bleed image */}
      <div style={{ position:'relative', height:180, overflow:'hidden' }}>
        <img src={item.img || PLACEHOLDER_IMAGES[0]} alt={item.name}
          style={{ width:'100%', height:'100%', objectFit:'cover', display:'block',
            transition:'transform 0.4s ease' }}
          onMouseEnter={e => e.currentTarget.style.transform='scale(1.06)'}
          onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
        />
        {/* Gradient fade to dark */}
        <div style={{ position:'absolute', inset:0,
          background:'linear-gradient(to bottom, rgba(0,0,0,0.05) 30%, rgba(28,40,14,0.82) 100%)' }}/>

        {/* Title overlaid on image bottom */}
        <div style={{ position:'absolute', bottom:'0.75rem', left:'0.9rem', right:'0.9rem' }}>
          <p style={{ fontFamily:'var(--font-display)', fontSize:'1.15rem',
            color:'#fff', margin:'0 0 0.1rem',
            textShadow:'0 1px 4px rgba(0,0,0,0.5)' }}>{item.name}</p>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
            <Stars n={isA ? 5 : 4}/>
            <span style={{ fontFamily:'var(--font-body)', fontSize:'0.72rem',
              fontWeight:800, color:'rgba(255,255,255,0.65)' }}>
              {isA ? '5.0' : '4.0'}
            </span>
          </div>
        </div>

        {/* Grade badge top-right */}
        <div style={{ position:'absolute', top:'0.75rem', right:'0.75rem' }}>
          <span className={isA ? 'badge-grade-a' : 'badge-grade-b'}>
            {item.grade}
          </span>
        </div>
      </div>

      {/* Content below image */}
      <div style={{ padding:'0.9rem 1rem 1rem', background:'var(--color-olive-deep)',
        display:'flex', flexDirection:'column', gap:'0.65rem', flex:1 }}>

        <p style={{ fontFamily:'var(--font-body)', fontSize:'0.8rem',
          color:'rgba(242,237,227,0.75)', fontWeight:600,
          margin:0, lineHeight:1.55,
          display:'-webkit-box', WebkitLineClamp:2,
          WebkitBoxOrient:'vertical', overflow:'hidden' }}>
          {item.description}
        </p>

        {/* Pills row */}
        <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
          <span style={{ fontFamily:'var(--font-body)', fontSize:'0.72rem', fontWeight:800,
            color:'var(--color-olive-mist)',
            background:'rgba(255,255,255,0.08)', border:'1px solid rgba(200,213,168,0.25)',
            borderRadius:'999px', padding:'0.2rem 0.6rem' }}>
            🎓 {item.school}
          </span>
          <span style={{ fontFamily:'var(--font-body)', fontSize:'0.72rem', fontWeight:800,
            color:'var(--color-olive-mist)',
            background:'rgba(255,255,255,0.08)', border:'1px solid rgba(200,213,168,0.25)',
            borderRadius:'999px', padding:'0.2rem 0.6rem' }}>
            🌿 {item.co2_saved}kg CO₂
          </span>
        </div>

        {/* Reserve button */}
        <button style={{ width:'100%', padding:'0.65rem',
          background:'var(--color-tan-warm)', color:'var(--color-olive-deep)',
          fontFamily:'var(--font-display)', fontSize:'0.95rem',
          border:'none', borderRadius:'0.75rem', cursor:'pointer',
          transition:'opacity 0.15s, transform 0.15s',
          boxShadow:'0 2px 8px rgba(0,0,0,0.2)' }}
          onMouseEnter={e => { e.currentTarget.style.opacity='0.92'; e.currentTarget.style.transform='translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity='1';    e.currentTarget.style.transform='translateY(0)'; }}>
          Request Item →
        </button>
      </div>
    </div>
  );
};

/* ── Select wrapper ──────────────────────────────────────────── */
const SelectField = ({ icon, value, onChange, children }) => (
  <div style={{ position:'relative', flex:1, minWidth:100 }}>
    <span style={{ position:'absolute', left:'0.75rem', top:'50%',
      transform:'translateY(-50%)', pointerEvents:'none', fontSize:'0.9rem',
      color:'var(--color-tan-muted)' }}>{icon}</span>
    <select value={value} onChange={onChange} className="field"
      style={{ paddingLeft:'2.2rem', appearance:'none', cursor:'pointer' }}>
      {children}
    </select>
  </div>
);

/* ── Main ────────────────────────────────────────────────────── */
const RequestPage = () => {
  const [query,   setQuery]   = useState('');
  const [school,  setSchool]  = useState('All');
  const [grade,   setGrade]   = useState('All');
  const [sortBy,  setSortBy]  = useState('relevance');
  const [results, setResults] = useState(MOCK_RESULTS);
  const [loading, setLoading] = useState(false);

  const fetchGear = async (q='', s='All', g='All', sort='relevance') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ query:q, school:s, grade:g, sort_by:sort });
      const res    = await fetch(`/api/matches/search?${params.toString()}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResults(Array.isArray(data) ? data : MOCK_RESULTS);
    } catch {
      // Fallback to mock data when no backend
      let filtered = MOCK_RESULTS;
      if (s !== 'All') filtered = filtered.filter(h => h._source.school === s);
      if (g !== 'All') filtered = filtered.filter(h => h._source.grade  === g);
      if (q)           filtered = filtered.filter(h =>
        h._source.name.toLowerCase().includes(q.toLowerCase()) ||
        h._source.description.toLowerCase().includes(q.toLowerCase())
      );
      setResults(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGear(query, school, grade, sortBy); }, [school, grade, sortBy]);
  const handleSearch = (e) => { e.preventDefault(); fetchGear(query, school, grade, sortBy); };

  return (
    <div style={{ background:'var(--color-tan-warm)', minHeight:'100vh' }}>

      {/* ── Hero ── */}
      <header className="page-hero" style={{ paddingBottom:'4.5rem' }}>
        <div style={{ position:'relative', zIndex:5 }}>
          <p style={{ fontFamily:'var(--font-body)', fontSize:'0.75rem', fontWeight:800,
            color:'var(--color-olive-mist)', letterSpacing:'0.12em',
            textTransform:'uppercase', marginBottom:'0.75rem' }}>← Home</p>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'2.8rem',
            color:'var(--color-tan-warm)', margin:'0 0 0.4rem',
            textShadow:'2px 3px 0px rgba(46,61,24,0.4)' }}>Request Gear</h1>
          <p style={{ fontFamily:'var(--font-body)', fontSize:'0.875rem',
            color:'var(--color-olive-mist)', fontWeight:600 }}>
            Find what you need, with dignity.
          </p>
        </div>
        {/* Result count badge */}
        <div style={{ position:'absolute', bottom:'1.25rem', right:'1.5rem', zIndex:5,
          background:'rgba(255,255,255,0.12)', borderRadius:'999px',
          padding:'0.3rem 0.9rem', border:'1px solid rgba(255,255,255,0.18)' }}>
          <span style={{ fontFamily:'var(--font-display)', fontSize:'0.85rem',
            color:'var(--color-tan-warm)' }}>{results.length} items available</span>
        </div>
      </header>

      <main style={{ padding:'1.25rem 1.25rem 3rem', maxWidth:960, margin:'0 auto' }}>

        {/* ── Search bar ── */}
        <div className="hero-card" style={{ marginBottom:'1.5rem', padding:'1rem' }}>
          <form onSubmit={handleSearch} style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:'0.85rem', top:'50%',
                transform:'translateY(-50%)', color:'var(--color-tan-muted)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"/>
                </svg>
              </span>
              <input type="text" placeholder="e.g. fencing foil, ACS blazer..."
                className="field" value={query} onChange={(e) => setQuery(e.target.value)}/>
            </div>
            <div style={{ display:'flex', gap:'0.6rem', flexWrap:'wrap' }}>
              <SelectField icon="🎓" value={school} onChange={e => setSchool(e.target.value)}>
                {schools.map(s => <option key={s} value={s}>{s==='All'?'All Schools':s}</option>)}
              </SelectField>
              <SelectField icon="⭐" value={grade} onChange={e => setGrade(e.target.value)}>
                {grades.map(g => <option key={g} value={g}>{g==='All'?'All Grades':g}</option>)}
              </SelectField>
              <SelectField icon="↕" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="relevance">Relevance</option>
                <option value="co2">Max CO₂ Saved</option>
                <option value="grade">Grade (A–Z)</option>
              </SelectField>
              <button type="submit" className="btn-primary"
                style={{ flex:'0 0 auto', width:'auto', padding:'0.75rem 1.5rem' }}>
                Find
              </button>
            </div>
          </form>
        </div>

        {/* ── Results ── */}
        {loading ? (
          <div style={{ textAlign:'center', padding:'4rem 0' }}>
            <p className="animate-shimmer" style={{ fontFamily:'var(--font-display)',
              fontSize:'1.2rem', color:'var(--color-olive-light)' }}>
              🌿 Searching the Kampong...
            </p>
          </div>
        ) : results.length > 0 ? (
          <div style={{ display:'grid',
            gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))',
            gap:'1.1rem' }}>
            {results.map((hit, i) => (
              <GearCard key={hit._id} hit={hit} delay={0.05 * i}/>
            ))}
          </div>
        ) : (
          <div style={{ textAlign:'center', padding:'4rem 2rem',
            background:'var(--color-tan-card)',
            border:'2.5px dashed var(--color-tan-border)',
            borderRadius:'1.5rem' }}>
            <p style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem',
              color:'var(--color-tan-muted)', marginBottom:'1rem' }}>
              No gear found matching your search.
            </p>
            <button onClick={() => { setQuery(''); setSchool('All'); setGrade('All'); fetchGear(); }}
              style={{ fontFamily:'var(--font-body)', fontSize:'0.85rem', fontWeight:700,
                color:'var(--color-olive-mid)', background:'none', border:'none',
                cursor:'pointer', textDecoration:'underline' }}>
              Reset filters →
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default RequestPage;
