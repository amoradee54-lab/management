
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Users, Briefcase, Settings, Menu, ExternalLink, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: quickAccessLinks } = useQuery({
    queryKey: ['quickAccessLinks'],
    queryFn: async () => {
      const links = await base44.entities.QuickAccessLinks.list();
      return links[0] || {};
    },
  });

  const navItems = [
    { name: "Doers", path: createPageUrl("Directory"), icon: Briefcase, match: "Directory" },
    { name: "Clients", path: createPageUrl("Clients"), icon: Users, match: "Clients" },
    { name: "Configuration", path: createPageUrl("Configuration"), icon: Settings, match: "Configuration" },
  ];

  const isActive = (pageName) => currentPageName === pageName;

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
              {/* Trello Dropdown */}
              {(quickAccessLinks?.trello_project_url || quickAccessLinks?.trello_temp_url) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-slate-300 hover:text-white hover:bg-slate-800"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 0H3C1.343 0 0 1.343 0 3v18c0 1.656 1.343 3 3 3h18c1.656 0 3-1.344 3-3V3c0-1.657-1.344-3-3-3zM10.44 18.18c0 .795-.645 1.44-1.44 1.44H4.56c-.795 0-1.44-.646-1.44-1.44V4.56c0-.795.645-1.44 1.44-1.44H9c.795 0 1.44.645 1.44 1.44v13.62zm10.44-6c0 .794-.645 1.44-1.44 1.44H15c-.795 0-1.44-.646-1.44-1.44V4.56c0-.795.646-1.44 1.44-1.44h4.44c.795 0 1.44.645 1.44 1.44v7.62z"/>
                      </svg>
                      Trello
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-slate-800 border-slate-700 text-white">
                    {quickAccessLinks?.trello_project_url && (
                      <DropdownMenuItem
                        onClick={() => window.open(quickAccessLinks.trello_project_url, '_blank')}
                        className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                      >
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M21 0H3C1.343 0 0 1.343 0 3v18c0 1.656 1.343 3 3 3h18c1.656 0 3-1.344 3-3V3c0-1.657-1.344-3-3-3zM10.44 18.18c0 .795-.645 1.44-1.44 1.44H4.56c-.795 0-1.44-.646-1.44-1.44V4.56c0-.795.645-1.44 1.44-1.44H9c.795 0 1.44.645 1.44 1.44v13.62zm10.44-6c0 .794-.645 1.44-1.44 1.44H15c-.795 0-1.44-.646-1.44-1.44V4.56c0-.795.646-1.44 1.44-1.44h4.44c.795 0 1.44.645 1.44 1.44v7.62z"/>
                        </svg>
                        Project Tracker
                      </DropdownMenuItem>
                    )}
                    {quickAccessLinks?.trello_temp_url && (
                      <DropdownMenuItem
                        onClick={() => window.open(quickAccessLinks.trello_temp_url, '_blank')}
                        className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                      >
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M21 0H3C1.343 0 0 1.343 0 3v18c0 1.656 1.343 3 3 3h18c1.656 0 3-1.344 3-3V3c0-1.657-1.344-3-3-3zM10.44 18.18c0 .795-.645 1.44-1.44 1.44H4.56c-.795 0-1.44-.646-1.44-1.44V4.56c0-.795.645-1.44 1.44-1.44H9c.795 0 1.44.645 1.44 1.44v13.62zm10.44-6c0 .794-.645 1.44-1.44 1.44H15c-.795 0-1.44-.646-1.44-1.44V4.56c0-.795.646-1.44 1.44-1.44h4.44c.795 0 1.44.645 1.44 1.44v7.62z"/>
                        </svg>
                        Temp
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {quickAccessLinks?.drive_url && (
                <a
                  href={quickAccessLinks.drive_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.71 3.5L1.13 15l2.36 4.08L10.08 7.58 7.71 3.5zM22.5 15l-6.58-11.5-2.37 4.08 4.21 7.42H22.5zm-1.41 2.49L18.73 20H3.27l-2.36-4.08L7.5 8.05l5.18 8.95L14.82 20h1.31l-.1-.08 4.06-2.43z"/>
                  </svg>
                  Drive
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              {navItems.map((item) => (
                <Link key={item.name} to={item.path}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-2 ${
                      isActive(item.match)
                        ? "bg-teal-500/20 text-teal-300 hover:bg-teal-500/30"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Header - Logo Only */}
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
            <Link
              key={item.name}
              to={item.path}
              className="flex flex-col items-center gap-1 flex-1 py-1"
            >
              <div
                className={`p-2 rounded-xl transition-colors ${
                  isActive(item.match)
                    ? "bg-teal-500/20 text-teal-300"
                    : "text-slate-400"
                }`}
              >
                <item.icon className="w-5 h-5" />
              </div>
              <span
                className={`text-[10px] font-medium ${
                  isActive(item.match) ? "text-teal-300" : "text-slate-400"
                }`}
              >
                {item.name}
              </span>
            </Link>
          ))}
          
          {/* Trello Dropdown on Mobile */}
          {(quickAccessLinks?.trello_project_url || quickAccessLinks?.trello_temp_url) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex flex-col items-center gap-1 flex-1 py-1">
                  <div className="p-2 rounded-xl transition-colors text-slate-400">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 0H3C1.343 0 0 1.343 0 3v18c0 1.656 1.343 3 3 3h18c1.656 0 3-1.344 3-3V3c0-1.657-1.344-3-3-3zM10.44 18.18c0 .795-.645 1.44-1.44 1.44H4.56c-.795 0-1.44-.646-1.44-1.44V4.56c0-.795.645-1.44 1.44-1.44H9c.795 0 1.44.645 1.44 1.44v13.62zm10.44-6c0 .794-.645 1.44-1.44 1.44H15c-.795 0-1.44-.646-1.44-1.44V4.56c0-.795.646-1.44 1.44-1.44h4.44c.795 0 1.44.645 1.44 1.44v7.62z"/>
                    </svg>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400">Trello</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="bg-slate-800 border-slate-700 text-white mb-2">
                {quickAccessLinks?.trello_project_url && (
                  <DropdownMenuItem
                    onClick={() => window.open(quickAccessLinks.trello_project_url, '_blank')}
                    className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                  >
                    Project Tracker
                  </DropdownMenuItem>
                )}
                {quickAccessLinks?.trello_temp_url && (
                  <DropdownMenuItem
                    onClick={() => window.open(quickAccessLinks.trello_temp_url, '_blank')}
                    className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                  >
                    Temp
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Drive on Mobile */}
          {quickAccessLinks?.drive_url && (
            <a
              href={quickAccessLinks.drive_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 flex-1 py-1"
            >
              <div className="p-2 rounded-xl transition-colors text-slate-400">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.71 3.5L1.13 15l2.36 4.08L10.08 7.58 7.71 3.5zM22.5 15l-6.58-11.5-2.37 4.08 4.21 7.42H22.5zm-1.41 2.49L18.73 20H3.27l-2.36-4.08L7.5 8.05l5.18 8.95L14.82 20h1.31l-.1-.08 4.06-2.43z"/>
                </svg>
              </div>
              <span className="text-[10px] font-medium text-slate-400">Drive</span>
            </a>
          )}
        </div>
      </nav>

      {/* Decorative Elements */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
