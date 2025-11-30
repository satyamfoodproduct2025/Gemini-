import React from 'react';
import { useApp, LIBRARY_QR_CODE } from '../AppContext';

const StudentDashboard: React.FC = () => {
  const { navigate, currentUserMobile, students, wowRecords, location, setCurrentUserMobile } = useApp();
  
  const student = students.find(s => s.mobileNumber === currentUserMobile);
  const wow = wowRecords.find(w => w.mobile === currentUserMobile);

  const seatText = (wow && wow.seatNo && wow.shifts > 0) ? `Seat: ${wow.seatNo} | Shift: ${wow.batchString}` : "Seat: N/A | Shift: N/A";

  const handleAttendance = () => {
    alert("ATTENDANCE PROCESS:\n1. Location check starts (20m limit).\n2. QR scan requested.");
    const coordsStr = prompt("SIMULATION: Enter your current GPS coordinates (lat,lng, e.g., 25.6127, 85.1589):", "25.6127, 85.1589");
    
    if (!coordsStr) { alert("Attendance cancelled."); return; }
    
    const [userLat, userLng] = coordsStr.split(',').map(c => parseFloat(c.trim()));
    if (isNaN(userLat) || isNaN(userLng)) { alert("Error: Invalid coordinates format."); return; }
    
    if (!location.set) { alert("Owner has not set the library location yet. Attendance failed."); return; }

    // Haversine
    const R = 6371000;
    const dLat = (userLat - location.lat) * Math.PI / 180;
    const dLon = (userLng - location.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(location.lat * Math.PI / 180) * Math.cos(userLat * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const dist = R * c;

    if (dist > location.range) {
        alert(`Error: You are ${dist.toFixed(2)}m away. You must be within ${location.range}m of the library to mark attendance.`);
        return;
    }

    const qr = prompt(`GPS OK! (${dist.toFixed(2)}m away). Now scan the QR code (Type the code: ${LIBRARY_QR_CODE}):`);
    if (qr === LIBRARY_QR_CODE) {
        alert(`ATTENDANCE SUCCESSFUL!\nStudent: ${currentUserMobile}\nTime: ${new Date().toLocaleTimeString()}\nLocation verified.`);
    } else {
        alert("Error: Invalid QR Code. Attendance failed.");
    }
  };

  const handleLogout = () => {
    setCurrentUserMobile(null);
    navigate('login');
  };

  return (
    <div className="animate-subtle-tilt relative z-10 p-4 md:p-10 bg-[#111217] md:bg-[#111217]/90 min-h-screen md:min-h-0 w-full md:w-[98%] md:max-w-[800px] border-0 md:border-2 md:border-[#00bcd4] md:shadow-[0_0_40px_rgba(0,0,0,0.5)] md:rounded-[20px] text-white mx-auto md:mt-4 md:mb-4">
      <div className="mb-[20px] md:mb-[30px] p-[15px] md:p-[20px] text-center rounded-[15px] border border-white/10 border-l-4 border-l-[#ff2a6d] shadow-[0_10px_30px_rgba(0,0,0,0.3)] backdrop-blur-md relative overflow-hidden bg-gradient-to-br from-white/5 to-white/2">
         <div className="text-[#aaa] text-[0.7rem] md:text-[0.9rem] tracking-[1px] uppercase mb-[5px]">Welcome Back</div>
         <div className="text-[1.3rem] md:text-[2rem] font-[900] bg-clip-text text-transparent bg-gradient-to-r from-white to-[#e0e0e0] mb-[10px] md:mb-[15px] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] truncate">{student?.fullName || 'Student'}</div>
         <div className="inline-flex items-center gap-[8px] bg-[rgba(0,188,212,0.15)] text-[#00bcd4] p-[6px_12px] md:p-[8px_16px] rounded-[50px] text-[0.75rem] md:text-[0.9rem] font-bold border border-[rgba(0,188,212,0.3)] shadow-[0_0_15px_rgba(0,188,212,0.1)]">
             <i className="fas fa-chair"></i>
             <span className="truncate max-w-[200px]">{seatText}</span>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-5">
        <button onClick={handleAttendance} className="flex flex-col items-center justify-center p-[15px_10px] md:p-[30px_15px] border-none rounded-[15px] text-[0.85rem] md:text-[1.1rem] font-bold cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#17a2b8] to-[#00bcd4] text-white hover:-translate-y-[5px] hover:scale-105 hover:shadow-[0_10px_30px_#ff2a6d] active:scale-95">
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