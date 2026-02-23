import React, { useEffect, useState } from 'react';
import { getLeaderboard, UserProfile } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { Trophy, Medal, Crown } from 'lucide-react';
import clsx from 'clsx';

const RankTable: React.FC = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard(20)
      .then(data => setLeaderboard(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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
          <div className="col-span-2 text-center">Role</div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-gray-400 dark:text-slate-500">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-3"></div>
            Loading leaderboard...
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="py-16 text-center text-gray-400 dark:text-slate-500">
            No students on the leaderboard yet. Be the first to earn credits!
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-slate-700/50">
            {leaderboard.map((profile, index) => {
              const rank = index + 1;
              const isMe = profile.id === user?.id;
              const initials = profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
              return (
                <div
                  key={profile.id}
                  className={clsx(
                    "grid grid-cols-12 items-center py-5 px-6 transition duration-200 border-l-4",
                    getRankRowStyle(rank),
                    isMe && "ring-2 ring-inset ring-indigo-400 dark:ring-indigo-500",
                    rank === 1 ? "border-l-yellow-400" : rank === 2 ? "border-l-gray-400" : rank === 3 ? "border-l-amber-600" : "border-l-transparent"
                  )}
                >
                  <div className="col-span-2 flex justify-center">
                    {getRankIcon(rank)}
                  </div>
                  <div className="col-span-5 flex items-center gap-4">
                    <div className="relative">
                      {profile.avatar ? (
                        <img src={profile.avatar} alt={profile.name} className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-indigo-600 border-2 border-white dark:border-slate-700 shadow-sm flex items-center justify-center text-white font-bold text-sm">
                          {initials}
                        </div>
                      )}
                      {rank === 1 && <div className="absolute -top-1 -right-1 bg-yellow-400 text-white p-0.5 rounded-full"><Crown size={10} /></div>}
                    </div>
                    <div>
                      <h3 className={clsx("font-bold text-lg", isMe ? "text-indigo-600 dark:text-indigo-400" : "text-gray-900 dark:text-white")}>
                        {profile.name} {isMe && <span className="text-sm font-normal">(You)</span>}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-slate-400 font-medium capitalize">{profile.role?.toLowerCase() || 'Student'}</p>
                    </div>
                  </div>
                  <div className="col-span-3 text-right">
                    <span className="inline-block px-3 py-1 bg-gray-900 dark:bg-slate-900 text-white rounded-full font-bold shadow-sm">
                      {profile.totalCredits.toLocaleString()} pts
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
        )}
      </div>
    </div>
  );
};

export default RankTable;