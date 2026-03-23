import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Network, Activity, Database, Cpu, ChevronRight, Users, Mail, Globe, MapPin, CheckCircle2, ArrowUpRight, Plus, Minus, Facebook, Twitter, Linkedin, Sun, Moon } from 'lucide-react';

import { Logo } from '../components/Logo';
import { useTheme } from '../context/ThemeContext';

const Landing: React.FC = () => {
    const [openAccordion, setOpenAccordion] = useState<number | null>(0);
    const { theme, toggleTheme } = useTheme();

    const toggleAccordion = (index: number) => {
        setOpenAccordion(openAccordion === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-[#191A23] dark:text-white font-sans selection:bg-[#B9FF66] selection:text-[#191A23] overflow-x-hidden transition-colors duration-300">
            {/* Navigation */}
            <nav className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0B0F19] sticky top-0 z-50 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Logo className="w-10 h-10 text-[#191A23] dark:text-white" />
                        <span className="text-2xl font-black uppercase tracking-widest text-[#191A23] dark:text-white">SkillGrid</span>
                    </div>
                    {/* Desktop Links */}
                    <div className="hidden md:flex flex-1 justify-center items-center gap-8">
                        <Link to="/directory" className="text-base font-medium text-[#191A23] dark:text-[#B9FF66] hover:underline underline-offset-4 transition-colors">Student Directory</Link>
                        <Link to="/about" className="text-base font-medium text-[#191A23] dark:text-gray-300 hover:text-[#B9FF66] hover:underline underline-offset-4 transition-colors">About Us</Link>
                        <button onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} className="text-base font-medium text-[#191A23] dark:text-gray-300 hover:text-[#B9FF66] hover:underline underline-offset-4 transition-colors">Services</button>
                        <button onClick={() => document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' })} className="text-base font-medium text-[#191A23] dark:text-gray-300 hover:text-[#B9FF66] hover:underline underline-offset-4 transition-colors">Working Process</button>
                        <button onClick={() => document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' })} className="text-base font-medium text-[#191A23] dark:text-gray-300 hover:text-[#B9FF66] hover:underline underline-offset-4 transition-colors">Creator</button>
                        <Link to="/faculty/login" className="text-base font-medium text-[#191A23] dark:text-gray-300 hover:text-[#B9FF66] hover:underline underline-offset-4 transition-colors">Faculty</Link>
                    </div>
                    {/* Auth Button & Theme Toggle */}
                    <div className="hidden md:flex items-center gap-4">
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400">
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        <Link to="/login" className="text-base font-medium text-[#191A23] dark:text-white hover:opacity-75 transition">Log In</Link>
                        <Link to="/signup" className="text-base font-medium border border-[#191A23] dark:border-white text-[#191A23] dark:text-[#0B0F19] dark:bg-white px-6 py-3 rounded-xl hover:bg-[#191A23] hover:text-white dark:hover:bg-[#B9FF66] dark:hover:border-[#B9FF66] transition">
                            Request a demo
                        </Link>
                    </div>
                    
                    {/* Mobile Menu Button - Just placeholder for aesthetics */}
                    <div className="md:hidden flex items-center gap-4">
                       <button onClick={toggleTheme} className="text-gray-500 dark:text-gray-400">
                           {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                       </button>
                       <button className="text-[#191A23] dark:text-white">
                           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                       </button>
                    </div>
                </div>
            </nav>

            <main className="relative z-10">
                {/* Hero Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-16">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="max-w-xl">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight mb-8 text-[#191A23] dark:text-white">
                                Level Up Your Learning Journey.
                            </h1>
                            <p className="text-lg text-gray-700 dark:text-gray-300 mb-10 leading-relaxed font-medium">
                                SkillGrid transforms student development into an engaging, interactive experience. Track your progress, master new skills, and turn your educational goals into achievements.
                            </p>
                            <div className="flex flex-col sm:flex-row items-start gap-4">
                                <Link to="/signup" className="inline-block bg-[#191A23] dark:bg-[#B9FF66] text-white dark:text-[#191A23] px-8 py-5 rounded-[14px] font-medium text-lg hover:bg-gray-800 dark:hover:bg-[#a3e655] transition-colors shadow-lg">
                                    Get Started / Join the Grid
                                </Link>
                                <Link to="/directory" className="inline-block bg-white dark:bg-transparent text-[#191A23] dark:text-white border border-[#191A23] dark:border-gray-500 px-8 py-5 rounded-[14px] font-medium text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
                                    Browse Student Directory
                                </Link>
                            </div>
                        </div>
                        {/* Hero Illustration Abstract */}
                        <div className="relative h-[400px] flex items-center justify-center">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-[#191A23] dark:border-gray-700 rounded-full flex items-center justify-center">
                                <div className="w-64 h-64 border border-[#191A23] dark:border-gray-700 rounded-full rotate-45 flex items-center justify-center overflow-hidden">
                                     <div className="w-48 h-48 border border-[#191A23] dark:border-gray-700 rounded-full -rotate-45"></div>
                                </div>
                            </div>
                            {/* Abstract Shapes */}
                            <div className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full bg-[#191A23] dark:bg-white"></div>
                            <div className="absolute bottom-1/4 right-[20%] w-10 h-10 border-[6px] border-[#B9FF66] rotate-45"></div>
                            <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-[#B9FF66] rounded-full blur-[64px] opacity-60"></div>
                            
                            {/* Giant Megaphone / Speaker visual replacement with Icons */}
                            <div className="absolute z-10 w-48 h-48 bg-[#B9FF66] rounded-tl-[100px] rounded-br-[100px] rounded-bl-[20px] rounded-tr-[20px] border-4 border-[#191A23] flex items-center justify-center rotate-[-15deg]">
                                <Activity size={80} className="text-[#191A23]" />
                            </div>
                            <div className="absolute top-10 right-10 flex flex-col gap-4">
                                <div className="bg-[#191A23] w-12 h-12 rounded-full flex items-center justify-center">
                                    <div className="text-[#B9FF66] opacity-0 group-hover:opacity-100 transition-opacity"><ArrowUpRight size={24}/></div>
                                </div>
                                <div className="bg-[#191A23] w-12 h-12 rounded-full flex items-center justify-center">
                                   <Cpu className="text-white" size={24} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trusted By (Logos Strip) */}
                <div className="border-y border-gray-100 dark:border-gray-800 py-10 my-10 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 flex justify-between items-center opacity-70 grayscale dark:opacity-50">
                        {/* Simple text logos for placeholder */}
                        <span className="text-2xl font-bold font-serif italic dark:text-white">amazon</span>
                        <span className="text-2xl font-black tracking-tighter dark:text-white">dribbble</span>
                        <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">HubSpot</span>
                        <span className="text-2xl font-semibold flex items-center gap-1 dark:text-white"><div className="w-6 h-6 bg-black dark:bg-white rounded text-white dark:text-black flex items-center justify-center text-xs">N</div> Notion</span>
                        <span className="text-2xl font-black text-red-600 dark:text-red-500 tracking-widest">NETFLIX</span>
                        <span className="text-2xl font-bold text-blue-500 dark:text-blue-400">zoom</span>
                    </div>
                </div>

                {/* Services Section */}
                <div id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="flex flex-col md:flex-row items-baseline gap-6 mb-16 max-w-3xl">
                        <h2 className="text-4xl font-semibold bg-[#B9FF66] text-[#191A23] px-2 rounded-md inline-block">Learning Shouldn't Feel Like a Grind.</h2>
                        <p className="text-base text-gray-700 dark:text-gray-300 font-medium max-w-2xl">
                            Traditional education can sometimes lack the immediate feedback and motivation needed to stay on track. SkillGrid bridges that gap by bringing the engaging mechanics of gaming into your daily academic and personal development.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Service Card 1 (Light Grey) */}
                        <div className="bg-[#F3F3F3] dark:bg-[#1E293B] border border-[#191A23] dark:border-gray-700 rounded-[40px] p-10 flex flex-col md:flex-row shadow-[0_4px_0_0_#191A23] dark:shadow-[0_4px_0_0_#0F172A]">
                            <div className="flex-1 flex flex-col justify-between min-h-[180px]">
                                <div>
                                    <span className="inline-block text-2xl font-semibold bg-[#B9FF66] text-[#191A23] px-2 rounded">Interactive</span>
                                    <br/>
                                    <span className="inline-block text-2xl font-semibold bg-[#B9FF66] text-[#191A23] px-2 rounded mt-1">Skill Trees</span>
                                    <p className="mt-4 text-[#191A23] dark:text-gray-200 font-medium">
                                        Map out your educational path. Unlock new branches as you master foundational concepts and build a comprehensive portfolio of abilities.
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 mt-auto cursor-pointer group">
                                    <div className="w-10 h-10 rounded-full bg-[#191A23] dark:bg-white flex items-center justify-center text-[#B9FF66] dark:text-[#191A23] group-hover:bg-[#B9FF66] group-hover:text-[#191A23] transition-colors">
                                        <ArrowUpRight size={20} />
                                    </div>
                                    <span className="font-medium text-lg hidden md:inline text-[#191A23] dark:text-gray-200 group-hover:text-[#B9FF66] dark:group-hover:text-white transition-colors">Learn more</span>
                                </div>
                            </div>
                            <div className="flex-1 flex items-center justify-center mt-8 md:mt-0 relative">
                                <Database size={120} className="text-[#191A23] dark:text-white opacity-20 dark:opacity-10 absolute" />
                                <div className="border-4 border-[#191A23] dark:border-gray-600 bg-white dark:bg-slate-800 p-4 scale-75 rotate-[-5deg] rounded-xl relative z-10 shadow-lg">
                                    <div className="w-full flex items-center justify-between gap-10 mb-2 border-b-2 border-dashed border-gray-300 dark:border-gray-600 pb-2">
                                        <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                        <div className="h-2 w-8 bg-[#B9FF66] rounded"></div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-10 w-48 border-2 border-[#191A23] dark:border-gray-600 rounded flex items-center justify-end px-2"><Activity size={16} className="text-[#191A23] dark:text-white"/></div>
                                        <div className="h-6 w-32 bg-gray-100 dark:bg-gray-700 border border-[#191A23] dark:border-gray-600 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Service Card 2 (Lime Green) */}
                        <div className="bg-[#B9FF66] border border-[#191A23] dark:border-gray-700 rounded-[40px] p-10 flex flex-col md:flex-row shadow-[0_4px_0_0_#191A23] dark:shadow-[0_4px_0_0_#0F172A]">
                            <div className="flex-1 flex flex-col justify-between min-h-[180px]">
                                <div>
                                    <span className="inline-block text-2xl font-semibold bg-white text-[#191A23] px-2 rounded">XP & Achievement</span>
                                    <br/>
                                    <span className="inline-block text-2xl font-semibold bg-white text-[#191A23] px-2 rounded mt-1">Badges</span>
                                    <p className="mt-4 text-[#191A23] font-medium">
                                        Earn experience points for completing tasks, finishing projects, and hitting milestones. Showcase your dedication with unlockable badges.
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 mt-auto cursor-pointer group">
                                    <div className="w-10 h-10 rounded-full bg-[#191A23] flex items-center justify-center text-[#B9FF66] group-hover:bg-white group-hover:text-[#191A23] transition-colors border border-transparent group-hover:border-[#191A23]">
                                        <ArrowUpRight size={20} />
                                    </div>
                                    <span className="font-medium text-lg hidden md:inline text-[#191A23]">Learn more</span>
                                </div>
                            </div>
                            <div className="flex-1 flex items-center justify-center mt-8 md:mt-0 relative">
                                <Activity size={120} className="text-[#191A23] opacity-20 absolute" />
                                <div className="border-4 border-[#191A23] dark:border-gray-800 bg-white dark:bg-slate-100 p-4 scale-75 rotate-[5deg] rounded-xl relative z-10 shadow-lg">
                                    {/* Mock chart */}
                                    <div className="flex items-end gap-2 h-24 mb-4">
                                        <div className="w-6 h-12 bg-[#B9FF66] border-2 border-[#191A23] dark:border-gray-800 rounded-t-sm"></div>
                                        <div className="w-6 h-16 bg-[#191A23] dark:bg-gray-800 rounded-t-sm"></div>
                                        <div className="w-6 h-8 bg-gray-200 dark:bg-gray-300 border-2 border-[#191A23] dark:border-gray-800 rounded-t-sm"></div>
                                        <div className="w-6 h-20 bg-[#B9FF66] border-2 border-[#191A23] dark:border-gray-800 rounded-t-sm"></div>
                                        <div className="w-6 h-24 bg-[#191A23] dark:bg-gray-800 rounded-t-sm"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Service Card 3 (Dark Block) */}
                        <div className="bg-[#191A23] dark:bg-[#0F172A] border border-[#191A23] dark:border-gray-700 rounded-[40px] p-10 flex flex-col md:flex-row shadow-[0_4px_0_0_#B9FF66] dark:shadow-[0_4px_0_0_#a3e655]">
                            <div className="flex-1 flex flex-col justify-between min-h-[180px]">
                                <div>
                                    <span className="inline-block text-2xl font-semibold bg-white text-[#191A23] px-2 rounded">Dynamic Progress</span>
                                    <br/>
                                    <span className="inline-block text-2xl font-semibold bg-white text-[#191A23] px-2 rounded mt-1">Dashboards</span>
                                    <p className="mt-4 text-white dark:text-gray-300 font-medium">
                                        Visualize your growth with clean, real-time data. See exactly where you excel and where you need to focus your energy next.
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 mt-auto cursor-pointer group">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#191A23] group-hover:bg-[#B9FF66] border border-transparent transition-colors">
                                        <ArrowUpRight size={20} />
                                    </div>
                                    <span className="font-medium text-lg hidden md:inline text-white group-hover:text-[#B9FF66] transition-colors">Learn more</span>
                                </div>
                            </div>
                            <div className="flex-1 flex items-center justify-center mt-8 md:mt-0 relative">
                                <Network size={120} className="text-white opacity-10 absolute" />
                                <div className="border-4 border-white bg-[#191A23] dark:bg-[#0F172A] p-4 scale-75 rotate-[-5deg] rounded-xl relative z-10 shadow-[8px_8px_0_#B9FF66]">
                                    <div className="flex justify-center mb-6">
                                        <div className="w-12 h-12 rounded-full border-4 border-white flex items-center justify-center text-white"><Users size={20}/></div>
                                    </div>
                                    <div className="flex justify-between gap-12">
                                        <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-800"></div>
                                        <div className="w-10 h-10 rounded-full border-2 border-[#B9FF66] bg-[#B9FF66]"></div>
                                    </div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-white -z-10 border-dashed border-t-2 border-gray-600 bg-transparent"></div>
                                </div>
                            </div>
                        </div>

                        {/* Service Card 4 (Grey) */}
                        <div className="bg-[#F3F3F3] dark:bg-[#1E293B] border border-[#191A23] dark:border-gray-700 rounded-[40px] p-10 flex flex-col md:flex-row shadow-[0_4px_0_0_#191A23] dark:shadow-[0_4px_0_0_#0F172A]">
                            <div className="flex-1 flex flex-col justify-between min-h-[180px]">
                                <div>
                                    <span className="inline-block text-2xl font-semibold bg-[#B9FF66] text-[#191A23] px-2 rounded">Peer</span>
                                    <br/>
                                    <span className="inline-block text-2xl font-semibold bg-[#B9FF66] text-[#191A23] px-2 rounded mt-1">Leaderboards</span>
                                    <p className="mt-4 text-[#191A23] dark:text-gray-200 font-medium">
                                        Stay motivated through friendly competition. Compare your progress with peers and celebrate collective achievements.
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 mt-auto cursor-pointer group">
                                    <div className="w-10 h-10 rounded-full bg-[#191A23] dark:bg-white flex items-center justify-center text-[#B9FF66] dark:text-[#191A23] group-hover:bg-[#B9FF66] group-hover:text-[#191A23] transition-colors">
                                        <ArrowUpRight size={20} />
                                    </div>
                                    <span className="font-medium text-lg hidden md:inline text-[#191A23] dark:text-gray-200 group-hover:text-[#B9FF66] dark:group-hover:text-white transition-colors">Learn more</span>
                                </div>
                            </div>
                            <div className="flex-1 flex items-center justify-center mt-8 md:mt-0 relative">
                                <Database size={120} className="text-[#191A23] dark:text-white opacity-20 dark:opacity-10 absolute" />
                                <div className="border-4 border-[#191A23] dark:border-gray-600 bg-white dark:bg-slate-800 p-4 scale-[0.8] rotate-[8deg] rounded-xl relative z-10 shadow-lg space-y-3">
                                   <div className="w-32 h-6 border-2 border-[#191A23] dark:border-gray-600 rounded bg-[#B9FF66]"></div>
                                   <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                   <div className="w-40 h-16 border-2 border-[#191A23] dark:border-gray-600 rounded flex p-2 gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                                        <div className="space-y-1 pt-1">
                                            <div className="h-2 w-16 bg-gray-400 dark:bg-gray-500 rounded"></div>
                                            <div className="h-2 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                        </div>
                                   </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Let's make things happen CTA */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="bg-[#F3F3F3] dark:bg-[#1E293B] rounded-[40px] p-12 md:p-16 flex flex-col md:flex-row items-center justify-between relative overflow-hidden border border-transparent dark:border-gray-800">
                        <div className="z-10 max-w-lg mb-8 md:mb-0">
                            <h3 className="text-3xl font-semibold mb-6 dark:text-white">Ready to gamify your growth?</h3>
                            <p className="text-gray-700 dark:text-gray-300 text-lg mb-8">
                                Join the community of students building their futures, one level at a time.
                            </p>
                            <Link to="/signup" className="inline-block bg-[#191A23] dark:bg-[#B9FF66] text-white dark:text-[#191A23] px-8 py-4 rounded-xl font-medium text-lg hover:bg-gray-800 dark:hover:bg-[#a3e655] transition-colors shadow-lg">
                                Create Your Free Account
                            </Link>
                        </div>
                        <div className="relative w-64 h-64 z-0 hidden md:flex items-center justify-center">
                             {/* Abstract Geometric shapes */}
                             <div className="absolute w-40 h-40 border-[6px] border-[#191A23] dark:border-gray-600 rounded-full top-0 right-0"></div>
                             <div className="absolute w-32 h-32 bg-[#B9FF66] top-20 right-20 blur-sm"></div>
                             <div className="absolute w-24 h-24 border-[6px] border-[#191A23] dark:border-gray-600 rotate-45 bottom-0 right-10 flex items-center justify-center bg-white dark:bg-slate-800"><div className="w-6 h-6 bg-[#B9FF66] rounded-full"></div></div>
                        </div>
                    </div>
                </div>

                {/* Working Process */}
                <div id="process" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="flex flex-col md:flex-row items-baseline gap-6 mb-16 max-w-3xl">
                        <h2 className="text-4xl font-semibold bg-[#B9FF66] text-[#191A23] px-2 rounded-md inline-block">From Novice to Master in 3 Steps</h2>
                    </div>

                    <div className="space-y-6">
                        {[
                            { step: "01", title: "Build Your Profile", content: "Set your academic and personal development goals." },
                            { step: "02", title: "Complete Quests", content: "Take on daily challenges, assignments, and skill-building exercises." },
                            { step: "03", title: "Level Up", content: "Gain XP, unlock rewards, and watch your digital competency grid expand." },
                        ].map((item, idx) => (
                            <div 
                                key={idx} 
                                className={`border border-[#191A23] dark:border-gray-700 rounded-[40px] px-8 md:px-14 py-8 md:py-10 transition-colors shadow-[0_6px_0_0_#191A23] dark:shadow-[0_6px_0_0_#0F172A] ${openAccordion === idx ? 'bg-[#B9FF66] dark:bg-[#B9FF66]' : 'bg-[#F3F3F3] dark:bg-[#1E293B]'}`}
                            >
                                <div 
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={() => toggleAccordion(idx)}
                                >
                                    <div className="flex items-center gap-6">
                                        <span className={`text-4xl md:text-5xl font-semibold ${openAccordion === idx ? 'text-[#191A23]' : 'text-[#191A23] dark:text-white'}`}>{item.step}</span>
                                        <h3 className={`text-xl md:text-3xl font-semibold ${openAccordion === idx ? 'text-[#191A23]' : 'text-[#191A23] dark:text-white'}`}>{item.title}</h3>
                                    </div>
                                    <div className={`w-12 h-12 rounded-full border border-[#191A23] flex items-center justify-center shrink-0 ${openAccordion === idx ? 'bg-white text-[#191A23] dark:border-transparent' : 'bg-white dark:bg-slate-800 dark:border-gray-600 dark:text-white'}`}>
                                        {openAccordion === idx ? <Minus size={24} /> : <Plus size={24} />}
                                    </div>
                                </div>
                                
                                {openAccordion === idx && (
                                    <div className={`mt-8 pt-8 border-t text-lg font-medium ${openAccordion === idx ? 'border-[#191A23] text-gray-900' : 'border-[#191A23] dark:border-gray-600 text-gray-800 dark:text-gray-300'}`}>
                                        <p>{item.content}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team Section */}
                <div id="team" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="flex flex-col md:flex-row items-baseline gap-6 mb-16 max-w-3xl">
                        <h2 className="text-4xl font-semibold bg-[#B9FF66] text-[#191A23] px-2 rounded-md inline-block">Built by a Student, for Students.</h2>
                    </div>

                    <div className="max-w-3xl">
                        <div className="border border-[#191A23] dark:border-gray-700 rounded-[40px] p-8 md:p-12 shadow-[0_6px_0_0_#191A23] dark:shadow-[0_6px_0_0_#0F172A] bg-white dark:bg-[#1E293B] relative">
                            <a href="https://github.com/aravind" target="_blank" rel="noopener noreferrer" className="absolute top-10 right-10 text-[#B9FF66] w-12 h-12 rounded-full bg-[#191A23] dark:bg-white dark:text-[#191A23] flex items-center justify-center cursor-pointer hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-lg">
                                <Linkedin size={24} fill="currentColor" />
                            </a>
                            <div className="flex flex-col sm:flex-row gap-8 mb-8 pb-8 border-b border-[#191A23] dark:border-gray-700 items-start sm:items-center">
                                <div className="w-32 h-32 rounded-full border-4 border-[#191A23] dark:border-gray-700 overflow-hidden bg-[#B9FF66] shrink-0 relative flex items-center justify-center p-2 shadow-inner">
                                     <div className="w-full h-full bg-[#191A23] dark:bg-slate-800 rounded-full flex items-center justify-center text-white">
                                         <Users size={48} />
                                     </div>
                                </div>
                                <div>
                                    <h4 className="text-3xl font-bold text-[#191A23] dark:text-white mb-2">Aravind</h4>
                                    <p className="font-semibold text-gray-600 dark:text-gray-400 text-lg">Creator, SkillGrid</p>
                                </div>
                            </div>
                            <p className="text-gray-800 dark:text-gray-300 font-medium text-lg leading-relaxed mix-blend-multiply dark:mix-blend-normal">
                                As a Computer Science student, Aravind saw firsthand the need for a more engaging, interactive approach to academic and personal development. Combining a passion for innovative tech with a drive to help peers succeed, SkillGrid was born to turn the everyday educational grind into a rewarding, gamified journey.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact Us Form */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="flex flex-col md:flex-row items-baseline gap-6 mb-16 max-w-3xl">
                        <h2 className="text-4xl font-semibold bg-[#B9FF66] text-[#191A23] px-2 rounded-md inline-block">Contact Us</h2>
                        <p className="text-base text-gray-700 dark:text-gray-300 font-medium">
                            Connect with Us: Let's Discuss Your Institutional Needs
                        </p>
                    </div>

                    <div className="bg-[#F3F3F3] dark:bg-[#1E293B] rounded-[40px] overflow-hidden flex relative">
                        {/* Form area */}
                        <div className="w-full md:w-2/3 p-10 md:p-16 z-10 bg-transparent">
                            <div className="flex gap-8 mb-10">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <div className="w-6 h-6 rounded-full border border-[#191A23] dark:border-gray-500 flex items-center justify-center">
                                       <div className="w-3 h-3 bg-[#B9FF66] rounded-full"></div>
                                    </div>
                                    <span className="font-medium text-lg dark:text-white">Say Hi</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <div className="w-6 h-6 rounded-full border border-[#191A23] dark:border-gray-500 bg-white dark:bg-slate-800"></div>
                                    <span className="font-medium text-lg dark:text-white">Get a Quote</span>
                                </label>
                            </div>
                            
                            <form className="space-y-6">
                                <div>
                                    <label className="block text-base font-semibold mb-2 dark:text-gray-200">Name</label>
                                    <input type="text" placeholder="Name" className="w-full bg-white dark:bg-slate-900 border border-[#191A23] dark:border-gray-600 rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#B9FF66] transition-colors dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-base font-semibold mb-2 dark:text-gray-200">Email*</label>
                                    <input type="email" placeholder="Email" className="w-full bg-white dark:bg-slate-900 border border-[#191A23] dark:border-gray-600 rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#B9FF66] transition-colors dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-base font-semibold mb-2 dark:text-gray-200">Message*</label>
                                    <textarea placeholder="Message" rows={5} className="w-full bg-white dark:bg-slate-900 border border-[#191A23] dark:border-gray-600 rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#B9FF66] transition-colors resize-none dark:text-white"></textarea>
                                </div>
                                <button type="submit" className="w-full bg-[#191A23] dark:bg-[#B9FF66] text-white dark:text-[#191A23] py-5 rounded-[14px] font-medium text-lg hover:bg-gray-800 dark:hover:bg-[#a3e655] transition-colors mt-8">
                                    Send Message
                                </button>
                            </form>
                        </div>
                        {/* Illustration area */}
                        <div className="hidden md:flex w-1/3 absolute right-0 top-0 bottom-0 items-center justify-end pr-8 z-0 overflow-hidden">
                             <div className="relative w-80 h-80 opacity-40 mix-blend-multiply">
                                  {/* Just a sunburst/starburst abstract geometric styling */}
                                  <div className="absolute bg-[#191A23] w-2 h-40 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transform rotate-[15deg]"></div>
                                  <div className="absolute bg-[#191A23] w-2 h-40 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transform rotate-[45deg]"></div>
                                  <div className="absolute bg-[#191A23] w-2 h-40 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transform rotate-[75deg]"></div>
                                  <div className="absolute bg-[#191A23] w-2 h-40 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transform rotate-[105deg]"></div>
                                  <div className="absolute bg-[#191A23] w-2 h-40 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transform rotate-[135deg]"></div>
                                  <div className="absolute bg-[#191A23] w-2 h-40 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transform rotate-[165deg]"></div>
                                  <div className="absolute bg-[#B9FF66] w-64 h-64 rounded-full mix-blend-screen opacity-80 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[-1]"></div>
                             </div>
                        </div>
                    </div>
                </div>

            </main>

            {/* Footer */}
            <footer className="mt-10 px-4 sm:px-6 lg:px-8 pb-10">
                <div className="max-w-7xl mx-auto bg-[#191A23] rounded-t-[40px] rounded-b-[40px] px-10 md:px-16 pt-16 pb-12 shadow-2xl">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-16 border-b border-gray-700/50 pb-12 gap-8">
                        <div className="flex items-center gap-2">
                            <Cpu className="text-white" size={30} />
                            <span className="text-2xl font-bold tracking-tight text-white">SkillGrid</span>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-8">
                            <a href="#" className="text-white hover:text-[#B9FF66] transition-colors underline underline-offset-4">About Us</a>
                            <a href="#" className="text-white hover:text-[#B9FF66] transition-colors underline underline-offset-4">Contact</a>
                            <a href="#" className="text-white hover:text-[#B9FF66] transition-colors underline underline-offset-4">Privacy Policy</a>
                        </div>
                        <div className="flex items-center gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-[#B9FF66] transition-colors text-[#191A23]">
                                <Linkedin size={18} fill="currentColor" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-[#B9FF66] transition-colors text-[#191A23]">
                                <Facebook size={18} fill="currentColor" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-[#B9FF66] transition-colors text-[#191A23]">
                                <Twitter size={18} fill="currentColor" />
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between gap-12 items-start mb-16">
                        <div className="space-y-6">
                            <h4 className="inline-block bg-[#B9FF66] text-[#191A23] px-2 rounded font-semibold text-xl">Contact us:</h4>
                            <div className="space-y-4 text-white font-light text-lg">
                                <p>Email: info@skillgrid.net</p>
                                <p>Phone: 555-567-8901</p>
                                <p>Address: 1234 Tech Blvd<br/>Silicon Valley, CA 94025</p>
                            </div>
                        </div>

                        <div className="bg-[#292A32] rounded-[18px] p-10 flex flex-col sm:flex-row gap-4 flex-1 max-w-xl">
                            <input 
                                type="email" 
                                placeholder="Email" 
                                className="bg-transparent border border-white rounded-xl px-6 py-4 text-white focus:outline-none focus:border-[#B9FF66] flex-1"
                            />
                            <button className="bg-[#B9FF66] text-[#191A23] font-semibold px-8 py-4 rounded-xl hover:bg-white transition-colors">
                                Subscribe to news
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-gray-700/50 pt-8 flex flex-col sm:flex-row gap-4 items-center">
                        <p className="text-gray-400 font-light">&copy; 2026 SkillGrid. All Rights Reserved.</p>
                        <a href="#" className="text-gray-400 hover:text-white underline font-light underline-offset-4">Privacy Policy</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
