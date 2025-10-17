import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Clock, MapPin, Linkedin, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";

const statusColors = {
  "Active": "bg-emerald-400/20 text-emerald-300 border-emerald-400/30",
  "Past Business": "bg-slate-400/20 text-slate-300 border-slate-400/30",
  "Potential": "bg-blue-400/20 text-blue-300 border-blue-400/30",
  "Call Needed": "bg-amber-400/20 text-amber-300 border-amber-400/30"
};

const tagColors = [
  "bg-purple-400/20 text-purple-300 border-purple-400/30",
  "bg-pink-400/20 text-pink-300 border-pink-400/30",
  "bg-orange-400/20 text-orange-300 border-orange-400/30",
  "bg-cyan-400/20 text-cyan-300 border-cyan-400/30",
];

export default function MinimalClientCard({ client, onClick, onWhatsApp, onEmail, onCall, isSelected, onToggleSelect, selectionMode }) {
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
        className="group relative overflow-hidden bg-slate-800/40 backdrop-blur-md border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-blue-500/10 h-full flex flex-col"
        onClick={onClick}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative p-4 flex-1 flex flex-col">
          {/* Selection Checkbox */}
          {selectionMode && (
            <div className="absolute top-2 left-2 z-10">
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => {
                  onToggleSelect(client.id, checked);
                }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-700 border-slate-600"
              />
            </div>
          )}

          {/* Profile Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/30 overflow-hidden ring-2 ring-blue-400/30">
                {client.profile_picture ? (
                  <img src={client.profile_picture} alt={client.full_name} className="w-full h-full object-cover" />
                ) : (
                  client.full_name?.charAt(0).toUpperCase()
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-blue-400 rounded-full border-2 border-slate-800 shadow-lg" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-base truncate">{client.full_name}</h3>
              <p className="text-xs text-blue-300 truncate">
                {client.job_title || client.company_name}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mb-3">
            <Badge className={`${statusColors[client.status]} border text-xs font-semibold px-2 py-0.5`}>
              {client.status}
            </Badge>
          </div>

          {/* Country & Time - Always show */}
          <div className="mb-3 min-h-[2.5rem] flex flex-col gap-1">
            {client.country ? (
              <>
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>{client.country}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{getLocalTime(client.country)}</span>
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
          {client.tags && client.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {client.tags.slice(0, 2).map((tag, idx) => (
                <Badge key={idx} className={`${getTagColor(idx)} border text-[10px] px-1.5 py-0.5`}>
                  {tag}
                </Badge>
              ))}
              {client.tags.length > 2 && (
                <Badge className="bg-slate-700/50 text-slate-300 border-slate-600 text-[10px] px-1.5 py-0.5">
                  +{client.tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* All Icon Buttons in One Row */}
          <div className="flex items-center justify-center gap-1 flex-wrap pt-2 border-t border-slate-700/50">
            {client.phone && (
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onCall(client);
                }}
                className="h-8 w-8 hover:bg-slate-700/50 text-slate-300"
                title="Call"
              >
                <Phone className="w-4 h-4" />
              </Button>
            )}
            {client.email && (
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onEmail(client);
                }}
                className="h-8 w-8 hover:bg-blue-500/20 text-blue-400"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </Button>
            )}
            {client.whatsapp_number && (
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onWhatsApp(client);
                }}
                className="h-8 w-8 hover:bg-emerald-500/20 text-emerald-400"
                title="WhatsApp"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </Button>
            )}
            {client.linkedin_url && (
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(client.linkedin_url, '_blank');
                }}
                className="h-8 w-8 hover:bg-blue-500/20 text-blue-400"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </Button>
            )}
            {client.website_url && (
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(client.website_url, '_blank');
                }}
                className="h-8 w-8 hover:bg-cyan-500/20 text-cyan-400"
                title="Website"
              >
                <Globe className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}