export interface Student {
  fullName: string;
  fatherName: string;
  address: string;
  mobileNumber: string;
  admissionDate: string;
  userName: string;
  password?: string;
}

export interface Booking {
  seat: number;
  shift: number;
  name: string;
  mobile: string;
  address?: string;
}

export interface WowRecord {
  mobile: string;
  seatNo: string;
  batchString: string;
  shifts: number;
  payment: number;
}

export interface PaymentRecord {
  mobile: string;
  year: number;
  month: number;
}

export interface AttendanceTime {
  in: string;
  out: string;
}

export interface AttendanceRecord {
  mobile: string;
  date: string;
  times: AttendanceTime[];
}

export interface LibraryLocation {
  lat: number;
  lng: number;
  range: number;
  set: boolean;
}

export type ViewState = 
  | 'login' 
  | 'dashboard' 
  | 'studentView' 
  | 'wowView' 
  | 'seatGraph' 
  | 'payDetails' 
  | 'attendanceView' 
  | 'payAction' 
  | 'pDetails' 
  | 'settings' 
  | 'studentDashboard' 
  | 'studentPayment' 
  | 'studentHistory';
