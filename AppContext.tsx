import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Student, Booking, WowRecord, PaymentRecord, AttendanceRecord, LibraryLocation, ViewState } from './types';

// Constants
export const OWNER_MOBILE = '6201530654';
export const OWNER_PASSWORD = 'Avinash';
export const RATE_PER_SHIFT = 300;
export const LIBRARY_QR_CODE = "LibraryWorkAutomate_StaticQR_v1";
export const SHIFT_TIMES = { 1: "6AM-10AM", 2: "10AM-2PM", 3: "2PM-6PM", 4: "6PM-10PM" };

interface AppContextProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  wowRecords: WowRecord[];
  setWowRecords: React.Dispatch<React.SetStateAction<WowRecord[]>>;
  payments: PaymentRecord[];
  setPayments: React.Dispatch<React.SetStateAction<PaymentRecord[]>>;
  attendance: AttendanceRecord[];
  setAttendance: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
  location: LibraryLocation;
  setLocation: React.Dispatch<React.SetStateAction<LibraryLocation>>;
  currentUserMobile: string | null;
  setCurrentUserMobile: React.Dispatch<React.SetStateAction<string | null>>;
  view: ViewState;
  setView: React.Dispatch<React.SetStateAction<ViewState>>;
  navigate: (view: ViewState) => void;
  totalSeats: number;
  setTotalSeats: React.Dispatch<React.SetStateAction<number>>;
  // Helpers
  generateRandomStudents: (count: number) => void;
  updateWowData: (mobile: string, reRender?: boolean) => void;
  getStudent: (mobile: string) => Student | undefined;
  markStudentAttendance: (mobile: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [wowRecords, setWowRecords] = useState<WowRecord[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([
    { mobile: '6201530654', year: 2025, month: 9 },
    { mobile: '9876543210', year: 2025, month: 8 },
    { mobile: '9876543210', year: 2025, month: 9 },
    { mobile: '9988776655', year: 2025, month: 8 },
  ]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [location, setLocation] = useState<LibraryLocation>({ lat: 25.6127, lng: 85.1589, range: 20, set: false });
  const [currentUserMobile, setCurrentUserMobile] = useState<string | null>(null);
  const [view, setView] = useState<ViewState>('login');
  const [totalSeats, setTotalSeats] = useState<number>(50);

  // Navigation Helper with History
  const navigate = (newView: ViewState) => {
    setView(newView);
    window.history.pushState({ view: newView }, '', '');
  };

  // Initial Data Generation
  const generatePassword = (fullName: string, mobile: string) => {
    const namePart = fullName.trim().toUpperCase().replace(/[^A-Z\s]/g, '').slice(0, 4);
    const mobilePart = mobile.slice(-4);
    return namePart.replace(/\s/g, '') + mobilePart;
  };

  const generateRandomStudents = (count: number) => {
    const firstNames = ["Rahul", "Priya", "Amit", "Sneha", "Vikas", "Anjali", "Suresh", "Kirti", "Raj", "Neha"];
    const lastNames = ["Kumar", "Singh", "Sharma", "Verma", "Yadav", "Gupta", "Jha", "Mehta", "Rai", "Mishra"];
    const cities = ["Patna", "Delhi", "Mumbai", "Kolkata", "Bengaluru", "Pune", "Lucknow"];
    const newRecords: Student[] = [];
    for (let i = 0; i < count; i++) {
        const fullName = firstNames[Math.floor(Math.random() * firstNames.length)] + " " + lastNames[Math.floor(Math.random() * lastNames.length)];
        const fatherName = firstNames[Math.floor(Math.random() * lastNames.length)] + " " + lastNames[Math.floor(Math.random() * lastNames.length)];
        const mobileNumber = '9' + Math.random().toString().slice(2, 11);
        const address = cities[Math.floor(Math.random() * cities.length)];
        const date = new Date(Date.now() - Math.random() * 1.577e+10);
        const admissionDate = date.toISOString().split('T')[0];
        const password = generatePassword(fullName, mobileNumber);
        newRecords.push({ fullName, fatherName, address, mobileNumber, admissionDate, userName: mobileNumber, password });
    }
    setStudents(prev => [...prev, ...newRecords]);
    
    // Initialize empty WOW records
    setWowRecords(prev => {
        const existingMobiles = new Set(prev.map(r => r.mobile));
        const newWows = newRecords.filter(s => !existingMobiles.has(s.mobileNumber)).map(s => ({
            mobile: s.mobileNumber, seatNo: '', batchString: 'N/A', shifts: 0, payment: 0
        }));
        return [...prev, ...newWows];
    });
  };

  const updateWowData = (mobile: string) => {
    setWowRecords(currentWowRecords => {
        // Logic handled in useEffect dependency
        return currentWowRecords; 
    });
  };

  // Sync WOW data whenever bookings change
  useEffect(() => {
    setWowRecords(prevWow => {
        const newWow = [...prevWow];
        // Ensure every student has a record
        students.forEach(s => {
            if (!newWow.find(w => w.mobile === s.mobileNumber)) {
                newWow.push({ mobile: s.mobileNumber, seatNo: '', batchString: 'N/A', shifts: 0, payment: 0 });
            }
        });

        return newWow.map(record => {
            const studentBookings = bookings.filter(b => b.mobile === record.mobile).sort((a, b) => a.shift - b.shift);
            const shiftCount = studentBookings.length;
            const paymentAmount = shiftCount * RATE_PER_SHIFT;
            
            let seatNo = record.seatNo;
            if (shiftCount === 0) seatNo = '';
            else if (studentBookings.length > 0) seatNo = studentBookings[0].seat.toString();

            let batchString = 'N/A';
            if (shiftCount > 0) {
                // Simplified batch string logic for React
                const times: any = { 1: {s:'6AM', e:'10AM'}, 2: {s:'10AM', e:'2PM'}, 3: {s:'2PM', e:'6PM'}, 4: {s:'6PM', e:'10PM'} };
                let parts = [];
                let currentStart = null;
                for(let i=1; i<=4; i++) {
                   const booked = studentBookings.find(b => b.shift === i);
                   if (booked) {
                       if (currentStart === null) currentStart = i;
                   } else {
                       if (currentStart !== null) {
                           parts.push(`${times[currentStart].s}-${times[i-1].e}`);
                           currentStart = null;
                       }
                   }
                }
                if (currentStart !== null) parts.push(`${times[currentStart].s}-${times[4].e}`);
                batchString = parts.join(', ');
            }

            return { ...record, shifts: shiftCount, payment: paymentAmount, seatNo, batchString };
        });
    });
  }, [bookings, students]);

  // Handle Attendance Mark
  const markStudentAttendance = (mobile: string) => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase().replace(' ', ''); // e.g. 10:30am

    setAttendance(prev => {
        const newData = [...prev];
        let recordIndex = newData.findIndex(r => r.mobile === mobile && r.date === dateStr);

        let type = '';

        if (recordIndex === -1) {
            // No record for today, create new (IN)
            newData.unshift({ 
                mobile, 
                date: dateStr, 
                times: [{ in: timeStr, out: '' }] 
            });
            type = 'IN';
        } else {
            const record = { ...newData[recordIndex] };
            const lastTime = { ...record.times[record.times.length - 1] };

            if (lastTime && !lastTime.out) {
                // Last entry has IN but no OUT -> Mark OUT
                lastTime.out = timeStr;
                record.times[record.times.length - 1] = lastTime;
                type = 'OUT';
            } else {
                // Last entry completed or no times -> Mark IN
                record.times = [...record.times, { in: timeStr, out: '' }];
                type = 'IN';
            }
            newData[recordIndex] = record;
        }
        
        alert(`Attendance Marked Successfully!\nType: ${type}\nTime: ${timeStr}`);
        return newData;
    });
  };

  // Initial Data Load
  useEffect(() => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth(); 
    const year = today.getFullYear();
    
    const pastDate = new Date(year - 1, 7, day).toISOString().split('T')[0]; 
    const dueTodayDate = new Date(year, month - 1, day).toISOString().split('T')[0]; 
    const futureDate = new Date(year, month, day + 3).toISOString().split('T')[0]; 
    const veryFutureDate = new Date(year, month, day + 8).toISOString().split('T')[0]; 

    const fixedStudents: Student[] = [
        {fullName: "Avinash Kumar", fatherName: "Shankar Kumar", address: "Patna", mobileNumber: "6201530654", admissionDate: futureDate, userName: "6201530654", password: "AVIN0654"},
        {fullName: "Pooja Devi", fatherName: "Rajesh Sharma", address: "Delhi", mobileNumber: "9876543210", admissionDate: veryFutureDate, userName: "9876543210", password: "POOJ3210"},
        {fullName: "Ravi Sharma", fatherName: "Mohan Sharma", address: "Mumbai", mobileNumber: "9988776655", admissionDate: dueTodayDate, userName: "9988776655", password: "RAVI6655"},
        {fullName: "Sunita Verma", fatherName: "Anil Verma", address: "Pune", mobileNumber: "9988776644", admissionDate: pastDate, userName: "9988776644", password: "SUNI6644"}
    ];
    setStudents(fixedStudents);
    
    // Initial bookings
    setBookings([
        { seat: 1, shift: 3, name: 'Avinash Kumar', mobile: '6201530654'},
        { seat: 2, shift: 1, name: 'Pooja Devi', mobile: '9876543210'},
        { seat: 5, shift: 4, name: 'Ravi Sharma', mobile: '9988776655'}
    ]);
    
    // Random students
    generateRandomStudents(28);

    // Dummy Attendance Data
    const dummyAttendance: AttendanceRecord[] = [
        { mobile: '6201530654', date: '2025-10-11', times: [{ in: '9:00a', out: '1:00p' }] },
        { mobile: '6201530654', date: '2025-10-10', times: [{ in: '8:00a', out: '12:00p' }, { in: '2:10p', out: '5:15p' }] },
        { mobile: '6201530654', date: '2025-10-08', times: [{ in: '2:05p', out: '6:00p' }] },
        { mobile: '9876543210', date: '2025-10-10', times: [{ in: '10:00a', out: '2:00p' }] },
    ];
    setAttendance(dummyAttendance);
    // eslint-disable-next-line
  }, []); // Only run once

  const getStudent = (mobile: string) => students.find(s => s.mobileNumber === mobile);

  return (
    <AppContext.Provider value={{
      students, setStudents,
      bookings, setBookings,
      wowRecords, setWowRecords,
      payments, setPayments,
      attendance, setAttendance,
      location, setLocation,
      currentUserMobile, setCurrentUserMobile,
      view, setView,
      navigate,
      totalSeats, setTotalSeats,
      generateRandomStudents,
      updateWowData,
      getStudent,
      markStudentAttendance
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};