"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, CheckSquare, Clock } from "lucide-react";
import { getMyNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/server/actions/notifications";
import Link from "next/link";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    const res = await getMyNotifications();
    if (res.success) {
      setNotifications(res.notifications || []);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    
    // Click outside handler
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Optimistic update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    await markNotificationAsRead(id);
  };

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    await markAllNotificationsAsRead();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 transition-colors ${
          isOpen ? 'text-[#166534] border-[#166534] bg-green-50' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
            <h3 className="font-semibold text-gray-900">Notificaciones</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                className="text-xs font-medium text-[var(--primary)] hover:text-[var(--primary-dark)] flex items-center gap-1 transition-colors"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                Marcar leídas
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 border-b border-gray-50">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300 opacity-50" />
                <p className="text-sm">No tienes notificaciones</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`block p-4 transition-colors hover:bg-gray-50 flex items-start gap-3 relative group ${!notification.read ? 'bg-blue-50/30' : ''}`}
                  >
                    <div className="mt-1">
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 absolute left-2 top-6"></div>
                      )}
                    </div>
                    <div className="flex-1 ml-2">
                      <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notification.message}</p>
                      <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {!notification.read && (
                      <button 
                        onClick={(e) => handleMarkAsRead(notification.id, e)}
                        className="opacity-0 group-hover:opacity-100 text-xs text-blue-600 hover:text-blue-800 transition-opacity whitespace-nowrap px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded-md"
                      >
                        Leída
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="p-2 border-t border-gray-100 bg-gray-50 text-center">
            <button className="text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors w-full py-1">
              Ver todo el historial
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
