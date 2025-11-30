import React, { useEffect } from 'react';
import { AppProvider, useApp } from './AppContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StudentView from './components/StudentView';
import WowView from './components/WowView';
import SeatGraph from './components/SeatGraph';
import PayDetails from './components/PayDetails';
import AttendanceView from './components/AttendanceView';
import Settings from './components/Settings';
import GlobalStyles from './GlobalStyles';
import StudentDashboard from './components/StudentDashboard';
import StudentPayment from './components/StudentPayment';
import { ViewState } from './types';

const Main: React.FC = () => {
  const { view, setView, navigate } = useApp();

  // History / Back Button Handler
  useEffect(() => {
    // Set initial state
    if (!window.history.state) {
        window.history.replaceState({ view: view }, '');
    }

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        setView(event.state.view);
      } else {
        // Fallback if no state exists
        // setView('login');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setView, view]);

  // Simple Payment Action Panel (inline) - Styles Updated for Full Screen Mobile
  const PaymentAction = () => (
    <div className="main-panel print:block print:w-full print:p-0 print:m-0 bg-[#111217] md:bg-[#111217]/90 min-h-screen md:min-h-0 w-full md:w-[98%] md:max-w-[800px] p-4 md:p-[40px_30px] border-0 md:border-2 md:border-[#00bcd4] md:shadow-[0_0_40px_rgba(0,0,0,0.5)] md:rounded-[20px] text-white mx-auto md:mt-10 md:mb-10">
      <div className="text-center mb-5">
        <h2 className="m-0 text-[1.5rem] md:text-[2rem] text-[#dc3545] font-[900] tracking-[3px] md:tracking-[5px]">Payment Actions</h2>
        <p className="text-[#bbb] mt-2 text-sm md:text-base">Select the desired action</p>
      </div>
      <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-[30px] mt-6 md:mt-10">
        <button onClick={() => navigate('pDetails')} className="flex-1 w-full sm:max-w-[250px] flex flex-col items-center justify-center p-[20px_10px] md:p-[30px_15px] border-none rounded-[15px] text-[1rem] md:text-[1.1rem] font-bold cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#ff9800] to-[#ffc107] text-white hover:-translate-y-[5px] hover:scale-105 hover:shadow-[0_10px_30px_#ff2a6d]">
            <i className="fas fa-file-invoice mb-[10px] text-[1.5rem]"></i> P Details
        </button>
        <button onClick={() => alert("P Print functionality selected.")} className="flex-1 w-full sm:max-w-[250px] flex flex-col items-center justify-center p-[20px_10px] md:p-[30px_15px] border-none rounded-[15px] text-[1rem] md:text-[1.1rem] font-bold cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#ff9800] to-[#ffc107] text-white hover:-translate-y-[5px] hover:scale-105 hover:shadow-[0_10px_30px_#ff2a6d]">
            <i className="fas fa-print mb-[10px] text-[1.5rem]"></i> P Print
        </button>
      </div>
      <div className="flex justify-start items-center mt-5 no-print">
        <button onClick={() => navigate('dashboard')} className="p-[10px_20px] font-bold cursor-pointer rounded-[10px] transition-all duration-300 text-sm md:text-base bg-transparent border-2 border-[#00bcd4] text-[#00bcd4] hover:bg-[#00bcd4] hover:text-[#0b0c10] flex-grow-0 text-center min-w-[100px]">
          <i className="fas fa-arrow-left"></i> Back
        </button>
      </div>
    </div>
  );

  const renderView = () => {
    switch (view) {
      case 'login': return <Login />;
      case 'dashboard': return <Dashboard />;
      case 'studentDashboard': return <StudentDashboard />;
      case 'studentView': return <StudentView />;
      case 'wowView': return <WowView />;
      case 'seatGraph': return <SeatGraph />;
      case 'payDetails': return <PayDetails mode="summary" />;
      case 'pDetails': return <PayDetails mode="fullYear" />;
      case 'payAction': return <PaymentAction />;
      case 'attendanceView': return <AttendanceView />;
      case 'settings': return <Settings />;
      case 'studentPayment': return <StudentPayment />;
      case 'studentHistory': return <AttendanceView studentMode={true} />;
      default: return <Login />;
    }
  };

  return (
    <>
      <GlobalStyles />
      {/* 
         UPDATED Container:
         - 'block' display on mobile allows full height/flow.
         - 'md:flex' on desktop centers the cards.
         - 'overflow-x-hidden' allows vertical scroll.
      */}
      <div id="app-container" className={`min-h-screen w-full block md:flex md:justify-center md:items-center relative overflow-x-hidden overflow-y-auto print:overflow-visible print:block print:h-auto print:static font-montserrat ${view === 'login' ? 'bg-[#0b0c10]' : ''}`}>
        {/* Animated Background */}
        <div className="fixed top-0 left-0 w-[300%] h-[300%] opacity-15 animate-gradient-move pointer-events-none bg-[linear-gradient(45deg,#663399_0%,#3366ff_25%,#00bcd4_50%,#ff2a6d_75%,#663399_100%)] no-print -z-10"></div>
        
        {renderView()}
      </div>
    </>
  );
};

const App: React.FC = () => (
  <AppProvider>
    <Main />
  </AppProvider>
);

export default App;