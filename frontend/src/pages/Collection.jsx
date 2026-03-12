import React from 'react';
import { QrCode, Lock } from 'lucide-react';

const Collection = () => {
  return (
    <div className="p-6 text-center bg-white min-h-screen">
      <div className="bg-blue-600 -mx-6 -mt-6 p-12 mb-8 rounded-b-[3rem]">
        <Lock className="mx-auto text-white mb-4" size={48} />
        <h1 className="text-2xl font-bold text-white">Private Collection [cite: 15]</h1>
        <p className="text-blue-100 text-sm">Scan this at School Locker #12 [cite: 14]</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-2xl inline-block border-8 border-slate-50 mb-8">
        {/* Mock QR Code [cite: 61, 164] */}
        <div className="w-48 h-48 bg-slate-100 flex items-center justify-center rounded-xl border-2 border-slate-200">
           <QrCode size={120} className="text-slate-800" />
        </div>
      </div>

      <div className="max-w-xs mx-auto text-slate-500 text-sm">
        <p>This code is unique to your requested item. It removes the social stigma of secondhand products[cite: 15, 62].</p>
      </div>
    </div>
  );
};

export default Collection;