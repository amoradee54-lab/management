
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, ExternalLink, Star, TrendingUp, DollarSign, Briefcase, Calendar, Plus, Edit2, AlertTriangle, CheckCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddEditProjectModal from "../components/projects/AddEditProjectModal";

const statusColors = {
  "Potential": "bg-purple-400/20 text-purple-300 border-purple-400/30",
  "Not Started": "bg-slate-400/20 text-slate-300 border-slate-400/30",
  "In Progress": "bg-blue-400/20 text-blue-300 border-blue-400/30",
  "Blocked": "bg-red-400/20 text-red-300 border-red-400/30",
  "Delivered": "bg-cyan-400/20 text-cyan-300 border-cyan-400/30",
  "Completed": "bg-emerald-400/20 text-emerald-300 border-emerald-400/30"
};

export default function ProjectsLog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null); // This state is no longer used for modals
  const [selectedDoer, setSelectedDoer] = useState(null);     // This state is no longer used for modals

  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('-project_date'),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => base44.entities.Client.list(),
  });

  const { data: doers = [] } = useQuery({
    queryKey: ['doers'],
    queryFn: () => base44.entities.Doer.list(),
  });

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client?.full_name || "Unknown";
  };

  const getClient = (clientId) => {
    return clients.find(c => c.id === clientId);
  };

  const getDoerName = (doerId) => {
    const doer = doers.find(d => d.id === doerId);
    return doer?.full_name || "Unknown";
  };

  const getDoer = (doerId) => {
    return doers.find(d => d.id === doerId);
  };

  const isProjectLate = (project) => {
    if (!project.deadline || project.status === "Completed") return false;
    const deadline = new Date(project.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);
    return deadline < today;
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setAddModalOpen(true);
  };

  const handleExport = () => {
    if (filteredProjects.length === 0) return;

    const headers = [
      "Date", "Order #", "Title", "Client", "Doer", "Deadline", "Completion Date", "Status", "Payment Status", 
      "Deal Amount", "Tip", "Total Revenue", "Doer Cost", "Deductions", 
      "Profit", "Platform", "Rating", "Trello URL", "Notes"
    ];
    
    const rows = filteredProjects.map(project => [
      project.project_date ? new Date(project.project_date).toLocaleDateString() : '',
      project.order_number || '',
      project.title || '',
      getClientName(project.client_id),
      getDoerName(project.doer_id),
      project.deadline ? new Date(project.deadline).toLocaleDateString() : '',
      project.completion_date ? new Date(project.completion_date).toLocaleDateString() : '',
      project.status || '',
      project.payment_status || '',
      project.client_deal_amount || 0,
      project.tip_amount || 0,
      (project.client_deal_amount || 0) + (project.tip_amount || 0),
      project.doer_cost_amount || 0,
      project.deduction_amount || 0,
      project.profit_margin || 0,
      project.payment_platform || '',
      project.performance_rating || '',
      project.trello_card_url || '',
      `"${(project.notes || '').replace(/"/g, '""')}"`
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `projects_log_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Date range filtering
  const filteredProjects = projects.filter(project => {
    const matchesSearch = !searchQuery || 
      project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getClientName(project.client_id).toLowerCase().includes(searchQuery.toLowerCase()) ||
      getDoerName(project.doer_id).toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesDateRange = true;
    if (startDate && project.project_date) {
      matchesDateRange = matchesDateRange && new Date(project.project_date) >= new Date(startDate);
    }
    if (endDate && project.project_date) {
      matchesDateRange = matchesDateRange && new Date(project.project_date) <= new Date(endDate);
    }
    
    return matchesSearch && matchesDateRange;
  });

  // Group projects by status
  const potentialProjects = filteredProjects.filter(p => p.status === "Potential");
  const activeProjects = filteredProjects.filter(p => p.status === "In Progress" || p.status === "Not Started" || p.status === "Delivered");
  const completedProjects = filteredProjects.filter(p => p.status === "Completed"); // Still needed for metrics, even if not displayed as a card
  const blockedProjects = filteredProjects.filter(p => p.status === "Blocked");

  // Calculate metrics
  const totalProjects = filteredProjects.length; // Still needed for metrics, even if not displayed as a card
  const totalRevenue = filteredProjects.reduce((sum, p) => 
    sum + (p.client_deal_amount || 0) + (p.tip_amount || 0), 0
  );
  const totalProfit = filteredProjects.reduce((sum, p) => sum + (p.profit_margin || 0), 0);
  const lateProjects = filteredProjects.filter(p => isProjectLate(p)).length;

  const ProjectTable = ({ projects, emptyMessage }) => {
    if (projects.length === 0) {
      return (
        <div className="text-center py-8 text-slate-400">
          {emptyMessage}
        </div>
      );
    }

    return (
      <>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700/50 hover:bg-transparent">
                <TableHead className="text-slate-300 w-24">Date</TableHead>
                <TableHead className="text-slate-300 w-24">Order #</TableHead>
                <TableHead className="text-slate-300 min-w-[180px]">Title</TableHead>
                <TableHead className="text-slate-300 w-12">Client</TableHead>
                <TableHead className="text-slate-300 w-12">Doer</TableHead>
                <TableHead className="text-slate-300 w-24">Deadline</TableHead>
                <TableHead className="text-slate-300 w-24">Completed</TableHead>
                <TableHead className="text-slate-300 w-12">Trello</TableHead>
                <TableHead className="text-slate-300 w-24">Payment</TableHead>
                <TableHead className="text-slate-300 text-right w-24">Revenue</TableHead>
                <TableHead className="text-slate-300 text-right w-24">Profit</TableHead>
                <TableHead className="text-slate-300 w-16">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => {
                const isLate = isProjectLate(project);
                const client = getClient(project.client_id);
                const doer = getDoer(project.doer_id);
                
                return (
                  <TableRow 
                    key={project.id} 
                    className={`border-slate-700/50 hover:bg-slate-800/40 ${isLate ? 'bg-red-500/5' : ''}`}
                  >
                    <TableCell className="text-slate-300 text-sm">
                      {project.project_date ? new Date(project.project_date).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell className="text-slate-300 text-sm font-mono">
                      {project.order_number || '-'}
                    </TableCell>
                    <TableCell className="font-medium text-white">
                      <div className="truncate max-w-[300px]" title={project.title}>
                        {project.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      {client ? (
                        <div // Changed from button to div
                          className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold"
                          title={client.full_name}
                        >
                          {client.profile_picture ? (
                            <img src={client.profile_picture} alt="" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            client.full_name?.charAt(0).toUpperCase()
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {doer ? (
                        <div // Changed from button to div
                          className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-xs font-bold"
                          title={doer.full_name}
                        >
                          {doer.profile_picture ? (
                            <img src={doer.profile_picture} alt="" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            doer.full_name?.charAt(0).toUpperCase()
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {project.deadline ? (
                        <div className="flex flex-col">
                          <span className={`text-sm ${isLate ? 'text-red-400 font-semibold' : 'text-slate-300'}`}>
                            {new Date(project.deadline).toLocaleDateString()}
                          </span>
                          {isLate && (
                            <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-[10px] px-1 py-0 mt-1">
                              LATE
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-300 text-sm">
                      {project.completion_date ? (
                        <span className="text-emerald-400 font-medium">
                          {new Date(project.completion_date).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {project.trello_card_url ? (
                        <a
                          href={project.trello_card_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-700/50 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={`border text-xs ${
                        project.payment_status === 'Paid' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                        project.payment_status === 'Waiting for Payment' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                        'bg-slate-500/20 text-slate-300 border-slate-500/30'
                      }`}>
                        {project.payment_status === 'Paid' ? 'Paid' : 
                         project.payment_status === 'Waiting for Payment' ? 'Waiting' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-white">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-semibold">
                          ${((project.client_deal_amount || 0) + (project.tip_amount || 0)).toLocaleString()}
                        </span>
                        {project.tip_amount > 0 && (
                          <span className="text-[10px] text-amber-400">+${project.tip_amount} tip</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`font-semibold ${project.profit_margin >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        ${(project.profit_margin || 0).toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(project)}
                        className="h-8 w-8 hover:bg-slate-700/50 text-teal-400"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {projects.map((project) => {
            const isLate = isProjectLate(project);
            const client = getClient(project.client_id);
            const doer = getDoer(project.doer_id);
            
            return (
              <Card key={project.id} className={`bg-slate-800/40 backdrop-blur-md border-slate-700/50 p-4 ${isLate ? 'border-red-500/30' : ''}`}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-sm mb-1">{project.title}</h3>
                      {project.order_number && (
                        <p className="text-xs text-slate-400 font-mono">Order: {project.order_number}</p>
                      )}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(project)}
                      className="h-8 w-8 hover:bg-slate-700/50 text-teal-400 flex-shrink-0"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400">Date:</span>
                      <p className="text-white">{project.project_date ? new Date(project.project_date).toLocaleDateString() : '-'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Deadline:</span>
                      <p className={isLate ? 'text-red-400 font-semibold' : 'text-white'}>
                        {project.deadline ? new Date(project.deadline).toLocaleDateString() : '-'}
                        {isLate && <span className="text-[10px] ml-1">(LATE)</span>}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400">Completed:</span>
                      <p className="text-emerald-400 font-medium">
                        {project.completion_date ? new Date(project.completion_date).toLocaleDateString() : '-'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-xs">Client:</span>
                      {client && (
                        <div // Changed from button to div
                          className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold"
                          title={client.full_name}
                        >
                          {client.profile_picture ? (
                            <img src={client.profile_picture} alt="" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            client.full_name?.charAt(0).toUpperCase()
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-xs">Doer:</span>
                      {doer && (
                        <div // Changed from button to div
                          className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-xs font-bold"
                          title={doer.full_name}
                        >
                          {doer.profile_picture ? (
                            <img src={doer.profile_picture} alt="" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            doer.full_name?.charAt(0).toUpperCase()
                          )}
                        </div>
                      )}
                    </div>
                    {project.trello_card_url && (
                      <a
                        href={project.trello_card_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto text-blue-400 hover:text-blue-300"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                    <div>
                      <span className="text-slate-400 text-xs">Revenue:</span>
                      <p className="text-white font-semibold">${((project.client_deal_amount || 0) + (project.tip_amount || 0)).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-xs">Profit:</span>
                      <p className={`font-semibold ${project.profit_margin >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        ${(project.profit_margin || 0).toLocaleString()}
                      </p>
                    </div>
                    <Badge className={`border text-xs ${
                      project.payment_status === 'Paid' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                      project.payment_status === 'Waiting for Payment' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                      'bg-slate-500/20 text-slate-300 border-slate-500/30'
                    }`}>
                      {project.payment_status === 'Paid' ? 'Paid' : 
                       project.payment_status === 'Waiting for Payment' ? 'Waiting' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 md:mb-6">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-1">Projects Log</h1>
            <p className="text-sm md:text-base text-teal-300">Complete history of all projects</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setAddModalOpen(true)}
              className="bg-teal-500 hover:bg-teal-600 gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </Button>
            <Button
              onClick={handleExport}
              variant="outline"
              className="border-teal-500/30 text-teal-300 hover:bg-teal-500/10 gap-2"
              disabled={filteredProjects.length === 0}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </Button>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <Label className="text-teal-300 mb-2 block text-sm">Start Date</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-slate-800/50 border-slate-700/50 text-white"
            />
          </div>
          <div>
            <Label className="text-teal-300 mb-2 block text-sm">End Date</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-slate-800/50 border-slate-700/50 text-white"
            />
          </div>
        </div>

        {/* Simplified Metrics Cards - Only 6 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-6">
          <Card className="bg-slate-900/60 backdrop-blur-md border-purple-500/20 p-3 md:p-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                <p className="text-[10px] md:text-xs text-slate-400">Potential</p>
              </div>
              <p className="text-lg md:text-xl font-bold text-white">{potentialProjects.length}</p>
            </div>
          </Card>

          <Card className="bg-slate-900/60 backdrop-blur-md border-red-500/20 p-3 md:p-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-red-400" />
                <p className="text-[10px] md:text-xs text-slate-400">Late</p>
              </div>
              <p className="text-lg md:text-xl font-bold text-white">{lateProjects}</p>
            </div>
          </Card>

          <Card className="bg-slate-900/60 backdrop-blur-md border-amber-500/20 p-3 md:p-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-amber-400" />
                <p className="text-[10px] md:text-xs text-slate-400">Blocked</p>
              </div>
              <p className="text-lg md:text-xl font-bold text-white">{blockedProjects.length}</p>
            </div>
          </Card>

          <Card className="bg-slate-900/60 backdrop-blur-md border-blue-500/20 p-3 md:p-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                <p className="text-[10px] md:text-xs text-slate-400">Active</p>
              </div>
              <p className="text-lg md:text-xl font-bold text-white">{activeProjects.length}</p>
            </div>
          </Card>

          <Card className="bg-slate-900/60 backdrop-blur-md border-cyan-500/20 p-3 md:p-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                <p className="text-[10px] md:text-xs text-slate-400">Revenue</p>
              </div>
              <p className="text-lg md:text-xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
            </div>
          </Card>

          <Card className="bg-slate-900/60 backdrop-blur-md border-emerald-500/20 p-3 md:p-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
                <p className="text-[10px] md:text-xs text-slate-400">Profit</p>
              </div>
              <p className={`text-lg md:text-xl font-bold ${totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                ${totalProfit.toLocaleString()}
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Status Sections */}
      <div className="space-y-6">
        {/* Potential Projects */}
        <Card className="bg-slate-900/60 backdrop-blur-md border-purple-500/20 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/10 px-4 md:px-6 py-3 md:py-4 border-b border-purple-500/30">
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Potential Projects ({potentialProjects.length})
            </h2>
          </div>
          <div className="p-4 md:p-6">
            <ProjectTable projects={potentialProjects} emptyMessage="No potential projects" />
          </div>
        </Card>

        {/* Active Projects */}
        <Card className="bg-slate-900/60 backdrop-blur-md border-teal-500/20 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500/20 to-teal-600/10 px-4 md:px-6 py-3 md:py-4 border-b border-teal-500/30">
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-teal-400" />
              Active Projects ({activeProjects.length})
            </h2>
          </div>
          <div className="p-4 md:p-6">
            <ProjectTable projects={activeProjects} emptyMessage="No active projects" />
          </div>
        </Card>

        {/* Blocked Projects */}
        <Card className="bg-slate-900/60 backdrop-blur-md border-red-500/20 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500/20 to-red-600/10 px-4 md:px-6 py-3 md:py-4 border-b border-red-500/30">
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Blocked Projects ({blockedProjects.length})
            </h2>
          </div>
          <div className="p-4 md:p-6">
            <ProjectTable projects={blockedProjects} emptyMessage="No blocked projects" />
          </div>
        </Card>

        {/* Completed Projects */}
        <Card className="bg-slate-900/60 backdrop-blur-md border-emerald-500/20 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 px-4 md:px-6 py-3 md:py-4 border-b border-emerald-500/30">
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              Completed Projects ({completedProjects.length})
            </h2>
          </div>
          <div className="p-4 md:p-6">
            <ProjectTable projects={completedProjects} emptyMessage="No completed projects yet" />
          </div>
        </Card>
      </div>

      {/* Add/Edit Project Modal */}
      <AddEditProjectModal
        isOpen={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setEditingProject(null);
        }}
        project={editingProject}
      />
    </div>
  );
}
