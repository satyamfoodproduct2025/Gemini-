import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Student } from '../types';

const StudentView: React.FC = () => {
  const { students, setStudents, setWowRecords, navigate } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', fatherName: '', address: '', mobileNumber: '', admissionDate: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const generatePassword = (fullName: string, mobile: string) => {
    const namePart = fullName.trim().toUpperCase().replace(/[^A-Z\s]/g, '').slice(0, 4);
    const mobilePart = mobile.slice(-4);
    return namePart.replace(/\s/g, '') + mobilePart;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.mobileNumber.length !== 10 || isNaN(Number(formData.mobileNumber))) {
      alert("Please enter a valid 10-digit mobile number."); return;
    }
    if (students.some(r => r.mobileNumber === formData.mobileNumber)) {
      alert("Error: Mobile number already registered!"); return;
    }
    const password = generatePassword(formData.fullName, formData.mobileNumber);
    const newStudent: Student = { ...formData, userName: formData.mobileNumber, password };
    
    setStudents(prev => [...prev, newStudent]);
    setWowRecords(prev => [...prev, { mobile: newStudent.mobileNumber, seatNo: '', batchString: 'N/A', shifts: 0, payment: 0 }]);
    
    alert(`Student added! Password: ${password}`);
    setFormData({ fullName: '', fatherName: '', address: '', mobileNumber: '', admissionDate: '' });
    setShowForm(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="studentViewPanel" className="main-panel print:block print:w-full print:p-0 print:m-0 bg-[#111217] md:bg-[#111217]/90 min-h-screen md:min-h-0 w-full md:w-[95%] md:max-w-[800px] p-4 md:p-[40px_30px] border-0 md:border-2 md:border-[#00bcd4] md:shadow-[0_0_40px_rgba(0,0,0,0.5)] md:rounded-[20px] text-white mx-auto md:mt-4 md:mb-4">
      <h3 className="mt-0 text-[#ff2a6d] text-lg font-bold mb-4 print:text-black">Registered Students (Airtable Style)</h3>
      
      <div className="overflow-x-auto w-full max-h-[60vh] print:max-h-none print:overflow-visible border border-white/10 rounded-lg">
        <table className="w-full border-collapse min-w-[800px] print:min-w-full print:table-fixed text-sm md:text-base">
          <thead className="sticky top-0 z-10 sticky-header print:static">
            <tr className="print:text-black">
              <th className="p-[10px] md:p-[12px_15px] text-left border-b border-white/10 text-black font-bold whitespace-nowrap bg-white border-b-4 border-[#663399] print:bg-[#663399] print:text-white print:border-black print:border">S.No.</th>
              <th className="p-[10px] md:p-[12px_15px] text-left border-b border-white/10 text-black font-bold whitespace-nowrap bg-white border-b-4 border-[#ff2a6d] print:bg-[#ff2a6d] print:text-white print:border-black print:border">Full Name</th>
              <th className="p-[10px] md:p-[12px_15px] text-left border-b border-white/10 text-black font-bold whitespace-nowrap bg-white border-b-4 border-[#17a2b8] print:bg-[#17a2b8] print:text-white print:border-black print:border">Father Name</th>
              <th className="p-[10px] md:p-[12px_15px] text-left border-b border-white/10 text-black font-bold whitespace-nowrap bg-white border-b-4 border-[#ffc107] print:bg-[#ffc107] print:text-black print:border-black print:border">Address</th>
              <th className="p-[10px] md:p-[12px_15px] text-left border-b border-white/10 text-black font-bold whitespace-nowrap bg-white border-b-4 border-[#00bcd4] print:bg-[#00bcd4] print:text-black print:border-black print:border">Mobile No.</th>
              <th className="p-[10px] md:p-[12px_15px] text-left border-b border-white/10 text-black font-bold whitespace-nowrap bg-white border-b-4 border-[#3366ff] print:bg-[#3366ff] print:text-white print:border-black print:border">Admission Date</th>
              <th className="p-[10px] md:p-[12px_15px] text-left border-b border-white/10 text-black font-bold whitespace-nowrap bg-white border-b-4 border-[#4caf50] print:bg-[#4caf50] print:text-white print:border-black print:border">User Name</th>
              <th className="p-[10px] md:p-[12px_15px] text-left border-b border-white/10 text-black font-bold whitespace-nowrap bg-white border-b-4 border-[#f44336] print:bg-[#f44336] print:text-white print:border-black print:border">Password</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index} className="odd:bg-[#f0f0f0] bg-white print:bg-white text-black hover:bg-gray-100 transition-colors">
                <td className="p-[10px] md:p-[12px_15px] border-b border-white/10 print:border-black print:border whitespace-nowrap">{index + 1}</td>
                <td className="p-[10px] md:p-[12px_15px] border-b border-white/10 print:border-black print:border whitespace-nowrap">{student.fullName}</td>
                <td className="p-[10px] md:p-[12px_15px] border-b border-white/10 print:border-black print:border whitespace-nowrap">{student.fatherName}</td>
                <td className="p-[10px] md:p-[12px_15px] border-b border-white/10 print:border-black print:border whitespace-nowrap">{student.address}</td>
                <td className="p-[10px] md:p-[12px_15px] border-b border-white/10 print:border-black print:border whitespace-nowrap">{student.mobileNumber}</td>
                <td className="p-[10px] md:p-[12px_15px] border-b border-white/10 print:border-black print:border whitespace-nowrap">{student.admissionDate}</td>
                <td className="p-[10px] md:p-[12px_15px] border-b border-white/10 print:border-black print:border whitespace-nowrap">{student.userName}</td>
                <td className="p-[10px] md:p-[12px_15px] border-b border-white/10 print:border-black print:border whitespace-nowrap">{student.password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3 md:gap-5 mt-5 mb-[30px] p-4 md:p-5 border border-[#663399] rounded-[10px] no-print bg-[#0b0c10]/50">
          <input type="text" id="fullName" placeholder="Full Name" required value={formData.fullName} onChange={handleInputChange} className="p-[12px] rounded-lg border border-[#00bcd4] bg-white/5 text-white text-base box-border w-full" />
          <input type="text" id="fatherName" placeholder="Father Name" required value={formData.fatherName} onChange={handleInputChange} className="p-[12px] rounded-lg border border-[#00bcd4] bg-white/5 text-white text-base box-border w-full" />
          <input type="text" id="address" placeholder="Address" required value={formData.address} onChange={handleInputChange} className="p-[12px] rounded-lg border border-[#00bcd4] bg-white/5 text-white text-base box-border w-full" />
          <input type="tel" id="mobileNumber" placeholder="Mobile No (10 digits)" required minLength={10} maxLength={10} value={formData.mobileNumber} onChange={handleInputChange} className="p-[12px] rounded-lg border border-[#00bcd4] bg-white/5 text-white text-base box-border w-full" />
          <input type="date" id="admissionDate" required value={formData.admissionDate} onChange={handleInputChange} className="p-[12px] rounded-lg border border-[#00bcd4] bg-white/5 text-white text-base box-border w-full" />
          <button type="submit" className="p-[15px] border-none rounded-[15px] text-[1.1rem] font-bold cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#663399] to-[#3366ff] text-white hover:opacity-90 flex flex-col justify-center items-center shadow-[0_5px_20px_rgba(0,0,0,0.5)] active:scale-95">ADD STUDENT</button>
        </form>
      )}

      <div className="flex justify-between items-center mt-5 no-print flex-wrap gap-2">
        <button onClick={() => navigate('dashboard')} className="p-[12px_15px] font-bold cursor-pointer rounded-[10px] transition-all duration-300 text-sm md:text-base bg-transparent border-2 border-[#00bcd4] text-[#00bcd4] hover:bg-[#00bcd4] hover:text-[#0b0c10] flex-grow text-center min-w-[100px]">
          <i className="fas fa-arrow-left"></i> Back
        </button>
        <button onClick={() => setShowForm(!showForm)} className="p-[12px_15px] font-bold cursor-pointer rounded-[10px] transition-all duration-300 text-sm md:text-base border-2 border-[#00bcd4] text-[#00bcd4] hover:opacity-90 flex-grow text-center min-w-[100px]">
          <i className={`fas fa-${showForm ? 'minus' : 'plus'}`}></i> {showForm ? 'Hide' : 'Add New'}
        </button>
        <button onClick={handlePrint} className="p-[12px_15px] font-bold cursor-pointer rounded-[10px] transition-all duration-300 text-sm md:text-base bg-[#1976D2] text-white hover:bg-[#1565C0] border-none flex-grow text-center min-w-[100px]">
          <i className="fas fa-print"></i> Print
        </button>
      </div>
    </div>
  );
};

export default StudentView;