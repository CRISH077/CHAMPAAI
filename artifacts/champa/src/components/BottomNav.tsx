import { Link, useLocation } from "wouter";
import { Home, MessageSquare, ListTodo, BrainCircuit, User } from "lucide-react";

export default function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, path: "/home", label: "HOME" },
    { icon: MessageSquare, path: "/chat", label: "CHAT" },
    { icon: ListTodo, path: "/tasks", label: "TASKS" },
    { icon: BrainCircuit, path: "/memory", label: "MEMORY" },
    { icon: User, path: "/account", label: "USER" },
  ];

  // Also highlight Home if path is "/"
  const isActive = (path: string) => {
    if (path === "/home" && location === "/") return true;
    return location === path;
  };

  return (
    <nav className="fixed bottom-0 w-full max-w-md bg-black/90 backdrop-blur-md border-t border-white/10 px-6 py-4 z-50">
      <div className="flex justify-between items-center">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link key={item.path} href={item.path} className="flex flex-col items-center gap-1 group">
              <div className={`p-2 rounded-xl transition-all duration-300 ${active ? 'bg-white text-black' : 'text-white/50 group-hover:text-white'}`}>
                <item.icon size={20} strokeWidth={active ? 2.5 : 2} />
              </div>
              {active && <span className="font-display text-[9px] font-bold tracking-widest">{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
