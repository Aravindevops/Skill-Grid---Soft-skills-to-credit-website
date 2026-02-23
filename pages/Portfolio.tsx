import React, { useEffect, useState } from 'react';
import SkillRadar from '../components/SkillRadar';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { getUserEvents } from '../services/eventService';
import { Event } from '../types';
import { Users, Zap, Briefcase, Code, MessageCircle, CheckCircle2 } from 'lucide-react';

const SKILL_CONFIG = [
    { key: 'teamwork', label: 'Teamwork', Icon: Users, color: 'blue' },
    { key: 'leadership', label: 'Leadership', Icon: Zap, color: 'purple' },
    { key: 'creativity', label: 'Creativity', Icon: Briefcase, color: 'amber' },
    { key: 'technical', label: 'Technical', Icon: Code, color: 'pink' },
    { key: 'communication', label: 'Communication', Icon: MessageCircle, color: 'green' },
] as const;

const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    amber: 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    pink: 'bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400',
    green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
};

const barColorMap: Record<string, string> = {
    blue: 'bg-blue-600 dark:bg-blue-500',
    purple: 'bg-purple-600 dark:bg-purple-500',
    amber: 'bg-amber-500',
    pink: 'bg-pink-500',
    green: 'bg-green-500',
};

const Portfolio: React.FC = () => {
    const { userProfile, isLoadingProfile } = useUser();
    const { user } = useAuth();
    const [userEvents, setUserEvents] = useState<Event[]>([]);

    useEffect(() => {
        if (!user?.id) return;
        getUserEvents(user.id).then(setUserEvents).catch(console.error);
    }, [user?.id]);

    const verifiedEvents = userEvents.filter(e => e.status === 'Verified');

    if (isLoadingProfile) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const displayName = userProfile?.name || user?.name || 'Student';
    const avatar = userProfile?.avatar || '';
    const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-gray-200 dark:border-slate-800 pb-6 transition-colors duration-200">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Academic Portfolio</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-2">A holistic view of your soft skills and achievements.</p>
                </div>
                <button className="bg-gray-900 dark:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-indigo-500 transition">
                    Download Transcript
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Profile & Radar */}
                <div className="space-y-8">
                    {/* Profile Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 text-center transition-colors duration-200">
                        <div className="w-24 h-24 mx-auto rounded-full p-1 border-2 border-dashed border-indigo-300 dark:border-indigo-500 mb-4 overflow-hidden">
                            {avatar ? (
                                <img src={avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <div className="w-full h-full rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                                    {initials}
                                </div>
                            )}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{displayName}</h2>
                        <p className="text-indigo-600 dark:text-indigo-400 font-medium">{userProfile?.email || user?.email || ''}</p>
                        <div className="mt-6 flex justify-center gap-8 border-t border-gray-50 dark:border-slate-700 pt-6">
                            <div className="text-center">
                                <span className="block text-2xl font-bold text-gray-900 dark:text-white">{(userProfile?.totalCredits ?? 0).toLocaleString()}</span>
                                <span className="text-xs text-gray-400 dark:text-slate-500 uppercase tracking-wider">Credits</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-2xl font-bold text-gray-900 dark:text-white">
                                    {userProfile?.rank && userProfile.rank > 0 ? `#${userProfile.rank}` : '—'}
                                </span>
                                <span className="text-xs text-gray-400 dark:text-slate-500 uppercase tracking-wider">Rank</span>
                            </div>
                        </div>
                    </div>

                    {/* The Radar Chart */}
                    {userProfile?.skills && <SkillRadar skills={userProfile.skills} />}
                </div>

                {/* Middle/Right Column: Detailed Metrics */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Skill Breakdown Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {SKILL_CONFIG.map(({ key, label, Icon, color }) => {
                            const value = userProfile?.skills?.[key] ?? 0;
                            return (
                                <div key={key} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-4 transition-colors duration-200">
                                    <div className={`p-3 rounded-lg ${colorMap[color]}`}><Icon size={20} /></div>
                                    <div className="w-full">
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase font-semibold">{label}</p>
                                        <div className="flex items-end gap-2 justify-between">
                                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-slate-700 h-1.5 rounded-full mt-2">
                                            <div className={`${barColorMap[color]} h-1.5 rounded-full`} style={{ width: `${value}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Event History */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden transition-colors duration-200">
                        <div className="px-6 py-4 border-b border-gray-50 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Verified Participation History</h3>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-slate-900/50">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Event</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Date</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Category</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase text-right">Credits</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
                                {verifiedEvents.map(event => (
                                    <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{event.title}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-400">{new Date(event.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                                                {event.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">+{event.credits}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium">
                                                <CheckCircle2 size={16} /> Verified
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {verifiedEvents.length === 0 && (
                            <div className="p-8 text-center text-gray-500 dark:text-slate-400">No verified events yet. Start participating!</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Portfolio;