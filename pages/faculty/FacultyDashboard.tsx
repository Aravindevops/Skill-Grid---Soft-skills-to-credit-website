import React, { useEffect, useState, useCallback } from 'react';
import FacultyNavbar, { FacultyTab } from '../../components/FacultyNavbar';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile, getAllStudents, UserProfile } from '../../services/userService';
import {
    getAllEvents, postEvent, deleteEvent,
    getAllRewards, addReward, deleteReward,
    getStudentEvents, verifyStudentEvent, rejectStudentEvent,
    uploadImage, StudentEvent
} from '../../services/facultyService';
import { getLeaderboard } from '../../services/userService';
import { Event, Reward } from '../../types';
import {
    Users, CalendarDays, ShoppingBag, Trophy,
    CheckCircle2, XCircle, Plus, Trash2,
    ChevronDown, ChevronUp, Crown, Medal, Loader2,
    Clock, History, Layers, PlusSquare
} from 'lucide-react';

const SKILL_OPTIONS = ['leadership', 'creativity', 'teamwork', 'technical', 'communication'] as const;

type StudentEventWithMeta = StudentEvent & { studentName: string };

const FacultyDashboard: React.FC = () => {
    const { user } = useAuth();
    const [facultyName, setFacultyName] = useState('Faculty');
    const [activeTab, setActiveTab] = useState<FacultyTab>('verifications');

    // Students
    const [students, setStudents] = useState<UserProfile[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(true);

    // Events (Global)
    const [events, setEvents] = useState<Event[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(false);

    // Create Event Form
    const [newEvent, setNewEvent] = useState({
        title: '', date: '', category: 'Workshop', credits: 100, description: '',
        skills: { leadership: 20, creativity: 20, teamwork: 20, technical: 20, communication: 20 }
    });
    const [newEventImage, setNewEventImage] = useState<File | null>(null);
    const [postingEvent, setPostingEvent] = useState(false);

    // Rewards
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [loadingRewards, setLoadingRewards] = useState(false);
    const [newReward, setNewReward] = useState({ name: '', cost: 100, category: 'Merch', description: '' });
    const [newRewardImage, setNewRewardImage] = useState<File | null>(null);
    const [addingReward, setAddingReward] = useState(false);

    // Leaderboard
    const [leaderboard, setLeaderboard] = useState<UserProfile[]>([]);
    const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

    // Verifications
    const [allStudentEvents, setAllStudentEvents] = useState<StudentEventWithMeta[]>([]);
    const [loadingVerifications, setLoadingVerifications] = useState(false);
    const [verifyingId, setVerifyingId] = useState<string | null>(null);
    const [selectedSkillForVerify, setSelectedSkillForVerify] = useState<Record<string, typeof SKILL_OPTIONS[number]>>({});

    useEffect(() => {
        if (user?.id) {
            getUserProfile(user.id).then(p => { if (p) setFacultyName(p.name); });
            getAllStudents().then(data => { setStudents(data); setLoadingStudents(false); });
        }
    }, [user?.id]);

    const loadVerifications = useCallback(async () => {
        setLoadingVerifications(true);
        try {
            let currentStudents = students;
            if (currentStudents.length === 0) {
                currentStudents = await getAllStudents();
                setStudents(currentStudents);
                setLoadingStudents(false);
            }

            if (currentStudents.length > 0) {
                const results = await Promise.all(
                    currentStudents.map(s => getStudentEvents(s.id).then(evs => evs.map(e => ({ ...e, studentUid: s.id, studentName: s.name }))))
                );
                setAllStudentEvents(results.flat().sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()));
            }
        } catch (error) {
            console.error(error);
        }
        setLoadingVerifications(false);
    }, [students]);

    const fetchRewards = useCallback(async () => {
        setLoadingRewards(true);
        const data = await getAllRewards();
        setRewards(data);
        setLoadingRewards(false);
    }, []);

    useEffect(() => {
        if (activeTab === 'verifications') loadVerifications();
        if (activeTab === 'leaderboard' && leaderboard.length === 0) {
            setLoadingLeaderboard(true);
            getLeaderboard(20).then(data => { setLeaderboard(data); setLoadingLeaderboard(false); });
        }
        if (activeTab === 'dashboard' || activeTab === 'rewards') {
            if (events.length === 0 && activeTab === 'dashboard') {
                setLoadingEvents(true);
                getAllEvents().then(data => { setEvents(data); setLoadingEvents(false); });
            }
            if (rewards.length === 0) {
                fetchRewards();
            }
        }
    }, [activeTab, loadVerifications, leaderboard.length, events.length, rewards.length, fetchRewards]);

    const handlePostEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        const sumSkills = Object.values(newEvent.skills).reduce((a: number, b: number) => a + b, 0);
        if (sumSkills !== Number(newEvent.credits)) {
            alert('Skill points split must exactly match total credits.');
            return;
        }

        setPostingEvent(true);
        try {
            let imageUrl = `https://picsum.photos/seed/${newEvent.title}/600/400`; // fallback
            if (newEventImage) {
                const path = `events/${Date.now()}_${newEventImage.name}`;
                imageUrl = await uploadImage(newEventImage, path);
            }

            await postEvent({
                ...newEvent,
                status: 'Upcoming',
                credits: Number(newEvent.credits),
                image: imageUrl
            } as unknown as Omit<Event, 'id'>);

            setNewEvent({
                title: '', date: '', category: 'Workshop', credits: 100, description: '',
                skills: { leadership: 20, creativity: 20, teamwork: 20, technical: 20, communication: 20 }
            });
            setNewEventImage(null);
            setActiveTab('dashboard'); // Redirect to dashboard to see it
        } catch (error: any) {
            console.error('Error posting event:', error);
            alert(error.message || 'Failed to post event. Check if Firebase Storage is enabled in your console.');
        } finally {
            setPostingEvent(false);
        }
    };

    const handleVerify = async (ev: StudentEventWithMeta) => {
        const skill = selectedSkillForVerify[ev.id] || 'teamwork';
        setVerifyingId(ev.id);
        await verifyStudentEvent(ev.studentUid, ev.id, ev.credits, skill);
        setAllStudentEvents(prev => prev.map(e => e.id === ev.id ? { ...e, status: 'Verified' } : e));
        setVerifyingId(null);
    };

    const handleReject = async (ev: StudentEventWithMeta) => {
        setVerifyingId(ev.id);
        await rejectStudentEvent(ev.studentUid, ev.id);
        setAllStudentEvents(prev => prev.filter(e => e.id !== ev.id));
        setVerifyingId(null);
    };

    const handleDeleteEvent = async (id: string) => {
        await deleteEvent(id);
        setEvents(prev => prev.filter(e => e.id !== id));
    };

    const handleAddReward = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddingReward(true);
        try {
            let imageUrl = '';
            if (newRewardImage) {
                const path = `rewards/${Date.now()}_${newRewardImage.name}`;
                imageUrl = await uploadImage(newRewardImage, path);
            }

            await addReward({ ...newReward, image: imageUrl });
            setNewReward({ name: '', cost: 100, category: 'Merch', description: '' });
            setNewRewardImage(null);
            fetchRewards(); // Refresh list
            alert('Reward added successfully!');
        } catch (error: any) {
            console.error('Error adding reward:', error);
            alert(error.message || 'Failed to add reward. Check if Firebase Storage is enabled.');
        } finally {
            setAddingReward(false);
        }
    };

    const handleDeleteReward = async (rewardId: string) => {
        if (!confirm('Are you sure you want to delete this reward?')) return;

        try {
            await deleteReward(rewardId);
            fetchRewards(); // Refresh list
        } catch (error) {
            console.error('Error deleting reward:', error);
            alert('Failed to delete reward.');
        }
    };

    const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-700 bg-[#161B28] text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm";
    const labelClass = "block text-xs font-bold text-slate-400 mb-2";

    const pointsUsed = Object.values(newEvent.skills).reduce((a: number, b: number) => a + b, 0);
    const totalPoints = Number(newEvent.credits) || 0;
    const isSplitValid = pointsUsed === totalPoints;

    const pendingApprovals = allStudentEvents.filter(e => e.status !== 'Verified');
    const historyEvents = allStudentEvents.filter(e => e.status === 'Verified');

    return (
        <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans">
            <FacultyNavbar facultyName={facultyName} activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

                {/* ── VERIFICATIONS TAB ── */}
                {activeTab === 'verifications' && (
                    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
                        <div>
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">Verification Requests</h2>
                            <p className="text-slate-400 mt-2 text-lg">Approve or reject student participation claims.</p>
                        </div>

                        {loadingStudents || loadingVerifications ? (
                            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-500" size={40} /></div>
                        ) : (
                            <>
                                {/* Pending */}
                                <div className="bg-[#1C2130] border border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
                                    <div className="px-6 py-5 border-b border-slate-800 flex items-center gap-3 bg-[#22283A]/50">
                                        <Clock size={22} className="text-amber-400" />
                                        <h3 className="font-bold text-white text-lg">Pending Approvals ({pendingApprovals.length})</h3>
                                    </div>

                                    {pendingApprovals.length === 0 ? (
                                        <div className="p-12 flex items-center justify-center">
                                            <span className="text-slate-500 text-lg">No pending requests. Great job!</span>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-slate-800/50">
                                            {pendingApprovals.map(ev => (
                                                <div key={ev.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#22283A]/30 transition">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <span className="font-bold text-white text-lg">{ev.title}</span>
                                                            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">{ev.category}</span>
                                                        </div>
                                                        <p className="text-slate-400 text-sm mb-3">Submitted by <span className="text-slate-300 font-semibold">{ev.studentName}</span></p>
                                                        <div className="flex items-center gap-3">
                                                            <label className="text-xs font-bold text-slate-500">Boost Skill:</label>
                                                            <select
                                                                value={selectedSkillForVerify[ev.id] || 'teamwork'}
                                                                onChange={e => setSelectedSkillForVerify(prev => ({ ...prev, [ev.id]: e.target.value as any }))}
                                                                className="text-xs border border-slate-700 bg-[#161B28] text-white rounded-lg px-2 html py-1.5 focus:ring-1 focus:ring-indigo-500 outline-none"
                                                            >
                                                                {SKILL_OPTIONS.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                                                            </select>
                                                            <span className="text-sm font-bold text-amber-500">+{ev.credits} pts</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => handleReject(ev)}
                                                            disabled={verifyingId === ev.id}
                                                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition disabled:opacity-50"
                                                        >
                                                            <XCircle size={18} /> Reject
                                                        </button>
                                                        <button
                                                            onClick={() => handleVerify(ev)}
                                                            disabled={verifyingId === ev.id}
                                                            className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition disabled:opacity-50"
                                                        >
                                                            {verifyingId === ev.id ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />} Verify
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* History */}
                                <div className="bg-[#1C2130] border border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
                                    <div className="px-6 py-5 border-b border-slate-800 flex items-center gap-3 bg-[#22283A]/50">
                                        <History size={22} className="text-slate-400" />
                                        <h3 className="font-bold text-white text-lg">History</h3>
                                    </div>

                                    {historyEvents.length === 0 ? (
                                        <div className="p-12 flex items-center justify-center">
                                            <span className="text-slate-500 text-lg">No history yet.</span>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-slate-800/50">
                                            {historyEvents.map(ev => (
                                                <div key={ev.id} className="p-5 flex items-center justify-between gap-4">
                                                    <div>
                                                        <p className="font-bold text-white">{ev.title}</p>
                                                        <p className="text-xs text-slate-500 mt-1">{ev.studentName} • {ev.category}</p>
                                                    </div>
                                                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">Verified</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* ── CREATE EVENT TAB ── */}
                {activeTab === 'create_event' && (
                    <div className="animate-in fade-in duration-500 max-w-4xl">
                        <div className="mb-8">
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">Create New Event</h2>
                            <p className="text-slate-400 mt-2 text-lg">Define event details and skill credit distribution.</p>
                        </div>

                        <form onSubmit={handlePostEvent} className="bg-[#1C2130] border border-slate-800 rounded-2xl p-6 md:p-10 shadow-xl shadow-black/20">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className={labelClass}>Event Title</label>
                                    <input type="text" required value={newEvent.title} onChange={e => setNewEvent(p => ({ ...p, title: e.target.value }))} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Date</label>
                                    <div className="relative">
                                        <input type="date" required value={newEvent.date} onChange={e => setNewEvent(p => ({ ...p, date: e.target.value }))} className={`${inputClass} select-none`} style={{ colorScheme: 'dark' }} />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className={labelClass}>Description</label>
                                <textarea required rows={3} value={newEvent.description} onChange={e => setNewEvent(p => ({ ...p, description: e.target.value }))} className={`${inputClass} resize-none`} />
                            </div>

                            <div className="mb-6">
                                <label className={labelClass}>Event Image</label>
                                <input type="file" accept="image/*" onChange={e => setNewEventImage(e.target.files?.[0] || null)} className={`${inputClass} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-slate-800 dark:file:text-slate-300 dark:hover:file:bg-slate-700 cursor-pointer`} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                <div>
                                    <label className={labelClass}>Category</label>
                                    <select value={newEvent.category} onChange={e => setNewEvent(p => ({ ...p, category: e.target.value }))} className={inputClass}>
                                        {['Workshop', 'Seminar', 'Hackathon', 'Club Activity'].map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Total Credits</label>
                                    <input type="number" required min="1" value={newEvent.credits} onChange={e => setNewEvent(p => ({ ...p, credits: Number(e.target.value) }))} className={inputClass} />
                                </div>
                            </div>

                            {/* SKILL SPLIT */}
                            <div className="pt-8 border-t border-slate-800">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                        <Layers size={22} className="text-indigo-400" />
                                        Skill Point Split
                                    </h3>
                                    <div className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-colors ${isSplitValid ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                        }`}>
                                        {pointsUsed} / {totalPoints} pts used
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 mb-10">
                                    {SKILL_OPTIONS.map(skill => (
                                        <div key={skill}>
                                            <div className="flex justify-between items-end mb-3">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{skill}</label>
                                                <div className="bg-[#161B28] border border-slate-700 rounded-lg px-3 py-1 flex items-center">
                                                    <input
                                                        type="number" min="0" max={totalPoints}
                                                        value={newEvent.skills[skill]}
                                                        onChange={e => setNewEvent(p => ({ ...p, skills: { ...p.skills, [skill]: Number(e.target.value) } }))}
                                                        className="w-12 bg-transparent text-white text-sm font-bold outline-none text-center"
                                                    />
                                                </div>
                                            </div>
                                            <input
                                                type="range" min="0" max={totalPoints}
                                                value={newEvent.skills[skill]}
                                                onChange={e => setNewEvent(p => ({ ...p, skills: { ...p.skills, [skill]: Number(e.target.value) } }))}
                                                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <button type="submit" disabled={postingEvent || !isSplitValid} className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2">
                                    {postingEvent ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />} Create Event
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* ── REWARDS TAB (New Design) ── */}
                {activeTab === 'rewards' && (
                    <div className="animate-in fade-in duration-500 max-w-6xl">
                        <div className="mb-8">
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">Reward Store Management</h2>
                            <p className="text-slate-400 mt-2 text-lg">Add new items and manage existing rewards for students.</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                            {/* Add Reward Form */}
                            <div className="lg:col-span-2">
                                <form onSubmit={handleAddReward} className="bg-[#1C2130] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/20 sticky top-28">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-6">
                                        <PlusSquare size={22} className="text-amber-400" />
                                        Add New Reward
                                    </h3>

                                    <div className="space-y-5">
                                        <div>
                                            <label className={labelClass}>Reward Name</label>
                                            <input type="text" required placeholder="e.g. University Hoodie" value={newReward.name} onChange={e => setNewReward(p => ({ ...p, name: e.target.value }))} className={inputClass} />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className={labelClass}>Cost (Pts)</label>
                                                <input type="number" required min="1" placeholder="500" value={newReward.cost} onChange={e => setNewReward(p => ({ ...p, cost: Number(e.target.value) }))} className={inputClass} />
                                            </div>
                                            <div>
                                                <label className={labelClass}>Category</label>
                                                <select value={newReward.category} onChange={e => setNewReward(p => ({ ...p, category: e.target.value }))} className={inputClass}>
                                                    {['Merch', 'Academic', 'Voucher'].map(c => <option key={c}>{c}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className={labelClass}>Description</label>
                                            <textarea required rows={2} placeholder="Brief description..." value={newReward.description} onChange={e => setNewReward(p => ({ ...p, description: e.target.value }))} className={`${inputClass} resize-none`} />
                                        </div>

                                        <div>
                                            <label className={labelClass}>Reward Image</label>
                                            <input type="file" accept="image/*" onChange={e => setNewRewardImage(e.target.files?.[0] || null)} className={`${inputClass} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 dark:file:bg-slate-800 dark:file:text-slate-300 dark:hover:file:bg-slate-700 cursor-pointer`} />
                                        </div>

                                        <button type="submit" disabled={addingReward} className="w-full mt-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-[#0B0F19] font-extrabold rounded-xl transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex justify-center items-center gap-2">
                                            {addingReward ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />} Add to Store
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Current Rewards List */}
                            <div className="lg:col-span-3">
                                <div className="bg-[#1C2130] border border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
                                    <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-[#22283A]/50">
                                        <h3 className="font-bold text-white text-lg flex items-center gap-3">
                                            <ShoppingBag size={22} className="text-indigo-400" />
                                            Current Rewards
                                        </h3>
                                        <span className="px-3 py-1 rounded-full bg-[#0B0F19] text-indigo-400 text-sm font-bold border border-slate-700">{rewards.length} Items</span>
                                    </div>

                                    {loadingRewards ? (
                                        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-500" size={40} /></div>
                                    ) : rewards.length === 0 ? (
                                        <div className="p-16 flex flex-col items-center justify-center text-center">
                                            <ShoppingBag size={48} className="text-slate-700 mb-4" />
                                            <h4 className="text-xl font-bold text-white mb-2">Store is Empty</h4>
                                            <p className="text-slate-400">Add your first reward using the form.</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-slate-800/50 p-4 space-y-4 bg-[#1C2130]">
                                            {rewards.map(r => (
                                                <div key={r.id} className="p-4 bg-[#161B28] rounded-xl border border-slate-700/50 hover:border-slate-600 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
                                                            <img src={r.image || `https://picsum.photos/seed/${r.id}/200`} alt={r.name} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-white text-lg">{r.name}</h4>
                                                            <div className="flex items-center gap-3 mt-1">
                                                                <span className="text-sm font-bold text-amber-500">{r.cost} pts</span>
                                                                <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                                                <span className="text-xs text-slate-400 px-2 py-0.5 rounded flex items-center bg-slate-800/50 border border-slate-700">{r.category}</span>
                                                            </div>
                                                            {r.description && <p className="text-sm text-slate-500 mt-2 line-clamp-1">{r.description}</p>}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteReward(r.id)}
                                                        className="self-end sm:self-center p-2.5 rounded-lg text-rose-500 hover:bg-rose-500/10 hover:text-rose-400 transition"
                                                        title="Delete Reward"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── DASHBOARD TAB (Existing Events & Rewards) ── */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div>
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">Overview Dashboard</h2>
                            <p className="text-slate-400 mt-2">Manage all active platform content here.</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-[#1C2130] border border-slate-800 rounded-2xl p-6 shadow-xl shadow-black/20">
                                <h3 className="font-bold text-white text-xl mb-6 flex items-center gap-3"><CalendarDays className="text-indigo-400" /> Existing Events ({events.length})</h3>
                                {loadingEvents ? <div className="flex justify-center py-6"><Loader2 className="animate-spin text-indigo-500" /></div>
                                    : <div className="space-y-4">
                                        {events.map(ev => (
                                            <div key={ev.id} className="bg-[#161B28] rounded-xl p-4 border border-slate-700/50 flex justify-between items-center gap-4">
                                                <div>
                                                    <p className="font-bold text-white">{ev.title}</p>
                                                    <p className="text-xs text-slate-400 mt-1">{ev.category} • {ev.credits} pts</p>
                                                </div>
                                                <button onClick={() => handleDeleteEvent(ev.id)} className="text-slate-500 hover:text-red-400 transition"><Trash2 size={18} /></button>
                                            </div>
                                        ))}
                                    </div>
                                }
                            </div>

                            <div className="bg-[#1C2130] border border-slate-800 rounded-2xl p-6 shadow-xl shadow-black/20">
                                <h3 className="font-bold text-white text-xl mb-6 flex items-center gap-3"><ShoppingBag className="text-amber-400" /> Current Rewards ({rewards.length})</h3>
                                {loadingRewards ? <div className="flex justify-center py-6"><Loader2 className="animate-spin text-indigo-500" /></div>
                                    : <div className="space-y-4">
                                        {rewards.map(r => (
                                            <div key={r.id} className="bg-[#161B28] rounded-xl p-4 border border-slate-700/50 flex items-center gap-4">
                                                {r.image && <img src={r.image} alt="reward" className="w-12 h-12 rounded-lg object-cover" />}
                                                <div className="flex-1">
                                                    <p className="font-bold text-white">{r.name}</p>
                                                    <p className="text-xs text-amber-500 font-bold mt-1">{r.cost} pts <span className="text-slate-500 font-normal">({r.category})</span></p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                )}

                {/* ── LEADERBOARD TAB ── */}
                {activeTab === 'leaderboard' && (
                    <div className="max-w-3xl animate-in fade-in duration-500">
                        <div className="mb-8">
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">Student Leaderboard</h2>
                            <p className="text-slate-400 mt-2">Top performers across the college.</p>
                        </div>
                        {loadingLeaderboard ? <div className="flex justify-center py-12"><Loader2 className="animate-spin text-indigo-500" size={32} /></div>
                            : (
                                <div className="bg-[#1C2130] rounded-2xl border border-slate-800 overflow-hidden shadow-xl shadow-black/20">
                                    {leaderboard.map((s, i) => {
                                        const rank = i + 1;
                                        return (
                                            <div key={s.id} className={`flex items-center gap-4 px-6 py-5 border-b border-slate-800 last:border-0 ${rank <= 3 ? 'bg-amber-500/5' : ''}`}>
                                                <div className="w-10 flex justify-center">
                                                    {rank === 1 ? <Crown size={24} className="text-amber-400 fill-amber-400" />
                                                        : rank === 2 ? <Medal size={24} className="text-slate-300 fill-slate-300" />
                                                            : rank === 3 ? <Medal size={24} className="text-amber-600 fill-amber-600" />
                                                                : <span className="font-bold text-slate-500 text-lg">#{rank}</span>}
                                                </div>
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white overflow-hidden shadow-sm">
                                                        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${s.name}&backgroundColor=4f46e5`} alt="avatar" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white">{s.name}</p>
                                                    </div>
                                                </div>
                                                <span className="font-extrabold text-amber-500 text-lg">{s.totalCredits.toLocaleString()} <span className="text-sm font-semibold text-slate-500">pts</span></span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default FacultyDashboard;
