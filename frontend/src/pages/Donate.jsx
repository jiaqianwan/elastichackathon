import React, { useState } from 'react';
import { Camera, RefreshCw, CheckCircle, AlertCircle, X, Sparkles } from 'lucide-react';
import axios from 'axios';

/* ── Shared primitives ───────────────────────────────────────── */
const LogoMark = () => (
  <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
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

/* ── Step pill ───────────────────────────────────────────────── */
const Step = ({ n, label, active, done }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
    <div style={{
      width: 24, height: 24, flexShrink: 0,
      background: done ? 'var(--color-sage-dark)' : active ? 'var(--color-ink)' : 'transparent',
      border: `1px solid ${done || active ? 'transparent' : 'var(--color-border)'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.3s',
    }}>
      {done
        ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 13l4 4L19 7"/>
          </svg>
        : <span style={{
            fontFamily: 'var(--font-display)', fontSize: '0.68rem', fontStyle: 'italic',
            color: active ? 'var(--color-cream)' : 'var(--color-ink-light)',
          }}>{n}</span>
      }
    </div>
    <span style={{
      fontFamily: 'var(--font-body)', fontSize: '0.65rem', fontWeight: 500,
      letterSpacing: '0.12em', textTransform: 'uppercase',
      color: active ? 'var(--color-ink)' : done ? 'var(--color-sage-dark)' : 'var(--color-ink-light)',
      transition: 'color 0.3s',
    }}>{label}</span>
  </div>
);

/* ── Field wrapper ───────────────────────────────────────────── */
const Field = ({ label, hint, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <label style={{
        fontFamily: 'var(--font-body)', fontSize: '0.58rem', fontWeight: 600,
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

/* ════════════════════════════════════════════════════════════════
   DONATE
════════════════════════════════════════════════════════════════ */
const Donate = () => {
  const [name,         setName]         = useState('');
  const [school,       setSchool]       = useState('');
  const [description,  setDescription]  = useState('');
  const [image,        setImage]        = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isGrading,    setIsGrading]    = useState(false);
  const [grade,        setGrade]        = useState(null);
  const [error,        setError]        = useState(null);
  const [focused,      setFocused]      = useState(null);

  /* ── All original handlers preserved verbatim ── */
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { setError('Image too large. Maximum 10MB.'); return; }
      if (!file.type.startsWith('image/')) { setError('Please select a valid image file.'); return; }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
      setGrade(null);
    }
  };

  const handleRemoveImage = () => {
    setImage(null); setImagePreview(null); setGrade(null);
  };

  const handleAIGrading = async () => {
    if (!image)         { setError('Please add a photo of your item!'); return; }
    if (!name.trim())   { setError('Please provide an item name!');     return; }
    if (!school.trim()) { setError('Please enter your school!');        return; }
    setIsGrading(true); setError(null);
    try {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('name', name.trim());
      formData.append('school', school.trim());
      formData.append('description', description.trim());
      const response = await axios.post(
        'http://localhost:8000/api/donations/grade',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 30000 }
      );
      if (response.data.status === 'rejected') {
        setError(response.data.message || 'Item does not meet quality standards for donation.');
        setGrade(null); return;
      }
      setGrade({
        level:         response.data.grade,
        condition:     response.data.condition,
        quality_score: response.data.quality_score,
        category:      response.data.category,
        feedback:      response.data.feedback,
        impact:        `${response.data.co2_saved}kg CO2 saved`,
        donation_id:   response.data.donation_id,
        message:       response.data.message,
      });
    } catch (err) {
      console.error('Grading error:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to grade item. Please check your connection and try again.');
    } finally {
      setIsGrading(false);
    }
  };

  const handleReset = () => {
    setName(''); setSchool(''); setDescription('');
    setImage(null); setImagePreview(null); setGrade(null); setError(null);
  };

  const step = grade ? 3 : (name.trim() && school.trim()) ? 2 : image ? 1 : 0;
  const canSubmit = !isGrading && !!image && name.trim() !== '' && school.trim() !== '';

  const baseInput = {
    width: '100%', outline: 'none', borderRadius: 0,
    background: 'var(--color-cream)',
    border: '1px solid var(--color-border)',
    padding: '0.8rem 1rem',
    fontFamily: 'var(--font-body)', fontSize: '0.92rem',
    color: 'var(--color-ink)', transition: 'border-color 0.18s, box-shadow 0.18s',
  };
  const focusStyle = (key) => focused === key
    ? { borderColor: 'var(--color-sage-dark)', boxShadow: '0 0 0 3px rgba(74,112,80,0.09)' }
    : {};

  return (
    <div style={{
      background: 'var(--color-cream)', minHeight: '100vh',
      fontFamily: 'var(--font-body)', position: 'relative',
    }}>

      {/* Grain */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.042,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat', backgroundSize: '256px 256px',
      }}/>

      {/* ── Sticky header ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'rgba(245,240,232,0.96)',
        borderBottom: '1px solid var(--color-border-light)',
        backdropFilter: 'blur(8px)',
      }}>
        <div style={{
          maxWidth: 560, margin: '0 auto',
          padding: '1rem 1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
            <LogoMark/>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '0.68rem',
              letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-ink)',
            }}>Secondhand Heros</span>
          </div>

          {/* Step indicators — hidden on tiny screens */}
          <div className="donate-steps" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Step n="1" label="Photo"   active={step === 0} done={step > 0}/>
            <div style={{ width: 16, height: 1, background: 'var(--color-border)', flexShrink: 0 }}/>
            <Step n="2" label="Details" active={step === 1} done={step > 1}/>
            <div style={{ width: 16, height: 1, background: 'var(--color-border)', flexShrink: 0 }}/>
            <Step n="3" label="Graded"  active={step === 2} done={step > 2}/>
          </div>

          {grade && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
              <CheckCircle size={14} color="var(--color-sage-dark)"/>
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: '0.62rem', fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-sage-dark)',
              }}>Listed!</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{
        maxWidth: 560, margin: '0 auto',
        padding: '2.5rem 1.5rem 5rem',
        position: 'relative', zIndex: 5,
        display: 'flex', flexDirection: 'column', gap: '1.25rem',
      }}>

        {/* Page title */}
        <div style={{ marginBottom: '0.5rem' }}>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.6rem', fontWeight: 500,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'var(--color-sage-dark)', margin: '0 0 0.5rem',
          }}>Pass on your passion for a second chance</p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 7vw, 2.8rem)',
            fontWeight: 400, fontStyle: 'italic',
            color: 'var(--color-ink)', lineHeight: 1.1, margin: 0,
          }}>List your <span style={{ fontStyle: 'normal' }}>Gear.</span></h1>
        </div>

        {/* ── Photo section ── */}
        <div style={{ border: '1px solid var(--color-border)', background: 'var(--color-cream-card)' }}>
          <div style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid var(--color-border)' }}>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.58rem', fontWeight: 600,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              color: 'var(--color-ink-mid)', margin: 0,
            }}>Photo *</p>
          </div>
          <div style={{ padding: '1.25rem' }}>
            {!imagePreview ? (
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: '0.75rem', cursor: 'pointer',
                height: 200, border: '1.5px dashed var(--color-border)',
                background: 'var(--color-cream)', transition: 'border-color 0.2s, background 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-sage-dark)'; e.currentTarget.style.background = 'var(--color-sage-pale)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)';     e.currentTarget.style.background = 'var(--color-cream)'; }}
              >
                <input type="file" accept="image/*" capture="environment"
                  onChange={handleImageSelect} style={{ display: 'none' }}/>
                <div style={{
                  width: 48, height: 48, border: '1px solid var(--color-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Camera size={22} color="var(--color-ink-light)"/>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: 'var(--color-ink-mid)', margin: '0 0 0.2rem',
                  }}>Add Photo</p>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.7rem',
                    color: 'var(--color-ink-light)', margin: 0,
                  }}>Tap to upload or take a picture</p>
                </div>
              </label>
            ) : (
              <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                <img src={imagePreview} alt="Item preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
                {grade && (
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'rgba(245,240,232,0.95)', borderTop: '1px solid var(--color-border)',
                    padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                  }}>
                    <Sparkles size={13} color="var(--color-sage-dark)"/>
                    <span style={{
                      fontFamily: 'var(--font-display)', fontSize: '0.88rem', fontStyle: 'italic',
                      color: 'var(--color-ink)',
                    }}>{grade.level}</span>
                    {grade.category && (
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--color-ink-light)' }}>
                        · {grade.category}
                      </span>
                    )}
                  </div>
                )}
                <button onClick={handleRemoveImage} style={{
                  position: 'absolute', top: 10, right: 10, width: 30, height: 30,
                  border: 'none', background: 'rgba(28,26,21,0.65)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.18s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(28,26,21,0.9)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(28,26,21,0.65)'}
                >
                  <X size={15} color="white"/>
                </button>
                <div style={{
                  position: 'absolute', top: 10, left: 10,
                  background: 'var(--color-cream)', border: '1px solid var(--color-border)',
                  padding: '0.18rem 0.55rem',
                  fontFamily: 'var(--font-body)', fontSize: '0.56rem', fontWeight: 600,
                  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-ink-mid)',
                }}>Photo added ✓</div>
              </div>
            )}
          </div>
        </div>

        {/* ── Info fields ── */}
        <div style={{ border: '1px solid var(--color-border)', background: 'var(--color-cream-card)' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-border-light)' }}>
            <Field label="Item Name *" hint="e.g. Blue Backpack, Calculator">
              <input type="text"
                placeholder="What are you donating?"
                value={name} onChange={e => setName(e.target.value)} maxLength={100}
                onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                style={{ ...baseInput, ...focusStyle('name') }}
              />
            </Field>
          </div>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-border-light)' }}>
            <Field label="School *" hint="e.g. RI, HCI, NYP, VJC">
              <input type="text"
                placeholder="Which school is this from?"
                value={school} onChange={e => setSchool(e.target.value)} maxLength={50}
                onFocus={() => setFocused('school')} onBlur={() => setFocused(null)}
                style={{ ...baseInput, ...focusStyle('school') }}
              />
            </Field>
          </div>
          <div style={{ padding: '1.25rem' }}>
            <Field label="Description" hint={`${description.length}/500`}>
              <textarea
                placeholder="Condition, size, any details that help..."
                value={description} onChange={e => setDescription(e.target.value)}
                rows={4} maxLength={500}
                onFocus={() => setFocused('desc')} onBlur={() => setFocused(null)}
                style={{ ...baseInput, resize: 'none', lineHeight: 1.65, ...focusStyle('desc') }}
              />
            </Field>
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div style={{
            padding: '0.85rem 1rem', border: '1px solid var(--color-amber-border)',
            background: 'var(--color-amber-pale)',
            display: 'flex', gap: '0.6rem', alignItems: 'flex-start',
          }}>
            <AlertCircle size={15} color="var(--color-amber-accent)" style={{ flexShrink: 0, marginTop: 2 }}/>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.8rem',
              color: 'var(--color-amber-accent)', margin: 0, lineHeight: 1.6,
            }}>{error}</p>
          </div>
        )}

        {/* ── CTA ── */}
        {!grade ? (
          <button onClick={handleAIGrading} disabled={!canSubmit} style={{
            width: '100%', border: 'none', borderRadius: 0, padding: '1rem 1.5rem',
            background: canSubmit ? 'var(--color-ink)' : 'var(--color-border)',
            color:      canSubmit ? 'var(--color-cream)' : 'var(--color-ink-light)',
            fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => { if (canSubmit) e.currentTarget.style.background = 'var(--color-sage-deep)'; }}
            onMouseLeave={e => { if (canSubmit) e.currentTarget.style.background = 'var(--color-ink)'; }}
          >
            {isGrading
              ? <><RefreshCw size={14} style={{ animation: 'donSpin 1s linear infinite' }}/> AI Inspecting Quality…</>
              : <><Sparkles size={14}/> List Now &amp; Grade</>
            }
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Grade result */}
            <div style={{
              border: '1px solid var(--color-border)', background: 'var(--color-cream-card)',
              overflow: 'hidden', animation: 'donFadeUp 0.4s ease both',
            }}>
              {/* Header */}
              <div style={{
                background: grade.level?.includes('A') ? 'var(--color-sage-dark)' : 'var(--color-amber-accent)',
                padding: '1.5rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                  <CheckCircle size={20} color="white"/>
                  <h3 style={{
                    fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontStyle: 'italic',
                    color: 'white', margin: 0, lineHeight: 1,
                  }}>{grade.level}</h3>
                </div>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.5,
                }}>{grade.condition}</p>
              </div>

              {/* Feedback */}
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.85rem',
                  color: 'var(--color-ink-mid)', margin: 0, lineHeight: 1.75,
                }}>{grade.feedback}</p>
              </div>

              {/* Stats grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                {[
                  { label: 'Quality Score', val: `${grade.quality_score}/10`                        },
                  { label: 'CO₂ Impact',    val: grade.impact.split(' ')[0]                         },
                  { label: 'Category',      val: grade.category || '—'                              },
                  { label: 'Donation ID',   val: grade.donation_id ? `#${grade.donation_id}` : '—'  },
                ].map((s, i) => (
                  <div key={s.label} style={{
                    padding: '1rem 1.25rem',
                    borderRight:  i % 2 === 0 ? '1px solid var(--color-border)' : 'none',
                    borderBottom: i < 2       ? '1px solid var(--color-border)' : 'none',
                  }}>
                    <p style={{
                      fontFamily: 'var(--font-body)', fontSize: '0.56rem', fontWeight: 600,
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: 'var(--color-ink-light)', margin: '0 0 0.3rem',
                    }}>{s.label}</p>
                    <p style={{
                      fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontStyle: 'italic',
                      color: 'var(--color-ink)', margin: 0, lineHeight: 1,
                    }}>{s.val}</p>
                  </div>
                ))}
              </div>

              {/* Success note */}
              <div style={{
                padding: '1rem 1.25rem', background: 'var(--color-sage-pale)',
                borderTop: '1px solid var(--color-sage-mid)', textAlign: 'center',
              }}>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600,
                  color: 'var(--color-sage-dark)', margin: '0 0 0.2rem',
                }}>✓ {grade.message || 'Item successfully listed!'}</p>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.7rem',
                  color: 'var(--color-ink-mid)', margin: 0, lineHeight: 1.6,
                }}>Your item is now visible on the Request page for students to find!</p>
              </div>
            </div>

            {/* List another */}
            <button onClick={handleReset} style={{
              width: '100%', borderRadius: 0, padding: '0.9rem',
              background: 'none', border: '1px solid var(--color-border)',
              color: 'var(--color-ink)',
              fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              transition: 'background 0.18s, color 0.18s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-ink)'; e.currentTarget.style.color = 'var(--color-cream)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none';             e.currentTarget.style.color = 'var(--color-ink)'; }}
            >
              List Another Item <Arrow size={12}/>
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes donFadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes donSpin   { to { transform: rotate(360deg); } }
        @media (max-width: 500px) { .donate-steps { display: none !important; } }
        input:focus, textarea:focus { outline: none; }
      `}</style>
    </div>
  );
};

export default Donate;
