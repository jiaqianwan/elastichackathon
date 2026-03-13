import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpDown, Leaf, GraduationCap, ArrowLeft, X, MapPin, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RequestPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [school, setSchool] = useState('All');
  const [grade, setGrade] = useState('All');
  const [sortBy, setSortBy] = useState('relevance');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [requesting, setRequesting] = useState(false);

  const schools = ['All', 'RI', 'HCI', 'NYP', 'VJC', 'ACJC'];
  const grades = ['All', 'Grade A', 'Grade B'];

  const fetchGear = async (q = '', s = 'All', g = 'All', sort = 'relevance') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ query: q, school: s, grade: g, sort_by: sort });
      const fullUrl = `/api/matches/search?${params.toString()}`;
      const response = await fetch(fullUrl);
      if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
      const data = await response.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ FETCH FAILED:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGear(query, school, grade, sortBy);
  }, [school, grade, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchGear(query, school, grade, sortBy);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 relative">
      <div className="max-w-6xl mx-auto">

        <button
          onClick={() => navigate('/')}
          className="group mb-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-medium"
        >
          <div className="p-2 bg-white rounded-xl shadow-sm group-hover:shadow-md group-hover:bg-blue-50 transition-all">
            <ArrowLeft size={20} />
          </div>
          Back to Home
        </button>

        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Request Gear</h1>
          <p className="text-slate-500 mt-2 text-lg italic">Find what you need with dignity.</p>
        </header>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-3xl shadow-xl border border-slate-100 mb-10">
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search gear..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap md:flex-nowrap gap-3">
              <div className="relative flex-1">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                <select
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 rounded-2xl bg-slate-50 border-none text-sm appearance-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {schools.map(s => <option key={s} value={s}>{s === 'All' ? 'All Schools' : s}</option>)}
                </select>
              </div>

              <div className="relative flex-1">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 rounded-2xl bg-slate-50 border-none text-sm appearance-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {grades.map(g => <option key={g} value={g}>{g === 'All' ? 'All Grades' : g}</option>)}
                </select>
              </div>

              <div className="relative flex-1">
                <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 rounded-2xl bg-slate-50 border-none text-sm appearance-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="relevance">Relevance</option>
                  <option value="co2">Max CO2 Saved</option>
                  <option value="grade">Grade (A-Z)</option>
                </select>
              </div>
            </div>

            <button type="submit" className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
              Find
            </button>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <p className="text-center py-20 text-slate-400 animate-pulse">Searching the Kampong...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.length > 0 ? (
              results.map((hit) => {
                const item = hit._source;
                return (
                  <div
                    key={hit._id}
                    onClick={() => { setSelectedItem(item); setMatchResult(null); }}
                    className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Leaf size={20} />
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        item.grade === 'Grade A' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {item.grade || 'Ungraded'}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mb-2">{item.name}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
                        <GraduationCap size={14} />
                        <span>{item.school || 'Unknown School'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-3 py-1 rounded-lg">
                        <span>🌿 {item.co2_saved || 0}kg saved</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 text-lg font-medium">No gear found matching your criteria.</p>
                <button
                  onClick={() => { setQuery(''); setSchool('All'); setGrade('All'); }}
                  className="mt-6 text-blue-600 font-bold hover:underline"
                >
                  Reset to Browse All
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">

            {/* Close Button */}
            <button
              onClick={() => { setSelectedItem(null); setMatchResult(null); }}
              className="absolute right-6 top-6 p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors z-10"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="h-48 bg-blue-600 p-8 flex flex-col justify-end">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl w-fit mb-4">
                <Leaf className="text-white" size={24} />
              </div>
              <h2 className="text-3xl font-bold text-white leading-tight">{selectedItem.name}</h2>
            </div>

            {/* Content */}
            <div className="p-8">

              {/* Only show item details if no match result yet */}
              {!matchResult && (
                <>
                  <div className="flex gap-3 mb-6">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      selectedItem.grade === 'Grade A' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {selectedItem.grade || 'Ungraded'}
                    </span>
                    <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                      <GraduationCap size={14} /> {selectedItem.school}
                    </span>
                  </div>

                  <p className="text-slate-600 text-lg leading-relaxed mb-8">
                    {selectedItem.description || "No further description provided for this item."}
                  </p>

                  <div className="space-y-4 mb-10">
                    <div className="flex items-center gap-4 text-slate-500">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                        <MapPin size={18} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Location</p>
                        <p className="text-sm font-semibold text-slate-700">{selectedItem.school}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-slate-500">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                        <Calendar size={18} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Added On</p>
                        <p className="text-sm font-semibold text-slate-700">Recently</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-50 p-4 rounded-2xl flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-500 p-2 rounded-lg text-white">
                        <Leaf size={16} />
                      </div>
                      <span className="text-sm font-bold text-emerald-700">Sustainability Impact</span>
                    </div>
                    <span className="text-lg font-black text-emerald-600">{selectedItem.co2_saved || 0}kg CO2 saved</span>
                  </div>

                  <button
                    onClick={async () => {
                      setRequesting(true);
                      try {
                        const res = await fetch('/api/matches/request', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            recipient_id:   'student_123',
                            recipient_name: 'You',
                            category:       selectedItem.category,
                            school:         selectedItem.school,
                            urgency:        'normal',
                          }),
                        });
                        const data = await res.json();
                        setMatchResult(data);
                      } catch (err) {
                        console.error('Request failed:', err);
                      } finally {
                        setRequesting(false);
                      }
                    }}
                    disabled={requesting}
                    className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-60"
                  >
                    {requesting ? 'Matching...' : 'Request this Gear'}
                  </button>
                </>
              )}

              {/* Match Result */}
              {matchResult && (
                <div className={`p-6 rounded-2xl text-center ${matchResult.matched ? 'bg-emerald-50' : 'bg-blue-50'}`}>
                  {matchResult.matched ? (
                    <>
                      <p className="text-4xl mb-3">🎉</p>
                      <p className="font-bold text-emerald-700 text-xl mb-2">Match Found!</p>
                      <p className="text-emerald-600 text-sm mb-1">{matchResult.message}</p>
                      <p className="text-xs text-emerald-500 font-bold mb-6">
                        🌿 {matchResult.match?.co2_saved}kg CO2 saved
                      </p>
                      <button
                        onClick={() => navigate('/collection')}
                        className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all"
                      >
                        View My QR Code →
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-4xl mb-3">⏳</p>
                      <p className="font-bold text-blue-700 text-xl mb-2">You're in the Queue</p>
                      <p className="text-blue-600 text-sm mb-6">{matchResult.message}</p>
                      <button
                        onClick={() => { setSelectedItem(null); setMatchResult(null); }}
                        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all"
                      >
                        Got it
                      </button>
                    </>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestPage;
