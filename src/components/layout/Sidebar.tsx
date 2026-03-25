"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CheckSquare, 
  CalendarDays, 
  BarChart3, 
  Users, 
  LogOut 
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const MENU_ITEMS: Array<{ icon: any, label: string, href: string, badge?: string }> = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: CheckSquare, label: "Tasks", href: "/projects" },
  { icon: CalendarDays, label: "Calendar", href: "/calendar" },
  { icon: BarChart3, label: "Analytics", href: "/reports" },
  { icon: Users, label: "Team", href: "/admin/users" },
];


export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="w-64 h-screen bg-[#f9fafb] border-r border-gray-200 flex flex-col pt-6 pb-4">
      {/* Logo */}
      <div className="px-6 flex items-center gap-2 mb-10">
        <div className="w-8 h-8 rounded-full bg-white border-4 border-[#166534] flex items-center justify-center flex-shrink-0">
          <div className="w-2 h-2 rounded-full bg-[#166534]"></div>
        </div>
        <span className="text-xl font-bold tracking-tight text-gray-900 truncate">TimeTrack Pro</span>
      </div>

      <div className="px-4 text-xs font-semibold text-gray-400 mb-4 tracking-wider">MENU</div>
      
      {/* Main Menu */}
      <nav className="flex-1 px-3 space-y-1">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-colors relative group ${
                isActive
                  ? "text-gray-900 bg-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900 hover:bg-white"
              }`}
            >
              {isActive && (
                <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-1 h-6 bg-[#166534] rounded-r-full" />
              )}
              <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-[#166534]' : 'text-gray-400 group-hover:text-gray-500'}`} />
              {item.label}
              {item.badge && (
                <span className="ml-auto bg-[#14532d] text-white py-0.5 px-2 rounded-full text-[10px] font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Actions */}
      <nav className="px-3 space-y-1 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-xl text-gray-500 hover:text-gray-900 hover:bg-white transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400" />
          Logout
        </button>
      </nav>


    </div>
  );
}
