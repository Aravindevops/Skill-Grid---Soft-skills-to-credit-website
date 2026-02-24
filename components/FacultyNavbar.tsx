import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, LogOut, Sun, Moon, LayoutGrid, CheckSquare, PlusSquare, Trophy, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export type FacultyTab = 'dashboard' | 'verifications' | 'create_event' | 'rewards' | 'leaderboard';

interface FacultyNavbarProps {
    facultyName?: string;
    activeTab: FacultyTab;
    setActiveTab: (tab: FacultyTab) => void;
}

const FacultyNavbar: React.FC<FacultyNavbarProps> = ({ facultyName, activeTab, setActiveTab }) => {
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/faculty/login');
    };

    const navItems: { id: FacultyTab; label: string; icon: React.ReactNode }[] = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutGrid size={18} /> },
        { id: 'verifications', label: 'Verifications', icon: <CheckSquare size={18} /> },
        { id: 'create_event', label: 'Create Event', icon: <PlusSquare size={18} /> },
        { id: 'rewards', label: 'Reward Store', icon: <ShoppingBag size={18} /> },
        { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy size={18} /> },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-[#0B0F19] border-b border-slate-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo (Original as requested) */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
                            <span className="font-bold text-xl">S</span>
                        </div>
                        <div>
                            <span className="font-bold text-xl text-white tracking-tight">SkillForge</span>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="hidden md:flex items-center gap-3">
                        {navItems.map((item) => {
                            const isActive = activeTab === item.id;
                            // The Leaderboard button in screenshot is a distinct amber pill
                            if (item.id === 'leaderboard') {
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${isActive
                                            ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                                            : 'bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white'
                                            }`}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </button>
                                );
                            }

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${isActive
                                        ? 'bg-indigo-900/40 text-indigo-400 border border-indigo-700/50'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                                        }`}
                                >
                                    {item.icon}
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Profile Section */}
                    <div className="flex items-center gap-6">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-slate-800 transition-colors text-slate-400"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>

                        <div className="flex items-center gap-4">
                            {facultyName && (
                                <div className="hidden sm:flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white overflow-hidden">
                                        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${facultyName}&backgroundColor=4f46e5`} alt="avatar" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white leading-none">{facultyName}</span>
                                        <span className="text-[10px] font-bold text-slate-400 tracking-wider mt-1">FACULTY</span>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleLogout}
                                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
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

export default FacultyNavbar;
