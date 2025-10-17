
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
import { Checkbox } from "@/components/ui/checkbox"; // Added Checkbox import
import { Plus, X, Upload } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function EditClientModal({ client, isOpen, onClose, onSave, configurations }) {
  const [formData, setFormData] = useState(null);
  const [emails, setEmails] = useState([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (client) {
      // Parse multiple emails
      const emailList = client.email ? client.email.split(',').map(e => e.trim()).filter(Boolean) : [];
      setEmails(emailList);

      // Parse tags, ensuring it's an array
      const initialTags = client.tags ? (Array.isArray(client.tags) ? client.tags : client.tags.split(',').map(t => t.trim()).filter(Boolean)) : [];

      setFormData({
        ...client,
        tags: initialTags // Ensure tags is an array
      });
    }
  }, [client]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const dataToSave = {
      ...formData,
      email: emails.join(', '),
      tags: formData.tags ? formData.tags.join(', ') : '' // Join tags for submission
    };
    await onSave(client.id, dataToSave);
    setIsSaving(false);
  };

  const clientStatusOptions = configurations?.find(c => c.category === "client_status")?.values || [];
  const clientTagOptions = configurations?.find(c => c.category === "client_tags")?.values || []; // Added clientTagOptions

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border-blue-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-blue-300">Edit Client</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Profile Picture Upload */}
          <div>
            <Label className="text-blue-300 mb-2 block">Profile Picture</Label>
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
                <div className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-300 flex items-center gap-2 transition-colors">
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
              <Label className="text-blue-300">Full Name *</Label>
              <Input
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div>
              <Label className="text-blue-300">Username</Label>
              <Input
                value={formData.username || ""}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div>
              <Label className="text-blue-300">Job Title</Label>
              <Input
                value={formData.job_title || ""}
                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div>
              <Label className="text-blue-300">Company Name</Label>
              <Input
                value={formData.company_name || ""}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>

          {/* Tags - Checkboxes from Configuration */}
          <div>
            <Label className="text-blue-300 mb-3 block">Tags</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              {clientTagOptions.map((tag) => (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-${tag}`}
                    checked={formData.tags?.includes(tag)}
                    onCheckedChange={(checked) => {
                      const currentTags = formData.tags || [];
                      if (checked) {
                        setFormData({ ...formData, tags: [...currentTags, tag] });
                      } else {
                        setFormData({ ...formData, tags: currentTags.filter(t => t !== tag) });
                      }
                    }}
                  />
                  <label
                    htmlFor={`tag-${tag}`}
                    className="text-sm text-white cursor-pointer"
                  >
                    {tag}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Multiple Email Addresses */}
          <div>
            <Label className="text-blue-300 mb-2 block">Email Addresses</Label>
            <div className="flex gap-2 mb-2">
              <Input
                type="email"
                value={currentEmail}
                onChange={(e) => setCurrentEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEmail())}
                placeholder="email@example.com"
                className="bg-slate-800 border-slate-700 text-white"
              />
              <Button type="button" onClick={handleAddEmail} className="bg-blue-500 hover:bg-blue-600">
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
              <Label className="text-blue-300">Phone</Label>
              <Input
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div>
              <Label className="text-blue-300">WhatsApp Number</Label>
              <Input
                value={formData.whatsapp_number || ""}
                onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div>
              <Label className="text-blue-300">Industry</Label>
              <Input
                value={formData.industry || ""}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div>
              <Label className="text-blue-300">Country</Label>
              <Input
                value={formData.country || ""}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div>
              <Label className="text-blue-300">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {clientStatusOptions.map(opt => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-blue-300">LinkedIn URL</Label>
            <Input
              value={formData.linkedin_url || ""}
              onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              placeholder="https://linkedin.com/in/username"
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div>
            <Label className="text-blue-300">Website URL</Label>
            <Input
              value={formData.website_url || ""}
              onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
              placeholder="https://example.com"
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div>
            <Label className="text-blue-300">Notes</Label>
            <Textarea
              value={formData.notes || ""}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Project history, preferences, etc."
              className="bg-slate-800 border-slate-700 text-white min-h-24"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="border-slate-700 text-slate-300">
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving || isUploading} className="bg-blue-500 hover:bg-blue-600">
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
