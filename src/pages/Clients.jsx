
import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Download,
  Upload,
  Star,
  FileDown,
  CheckSquare,
  Trash2,
  Tag,
  MoreVertical,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import MinimalClientCard from "../components/directory/MinimalClientCard";
import DetailedClientProfile from "../components/directory/DetailedClientProfile";
import MessageTemplateModal from "../components/directory/MessageTemplateModal";
import AddClientModal from "../components/directory/AddClientModal";
import EditClientModal from "../components/directory/EditClientModal";

export default function Clients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedTag, setSelectedTag] = useState("all");
  const [selectedClient, setSelectedClient] = useState(null);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageContact, setMessageContact] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const fileInputRef = useRef(null);

  const queryClient = useQueryClient();

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: () => base44.entities.Client.list('-created_date'),
  });

  const { data: configurations = [] } = useQuery({
    queryKey: ['configurations'],
    queryFn: () => base44.entities.Configuration.list(),
  });

  const createClientMutation = useMutation({
    mutationFn: (data) => base44.entities.Client.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setAddModalOpen(false);
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Client.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setEditModalOpen(false);
      setClientToEdit(null);
      if (selectedClient) {
        setSelectedClient(null);
      }
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: (id) => base44.entities.Client.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      if (selectedClient) {
        setSelectedClient(null);
      }
    },
  });

  const handleToggleFavorite = async (client) => {
    await updateClientMutation.mutateAsync({
      id: client.id,
      data: { is_favorite: !client.is_favorite }
    });
  };

  const handleMessage = (client, type) => {
    setMessageContact(client);
    setMessageType(type);
    setMessageModalOpen(true);
  };

  const handleEdit = (client) => {
    setClientToEdit(client);
    setEditModalOpen(true);
    setSelectedClient(null);
  };

  const handleDownloadTemplate = () => {
    const headers = [
      "full_name",
      "username",
      "email",
      "phone",
      "whatsapp_number",
      "job_title",
      "company_name",
      "industry",
      "country",
      "status",
      "linkedin_url",
      "website_url",
      "notes",
      "tags"
    ];
    const example = [
      "Jane Smith",
      "janesmith",
      "jane@company.com",
      "+1234567890",
      "+1234567890",
      "VP of Product",
      "Tech Solutions Inc",
      "Enterprise SaaS",
      "United States",
      "Active",
      "https://linkedin.com/in/janesmith",
      "https://techsolutions.com",
      "Great client, responsive and clear requirements",
      "VIP,Marketing,New Lead"
    ];
    
    const csvContent = [headers.join(','), example.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'clients_template.csv';
    link.click();
  };

  const handleExport = () => {
    if (clients.length === 0) return;

    const headers = Object.keys(clients[0] || {});
    const rows = clients.map(client => {
      return headers.map(header => {
        const value = client[header];
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
    link.download = 'clients_export.csv';
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
        const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
        const record = {};
        headers.forEach((header, i) => {
          let value = values[i]?.replace(/^"|"$/g, '').trim();
          if (header === 'tags' && value) {
            record[header] = value.split(',').map(tag => tag.trim());
          } else {
            record[header] = value || undefined;
          }
        });
        return record;
      });

    for (const record of records) {
      await createClientMutation.mutateAsync(record);
    }
    
    e.target.value = '';
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
    if (selectedIds.size === filteredClients.length && filteredClients.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredClients.map(c => c.id)));
    }
  };

  const handleBulkDelete = async () => {
    for (const clientId of selectedIds) {
      await deleteClientMutation.mutateAsync(clientId);
    }
    setSelectedIds(new Set());
    setSelectionMode(false);
    setShowDeleteDialog(false);
  };

  const handleExportSelected = () => {
    const selected = clients.filter(c => selectedIds.has(c.id));
    if (selected.length === 0) return;

    const headers = Object.keys(selected[0] || {});
    const rows = selected.map(client => {
      return headers.map(header => {
        const value = client[header];
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
    link.download = 'selected_clients_export.csv';
    link.click();
  };

  const allTags = [...new Set(clients.flatMap(c => c.tags || []).filter(Boolean))].sort();

  const filteredClients = clients.filter(client => {
    const matchesSearch = !searchQuery || 
      client.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFavorites = !showFavoritesOnly || client.is_favorite;
    const matchesTag = selectedTag === "all" || client.tags?.includes(selectedTag);
    
    return matchesSearch && matchesFavorites && matchesTag;
  });

  const MobileActionMenu = ({
    selectionMode,
    setSelectionMode,
    setSelectedIds,
    filteredClients,
    selectedIdsSize,
    handleSelectAll,
    handleExportSelected,
    setShowDeleteDialog,
    handleDownloadTemplate,
    handleImportClick,
    handleExport,
    setAddModalOpen,
  }) => {
    const [sheetOpen, setSheetOpen] = useState(false);

    return (
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
            <MoreVertical className="w-4 h-4 mr-1" /> Actions
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="bg-slate-900 border-slate-700 text-white w-3/4 sm:w-[400px]">
          <SheetHeader>
            <SheetTitle className="text-white">Client Actions</SheetTitle>
            <SheetDescription className="text-slate-400">
              Perform various actions on your clients.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-2 mt-6">
            {selectionMode ? (
              <>
                <Button 
                  onClick={() => {
                    setSelectionMode(false);
                    setSelectedIds(new Set());
                    setSheetOpen(false);
                  }}
                  variant="outline" 
                  className="border-blue-500/50 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
                >
                  Cancel Selection
                </Button>
                <Button 
                  onClick={() => {
                    handleSelectAll();
                    setSheetOpen(false);
                  }}
                  variant="outline" 
                  className="border-blue-500/50 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
                >
                  <CheckSquare className="w-4 h-4 mr-2" />
                  {selectedIdsSize === filteredClients.length && filteredClients.length > 0 ? 'Deselect All' : 'Select All'}
                </Button>
                {selectedIdsSize > 0 && (
                  <>
                    <Button 
                      onClick={() => {
                        handleExportSelected();
                        setSheetOpen(false);
                      }}
                      variant="outline" 
                      className="border-blue-500/50 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Selected ({selectedIdsSize})
                    </Button>
                    <Button 
                      onClick={() => {
                        setShowDeleteDialog(true);
                        setSheetOpen(false);
                      }}
                      variant="outline" 
                      className="border-red-500/50 bg-red-500/10 text-red-300 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Selected ({selectedIdsSize})
                    </Button>
                  </>
                )}
              </>
            ) : (
              <>
                <Button 
                  onClick={() => {
                    setSelectionMode(true);
                    setSheetOpen(false);
                  }}
                  variant="outline" 
                  className="border-blue-500/50 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
                >
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Select Clients
                </Button>
                <Button 
                  onClick={() => {
                    handleDownloadTemplate();
                    setSheetOpen(false);
                  }}
                  variant="outline" 
                  className="border-blue-500/50 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Download Template
                </Button>
                <Button 
                  onClick={() => {
                    handleImportClick();
                    setSheetOpen(false);
                  }}
                  variant="outline" 
                  className="border-blue-500/50 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import Clients
                </Button>
                <Button 
                  onClick={() => {
                    handleExport();
                    setSheetOpen(false);
                  }}
                  variant="outline" 
                  className="border-blue-500/50 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export All Clients
                </Button>
                <Button 
                  onClick={() => {
                    setAddModalOpen(true);
                    setSheetOpen(false);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Client
                </Button>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    );
  };

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
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-1">Clients</h1>
            <p className="text-sm md:text-base text-blue-300">Manage your client relationships</p>
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
                  className="border-blue-500/50 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 text-xs"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSelectAll}
                  variant="outline" 
                  size="sm"
                  className="border-blue-500/50 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 text-xs"
                >
                  <CheckSquare className="w-3.5 h-3.5 mr-1" />
                  {selectedIds.size === filteredClients.length && filteredClients.length > 0 ? 'Deselect All' : 'Select All'}
                </Button>
                {selectedIds.size > 0 && (
                  <>
                    <Button 
                      onClick={handleExportSelected}
                      variant="outline" 
                      size="sm"
                      className="border-blue-500/50 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 text-xs"
                    >
                      <Download className="w-3.5 h-3.5 mr-1" />
                      Export ({selectedIds.size})
                    </Button>
                    <Button 
                      onClick={() => setShowDeleteDialog(true)}
                      variant="outline" 
                      size="sm"
                      className="border-red-500/50 bg-red-500/10 text-red-300 hover:bg-red-500/20 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
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
                  className="border-blue-500/50 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 text-xs"
                >
                  <CheckSquare className="w-3.5 h-3.5 mr-1" />
                  Select
                </Button>
                <Button 
                  onClick={handleDownloadTemplate}
                  variant="outline" 
                  size="sm"
                  className="border-blue-500/50 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 text-xs"
                >
                  <FileDown className="w-3.5 h-3.5 mr-1" />
                  Template
                </Button>
                <Button 
                  onClick={handleImportClick}
                  variant="outline" 
                  size="sm"
                  className="border-blue-500/50 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 text-xs"
                >
                  <Upload className="w-3.5 h-3.5 mr-1" />
                  Import
                </Button>
                <Button 
                  onClick={handleExport}
                  variant="outline" 
                  size="sm"
                  className="border-blue-500/50 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 text-xs"
                >
                  <Download className="w-3.5 h-3.5 mr-1" />
                  Export
                </Button>
                <Button 
                  onClick={() => setAddModalOpen(true)}
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600 text-white text-xs"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
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
              placeholder="Search by name, company, industry, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 md:pl-10 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-400 focus:border-blue-500/50 text-sm md:text-base"
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
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-56 md:h-64 bg-slate-800/40 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="text-center py-12 md:py-16">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
            <Search className="w-6 h-6 md:w-8 md:h-8 text-slate-600" />
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-white mb-2">No clients found</h3>
          <p className="text-sm md:text-base text-slate-400">Try adjusting your search or add new clients</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredClients.map((client) => (
              <MinimalClientCard
                key={client.id}
                client={client}
                onClick={() => !selectionMode && setSelectedClient(client)}
                onWhatsApp={() => handleMessage(client, 'whatsapp')}
                onEmail={() => handleMessage(client, 'email')}
                onCall={(client) => window.location.href = `tel:${client.phone}`}
                isSelected={selectedIds.has(client.id)}
                onToggleSelect={handleToggleSelect}
                selectionMode={selectionMode}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <DetailedClientProfile
        client={selectedClient}
        isOpen={!!selectedClient}
        onClose={() => setSelectedClient(null)}
        onToggleFavorite={handleToggleFavorite}
        onMessage={handleMessage}
        onEdit={() => handleEdit(selectedClient)}
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
        isClient={true}
      />

      <AddClientModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={(data) => createClientMutation.mutate(data)}
        configurations={configurations}
      />

      <EditClientModal
        client={clientToEdit}
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setClientToEdit(null);
        }}
        onSave={(id, data) => updateClientMutation.mutate({ id, data })}
        configurations={configurations}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-slate-900 border border-red-500/30 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This will permanently delete {selectedIds.size} client{selectedIds.size > 1 ? 's' : ''} from the system. This action cannot be undone.
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
