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
import { MessageCircle, Mail, Copy, Check, Send } from "lucide-react";

export default function MessageTemplateModal({ isOpen, onClose, contact, type }) {
  const [projectLink, setProjectLink] = useState("");
  const [deadline, setDeadline] = useState("");
  const [copied, setCopied] = useState(false);

  if (!contact) return null;

  const generateMessage = () => {
    return `Hey ${contact.full_name},

Here is a new project: ${projectLink || '[Project Link]'}

Deadline: ${deadline || '[Deadline Date]'}

Please name your price.

Best regards`;
  };

  const message = generateMessage();

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    const cleanNumber = contact.whatsapp_number?.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, '_blank');
    onClose();
  };

  const handleSendTelegram = () => {
    const username = contact.telegram_username?.replace('@', '');
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://t.me/${username}?text=${encodedMessage}`, '_blank');
    onClose();
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent('New Project Opportunity');
    const body = encodeURIComponent(message);
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-900 border-teal-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {type === 'whatsapp' ? (
              <MessageCircle className="w-5 h-5 text-emerald-400" />
            ) : type === 'telegram' ? (
              <Send className="w-5 h-5 text-blue-400" />
            ) : (
              <Mail className="w-5 h-5 text-cyan-400" />
            )}
            Send Message to {contact.full_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label className="text-teal-300 mb-2 block">Project Link</Label>
            <Input
              value={projectLink}
              onChange={(e) => setProjectLink(e.target.value)}
              placeholder="https://..."
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div>
            <Label className="text-teal-300 mb-2 block">Deadline Date</Label>
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div>
            <Label className="text-teal-300 mb-2 block">Generated Message</Label>
            <div className="relative">
              <Textarea
                value={message}
                readOnly
                className="bg-slate-800 border-slate-700 text-white min-h-40 pr-12"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className="absolute top-2 right-2 text-slate-400 hover:text-white"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} className="border-slate-700 text-slate-300">
            Cancel
          </Button>
          {type === 'whatsapp' ? (
            <Button
              onClick={handleSendWhatsApp}
              className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Send via WhatsApp
            </Button>
          ) : type === 'telegram' ? (
            <Button
              onClick={handleSendTelegram}
              className="bg-blue-500 hover:bg-blue-600 text-white gap-2"
            >
              <Send className="w-4 h-4" />
              Send via Telegram
            </Button>
          ) : (
            <Button
              onClick={handleSendEmail}
              className="bg-cyan-500 hover:bg-cyan-600 text-white gap-2"
            >
              <Mail className="w-4 h-4" />
              Send via Email
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}