import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Briefcase, TrendingUp, DollarSign, CheckCircle, ArrowRight, Settings, ExternalLink } from "lucide-react";

export default function Home() {
  const { data: doers = [] } = useQuery({
    queryKey: ['doers'],
    queryFn: () => base44.entities.Doer.list(),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => base44.entities.Client.list(),
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list(),
  });

  const { data: quickAccessLinks } = useQuery({
    queryKey: ['quickAccessLinks'],
    queryFn: async () => {
      const links = await base44.entities.QuickAccessLinks.list();
      return links[0] || {};
    },
  });

  const activeProjects = projects.filter(p => 
    p.status === "In Progress" || p.status === "Not Started"
  );

  const quickActions = [
    {
      title: "Doers",
      description: "Manage your freelancer network",
      icon: Briefcase,
      iconColor: "text-teal-400",
      path: createPageUrl("Directory"),
      count: doers.length,
      isExternal: false
    },
    {
      title: "Clients",
      description: "Manage your client relationships",
      icon: Users,
      iconColor: "text-blue-400",
      path: createPageUrl("Clients"),
      count: clients.length,
      isExternal: false
    },
    {
      title: "Projects",
      description: "Track your business deals",
      icon: TrendingUp,
      iconColor: "text-purple-400",
      path: createPageUrl("ProjectsLog"),
      count: projects.length,
      isExternal: false
    },
    {
      title: "Trello",
      description: "Project management boards",
      icon: () => (
        <svg className="w-7 h-7 md:w-8 md:h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 0H3C1.343 0 0 1.343 0 3v18c0 1.656 1.343 3 3 3h18c1.656 0 3-1.344 3-3V3c0-1.657-1.344-3-3-3zM10.44 18.18c0 .795-.645 1.44-1.44 1.44H4.56c-.795 0-1.44-.646-1.44-1.44V4.56c0-.795.645-1.44 1.44-1.44H9c.795 0 1.44.645 1.44 1.44v13.62zm10.44-6c0 .794-.645 1.44-1.44 1.44H15c-.795 0-1.44-.646-1.44-1.44V4.56c0-.795.646-1.44 1.44-1.44h4.44c.795 0 1.44.645 1.44 1.44v7.62z"/>
        </svg>
      ),
      iconColor: "text-blue-400",
      path: quickAccessLinks?.trello_project_url || "#",
      count: null,
      isExternal: true
    },
    {
      title: "Drive",
      description: "File storage and sharing",
      icon: () => (
        <svg className="w-7 h-7 md:w-8 md:h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.71 3.5L1.13 15l2.36 4.08L10.08 7.58 7.71 3.5zM22.5 15l-6.58-11.5-2.37 4.08 4.21 7.42H22.5zm-1.41 2.49L18.73 20H3.27l-2.36-4.08L7.5 8.05l5.18 8.95L14.82 20h1.31l-.1-.08 4.06-2.43z"/>
        </svg>
      ),
      iconColor: "text-emerald-400",
      path: quickAccessLinks?.drive_url || "#",
      count: null,
      isExternal: true
    },
    {
      title: "Configuration",
      description: "Settings and preferences",
      icon: Settings,
      iconColor: "text-purple-400",
      path: createPageUrl("Configuration"),
      count: null,
      isExternal: false
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-12">
      {/* Hero Section */}
      <div className="text-center mb-6 md:mb-10">
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-2xl shadow-teal-500/30 mx-auto mb-3 md:mb-4">
          <span className="text-white font-bold text-xl md:text-2xl">iO</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-3">
          Welcome to iOtomayt
        </h1>
        <p className="text-sm md:text-lg text-teal-300">
          Your complete solution for managing doers, clients, and projects
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-10">
        <Card className="bg-slate-900/60 backdrop-blur-md border-teal-500/20 p-3 md:p-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 md:w-5 md:h-5 text-teal-400" />
              <p className="text-[10px] md:text-xs text-slate-400">Total Doers</p>
            </div>
            <p className="text-xl md:text-2xl font-bold text-white">{doers.length}</p>
          </div>
        </Card>

        <Card className="bg-slate-900/60 backdrop-blur-md border-blue-500/20 p-3 md:p-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
              <p className="text-[10px] md:text-xs text-slate-400">Total Clients</p>
            </div>
            <p className="text-xl md:text-2xl font-bold text-white">{clients.length}</p>
          </div>
        </Card>

        <Card className="bg-slate-900/60 backdrop-blur-md border-purple-500/20 p-3 md:p-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
              <p className="text-[10px] md:text-xs text-slate-400">Active Projects</p>
            </div>
            <p className="text-xl md:text-2xl font-bold text-white">{activeProjects.length}</p>
          </div>
        </Card>

        <Card className="bg-slate-900/60 backdrop-blur-md border-emerald-500/20 p-3 md:p-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
              <p className="text-[10px] md:text-xs text-slate-400">All Projects</p>
            </div>
            <p className="text-xl md:text-2xl font-bold text-white">{projects.length}</p>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {quickActions.map((action) => {
          const IconComponent = action.icon;
          const CardWrapper = action.isExternal ? 'a' : Link;
          const linkProps = action.isExternal 
            ? { href: action.path, target: "_blank", rel: "noopener noreferrer" }
            : { to: action.path };

          return (
            <CardWrapper key={action.title} {...linkProps} className="block group">
              <Card className="bg-slate-900/60 backdrop-blur-xl border-teal-500/20 p-4 md:p-5 h-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-teal-500/20 hover:border-teal-500/40">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className={action.iconColor}>
                      <IconComponent />
                    </div>
                    {action.count !== null && (
                      <span className="text-2xl md:text-3xl font-bold text-slate-600">{action.count}</span>
                    )}
                    {action.isExternal && (
                      <ExternalLink className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-1">{action.title}</h3>
                    <p className="text-xs md:text-sm text-slate-400">{action.description}</p>
                  </div>
                  <Button 
                    className="w-full bg-slate-800 hover:bg-teal-500 text-white border border-slate-700/50 group-hover:border-teal-500/50 transition-all shadow-lg font-semibold text-sm"
                  >
                    <span>Open {action.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            </CardWrapper>
          );
        })}
      </div>
    </div>
  );
}