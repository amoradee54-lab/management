import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Star, MessageCircle, Mail, Phone, Heart, MapPin, Clock, 
  ExternalLink, Edit2, CheckCircle, Zap, Award, Briefcase, Trash2
} from "lucide-react";
import ProjectsTab from "../projects/ProjectsTab";

export default function DetailedDoerProfile({ 
  doer, 
  isOpen, 
  onClose,
  onToggleFavorite,
  onMessage,
  onEdit,
  onDelete
}) {
  const [activeTab, setActiveTab] = React.useState("details");

  if (!doer) return null;

  const getLocalTime = (country) => {
    if (!country) return null;
    try {
      const timezones = {
        "United States": "America/New_York",
        "United Kingdom": "Europe/London",
        "India": "Asia/Kolkata",
        "Argentina": "America/Argentina/Buenos_Aires",
        "Australia": "Australia/Sydney",
        "Canada": "America/Toronto",
        "Germany": "Europe/Berlin",
        "France": "Europe/Paris",
        "Spain": "Europe/Madrid",
        "Brazil": "America/Sao_Paulo",
        "Japan": "Asia/Tokyo",
        "China": "Asia/Shanghai"
      };
      
      const timezone = timezones[country] || "UTC";
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      return formatter.format(now);
    } catch {
      return null;
    }
  };

  const getPortfolioUrl = (link) => {
    if (typeof link === 'string') return link;
    if (typeof link === 'object' && link.url) return link.url;
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] lg:max-w-6xl max-h-[90vh] overflow-y-auto overflow-x-hidden bg-slate-900 border-teal-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-2xl shadow-teal-500/30 overflow-hidden flex-shrink-0">
                {doer.profile_picture ? (
                  <img src={doer.profile_picture} alt={doer.full_name} className="w-full h-full object-cover" />
                ) : (
                  doer.full_name?.charAt(0).toUpperCase()
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{doer.full_name}</h2>
                <p className="text-teal-300 text-base sm:text-lg truncate">{doer.primary_expertise}</p>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleFavorite(doer)}
                className="hover:bg-rose-500/20"
              >
                <Heart 
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${doer.is_favorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`}
                />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="gap-2 border-teal-500/30 text-teal-300 hover:bg-teal-500/10 flex-1 sm:flex-initial"
              >
                <Edit2 className="w-4 h-4" />
                <span className="sm:inline">Edit</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(doer.id)}
                className="gap-2 border-red-500/30 text-red-300 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="border-b border-slate-800 mb-4 -mx-6 px-6 overflow-x-auto">
          <div className="flex gap-4 sm:gap-6 min-w-max">
            <button
              onClick={() => setActiveTab("details")}
              className={`pb-3 px-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === "details"
                  ? "border-teal-400 text-teal-300"
                  : "border-transparent text-slate-400 hover:text-slate-300"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`pb-3 px-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === "projects"
                  ? "border-teal-400 text-teal-300"
                  : "border-transparent text-slate-400 hover:text-slate-300"
              }`}
            >
              Projects
            </button>
          </div>
        </div>

        {activeTab === "details" ? (
          <div className="space-y-4 sm:space-y-6 py-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {doer.hourly_rate && (
                <div className="p-3 sm:p-4 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-xl border border-amber-500/30">
                  <p className="text-xs text-amber-300 mb-1">Hourly Rate</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">${doer.hourly_rate}</p>
                </div>
              )}
              {doer.success_rate !== undefined && (
                <div className="p-3 sm:p-4 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-xl border border-emerald-500/30">
                  <p className="text-xs text-emerald-300 mb-1">Success Rate</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">{doer.success_rate}%</p>
                </div>
              )}
            </div>

            {/* Status & Work Arrangement */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30 text-xs sm:text-sm px-3 sm:px-4 py-1">
                {doer.availability_status}
              </Badge>
              {doer.work_arrangement && (
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs sm:text-sm px-3 sm:px-4 py-1">
                  {doer.work_arrangement}
                </Badge>
              )}
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {doer.email && (
                <div className="flex items-center gap-3 p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-400">Email</p>
                    <p className="font-medium text-white text-xs sm:text-sm truncate">{doer.email}</p>
                  </div>
                </div>
              )}
              {doer.phone && (
                <div className="flex items-center gap-3 p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-400">Phone</p>
                    <p className="font-medium text-white text-xs sm:text-sm truncate">{doer.phone}</p>
                  </div>
                </div>
              )}
              {doer.whatsapp_number && (
                <div className="flex items-center gap-3 p-3 sm:p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-emerald-300">WhatsApp</p>
                    <p className="font-medium text-white text-xs sm:text-sm truncate">{doer.whatsapp_number}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Location & Timezone */}
            {doer.country && (
              <div className="p-4 sm:p-5 bg-gradient-to-br from-teal-500/10 to-blue-500/10 rounded-xl border border-teal-500/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
                    <span className="font-semibold text-white text-sm sm:text-base">{doer.country}</span>
                  </div>
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-teal-300 break-words">
                  {getLocalTime(doer.country)}
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">Current local time</p>
              </div>
            )}

            {/* Skills */}
            {doer.skills && doer.skills.length > 0 && (
              <div>
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {doer.skills.map((skill, idx) => (
                    <Badge key={idx} className="bg-teal-500/20 text-teal-300 border-teal-500/30 text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Technologies */}
            {doer.technologies && doer.technologies.length > 0 && (
              <div>
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {doer.technologies.map((tech, idx) => (
                    <Badge key={idx} className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Platform Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {doer.fiverr_profile && (
                <a
                  href={doer.fiverr_profile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 sm:p-4 bg-green-500/10 hover:bg-green-500/20 rounded-xl border border-green-500/30 transition-colors group"
                >
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-green-300">Fiverr Profile</p>
                    <p className="text-xs sm:text-sm text-white group-hover:text-green-300 transition-colors truncate">View Profile</p>
                  </div>
                </a>
              )}
              {doer.upwork_profile && (
                <a
                  href={doer.upwork_profile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 sm:p-4 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl border border-blue-500/30 transition-colors group"
                >
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-blue-300">Upwork Profile</p>
                    <p className="text-xs sm:text-sm text-white group-hover:text-blue-300 transition-colors truncate">View Profile</p>
                  </div>
                </a>
              )}
            </div>

            {/* Portfolio Links */}
            {doer.portfolio_links && doer.portfolio_links.length > 0 && (
              <div>
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
                  Portfolio & Work Samples
                </h3>
                <div className="space-y-2">
                  {doer.portfolio_links.map((link, idx) => {
                    const url = getPortfolioUrl(link);
                    if (!url) return null;
                    return (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors group border border-slate-700/50"
                      >
                        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-teal-400 group-hover:text-teal-300 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-slate-300 group-hover:text-white truncate">
                          {url}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Notes Section */}
            {doer.notes && (
              <div>
                <h3 className="font-semibold text-white mb-3 text-sm sm:text-base">Notes & Project History</h3>
                <div className="p-3 sm:p-4 bg-slate-800/50 rounded-lg text-xs sm:text-sm text-slate-300 border border-slate-700/50 whitespace-pre-wrap break-words">
                  {doer.notes}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800">
              <Button
                onClick={() => onMessage(doer, 'whatsapp')}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm sm:text-base">Message via WhatsApp</span>
              </Button>
              <Button
                onClick={() => onMessage(doer, 'email')}
                className="flex-1 bg-blue-500 hover:bg-blue-600 gap-2"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm sm:text-base">Send Email</span>
              </Button>
            </div>
          </div>
        ) : (
          <ProjectsTab entityId={doer.id} entityType="doer" />
        )}
      </DialogContent>
    </Dialog>
  );
}