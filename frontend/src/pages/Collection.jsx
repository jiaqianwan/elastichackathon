import React, { useState, useEffect } from 'react';
import { Lock, ArrowLeft, RefreshCw, Package, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const USER_ID = 'student_123';
const LOCKERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

const Collection = () => {
  const navigate = useNavigate();
  const [matches, setMatches]               = useState([]);
  const [loading, setLoading]               = useState(true);
  const [selectedMatch, setSelectedMatch]   = useState(null);
  const [occupiedLockers, setOccupiedLockers] = useState([]);
  const [selectedLocker, setSelectedLocker] = useState(null);
  const [qrLoading, setQrLoading]           = useState(false);
  const [confirmError, setConfirmError]     = useState(null);

  // Per-match: { [match_id]: { locker, qrCode } } — pre-populated from ES on load
  const [matchData, setMatchData] = useState({});

  useEffect(() => {
    const init = async () => {
      try {
        const [matchRes, lockerRes] = await Promise.all([
          fetch(`/api/matches/my-matches/${USER_ID}`),
          fetch(`/api/distribution/lockers`),
        ]);
        const matchJson  = await matchRes.json();
        const lockerJson = await lockerRes.json();

        const userMatches = matchJson.matches || [];
        setMatches(userMatches);
        setOccupiedLockers(lockerJson.occupied_lockers || []);

        // Pre-populate matchData from saved locker/qr_code in ES
        const savedData = {};
        userMatches.forEach(match => {
          if (match.locker && match.qr_code) {
            savedData[match.match_id] = {
              locker: match.locker,
              qrCode: match.qr_code,
            };
          }
        });
        setMatchData(savedData);

        if (userMatches.length > 0) setSelectedMatch(userMatches[0]);
      } catch (err) {
        console.error('Init failed:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleMatchSelect = (match) => {
    setSelectedMatch(match);
    setSelectedLocker(null);
    setConfirmError(null);
  };

  const handleConfirmLocker = async () => {
    if (!selectedLocker || !selectedMatch) return;
    setQrLoading(true);
    setConfirmError(null);
    try {
      const res = await fetch(
        `/api/distribution/request/${selectedMatch.item_id}?user_id=${USER_ID}&locker=${selectedLocker}`,
        { method: 'POST' }
      );
      const data = await res.json();

      if (data.status === 'Error') {
        setConfirmError(data.message);
        const lockerRes  = await fetch(`/api/distribution/lockers`);
        const lockerJson = await lockerRes.json();
        setOccupiedLockers(lockerJson.occupied_lockers || []);
        setSelectedLocker(null);
      } else {
        // Save to matchData so it persists across item switches
        setMatchData(prev => ({
          ...prev,
          [selectedMatch.match_id]: { locker: selectedLocker, qrCode: data.qr_code }
        }));
        setOccupiedLockers(prev => [...prev, selectedLocker]);
        setSelectedLocker(null);
      }
    } catch (err) {
      console.error('Failed to confirm locker:', err);
    } finally {
      setQrLoading(false);
    }
  };

  const currentMatchData = selectedMatch ? matchData[selectedMatch.match_id] : null;

  return (
    <div className="min-h-screen bg-white">

      <div className="bg-blue-600 px-6 pt-6 pb-16 rounded-b-[3rem]">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-blue-200 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={18} /> Back
        </button>
        <div className="text-center">
          <Lock className="mx-auto text-white mb-3" size={40} />
          <h1 className="text-2xl font-bold text-white">Private Collection</h1>
          <p className="text-blue-100 text-sm mt-1">Choose your locker and collect privately</p>
        </div>
      </div>

      <div className="px-6 -mt-6 pb-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <RefreshCw className="animate-spin text-blue-500" size={32} />
          </div>

        ) : matches.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10">
              <Package className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="text-slate-500 font-medium mb-2">No matched items yet.</p>
              <p className="text-slate-400 text-sm mb-6">Request gear first to get your private QR code.</p>
              <button onClick={() => navigate('/request')} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
                Browse Available Gear →
              </button>
            </div>
          </div>

        ) : (
          <div className="space-y-6 mt-8">

            {/* Match list */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Your Matched Items</p>
              {matches.map((match) => {
                const md = matchData[match.match_id];
                return (
                  <button key={match.match_id} onClick={() => handleMatchSelect(match)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                      selectedMatch?.match_id === match.match_id
                        ? 'border-blue-500 bg-blue-50' : 'border-slate-100 bg-white hover:border-blue-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-800">{match.item_name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {match.school} · {match.grade}
                          {md && <span className="text-blue-500 ml-2">· Locker #{md.locker}</span>}
                        </p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        md ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {md ? '✅ QR Ready' : 'Choose Locker'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Show QR if locker already confirmed for this match */}
            {selectedMatch && currentMatchData && (
              <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <CheckCircle className="text-emerald-500" size={18} />
                  <p className="text-emerald-600 font-bold text-sm">Locker #{currentMatchData.locker} Reserved!</p>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                  {selectedMatch.item_name}
                </p>
                <div className="flex gap-2 justify-center mb-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    selectedMatch.grade === 'Grade A' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {selectedMatch.grade}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                    {selectedMatch.school}
                  </span>
                </div>
                <div className="bg-slate-50 rounded-2xl p-6 inline-block border-4 border-slate-100 mb-6">
                  <img
                    src={`data:image/png;base64,${currentMatchData.qrCode}`}
                    alt="Pickup QR Code"
                    className="w-48 h-48 rounded-xl"
                  />
                </div>
                <p className="text-slate-400 text-xs max-w-xs mx-auto mb-4">
                  Show this at <strong>Locker #{currentMatchData.locker}</strong>. Only you can see this — your privacy is protected.
                </p>
                <div className="bg-emerald-50 rounded-xl px-4 py-3 inline-block">
                  <span className="text-emerald-700 text-sm font-bold">
                    🌿 {selectedMatch.co2_saved}kg CO2 saved by this match
                  </span>
                </div>
              </div>
            )}

            {/* Show locker selector if no locker yet for this match */}
            {selectedMatch && !currentMatchData && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Choose Your Locker</p>
                <p className="text-slate-400 text-xs mb-4">🔒 = currently occupied by another student</p>

                {confirmError && (
                  <div className="bg-red-50 text-red-600 text-sm font-medium px-4 py-3 rounded-xl mb-4">
                    ⚠️ {confirmError}
                  </div>
                )}

                <div className="grid grid-cols-6 gap-2 mb-6">
                  {LOCKERS.map((locker) => {
                    const isOccupied = occupiedLockers.includes(locker);
                    const isSelected = selectedLocker === locker;
                    return (
                      <button key={locker}
                        onClick={() => !isOccupied && setSelectedLocker(locker)}
                        disabled={isOccupied}
                        className={`py-3 rounded-xl font-bold text-sm transition-all ${
                          isOccupied
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : isSelected
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                            : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                      >
                        {isOccupied ? '🔒' : locker}
                      </button>
                    );
                  })}
                </div>

                {selectedLocker ? (
                  <button onClick={handleConfirmLocker} disabled={qrLoading}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {qrLoading
                      ? <><RefreshCw className="animate-spin" size={18} /> Generating QR...</>
                      : <>Confirm Locker #{selectedLocker} →</>
                    }
                  </button>
                ) : (
                  <p className="text-slate-400 text-xs text-center">Select an available locker to continue</p>
                )}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
