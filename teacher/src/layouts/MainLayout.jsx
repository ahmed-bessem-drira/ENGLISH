import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoWhite from '../assets/logo-white.png';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      path: '/classes',
      label: 'My Classes',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      path: '/lessons',
      label: 'My Lessons',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      path: '/lessons/create',
      label: 'Create Lesson',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
  ];

  const teacherName = user?.name || 'Drira Ahmed Bessem';

  return (
    <div className="flex min-h-screen bg-[#f4f7fb]">
      {/* Sidebar with dark navy styling matching the screenshot */}
      <aside className="w-64 bg-[#091733] border-r border-[#0d224d] fixed inset-y-0 left-0 z-30 flex flex-col justify-between overflow-hidden select-none">
        
        <div>
          {/* Brand Header with Professor Logo */}
          <div className="p-6 pb-4">
            <Link to="/dashboard" className="block group">
              <img
                src={logoWhite}
                alt="Mr. Ben Salah - English Professor"
                className="h-16 w-auto max-w-full object-contain transition-opacity group-hover:opacity-90"
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="px-3.5 py-4">
            <ul className="space-y-1.5">
              {navItems.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-md transition-all duration-200 text-sm ${
                        isActive
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'text-slate-300 hover:text-white hover:bg-white/[0.06] font-medium'
                      }`}
                    >
                      <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* User Card & Logout Bottom Section */}
        <div className="p-4 border-t border-white/[0.08] relative z-10 space-y-2 bg-[#091733]/60 backdrop-blur-sm">
          {/* Teacher Profile Card */}
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.05] transition-colors cursor-pointer group">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/20 shrink-0 border border-white/20">
                {(teacherName.charAt(0) || 'D').toUpperCase()}
              </div>
              <div className="truncate">
                <p className="font-semibold text-white text-xs truncate leading-tight">{teacherName}</p>
                <p className="text-[11px] text-slate-400 leading-tight mt-0.5">Teacher</p>
              </div>
            </div>
            <svg className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors group"
          >
            <svg className="w-4 h-4 text-slate-400 group-hover:text-red-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;