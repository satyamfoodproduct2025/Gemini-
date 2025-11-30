import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';

const StudentPayment: React.FC = () => {
  const { students, payments, currentUserMobile, navigate } = useApp();
  const [dueMonths, setDueMonths] = useState<{year: number, month: number, name: string, amount: number}[]>([]);
  const [selectedTotal, setSelectedTotal] = useState(0);

  useEffect(() => {
    const student = students.find(s => s.mobileNumber === currentUserMobile);
    if (!student) return;

    const admissionDate = new Date(student.admissionDate);
    const today = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let tempDate = new Date(admissionDate);
    const dues = [];

    while (tempDate.getFullYear() < today.getFullYear() || (tempDate.getFullYear() === today.getFullYear() && tempDate.getMonth() <= today.getMonth())) {
        const year = tempDate.getFullYear();
        const month = tempDate.getMonth() + 1;
        const isPaid = payments.some(p => p.mobile === currentUserMobile && p.year === year && p.month === month);
        
        if (!isPaid) {
            dues.push({ year, month, name: `${monthNames[month-1]} ${year}`, amount: 300 });
        }
        tempDate.setMonth(tempDate.getMonth() + 1);
    }
    setDueMonths(dues);
  }, [currentUserMobile, payments, students]);

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>, amount: number) => {
    if (e.target.checked) setSelectedTotal(prev => prev + amount);
    else setSelectedTotal(prev => prev - amount);
  };

  const handlePay = () => {
    alert("Payment API integration is pending. This would lead to PhonePe/UPI.");
  };

  return (
    <div className="main-panel bg-[#111217] md:bg-[#111217]/90 min-h-screen md:min-h-0 w-full md:w-[95%] md:max-w-[800px] p-[40px_30px] border-0 md:border-2 md:border-[#00bcd4] md:shadow-[0_0_40px_rgba(0,0,0,0.5)] md:rounded-[20px] text-white mx-auto">
      <div className="text-center mb-10 pt-4 md:pt-0">
        <h2 className="m-0 text-[2rem] text-[#dc3545] font-[900] tracking-[5px]">Your Due Payments</h2>
      </div>

      <div className="p-5 bg-black/20 rounded-[10px] max-h-[40vh] overflow-y-auto mb-5 border border-white/10">
        {dueMonths.length === 0 ? (
            <p className="text-center text-[#28a745] font-bold">You have no due payments. Good job!</p>
        ) : (
            dueMonths.map((d, i) => (
                <div key={i} className="p-[10px] text-[1.1rem] border-b border-white/10 last:border-b-0 flex items-center">
                    <input type="checkbox" id={`month-${d.year}-${d.month}`} onChange={(e) => handleCheck(e, d.amount)} className="mr-4 w-5 h-5 accent-[#00bcd4]" />
                    <label htmlFor={`month-${d.year}-${d.month}`}>{d.name} - ₹{d.amount}</label>
                </div>
            ))
        )}
      </div>

      {dueMonths.length > 0 && (
          <button onClick={handlePay} className="w-full p-[15px] border-none rounded-[10px] bg-gradient-to-br from-[#4CAF50] to-[#00bcd4] text-white text-[1.2rem] font-bold cursor-pointer transition-all duration-300 shadow-[0_5px_20px_rgba(0,188,212,0.4)] hover:opacity-90 mb-5">
            Proceed to Pay (Total: ₹{selectedTotal})
          </button>
      )}

      <div className="flex justify-start items-center mt-2.5">
        <button onClick={() => navigate('studentDashboard')} className="p-[10px_20px] font-bold cursor-pointer rounded-[10px] transition-all duration-300 text-base bg-transparent border-2 border-[#00bcd4] text-[#00bcd4] hover:bg-[#00bcd4] hover:text-[#0b0c10] flex-grow text-center min-w-[120px]">
          <i className="fas fa-arrow-left"></i> Back
        </button>
      </div>
    </div>
  );
};

export default StudentPayment;