import React, { useState } from 'react';
import { Camera, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const Donate = () => {
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [isGrading, setIsGrading] = useState(false);
  const [grade, setGrade] = useState(null);
  const [error, setError] = useState(null);

  const calculateCO2Impact = (score) => `${(score * 1.5).toFixed(1)}kg CO2 saved`;

  const handleAIGrading = async () => {
    if (!image || !name || !school) {
      setError('Please provide item name, school, and photo!');
      return;
    }
    
    setIsGrading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('name', name);
      formData.append('school', school);
      formData.append('description', description);

      const response = await axios.post(
        'http://localhost:8000/api/donations/grade',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setGrade({
        level: `Grade ${response.data.condition}`,
        condition: response.data.condition,
        quality_score: response.data.quality_score,
        feedback: response.data.feedback,
        impact: calculateCO2Impact(response.data.quality_score),
        donation_id: response.data.donation_id
      });

    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to grade. Check your Backend.');
    } finally {
      setIsGrading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-xl mx-auto bg-white border-b sticky top-0 z-10 px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="font-bold text-xl">List Gear</h1>
        {grade && <span className="text-green-600 font-bold">Graded!</span>}
      </div>

      <div className="max-w-xl mx-auto p-6 space-y-4">
        {/* Photo Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border">
          {!image ? (
            <label className="w-full h-64 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-green-50">
              <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="hidden" />
              <Camera size={40} className="text-gray-300 mb-2" />
              <p className="text-sm text-gray-500 font-medium font-bold uppercase">Add Photo</p>
            </label>
          ) : (
            <div className="relative h-64 rounded-2xl overflow-hidden shadow-inner">
              <img src={URL.createObjectURL(image)} className="w-full h-full object-cover" alt="Gear" />
              <button onClick={() => setImage(null)} className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full">✕</button>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-2xl shadow-sm border divide-y divide-gray-100">
          <div className="p-4">
            <input type="text" placeholder="item name" className="w-full text-lg outline-none" onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="p-4">
            <input type="text" placeholder="school" className="w-full text-lg outline-none" onChange={(e) => setSchool(e.target.value)} />
          </div>
          <div className="p-4">
            <textarea placeholder="description" className="w-full text-lg outline-none h-24 resize-none" onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>

        {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}

        {!grade ? (
          <button 
            onClick={handleAIGrading}
            disabled={isGrading || !image}
            className="w-full bg-[#00b341] text-white py-4 rounded-2xl font-bold text-lg shadow-lg disabled:opacity-30 flex justify-center items-center gap-3"
          >
            {isGrading && <RefreshCw className="animate-spin" />}
            {isGrading ? "Inspecting Quality..." : "List Now & Grade"}
          </button>
        ) : (
          <div className="bg-green-50 border-2 border-green-100 p-6 rounded-2xl space-y-3 animate-in fade-in">
             <div className="flex items-center gap-2 text-green-800 font-extrabold text-xl uppercase">
               <CheckCircle /> {grade.level}
             </div>
             <p className="text-green-700">{grade.feedback}</p>
             <div className="flex justify-between font-bold text-green-900 border-t border-green-200 pt-3 text-sm">
               <span>Environmental Impact:</span>
               <span>{grade.impact}</span>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Donate;