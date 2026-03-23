import React, { useState, useEffect } from 'react';
import { Calendar, Gift, CheckCircle, Bell, Check, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { AppNotification } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  subscribeToNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification 
} from '../services/notificationService';

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    const unsubscribe = subscribeToNotifications(user.id, (notifs) => {
      setNotifications(notifs);
    });
    return () => unsubscribe();
  }, [user?.id]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (id: string) => {
    if (!user?.id) return;
    await markNotificationAsRead(user.id, id).catch(console.error);
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return;
    const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
    await markAllNotificationsAsRead(user.id, unreadIds).catch(console.error);
  };

  const handleDelete = async (id: string) => {
    if (!user?.id) return;
    await deleteNotification(user.id, id).catch(console.error);
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'event': return <Calendar size={20} className="text-blue-500" />;
      case 'reward': return <Gift size={20} className="text-purple-500" />;
      case 'verification': return <CheckCircle size={20} className="text-emerald-500" />;
      default: return <Bell size={20} className="text-indigo-500" />;
    }
  };

  const getIconBg = (type: string) => {
    switch(type) {
      case 'event': return 'bg-blue-100 dark:bg-blue-900/30';
      case 'reward': return 'bg-purple-100 dark:bg-purple-900/30';
      case 'verification': return 'bg-emerald-100 dark:bg-emerald-900/30';
      default: return 'bg-indigo-100 dark:bg-indigo-900/30';
    }
  };

  // Helper to nicely format the relative time
  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-gray-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <Bell size={28} className="text-indigo-600 dark:text-indigo-400" /> Notifications
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}.
          </p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllAsRead}
            className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition flex items-center gap-1.5 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
          >
            <Check size={16} /> Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden min-h-[400px]">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[300px]">
            <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
               <Bell size={32} className="text-gray-300 dark:text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">You're all caught up!</h3>
            <p className="text-gray-500 dark:text-slate-500">No new notifications to display right now.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-slate-700">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={clsx(
                  "p-5 md:p-6 flex gap-4 transition-all duration-300 group hover:bg-gray-50/50 dark:hover:bg-slate-750",
                  !notif.isRead ? "bg-indigo-50/30 dark:bg-indigo-900/10" : "opacity-75 hover:opacity-100"
                )}
              >
                {/* Icon wrapper */}
                <div className={clsx("flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-sm border border-white dark:border-slate-700", getIconBg(notif.type))}>
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4 mb-1">
                    <h3 className={clsx("text-base truncate pr-2", !notif.isRead ? "font-bold text-gray-900 dark:text-white" : "font-semibold text-gray-700 dark:text-slate-300")}>
                      {notif.title}
                    </h3>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xs font-semibold text-gray-400 dark:text-slate-500 whitespace-nowrap">
                        {formatTimeAgo(notif.date)}
                      </span>
                      {!notif.isRead && (
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.5)]"></span>
                      )}
                    </div>
                  </div>
                  
                  <p className={clsx("text-sm line-clamp-2 md:line-clamp-none", !notif.isRead ? "text-gray-600 dark:text-slate-400" : "text-gray-500 dark:text-slate-500")}>
                    {notif.message}
                  </p>

                  <div className="flex gap-4 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!notif.isRead && (
                      <button 
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1"
                      >
                        <Check size={14} /> Mark Read
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(notif.id)}
                      className="text-xs font-bold text-red-500 hover:text-red-700 dark:hover:text-red-400 flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
