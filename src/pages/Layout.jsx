import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { supabase, supabaseOperations } from "@/api/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Users, Briefcase, Settings, LogOut, ExternalLink, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: quickAccessLinks } = useQuery({
    queryKey: ['quickAccessLinks'],
    queryFn: supabaseOperations.getQuickAccessLinks,
    enabled: !!session,
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const navItems = [
    { name: "Doers", path: createPageUrl("Directory"), icon: Briefcase, match: "Directory" },
    { name: "Clients", path: createPageUrl("Clients"), icon: Users, match: "Clients" },
    { name: "Configuration", path: createPageUrl("Configuration"), icon: Settings, match: "Configuration" },
  ];

  const isActive = (pageName) => currentPageName === pageName;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-teal-500/20">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
                <span className="text-white font-bold text-2xl">iO</span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Welcome to iOtomayt</h1>
              <p className="text-slate-400">Sign in to continue</p>
            </div>
            <Auth />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900">
      {/* Top Header - Desktop Only */}
      <header className="hidden md:block bg-slate-900/90 backdrop-blur-lg border-b border-teal-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
                <span className="text-white font-bold text-lg">iO</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">iOtomayt</h1>
                <p className="text-xs text-teal-300">Doers & Clients Management by Abdel Moradee</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="flex items-center gap-2">
              {(quickAccessLinks?.trello_project_url || quickAccessLinks?.trello_temp_url) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2 text-slate-300 hover:text-white hover:bg-slate-800">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 0H3C1.343 0 0 1.343 0 3v18c0 1.656 1.343 3 3 3h18c1.656 0 3-1.344 3-3V3c0-1.657-1.344-3-3-3zM10.44 18.18c0 .795-.645 1.44-1.44 1.44H4.56c-.795 0-1.44-.646-1.44-1.44V4.56c0-.795.645-1.44 1.44-1.44H9c.795 0 1.44.645 1.44 1.44v13.62zm10.44-6c0 .794-.645 1.44-1.44 1.44H15c-.795 0-1.44-.646-1.44-1.44V4.56c0-.795.646-1.44 1.44-1.44h4.44c.795 0 1.44.645 1.44 1.44v7.62z"/>
                      </svg>
                      Trello
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-slate-800 border-slate-700 text-white">
                    {quickAccessLinks?.trello_project_url && (
                      <DropdownMenuItem onClick={() => window.open(quickAccessLinks.trello_project_url, '_blank')} className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer">
                        Project Tracker
                      </DropdownMenuItem>
                    )}
                    {quickAccessLinks?.trello_temp_url && (
                      <DropdownMenuItem onClick={() => window.open(quickAccessLinks.trello_temp_url, '_blank')} className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer">
                        Temp
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {quickAccessLinks?.drive_url && (
                <a href={quickAccessLinks.drive_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.71 3.5L1.13 15l2.36 4.08L10.08 7.58 7.71 3.5zM22.5 15l-6.58-11.5-2.37 4.08 4.21 7.42H22.5zm-1.41 2.49L18.73 20H3.27l-2.36-4.08L7.5 8.05l5.18 8.95L14.82 20h1.31l-.1-.08 4.06-2.43z"/>
                  </svg>
                  Drive
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              {navItems.map((item) => (
                <Link key={item.name} to={item.path}>
                  <Button variant="ghost" size="sm" className={`gap-2 ${isActive(item.match) ? "bg-teal-500/20 text-teal-300 hover:bg-teal-500/30" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}>
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Button>
                </Link>
              ))}

              <Button onClick={handleSignOut} variant="ghost" size="sm" className="gap-2 text-slate-300 hover:text-red-400 hover:bg-slate-800">
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden bg-slate-900/90 backdrop-blur-lg border-b border-teal-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
                <span className="text-white font-bold text-base">iO</span>
              </div>
              <div>
                <h1 className="text-base font-bold text-white">iOtomayt</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20 md:pb-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-teal-500/20 z-50 safe-bottom">
        <div className="flex justify-around items-center px-2 py-2.5">
          {navItems.map((item) => (
            <Link key={item.name} to={item.path} className="flex flex-col items-center gap-1 flex-1 py-1">
              <div className={`p-2 rounded-xl transition-colors ${isActive(item.match) ? "bg-teal-500/20 text-teal-300" : "text-slate-400"}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-medium ${isActive(item.match) ? "text-teal-300" : "text-slate-400"}`}>
                {item.name}
              </span>
            </Link>
          ))}
          
          <button onClick={handleSignOut} className="flex flex-col items-center gap-1 flex-1 py-1">
            <div className="p-2 rounded-xl transition-colors text-slate-400">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium text-slate-400">Logout</span>
          </button>
        </div>
      </nav>

      {/* Decorative Elements */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}

function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <input
          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <input
          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-medium rounded-lg hover:from-teal-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 transition-all"
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  );
}
