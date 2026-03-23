import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../services/userService';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '../firebase';
import { User, BookOpen, GraduationCap, Link as LinkIcon, Lock, Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const ProfileSettings: React.FC = () => {
  const { userProfile } = useUser();
  const { user } = useAuth();
  
  // Profile Form States
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

  // Password Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setCollege(userProfile.college || '');
      setCourse(userProfile.course || '');
      setYear(userProfile.year || '');
      setAvatar(userProfile.avatar || '');
    }
  }, [userProfile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSavingProfile(true);
    setProfileMessage({ type: '', text: '' });
    
    try {
      await updateUserProfile(user.id, {
        name,
        college,
        course,
        year,
        avatar
      });
      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Clear success message after 3 seconds
      setTimeout(() => setProfileMessage({ type: '', text: '' }), 3000);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setProfileMessage({ type: 'error', text: error.message || 'Failed to update profile.' });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !user?.email) return;

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    setIsSavingPassword(true);
    setPasswordMessage({ type: '', text: '' });

    try {
      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Update password
      await updatePassword(auth.currentUser, newPassword);
      
      setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Clear success message after 3 seconds
      setTimeout(() => setPasswordMessage({ type: '', text: '' }), 3000);
    } catch (error: any) {
      console.error('Error updating password:', error);
      let errorMsg = 'Failed to update password.';
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMsg = 'Incorrect current password.';
      }
      setPasswordMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Profile Settings</h1>
        <p className="text-gray-500 dark:text-slate-400">Update your account details and manage your password securely.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Col - Avatar Preview */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full border-4 border-indigo-100 dark:border-slate-700 overflow-hidden mb-4 bg-indigo-50 dark:bg-slate-700 flex items-center justify-center">
              {avatar ? (
                <img src={avatar} alt="Profile preview" className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-indigo-300 dark:text-slate-500" />
              )}
            </div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{name || 'Your Name'}</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 truncate w-full">{user?.email}</p>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {college && <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">{college}</span>}
              {year && <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-3 py-1 rounded-full">Class of {year}</span>}
            </div>
          </div>
        </div>

        {/* Right Col - Forms */}
        <div className="md:col-span-2 space-y-8">
          
          {/* General Details Form */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors duration-200">
            <div className="p-6 border-b border-gray-50 dark:border-slate-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Personal Information</h2>
            </div>
            <div className="p-6">
              {profileMessage.text && (
                <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${profileMessage.type === 'error' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'}`}>
                  {profileMessage.type === 'error' ? <AlertCircle size={20} className="mt-0.5" /> : <CheckCircle2 size={20} className="mt-0.5" />}
                  <span className="text-sm font-medium">{profileMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5 flex items-center gap-2"><User size={16} /> Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5 flex items-center gap-2"><BookOpen size={16} /> College Name</label>
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-shadow"
                      placeholder="e.g. Stanford University"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5 flex items-center gap-2"><GraduationCap size={16} /> Course / Degree</label>
                    <input
                      type="text"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-shadow"
                      placeholder="e.g. Computer Science"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5 flex items-center gap-2"><CheckCircle2 size={16} /> Graduation Year</label>
                    <input
                      type="text"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-shadow"
                      placeholder="e.g. 2026"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5 flex items-center gap-2"><LinkIcon size={16} /> Avatar Image URL</label>
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-70"
                  >
                    {isSavingProfile ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {isSavingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Password Reset Form */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors duration-200">
             <div className="p-6 border-b border-gray-50 dark:border-slate-700 flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
                <Lock size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Security & Password</h2>
            </div>
            
            <div className="p-6">
              {passwordMessage.text && (
                <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${passwordMessage.type === 'error' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'}`}>
                  {passwordMessage.type === 'error' ? <AlertCircle size={20} className="mt-0.5" /> : <CheckCircle2 size={20} className="mt-0.5" />}
                  <span className="text-sm font-medium">{passwordMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-5">
                 <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5 ">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-shadow"
                  />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5 ">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-shadow"
                  />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5 ">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-shadow"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingPassword}
                    className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-70"
                  >
                    {isSavingPassword ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                    {isSavingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
