import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpDown, Leaf, GraduationCap } from 'lucide-react';

const RequestPage = () => {
  const [query, setQuery] = useState('');
  const [school, setSchool] = useState('All');
  const [grade, setGrade] = useState('All');
  const [sortBy, setSortBy] = useState('relevance');
  const [results, setResults] = useState([]); // Initialize as empty array to prevent .length errors
  const [loading, setLoading] = useState(false);

  const schools = ['All', 'RI', 'HCI', 'NYP', 'VJC', 'ACJC'];
  const grades = ['All', 'Grade A', 'Grade B'];

const fetchGear = async (q = '', s = 'All', g = 'All', sort = 'relevance') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ query: q, school: s, grade: g, sort_by: sort });
      const fullUrl = `/api/matches/search?${params.toString()}`;
      
      console.log("🌐 API CALL:", fullUrl); // See exactly what is sent

      const response = await fetch(fullUrl);
      if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
      
      const data = await response.json();
      console.log("📦 RAW DATA RECEIVED:", data); // Check the format here
      
      setResults(Array.isArray(data) ? data : []); 
    } catch (error) {
      console.error("❌ FETCH FAILED:", error);
      setResults([]); 
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch whenever a filter dropdown changes
  useEffect(() => {
    fetchGear(query, school, grade, sortBy);
  }, [school, grade, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchGear(query, school, grade, sortBy);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
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
              {/* School Selector */}
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

              {/* Grade Selector */}
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

              {/* Sort Selector */}
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

        {/* Results with Defensive Null-Check */}
To show the CO2 savings, Grade, and School on your cards, you need to update the JSX inside your .map() function.

Since you are receiving hits from Elasticsearch, these values are stored within hit._source. I have also added some styling to match the clean, "kampong" aesthetic of your app.

🛠️ Updated Results Section for Request.jsx
Replace the existing results.map section with this version:

JavaScript
{loading ? (
  <p className="text-center py-20 text-slate-400 animate-pulse">Searching the Kampong...</p>
) : (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {results.length > 0 ? (
      results.map((hit) => {
        const item = hit._source;
        return (
          <div key={hit._id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Leaf size={20} />
              </div>
              {/* Badge for Grade */}
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

            {/* Bottom Info Bar: School and CO2 */}
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
          onClick={() => {setQuery(''); setSchool('All'); setGrade('All');}} 
          className="mt-6 text-blue-600 font-bold hover:underline"
        >
          Reset to Browse All
        </button>
      </div>
    )}
  </div>
)}

      </div>
    </div>
  );
};

export default RequestPage;