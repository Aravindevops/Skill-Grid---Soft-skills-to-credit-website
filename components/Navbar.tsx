import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Trophy, Home, User, ShoppingBag, Sun, Moon, LogOut, Settings, Camera, Bell, HelpCircle } from 'lucide-react';
import clsx from 'clsx';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { subscribeToNotifications } from '../services/notificationService';

import { Logo } from './Logo';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { userProfile } = useUser();
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    if (!user?.id) return;
    const unsubscribe = subscribeToNotifications(user.id, (notifs) => {
      setUnreadCount(notifs.filter(n => !n.isRead).length);
    });
    return () => unsubscribe();
  }, [user?.id]);

  const navItems = [
    { label: 'Home', path: '/dashboard', icon: Home },
    { label: 'Portfolio', path: '/portfolio', icon: User },
    { label: 'Reward Store', path: '/rewards', icon: ShoppingBag },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/dashboard" className="flex-shrink-0 flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Logo className="w-8 h-8" />
            <span className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-widest">SkillGrid</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                  isActive(item.path)
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                    : "text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-slate-800"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}

            <Link
              to="/rank-table"
              className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-md transform transition-all hover:scale-105 active:scale-95",
                isActive('/rank-table') ? "bg-amber-500 text-white ring-2 ring-amber-300 dark:ring-amber-700" : "bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:shadow-lg"
              )}
            >
              <Trophy size={18} />
              Rank Table
            </Link>
          </div>

          {/* Secondary Links & Toggle */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-500 dark:text-slate-400">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-500 dark:text-slate-400 focus:outline-none"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <Link to="/about" className="hover:text-gray-900 dark:hover:text-white transition-colors">About</Link>
            <Link to="/contact" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact</Link>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-slate-700">
              <div className="relative group">
                <div className="h-8 w-8 rounded-full bg-indigo-600 border border-indigo-200 dark:border-slate-600 overflow-hidden ring-2 ring-transparent hover:ring-indigo-400 transition-all flex items-center justify-center cursor-pointer">
                  {userProfile?.avatar
                    ? <img src={userProfile.avatar} alt="Profile" className="h-full w-full object-cover" />
                    : <span className="text-white text-xs font-bold">{(userProfile?.name || user?.name || 'U').charAt(0).toUpperCase()}</span>
                  }
                </div>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-3 w-60 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 dark:border-slate-700/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="p-2 space-y-1">
                    <div className="px-3 py-2 mb-2 border-b border-gray-100 dark:border-slate-700 flex flex-col">
                      <span className="text-sm font-bold text-gray-900 dark:text-white truncate">{userProfile?.name || user?.name || 'Student'}</span>
                      <span className="text-xs text-gray-500 dark:text-slate-400 truncate">{user?.email || 'student@skillgrid.edu'}</span>
                    </div>

                    <Link to="/profile" className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors text-left">
                      <Settings size={16} />
                      <span>Edit Details</span>
                    </Link>
                    
                    <Link to="/profile" className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors text-left">
                      <Camera size={16} />
                      <span>Edit Profile Image</span>
                    </Link>

                    <div className="h-px bg-gray-100 dark:bg-slate-700 my-2 mx-1"></div>

                    <Link to="/notifications" className="w-full flex items-center justify-between gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg transition-colors text-left group/notify">
                      <div className="flex items-center gap-3">
                        <Bell size={16} className="group-hover/notify:animate-[wiggle_1s_ease-in-out_infinite]" />
                        <span>Notifications</span>
                      </div>
                      {unreadCount > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-amber-500 text-[10px] font-bold text-white shadow-md">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </Link>

                    <div className="h-px bg-gray-100 dark:bg-slate-700 my-2 mx-1"></div>

                     <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-colors text-left">
                      <HelpCircle size={16} />
                      <span>Help & Support</span>
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-gray-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors ml-2"
                title="Sign Out"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;