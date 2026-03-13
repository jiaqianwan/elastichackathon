import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Search, BarChart3, PackageCheck } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Hero Header: Focus on transforming Waste to Wealth */}
      <header className="bg-blue-700 text-white px-6 pt-12 pb-16 rounded-b-[2.5rem] shadow-xl">
        <h1 className="text-3xl font-black mb-2 tracking-tight">SecondHand Hero</h1>
        <p className="text-blue-100 text-sm opacity-90 leading-relaxed max-w-xs">
          Bridging the participation gap and ending the graduation waste cycle[cite: 3, 4].
        </p>
      </header>

      {/* Main Action Grid */}
      <main className="px-6 -mt-8 space-y-4">
        
        {/* Donor Path */}
        <div 
          onClick={() => navigate('/donate')}
          className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 cursor-pointer hover:scale-[1.02] transition-transform"
        >
          <div className="bg-green-100 p-4 rounded-2xl">
            <Camera className="text-green-600" size={28} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-800 text-lg">Donate Gear</h3>
            <p className="text-slate-500 text-xs">Snap a photo for AI quality grading[cite: 8].</p>
          </div>
        </div>

        {/* Recipient Path */}
        <div 
          onClick={() => navigate('/request')}
          className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 cursor-pointer hover:scale-[1.02] transition-transform"
        >
          <div className="bg-blue-100 p-4 rounded-2xl">
            <Search className="text-blue-600" size={28} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-800 text-lg">Request Items</h3>
            <p className="text-slate-500 text-xs">Find verified CCA equipment for your needs[cite: 65].</p>
          </div>
        </div>

        {/* Dashboard Path */}
        <div 
          onClick={() => navigate('/dashboard')}
          className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 cursor-pointer hover:scale-[1.02] transition-transform"
        >
          <div className="bg-purple-100 p-4 rounded-2xl">
            <BarChart3 className="text-purple-600" size={28} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-800 text-lg">Impact Dashboard</h3>
            <p className="text-slate-500 text-xs">See your CO2 savings and peer contributions[cite: 13].</p>
          </div>
        </div>

        {/* Collection Status */}
        <div 
          onClick={() => navigate('/collection')}
          className="bg-slate-800 p-5 rounded-3xl shadow-lg flex items-center gap-5 cursor-pointer hover:bg-slate-900 transition-colors"
        >
          <div className="bg-slate-700 p-4 rounded-2xl text-white">
            <PackageCheck size={28} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-lg">My Pickups</h3>
            <p className="text-slate-400 text-xs">Access your QR codes for private collection[cite: 15].</p>
          </div>
        </div>

      </main>

      {/* Footer Note on Stigma */}
      <footer className="mt-12 px-10 pb-10 text-center">
        <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">
          Dignified • Verified • Sustainable [cite: 10, 14]
        </p>
      </footer>
    </div>
  );
};

export default Home;