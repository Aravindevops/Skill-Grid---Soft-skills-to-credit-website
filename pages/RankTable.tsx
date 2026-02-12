import React from 'react';
import { LEADERBOARD_DATA } from '../constants';
import { Trophy, Medal, Crown } from 'lucide-react';
import clsx from 'clsx';

const RankTable: React.FC = () => {
  // Sort just in case data isn't sorted
  const sortedUsers = [...LEADERBOARD_DATA].sort((a, b) => b.totalCredits - a.totalCredits);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown size={24} className="text-yellow-500 fill-yellow-500" />;
      case 2: return <Medal size={24} className="text-gray-400 fill-gray-400" />;
      case 3: return <Medal size={24} className="text-amber-700 fill-amber-700" />;
      default: return <span className="font-bold text-gray-500 dark:text-slate-400 text-lg">#{rank}</span>;
    }
  };

  const getRankRowStyle = (rank: number) => {
      if (rank === 1) return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-900/30";
      if (rank === 2) return "bg-gray-50 dark:bg-slate-700/50 border-gray-100 dark:border-slate-600";
      if (rank === 3) return "bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-900/30";
      return "bg-white dark:bg-slate-800 border-gray-50 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/80";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-4 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-2">
            <Trophy size={40} className="text-amber-600 dark:text-amber-500" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Student Leaderboard</h1>
        <p className="text-lg text-gray-600 dark:text-slate-400">Top performers across all academic categories.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-slate-700 transition-colors duration-200">
        <div className="grid grid-cols-12 bg-gray-900 dark:bg-black text-white py-4 px-6 text-sm font-semibold uppercase tracking-wider">
            <div className="col-span-2 text-center">Rank</div>
            <div className="col-span-5">Student</div>
            <div className="col-span-3 text-right">Total Credits</div>
            <div className="col-span-2 text-center">Badges</div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-slate-700/50">
            {sortedUsers.map((user, index) => {
                const rank = index + 1;
                return (
                    <div 
                        key={user.id} 
                        className={clsx(
                            "grid grid-cols-12 items-center py-5 px-6 transition duration-200 border-l-4",
                            getRankRowStyle(rank),
                            rank === 1 ? "border-l-yellow-400" : rank === 2 ? "border-l-gray-400" : rank === 3 ? "border-l-amber-600" : "border-l-transparent"
                        )}
                    >
                        <div className="col-span-2 flex justify-center">
                            {getRankIcon(rank)}
                        </div>
                        <div className="col-span-5 flex items-center gap-4">
                            <div className="relative">
                                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm" />
                                {rank === 1 && <div className="absolute -top-1 -right-1 bg-yellow-400 text-white p-0.5 rounded-full"><Crown size={10} /></div>}
                            </div>
                            <div>
                                <h3 className={clsx("font-bold text-lg", user.id === 'u1' ? "text-indigo-600 dark:text-indigo-400" : "text-gray-900 dark:text-white")}>
                                    {user.name} {user.id === 'u1' && "(You)"}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Computer Science</p>
                            </div>
                        </div>
                        <div className="col-span-3 text-right">
                             <span className="inline-block px-3 py-1 bg-gray-900 dark:bg-slate-900 text-white rounded-full font-bold shadow-sm">
                                {user.totalCredits.toLocaleString()} pts
                             </span>
                        </div>
                        <div className="col-span-2 flex justify-center gap-1">
                             <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-300 text-[10px] font-bold ring-1 ring-blue-200 dark:ring-blue-700" title="Leadership">L</div>
                             <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-300 text-[10px] font-bold ring-1 ring-purple-200 dark:ring-purple-700" title="Innovation">I</div>
                             <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-600 dark:text-green-300 text-[10px] font-bold ring-1 ring-green-200 dark:ring-green-700" title="Teamwork">T</div>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default RankTable;