
import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Download, Upload, Star, FileDown, Trash2, Tag, CheckSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MinimalDoerCard from "../components/directory/MinimalDoerCard";
import DetailedDoerProfile from "../components/directory/DetailedDoerProfile";
import MessageTemplateModal from "../components/directory/MessageTemplateModal";
import AddDoerModal from "../components/directory/AddDoerModal";
import EditDoerModal from "../components/directory/EditDoerModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"; // Corrected import path for AlertDialog

export default function Directory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedTag, setSelectedTag] = useState("all");
  const [selectedDoer, setSelectedDoer] = useState(null);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageContact, setMessageContact] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [doerToEdit, setDoerToEdit] = useState(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const fileInputRef = useRef(null);

  const queryClient = useQueryClient();

  const { data: doers = [], isLoading } = useQuery({
    queryKey: ['doers'],
    queryFn: () => base44.entities.Doer.list('-created_date'),
  });

  const { data: configurations = [] } = useQuery({
    queryKey: ['configurations'],
    queryFn: () => base44.entities.Configuration.list(),
  });

  const createDoerMutation = useMutation({
    mutationFn: (data) => base44.entities.Doer.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doers'] });
      setAddModalOpen(false);
    },
  });

  const updateDoerMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Doer.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doers'] });
      setEditModalOpen(false);
      setDoerToEdit(null);
      if (selectedDoer) {
        setSelectedDoer(null);
      }
    },
  });

  const deleteDoerMutation = useMutation({
    mutationFn: (id) => base44.entities.Doer.delete(id),
    onSuccess: (data, deletedId) => { // 'deletedId' is the variable passed to mutateAsync
      queryClient.invalidateQueries({ queryKey: ['doers'] });
      // If the deleted doer was selected or part of bulk selection, update state
      if (selectedDoer && selectedDoer.id === deletedId) {
        setSelectedDoer(null);
      }
      setSelectedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(deletedId); // Now 'deletedId' is defined
        return newSet;
      });
    },
  });

  const handleToggleFavorite = async (doer) => {
    await updateDoerMutation.mutateAsync({
      id: doer.id,
      data: { is_favorite: !doer.is_favorite }
    });
  };

  const handleMessage = (doer, type) => {
    setMessageContact(doer);
    setMessageType(type);
    setMessageModalOpen(true);
  };

  const handleEdit = (doer) => {
    setDoerToEdit(doer);
    setEditModalOpen(true);
    setSelectedDoer(null);
  };

  const handleToggleSelect = (id, checked) => {
    setSelectedIds(prev => {
      const newSelected = new Set(prev);
      if (checked) {
        newSelected.add(id);
      } else {
        newSelected.delete(id);
      }
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredDoers.length && filteredDoers.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredDoers.map(d => d.id)));
    }
  };

  const handleBulkDelete = async () => {
    for (const doerId of selectedIds) { // Renamed 'id' to 'doerId' for clarity
      await deleteDoerMutation.mutateAsync(doerId);
    }
    setSelectedIds(new Set());
    setSelectionMode(false);
    setShowDeleteDialog(false);
  };

  const handleExportSelected = () => {
    const selected = doers.filter(d => selectedIds.has(d.id));
    if (selected.length === 0) return;

    const headers = Object.keys(selected[0] || {});
    const rows = selected.map(doer => {
      return headers.map(header => {
        const value = doer[header];
        if (Array.isArray(value)) {
          return `"${value.join(', ')}"`;
        }
        return `"${value || ''}"`;
      }).join(',');
    });
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'selected_doers_export.csv';
    link.click();
  };

  const handleDownloadTemplate = () => {
    const headers = [
      "full_name",
      "email",
      "phone",
      "whatsapp_number",
      "telegram_username",
      "primary_expertise",
      "availability_status",
      "work_arrangement",
      "hourly_rate",
      "country",
      "fiverr_profile",
      "upwork_profile",
      "skills",
      "technologies",
      "portfolio_links",
      "notes",
      "tags" // Added tags to template
    ];
    const example = [
      "John Doe",
      "john@example.com",
      "+1234567890",
      "+1234567890",
      "@johndoe",
      "Full Stack Development",
      "Available",
      "Freelancer",
      "85",
      "United States",
      "https://fiverr.com/johndoe",
      "https://upwork.com/freelancers/johndoe",
      "Web Development, Mobile Development",
      "React, Node.js, Python",
      "https://github.com/johndoe, https://johndoe.dev",
      "Excellent developer with great communication skills",
      "frontend, react" // Added example tags
    ];
    
    const csvContent = [headers.join(','), example.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'doers_template.csv';
    link.click();
  };

  const handleExport = () => {
    if (doers.length === 0) return;

    const headers = Object.keys(doers[0] || {});
    const rows = doers.map(doer => {
      return headers.map(header => {
        const value = doer[header];
        if (Array.isArray(value)) {
          return `"${value.join(', ')}"`;
        }
        return `"${value || ''}"`;
      }).join(',');
    });
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'doers_export.csv';
    link.click();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const records = lines.slice(1)
      .filter(line => line.trim())
      .map(line => {
        // This regex attempts to handle quoted commas correctly
        const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
        const record = {};
        headers.forEach((header, i) => {
          let value = values[i]?.replace(/^"|"$/g, '').trim();
          if (header === 'skills' || header === 'technologies' || header === 'portfolio_links' || header === 'tags') {
            record[header] = value ? value.split(',').map(v => v.trim()).filter(v => v !== '') : [];
          } else if (header === 'hourly_rate') {
            record[header] = value ? parseFloat(value) : undefined;
          } else {
            record[header] = value || undefined;
          }
        });
        return record;
      });

    for (const record of records) {
      await createDoerMutation.mutateAsync(record);
    }
    
    e.target.value = ''; // Clear the input so the same file can be selected again
  };

  // Get all unique tags from all doers
  const allTags = [...new Set(doers.flatMap(d => d.tags || []).filter(Boolean))].sort(); // filter(Boolean) removes empty strings

  const filteredDoers = doers.filter(doer => {
    const matchesSearch = !searchQuery || 
      doer.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doer.primary_expertise?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doer.skills?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doer.technologies?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doer.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())); // Search by tags
    
    const matchesFavorites = !showFavoritesOnly || doer.is_favorite;
    const matchesTag = selectedTag === "all" || doer.tags?.includes(selectedTag);
    
    return matchesSearch && matchesFavorites && matchesTag;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileImport}
        className="hidden"
      />

      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 md:mb-6">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-1">Doers</h1>
            <p className="text-sm md:text-base text-teal-300">Manage your freelancer network</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectionMode ? (
              <>
                <Button 
                  onClick={() => {
                    setSelectionMode(false);
                    setSelectedIds(new Set());
                  }}
                  variant="outline" 
                  size="sm"
                  className="border-teal-500/30 text-teal-300 hover:bg-teal-500/10 hover:text-teal-200 text-xs md:text-sm"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSelectAll}
                  variant="outline" 
                  size="sm"
                  className="border-teal-500/30 text-teal-300 hover:bg-teal-500/10 hover:text-teal-200 text-xs md:text-sm"
                >
                  <CheckSquare className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1" />
                  {selectedIds.size === filteredDoers.length && filteredDoers.length > 0 ? 'Deselect All' : 'Select All'}
                </Button>
                {selectedIds.size > 0 && (
                  <>
                    <Button 
                      onClick={handleExportSelected}
                      variant="outline" 
                      size="sm"
                      className="border-teal-500/30 text-teal-300 hover:bg-teal-500/10 hover:text-teal-200 text-xs md:text-sm"
                    >
                      <Download className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1" />
                      Export ({selectedIds.size})
                    </Button>
                    <Button 
                      onClick={() => setShowDeleteDialog(true)}
                      variant="outline" 
                      size="sm"
                      className="border-red-500/30 text-red-300 hover:bg-red-500/10 hover:text-red-200 text-xs md:text-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1" />
                      Delete ({selectedIds.size})
                    </Button>
                  </>
                )}
              </>
            ) : (
              <>
                <Button 
                  onClick={() => setSelectionMode(true)}
                  variant="outline" 
                  size="sm"
                  className="border-teal-500/30 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 hover:text-teal-200 text-xs md:text-sm"
                >
                  <CheckSquare className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1" />
                  Select
                </Button>
                <Button 
                  onClick={handleDownloadTemplate}
                  variant="outline" 
                  size="sm"
                  className="border-teal-500/30 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 hover:text-teal-200 text-xs md:text-sm"
                >
                  <FileDown className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1" />
                  Template
                </Button>
                <Button 
                  onClick={handleImportClick}
                  variant="outline" 
                  size="sm"
                  className="border-teal-500/30 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 hover:text-teal-200 text-xs md:text-sm"
                >
                  <Upload className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1" />
                  Import
                </Button>
                <Button 
                  onClick={handleExport}
                  variant="outline" 
                  size="sm"
                  className="border-teal-500/30 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 hover:text-teal-200 text-xs md:text-sm"
                >
                  <Download className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1" />
                  Export
                </Button>
                <Button 
                  onClick={() => setAddModalOpen(true)}
                  size="sm"
                  className="bg-teal-500 hover:bg-teal-600 text-white text-xs md:text-sm"
                >
                  <Plus className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1" />
                  Add
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-400" />
            <Input
              placeholder="Search by name, skills, expertise, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 md:pl-10 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-400 focus:border-teal-500/50 text-sm md:text-base"
            />
          </div>
          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="w-full sm:w-40 bg-slate-800/50 border-slate-700/50 text-white text-sm md:text-base">
              <Tag className="w-3.5 h-3.5 md:w-4 md:h-4 mr-2 text-slate-400" />
              <SelectValue placeholder="All Tags" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              <SelectItem value="all" className="hover:bg-slate-700 focus:bg-slate-700">All Tags</SelectItem>
              {allTags.map(tag => (
                <SelectItem key={tag} value={tag} className="hover:bg-slate-700 focus:bg-slate-700">{tag}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant={showFavoritesOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={showFavoritesOnly 
              ? "bg-amber-500 hover:bg-amber-600 text-white text-xs md:text-sm" 
              : "border-slate-700 text-slate-300 hover:bg-slate-800 text-xs md:text-sm"
            }
          >
            <Star className={`w-3.5 h-3.5 md:w-4 md:h-4 mr-1 ${showFavoritesOnly ? 'fill-white' : ''}`} />
            Favorites
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="h-48 bg-slate-800/40 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredDoers.length === 0 ? (
        <div className="text-center py-12 md:py-16">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
            <Search className="w-6 h-6 md:w-8 md:h-8 text-slate-600" />
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-white mb-2">No doers found</h3>
          <p className="text-sm md:text-base text-slate-400">Try adjusting your search or add new freelancers</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredDoers.map((doer) => (
              <MinimalDoerCard
                key={doer.id}
                doer={doer}
                onClick={() => !selectionMode && setSelectedDoer(doer)}
                onWhatsApp={() => handleMessage(doer, 'whatsapp')}
                onTelegram={() => handleMessage(doer, 'telegram')}
                onEmail={() => handleMessage(doer, 'email')}
                onCall={(doer) => window.location.href = `tel:${doer.phone}`}
                onToggleFavorite={handleToggleFavorite}
                isSelected={selectedIds.has(doer.id)}
                onToggleSelect={handleToggleSelect}
                selectionMode={selectionMode}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <DetailedDoerProfile
        doer={selectedDoer}
        isOpen={!!selectedDoer}
        onClose={() => setSelectedDoer(null)}
        onToggleFavorite={handleToggleFavorite}
        onMessage={handleMessage}
        onEdit={() => handleEdit(selectedDoer)}
        onDelete={(id) => {
          deleteDoerMutation.mutate(id);
          setSelectedDoer(null); // Close detailed view after deletion
        }}
      />

      <MessageTemplateModal
        isOpen={messageModalOpen}
        onClose={() => {
          setMessageModalOpen(false);
          setMessageContact(null);
          setMessageType(null);
        }}
        contact={messageContact}
        type={messageType}
      />

      <AddDoerModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={(data) => createDoerMutation.mutate(data)}
        configurations={configurations}
      />

      <EditDoerModal
        doer={doerToEdit}
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setDoerToEdit(null);
        }}
        onSave={(id, data) => updateDoerMutation.mutate({ id, data })}
        configurations={configurations}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-slate-900 border border-red-500/30 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This will permanently delete {selectedIds.size} doer{selectedIds.size > 1 ? 's' : ''} from the system. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleBulkDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
