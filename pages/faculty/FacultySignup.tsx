import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User, KeyRound, ArrowRight, Loader2, GraduationCap } from 'lucide-react';

const FACULTY_CODE = import.meta.env.VITE_FACULTY_CODE || 'SKILLGRID2024';

const FacultySignup: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [accessCode, setAccessCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { facultySignup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (accessCode !== FACULTY_CODE) {
            setError('Invalid faculty access code. Please contact your administrator.');
            return;
        }

        setIsSubmitting(true);
        try {
            await facultySignup(name, email, password);
            setSuccess('Faculty account created! You can now sign in.');
            setTimeout(() => navigate('/faculty/login'), 2500);
        } catch (err: any) {
            if (err.code === 'auth/email-already-in-use') setError('Email already in use.');
            else if (err.code === 'auth/weak-password') setError('Password should be at least 6 characters.');
            else setError('Failed to create account. Please try again.');
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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Faculty Registration</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-2">Create your faculty account</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-300 text-red-700 dark:bg-red-900/20 dark:border-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-emerald-50 border border-emerald-300 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-xl mb-4 text-sm">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                        { label: 'Full Name', type: 'text', value: name, setter: setName, placeholder: 'Dr. Jane Smith', Icon: User },
                        { label: 'Email Address', type: 'email', value: email, setter: setEmail, placeholder: 'faculty@university.edu', Icon: Mail },
                        { label: 'Password', type: 'password', value: password, setter: setPassword, placeholder: 'Min. 6 characters', Icon: Lock },
                        { label: 'Faculty Access Code', type: 'text', value: accessCode, setter: setAccessCode, placeholder: 'Enter access code', Icon: KeyRound },
                    ].map(({ label, type, value, setter, placeholder, Icon }) => (
                        <div key={label} className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">{label}</label>
                            <div className="relative">
                                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type={type}
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                    placeholder={placeholder}
                                    value={value}
                                    onChange={e => setter(e.target.value)}
                                />
                            </div>
                        </div>
                    ))}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><ArrowRight size={20} /> Create Faculty Account</>}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500 dark:text-slate-400">
                    Already registered?{' '}
                    <Link to="/faculty/login" className="text-teal-600 dark:text-teal-400 font-bold hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FacultySignup;
