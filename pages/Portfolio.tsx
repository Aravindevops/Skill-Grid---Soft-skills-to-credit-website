import React from 'react';
import SkillRadar from '../components/SkillRadar';
import { CURRENT_USER, EVENTS } from '../constants';
import { Users, Zap, Briefcase, Code, CheckCircle2 } from 'lucide-react';

const Portfolio: React.FC = () => {
  const verifiedEvents = EVENTS.filter(e => e.status === 'Verified');

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
            <div className="w-24 h-24 mx-auto rounded-full p-1 border-2 border-dashed border-indigo-300 dark:border-indigo-500 mb-4">
                <img src={CURRENT_USER.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{CURRENT_USER.name}</h2>
            <p className="text-indigo-600 dark:text-indigo-400 font-medium">Computer Science • Year 3</p>
            <div className="mt-6 flex justify-center gap-8 border-t border-gray-50 dark:border-slate-700 pt-6">
                <div className="text-center">
                    <span className="block text-2xl font-bold text-gray-900 dark:text-white">{CURRENT_USER.totalCredits}</span>
                    <span className="text-xs text-gray-400 dark:text-slate-500 uppercase tracking-wider">Credits</span>
                </div>
                <div className="text-center">
                    <span className="block text-2xl font-bold text-gray-900 dark:text-white">#{CURRENT_USER.rank}</span>
                    <span className="text-xs text-gray-400 dark:text-slate-500 uppercase tracking-wider">Rank</span>
                </div>
            </div>
          </div>

          {/* The Radar Chart */}
          <SkillRadar skills={CURRENT_USER.skills} />
        </div>

        {/* Middle/Right Column: Detailed Metrics */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Skill Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-4 transition-colors duration-200">
                    <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg text-blue-600 dark:text-blue-400"><Users size={20} /></div>
                    <div className="w-full">
                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase font-semibold">Teamwork</p>
                        <div className="flex items-end gap-2 justify-between">
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{CURRENT_USER.skills.teamwork}%</span>
                            <span className="text-xs text-green-600 dark:text-green-400 mb-1 font-medium">Top 5%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-slate-700 h-1.5 rounded-full mt-2">
                            <div className="bg-blue-600 dark:bg-blue-500 h-1.5 rounded-full" style={{ width: `${CURRENT_USER.skills.teamwork}%` }}></div>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-4 transition-colors duration-200">
                    <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-lg text-purple-600 dark:text-purple-400"><Zap size={20} /></div>
                    <div className="w-full">
                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase font-semibold">Leadership</p>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{CURRENT_USER.skills.leadership}%</span>
                        </div>
                         <div className="w-full bg-gray-100 dark:bg-slate-700 h-1.5 rounded-full mt-2">
                            <div className="bg-purple-600 dark:bg-purple-500 h-1.5 rounded-full" style={{ width: `${CURRENT_USER.skills.leadership}%` }}></div>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-4 transition-colors duration-200">
                    <div className="bg-amber-100 dark:bg-amber-900/20 p-3 rounded-lg text-amber-600 dark:text-amber-400"><Briefcase size={20} /></div>
                    <div className="w-full">
                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase font-semibold">Creativity</p>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{CURRENT_USER.skills.creativity}%</span>
                        </div>
                         <div className="w-full bg-gray-100 dark:bg-slate-700 h-1.5 rounded-full mt-2">
                            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${CURRENT_USER.skills.creativity}%` }}></div>
                        </div>
                    </div>
                </div>
                 <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-4 transition-colors duration-200">
                    <div className="bg-pink-100 dark:bg-pink-900/20 p-3 rounded-lg text-pink-600 dark:text-pink-400"><Code size={20} /></div>
                    <div className="w-full">
                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase font-semibold">Technical</p>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{CURRENT_USER.skills.technical}%</span>
                        </div>
                         <div className="w-full bg-gray-100 dark:bg-slate-700 h-1.5 rounded-full mt-2">
                            <div className="bg-pink-500 h-1.5 rounded-full" style={{ width: `${CURRENT_USER.skills.technical}%` }}></div>
                        </div>
                    </div>
                </div>
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
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase text-right">Credits Earned</th>
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