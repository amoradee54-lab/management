import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Heart, MapPin, Clock, Building2, User } from "lucide-react";
import { motion } from "framer-motion";

const statusColors = {
  "Active": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Potential": "bg-blue-100 text-blue-700 border-blue-200",
  "Preferred": "bg-amber-100 text-amber-700 border-amber-200",
  "Archived": "bg-gray-100 text-gray-600 border-gray-200"
};

export default function ClientCard({ client, onToggleFavorite, onViewDetails }) {
  const getTimezoneName = (timezone) => {
    if (!timezone) return null;
    try {
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

  const handleEmail = (e) => {
    e.stopPropagation();
    window.location.href = `mailto:${client.email}`;
  };

  const handleCall = (e) => {
    e.stopPropagation();
    window.location.href = `tel:${client.phone}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className="group relative overflow-hidden bg-white hover:shadow-2xl transition-all duration-300 cursor-pointer border-slate-100"
        onClick={onViewDetails}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-transparent rounded-bl-full" />
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-xl font-semibold shadow-lg overflow-hidden">
                {client.profile_picture ? (
                  <img src={client.profile_picture} alt={client.full_name} className="w-full h-full object-cover" />
                ) : (
                  client.full_name?.charAt(0).toUpperCase()
                )}
              </div>
              
              <div>
                <h3 className="font-bold text-lg text-slate-900 mb-1">{client.full_name}</h3>
                {client.username && (
                  <p className="text-sm text-slate-500 mb-1">@{client.username}</p>
                )}
                {client.job_title && (
                  <p className="text-sm text-slate-600 font-medium">{client.job_title}</p>
                )}
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(client);
              }}
              className="hover:bg-rose-50"
            >
              <Heart 
                className={`w-5 h-5 ${client.is_favorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`}
              />
            </Button>
          </div>

          {/* Company & Industry */}
          <div className="space-y-2 mb-4">
            {client.company_name && (
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-slate-700">{client.company_name}</span>
              </div>
            )}
            {client.industry && (
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                {client.industry}
              </Badge>
            )}
          </div>

          {/* Status */}
          <div className="mb-4">
            <Badge className={`${statusColors[client.status]} border text-xs font-medium`}>
              {client.status}
            </Badge>
          </div>

          {/* Location & Time */}
          <div className="flex items-center gap-4 text-sm text-slate-600 mb-4 pb-4 border-b border-slate-100">
            {client.country && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{client.country}</span>
              </div>
            )}
            {client.timezone && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{getTimezoneName(client.timezone)}</span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            {client.email && (
              <Button
                size="sm"
                onClick={handleEmail}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2"
              >
                <Mail className="w-4 h-4" />
                Email
              </Button>
            )}
            {client.phone && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleCall}
                className="flex-1 border-slate-200 hover:bg-slate-50 gap-2"
              >
                <Phone className="w-4 h-4" />
                Call
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}