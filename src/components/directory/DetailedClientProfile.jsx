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

export default function DetailedClientProfile({ 
  client, 
  isOpen, 
  onClose,
  onToggleFavorite,
  onMessage,
  onEdit
}) {
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-blue-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold shadow-2xl shadow-blue-500/30 overflow-hidden">
                {client.profile_picture ? (
                  <img src={client.profile_picture} alt={client.full_name} className="w-full h-full object-cover" />
                ) : (
                  client.full_name?.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{client.full_name}</h2>
                {client.username && (
                  <p className="text-slate-400">@{client.username}</p>
                )}
                <p className="text-blue-300">{client.job_title}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleFavorite(client)}
                className="hover:bg-rose-500/20"
              >
                <Heart 
                  className={`w-6 h-6 ${client.is_favorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`}
                />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="gap-2 border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status Badge */}
          <div>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-sm px-4 py-1.5">
              <TrendingUp className="w-4 h-4 mr-1" />
              {client.status}
            </Badge>
          </div>

          {/* Company Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {client.company_name && (
              <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <Building2 className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-xs text-slate-400">Company</p>
                  <p className="font-medium text-white">{client.company_name}</p>
                </div>
              </div>
            )}
            {client.industry && (
              <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <User className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-xs text-slate-400">Industry</p>
                  <p className="font-medium text-white">{client.industry}</p>
                </div>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {client.email && (
              <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <Mail className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-xs text-slate-400">Email</p>
                  <p className="font-medium text-white text-sm">{client.email}</p>
                </div>
              </div>
            )}
            {client.phone && (
              <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <Phone className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-xs text-slate-400">Phone</p>
                  <p className="font-medium text-white text-sm">{client.phone}</p>
                </div>
              </div>
            )}
            {client.whatsapp_number && (
              <div className="flex items-center gap-3 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/30 md:col-span-2">
                <MessageCircle className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-xs text-emerald-300">WhatsApp</p>
                  <p className="font-medium text-white text-sm">{client.whatsapp_number}</p>
                </div>
              </div>
            )}
          </div>

          {/* Location & Timezone */}
          {client.country && (
            <div className="p-5 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span className="font-semibold text-white">{client.country}</span>
                </div>
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-blue-300">
                {getLocalTime(client.country)}
              </div>
              <p className="text-sm text-slate-400 mt-1">Current local time</p>
            </div>
          )}

          {/* Notes Section */}
          {client.notes && (
            <div>
              <h3 className="font-semibold text-white mb-3">Notes & Project History</h3>
              <div className="p-4 bg-slate-800/50 rounded-lg text-sm text-slate-300 border border-slate-700/50 whitespace-pre-wrap">
                {client.notes}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-800">
            {client.whatsapp_number && (
              <Button
                onClick={() => onMessage(client, 'whatsapp')}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </Button>
            )}
            <Button
              onClick={() => onMessage(client, 'email')}
              className="flex-1 bg-blue-500 hover:bg-blue-600 gap-2"
            >
              <Mail className="w-4 h-4" />
              Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}