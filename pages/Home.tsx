import React from 'react';
import { Link } from 'react-router-dom';
import { CURRENT_USER, EVENTS } from '../constants';
import { Calendar, CheckCircle, ArrowRight, Activity, Award } from 'lucide-react';

const Home: React.FC = () => {
  const upcomingEvents = EVENTS.filter(e => e.status === 'Upcoming');

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome Hero */}
      <section className="bg-indigo-700 dark:bg-indigo-900 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-400 opacity-10 rounded-full -ml-10 -mb-10 blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Welcome back, {CURRENT_USER.name}!
            </h1>
            <p className="text-indigo-100 text-lg max-w-2xl mb-8">
              You are currently ranked <span className="font-bold text-amber-300">#{CURRENT_USER.rank}</span> on the leaderboard. 
              Keep participating in events to boost your Leadership and Technical scores.
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
            <div className="text-5xl font-black tracking-tight">{CURRENT_USER.totalCredits}</div>
            <div className="text-xs text-indigo-200 mt-2 flex items-center justify-center gap-1">
              <Activity size={12} />
              <span>+150 this month</span>
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
                <p className="text-2xl font-bold text-gray-800 dark:text-white">12</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-start gap-4 hover:shadow-md transition duration-200">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl text-blue-600 dark:text-blue-400">
                <Award size={24} />
              </div>
              <div>
                <h3 className="text-gray-500 dark:text-slate-400 text-sm font-medium">Badges Earned</h3>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">5</p>
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
                      <button className="ml-auto flex items-center gap-1 text-gray-900 dark:text-slate-200 font-medium border border-gray-300 dark:border-slate-600 px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition">
                        Register <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col - Notifications/Updates */}
        <div className="space-y-6">
           <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 text-white shadow-lg border dark:border-slate-700">
             <h3 className="font-bold text-lg mb-4">Faculty Updates</h3>
             <ul className="space-y-4">
               <li className="flex gap-3 text-sm">
                 <div className="w-2 h-2 mt-1.5 rounded-full bg-green-400 flex-shrink-0"></div>
                 <p className="text-gray-300">Prof. Dumbledore validated your participation in "Advanced Alchemy". <span className="text-green-400 font-bold">+50 pts</span></p>
               </li>
               <li className="flex gap-3 text-sm">
                 <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-400 flex-shrink-0"></div>
                 <p className="text-gray-300">New Hackathon announced! Check out "Codefest 2024".</p>
               </li>
               <li className="flex gap-3 text-sm">
                 <div className="w-2 h-2 mt-1.5 rounded-full bg-amber-400 flex-shrink-0"></div>
                 <p className="text-gray-300">Your Leadership score is in the top 10% of students!</p>
               </li>
             </ul>
           </div>
           
           {/* Mini Store Preview */}
           <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors duration-200">
             <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-gray-800 dark:text-white">Rewards</h3>
                 <Link to="/rewards" className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">See All</Link>
             </div>
             <div className="space-y-4">
                 <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                         <img src="https://picsum.photos/id/18/100/100" className="w-full h-full object-cover" />
                     </div>
                     <div>
                         <p className="text-sm font-bold text-gray-800 dark:text-slate-100">Uni Hoodie</p>
                         <p className="text-xs text-gray-500 dark:text-slate-400">500 Credits</p>
                     </div>
                     <button className="ml-auto text-xs bg-gray-900 dark:bg-slate-700 text-white dark:text-slate-200 px-3 py-1.5 rounded-lg hover:bg-gray-800 dark:hover:bg-slate-600 transition">View</button>
                 </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Home;