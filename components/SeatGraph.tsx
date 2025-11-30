import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../AppContext';
import { SHIFT_TIMES } from '../AppContext';

const SeatGraph: React.FC = () => {
  const { totalSeats, setTotalSeats, bookings, setBookings, students, navigate, updateWowData } = useApp();
  const [clickCounter, setClickCounter] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Triple Click Logic Ref
  const interactionRef = useRef<{ id: string, count: number, timer: ReturnType<typeof setTimeout> | null }>({ id: '', count: 0, timer: null });

  const handleSecretClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setClickCounter(prev => {
      const newVal = prev + 1;
      if (newVal === 6) {
        setShowAdmin(true);
        alert('एडमिन कंट्रोल पैनल सक्रिय हो गया है। अब आप सीटें सेट कर सकते हैं।');
        return 0;
      }
      return newVal;
    });

    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => setClickCounter(0), 400);
  };

  const handleTripleClick = (id: string, action: () => void) => {
    // If clicking a new item, reset
    if (interactionRef.current.id !== id) {
      interactionRef.current.id = id;
      interactionRef.current.count = 1;
    } else {
      interactionRef.current.count++;
    }

    // Clear existing timer
    if (interactionRef.current.timer) clearTimeout(interactionRef.current.timer);

    // Check count
    if (interactionRef.current.count === 3) {
      action();
      // Reset after successful action
      interactionRef.current = { id: '', count: 0, timer: null };
    } else {
      // Set timer to reset if next click doesn't happen soon
      interactionRef.current.timer = setTimeout(() => {
        interactionRef.current = { id: '', count: 0, timer: null };
      }, 400); 
    }
  };

  const performBookingLogic = (seat: number, shift: number) => {
    const existing = bookings.find(b => b.seat === seat && b.shift === shift);
    
    if (existing) {
      if (window.confirm(`सीट ${seat}, शिफ्ट ${shift} (${SHIFT_TIMES[shift as keyof typeof SHIFT_TIMES]} - ${existing.name}) को कैंसिल करना चाहते हैं?`)) {
        setBookings(prev => prev.filter(b => !(b.seat === seat && b.shift === shift)));
        alert('बुकिंग कैंसिल कर दी गई है।');
      }
    } else {
      const mobile = window.prompt(`सीट ${seat}, शिफ्ट ${shift} (${SHIFT_TIMES[shift as keyof typeof SHIFT_TIMES]}) बुक करने के लिए छात्र का 10 अंकों का मोबाइल नंबर भरें:`);
      if (mobile && mobile.length === 10 && !isNaN(Number(mobile))) {
        const student = students.find(s => s.mobileNumber === mobile);
        if (!student) {
          alert("छात्र रिकॉर्ड नहीं मिला। पहले 'Students Data' में छात्र को जोड़ें।");
        } else {
          setBookings(prev => [...prev, { seat, shift, name: student.fullName, mobile, address: student.address }]);
          alert(`${student.fullName} के लिए सीट ${seat}, शिफ्ट ${shift} बुक कर दी गई है!`);
        }
      } else if (mobile !== null) {
        alert("अमान्य मोबाइल नंबर। बुकिंग रद्द की गई।");
      }
    }
  };

  const updateSeatCount = () => {
    const input = document.getElementById('seatCount') as HTMLInputElement;
    if (input) {
      const val = parseInt(input.value);
      if (val >= 1 && val <= 500) {
        setTotalSeats(val);
        setBookings(prev => prev.filter(b => b.seat <= val));
        alert(`कुल सीटें अब ${val} पर सेट हो गई हैं।`);
        setShowAdmin(false);
      } else {
        alert("कृपया 1 और 500 के बीच एक वैध सीट संख्या दर्ज करें।");
      }
    }
  };

  const renderRows = () => {
    const rows = [];
    for (let i = 1; i <= totalSeats; i++) {
      const shifts = [];
      for (let j = 1; j <= 4; j++) {
        const booking = bookings.find(b => b.seat === i && b.shift === j);
        shifts.push(
          <td key={j} className="border border-white/10 p-0 text-center h-[50px] print:border-black print:border">
            <div 
              onClick={(e) => {
                e.preventDefault();
                // Use Triple Click Wrapper
                handleTripleClick(`${i}-${j}`, () => performBookingLogic(i, j));
              }}
              className={`cursor-pointer w-full h-full flex items-center justify-center font-bold transition-all duration-200 select-none p-1 md:p-2 box-border text-[0.7rem] md:text-[0.8rem] leading-none text-[#0b0c10] whitespace-pre-wrap ${booking ? 'bg-[#f8d7da] text-[#721c24] font-medium' : 'bg-[#d4edda] text-[#155724] hover:bg-[#c3e6cb] hover:scale-102'}`}
            >
              {booking ? `${booking.name.split(' ')[0]}\n(${booking.mobile.slice(-4)})` : 'Available'}
            </div>
          </td>
        );
      }
      rows.push(
        <tr key={i} className="odd:bg-[#f9f9f9] bg-white print:bg-white text-black">
          <td onClick={handleSecretClick} className="border border-white/10 p-[12px_8px] text-center font-bold bg-white/5 cursor-pointer text-black print:border-black print:border sticky left-0 z-10 bg-gray-100">{i}</td>
          {shifts}
        </tr>
      );
    }
    return rows;
  };

  return (
    <div className="main-panel print:block print:w-full print:p-0 print:m-0 bg-[#111217] md:bg-[#111217]/90 min-h-screen md:min-h-0 w-full md:w-[95%] md:max-w-[800px] p-4 md:p-[40px_30px] border-0 md:border-2 md:border-[#00bcd4] md:shadow-[0_0_40px_rgba(0,0,0,0.5)] md:rounded-[20px] text-white mx-auto md:mt-4 md:mb-4">
      <div className="py-2.5">
        <h3 className="mt-0 text-[#663399] text-lg font-bold mb-4 print:text-black print:block print:mb-2 print:text-[1.1rem]">लाइब्रेरी सीट बुकिंग डैशबोर्ड (Graph)</h3>
      </div>

      {showAdmin && (
        <div className="mb-5 p-[15px] bg-[#111217]/90 border border-[#663399] rounded-lg flex items-center gap-[15px] shadow-sm text-white no-print">
          <label className="font-bold">कुल सीटें सेट करें (1-500):</label>
          <input type="number" id="seatCount" min="1" max="500" defaultValue={totalSeats} className="p-2 border border-[#00bcd4] rounded w-[80px] text-center text-base bg-white/5 text-white box-border" />
          <button onClick={updateSeatCount} className="p-[8px_15px] bg-[#663399] text-white border-none rounded cursor-pointer text-base hover:bg-[#582a86]">लागू करें (Apply)</button>
        </div>
      )}

      {/* 
         Graph Table Container:
         - overflow-x-auto allows horizontal scrolling
         - max-h-[60vh] allows vertical scrolling for the long list of seats
      */}
      <div className="overflow-x-auto overflow-y-auto max-h-[60vh] print:max-h-none print:overflow-visible border border-white/10 rounded-lg">
        <table className="w-full border-collapse shadow-md bg-[#111217]/90 text-white min-w-[600px] print:w-full print:text-[8.5pt] print:text-black print:table-fixed print:bg-white">
          <thead>
            <tr>
              <th className="bg-[#00bcd4] text-[#0b0c10] font-bold p-[12px_8px] sticky top-0 left-0 z-20 border border-white/10 print:border-black print:border print:bg-[#663399] print:text-white w-[50px]">No.</th>
              <th className="bg-[#00bcd4] text-[#0b0c10] font-bold p-[12px_8px] sticky top-0 z-10 border border-white/10 print:border-black print:border print:bg-[#00bcd4] print:text-white min-w-[120px]">Shift 1<br/><span className="text-[0.8em]">6AM-10AM</span></th>
              <th className="bg-[#00bcd4] text-[#0b0c10] font-bold p-[12px_8px] sticky top-0 z-10 border border-white/10 print:border-black print:border print:bg-[#00bcd4] print:text-white min-w-[120px]">Shift 2<br/><span className="text-[0.8em]">10AM-2PM</span></th>
              <th className="bg-[#00bcd4] text-[#0b0c10] font-bold p-[12px_8px] sticky top-0 z-10 border border-white/10 print:border-black print:border print:bg-[#00bcd4] print:text-white min-w-[120px]">Shift 3<br/><span className="text-[0.8em]">2PM-6PM</span></th>
              <th className="bg-[#00bcd4] text-[#0b0c10] font-bold p-[12px_8px] sticky top-0 z-10 border border-white/10 print:border-black print:border print:bg-[#00bcd4] print:text-white min-w-[120px]">Shift 4<br/><span className="text-[0.8em]">6PM-10PM</span></th>
            </tr>
          </thead>
          <tbody>
            {renderRows()}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-5 no-print flex-wrap gap-2">
        <button onClick={() => navigate('dashboard')} className="p-[12px_15px] font-bold cursor-pointer rounded-[10px] transition-all duration-300 text-sm md:text-base bg-transparent border-2 border-[#00bcd4] text-[#00bcd4] hover:bg-[#00bcd4] hover:text-[#0b0c10] flex-grow text-center min-w-[100px]">
          <i className="fas fa-arrow-left"></i> Back
        </button>
        <button onClick={() => window.print()} className="p-[12px_15px] font-bold cursor-pointer rounded-[10px] transition-all duration-300 text-sm md:text-base bg-[#1976D2] text-white hover:bg-[#1565C0] border-none flex-grow text-center min-w-[100px]">
          <i className="fas fa-print"></i> Print Seats
        </button>
      </div>
    </div>
  );
};

export default SeatGraph;