import React, { useState } from "react";
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
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AddDoerModal({ isOpen, onClose, onSave, configurations }) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    whatsapp_number: "",
    primary_expertise: "",
    availability_status: "Available",
    work_arrangement: "",
    hourly_rate: "",
    project_rate: "",
    rating: "",
    country: "",
    fiverr_profile: "",
    upwork_profile: "",
    notes: "",
    skills: [],
    technologies: [],
    portfolio_links: []
  });
  const [currentSkill, setCurrentSkill] = useState("");
  const [currentTech, setCurrentTech] = useState("");
  const [currentLink, setCurrentLink] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleAddSkill = () => {
    if (currentSkill.trim()) {
      setFormData({ ...formData, skills: [...formData.skills, currentSkill.trim()] });
      setCurrentSkill("");
    }
  };

  const handleAddTechnology = () => {
    if (currentTech.trim()) {
      setFormData({ ...formData, technologies: [...formData.technologies, currentTech.trim()] });
      setCurrentTech("");
    }
  };

  const handleAddLink = () => {
    if (currentLink.trim()) {
      setFormData({ ...formData, portfolio_links: [...formData.portfolio_links, currentLink.trim()] });
      setCurrentLink("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const dataToSave = {
      ...formData,
      hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : undefined,
      project_rate: formData.project_rate ? parseFloat(formData.project_rate) : undefined,
      rating: formData.rating ? parseFloat(formData.rating) : undefined,
      projects_completed: 0,
      success_rate: 100
    };
    await onSave(dataToSave);
    setIsSaving(false);
    setFormData({
      full_name: "",
      email: "",
      phone: "",
      whatsapp_number: "",
      primary_expertise: "",
      availability_status: "Available",
      work_arrangement: "",
      hourly_rate: "",
      project_rate: "",
      rating: "",
      country: "",
      fiverr_profile: "",
      upwork_profile: "",
      notes: "",
      skills: [],
      technologies: [],
      portfolio_links: []
    });
  };

  const availabilityOptions = configurations?.find(c => c.category === "availability")?.values || [];
  const workArrangementOptions = configurations?.find(c => c.category === "work_arrangement")?.values || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border-teal-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-teal-300">Add New Doer</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
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
            <div>
              <Label className="text-teal-300">Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div>
              <Label className="text-teal-300">Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div>
              <Label className="text-teal-300">WhatsApp Number</Label>
              <Input
                value={formData.whatsapp_number}
                onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div>
              <Label className="text-teal-300">Country</Label>
              <Input
                value={formData.country}
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
                value={formData.work_arrangement}
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
            <div>
              <Label className="text-teal-300">Project Rate ($)</Label>
              <Input
                type="number"
                value={formData.project_rate}
                onChange={(e) => setFormData({ ...formData, project_rate: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div>
              <Label className="text-teal-300">Rating (0-5)</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>

          <div>
            <Label className="text-teal-300">Fiverr Profile URL</Label>
            <Input
              value={formData.fiverr_profile}
              onChange={(e) => setFormData({ ...formData, fiverr_profile: e.target.value })}
              placeholder="https://fiverr.com/username"
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div>
            <Label className="text-teal-300">Upwork Profile URL</Label>
            <Input
              value={formData.upwork_profile}
              onChange={(e) => setFormData({ ...formData, upwork_profile: e.target.value })}
              placeholder="https://upwork.com/freelancers/username"
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          {/* Skills */}
          <div>
            <Label className="text-teal-300 mb-2 block">Skills</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                placeholder="e.g., Web Development, UI/UX Design"
                className="bg-slate-800 border-slate-700 text-white"
              />
              <Button type="button" onClick={handleAddSkill} className="bg-teal-500 hover:bg-teal-600">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, idx) => (
                <Badge key={idx} className="bg-teal-500/20 text-teal-300 border-teal-500/30">
                  {skill}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, skills: formData.skills.filter((_, i) => i !== idx) })}
                    className="ml-2"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Technologies */}
          <div>
            <Label className="text-teal-300 mb-2 block">Technologies</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={currentTech}
                onChange={(e) => setCurrentTech(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechnology())}
                placeholder="e.g., React, Python, Figma"
                className="bg-slate-800 border-slate-700 text-white"
              />
              <Button type="button" onClick={handleAddTechnology} className="bg-teal-500 hover:bg-teal-600">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.technologies.map((tech, idx) => (
                <Badge key={idx} className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  {tech}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, technologies: formData.technologies.filter((_, i) => i !== idx) })}
                    className="ml-2"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
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
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Project history, preferences, etc."
              className="bg-slate-800 border-slate-700 text-white min-h-24"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="border-slate-700 text-slate-300">
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving} className="bg-teal-500 hover:bg-teal-600">
              {isSaving ? "Saving..." : "Add Doer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}