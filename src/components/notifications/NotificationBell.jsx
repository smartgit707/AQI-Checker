import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, ExternalLink, Loader2, Info, AlertTriangle, ShieldCheck } from 'lucide-react';
import { getNotificationsApi, markNotificationReadApi, markAllNotificationsReadApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
      // Light periodic poll every 60s
      const timer = setInterval(loadNotifications, 60000);
      return () => clearInterval(timer);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await getNotificationsApi({ limit: 8 });
      if (res.success) {
        setNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      console.error('[NotificationBell] Error fetching notifications:', err);
    }
  };

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await markNotificationReadApi(id);
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('[NotificationBell] Mark read error:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setIsLoading(true);
      await markAllNotificationsReadApi();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('[NotificationBell] Mark all read error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="View notifications"
        className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs animate-scaleIn">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200/90 shadow-2xl z-50 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Environmental Alerts
              </span>
              {unreadCount > 0 && (
                <span className="text-2xs font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={isLoading}
                className="text-2xs font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 transition-colors"
              >
                <CheckCheck className="w-3 h-3" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="py-8 px-4 text-center">
                <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium">No alerts triggered yet</p>
                <p className="text-2xs text-slate-400 mt-1">
                  Threshold alert notifications for your favorite cities will appear here.
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item._id}
                  className={`p-3.5 transition-colors flex items-start gap-3 ${
                    item.read ? 'bg-white' : 'bg-emerald-50/40 hover:bg-emerald-50/60'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {item.severity === 'danger' ? (
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                    ) : (
                      <Info className="w-4 h-4 text-amber-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        to={`/city/${item.citySlug}`}
                        onClick={() => setIsOpen(false)}
                        className="text-xs font-bold text-slate-900 hover:text-emerald-700 truncate"
                      >
                        {item.title}
                      </Link>
                      {!item.read && (
                        <button
                          type="button"
                          onClick={(e) => handleMarkAsRead(item._id, e)}
                          title="Mark read"
                          className="w-2 h-2 rounded-full bg-emerald-500 hover:scale-125 transition-transform shrink-0"
                        />
                      )}
                    </div>
                    <p className="text-2xs text-slate-600 mt-0.5 leading-relaxed">
                      {item.message}
                    </p>
                    <div className="flex items-center justify-between mt-2 text-2xs text-slate-400">
                      <span>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <Link
                        to={`/city/${item.citySlug}`}
                        onClick={() => setIsOpen(false)}
                        className="text-emerald-600 hover:underline flex items-center gap-0.5"
                      >
                        <span>View city</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              All Notifications →
            </Link>
            <Link
              to="/alerts"
              onClick={() => setIsOpen(false)}
              className="text-2xs text-slate-500 hover:text-slate-700"
            >
              Manage Alert Rules
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
