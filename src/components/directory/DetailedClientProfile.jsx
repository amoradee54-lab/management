
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
  Mail, Phone, Heart, MapPin, Clock, Building2, User, MessageCircle,
  Edit2, TrendingUp
} from "lucide-react";
import ProjectsTab from "../projects/ProjectsTab";

export default function DetailedClientProfile({
  client,
  isOpen,
  onClose,
  onToggleFavorite,
  onMessage,
  onEdit
}) {
  const [activeTab, setActiveTab] = React.useState("details");

  if (!client) return null;

  const getLocalTime = (country) => {
    if (!country) return null;
    try {
      const timezones = {
        "United States": "America/New_York",
        "United Kingdom": "Europe/London",
        "Spain": "Europe/Madrid",
        "South Korea": "Asia/Seoul",
        "Germany": "Europe/Berlin",
        "France": "Europe/Paris",
        "Brazil": "America/Sao_Paulo",
        "Japan": "Asia/Tokyo",
        "China": "Asia/Shanghai",
        "India": "Asia/Kolkata"
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] lg:max-w-6xl max-h-[90vh] overflow-y-auto overflow-x-hidden bg-slate-900 border-blue-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-2xl shadow-blue-500/30 overflow-hidden flex-shrink-0">
                {client.profile_picture ? (
                  <img src={client.profile_picture} alt={client.full_name} className="w-full h-full object-cover" />
                ) : (
                  client.full_name?.charAt(0).toUpperCase()
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{client.full_name}</h2>
                {client.username && (
                  <p className="text-slate-400 text-sm truncate">@{client.username}</p>
                )}
                <p className="text-blue-300 text-sm sm:text-base truncate">{client.job_title}</p>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleFavorite(client)}
                className="hover:bg-rose-500/20"
              >
                <Heart
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${client.is_favorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`}
                />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="gap-2 border-blue-500/30 text-blue-300 hover:bg-blue-500/10 flex-1 sm:flex-initial"
              >
                <Edit2 className="w-4 h-4" />
                <span className="sm:inline">Edit</span>
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
                  ? "border-blue-400 text-blue-300"
                  : "border-transparent text-slate-400 hover:text-slate-300"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`pb-3 px-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === "projects"
                  ? "border-blue-400 text-blue-300"
                  : "border-transparent text-slate-400 hover:text-slate-300"
              }`}
            >
              Projects
            </button>
          </div>
        </div>

        {activeTab === "details" ? (
          <div className="space-y-4 sm:space-y-6 py-4">
            {/* Status Badge */}
            <div>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs sm:text-sm px-3 sm:px-4 py-1.5">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {client.status}
              </Badge>
            </div>

            {/* Company Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {client.company_name && (
                <div className="flex items-center gap-3 p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-400">Company</p>
                    <p className="font-medium text-white text-sm truncate">{client.company_name}</p>
                  </div>
                </div>
              )}
              {client.industry && (
                <div className="flex items-center gap-3 p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-400">Industry</p>
                    <p className="font-medium text-white text-sm truncate">{client.industry}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {client.email && (
                <div className="flex items-center gap-3 p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-400">Email</p>
                    <p className="font-medium text-white text-xs sm:text-sm break-all">{client.email}</p>
                  </div>
                </div>
              )}
              {client.phone && (
                <div className="flex items-center gap-3 p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-400">Phone</p>
                    <p className="font-medium text-white text-xs sm:text-sm">{client.phone}</p>
                  </div>
                </div>
              )}
              {client.whatsapp_number && (
                <div className="flex items-center gap-3 p-3 sm:p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-emerald-300">WhatsApp</p>
                    <p className="font-medium text-white text-xs sm:text-sm">{client.whatsapp_number}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Platform Links */}
            {(client.linkedin_url || client.website_url || client.fiverr_profile || client.upwork_profile) && (
              <div>
                <h3 className="font-semibold text-white mb-3 text-sm sm:text-base">Platform Links</h3>
                <div className="grid grid-cols-2 gap-3">
                  {client.linkedin_url && (
                    <a
                      href={client.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center text-center gap-1 p-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg border border-blue-500/30 transition-colors"
                    >
                      <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      <span className="text-[10px] sm:text-xs text-blue-300">LinkedIn</span>
                    </a>
                  )}
                  
                  {client.website_url && (
                    <a
                      href={client.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center text-center gap-1 p-3 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg border border-purple-500/30 transition-colors"
                    >
                      <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="2" y1="12" x2="22" y2="12"/>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                      </svg>
                      <span className="text-[10px] sm:text-xs text-purple-300">Website</span>
                    </a>
                  )}

                  {client.fiverr_profile && (
                    <a
                      href={client.fiverr_profile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center text-center gap-1 p-3 bg-green-500/10 hover:bg-green-500/20 rounded-lg border border-green-500/30 transition-colors"
                    >
                      <svg className="w-5 h-5 text-green-400" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M13 13V5H5v-.5C5 3.673 5.673 3 6.5 3H8V0H6.5A4.5 4.5 0 0 0 2 4.5V5H0v3h2v5H0v3h7v-3H5V8h5.028v5H8v3h7v-3h-2z"/>
                        <circle cx="11.5" cy="1.5" r="1.5"/>
                      </svg>
                      <span className="text-[10px] sm:text-xs text-green-300">Fiverr</span>
                    </a>
                  )}

                  {client.upwork_profile && (
                    <a
                      href={client.upwork_profile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center text-center gap-1 p-3 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg border border-emerald-500/30 transition-colors"
                    >
                      <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 56.7 56.7" fill="currentColor">
                        <path d="M42.4 17.7c-5.3 0-9.3 3.5-10.9 9-2.5-3.9-4.5-8.3-5.6-12.1h-5.6v14.9c0 2.8-2.3 5.1-5.1 5.1s-5.1-2.3-5.1-5.1V14.6H4.3v14.9c0 6.1 4.9 11.1 11.1 11.1 6.1 0 11.1-4.9 11.1-11.1v-2.5c1 2.2 2.2 4.4 3.6 6.4l-3.3 15.7h5.9l2.4-11.4c2.2 1.4 4.7 2.2 7.4 2.2 6.1 0 11.1-5.3 11.1-12s-5-10.2-11.2-10.2zm0 17.3c-2.4 0-4.6-1-6.5-2.7l.5-2 .1-.3c.4-2.4 1.9-6.5 6.1-6.5 3.2 0 5.8 2.6 5.8 5.8s-2.7 5.7-6 5.7z"/>
                      </svg>
                      <span className="text-[10px] sm:text-xs text-emerald-300">Upwork</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Location & Timezone */}
            {client.country && (
              <div className="p-4 sm:p-5 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                    <span className="font-semibold text-white text-sm sm:text-base">{client.country}</span>
                  </div>
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-blue-300 break-words">
                  {getLocalTime(client.country)}
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">Current local time</p>
              </div>
            )}

            {/* Notes Section */}
            {client.notes && (
              <div>
                <h3 className="font-semibold text-white mb-3 text-sm sm:text-base">Notes & Project History</h3>
                <div className="p-3 sm:p-4 bg-slate-800/50 rounded-lg text-xs sm:text-sm text-slate-300 border border-slate-700/50 whitespace-pre-wrap break-words">
                  {client.notes}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800">
              {client.whatsapp_number && (
                <Button
                  onClick={() => onMessage(client, 'whatsapp')}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm sm:text-base">WhatsApp</span>
                </Button>
              )}
              <Button
                onClick={() => onMessage(client, 'email')}
                className="flex-1 bg-blue-500 hover:bg-blue-600 gap-2"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm sm:text-base">Email</span>
              </Button>
            </div>
          </div>
        ) : (
          <ProjectsTab entityId={client.id} entityType="client" />
        )}
      </DialogContent>
    </Dialog>
  );
}
