import React from 'react';
import { MOCK_NOTIFICATIONS } from '../constants';

const NotificationsDropdown: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    notifications: typeof MOCK_NOTIFICATIONS;
    t: any;
}> = ({ isOpen, onClose, notifications, t }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute top-16 right-4 rtl:left-4 rtl:right-auto w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-[90] overflow-hidden animate-in slide-in-from-top-2">
            <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h4 className="font-semibold text-sm text-slate-700">{t.notifications}</h4>
                <button onClick={onClose} className="text-xs text-blue-600 font-medium hover:underline">{t.close}</button>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-sm">No new notifications</div>
                ) : (
                    notifications.map(notif => (
                        <div key={notif.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!notif.read ? 'bg-blue-50/50' : ''}`}>
                            <div className="flex justify-between items-start mb-1">
                                <span className={`font-semibold text-sm ${!notif.read ? 'text-blue-700' : 'text-slate-700'}`}>{notif.title}</span>
                                <span className="text-[10px] text-slate-400">{notif.time}</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                        </div>
                    ))
                )}
            </div>
            <div className="p-2 bg-slate-50 text-center">
                <button className="text-xs text-slate-500 hover:text-slate-800 font-medium">{t.mark_read}</button>
            </div>
        </div>
    );
};

export default NotificationsDropdown;
