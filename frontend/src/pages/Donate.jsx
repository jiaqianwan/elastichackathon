import React, { useState } from 'react';
import { Camera, RefreshCw, CheckCircle } from 'lucide-react';

const Donate = () => {
  const [image, setImage] = useState(null);
  const [isGrading, setIsGrading] = useState(false);
  const [grade, setGrade] = useState(null);

  const simulateGrading = () => {
    setIsGrading(true);
    // Simulate FastAPI -> Amazon Bedrock integration [cite: 106, 160]
    setTimeout(() => {
      setGrade({
        level: "Grade A",
        condition: "Near New",
        impact: "5.2kg CO2 saved"
      });
      setIsGrading(false);
    }, 2500);
  };

  return (
    <div className="p-6 max-w-md mx-auto min-h-screen bg-white">
      <h2 className="text-2xl font-bold mb-4">Donate Gear [cite: 64]</h2>
      
      {!image ? (
        <div className="border-4 border-dashed border-slate-100 rounded-3xl p-12 text-center">
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="hidden" id="upload" />
          <label htmlFor="upload" className="cursor-pointer">
            <Camera size={48} className="mx-auto text-blue-500 mb-4" />
            <p className="text-slate-600 font-medium">Snap photo of gear [cite: 8]</p>
          </label>
        </div>
      ) : (
        <div className="space-y-6">
          <img src={URL.createObjectURL(image)} className="rounded-2xl w-full h-64 object-cover" alt="Gear" />
          
          {!grade ? (
            <button onClick={simulateGrading} disabled={isGrading} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2">
              {isGrading ? <RefreshCw className="animate-spin" /> : null}
              {isGrading ? "AI Grading in progress..." : "Run AI Quality Check [cite: 85]"}
            </button>
          ) : (
            <div className="bg-green-50 border border-green-200 p-4 rounded-2xl animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="text-green-600" />
                <span className="font-bold text-green-800">{grade.level}: {grade.condition} [cite: 9]</span>
              </div>
              <p className="text-sm text-green-700">Quality verified. This ensures recipient dignity[cite: 10].</p>
              <button className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-bold">List for Next Cohort [cite: 12]</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Donate;