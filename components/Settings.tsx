import React, { useState, useEffect } from 'react';
import { useApp, LIBRARY_QR_CODE } from '../AppContext';

const Settings: React.FC = () => {
  const { location, setLocation, navigate } = useApp();
  
  // Local state for form inputs
  const [lat, setLat] = useState<string>(location.lat.toString());
  const [lng, setLng] = useState<string>(location.lng.toString());
  const [range, setRange] = useState<string>(location.range.toString());
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(location.set); // Show QR if location is already set
  const [accuracy, setAccuracy] = useState<string | null>(null);
  const [fetchStatus, setFetchStatus] = useState<string>("");

  // Sync local state if global location changes
  useEffect(() => {
    setLat(location.lat.toString());
    setLng(location.lng.toString());
    setRange(location.range.toString());
    if (location.set) setShowQR(true);
  }, [location]);

  const handleGetCurrentLocation = () => {
    setLoading(true);
    setFetchStatus("Getting GPS fix...");
    setAccuracy(null);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude.toString());
        setLng(position.coords.longitude.toString());
        const acc = position.coords.accuracy.toFixed(1);
        setAccuracy(acc);
        setFetchStatus(`Updated! Accuracy: +/- ${acc}m`);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        setFetchStatus("Error fetching location.");
        alert(`Error retrieving location: ${error.message}. Ensure GPS is on.`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSaveSettings = () => {
    const newLat = parseFloat(lat);
    const newLng = parseFloat(lng);
    const newRange = parseFloat(range);

    if (isNaN(newLat) || isNaN(newLng) || isNaN(newRange)) {
      alert("Please enter valid numeric values.");
      return;
    }

    setLocation({
      lat: newLat,
      lng: newLng,
      range: newRange,
      set: true
    });
    alert(`Settings Saved Successfully!\nLat: ${newLat}\nLng: ${newLng}\nRange: ${newRange}m`);
    setShowQR(true); // Auto show QR option after saving
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(LIBRARY_QR_CODE)}`;

  return (
    <div className="main-panel bg-[#111217] md:bg-[#111217]/90 min-h-screen md:min-h-0 w-full md:w-[98%] md:max-w-[800px] p-4 md:p-[40px_30px] border-0 md:border-2 md:border-[#00bcd4] md:shadow-[0_0_40px_rgba(0,0,0,0.5)] md:rounded-[20px] text-white mx-auto md:mt-10 md:mb-10">
      <div className="text-center mb-6 md:mb-10 pt-4 md:pt-0">
        <h2 className="m-0 text-[1.8rem] md:text-[2rem] text-[#dc3545] font-[900] tracking-[3px] md:tracking-[5px]">QR/GPS Settings</h2>
        <p className="text-[#bbb] mt-2 text-sm md:text-base">Setup Library Location & Range</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: Location Inputs */}
        <div className="flex flex-col gap-4">
          <button 
            onClick={handleGetCurrentLocation} 
            disabled={loading}
            className="p-[15px] border-none rounded-[10px] bg-gradient-to-r from-[#009688] to-[#4caf50] text-white font-bold cursor-pointer transition-all duration-300 shadow-lg hover:scale-105 flex justify-center items-center gap-2"
          >
            {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-crosshairs"></i>}
            {loading ? "Fetching..." : "Use Current Device Location"}
          </button>
          
          {/* Status Display */}
          {fetchStatus && (
            <div className={`text-center text-sm font-bold ${accuracy && parseFloat(accuracy) < 20 ? 'text-[#4caf50]' : 'text-[#ffc107]'}`}>
              {fetchStatus}
            </div>
          )}

          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <label className="block text-sm text-[#00bcd4] font-bold mb-1">Latitude</label>
            <input 
              type="number" 
              step="any"
              value={lat} 
              onChange={(e) => setLat(e.target.value)}
              className="w-full p-3 bg-black/20 border border-white/20 rounded text-white focus:border-[#00bcd4] outline-none"
              placeholder="Ex: 25.6127"
            />
          </div>

          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <label className="block text-sm text-[#00bcd4] font-bold mb-1">Longitude</label>
            <input 
              type="number" 
              step="any"
              value={lng} 
              onChange={(e) => setLng(e.target.value)}
              className="w-full p-3 bg-black/20 border border-white/20 rounded text-white focus:border-[#00bcd4] outline-none"
              placeholder="Ex: 85.1589"
            />
          </div>

          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <label className="block text-sm text-[#ff2a6d] font-bold mb-1">Allowed Range (Meters)</label>
            <input 
              type="number" 
              value={range} 
              onChange={(e) => setRange(e.target.value)}
              className="w-full p-3 bg-black/20 border border-white/20 rounded text-white focus:border-[#ff2a6d] outline-none"
              placeholder="Ex: 20"
            />
          </div>

          <button 
            onClick={handleSaveSettings} 
            className="p-[15px] border-none rounded-[10px] bg-gradient-to-r from-[#663399] to-[#00bcd4] text-white font-bold cursor-pointer transition-all duration-300 shadow-lg hover:scale-105 mt-2 flex justify-center items-center gap-2"
          >
            <i className="fas fa-save"></i> Save Settings
          </button>
        </div>

        {/* Right Side: QR Display */}
        <div className="flex flex-col items-center justify-center bg-white/5 p-5 rounded-lg border border-white/10">
            <h3 className="text-[#ffc107] mb-4 font-bold uppercase tracking-wider">Static Library QR Code</h3>
            {showQR ? (
                <div className="bg-white p-4 rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    <img src={qrImageUrl} alt="Library QR Code" className="max-w-full h-auto w-[200px]" />
                    <p className="text-black text-center mt-2 font-bold text-xs">{LIBRARY_QR_CODE}</p>
                </div>
            ) : (
                <div className="text-center text-gray-400 p-10 border-2 border-dashed border-gray-600 rounded-lg">
                    <i className="fas fa-qrcode text-4xl mb-2"></i>
                    <p>Set Location to View QR Code</p>
                </div>
            )}
            {showQR && (
                <button onClick={() => window.print()} className="mt-4 p-[10px_20px] bg-[#1976D2] text-white rounded-lg font-bold hover:bg-[#1565C0] transition-colors gap-2 flex items-center">
                    <i className="fas fa-print"></i> Print QR
                </button>
            )}
        </div>
      </div>
      
      <div className="flex justify-start items-center mt-6 no-print">
        <button onClick={() => navigate('dashboard')} className="p-[10px_20px] font-bold cursor-pointer rounded-[10px] transition-all duration-300 text-sm md:text-base bg-transparent border-2 border-[#00bcd4] text-[#00bcd4] hover:bg-[#00bcd4] hover:text-[#0b0c10] flex-grow-0 text-center min-w-[100px]">
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Settings;