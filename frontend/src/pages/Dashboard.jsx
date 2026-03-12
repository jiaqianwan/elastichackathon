import React from 'react';
import { Leaf, DollarSign, Package } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Your Impact Dashboard [cite: 13, 74]</h1>
      
      <div className="grid grid-cols-1 gap-4 mb-8">
        {/* CO2 Metric [cite: 28, 89] */}
        <div className="bg-white p-6 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-2xl"><Leaf className="text-green-600" /></div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Environment</p>
            <p className="text-xl font-extrabold text-slate-800">12.4 kg CO2 Saved</p>
          </div>
        </div>

        {/* Cost Savings Metric [cite: 13] */}
        <div className="bg-white p-6 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-2xl"><DollarSign className="text-blue-600" /></div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Social Equity</p>
            <p className="text-xl font-extrabold text-slate-800">$450 Saved for Peers</p>
          </div>
        </div>
      </div>

      <h2 className="font-bold text-slate-800 mb-4">Donation History [cite: 30]</h2>
      <div className="space-y-3">
        {['Fencing Foil', 'ACS Blazer'].map((item, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Package className="text-slate-400" />
              <span className="font-medium text-slate-700">{item}</span>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md text-slate-500">Completed</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;