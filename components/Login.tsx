import React, { useState } from 'react';
import { useApp, OWNER_MOBILE, OWNER_PASSWORD } from '../AppContext';

const Login: React.FC = () => {
  const { navigate, setCurrentUserMobile, students } = useApp();
  const [activeTab, setActiveTab] = useState<'owner' | 'student'>('owner');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'owner') {
      if (mobile === OWNER_MOBILE && password === OWNER_PASSWORD) {
        setCurrentUserMobile(null);
        navigate('dashboard');
      } else {
        setError('LOGIN FAILED! Invalid credentials for OWNER.');
      }
    } else {
      const student = students.find(s => s.userName === mobile && s.password === password);
      if (student) {
        setCurrentUserMobile(mobile);
        navigate('studentDashboard');
      } else {
        setError('LOGIN FAILED! Invalid credentials for STUDENT.');
      }
    }
  };

  return (
    <div className="animate-subtle-tilt max-w-[420px] bg-[#1a1a2e] md:border-[3px] md:border-[#4CAF50] md:shadow-[0_0_50px_rgba(76,175,80,0.5),0_0_20px_#00bcd4] p-[30px_20px] md:p-[40px_30px] md:rounded-[20px] text-white w-full md:w-[95%] relative z-10 box-border md:mt-5 md:mb-5 min-h-screen md:min-h-0 flex flex-col justify-center">
      <div className="text-center mb-[25px] md:mb-[35px] font-[900] shadow-[#ff2a6d] drop-shadow-[0_0_10px_#ff2a6d]">
        <h2 className="m-0 text-[1.4rem] md:text-[1.6rem] text-white tracking-[1px] opacity-80">Library Work</h2>
        <h1 className="m-[5px_0_0_0] text-[2.5rem] md:text-[3rem] tracking-[4px] bg-clip-text text-transparent bg-gradient-to-r from-[#4CAF50] to-[#00bcd4] animate-color-shift">Automate</h1>
      </div>

      <div className="flex justify-between mb-[25px] rounded-[10px] p-[5px] bg-[rgba(255,255,255,0.05)]">
        <button 
          onClick={() => { setActiveTab('owner'); setError(''); }}
          className={`flex-grow p-[10px] md:p-[12px] border-none rounded-lg text-sm md:text-base font-bold cursor-pointer transition-all duration-300 ${activeTab === 'owner' ? 'bg-gradient-to-br from-[#4CAF50] to-[#00bcd4] text-white shadow-[0_4px_15px_rgba(76,175,80,0.4)]' : 'bg-transparent text-white/60'}`}
        >Owner Login</button>
        <button 
          onClick={() => { setActiveTab('student'); setError(''); }}
          className={`flex-grow p-[10px] md:p-[12px] border-none rounded-lg text-sm md:text-base font-bold cursor-pointer transition-all duration-300 ${activeTab === 'student' ? 'bg-gradient-to-br from-[#4CAF50] to-[#00bcd4] text-white shadow-[0_4px_15px_rgba(76,175,80,0.4)]' : 'bg-transparent text-white/60'}`}
        >Student Login</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-[20px] relative">
          <i className="fas fa-mobile-alt absolute left-[15px] top-1/2 -translate-y-1/2 text-[#ff2a6d] text-[1.1rem]"></i>
          <input 
            type="text" 
            placeholder="Mobile Number" 
            required 
            value={mobile}
            onChange={e => setMobile(e.target.value)}
            className="w-full p-[15px_10px_15px_45px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.2)] rounded-[10px] text-white text-base box-border transition-all duration-300 focus:outline-none focus:border-[#00bcd4] focus:shadow-[0_0_10px_#00bcd4]"
          />
        </div>
        <div className="mb-[20px] relative">
          <i className="fas fa-lock absolute left-[15px] top-1/2 -translate-y-1/2 text-[#ff2a6d] text-[1.1rem]"></i>
          <input 
            type="password" 
            placeholder="Password" 
            required 
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-[15px_10px_15px_45px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.2)] rounded-[10px] text-white text-base box-border transition-all duration-300 focus:outline-none focus:border-[#00bcd4] focus:shadow-[0_0_10px_#00bcd4]"
          />
        </div>
        <button type="submit" className="w-full p-[15px] border-none rounded-[10px] bg-gradient-to-br from-[#663399] to-[#00bcd4] text-white text-[1.1rem] md:text-[1.2rem] font-bold cursor-pointer transition-all duration-300 shadow-[0_5px_20px_rgba(0,188,212,0.4)] hover:opacity-90 hover:scale-102 hover:shadow-[0_5px_25px_#ff2a6d] bg-gradient-to-br from-[#4CAF50] to-[#00bcd4]">
          {activeTab.toUpperCase()} LOGIN
        </button>
        {error && <p className="text-[#ff2a6d] text-center mt-5 font-bold drop-shadow-[0_0_5px_#ff2a6d] text-sm">{error}</p>}
      </form>
    </div>
  );
};

export default Login;