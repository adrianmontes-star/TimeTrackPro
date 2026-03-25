"use client";

import { useEffect, useState } from "react";
import { Search, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import NotificationBell from './NotificationBell';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });
  }, []);
  
  // Sync input if URL changes elsewhere
  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (searchQuery.trim()) {
        router.push(`/projects?search=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        router.push(`/projects`);
      }
    }
  };
  
  return (
    <header className="h-20 bg-[#f9fafb] flex items-center justify-between px-8">
      {/* Search Bar */}
      <div className="relative w-96 flex-shrink-0">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
          className="block w-full pl-10 pr-12 py-2.5 border-none bg-white rounded-xl text-sm placeholder-gray-500 focus:ring-2 focus:ring-[#166534] shadow-sm"
          placeholder="Buscar un proyecto o tarea..."
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-gray-400 text-xs font-semibold bg-gray-100 px-1.5 py-0.5 rounded">⌘F</span>
        </div>
      </div>

      {/* Right Side Icons & Profile */}
      <div className="flex items-center gap-4">

        <NotificationBell />

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          {user?.user_metadata?.avatar_url ? (
            <img 
              src={user.user_metadata.avatar_url} 
              alt="Profile" 
              className="w-8 h-8 rounded-full border border-gray-200"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#166534] text-white flex items-center justify-center font-bold text-xs uppercase">
              {user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'U'}
            </div>
          )}
          <div className="ml-3 hidden md:block">
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              {user?.user_metadata?.full_name || 'Administrator'}
            </p>
            <p className="text-xs text-gray-500 leading-tight">
              {user?.email || 'admin@timetrackpro.com'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
