import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, ArrowRight, Loader2, GraduationCap } from 'lucide-react';

const FacultyLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            await login(email, password, 'faculty');
            navigate('/faculty');
        } catch (err: any) {
            if (err.message?.includes('verify your email')) {
                setError(err.message);
            } else if (err.message?.includes('not a faculty')) {
                setError('This account does not have faculty access.');
            } else {
                setError('Failed to log in. Please check your credentials.');
            }
        }
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-slate-950 dark:to-slate-900">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl w-full max-w-md p-8 border border-teal-100 dark:border-slate-700 transition-colors duration-300">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-teal-500/30">
                        <GraduationCap size={28} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Faculty Portal</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-2">Sign in to manage your students</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-300 text-red-700 dark:bg-red-900/20 dark:border-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                placeholder="faculty@university.edu"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><ArrowRight size={20} /> Sign In</>}
                    </button>
                </form>

                <div className="mt-6 text-center space-y-3 text-sm text-gray-500 dark:text-slate-400">
                    <p>
                        No faculty account?{' '}
                        <Link to="/faculty/signup" className="text-teal-600 dark:text-teal-400 font-bold hover:underline">
                            Register here
                        </Link>
                    </p>
                    <p>
                        <Link to="/login" className="hover:text-gray-700 dark:hover:text-slate-200 transition-colors">
                            ← Back to Student Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FacultyLogin;
