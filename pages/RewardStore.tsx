import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { getAllRewards } from '../services/facultyService';
import { Reward } from '../types';
import { ShoppingBag, Star } from 'lucide-react';

const RewardStore: React.FC = () => {
    const { userProfile } = useUser();
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllRewards()
            .then(setRewards)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const credits = userProfile?.totalCredits ?? 0;

    return (
        <div className="space-y-8 pb-12">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl p-8 text-white shadow-lg flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Reward Store</h1>
                    <p className="text-pink-100">Exchange your hard-earned credits for exclusive perks.</p>
                </div>
                <div className="text-right bg-white/20 backdrop-blur-md p-4 rounded-xl border border-white/30">
                    <p className="text-sm font-medium text-pink-50">Your Balance</p>
                    <p className="text-3xl font-black">{credits.toLocaleString()}</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-16">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500"></div>
                </div>
            ) : rewards.length === 0 ? (
                <div className="text-center py-16 text-gray-400 dark:text-slate-500">
                    <ShoppingBag size={48} className="mx-auto mb-4 opacity-30" />
                    <p>No rewards available yet. Check back soon!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {rewards.map(reward => (
                        <div key={reward.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden flex flex-col group hover:shadow-xl transition duration-300">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={reward.image || `https://picsum.photos/seed/${reward.id}/300/300`}
                                    alt={reward.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                />
                                <span className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-gray-900 dark:text-white text-xs font-bold px-2 py-1 rounded-md">
                                    {reward.category}
                                </span>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{reward.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-slate-400 mb-4 line-clamp-2 flex-1">{reward.description}</p>
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="text-lg font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                                        <Star size={16} fill="currentColor" />
                                        {reward.cost}
                                    </div>
                                    <button
                                        disabled={credits < reward.cost}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition ${credits >= reward.cost
                                                ? 'bg-gray-900 dark:bg-indigo-600 text-white hover:bg-gray-800 dark:hover:bg-indigo-500'
                                                : 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed'
                                            }`}
                                    >
                                        Redeem
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RewardStore;