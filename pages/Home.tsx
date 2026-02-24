import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { getUserEvents, getAllEvents, registerForEvent } from '../services/eventService';
import { getAllRewards } from '../services/facultyService';
import { Event, Reward } from '../types';
import { Calendar, CheckCircle, ArrowRight, Activity, Award, Loader2 } from 'lucide-react';

const Home: React.FC = () => {
  const { userProfile, isLoadingProfile } = useUser();
  const { user } = useAuth();
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [globalEvents, setGlobalEvents] = useState<Event[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [registering, setRegistering] = useState<string | null>(null);
  const upcomingEvents = globalEvents.filter(e => e.status === 'Upcoming');

  useEffect(() => {
    getAllEvents().then(setGlobalEvents).catch(console.error);
    getAllRewards().then(setRewards).catch(console.error);
    if (!user?.id) return;
    getUserEvents(user.id).then(setUserEvents).catch(console.error);
  }, [user?.id]);

  const handleRegister = async (event: Event) => {
    if (!user?.id) return;
    setRegistering(event.id);
    try {
      await registerForEvent(user.id, event);
      // Immediately reflect it in the UI as pending verification
      setUserEvents(prev => [{ ...event, status: 'Upcoming' }, ...prev]);
      alert(`Successfully registered for ${event.title}! Waiting for faculty verification.`);
    } catch (error) {
      console.error('Error registering:', error);
      alert('Failed to register for event.');
    } finally {
      setRegistering(null);
    }
  };

  const completedCount = userEvents.filter(e => e.status === 'Verified' || e.status === 'Completed').length;

  if (isLoadingProfile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const displayName = userProfile?.name || user?.name || 'Student';
  const totalCredits = userProfile?.totalCredits ?? 0;
  const rank = userProfile?.rank ?? 0;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome Hero */}
      <section className="bg-indigo-700 dark:bg-indigo-900 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-400 opacity-10 rounded-full -ml-10 -mb-10 blur-2xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Welcome back, {displayName}!
            </h1>
            <p className="text-indigo-100 text-lg max-w-2xl mb-8">
              {rank > 0
                ? <>You are currently ranked <span className="font-bold text-amber-300">#{rank}</span> on the leaderboard. Keep participating in events to boost your scores!</>
                : 'Start participating in events to earn credits and climb the leaderboard!'}
            </p>
            <div className="flex gap-4">
              <Link to="/portfolio" className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-gray-50 transition">
                View Portfolio
              </Link>
              <Link to="/rewards" className="bg-indigo-600 border border-indigo-400 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-500 transition">
                Spend Credits
              </Link>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 min-w-[200px] text-center">
            <p className="text-sm font-medium text-indigo-200 mb-1">Total Credits</p>
            <div className="text-5xl font-black tracking-tight">{totalCredits.toLocaleString()}</div>
            <div className="text-xs text-indigo-200 mt-2 flex items-center justify-center gap-1">
              <Activity size={12} />
              <span>{completedCount} events completed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Col - Stats & Quick Actions */}
        <div className="lg:col-span-2 space-y-8">

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-start gap-4 hover:shadow-md transition duration-200">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-xl text-emerald-600 dark:text-emerald-400">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-gray-500 dark:text-slate-400 text-sm font-medium">Events Completed</h3>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{completedCount}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-start gap-4 hover:shadow-md transition duration-200">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl text-blue-600 dark:text-blue-400">
                <Award size={24} />
              </div>
              <div>
                <h3 className="text-gray-500 dark:text-slate-400 text-sm font-medium">Current Rank</h3>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{rank > 0 ? `#${rank}` : '—'}</p>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors duration-200">
            <div className="p-6 border-b border-gray-50 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Upcoming Campus Events</h2>
              <button className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">View All</button>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-slate-700">
              {upcomingEvents.map(event => (
                <div key={event.id} className="p-6 flex flex-col md:flex-row gap-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition group">
                  <div className="w-full md:w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="inline-block px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-md mb-2">
                          {event.category}
                        </span>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">{event.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 line-clamp-2">{event.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="block text-xl font-bold text-amber-500">+{event.credits} pts</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-400 dark:text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(event.date).toLocaleDateString()}
                      </div>

                      {/* Check if user already registered */}
                      {userEvents.some(ue => ue.id === event.id) ? (
                        <div className="ml-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 text-sm font-bold border border-emerald-200 dark:border-emerald-800/30">
                          <CheckCircle size={14} /> Registered & Pending
                        </div>
                      ) : (
                        <button
                          onClick={() => handleRegister(event)}
                          disabled={registering === event.id}
                          className="ml-auto flex items-center gap-1.5 text-white font-bold bg-indigo-600 hover:bg-indigo-500 px-4 py-1.5 rounded-lg transition disabled:opacity-50 shadow-md shadow-indigo-600/20"
                        >
                          {registering === event.id ? <Loader2 size={14} className="animate-spin" /> : 'Register'} <ArrowRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 text-white shadow-lg border dark:border-slate-700">
            <h3 className="font-bold text-lg mb-4">My Skills Overview</h3>
            {userProfile?.skills ? (
              <ul className="space-y-3">
                {Object.entries(userProfile.skills).map(([skill, value]) => (
                  <li key={skill}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize text-gray-300">{skill}</span>
                      <span className="font-bold text-white">{value}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-indigo-400 h-1.5 rounded-full transition-all duration-700"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-sm">Complete events to earn skill points!</p>
            )}
          </div>

          {/* Mini Store Preview */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 dark:text-white">Rewards</h3>
              <Link to="/rewards" className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">See All</Link>
            </div>
            <div className="space-y-4">
              {rewards.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-slate-400">Loading rewards...</p>
              ) : (
                rewards.slice(0, 3).map(reward => (
                  <div key={reward.id} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={reward.image || `https://picsum.photos/seed/${reward.id}/100`} alt={reward.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 dark:text-slate-100 line-clamp-1">{reward.name}</p>
                      <p className="text-xs text-amber-500 font-bold">{reward.cost} Credits</p>
                    </div>
                    <Link to="/rewards" className="ml-auto text-xs bg-gray-900 dark:bg-slate-700 text-white dark:text-slate-200 px-3 py-1.5 rounded-lg hover:bg-gray-800 dark:hover:bg-slate-600 transition">View</Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;