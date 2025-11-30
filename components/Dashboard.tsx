import React from 'react';
import { useApp } from '../AppContext';

const Dashboard: React.FC = () => {
  const { navigate, setCurrentUserMobile } = useApp();

  const handleLogout = () => {
    setCurrentUserMobile(null);
    navigate('login');
  };

  return (
    <div className="animate-subtle-tilt relative z-10 p-4 md:p-10 bg-[#111217] md:bg-[#111217]/90 min-h-screen md:min-h-0 w-full md:w-[98%] md:max-w-[800px] border-0 md:border-2 md:border-[#00bcd4] md:shadow-[0_0_40px_rgba(0,0,0,0.5)] md:rounded-[20px] text-white mx-auto md:mt-4 md:mb-4">
      <div className="text-center mb-6 md:mb-10 pt-4 md:pt-0">
        <h2 className="m-0 text-[1.8rem] md:text-[2.5rem] text-[#dc3545] font-[900] tracking-[3px] md:tracking-[5px]">Welcome</h2>
        <p className="text-[#bbb] mt-1 text-xs md:text-base">Library Work Automate Dashboard</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        <button onClick={() => navigate('studentView')} className="flex flex-col items-center justify-center p-[15px_10px] md:p-[30px_15px] border-none rounded-[15px] text-[0.85rem] md:text-[1.1rem] font-bold cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#007bff] to-[#00bcd4] text-white hover:-translate-y-[5px] hover:scale-105 hover:shadow-[0_10px_30px_#ff2a6d] active:scale-95">
          <i className="fas fa-users mb-[8px] md:mb-[10px] text-[1.5rem] md:text-[1.8rem]"></i>
          Students Data
        </button>
        <button onClick={() => navigate('wowView')} className="flex flex-col items-center justify-center p-[15px_10px] md:p-[30px_15px] border-none rounded-[15px] text-[0.85rem] md:text-[1.1rem] font-bold cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#663399] to-[#ff2a6d] text-white hover:-translate-y-[5px] hover:scale-105 hover:shadow-[0_10px_30px_#ff2a6d] active:scale-95">
          <i className="fas fa-magic mb-[8px] md:mb-[10px] text-[1.5rem] md:text-[1.8rem]"></i>
          WOW
        </button>
        <button onClick={() => navigate('seatGraph')} className="flex flex-col items-center justify-center p-[15px_10px] md:p-[30px_15px] border-none rounded-[15px] text-[0.85rem] md:text-[1.1rem] font-bold cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#ff9800] to-[#ffc107] text-white hover:-translate-y-[5px] hover:scale-105 hover:shadow-[0_10px_30px_#ff2a6d] active:scale-95">
          <i className="fas fa-chart-bar mb-[8px] md:mb-[10px] text-[1.5rem] md:text-[1.8rem]"></i>
          Graph
        </button>
        <button onClick={() => navigate('payDetails')} className="flex flex-col items-center justify-center p-[15px_10px] md:p-[30px_15px] border-none rounded-[15px] text-[0.85rem] md:text-[1.1rem] font-bold cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#dc3545] to-[#ff2a6d] text-white hover:-translate-y-[5px] hover:scale-105 hover:shadow-[0_10px_30px_#ff2a6d] active:scale-95">
          <i className="fas fa-wallet mb-[8px] md:mb-[10px] text-[1.5rem] md:text-[1.8rem]"></i>
          Pay Details
        </button>
        <button onClick={() => navigate('settings')} className="flex flex-col items-center justify-center p-[15px_10px] md:p-[30px_15px] border-none rounded-[15px] text-[0.85rem] md:text-[1.1rem] font-bold cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#009688] to-[#00bcd4] text-white hover:-translate-y-[5px] hover:scale-105 hover:shadow-[0_10px_30px_#ff2a6d] active:scale-95">
          <i className="fas fa-map-marked-alt mb-[8px] md:mb-[10px] text-[1.5rem] md:text-[1.8rem]"></i>
          QR & LOCATION
        </button>
        <button onClick={() => navigate('attendanceView')} className="flex flex-col items-center justify-center p-[15px_10px] md:p-[30px_15px] border-none rounded-[15px] text-[0.85rem] md:text-[1.1rem] font-bold cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#663399] to-[#3366ff] text-white hover:-translate-y-[5px] hover:scale-105 hover:shadow-[0_10px_30px_#ff2a6d] active:scale-95">
          <i className="fas fa-calendar-check mb-[8px] md:mb-[10px] text-[1.5rem] md:text-[1.8rem]"></i>
          Attendance Log
        </button>
        <button onClick={() => navigate('payAction')} className="flex flex-col items-center justify-center p-[15px_10px] md:p-[30px_15px] border-none rounded-[15px] text-[0.85rem] md:text-[1.1rem] font-bold cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#4caf50] to-[#28a745] text-white hover:-translate-y-[5px] hover:scale-105 hover:shadow-[0_10px_30px_#ff2a6d] active:scale-95">
          <i className="fas fa-wallet mb-[8px] md:mb-[10px] text-[1.5rem] md:text-[1.8rem]"></i>
          Make Payment
        </button>
      </div>

      <button onClick={handleLogout} className="w-full p-3 mt-[25px] font-bold cursor-pointer rounded-[10px] transition-all duration-300 bg-transparent border-2 border-[#ff2a6d] text-[#ff2a6d] hover:bg-[#ff2a6d] hover:text-[#0b0c10] text-sm md:text-base">
        LOGOUT
      </button>
    </div>
  );
};

export default Dashboard;