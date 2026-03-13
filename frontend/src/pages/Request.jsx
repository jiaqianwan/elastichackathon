import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpDown, Leaf, GraduationCap, X, Calendar, Image as ImageIcon, Sparkles } from 'lucide-react';
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

  const schools = ['All', 'RI', 'HCI', 'NYP', 'VJC', 'ACJC'];
  const grades = ['All', 'Grade A', 'Grade B'];

  const fetchGear = async (q = '', s = 'All', g = 'All', sort = 'relevance') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ 
        query: q, 
        school: s === 'All' ? '' : s, 
        grade: g === 'All' ? '' : g, 
        sort_by: sort 
      });
      
      const fullUrl = `http://localhost:8000/api/matches/search?${params.toString()}`;
      
      console.log("🌐 API CALL:", fullUrl);

      const response = await fetch(fullUrl);
      if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
      
      const data = await response.json();
      console.log("📦 RAW DATA RECEIVED:", data);
      
      const items = Array.isArray(data) ? data : (data.hits || []);
      setResults(items); 
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

  const openDetails = (item) => {
    setSelectedItem(item);
  };

  const closeDetails = () => {
    setSelectedItem(null);
  };

  const handleRequestItem = () => {
    // Generate order details
    const orderId = `SHH-${Math.floor(1000 + Math.random() * 9000)}`;
    const validUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    // Navigate to Collection page with item data
    navigate('/collection', { 
      state: { 
        item: selectedItem,
        orderId,
        validUntil
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
            <Sparkles size={16} />
            <span>Find gear with dignity</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
            Request Gear
          </h1>
          <p className="text-slate-600 text-lg">
            Browse quality items donated by your community
          </p>
        </header>

        {/* Search Bar */}
        <div className="bg-white p-5 rounded-3xl shadow-xl border border-slate-200 mb-10">
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text"
                placeholder="Search for backpacks, calculators, uniforms..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 placeholder:text-slate-400"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap md:flex-nowrap gap-3">
              <div className="relative flex-1 min-w-[140px]">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                <select 
                  value={school} 
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 rounded-2xl bg-slate-50 border-none text-sm appearance-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-slate-700 font-medium"
                >
                  {schools.map(s => <option key={s} value={s}>{s === 'All' ? 'All Schools' : s}</option>)}
                </select>
              </div>

              <div className="relative flex-1 min-w-[140px]">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                <select 
                  value={grade} 
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 rounded-2xl bg-slate-50 border-none text-sm appearance-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-slate-700 font-medium"
                >
                  {grades.map(g => <option key={g} value={g}>{g === 'All' ? 'All Grades' : g}</option>)}
                </select>
              </div>

              <div className="relative flex-1 min-w-[140px]">
                <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 rounded-2xl bg-slate-50 border-none text-sm appearance-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-slate-700 font-medium"
                >
                  <option value="relevance">Relevance</option>
                  <option value="co2">Max CO2 Saved</option>
                  <option value="grade">Grade (A-Z)</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Search
            </button>
          </form>
        </div>

        {/* Results Count */}
        {!loading && results.length > 0 && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-slate-600 font-medium">
              Found <span className="font-bold text-slate-900">{results.length}</span> items
            </p>
          </div>
        )}

        {/* Results Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
            <p className="text-slate-400 font-medium">Searching the community...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.length > 0 ? (
              results.map((hit) => {
                const item = hit._source;
                const hasImage = item.image_data && item.image_data.length > 0;

                return (
                  <div 
                    key={hit._id} 
                    onClick={() => openDetails({ ...item, id: hit._id })}
                    className="bg-white rounded-3xl shadow-sm border border-slate-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer overflow-hidden"
                  >
                    {/* Image Preview */}
                    {hasImage ? (
                      <div className="h-52 bg-slate-100 overflow-hidden relative">
                        <img 
                          src={`data:${item.image_type || 'image/jpeg'};base64,${item.image_data}`}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    ) : (
                      <div className="h-52 bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 flex items-center justify-center">
                        <ImageIcon size={56} className="text-slate-300" />
                      </div>
                    )}

                    {/* Card Content */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                          <Leaf size={18} />
                        </div>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                          item.grade === 'Grade A' 
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}>
                          {item.grade || 'Ungraded'}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                          <GraduationCap size={14} />
                          <span>{item.school || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-700 text-xs font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                          <span>🌿 {item.co2_saved || 0}kg</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Search size={32} className="text-slate-400" />
                </div>
                <p className="text-slate-600 text-lg font-semibold mb-2">No items found</p>
                <p className="text-slate-400 text-sm mb-6">Try adjusting your search or filters</p>
                <button 
                  onClick={() => {setQuery(''); setSchool('All'); setGrade('All');}} 
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal for Item Details */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={closeDetails}
        >
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-8 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Large Image Display */}
            {selectedItem.image_data ? (
              <div className="h-96 bg-slate-100 overflow-hidden rounded-t-3xl relative">
                <img 
                  src={`data:${selectedItem.image_type || 'image/jpeg'};base64,${selectedItem.image_data}`}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                <button 
                  onClick={closeDetails}
                  className="absolute top-4 right-4 p-2.5 bg-white/90 hover:bg-white rounded-full transition-all shadow-lg backdrop-blur-sm"
                >
                  <X size={20} className="text-slate-700" />
                </button>
              </div>
            ) : (
              <div className="h-96 bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 flex items-center justify-center rounded-t-3xl relative">
                <ImageIcon size={96} className="text-slate-300" />
                <button 
                  onClick={closeDetails}
                  className="absolute top-4 right-4 p-2.5 bg-white/90 hover:bg-white rounded-full transition-all shadow-lg"
                >
                  <X size={20} className="text-slate-700" />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="p-8 space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">{selectedItem.name}</h2>
                <p className="text-slate-500 font-medium">{selectedItem.category || 'School Equipment'}</p>
              </div>

              {/* Grade Badge */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`px-5 py-2 rounded-full text-sm font-bold uppercase shadow-sm ${
                  selectedItem.grade === 'Grade A' 
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                    : 'bg-amber-100 text-amber-700 border border-amber-200'
                }`}>
                  {selectedItem.grade}
                </span>
                <span className="text-slate-600 text-sm font-semibold bg-slate-100 px-4 py-2 rounded-full">
                  {selectedItem.condition}
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                  Description
                </h3>
                <p className="text-slate-600 leading-relaxed text-base">
                  {selectedItem.description || 'No description provided.'}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-2">
                    <GraduationCap size={16} />
                    <span className="font-semibold uppercase tracking-wide">School</span>
                  </div>
                  <p className="text-slate-900 font-bold text-xl">{selectedItem.school}</p>
                </div>

                <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
                  <div className="flex items-center gap-2 text-emerald-600 text-xs mb-2">
                    <Leaf size={16} />
                    <span className="font-semibold uppercase tracking-wide">CO₂ Impact</span>
                  </div>
                  <p className="text-emerald-900 font-bold text-xl">{selectedItem.co2_saved}kg saved</p>
                </div>

                <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-2 text-blue-600 text-xs mb-2">
                    <Filter size={16} />
                    <span className="font-semibold uppercase tracking-wide">Quality Score</span>
                  </div>
                  <p className="text-blue-900 font-bold text-xl">{selectedItem.quality_score || 'N/A'}/10</p>
                </div>

                <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100">
                  <div className="flex items-center gap-2 text-purple-600 text-xs mb-2">
                    <Calendar size={16} />
                    <span className="font-semibold uppercase tracking-wide">Listed</span>
                  </div>
                  <p className="text-purple-900 font-bold text-lg">
                    {selectedItem.created_at 
                      ? new Date(selectedItem.created_at).toLocaleDateString() 
                      : 'Recently'}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={handleRequestItem}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Sparkles size={20} />
                Request This Item
              </button>

              <p className="text-center text-slate-400 text-xs leading-relaxed">
                By requesting, you agree to collect the item with dignity and care.<br/>
                Your identity remains private throughout the process.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestPage;