import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { base44 } from "@/api/base44Client";

export default function EditDoerModal({ doer, isOpen, onClose, onSave, configurations }) {
  const [formData, setFormData] = useState(null);
  const [emails, setEmails] = useState([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [currentLink, setCurrentLink] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (doer) {
      // Normalize portfolio_links
      let portfolioLinks = doer.portfolio_links || [];
      if (Array.isArray(portfolioLinks)) {
        portfolioLinks = portfolioLinks.map(link => {
          if (typeof link === 'string') return link;
          if (typeof link === 'object' && link !== null && 'url' in link && typeof link.url === 'string') return link.url;
          return null;
        }).filter(Boolean);
      } else {
        portfolioLinks = [];
      }

      // Parse multiple emails
      const emailList = doer.email ? doer.email.split(',').map(e => e.trim()).filter(Boolean) : [];
      setEmails(emailList);

      setFormData({
        ...doer,
        hourly_rate: doer.hourly_rate?.toString() || "",
        skills: doer.skills || [],
        technologies: doer.technologies || [],
        portfolio_links: portfolioLinks
      });
    }
  }, [doer]);

  if (!formData) return null;

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, profile_picture: file_url });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddEmail = () => {
    if (currentEmail.trim() && !emails.includes(currentEmail.trim())) {
      setEmails([...emails, currentEmail.trim()]);
      setCurrentEmail("");
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    setEmails(emails.filter(e => e !== emailToRemove));
  };

  const handleAddLink = () => {
    if (currentLink.trim()) {
      setFormData({ ...formData, portfolio_links: [...formData.portfolio_links, currentLink.trim()] });
      setCurrentLink("");
    }
  };

  const handleSkillToggle = (skill) => {
    const currentSkills = formData.skills || [];
    if (currentSkills.includes(skill)) {
      setFormData({ ...formData, skills: currentSkills.filter(s => s !== skill) });
    } else {
      setFormData({ ...formData, skills: [...currentSkills, skill] });
    }
  };

  const handleTechnologyToggle = (tech) => {
    const currentTech = formData.technologies || [];
    if (currentTech.includes(tech)) {
      setFormData({ ...formData, technologies: currentTech.filter(t => t !== tech) });
    } else {
      setFormData({ ...formData, technologies: [...currentTech, tech] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const dataToSave = {
      ...formData,
      email: emails.join(', '),
      hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : undefined
    };
    await onSave(doer.id, dataToSave);
    setIsSaving(false);
  };

  const availabilityOptions = configurations?.find(c => c.category === "availability")?.values || [];
  const workArrangementOptions = configurations?.find(c => c.category === "work_arrangement")?.values || [];
  const skillOptions = configurations?.find(c => c.category === "skills")?.values || [];
  const technologyOptions = configurations?.find(c => c.category === "technologies")?.values || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border-teal-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-teal-300">Edit Doer</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Profile Picture Upload */}
          <div>
            <Label className="text-teal-300 mb-2 block">Profile Picture</Label>
            <div className="flex items-center gap-4">
              {formData.profile_picture && (
                <div className="relative w-20 h-20 rounded-xl overflow-hidden">
                  <img src={formData.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, profile_picture: "" })}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <label className="cursor-pointer">
                <div className="px-4 py-2 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 rounded-lg text-teal-300 flex items-center gap-2 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">{isUploading ? "Uploading..." : "Upload Photo"}</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-teal-300">Full Name *</Label>
              <Input
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div>
              <Label className="text-teal-300">Primary Expertise *</Label>
              <Input
                required
                value={formData.primary_expertise}
                onChange={(e) => setFormData({ ...formData, primary_expertise: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>

          {/* Multiple Email Addresses */}
          <div>
            <Label className="text-teal-300 mb-2 block">Email Addresses</Label>
            <div className="flex gap-2 mb-2">
              <Input
                type="email"
                value={currentEmail}
                onChange={(e) => setCurrentEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEmail())}
                placeholder="email@example.com"
                className="bg-slate-800 border-slate-700 text-white"
              />
              <Button type="button" onClick={handleAddEmail} className="bg-teal-500 hover:bg-teal-600">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              {emails.map((email, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-slate-800 rounded border border-slate-700">
                  <span className="flex-1 text-sm text-white truncate">{email}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(email)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-teal-300">Phone</Label>
              <Input
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div>
              <Label className="text-teal-300">WhatsApp Number</Label>
              <Input
                value={formData.whatsapp_number || ""}
                onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div>
              <Label className="text-teal-300">Telegram Username</Label>
              <Input
                value={formData.telegram_username || ""}
                onChange={(e) => setFormData({ ...formData, telegram_username: e.target.value })}
                placeholder="@username"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div>
              <Label className="text-teal-300">Country</Label>
              <Input
                value={formData.country || ""}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div>
              <Label className="text-teal-300">Availability Status</Label>
              <Select
                value={formData.availability_status}
                onValueChange={(value) => setFormData({ ...formData, availability_status: value })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availabilityOptions.map(opt => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-teal-300">Work Arrangement</Label>
              <Select
                value={formData.work_arrangement || ""}
                onValueChange={(value) => setFormData({ ...formData, work_arrangement: value })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {workArrangementOptions.map(opt => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-teal-300">Hourly Rate ($)</Label>
              <Input
                type="number"
                value={formData.hourly_rate}
                onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>

          <div>
            <Label className="text-teal-300">Fiverr Profile URL</Label>
            <Input
              value={formData.fiverr_profile || ""}
              onChange={(e) => setFormData({ ...formData, fiverr_profile: e.target.value })}
              placeholder="https://fiverr.com/username"
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div>
            <Label className="text-teal-300">Upwork Profile URL</Label>
            <Input
              value={formData.upwork_profile || ""}
              onChange={(e) => setFormData({ ...formData, upwork_profile: e.target.value })}
              placeholder="https://upwork.com/freelancers/username"
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          {/* Skills - Checkboxes from Configuration */}
          <div>
            <Label className="text-teal-300 mb-3 block">Skills</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              {skillOptions.map((skill) => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox
                    id={`skill-${skill}`}
                    checked={formData.skills?.includes(skill)}
                    onCheckedChange={() => handleSkillToggle(skill)}
                  />
                  <label
                    htmlFor={`skill-${skill}`}
                    className="text-sm text-white cursor-pointer"
                  >
                    {skill}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Technologies - Checkboxes from Configuration */}
          <div>
            <Label className="text-teal-300 mb-3 block">Technologies</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              {technologyOptions.map((tech) => (
                <div key={tech} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tech-${tech}`}
                    checked={formData.technologies?.includes(tech)}
                    onCheckedChange={() => handleTechnologyToggle(tech)}
                  />
                  <label
                    htmlFor={`tech-${tech}`}
                    className="text-sm text-white cursor-pointer"
                  >
                    {tech}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio Links */}
          <div>
            <Label className="text-teal-300 mb-2 block">Portfolio Links</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={currentLink}
                onChange={(e) => setCurrentLink(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLink())}
                placeholder="https://..."
                className="bg-slate-800 border-slate-700 text-white"
              />
              <Button type="button" onClick={handleAddLink} className="bg-teal-500 hover:bg-teal-600">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              {formData.portfolio_links.map((link, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-slate-800 rounded border border-slate-700">
                  <span className="flex-1 text-sm text-white truncate">{link}</span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, portfolio_links: formData.portfolio_links.filter((_, i) => i !== idx) })}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-teal-300">Notes</Label>
            <Textarea
              value={formData.notes || ""}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white min-h-24"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="border-slate-700 text-slate-300">
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving || isUploading} className="bg-teal-500 hover:bg-teal-600">
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}