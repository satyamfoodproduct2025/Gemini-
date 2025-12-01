import React, { useState, useEffect, useRef } from 'react';
import { useApp, LIBRARY_QR_CODE } from '../AppContext';

// Declare global for the html5-qrcode library loaded via CDN
declare const Html5Qrcode: any;

const StudentDashboard: React.FC = () => {
  const { navigate, currentUserMobile, students, wowRecords, location, setCurrentUserMobile, markStudentAttendance } = useApp();
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<any>(null);
  
  const student = students.find(s => s.mobileNumber === currentUserMobile);
  const wow = wowRecords.find(w => w.mobile === currentUserMobile);

  const seatText = (wow && wow.seatNo && wow.shifts > 0) ? `Seat: ${wow.seatNo} | Shift: ${wow.batchString}` : "Seat: N/A | Shift: N/A";

  // Handle Scanner Cleanup
  useEffect(() => {
    return () => {
        if (scannerRef.current) {
            scannerRef.current.stop().catch((err: any) => console.error(err));
        }
    };
  }, []);

  const startScanner = () => {
    if (scanning) return;
    setScanning(true);

    // Short timeout to ensure DOM element exists
    setTimeout(() => {
        const html5QrCode = new Html5Qrcode("reader");
        scannerRef.current = html5QrCode;
        
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };
        
        html5QrCode.start(
            { facingMode: "environment" }, 
            config,
            (decodedText: string) => {
                // Success
                if (decodedText === LIBRARY_QR_CODE) {
                    html5QrCode.stop().then(() => {
                        scannerRef.current = null;
                        setScanning(false);
                        if (currentUserMobile) {
                            markStudentAttendance(currentUserMobile);
                        }
                    });
                } else {
                    alert("Invalid QR Code scanned. Please scan the correct Library QR Code.");
                    // Don't stop scanning, let them try again
                }
            },
            (errorMessage: string) => {
                // Error - usually parsing error, ignore
            }
        ).catch((err: any) => {
            alert(`Error starting camera: ${err}. Please ensure permissions are granted.`);
            setScanning(false);
        });
    }, 100);
  };

  const handleAttendanceClick = () => {
    if (scanning) return;

    // 1. GPS Check
    if (!location.set) {
        alert("Owner has not set the library location yet. Attendance failed.");
        return;
    }

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    alert("Verifying Location...");

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            // Haversine formula
            const R = 6371000;
            const dLat = (userLat - location.lat) * Math.PI / 180;
            const dLon = (userLng - location.lng) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(location.lat * Math.PI / 180) * Math.cos(userLat * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const dist = R * c;

            if (dist > location.range) {
                alert(`Error: You are ${dist.toFixed(1)}m away. You must be within ${location.range}m of the library.`);
                return;
            }

            // 2. Start Camera Scan
            startScanner();
        },
        (error) => {
            alert(`Location Error: ${error.message}. Ensure GPS is on.`);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const cancelScanning = () => {
      if (scannerRef.current) {
          scannerRef.current.stop().then(() => {
              scannerRef.current = null;
              setScanning(false);
          }).catch((err: any) => console.error(err));
      } else {
          setScanning(false);
      }
  };

  const handleLogout = () => {
    setCurrentUserMobile(null);
    navigate('login');
  };

  return (
    <div className="animate-subtle-tilt relative z-10 p-4 md:p-10 bg-[#111217] md:bg-[#111217]/90 min-h-screen md:min-h-0 w-full md:w-[98%] md:max-w-[800px] border-0 md:border-2 md:border-[#00bcd4] md:shadow-[0_0_40px_rgba(0,0,0,0.5)] md:rounded-[20px] text-white mx-auto md:mt-4 md:mb-4">
      
      {/* Scanner Overlay */}
      {scanning && (
          <div className="fixed inset-0 z-50 bg-black flex flex-col justify-center items-center">
              <div className="text-white font-bold mb-4 text-lg">Scan Library QR Code</div>
              <div id="reader" className="w-full max-w-[400px]"></div>
              <button onClick={cancelScanning} className="mt-8 p-3 bg-red-600 rounded text-white font-bold px-8">
                  Cancel Scan
              </button>
          </div>
      )}

      <div className="mb-[20px] md:mb-[30px] p-[15px] md:p-[20px] text-center rounded-[15px] border border-white/10 border-l-4 border-l-[#ff2a6d] shadow-[0_10px_30px_rgba(0,0,0,0.3)] backdrop-blur-md relative overflow-hidden bg-gradient-to-br from-white/5 to-white/2">
         <div className="text-[#aaa] text-[0.7rem] md:text-[0.9rem] tracking-[1px] uppercase mb-[5px]">Welcome Back</div>
         <div className="text-[1.3rem] md:text-[2rem] font-[900] bg-clip-text text-transparent bg-gradient-to-r from-white to-[#e0e0e0] mb-[10px] md:mb-[15px] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] truncate">{student?.fullName || 'Student'}</div>
         <div className="inline-flex items-center gap-[8px] bg-[rgba(0,188,212,0.15)] text-[#00bcd4] p-[6px_12px] md:p-[8px_16px] rounded-[50px] text-[0.75rem] md:text-[0.9rem] font-bold border border-[rgba(0,188,212,0.3)] shadow-[0_0_15px_rgba(0,188,212,0.1)]">
             <i className="fas fa-chair"></i>
             <span className="truncate max-w-[200px]">{seatText}</span>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-5">
        <button onClick={handleAttendanceClick} className="flex flex-col items-center justify-center p-[15px_10px] md:p-[30px_15px] border-none rounded-[15px] text-[0.85rem] md:text-[1.1rem] font-bold cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#17a2b8] to-[#00bcd4] text-white hover:-translate-y-[5px] hover:scale-105 hover:shadow-[0_10px_30px_#ff2a6d] active:scale-95">
          <i className="fas fa-camera mb-[8px] md:mb-[10px] text-[1.5rem] md:text-[1.8rem]"></i>
          Mark Attendance
        </button>
        <button onClick={() => navigate('studentPayment')} className="flex flex-col items-center justify-center p-[15px_10px] md:p-[30px_15px] border-none rounded-[15px] text-[0.85rem] md:text-[1.1rem] font-bold cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#4caf50] to-[#28a745] text-white hover:-translate-y-[5px] hover:scale-105 hover:shadow-[0_10px_30px_#ff2a6d] active:scale-95">
          <i className="fas fa-wallet mb-[8px] md:mb-[10px] text-[1.5rem] md:text-[1.8rem]"></i>
          Online Payment
        </button>
        <button onClick={() => navigate('studentHistory')} className="flex flex-col items-center justify-center p-[15px_10px] md:p-[30px_15px] border-none rounded-[15px] text-[0.85rem] md:text-[1.1rem] font-bold cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#ff9800] to-[#ffc107] text-white hover:-translate-y-[5px] hover:scale-105 hover:shadow-[0_10px_30px_#ff2a6d] col-span-2 active:scale-95">
          <i className="fas fa-history mb-[8px] md:mb-[10px] text-[1.5rem] md:text-[1.8rem]"></i>
          Attendance History
        </button>
      </div>

      <button onClick={handleLogout} className="w-full p-3 mt-[25px] font-bold cursor-pointer rounded-[10px] transition-all duration-300 bg-transparent border-2 border-[#ff2a6d] text-[#ff2a6d] hover:bg-[#ff2a6d] hover:text-[#0b0c10] text-sm md:text-base">
        LOGOUT
      </button>
    </div>
  );
};

export default StudentDashboard;