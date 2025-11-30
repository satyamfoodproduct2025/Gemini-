import React, { useState, useRef } from 'react';
import { useApp } from '../AppContext';

interface AttendanceViewProps {
  studentMode?: boolean;
}

const AttendanceView: React.FC<AttendanceViewProps> = ({ studentMode = false }) => {
  const { students, attendance, wowRecords, navigate, currentUserMobile } = useApp();
  const [showDetailed, setShowDetailed] = useState(studentMode);
  const [selectedMobile, setSelectedMobile] = useState<string | null>(studentMode ? currentUserMobile : null);

  // Triple Click Logic Ref
  const interactionRef = useRef<{ id: string, count: number, timer: ReturnType<typeof setTimeout> | null }>({ id: '', count: 0, timer: null });

  const handleTripleClick = (id: string, action: () => void) => {
    if (interactionRef.current.id !== id) {
      interactionRef.current.id = id;
      interactionRef.current.count = 1;
    } else {
      interactionRef.current.count++;
    }

    if (interactionRef.current.timer) clearTimeout(interactionRef.current.timer);

    if (interactionRef.current.count === 3) {
      action();
      interactionRef.current = { id: '', count: 0, timer: null };
    } else {
      interactionRef.current.timer = setTimeout(() => {
        interactionRef.current = { id: '', count: 0, timer: null };
      }, 400); 
    }
  };

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();

  const calculateCounts = (mobile: string) => {
    const days = getDaysInMonth(currentYear, currentMonth);
    let present = 0, absent = 0;
    for (let d = 1; d <= days; d++) {
        const date = new Date(currentYear, currentMonth, d);
        if (date > today) continue;
        const ds = date.toISOString().split('T')[0];
        const rec = attendance.find(r => r.mobile === mobile && r.date === ds);
        if (rec && rec.times.length > 0) present++; else absent++;
    }
    return { present, absent };
  };

  const handleRowClick = (mobile: string) => {
    setSelectedMobile(mobile);
    setShowDetailed(true);
  };

  const renderLog = () => {
    const dates = [];
    for (let i = 0; i < 6; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        dates.push(d);
    }

    return (
        <div className="overflow-x-auto w-full max-h-[60vh] print:max-h-none print:overflow-visible border border-white/10 rounded-lg">
            <table className="w-full border-collapse min-w-[900px] print:min-w-full print:table-fixed text-sm md:text-base">
                <thead className="sticky top-0 z-10 print:static">
                    <tr>
                        <th colSpan={2} className="text-center bg-white text-black font-bold p-2 border-b-4 border-[#dc3545] print:border print:border-black sticky left-0 z-20">{monthNames[currentMonth]} Log</th>
                        <th colSpan={6} className="text-center bg-white text-black font-bold p-2 border-b-4 border-[#dc3545] print:border print:border-black">Last 6 Days</th>
                    </tr>
                    <tr>
                        <th className="p-2 border-b border-[#f44336] bg-white text-black w-[50px] print:border print:border-black print:bg-[#e0e0e0] sticky left-0 z-20">Abs</th>
                        <th className="p-2 border-b border-[#663399] bg-white text-black w-[150px] print:border print:border-black print:bg-[#e0e0e0] sticky left-[50px] z-20 shadow-md">Full Name</th>
                        {dates.map(d => (
                            <th key={d.toString()} className="p-2 border-b border-[#ccc] bg-white text-black text-[0.9em] print:border print:border-black print:bg-[#e0e0e0] min-w-[100px]">{d.getDate()} ({d.toDateString().slice(0,3)})</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {students.map((s, idx) => {
                        const { absent } = calculateCounts(s.mobileNumber);
                        const wow = wowRecords.find(w => w.mobile === s.mobileNumber);
                        const seatInfo = (wow && wow.seatNo && wow.shifts > 0) ? <span className="text-[0.7em] md:text-[0.8em] text-[#555] block">Seat: <b className="text-blue-600">{wow.seatNo}</b> - S:<b className="text-red-600">{wow.shifts}</b></span> : null;

                        return (
                            <tr 
                                key={idx} 
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleTripleClick(s.mobileNumber, () => handleRowClick(s.mobileNumber));
                                }}
                                className="odd:bg-[#f0f0f0] bg-white text-black print:bg-white cursor-pointer hover:bg-gray-200 transition-colors"
                            >
                                <td className="p-2 border border-white/10 print:border-black text-center text-[#dc3545] font-black text-[1.2rem] sticky left-0 bg-white/95 z-10">{absent}</td>
                                <td className="p-2 border border-white/10 print:border-black sticky left-[50px] bg-white/95 z-10 shadow-md">
                                    <div className="font-bold text-sm">{s.fullName}</div>
                                    {seatInfo}
                                </td>
                                {dates.map(d => {
                                    const ds = d.toISOString().split('T')[0];
                                    const rec = attendance.find(r => r.mobile === s.mobileNumber && r.date === ds);
                                    if (rec && rec.times.length > 0) {
                                        return <td key={ds} className="p-2 border border-white/10 print:border-black bg-[#d4edda] text-[#155724] font-bold text-center text-xs md:text-sm whitespace-nowrap">{rec.times.map(t => `${t.in}-${t.out}`).join(' / ')}</td>;
                                    }
                                    if (d.toDateString() === today.toDateString()) return <td key={ds} className="p-2 border border-white/10 print:border-black text-center text-[#fd7e14] font-bold text-xs md:text-sm">Pending</td>;
                                    return <td key={ds} className="p-2 border border-white/10 print:border-black text-[#dc3545] font-black text-center text-[1.2rem]">A</td>;
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
  };

  const renderDetailed = () => {
    if (!selectedMobile) return null;
    const student = students.find(s => s.mobileNumber === selectedMobile);
    if (!student) return null;

    const { present, absent } = calculateCounts(selectedMobile);
    const wow = wowRecords.find(w => w.mobile === selectedMobile);
    const seatText = (wow && wow.seatNo && wow.shifts > 0) ? `(Seat: ${wow.seatNo} - Shift(s): ${wow.shifts})` : '';

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const days = [];
    
    // Padding
    for(let i=0; i<firstDay; i++) days.push(<div key={`pad-${i}`} className="aspect-[1/1.3] border border-[#ddd] bg-[#e0e0e0] rounded-[5px] flex flex-col p-[2px] text-center text-[0.8rem]"></div>);

    // Days
    for(let i=1; i<=daysInMonth; i++) {
        const d = new Date(currentYear, currentMonth, i);
        const ds = d.toISOString().split('T')[0];
        const rec = attendance.find(r => r.mobile === selectedMobile && r.date === ds);
        let statusClass = "bg-[#d4edda] text-[#155724]"; // Present
        let content = rec?.times.map(t => `${t.in}-${t.out}`).join('/');
        
        if (d > today) {
            statusClass = "bg-[#e0e0e0] text-[#666]";
            content = "---";
        } else if (!rec || rec.times.length === 0) {
            statusClass = "bg-[#f8d7da] text-[#721c24]";
            content = "ABSENT";
        }

        days.push(
            <div key={i} className={`aspect-[1/1.3] border border-[#ddd] rounded-[5px] flex flex-col p-[2px] md:p-[3px] text-center text-[0.7rem] md:text-[0.8rem] shadow-sm transition-transform overflow-hidden ${statusClass}`}>
                <div className="font-[900] text-black pb-[1px] md:pb-[2px] text-[1em] md:text-[1.2em]">{i}</div>
                <div className="text-[0.6rem] md:text-[0.7rem] leading-[1.1] overflow-hidden text-black break-words">{content}</div>
            </div>
        );
    }

    return (
        <div className="max-w-[900px] mx-auto bg-[#111217] md:bg-[#111217]/95 p-0">
            <div className="text-center p-[15px] mb-5 bg-[#1e1e2d] border-2 border-[#ff2a6d] rounded-[10px]">
                <div className="text-[1.3rem] md:text-[1.5rem] font-[900] text-[#00bcd4] mb-[10px]">{student.fullName} <span className="text-[0.7em] block md:inline">{seatText}</span></div>
                <div className="flex justify-around items-center py-[10px] border-t border-white/20 max-[500px]:flex-col max-[500px]:gap-[10px]">
                    <div className="text-[1.1rem] font-bold text-[#ff2a6d]">Absent Days: {absent}</div>
                    <div className="text-[1.1rem] font-bold text-[#663399]">Present Days: {present}</div>
                </div>
            </div>

            <div className="overflow-y-auto max-h-[70vh]">
                <h4 className="text-[#00bcd4] text-center mb-[10px] font-bold text-lg">{monthNames[currentMonth]} {currentYear} Attendance</h4>
                {/* 
                   Mobile Optimized Grid: 
                   - On very small screens (default), minimal gap
                   - Grid cols 7 is fixed for calendar
                */}
                <div className="grid grid-cols-7 gap-[2px] md:gap-[5px] p-[5px] md:p-[10px] border border-white/10 rounded-lg bg-white">
                    {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} className="text-center font-bold text-[#00bcd4] p-[2px] md:p-[5px] text-[0.7rem] md:text-[0.9rem] uppercase">{d}</div>)}
                    {days}
                </div>
            </div>
        </div>
    );
  };

  return (
    <div id="attendancePanel" className="main-panel print:block print:w-full print:p-0 print:m-0 bg-[#111217] md:bg-[#111217]/90 min-h-screen md:min-h-0 w-full md:w-[95%] md:max-w-[1000px] p-4 md:p-[40px_30px] border-0 md:border-2 md:border-[#00bcd4] md:shadow-[0_0_40px_rgba(0,0,0,0.5)] md:rounded-[20px] text-white mx-auto md:mt-4 md:mb-4">
      <h3 className="mt-0 text-[#17a2b8] text-lg font-bold mb-4 print:text-black">{!showDetailed ? 'Student Attendance Details' : 'Detailed Attendance'}</h3>
      
      {!showDetailed ? renderLog() : renderDetailed()}

      <div className="flex justify-between items-center mt-5 no-print flex-wrap gap-2">
        <button 
            onClick={() => {
                if(showDetailed && !studentMode) setShowDetailed(false);
                else navigate(studentMode ? 'studentDashboard' : 'dashboard');
            }} 
            className="p-[12px_15px] font-bold cursor-pointer rounded-[10px] transition-all duration-300 text-sm md:text-base bg-transparent border-2 border-[#00bcd4] text-[#00bcd4] hover:bg-[#00bcd4] hover:text-[#0b0c10] flex-grow text-center min-w-[100px]"
        >
          <i className="fas fa-arrow-left"></i> {showDetailed && !studentMode ? 'Back to Log' : 'Back'}
        </button>
        <div className="text-[1rem] md:text-[1.2rem] font-bold text-[#00bcd4] max-[500px]:hidden">{!showDetailed ? 'In Room' : 'Monthly Details'}</div>
        <button onClick={() => window.print()} className="p-[12px_15px] font-bold cursor-pointer rounded-[10px] transition-all duration-300 text-sm md:text-base bg-[#1976D2] text-white hover:bg-[#1565C0] border-none flex-grow text-center min-w-[100px]">
          <i className="fas fa-print"></i> Print
        </button>
      </div>
    </div>
  );
};

export default AttendanceView;