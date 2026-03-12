import React, { useState } from 'react';
import { Search, MapPin, ShieldCheck } from 'lucide-react';

const Request = () => {
  // Mock data representing items in your Elasticsearch DB
  const [items] = useState([
    { id: 1, name: 'Fencing Kit', school: 'RI', grade: 'Grade A', category: 'Sports' },
    { id: 2, name: 'Violin (1/2 Size)', school: 'ACS', grade: 'Grade B', category: 'Music' },
    { id: 3, name: 'Football Boots', school: 'VJC', grade: 'Grade A', category: 'Sports' },
  ]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Find Equipment</h1>
        <p className="text-slate-500 text-sm">Browse high-quality gear from your peers.</p>
      </header>

      {/* Search Bar - Logic will eventually hit backend/app/api/matches.py */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Search e.g. 'Fencing'..." 
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Item Grid */}
      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold">
                {item.grade}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
              <MapPin size={14} />
              <span>{item.school}</span>
            </div>

            <button className="w-full bg-slate-800 text-white py-2 rounded-lg font-medium hover:bg-slate-700 transition-colors">
              Request Item
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Request;