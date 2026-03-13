import React, { useState } from 'react';
import { Camera, RefreshCw, CheckCircle, AlertCircle, X, Sparkles } from 'lucide-react';
import axios from 'axios';

const Donate = () => {
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isGrading, setIsGrading] = useState(false);
  const [grade, setGrade] = useState(null);
  const [error, setError] = useState(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image too large. Maximum 10MB.');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
      setGrade(null);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    setGrade(null);
  };

  const handleAIGrading = async () => {
    // Validation
    if (!image) {
      setError('Please add a photo of your item!');
      return;
    }
    if (!name.trim()) {
      setError('Please provide an item name!');
      return;
    }
    if (!school.trim()) {
      setError('Please enter your school!');
      return;
    }

    setIsGrading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('name', name.trim());
      formData.append('school', school.trim());
      formData.append('description', description.trim());

      const response = await axios.post(
        'http://localhost:8000/api/donations/grade',
        formData,
        { 
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 30000
        }
      );

      // Check if item was rejected
      if (response.data.status === 'rejected') {
        setError(response.data.message || 'Item does not meet quality standards for donation.');
        setGrade(null);
        return;
      }

      // Success
      setGrade({
        level: response.data.grade,
        condition: response.data.condition,
        quality_score: response.data.quality_score,
        category: response.data.category,
        feedback: response.data.feedback,
        impact: `${response.data.co2_saved}kg CO2 saved`,
        donation_id: response.data.donation_id,
        message: response.data.message
      });

    } catch (err) {
      console.error('Grading error:', err);
      setError(
        err.response?.data?.detail || 
        err.message || 
        'Failed to grade item. Please check your connection and try again.'
      );
    } finally {
      setIsGrading(false);
    }
  };

  const handleReset = () => {
    setName('');
    setSchool('');
    setDescription('');
    setImage(null);
    setImagePreview(null);
    setGrade(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 pb-20">
      {/* Header */}
      <div className="max-w-xl mx-auto bg-white border-b sticky top-0 z-10 px-6 py-4 flex justify-between items-center shadow-sm backdrop-blur-sm bg-white/95">
        <h1 className="font-bold text-xl text-slate-800">List Gear</h1>
        {grade && (
          <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
            <CheckCircle size={18} />
            <span>Listed!</span>
          </div>
        )}
      </div>

      <div className="max-w-xl mx-auto p-6 space-y-5">
        {/* Photo Section */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          {!imagePreview ? (
            <label className="w-full h-72 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-green-50 hover:border-green-300 transition-all group">
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                onChange={handleImageSelect} 
                className="hidden" 
              />
              <div className="p-4 bg-slate-50 rounded-full mb-4 group-hover:bg-green-100 transition-colors">
                <Camera size={32} className="text-slate-400 group-hover:text-green-600 transition-colors" />
              </div>
              <p className="text-sm text-slate-600 font-semibold">Add Photo</p>
              <p className="text-xs text-slate-400 mt-1">Tap to upload or take a picture</p>
            </label>
          ) : (
            <div className="relative h-72 rounded-2xl overflow-hidden shadow-lg">
              <img 
                src={imagePreview} 
                className="w-full h-full object-cover" 
                alt="Item preview" 
              />
              <button 
                onClick={handleRemoveImage}
                className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all backdrop-blur-sm"
              >
                <X size={20} />
              </button>
              {grade && (
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-green-600" />
                    <span className="text-sm font-bold text-slate-800">{grade.level}</span>
                    <span className="text-xs text-slate-500">• {grade.category}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 divide-y divide-slate-100">
          <div className="p-5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
              Item Name *
            </label>
            <input 
              type="text" 
              placeholder="e.g., Blue Backpack, Scientific Calculator" 
              className="w-full text-lg outline-none text-slate-800 placeholder:text-slate-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
            />
          </div>

          <div className="p-5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
              School *
            </label>
            <input 
              type="text" 
              placeholder="e.g., RI, HCI, NYP, VJC" 
              className="w-full text-lg outline-none text-slate-800 placeholder:text-slate-300"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              maxLength={50}
            />
          </div>

          <div className="p-5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
              Description (Optional)
            </label>
            <textarea 
              placeholder="Condition, size, any details that help..." 
              className="w-full text-base outline-none h-24 resize-none text-slate-800 placeholder:text-slate-300"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
            />
            <p className="text-xs text-slate-400 mt-1 text-right">
              {description.length}/500
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-100 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Action Button */}
        {!grade ? (
          <button 
            onClick={handleAIGrading}
            disabled={isGrading || !image || !name.trim() || !school.trim()}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-5 rounded-2xl font-bold text-lg shadow-lg shadow-green-200 disabled:opacity-40 disabled:shadow-none flex justify-center items-center gap-3 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {isGrading ? (
              <>
                <RefreshCw className="animate-spin" size={22} />
                <span>AI Inspecting Quality...</span>
              </>
            ) : (
              <>
                <Sparkles size={22} />
                <span>List Now & Grade</span>
              </>
            )}
          </button>
        ) : (
          <div className="space-y-4">
            {/* Success Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 p-6 rounded-3xl space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-3 text-green-800">
                <div className="p-2 bg-green-200 rounded-full">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h3 className="font-extrabold text-xl">{grade.level}</h3>
                  <p className="text-sm text-green-700">{grade.condition}</p>
                </div>
              </div>

              <p className="text-green-800 leading-relaxed">{grade.feedback}</p>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-green-200">
                <div className="bg-white/60 p-3 rounded-xl">
                  <p className="text-xs text-green-600 font-semibold mb-1">Quality Score</p>
                  <p className="text-2xl font-bold text-green-900">{grade.quality_score}/10</p>
                </div>
                <div className="bg-white/60 p-3 rounded-xl">
                  <p className="text-xs text-green-600 font-semibold mb-1">CO₂ Impact</p>
                  <p className="text-2xl font-bold text-green-900">{grade.impact.split(' ')[0]}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-green-200">
                <p className="text-green-800 font-bold text-center text-sm">
                  ✅ {grade.message || 'Item successfully listed!'}
                </p>
                <p className="text-green-600 text-xs text-center mt-2">
                  Your item is now visible on the Request page for students to find!
                </p>
              </div>
            </div>

            {/* List Another Button */}
            <button 
              onClick={handleReset}
              className="w-full bg-white border-2 border-slate-200 text-slate-700 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all"
            >
              List Another Item
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Donate;