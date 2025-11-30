import React from 'react';
import { useApp } from '../AppContext';

const WowView: React.FC = () => {
  const { wowRecords, students, setBookings, bookings, navigate, getStudent } = useApp();

  const handleSeatChange = (e: React.ChangeEvent<HTMLInputElement>, mobile: string) => {
    const val = e.target.value.trim();
    const studentData = getStudent(mobile);
    if (!studentData) return;

    if (val === '') {
        setBookings(prev => prev.filter(b => b.mobile !== mobile));
        return;
    }

    let seatNo = 0, shiftNo: number | null = null, isSingle = false;

    if (val.includes('.')) {
        isSingle = true;
        const parts = val.split('.');
        seatNo = parseInt(parts[0]);
        shiftNo = parseInt(parts[1]);
        if (isNaN(seatNo) || seatNo <= 0 || isNaN(shiftNo) || ![1, 2, 3, 4].includes(shiftNo)) {
            alert("अमान्य प्रारूप। 'Seat.Shift' का उपयोग करें (जैसे, 5.1)। शिफ्ट 1, 2, 3, या 4 होना चाहिए।");
            return;
        }
    } else {
        seatNo = parseInt(val);
        if (isNaN(seatNo) || seatNo <= 0) {
            alert("अमान्य सीट संख्या।");
            return;
        }
    }

    if (isSingle && shiftNo) {
        const conflict = bookings.find(b => b.seat === seatNo && b.shift === shiftNo && b.mobile !== mobile);
        if (conflict) {
            alert(`त्रुटि: सीट ${seatNo}, शिफ्ट ${shiftNo} किसी अन्य छात्र द्वारा पहले ही ले ली गई है।`);
            e.target.value = ''; 
            return;
        }
        setBookings(prev => {
            const clean = prev.filter(b => !(b.seat === seatNo && b.shift === shiftNo)); 
            return [...clean, { seat: seatNo, shift: shiftNo!, name: studentData.fullName, mobile, address: studentData.address }];
        });
        alert(`सीट ${seatNo}, शिफ्ट ${shiftNo} के लिए बुकिंग जोड़ दी गई है।`);
    } else {
        const conflicts = bookings.filter(b => b.seat === seatNo && b.mobile !== mobile);
        if (conflicts.length > 0) {
             const conflictShifts = conflicts.map(c => c.shift).join(', ');
             alert(`त्रुटि: पूरे दिन का आवंटन नहीं किया जा सकता। सीट ${seatNo} आंशिक रूप से अन्य छात्रों द्वारा शिफ्ट(ओं) पर कब्जा कर लिया गया है: ${conflictShifts}.`);
             return;
        }
        setBookings(prev => {
            const others = prev.filter(b => b.mobile !== mobile); 
            const newBookings = [];
            for (let i = 1; i <= 4; i++) newBookings.push({ seat: seatNo, shift: i, name: studentData.fullName, mobile, address: studentData.address });
            return [...others, ...newBookings];
        });
        alert(`${studentData.fullName} को सीट ${seatNo} के लिए पूरा दिन आवंटित किया गया।`);
    }
  };

  return (
    <div className="main-panel print:block print:w-full print:p-0 print:m-0 bg-[#111217] md:bg-[#111217]/90 min-h-screen md:min-h-0 w-full md:w-[95%] md:max-w-[800px] p-4 md:p-[40px_30px] border-0 md:border-2 md:border-[#00bcd4] md:shadow-[0_0_40px_rgba(0,0,0,0.5)] md:rounded-[20px] text-white mx-auto md:mt-4 md:mb-4">
      <h3 className="mt-0 text-[#ff2a6d] text-lg font-bold mb-4 print:text-black">WOW Seat Allocation & Booking</h3>
      
      {/* Mobile-friendly table container */}
      <div className="overflow-x-auto w-full max-h-[60vh] print:max-h-none print:overflow-visible border border-white/10 rounded-lg">
        <table className="w-full border-collapse min-w-[900px] print:min-w-full print:table-fixed text-sm md:text-base">
          <thead>
            <tr>
              <th className="bg-[#663399] print:bg-[#663399] print:text-white border-b-4 border-[#663399] sticky top-0 z-10 p-[10px] md:p-[12px_15px] font-bold whitespace-nowrap text-black bg-white print:border-black print:border w-[60px]">Seat</th>
              <th className="bg-[#ff2a6d] print:bg-[#ff2a6d] print:text-white border-b-4 border-[#ff2a6d] sticky top-0 z-10 p-[10px] md:p-[12px_15px] font-bold whitespace-nowrap text-black bg-white print:border-black print:border w-[14%]">Full Name</th>
              <th className="bg-[#17a2b8] print:bg-[#17a2b8] print:text-white border-b-4 border-[#17a2b8] sticky top-0 z-10 p-[10px] md:p-[12px_15px] font-bold whitespace-nowrap text-black bg-white print:border-black print:border w-[14%]">Father Name</th>
              <th className="bg-[#ffc107] print:bg-[#ffc107] print:text-black border-b-4 border-[#ffc107] sticky top-0 z-10 p-[10px] md:p-[12px_15px] font-bold whitespace-nowrap text-black bg-white print:border-black print:border w-[14%]">Address</th>
              <th className="bg-[#00bcd4] print:bg-[#00bcd4] print:text-black border-b-4 border-[#00bcd4] sticky top-0 z-10 p-[10px] md:p-[12px_15px] font-bold whitespace-nowrap text-black bg-white print:border-black print:border w-[12%]">Mobile No.</th>
              <th className="bg-[#FF5722] print:bg-[#FF5722] print:text-white border-b-4 border-[#FF5722] sticky top-0 z-10 p-[10px] md:p-[12px_15px] font-bold whitespace-nowrap text-black bg-white print:border-black print:border w-[12%]">Batch Time</th>
              <th className="bg-[#009688] print:bg-[#009688] print:text-white border-b-4 border-[#009688] sticky top-0 z-10 p-[10px] md:p-[12px_15px] font-bold whitespace-nowrap text-black bg-white print:border-black print:border w-[10%]">Shifts</th>
              <th className="bg-[#FFC107] print:bg-[#FFC107] print:text-black border-b-4 border-[#FFC107] sticky top-0 z-10 p-[10px] md:p-[12px_15px] font-bold whitespace-nowrap text-black bg-white print:border-black print:border w-[10%]">Payment</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, i) => {
                const record = wowRecords.find(r => r.mobile === student.mobileNumber) || { seatNo: '', batchString: 'N/A', shifts: 0, payment: 0 };
                const isAssigned = record.seatNo !== '';
                
                let displayVal = record.seatNo;
                if (record.seatNo && bookings.filter(b => b.mobile === student.mobileNumber).length < 4) {
                    const b = bookings.find(b => b.mobile === student.mobileNumber);
                    if (b) displayVal = `${record.seatNo}.${b.shift}`;
                }

                return (
                  <tr key={i} className={`odd:bg-[#f0f0f0] bg-white print:bg-white text-black ${isAssigned ? 'bg-[#d1e5f0] odd:bg-[#d1e5f0]' : ''}`} style={{ backgroundColor: isAssigned ? '#d1e5f0' : undefined }}>
                    <td className="p-[10px] md:p-[12px_15px] border-b border-white/10 print:border-black print:border">
                        <input 
                            type="text" 
                            className="bg-[#f8f8f8] border border-[#ccc] text-black p-[5px] w-full min-w-[60px] rounded-[5px] text-center box-border" 
                            placeholder="S.Sh"
                            defaultValue={displayVal}
                            onBlur={(e) => handleSeatChange(e, student.mobileNumber)}
                        />
                    </td>
                    <td className="p-[10px] md:p-[12px_15px] border-b border-white/10 print:border-black print:border whitespace-nowrap">{student.fullName}</td>
                    <td className="p-[10px] md:p-[12px_15px] border-b border-white/10 print:border-black print:border whitespace-nowrap">{student.fatherName}</td>
                    <td className="p-[10px] md:p-[12px_15px] border-b border-white/10 print:border-black print:border whitespace-nowrap">{student.address}</td>
                    <td className="p-[10px] md:p-[12px_15px] border-b border-white/10 print:border-black print:border whitespace-nowrap">{student.mobileNumber}</td>
                    <td className="p-[10px] md:p-[12px_15px] border-b border-white/10 print:border-black print:border">
                        <textarea readOnly className="bg-[#f8f8f8] border border-[#ccc] text-black text-center w-full min-w-[120px] block mb-[5px] p-[5px] rounded-[5px] h-auto whitespace-normal box-border text-xs" value={record.batchString}></textarea>
                    </td>
                    <td className="p-[10px] md:p-[12px_15px] border-b border-white/10 print:border-black print:border whitespace-nowrap">{record.shifts} Shift{record.shifts !== 1 ? 's' : ''}</td>
                    <td className="p-[10px] md:p-[12px_15px] border-b border-white/10 print:border-black print:border font-bold">₹{record.payment}</td>
                  </tr>
                );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-5 no-print flex-wrap gap-2">
        <button onClick={() => navigate('dashboard')} className="p-[12px_15px] font-bold cursor-pointer rounded-[10px] transition-all duration-300 text-sm md:text-base bg-transparent border-2 border-[#00bcd4] text-[#00bcd4] hover:bg-[#00bcd4] hover:text-[#0b0c10] flex-grow text-center min-w-[100px]">
          <i className="fas fa-arrow-left"></i> Back
        </button>
        <button onClick={() => window.print()} className="p-[12px_15px] font-bold cursor-pointer rounded-[10px] transition-all duration-300 text-sm md:text-base bg-[#1976D2] text-white hover:bg-[#1565C0] border-none flex-grow text-center min-w-[100px]">
          <i className="fas fa-print"></i> Print WOW
        </button>
      </div>
    </div>
  );
};

export default WowView;