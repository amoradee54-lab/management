import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MessageCircle, Mail, Phone, Heart, MapPin, Clock, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const statusColors = {
  "Available": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Busy": "bg-amber-100 text-amber-700 border-amber-200",
  "On Project": "bg-blue-100 text-blue-700 border-blue-200",
  "Archived": "bg-gray-100 text-gray-600 border-gray-200"
};

export default function DoerCard({ doer, onToggleFavorite, onViewDetails }) {
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

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    const cleanNumber = doer.whatsapp_number?.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanNumber}`, '_blank');
  };

  const handleEmail = (e) => {
    e.stopPropagation();
    window.location.href = `mailto:${doer.email}`;
  };

  const handleCall = (e) => {
    e.stopPropagation();
    window.location.href = `tel:${doer.phone}`;
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
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-transparent rounded-bl-full" />
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-xl font-semibold shadow-lg overflow-hidden">
                  {doer.profile_picture ? (
                    <img src={doer.profile_picture} alt={doer.full_name} className="w-full h-full object-cover" />
                  ) : (
                    doer.full_name?.charAt(0).toUpperCase()
                  )}
                </div>
                {doer.rating && (
                  <div className="absolute -bottom-2 -right-2 bg-amber-400 rounded-full px-2 py-0.5 flex items-center gap-0.5 shadow-md">
                    <Star className="w-3 h-3 fill-white text-white" />
                    <span className="text-xs font-bold text-white">{doer.rating}</span>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="font-bold text-lg text-slate-900 mb-1">{doer.full_name}</h3>
                <p className="text-sm text-slate-600 font-medium">{doer.primary_expertise}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={`${statusColors[doer.availability_status]} border text-xs font-medium`}>
                    {doer.availability_status}
                  </Badge>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(doer);
              }}
              className="hover:bg-rose-50"
            >
              <Heart 
                className={`w-5 h-5 ${doer.is_favorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`}
              />
            </Button>
          </div>

          {/* Skills */}
          {doer.skills && doer.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {doer.skills.slice(0, 4).map((skill, idx) => (
                <Badge key={idx} variant="secondary" className="bg-slate-100 text-slate-700 text-xs">
                  {skill}
                </Badge>
              ))}
              {doer.skills.length > 4 && (
                <Badge variant="secondary" className="bg-slate-100 text-slate-700 text-xs">
                  +{doer.skills.length - 4} more
                </Badge>
              )}
            </div>
          )}

          {/* Location & Time */}
          <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
            {doer.country && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{doer.country}</span>
              </div>
            )}
            {doer.timezone && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{getTimezoneName(doer.timezone)}</span>
              </div>
            )}
          </div>

          {/* Rate */}
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100">
            {doer.hourly_rate && (
              <div>
                <span className="text-2xl font-bold text-slate-900">${doer.hourly_rate}</span>
                <span className="text-sm text-slate-500">/hour</span>
              </div>
            )}
            {doer.project_rate && (
              <div>
                <span className="text-lg font-semibold text-slate-700">${doer.project_rate}</span>
                <span className="text-xs text-slate-500">/project</span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            {doer.whatsapp_number && (
              <Button
                size="sm"
                onClick={handleWhatsApp}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </Button>
            )}
            {doer.email && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleEmail}
                className="flex-1 border-slate-200 hover:bg-slate-50 gap-2"
              >
                <Mail className="w-4 h-4" />
                Email
              </Button>
            )}
            {doer.phone && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleCall}
                className="border-slate-200 hover:bg-slate-50"
              >
                <Phone className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}