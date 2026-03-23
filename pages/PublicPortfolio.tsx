import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, GraduationCap, Mail, User, ShieldCheck } from 'lucide-react';
import SkillRadar from '../components/SkillRadar';
import { getUserProfile, UserProfile } from '../services/userService';
import { getUserEvents } from '../services/eventService';
import { Event } from '../types';

const PublicPortfolio: React.FC = () => {
    const { uid } = useParams<{ uid: string }>();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStudentData = async () => {
            if (!uid) return;
            try {
                const userDoc = await getUserProfile(uid);
                setProfile(userDoc);
                
                if (userDoc) {
                    const latestEvents = await getUserEvents(uid);
                    setEvents(latestEvents.filter(e => e.status === 'Verified'));
                }
            } catch (error) {
                console.error("Error loading portfolio:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudentData();
    }, [uid]);

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-[#191A23] dark:border-white border-t-[#B9FF66] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
                <div className="bg-[#F3F3F3] dark:bg-[#1E293B] p-16 rounded-[40px] border border-[#191A23] dark:border-gray-700 shadow-[0_4px_0_0_#191A23] dark:shadow-[0_4px_0_0_#0F172A] max-w-lg">
                    <User size={64} className="mx-auto text-[#191A23] dark:text-gray-400 mb-6" />
                    <h1 className="text-4xl font-black text-[#191A23] dark:text-white mb-4">Profile Not Found</h1>
                    <p className="text-lg text-gray-700 dark:text-gray-300 font-medium mb-8">The portfolio you are looking for does not exist or is private.</p>
                    <Link to="/directory" className="inline-flex items-center gap-2 bg-[#B9FF66] text-[#191A23] px-8 py-4 rounded-[14px] font-bold text-lg hover:bg-[#a3e655] border border-[#191A23] transition-colors shadow-[0_4px_0_0_#191A23]">
                        <ChevronLeft size={20} /> Back to Directory
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-fade-in pb-16 selection:bg-[#B9FF66] selection:text-[#191A23]">
            
            <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-[#191A23] dark:border-gray-700 pt-8">
                <Link to="/directory" className="group flex items-center gap-2 text-[#191A23] dark:text-white hover:text-[#B9FF66] transition-colors font-bold text-lg">
                    <div className="w-10 h-10 rounded-full border-2 border-[#191A23] dark:border-gray-500 flex items-center justify-center group-hover:border-[#B9FF66] group-hover:bg-[#191A23] transition-all">
                        <ChevronLeft size={20} />
                    </div>
                    Back to Directory
                </Link>
                <div className="bg-[#B9FF66] text-[#191A23] px-4 py-2 rounded-xl font-black text-sm uppercase tracking-wider border border-[#191A23]">
                    Public Portfolio Views
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* Left Column: Profile Card */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-[#F3F3F3] dark:bg-[#1E293B] rounded-[40px] p-10 text-center border-2 border-[#191A23] dark:border-gray-700 shadow-[0_8px_0_0_#191A23] dark:shadow-[0_8px_0_0_#0F172A] relative overflow-hidden group">
                        
                        {/* Decorative Background Element */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-[#191A23] dark:bg-[#0B0F19] border-b-2 border-[#191A23] dark:border-gray-700"></div>
                        
                        <div className="w-32 h-32 mx-auto rounded-full border-4 border-[#B9FF66] bg-white dark:bg-slate-700 shadow-lg relative z-10 overflow-hidden flex items-center justify-center mb-6">
                             {profile.avatar ? (
                                <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User size={48} className="text-gray-400 dark:text-slate-500" />
                            )}
                        </div>
                        
                        <h2 className="text-3xl font-black text-[#191A23] dark:text-white relative z-10 mb-2">{profile.name}</h2>
                        
                        <div className="flex flex-col items-center gap-3 mt-6">
                            {profile.college && (
                                <span className="inline-flex items-center gap-2 text-base font-bold text-gray-800 dark:text-gray-200">
                                    <GraduationCap size={20} className="text-[#191A23] dark:text-gray-400" /> {profile.college}
                                </span>
                            )}
                            <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                                {profile.course && (
                                    <span className="inline-flex items-center text-sm font-black px-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-[#191A23] dark:text-white border-2 border-[#191A23] dark:border-gray-600">
                                        {profile.course}
                                    </span>
                                )}
                                {profile.year && (
                                    <span className="inline-flex items-center text-sm font-black px-4 py-2 rounded-xl bg-[#B9FF66] text-[#191A23] border-2 border-[#191A23]">
                                        Class of {profile.year}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t-2 border-[#191A23] dark:border-gray-700">
                            <a href={`mailto:${profile.email}`} className="w-full flex items-center justify-center gap-3 bg-[#191A23] dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-[#191A23] px-6 py-4 rounded-[14px] font-bold text-lg transition-colors shadow-[0_4px_0_0_#B9FF66] dark:shadow-[0_4px_0_0_#191A23]">
                                <Mail size={20} /> Contact Student
                            </a>
                        </div>
                    </div>

                    <div className="bg-[#B9FF66] dark:bg-[#B9FF66] rounded-[30px] p-8 border-2 border-[#191A23] flex justify-around shadow-[0_6px_0_0_#191A23]">
                         <div className="text-center">
                            <span className="block text-4xl font-black text-[#191A23]">{profile.totalCredits || 0}</span>
                            <span className="text-sm text-[#191A23] font-bold uppercase tracking-widest mt-1 block">Credits</span>
                        </div>
                        <div className="w-0.5 bg-[#191A23]"></div>
                        <div className="text-center">
                            <span className="block text-4xl font-black text-[#191A23]">#{profile.rank || '-'}</span>
                            <span className="text-sm text-[#191A23] font-bold uppercase tracking-widest mt-1 block">Global Rank</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Chart & Recent Events */}
                <div className="lg:col-span-2 space-y-10">
                    {/* The Radar Chart */}
                    <div className="bg-white dark:bg-[#1E293B] rounded-[40px] p-6 border-2 border-[#191A23] dark:border-gray-700 shadow-[0_8px_0_0_#191A23] dark:shadow-[0_8px_0_0_#0F172A]">
                        <div className="bg-[#F3F3F3] dark:bg-[#0B0F19] rounded-[30px] p-4 border border-[#191A23] dark:border-gray-700 shadow-inner">
                            {profile.skills && <SkillRadar skills={profile.skills} />}
                        </div>
                    </div>

                    {/* Event History */}
                    <div className="bg-white dark:bg-[#1E293B] rounded-[40px] border-2 border-[#191A23] dark:border-gray-700 shadow-[0_8px_0_0_#191A23] dark:shadow-[0_8px_0_0_#0F172A] overflow-hidden">
                        <div className="p-8 border-b-2 border-[#191A23] dark:border-gray-700 bg-[#F3F3F3] dark:bg-[#0B0F19] flex items-center justify-between">
                            <h3 className="text-2xl font-black text-[#191A23] dark:text-white flex items-center gap-3">
                                <ShieldCheck size={28} className="text-[#B9FF66] fill-[#191A23]" /> Verified Achievements
                            </h3>
                            <span className="bg-[#191A23] text-[#B9FF66] font-bold px-4 py-1.5 rounded-full text-sm">
                                {events.length} Total
                            </span>
                        </div>
                        
                        {events.length === 0 ? (
                            <div className="p-12 text-center text-gray-600 dark:text-gray-400 font-medium text-lg">
                                No public verified achievements found for this student.
                            </div>
                        ) : (
                            <div className="divide-y-2 divide-[#191A23] dark:divide-gray-700">
                                {events.map((event) => (
                                    <div key={event.id} className="p-8 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors group">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-[#191A23] dark:text-white text-xl mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{event.title}</h4>
                                            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                                                <span className="bg-[#F3F3F3] dark:bg-slate-900 border border-gray-300 dark:border-gray-600 px-3 py-1 rounded-lg">
                                                    {new Date(event.date).toLocaleDateString()}
                                                </span>
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#B9FF66]"></span>
                                                <span className="text-[#191A23] dark:text-gray-300 uppercase tracking-wider text-xs font-black">
                                                    {event.category}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right ml-6">
                                            <div className="bg-[#B9FF66] text-[#191A23] border-2 border-[#191A23] font-black px-5 py-2.5 rounded-xl text-lg shadow-[0_4px_0_0_#191A23]">
                                                +{event.credits} pts
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PublicPortfolio;
