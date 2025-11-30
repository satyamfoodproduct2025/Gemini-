import React, { useRef } from 'react';
import { useApp, OWNER_PASSWORD } from '../AppContext';

interface PayDetailsProps {
  mode: 'summary' | 'fullYear';
}

const PayDetails: React.FC<PayDetailsProps> = ({ mode }) => {
  const { students, payments, setPayments, wowRecords, navigate } = useApp();
  const today = new Date();
  
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
  
  const handlePaymentToggle = (mobile: string, year: number, month: number) => {
    const password = prompt("Please enter the owner password to modify payment:");
    if (password === OWNER_PASSWORD) {
        const exists = payments.find(p => p.mobile === mobile && p.year === year && p.month === month);
        if (exists) {
            setPayments(prev => prev.filter(p => !(p.mobile === mobile && p.year === year && p.month === month)));
        } else {
            setPayments(prev => [...prev, { mobile, year, month }]);
        }
    } else if (password !== null) {
        alert("Incorrect password! Payment status not changed.");
    }
  };

  const renderSummary = () => {
    // Generate last 3 months
    const monthHeaders = [];
    for (let i = 0; i < 3; i++) {
        let d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        monthHeaders.push({ name: d.toLocaleString('default', { month: 'short' }), month: d.getMonth() + 1, year: d.getFullYear() });
    }

    return (
      <div className="overflow-x-auto w-full max-h-[60vh] print:max-h-none print:overflow-visible border border-white/10 rounded-lg">
        <table className="w-full border-collapse min-w-[800px] print:min-w-full print:table-fixed text-sm md:text-base">
          <thead className="sticky top-0 z-10 print:static">
             <tr>
                <th className="p-2 border-b-4 border-[#f44336] bg-white text-black font-bold w-[40px] print:bg-[#f44336] print:text-white print:border print:border-black sticky left-0 z-20">MD</th>
                <th className="p-2 border-b-4 border-[#663399] bg-white text-black font-bold w-[40px] print:bg-[#663399] print:text-white print:border print:border-black">SI</th>
                <th className="p-2 border-b-4 border-[#ff2a6d] bg-white text-black font-bold w-[20%] print:bg-[#ff2a6d] print:text-white print:border print:border-black">Full Name</th>
                <th className="p-2 border-b-4 border-[#17a2b8] bg-white text-black font-bold w-[20%] print:bg-[#17a2b8] print:text-white print:border print:border-black">Address / Mobile</th>
                <th className="p-2 border-b-4 border-[#ffc107] bg-white text-black font-bold w-[15%] print:bg-[#ffc107] print:text-black print:border print:border-black">Admission Due</th>
                <th colSpan={3} className="p-2 border-b-4 border-[#00bcd4] bg-white text-black font-bold w-[30%] print:bg-[#00bcd4] print:text-black print:border print:border-black text-center">Payment Status</th>
             </tr>
             <tr>
                <th colSpan={5} className="bg-white sticky left-0"></th>
                {monthHeaders.map(h => (
                    <th key={`${h.year}-${h.month}`} className="text-[0.9em] p-[8px_5px] border-b border-[#ccc] bg-white text-black print:bg-[#e0e0e0] print:border print:border-black text-center">
                        {h.name} {String(h.year).slice(-2)}
                    </th>
                ))}
             </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => {
                const admissionDate = new Date(student.admissionDate);
                let monthsSince = (today.getFullYear() - admissionDate.getFullYear()) * 12 + (today.getMonth() - admissionDate.getMonth());
                if (today.getDate() < admissionDate.getDate()) monthsSince--;
                const paidCount = payments.filter(p => p.mobile === student.mobileNumber).length;
                const md = Math.max(0, monthsSince - paidCount);
                
                const admissionDay = admissionDate.getDate();
                const thisMonthDue = new Date(today.getFullYear(), today.getMonth(), admissionDay);
                const diffTime = thisMonthDue.getTime() - today.getTime();
                const dayDiff = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

                let admissionDisplay;
                if (dayDiff > 0) admissionDisplay = <span className="font-bold text-[#28a745]">{dayDiff} day{dayDiff !== 1 ? 's' : ''} after</span>;
                else if (dayDiff === 0) admissionDisplay = <span className="font-bold text-[#fd7e14]">Due Today</span>;
                else admissionDisplay = <span className="font-bold text-[#dc3545]">{Math.abs(dayDiff)} day{Math.abs(dayDiff) !== 1 ? 's' : ''} late</span>;

                const wow = wowRecords.find(w => w.mobile === student.mobileNumber);
                const seatInfo = (wow && wow.seatNo && wow.shifts > 0) ? `(${wow.seatNo}-${wow.shifts})` : '';

                return (
                    <tr key={idx} className="odd:bg-[#f0f0f0] bg-white text-black print:bg-white">
                        <td className="p-[10px] md:p-[12px_15px] border border-white/10 print:border-black print:border text-center sticky left-0 bg-white/90 z-10">{md}</td>
                        <td className="p-[10px] md:p-[12px_15px] border border-white/10 print:border-black print:border text-center">{idx + 1}</td>
                        <td className="p-[10px] md:p-[12px_15px] border border-white/10 print:border-black print:border whitespace-nowrap">
                            {student.fullName} {seatInfo && <span className="font-bold text-blue-600">{seatInfo}</span>}
                        </td>
                        <td className="p-[10px] md:p-[12px_15px] border border-white/10 print:border-black print:border leading-[1.4] whitespace-nowrap">
                            {student.address}<br/><span className="text-xs text-gray-600">{student.mobileNumber}</span>
                        </td>
                        <td className="p-[10px] md:p-[12px_15px] border border-white/10 print:border-black print:border whitespace-nowrap">{admissionDisplay}</td>
                        {monthHeaders.map(h => {
                            const isPaid = payments.some(p => p.mobile === student.mobileNumber && p.year === h.year && p.month === h.month);
                            return (
                                <td key={`${h.year}-${h.month}`} className="p-[10px] md:p-[12px_15px] border border-white/10 print:border-black print:border text-center text-[#4caf50] font-bold text-[1.2em]">
                                    {isPaid ? '✓' : ''}
                                </td>
                            );
                        })}
                    </tr>
                );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderFullYear = () => {
    const currentYear = today.getFullYear();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    return (
      <div className="overflow-x-auto w-full max-h-[60vh] print:max-h-none print:overflow-visible border border-white/10 rounded-lg">
        <table className="w-full border-collapse min-w-[1000px] print:min-w-full print:table-fixed text-sm md:text-base">
          <thead className="sticky top-0 z-10 print:static">
             <tr>
                <th className="p-2 border-b-4 border-[#f44336] bg-white text-black font-bold w-[40px] print:bg-[#f44336] print:text-white print:border print:border-black sticky left-0 z-20">SI</th>
                <th className="p-2 border-b-4 border-[#663399] bg-white text-black font-bold w-[20%] print:bg-[#663399] print:text-white print:border print:border-black">Full Name</th>
                <th className="p-2 border-b-4 border-[#ff2a6d] bg-white text-black font-bold w-[20%] print:bg-[#ff2a6d] print:text-white print:border print:border-black">Address / Mobile</th>
                <th colSpan={12} className="p-2 border-b-4 bg-white text-black font-bold text-center print:border print:border-black">Payment Status for {currentYear}</th>
             </tr>
             <tr>
                <th colSpan={3} className="bg-white sticky left-0"></th>
                {months.map(m => (
                    <th key={m} className="text-[0.9em] p-[8px_5px] border-b border-[#ccc] bg-white text-black print:bg-[#e0e0e0] print:border print:border-black">{m}</th>
                ))}
             </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => {
                const admissionDate = new Date(student.admissionDate);
                const wow = wowRecords.find(w => w.mobile === student.mobileNumber);
                const seatInfo = (wow && wow.seatNo && wow.shifts > 0) ? `(${wow.seatNo}-${wow.shifts})` : '';

                return (
                    <tr key={idx} className="odd:bg-[#f0f0f0] bg-white text-black print:bg-white">
                        <td className="p-2 border print:border-black text-center sticky left-0 bg-white/90 z-10">{idx + 1}</td>
                        <td className="p-2 border print:border-black whitespace-nowrap">
                            {student.fullName} {seatInfo && <span className="font-bold text-blue-600">{seatInfo}</span>}
                        </td>
                        <td className="p-2 border print:border-black leading-[1.4] whitespace-nowrap">
                            {student.address}<br/><span className="text-xs text-gray-600">{student.mobileNumber}</span>
                        </td>
                        {months.map((m, i) => {
                            const monthIdx = i + 1;
                            let active = true;
                            if (admissionDate.getFullYear() > currentYear) active = false;
                            else if (admissionDate.getFullYear() === currentYear && admissionDate.getMonth() > i) active = false;
                            
                            const isPaid = payments.some(p => p.mobile === student.mobileNumber && p.year === currentYear && p.month === monthIdx);

                            return (
                                <td 
                                    key={i} 
                                    className="p-2 border print:border-black text-center cursor-pointer min-w-[30px]"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (active) {
                                          handleTripleClick(`${student.mobileNumber}-${currentYear}-${monthIdx}`, () => handlePaymentToggle(student.mobileNumber, currentYear, monthIdx));
                                      }
                                    }}
                                >
                                    {!active ? <span className="text-[#999] font-bold">-</span> : (isPaid ? <span className="text-[#4caf50] font-bold text-[1.2em]">✓</span> : '')}
                                </td>
                            );
                        })}
                    </tr>
                );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="main-panel print:block print:w-full print:p-0 print:m-0 bg-[#111217] md:bg-[#111217]/90 min-h-screen md:min-h-0 w-full md:w-[95%] md:max-w-[900px] p-4 md:p-[40px_30px] border-0 md:border-2 md:border-[#00bcd4] md:shadow-[0_0_40px_rgba(0,0,0,0.5)] md:rounded-[20px] text-white mx-auto md:mt-4 md:mb-4">
      <h3 className="mt-0 text-[#f44336] text-lg font-bold mb-4 print:text-black">
        {mode === 'summary' ? 'Payment Due Details' : 'Detailed Payment Marking'}
      </h3>
      
      {mode === 'summary' ? renderSummary() : renderFullYear()}

      <div className="flex justify-between items-center mt-5 no-print flex-wrap gap-2">
        <button onClick={() => navigate(mode === 'summary' ? 'dashboard' : 'payAction')} className="p-[12px_15px] font-bold cursor-pointer rounded-[10px] transition-all duration-300 text-sm md:text-base bg-transparent border-2 border-[#00bcd4] text-[#00bcd4] hover:bg-[#00bcd4] hover:text-[#0b0c10] flex-grow text-center min-w-[100px]">
          <i className="fas fa-arrow-left"></i> Back
        </button>
        <div className="text-[1rem] md:text-[1.2rem] font-bold text-[#00bcd4] max-[500px]:hidden">{mode === 'summary' ? 'Due Details' : 'Payment Marking'}</div>
        <button onClick={() => window.print()} className="p-[12px_15px] font-bold cursor-pointer rounded-[10px] transition-all duration-300 text-sm md:text-base bg-[#1976D2] text-white hover:bg-[#1565C0] border-none flex-grow text-center min-w-[100px]">
          <i className="fas fa-print"></i> Print
        </button>
      </div>
    </div>
  );
};

export default PayDetails;