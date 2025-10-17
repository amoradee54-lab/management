import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Star, Clock, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";

const statusColors = {
  "Available": "bg-emerald-400/20 text-emerald-300 border-emerald-400/30",
  "Busy": "bg-amber-400/20 text-amber-300 border-amber-400/30",
  "On Project": "bg-blue-400/20 text-blue-300 border-blue-400/30",
  "Archived": "bg-slate-400/20 text-slate-300 border-slate-400/30"
};

const tagColors = [
  "bg-purple-400/20 text-purple-300 border-purple-400/30",
  "bg-pink-400/20 text-pink-300 border-pink-400/30",
  "bg-orange-400/20 text-orange-300 border-orange-400/30",
  "bg-cyan-400/20 text-cyan-300 border-cyan-400/30",
];

export default function MinimalDoerCard({ doer, onClick, onWhatsApp, onTelegram, onEmail, onCall, onToggleFavorite, isSelected, onToggleSelect, selectionMode }) {
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
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      return formatter.format(now);
    } catch {
      return null;
    }
  };

  const getTagColor = (index) => tagColors[index % tagColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="group relative overflow-hidden bg-slate-800/40 backdrop-blur-md border-teal-500/20 hover:border-teal-400/40 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-teal-500/10 h-full flex flex-col"
        onClick={onClick}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative p-4 flex-1 flex flex-col">
          {/* Selection Checkbox */}
          {selectionMode && (
            <div className="absolute top-2 left-2 z-10">
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => {
                  onToggleSelect(doer.id, checked);
                }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-700 border-slate-600"
              />
            </div>
          )}

          {/* Header with Profile & Favorite */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-teal-500/30 overflow-hidden ring-2 ring-teal-400/30">
                  {doer.profile_picture ? (
                    <img src={doer.profile_picture} alt={doer.full_name} className="w-full h-full object-cover" />
                  ) : (
                    doer.full_name?.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-800 shadow-lg" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-base truncate">{doer.full_name}</h3>
                <p className="text-xs text-teal-300 truncate">{doer.primary_expertise}</p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(doer);
              }}
              className="p-1.5 hover:bg-amber-500/10 rounded-lg transition-colors flex-shrink-0"
            >
              <Star 
                className={`w-5 h-5 ${doer.is_favorite ? 'fill-amber-400 text-amber-400' : 'text-slate-500'}`}
              />
            </button>
          </div>

          {/* Status Badge */}
          <div className="mb-3">
            <Badge className={`${statusColors[doer.availability_status]} border text-xs font-semibold px-2 py-0.5`}>
              {doer.availability_status}
            </Badge>
          </div>

          {/* Country & Time - Always show */}
          <div className="mb-3 min-h-[2.5rem] flex flex-col gap-1">
            {doer.country ? (
              <>
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  <span>{doer.country}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{getLocalTime(doer.country)}</span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5" />
                <span>No location set</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {doer.tags && doer.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {doer.tags.slice(0, 2).map((tag, idx) => (
                <Badge key={idx} className={`${getTagColor(idx)} border text-[10px] px-1.5 py-0.5`}>
                  {tag}
                </Badge>
              ))}
              {doer.tags.length > 2 && (
                <Badge className="bg-slate-700/50 text-slate-300 border-slate-600 text-[10px] px-1.5 py-0.5">
                  +{doer.tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* All Icon Buttons in One Row */}
          <div className="flex items-center justify-center gap-1 flex-wrap pt-2 border-t border-slate-700/50">
            {doer.phone && (
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onCall(doer);
                }}
                className="h-8 w-8 hover:bg-slate-700/50 text-slate-300"
                title="Call"
              >
                <Phone className="w-4 h-4" />
              </Button>
            )}
            {doer.email && (
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onEmail(doer);
                }}
                className="h-8 w-8 hover:bg-cyan-500/20 text-cyan-400"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </Button>
            )}
            {doer.whatsapp_number && (
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onWhatsApp(doer);
                }}
                className="h-8 w-8 hover:bg-emerald-500/20 text-emerald-400"
                title="WhatsApp"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </Button>
            )}
            {doer.telegram_username && (
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onTelegram(doer);
                }}
                className="h-8 w-8 hover:bg-blue-500/20 text-blue-400"
                title="Telegram"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.053 5.56-5.023c.242-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                </svg>
              </Button>
            )}
            {doer.fiverr_profile && (
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(doer.fiverr_profile, '_blank');
                }}
                className="h-8 w-8 hover:bg-green-500/20 text-green-400"
                title="Fiverr"
              >
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 13V5H5v-.5C5 3.673 5.673 3 6.5 3H8V0H6.5A4.5 4.5 0 0 0 2 4.5V5H0v3h2v5H0v3h7v-3H5V8h5.028v5H8v3h7v-3h-2z"/>
                  <circle cx="11.5" cy="1.5" r="1.5"/>
                </svg>
              </Button>
            )}
            {doer.upwork_profile && (
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(doer.upwork_profile, '_blank');
                }}
                className="h-8 w-8 hover:bg-emerald-500/20 text-emerald-400"
                title="Upwork"
              >
                <svg className="w-4 h-4" viewBox="0 0 56.7 56.7" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M42.4 17.7c-5.3 0-9.3 3.5-10.9 9-2.5-3.9-4.5-8.3-5.6-12.1h-5.6v14.9c0 2.8-2.3 5.1-5.1 5.1s-5.1-2.3-5.1-5.1V14.6H4.3v14.9c0 6.1 4.9 11.1 11.1 11.1 6.1 0 11.1-4.9 11.1-11.1v-2.5c1 2.2 2.2 4.4 3.6 6.4l-3.3 15.7h5.9l2.4-11.4c2.2 1.4 4.7 2.2 7.4 2.2 6.1 0 11.1-5.3 11.1-12s-5-10.2-11.2-10.2zm0 17.3c-2.4 0-4.6-1-6.5-2.7l.5-2 .1-.3c.4-2.4 1.9-6.5 6.1-6.5 3.2 0 5.8 2.6 5.8 5.8s-2.7 5.7-6 5.7z"/>
                </svg>
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}