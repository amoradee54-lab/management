import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Star, MessageCircle, Mail, Phone, Heart, MapPin, Clock, 
  ExternalLink, Edit2, Save, X, Building2, User, Calendar
} from "lucide-react";
import { format } from "date-fns";

export default function ProfileModal({ 
  profile, 
  isOpen, 
  onClose, 
  type,
  onUpdate 
}) {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(profile?.notes || "");
  const [isSaving, setIsSaving] = useState(false);

  const isDoer = type === "doer";

  if (!profile) return null;

  const handleSaveNotes = async () => {
    setIsSaving(true);
    await onUpdate(profile.id, { notes });
    setIsEditingNotes(false);
    setIsSaving(false);
  };

  const getFullTime = (timezone) => {
    if (!timezone) return null;
    try {
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-2xl font-semibold overflow-hidden">
              {profile.profile_picture ? (
                <img src={profile.profile_picture} alt={profile.full_name} className="w-full h-full object-cover" />
              ) : (
                profile.full_name?.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{profile.full_name}</h2>
              {profile.username && (
                <p className="text-sm text-slate-500">@{profile.username}</p>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.email && (
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Mail className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="font-medium text-slate-900">{profile.email}</p>
                </div>
              </div>
            )}
            {profile.phone && (
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Phone className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="font-medium text-slate-900">{profile.phone}</p>
                </div>
              </div>
            )}
            {profile.whatsapp_number && (
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-xs text-emerald-600">WhatsApp</p>
                  <p className="font-medium text-slate-900">{profile.whatsapp_number}</p>
                </div>
              </div>
            )}
            {profile.country && (
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <MapPin className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="text-xs text-slate-500">Location</p>
                  <p className="font-medium text-slate-900">{profile.country}</p>
                </div>
              </div>
            )}
          </div>

          {/* Timezone */}
          {profile.timezone && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-slate-900">Local Time</span>
              </div>
              <p className="text-lg font-bold text-blue-900">{getFullTime(profile.timezone)}</p>
              <p className="text-sm text-slate-600 mt-1">{profile.timezone}</p>
            </div>
          )}

          {/* Doer-specific info */}
          {isDoer && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {profile.hourly_rate && (
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-xs text-amber-700 mb-1">Hourly Rate</p>
                    <p className="text-2xl font-bold text-amber-900">${profile.hourly_rate}</p>
                  </div>
                )}
                {profile.project_rate && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-xs text-green-700 mb-1">Project Rate</p>
                    <p className="text-2xl font-bold text-green-900">${profile.project_rate}</p>
                  </div>
                )}
                {profile.rating && (
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-xs text-yellow-700 mb-1">Rating</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                      <p className="text-2xl font-bold text-yellow-900">{profile.rating}</p>
                    </div>
                  </div>
                )}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-700 mb-1">Status</p>
                  <p className="text-sm font-bold text-blue-900">{profile.availability_status}</p>
                </div>
              </div>

              {profile.primary_expertise && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Primary Expertise</h3>
                  <Badge className="bg-slate-900 text-white">
                    {profile.primary_expertise}
                  </Badge>
                </div>
              )}

              {profile.skills && profile.skills.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-slate-100 text-slate-700">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile.portfolio_links && profile.portfolio_links.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Portfolio & Work Samples</h3>
                  <div className="space-y-2">
                    {profile.portfolio_links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors group"
                      >
                        <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-blue-600" />
                        <span className="text-sm text-slate-700 group-hover:text-blue-600 truncate">
                          {link}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Client-specific info */}
          {!isDoer && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.job_title && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <User className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="text-xs text-slate-500">Job Title</p>
                      <p className="font-medium text-slate-900">{profile.job_title}</p>
                    </div>
                  </div>
                )}
                {profile.company_name && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Building2 className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="text-xs text-slate-500">Company</p>
                      <p className="font-medium text-slate-900">{profile.company_name}</p>
                    </div>
                  </div>
                )}
                {profile.industry && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg col-span-full">
                    <div>
                      <p className="text-xs text-blue-600">Industry</p>
                      <p className="font-medium text-slate-900">{profile.industry}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Status</p>
                <Badge className="bg-slate-900 text-white">
                  {profile.status}
                </Badge>
              </div>
            </>
          )}

          {/* Last Contact */}
          {profile.last_contact_date && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Calendar className="w-4 h-4" />
              <span>Last Contact: {format(new Date(profile.last_contact_date), "MMM d, yyyy")}</span>
            </div>
          )}

          {/* Notes Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-900">Notes & Project History</h3>
              {!isEditingNotes ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingNotes(true)}
                  className="gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditingNotes(false);
                      setNotes(profile.notes || "");
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveNotes}
                    disabled={isSaving}
                    className="bg-slate-900 hover:bg-slate-800 gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </Button>
                </div>
              )}
            </div>
            {isEditingNotes ? (
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about projects, communication, preferences..."
                className="min-h-32 border-slate-200"
              />
            ) : (
              <div className="p-4 bg-slate-50 rounded-lg min-h-24 text-sm text-slate-700">
                {profile.notes || "No notes added yet"}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}