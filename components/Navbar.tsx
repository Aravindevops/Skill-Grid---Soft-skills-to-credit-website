import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Trophy, Home, User, ShoppingBag, Sun, Moon, LogOut } from 'lucide-react';
import clsx from 'clsx';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext.tsx';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
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
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">
              S
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">SkillGrid</span>
          </div>

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
                <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-slate-700 border border-indigo-200 dark:border-slate-600 overflow-hidden ring-2 ring-transparent hover:ring-indigo-400 transition-all">
                  <img src={user?.avatar ||"https://media.licdn.com/dms/image/v2/D5603AQFLBKeT04cvow/profile-displayphoto-crop_800_800/B56ZhfrHJnG0AY-/0/1753951794936?e=1772064000&v=beta&t=x9y09SuH18UOa1hS7H0e4txFvDCBgjcOwDcKyaQlt94"} alt="Profile" className="h-full w-full object-cover" />

              </div>
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-gray-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                    title="Sign Out"
                >
                    <LogOut size={18} />
                </button>    
             </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;