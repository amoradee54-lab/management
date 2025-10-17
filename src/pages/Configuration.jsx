
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Settings, Palette, Link as LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

const CATEGORIES = [
  { key: "expertise", label: "Expertise Categories", color: "teal" },
  { key: "skills", label: "Skills", color: "blue" },
  { key: "technologies", label: "Technologies", color: "purple" },
  { key: "doer_tags", label: "Doer Tags", color: "pink" },
  { key: "client_tags", label: "Client Tags", color: "indigo" },
  { key: "industries", label: "Industry Categories", color: "emerald" },
  { key: "availability", label: "Availability Status", color: "amber" },
  { key: "client_status", label: "Client Status", color: "cyan" },
  { key: "work_arrangement", label: "Work Arrangement Types", color: "rose" }
];

export default function Configuration() {
  const [newValues, setNewValues] = useState({});
  const queryClient = useQueryClient();

  const { data: configs = [] } = useQuery({
    queryKey: ['configurations'],
    queryFn: () => base44.entities.Configuration.list(),
  });

  const { data: quickAccessLinks = {} } = useQuery({
    queryKey: ['quickAccessLinks'],
    queryFn: async () => {
      const links = await base44.entities.QuickAccessLinks.list();
      return links[0] || {};
    },
  });

  const createConfigMutation = useMutation({
    mutationFn: (data) => base44.entities.Configuration.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configurations'] });
    },
  });

  const updateConfigMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Configuration.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configurations'] });
    },
  });

  const createQuickAccessMutation = useMutation({
    mutationFn: (data) => base44.entities.QuickAccessLinks.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quickAccessLinks'] });
    },
  });

  const updateQuickAccessMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.QuickAccessLinks.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quickAccessLinks'] });
    },
  });

  const getConfigForCategory = (categoryKey) => {
    return configs.find(c => c.category === categoryKey);
  };

  const handleAddValue = async (categoryKey) => {
    const value = newValues[categoryKey]?.trim();
    if (!value) return;

    const config = getConfigForCategory(categoryKey);
    if (config) {
      const updatedValues = [...(config.values || []), value];
      await updateConfigMutation.mutateAsync({
        id: config.id,
        data: { values: updatedValues }
      });
    } else {
      await createConfigMutation.mutateAsync({
        category: categoryKey,
        values: [value],
        display_order: 0
      });
    }
    setNewValues({ ...newValues, [categoryKey]: "" });
  };

  const handleRemoveValue = async (categoryKey, valueToRemove) => {
    const config = getConfigForCategory(categoryKey);
    if (!config) return;

    const updatedValues = config.values.filter(v => v !== valueToRemove);
    await updateConfigMutation.mutateAsync({
      id: config.id,
      data: { values: updatedValues }
    });
  };

  const handleSaveQuickAccess = async (field, value) => {
    if (quickAccessLinks.id) {
      await updateQuickAccessMutation.mutateAsync({
        id: quickAccessLinks.id,
        data: { [field]: value }
      });
    } else {
      await createQuickAccessMutation.mutateAsync({
        [field]: value
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Configuration</h1>
            <p className="text-purple-300">Manage dropdown options and quick access</p>
          </div>
        </div>
      </div>

      {/* Quick Access Links */}
      <Card className="bg-slate-800/40 backdrop-blur-md border-slate-700/50 mb-6">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-cyan-400" />
            Quick Access Links
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-teal-300 mb-2 block">Trello Project Tracker URL</Label>
            <Input
              value={quickAccessLinks.trello_project_url || ""}
              onChange={(e) => handleSaveQuickAccess('trello_project_url', e.target.value)}
              placeholder="https://trello.com/b/..."
              className="bg-slate-900/50 border-slate-700 text-white"
            />
          </div>
          <div>
            <Label className="text-teal-300 mb-2 block">Trello Temp/Scratch URL</Label>
            <Input
              value={quickAccessLinks.trello_temp_url || ""}
              onChange={(e) => handleSaveQuickAccess('trello_temp_url', e.target.value)}
              placeholder="https://trello.com/b/..."
              className="bg-slate-900/50 border-slate-700 text-white"
            />
          </div>
          <div>
            <Label className="text-teal-300 mb-2 block">Google Drive Folder URL</Label>
            <Input
              value={quickAccessLinks.drive_url || ""}
              onChange={(e) => handleSaveQuickAccess('drive_url', e.target.value)}
              placeholder="https://drive.google.com/drive/folders/..."
              className="bg-slate-900/50 border-slate-700 text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Configuration Categories */}
      <div className="grid gap-6">
        {CATEGORIES.map(({ key, label, color }) => {
          const config = getConfigForCategory(key);
          const values = config?.values || [];

          return (
            <Card key={key} className="bg-slate-800/40 backdrop-blur-md border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Palette className={`w-5 h-5 text-${color}-400`} />
                  {label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {values.length > 0 ? (
                    values.map((value, idx) => (
                      <Badge
                        key={idx}
                        className={`bg-${color}-500/20 text-${color}-300 border-${color}-500/30 pr-1 group hover:bg-${color}-500/30 transition-colors`}
                      >
                        {value}
                        <button
                          onClick={() => handleRemoveValue(key, value)}
                          className="ml-2 p-0.5 hover:bg-red-500/20 rounded transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))
                  ) : (
                    <p className="text-slate-400 text-sm">No options added yet</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder={`Add new ${label.toLowerCase()}...`}
                    value={newValues[key] || ""}
                    onChange={(e) => setNewValues({ ...newValues, [key]: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddValue(key)}
                    className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
                  />
                  <Button
                    onClick={() => handleAddValue(key)}
                    className={`bg-${color}-500 hover:bg-${color}-600 gap-2`}
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
