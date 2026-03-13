import React, { useState } from 'react';
import { Camera, RefreshCw, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Camera, RefreshCw, CheckCircle, AlertCircle, X, Sparkles } from 'lucide-react';
import axios from 'axios';

/* ── Shared primitives (mirrors Home.jsx) ────────────────────── */
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

/* ── Step indicator ──────────────────────────────────────────── */
const Step = ({ n, label, active, done }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
    <div style={{
      width: 26, height: 26, borderRadius: 0, flexShrink: 0,
      background: done ? 'var(--color-sage-dark)' : active ? 'var(--color-ink)' : 'transparent',
      border: `1px solid ${done || active ? 'transparent' : 'var(--color-border)'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'background 0.3s, border-color 0.3s',
    }}>
      {done
        ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-cream)" strokeWidth="2.5" strokeLinecap="round"><path d="M5 13l4 4L19 7"/></svg>
        : <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.72rem', fontStyle: 'italic',
            color: active ? 'var(--color-cream)' : 'var(--color-ink-light)' }}>{n}</span>
      }
    </div>
    <span style={{
      fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 500,
      letterSpacing: '0.12em', textTransform: 'uppercase',
      color: active ? 'var(--color-ink)' : done ? 'var(--color-sage-dark)' : 'var(--color-ink-light)',
      transition: 'color 0.3s',
    }}>{label}</span>
  </div>
);

/* ── Field wrapper ───────────────────────────────────────────── */
const FieldRow = ({ label, hint, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <label style={{
        fontFamily: 'var(--font-body)', fontSize: '0.62rem', fontWeight: 600,
        letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-ink-mid)',
      }}>{label}</label>
      {hint && <span style={{
        fontFamily: 'var(--font-body)', fontSize: '0.6rem',
        color: 'var(--color-ink-light)', fontStyle: 'italic',
      }}>{hint}</span>}
    </div>
    {children}
  </div>
);

const inputStyle = {
  width: '100%', outline: 'none',
  background: 'var(--color-cream)',
  border: '1px solid var(--color-border)',
  borderRadius: 0,
  padding: '0.75rem 1rem',
  fontFamily: 'var(--font-body)', fontSize: '0.9rem',
  color: 'var(--color-ink)',
  transition: 'border-color 0.18s, box-shadow 0.18s',
};

/* ════════════════════════════════════════════════════════════════
   DONATE
════════════════════════════════════════════════════════════════ */
const Donate = () => {
  const navigate = useNavigate();

  const [name,        setName]        = useState('');
  const [school,      setSchool]      = useState('');
  const [description, setDescription] = useState('');
  const [image,       setImage]       = useState(null);
  const [isGrading,   setIsGrading]   = useState(false);
  const [grade,       setGrade]       = useState(null);
  const [error,       setError]       = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  const calculateCO2Impact = (score) => `${(score * 1.5).toFixed(1)}kg CO₂ saved`;

  const handleAIGrading = async () => {
    if (!image || !name || !school) {
      setError('Please provide an item name, school, and photo before grading.');
      return;
    }
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isGrading, setIsGrading] = useState(false);
  const [grade, setGrade] = useState(null);
  const [error, setError] = useState(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image too large. Maximum 10MB.');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
      setGrade(null);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    setGrade(null);
  };

  const handleAIGrading = async () => {
    // Validation
    if (!image) {
      setError('Please add a photo of your item!');
      return;
    }
    if (!name.trim()) {
      setError('Please provide an item name!');
      return;
    }
    if (!school.trim()) {
      setError('Please enter your school!');
      return;
    }

    setIsGrading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('name', name.trim());
      formData.append('school', school.trim());
      formData.append('description', description.trim());

      const response = await axios.post(
        'http://localhost:8000/api/donations/grade',
        formData,
        { 
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 30000
        }
      );

      // Check if item was rejected
      if (response.data.status === 'rejected') {
        setError(response.data.message || 'Item does not meet quality standards for donation.');
        setGrade(null);
        return;
      }

      // Success
      setGrade({
        level:         `Grade ${response.data.condition}`,
        condition:     response.data.condition,
        quality_score: response.data.quality_score,
        feedback:      response.data.feedback,
        impact:        calculateCO2Impact(response.data.quality_score),
        donation_id:   response.data.donation_id,
        level: response.data.grade,
        condition: response.data.condition,
        quality_score: response.data.quality_score,
        category: response.data.category,
        feedback: response.data.feedback,
        impact: `${response.data.co2_saved}kg CO2 saved`,
        donation_id: response.data.donation_id,
        message: response.data.message
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to grade. Check your backend.');
      console.error('Grading error:', err);
      setError(
        err.response?.data?.detail || 
        err.message || 
        'Failed to grade item. Please check your connection and try again.'
      );
    } finally {
      setIsGrading(false);
    }
  };

  /* Step logic */
  const hasPhoto = !!image;
  const hasInfo  = name.trim() && school.trim();
  const step     = grade ? 3 : hasInfo ? 2 : hasPhoto ? 1 : 0;

  return (
    <div style={{
      background: 'var(--color-cream)', minHeight: '100vh',
      fontFamily: 'var(--font-body)', position: 'relative', overflowX: 'hidden',
    }}>

      {/* ── Grain ── */}
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
          }}>Secondhand Heros</span>
        </div>

        {/* Steps */}
        <div className="donate-steps-row">
          <Step n="1" label="Photo"   active={step === 0} done={step > 0}/>
          <div style={{ width: 24, height: 1, background: 'var(--color-border)', flexShrink: 0 }}/>
          <Step n="2" label="Details" active={step === 1} done={step > 1}/>
          <div style={{ width: 24, height: 1, background: 'var(--color-border)', flexShrink: 0 }}/>
          <Step n="3" label="Graded"  active={step === 2} done={step > 2}/>
        </div>

        <button onClick={() => navigate('/')} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 500,
          letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-ink-light)',
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          transition: 'color 0.2s',
          padding: 0,
        }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--color-ink)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--color-ink-light)'}
        >
          ← Back
        </button>
      </nav>

      {/* ══ BODY ═════════════════════════════════════════════════ */}
      <div style={{
        position: 'relative', zIndex: 5,
        maxWidth: 1200, margin: '0 auto',
        padding: '3rem 2.5rem 5rem',
        display: 'grid', gap: '4rem',
      }} className="donate-layout">

        {/* ══ LEFT — form ══════════════════════════════════════ */}
        <div>
          {/* Page title */}
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.63rem', fontWeight: 500,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'var(--color-sage-dark)', margin: '0 0 0.75rem',
          }}>Pass on your passion for a second chance · Donate</p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
            fontWeight: 400, fontStyle: 'italic',
            color: 'var(--color-ink)', lineHeight: 1.08,
            letterSpacing: '-0.01em', margin: '0 0 0.5rem',
          }}>List your<br/>
            <span style={{ fontStyle: 'normal' }}>Gear.</span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.88rem',
            color: 'var(--color-ink-light)', lineHeight: 1.75,
            maxWidth: 340, margin: '0 0 2.5rem',
          }}>
            Upload a photo and fill in the details.
            Our AI will grade the condition instantly — no waiting, no bias.
          </p>

          {/* ── Photo upload ── */}
          <div style={{ marginBottom: '1.75rem' }}>
            <FieldRow label="Photo" hint="jpg, png, webp">
              {!image ? (
                <label style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: '0.75rem', cursor: 'pointer',
                  height: 200,
                  border: '1.5px dashed var(--color-border)',
                  background: 'var(--color-cream-card)',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-sage-dark)'; e.currentTarget.style.background = 'var(--color-sage-pale)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)';     e.currentTarget.style.background = 'var(--color-cream-card)'; }}
                >
                  <input type="file" accept="image/*"
                    onChange={e => setImage(e.target.files[0])} style={{ display: 'none' }}/>
                  <div style={{
                    width: 48, height: 48,
                    border: '1px solid var(--color-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Camera size={22} color="var(--color-ink-light)"/>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{
                      fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600,
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: 'var(--color-ink-mid)', margin: '0 0 0.2rem',
                    }}>Add Photo</p>
                    <p style={{
                      fontFamily: 'var(--font-body)', fontSize: '0.7rem',
                      color: 'var(--color-ink-light)', margin: 0,
                    }}>Click or drag and drop</p>
                  </div>
                </label>
              ) : (
                <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                  <img src={URL.createObjectURL(image)} alt="Gear preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
                  {/* Overlay on hover */}
                  <button onClick={() => setImage(null)} style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%',
                    background: 'rgba(28,26,21,0.45)', border: 'none', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: '0.4rem', opacity: 0, transition: 'opacity 0.2s',
                    fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 600,
                    letterSpacing: '0.14em', textTransform: 'uppercase', color: 'white',
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    Remove
                  </button>
                  {/* Corner tag */}
                  <div style={{
                    position: 'absolute', top: 10, left: 10,
                    background: 'var(--color-cream)', border: '1px solid var(--color-border)',
                    padding: '0.2rem 0.6rem',
                    fontFamily: 'var(--font-body)', fontSize: '0.58rem', fontWeight: 600,
                    letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-ink-mid)',
                  }}>Photo added ✓</div>
                </div>
              )}
            </FieldRow>
          </div>

          {/* ── Text fields ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', marginBottom: '1.75rem' }}>
            <FieldRow label="Item Name" hint="e.g. Fencing Foil, ACS Blazer">
              <input
                type="text" placeholder="What are you donating?"
                onChange={e => setName(e.target.value)}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                style={{
                  ...inputStyle,
                  borderColor: focusedField === 'name' ? 'var(--color-sage-dark)' : 'var(--color-border)',
                  boxShadow:   focusedField === 'name' ? '0 0 0 3px rgba(74,112,80,0.08)' : 'none',
                }}
              />
            </FieldRow>

            <FieldRow label="School" hint="e.g. RI, HCI, ACJC">
              <input
                type="text" placeholder="Which school is this from?"
                onChange={e => setSchool(e.target.value)}
                onFocus={() => setFocusedField('school')}
                onBlur={() => setFocusedField(null)}
                style={{
                  ...inputStyle,
                  borderColor: focusedField === 'school' ? 'var(--color-sage-dark)' : 'var(--color-border)',
                  boxShadow:   focusedField === 'school' ? '0 0 0 3px rgba(74,112,80,0.08)' : 'none',
                }}
              />
            </FieldRow>

            <FieldRow label="Description" hint="optional">
              <textarea
                placeholder="Describe the condition, size, or any notes…"
                rows={4}
                onChange={e => setDescription(e.target.value)}
                onFocus={() => setFocusedField('desc')}
                onBlur={() => setFocusedField(null)}
                style={{
                  ...inputStyle,
                  resize: 'none', lineHeight: 1.65,
                  borderColor: focusedField === 'desc' ? 'var(--color-sage-dark)' : 'var(--color-border)',
                  boxShadow:   focusedField === 'desc' ? '0 0 0 3px rgba(74,112,80,0.08)' : 'none',
                }}
              />
            </FieldRow>
  const handleReset = () => {
    setName('');
    setSchool('');
    setDescription('');
    setImage(null);
    setImagePreview(null);
    setGrade(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 pb-20">
      {/* Header */}
      <div className="max-w-xl mx-auto bg-white border-b sticky top-0 z-10 px-6 py-4 flex justify-between items-center shadow-sm backdrop-blur-sm bg-white/95">
        <h1 className="font-bold text-xl text-slate-800">List Gear</h1>
        {grade && (
          <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
            <CheckCircle size={18} />
            <span>Listed!</span>
          </div>
        )}
      </div>

      <div className="max-w-xl mx-auto p-6 space-y-5">
        {/* Photo Section */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          {!imagePreview ? (
            <label className="w-full h-72 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-green-50 hover:border-green-300 transition-all group">
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                onChange={handleImageSelect} 
                className="hidden" 
              />
              <div className="p-4 bg-slate-50 rounded-full mb-4 group-hover:bg-green-100 transition-colors">
                <Camera size={32} className="text-slate-400 group-hover:text-green-600 transition-colors" />
              </div>
              <p className="text-sm text-slate-600 font-semibold">Add Photo</p>
              <p className="text-xs text-slate-400 mt-1">Tap to upload or take a picture</p>
            </label>
          ) : (
            <div className="relative h-72 rounded-2xl overflow-hidden shadow-lg">
              <img 
                src={imagePreview} 
                className="w-full h-full object-cover" 
                alt="Item preview" 
              />
              <button 
                onClick={handleRemoveImage}
                className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all backdrop-blur-sm"
              >
                <X size={20} />
              </button>
              {grade && (
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-green-600" />
                    <span className="text-sm font-bold text-slate-800">{grade.level}</span>
                    <span className="text-xs text-slate-500">• {grade.category}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 divide-y divide-slate-100">
          <div className="p-5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
              Item Name *
            </label>
            <input 
              type="text" 
              placeholder="e.g., Blue Backpack, Scientific Calculator" 
              className="w-full text-lg outline-none text-slate-800 placeholder:text-slate-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
            />
          </div>

          <div className="p-5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
              School *
            </label>
            <input 
              type="text" 
              placeholder="e.g., RI, HCI, NYP, VJC" 
              className="w-full text-lg outline-none text-slate-800 placeholder:text-slate-300"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              maxLength={50}
            />
          </div>

          <div className="p-5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
              Description (Optional)
            </label>
            <textarea 
              placeholder="Condition, size, any details that help..." 
              className="w-full text-base outline-none h-24 resize-none text-slate-800 placeholder:text-slate-300"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
            />
            <p className="text-xs text-slate-400 mt-1 text-right">
              {description.length}/500
            </p>
          </div>

          {/* ── Error ── */}
          {error && (
            <div style={{
              marginBottom: '1.25rem', padding: '0.85rem 1rem',
              border: '1px solid #C4A882', background: '#FBF5EC',
              fontFamily: 'var(--font-body)', fontSize: '0.8rem',
              color: 'var(--color-amber-accent)', lineHeight: 1.6,
              display: 'flex', gap: '0.6rem', alignItems: 'flex-start',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="var(--color-amber-accent)" strokeWidth="2" strokeLinecap="round"
                style={{ flexShrink: 0, marginTop: 2 }}>
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
              </svg>
              {error}
            </div>
          )}

          {/* ── Submit button ── */}
          {!grade && (
            <button
              onClick={handleAIGrading}
              disabled={isGrading || !image}
              style={{
                width: '100%', border: 'none', borderRadius: 0,
                padding: '1rem 1.5rem',
                background: isGrading || !image ? 'var(--color-border)' : 'var(--color-ink)',
                color: isGrading || !image ? 'var(--color-ink-light)' : 'var(--color-cream)',
                fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                cursor: isGrading || !image ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                transition: 'background 0.2s, color 0.2s, transform 0.14s',
              }}
              onMouseEnter={e => { if (!isGrading && image) e.currentTarget.style.background = 'var(--color-sage-deep)'; }}
              onMouseLeave={e => { if (!isGrading && image) e.currentTarget.style.background = 'var(--color-ink)'; }}
            >
              {isGrading
                ? <><RefreshCw size={14} style={{ animation: 'donSpin 1s linear infinite' }}/> Inspecting Quality…</>
                : <>Grade with AI <Arrow size={13} color="inherit"/></>
              }
            </button>
          )}
        </div>

        {/* ══ RIGHT — sidebar ══════════════════════════════════ */}
        <aside>

          {/* ── Grade result card (appears after grading) ── */}
          {grade ? (
            <div style={{ animation: 'donFadeUp 0.45s ease both' }}>
              {/* Grade header */}
              <div style={{
                background: grade.condition === 'A' ? 'var(--color-sage-dark)' : 'var(--color-amber-accent)',
                padding: '2rem 1.75rem',
                marginBottom: 0,
              }}>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.6rem', fontWeight: 600,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.65)', margin: '0 0 0.5rem',
                }}>AI Assessment</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <CheckCircle size={22} color="white"/>
                  <p style={{
                    fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontStyle: 'italic',
                    color: 'white', margin: 0, lineHeight: 1,
                  }}>{grade.level}</p>
                </div>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.6,
                }}>{grade.feedback}</p>
              </div>

              {/* Stats row */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                border: '1px solid var(--color-border)', borderTop: 'none',
              }}>
                {[
                  { label: 'CO₂ Impact',      val: grade.impact                    },
                  { label: 'Quality Score',    val: `${grade.quality_score}/10`     },
                  { label: 'Donation ID',      val: `#${grade.donation_id || '—'}`  },
                  { label: 'Status',           val: 'Listed ✓'                      },
                ].map((s, i) => (
                  <div key={s.label} style={{
                    padding: '1rem 1.25rem',
                    borderRight:  i % 2 === 0 ? '1px solid var(--color-border)' : 'none',
                    borderBottom: i < 2       ? '1px solid var(--color-border)' : 'none',
                    background: 'var(--color-cream-card)',
                  }}>
                    <p style={{
                      fontFamily: 'var(--font-body)', fontSize: '0.58rem', fontWeight: 600,
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: 'var(--color-ink-light)', margin: '0 0 0.3rem',
                    }}>{s.label}</p>
                    <p style={{
                      fontFamily: 'var(--font-display)', fontSize: '1rem', fontStyle: 'italic',
                      color: 'var(--color-ink)', margin: 0,
                    }}>{s.val}</p>
                  </div>
                ))}
              </div>

              {/* Post-grade actions */}
              <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <button onClick={() => { setGrade(null); setImage(null); setName(''); setSchool(''); setDescription(''); setError(null); }}
                  style={{
                    width: '100%', border: '1px solid var(--color-ink)', borderRadius: 0,
                    padding: '0.85rem',
                    background: 'none', color: 'var(--color-ink)',
                    fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600,
                    letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                    transition: 'background 0.18s, color 0.18s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-ink)'; e.currentTarget.style.color = 'var(--color-cream)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--color-ink)'; }}
                >
                  Donate Another Item <Arrow size={12}/>
                </button>
                <button onClick={() => navigate('/dashboard')} style={{
                  width: '100%', border: '1px solid var(--color-border)', borderRadius: 0,
                  padding: '0.85rem',
                  background: 'none', color: 'var(--color-ink-light)',
                  fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600,
                  letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer',
                  transition: 'color 0.18s, border-color 0.18s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-sage-dark)'; e.currentTarget.style.borderColor = 'var(--color-sage)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-ink-light)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                >
                  View Impact Dashboard
                </button>
              </div>
            </div>
          ) : (
            /* ── Pre-grade sidebar content ── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* How it works */}
              <div style={{
                border: '1px solid var(--color-border)',
                background: 'var(--color-cream-card)',
              }}>
                <div style={{
                  padding: '1rem 1.25rem',
                  borderBottom: '1px solid var(--color-border)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.62rem', fontWeight: 600,
                    letterSpacing: '0.16em', textTransform: 'uppercase',
                    color: 'var(--color-ink-mid)', margin: 0,
                  }}>How It Works</p>
                  <span style={{
                    fontFamily: 'var(--font-display)', fontSize: '0.7rem', fontStyle: 'italic',
                    color: 'var(--color-ink-light)',
                  }}>3 steps</span>
                </div>

                {[
                  { n: '01', title: 'Upload a photo',       body: 'A clear photo of the item. Natural light works best.'        },
                  { n: '02', title: 'Fill in the details',  body: 'Item name, school and a short description help matching.'    },
                  { n: '03', title: 'AI grades instantly',  body: 'Our model assesses condition. Your identity stays private.'  },
                ].map((s, i, arr) => (
                  <div key={s.n} style={{
                    padding: '1rem 1.25rem',
                    borderBottom: i < arr.length - 1 ? '1px solid var(--color-border-light)' : 'none',
                    display: 'flex', gap: '0.85rem',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontStyle: 'italic',
                      color: 'var(--color-ink-light)', flexShrink: 0, marginTop: '0.1rem',
                    }}>{s.n}</span>
                    <div>
                      <p style={{
                        fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 600,
                        color: 'var(--color-ink)', margin: '0 0 0.2rem',
                      }}>{s.title}</p>
                      <p style={{
                        fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                        color: 'var(--color-ink-light)', margin: 0, lineHeight: 1.65,
                      }}>{s.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Privacy note */}
              <div style={{
                background: 'var(--color-sage-pale)',
                border: '1px solid var(--color-sage-mid)',
                padding: '1.25rem',
                display: 'flex', gap: '0.85rem', alignItems: 'flex-start',
              }}>
                <div style={{
                  width: 32, height: 32, border: '1px solid var(--color-sage)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="var(--color-sage-dark)" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <div>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 700,
                    color: 'var(--color-sage-dark)', margin: '0 0 0.25rem',
                    letterSpacing: '0.06em',
                  }}>Your identity stays private</p>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.72rem',
                    color: 'var(--color-ink-mid)', margin: 0, lineHeight: 1.65,
                  }}>
                    Pickup is anonymous. Recipients only see the item grade and QR code — never your name or school.
                  </p>
                </div>
              </div>

              {/* Impact teaser */}
              <div style={{
                border: '1px solid var(--color-border)',
                padding: '1.25rem',
                background: 'var(--color-cream-card)',
              }}>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.6rem', fontWeight: 600,
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: 'var(--color-sage-dark)', margin: '0 0 0.85rem',
                }}>Avg. per donation</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {[
                    { val: '~1.5kg', label: 'CO₂ saved' },
                    { val: '$150',   label: 'peer saving' },
                  ].map(s => (
                    <div key={s.label}>
                      <p style={{
                        fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontStyle: 'italic',
                        color: 'var(--color-ink)', margin: '0 0 0.15rem', lineHeight: 1,
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
            </div>
          )}
        </aside>
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-100 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Action Button */}
        {!grade ? (
          <button 
            onClick={handleAIGrading}
            disabled={isGrading || !image || !name.trim() || !school.trim()}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-5 rounded-2xl font-bold text-lg shadow-lg shadow-green-200 disabled:opacity-40 disabled:shadow-none flex justify-center items-center gap-3 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {isGrading ? (
              <>
                <RefreshCw className="animate-spin" size={22} />
                <span>AI Inspecting Quality...</span>
              </>
            ) : (
              <>
                <Sparkles size={22} />
                <span>List Now & Grade</span>
              </>
            )}
          </button>
        ) : (
          <div className="space-y-4">
            {/* Success Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 p-6 rounded-3xl space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-3 text-green-800">
                <div className="p-2 bg-green-200 rounded-full">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h3 className="font-extrabold text-xl">{grade.level}</h3>
                  <p className="text-sm text-green-700">{grade.condition}</p>
                </div>
              </div>

              <p className="text-green-800 leading-relaxed">{grade.feedback}</p>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-green-200">
                <div className="bg-white/60 p-3 rounded-xl">
                  <p className="text-xs text-green-600 font-semibold mb-1">Quality Score</p>
                  <p className="text-2xl font-bold text-green-900">{grade.quality_score}/10</p>
                </div>
                <div className="bg-white/60 p-3 rounded-xl">
                  <p className="text-xs text-green-600 font-semibold mb-1">CO₂ Impact</p>
                  <p className="text-2xl font-bold text-green-900">{grade.impact.split(' ')[0]}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-green-200">
                <p className="text-green-800 font-bold text-center text-sm">
                  ✅ {grade.message || 'Item successfully listed!'}
                </p>
                <p className="text-green-600 text-xs text-center mt-2">
                  Your item is now visible on the Request page for students to find!
                </p>
              </div>
            </div>

            {/* List Another Button */}
            <button 
              onClick={handleReset}
              className="w-full bg-white border-2 border-slate-200 text-slate-700 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all"
            >
              List Another Item
            </button>
          </div>
        )}
      </div>

      {/* ── Scoped styles ── */}
      <style>{`
        @keyframes donFadeUp {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes donSpin { to { transform: rotate(360deg); } }

        /* Two-col on desktop */
        .donate-layout {
          grid-template-columns: 1fr;
        }
        @media (min-width: 900px) {
          .donate-layout {
            grid-template-columns: 1fr 1fr;
            gap: 5rem;
            align-items: start;
          }
        }

        /* Steps row — hide on tiny screens */
        .donate-steps-row {
          display: none;
          align-items: center;
          gap: 0.75rem;
        }
        @media (min-width: 640px) {
          .donate-steps-row { display: flex; }
        }

        /* Subtle focus ring for all inputs on this page */
        input:focus, textarea:focus, select:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default Donate;
