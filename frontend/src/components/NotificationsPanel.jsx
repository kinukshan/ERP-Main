import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';
import api from '../services/api';

const NotificationsPanel = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const { data } = await api.get('/notifications');
            setNotifications(data);
        } catch (err) {
            console.error('Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Auto-refresh every 30s
        return () => clearInterval(interval);
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.patch('/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            console.error(err);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="bg-white rounded-xl shadow border border-gray-100 flex flex-col h-full max-h-[600px]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
                <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-gray-600" />
                    <h3 className="font-bold text-gray-800">Alerts</h3>
                    {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                    >
                        <CheckCircle2 className="h-4 w-4" /> Mark all read
                    </button>
                )}
            </div>

            <div className="overflow-y-auto p-4 space-y-3 flex-grow bg-white rounded-b-xl">
                {loading ? (
                    <p className="text-center text-sm text-gray-500 py-4">Loading alerts...</p>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-8">
                        <CheckCircle2 className="h-8 w-8 text-green-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">All caught up! No active alerts.</p>
                    </div>
                ) : (
                    notifications.map(notification => (
                        <div
                            key={notification._id}
                            className={`p-3 rounded-lg border ${notification.isRead
                                    ? 'bg-gray-50 border-gray-100 opacity-60'
                                    : notification.type === 'OutOfStock'
                                        ? 'bg-red-50 border-red-100'
                                        : 'bg-amber-50 border-amber-100'
                                } transition-all`}
                        >
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 mt-0.5">
                                    {notification.type === 'OutOfStock' ? (
                                        <AlertOctagon className={`h-5 w-5 ${notification.isRead ? 'text-gray-400' : 'text-red-500'}`} />
                                    ) : (
                                        <AlertTriangle className={`h-5 w-5 ${notification.isRead ? 'text-gray-400' : 'text-amber-500'}`} />
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <p className={`text-sm ${notification.isRead ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                                        {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                {!notification.isRead && (
                                    <button
                                        onClick={() => handleMarkAsRead(notification._id)}
                                        className="flex-shrink-0 text-gray-400 hover:text-indigo-600 transition-colors p-1"
                                        title="Mark as read"
                                    >
                                        <Check className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationsPanel;
