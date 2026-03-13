import React, { useState } from 'react';
import { Camera, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const Donate = () => {
  const [image, setImage] = useState(null);
  const [isGrading, setIsGrading] = useState(false);
  const [grade, setGrade] = useState(null);
  const [error, setError] = useState(null);

  // Real API integration replacing simulateGrading
  const handleAIGrading = async () => {
    if (!image) return;
    
    setIsGrading(true);
    setError(null);

    try {
      // Create FormData to send image file
      const formData = new FormData();
      formData.append('file', image);

      // Call your FastAPI backend
      const response = await axios.post(
        'http://localhost:8000/api/donations/grade',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Map backend response to your UI format
      setGrade({
        level: `Grade ${response.data.condition}`, // e.g., "Grade A"
        condition: response.data.condition, // "Excellent", "Good", etc.
        quality_score: response.data.quality_score,
        category: response.data.category,
        feedback: response.data.feedback,
        impact: calculateCO2Impact(response.data.quality_score), // Calculate CO2 savings
        donation_id: response.data.donation_id // Store for later use
      });

    } catch (err) {
      console.error('Grading failed:', err);
      setError(err.response?.data?.detail || 'Failed to grade item. Please try again.');
    } finally {
      setIsGrading(false);
    }
  };

  // Helper function to calculate CO2 impact based on quality
  const calculateCO2Impact = (qualityScore) => {
    const baseCO2 = 5.2; // kg CO2 per item
    const impact = (qualityScore / 10) * baseCO2;
    return `${impact.toFixed(1)}kg CO2 saved`;
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setGrade(null); // Reset previous grade
      setError(null);
    } else {
      setError('Please select a valid image file');
    }
  };

  // Reset and take new photo
  const handleRetake = () => {
    setImage(null);
    setGrade(null);
    setError(null);
  };

  return (
    <div className="p-6 max-w-md mx-auto min-h-screen bg-white">
      <h2 className="text-2xl font-bold mb-4">Donate Gear</h2>
      
      {!image ? (
        <div className="border-4 border-dashed border-slate-100 rounded-3xl p-12 text-center">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageSelect}
            className="hidden" 
            id="upload" 
          />
          <label htmlFor="upload" className="cursor-pointer">
            <Camera size={48} className="mx-auto text-blue-500 mb-4" />
            <p className="text-slate-600 font-medium">Snap photo of gear</p>
            <p className="text-slate-400 text-sm mt-2">Upload image for AI quality check</p>
          </label>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative">
            <img 
              src={URL.createObjectURL(image)} 
              className="rounded-2xl w-full h-64 object-cover" 
              alt="Gear" 
            />
            <button 
              onClick={handleRetake}
              className="absolute top-2 right-2 bg-white/90 p-2 rounded-full shadow-lg"
            >
              <RefreshCw size={20} />
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-start gap-2">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          {!grade ? (
            <button 
              onClick={handleAIGrading}
              disabled={isGrading} 
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isGrading ? <RefreshCw className="animate-spin" /> : null}
              {isGrading ? "AI Grading in progress..." : "Run AI Quality Check"}
            </button>
          ) : (
            <div className="bg-green-50 border border-green-200 p-4 rounded-2xl animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="text-green-600" />
                <span className="font-bold text-green-800">
                  {grade.level}: {grade.condition}
                </span>
              </div>
              
              {/* Display AI Feedback */}
              <p className="text-sm text-green-700 mb-2">{grade.feedback}</p>
              
              {/* Quality Score */}
              <div className="flex justify-between text-sm mb-2">
                <span className="text-green-600">Quality Score:</span>
                <span className="font-bold text-green-800">{grade.quality_score}/10</span>
              </div>
              
              {/* CO2 Impact */}
              <div className="flex justify-between text-sm mb-4">
                <span className="text-green-600">Environmental Impact:</span>
                <span className="font-bold text-green-800">{grade.impact}</span>
              </div>

              <p className="text-xs text-green-600 mb-4">
                Quality verified. This ensures recipient dignity.
              </p>
              
              <button 
                className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
                onClick={() => {
                  // Navigate to listing or next step
                  console.log('Listing item with donation_id:', grade.donation_id);
                  // You can add navigation logic here
                }}
              >
                List for Next Cohort
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Donate;