
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ExternalLink, Trash2, Edit2, TrendingUp, DollarSign, Briefcase, Star } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import AddEditProjectModal from "./AddEditProjectModal";

const statusColors = {
  "Potential": "bg-purple-400/20 text-purple-300 border-purple-400/30",
  "Not Started": "bg-slate-400/20 text-slate-300 border-slate-400/30",
  "In Progress": "bg-blue-400/20 text-blue-300 border-blue-400/30",
  "Blocked": "bg-red-400/20 text-red-300 border-red-400/30",
  "Delivered": "bg-cyan-400/20 text-cyan-300 border-cyan-400/30",
  "Completed": "bg-emerald-400/20 text-emerald-300 border-emerald-400/30"
};

export default function ProjectsTab({ entityId, entityType }) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const queryClient = useQueryClient();

  const filterKey = entityType === "doer" ? "doer_id" : "client_id";
  
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects', entityType, entityId],
    queryFn: async () => {
      const allProjects = await base44.entities.Project.list('-created_date');
      return allProjects.filter(p => p[filterKey] === entityId);
    },
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => base44.entities.Client.list(),
  });

  const { data: doers = [] } = useQuery({
    queryKey: ['doers'],
    queryFn: () => base44.entities.Doer.list(),
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (id) => base44.entities.Project.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    },
  });

  const handleDelete = (project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setAddModalOpen(true);
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client?.full_name || "Unknown Client";
  };

  const getDoerName = (doerId) => {
    const doer = doers.find(d => d.id === doerId);
    return doer?.full_name || "Unknown Doer";
  };

  const isProjectLate = (project) => {
    if (!project.deadline || project.status === "Completed") return false;
    const deadline = new Date(project.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to start of day
    return deadline < today;
  };

  const totalProjects = projects.length;
  const totalRevenue = projects.reduce((sum, p) => {
    const dealAmount = p.client_deal_amount || 0;
    const tipAmount = p.tip_amount || 0;
    return sum + dealAmount + tipAmount;
  }, 0);
  
  const totalCosts = projects.reduce((sum, p) => sum + (p.doer_cost_amount || 0), 0);
  const totalProfit = projects.reduce((sum, p) => sum + (p.profit_margin || 0), 0);
  const totalEarned = projects.reduce((sum, p) => sum + (p.doer_cost_amount || 0), 0);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-400">
        <div className="animate-pulse">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900/60 backdrop-blur-md border-teal-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-500/20 rounded-lg">
                <Briefcase className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Projects</p>
                <p className="text-2xl font-bold text-white">{totalProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {entityType === "client" ? (
          <>
            <Card className="bg-slate-900/60 backdrop-blur-md border-teal-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <DollarSign className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Total Revenue</p>
                    <p className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/60 backdrop-blur-md border-teal-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${totalProfit >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                    <TrendingUp className={`w-5 h-5 ${totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Total Profit</p>
                    <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      ${totalProfit.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="bg-slate-900/60 backdrop-blur-md border-teal-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Earned</p>
                  <p className="text-2xl font-bold text-white">${totalEarned.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Project Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditingProject(null);
            setAddModalOpen(true);
          }}
          className="bg-teal-500 hover:bg-teal-600 gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </Button>
      </div>

      {/* Projects Table/Cards */}
      {projects.length === 0 ? (
        <Card className="bg-slate-900/60 backdrop-blur-md border-teal-500/20">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No projects yet</h3>
            <p className="text-slate-400 mb-6">
              Get started by adding your first project to track deals and profitability
            </p>
            <Button
              onClick={() => {
                setEditingProject(null);
                setAddModalOpen(true);
              }}
              className="bg-teal-500 hover:bg-teal-600 gap-2"
            >
              <Plus className="w-4 h-4" />
              Add First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table */}
          <Card className="hidden md:block bg-slate-900/60 backdrop-blur-md border-teal-500/20 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700/50 hover:bg-transparent">
                    <TableHead className="text-slate-300 whitespace-nowrap">Title</TableHead>
                    <TableHead className="text-slate-300 whitespace-nowrap">Deadline</TableHead>
                    {entityType === "client" && <TableHead className="text-slate-300 whitespace-nowrap">Doer</TableHead>}
                    {entityType === "doer" && <TableHead className="text-slate-300 whitespace-nowrap">Client</TableHead>}
                    <TableHead className="text-slate-300 w-20">Trello</TableHead>
                    <TableHead className="text-slate-300 whitespace-nowrap">Status</TableHead>
                    <TableHead className="text-slate-300 whitespace-nowrap">Payment</TableHead>
                    <TableHead className="text-slate-300 text-right whitespace-nowrap">
                      {entityType === "doer" ? "Cost" : "Deal"}
                    </TableHead>
                    {entityType === "client" && <TableHead className="text-slate-300 text-right whitespace-nowrap">Profit</TableHead>}
                    <TableHead className="text-slate-300 w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => {
                    const isLate = isProjectLate(project);
                    return (
                      <TableRow 
                        key={project.id} 
                        className={`border-slate-700/50 hover:bg-slate-800/40 ${isLate ? 'bg-red-500/5' : ''}`}
                      >
                        <TableCell className="font-medium text-white whitespace-nowrap">{project.title}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          {project.deadline ? (
                            <div className="flex items-center gap-2">
                              <span className={isLate ? 'text-red-400 font-semibold' : 'text-slate-300'}>
                                {new Date(project.deadline).toLocaleDateString()}
                              </span>
                              {isLate && (
                                <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-[10px] px-1.5 py-0">
                                  LATE
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-600">-</span>
                          )}
                        </TableCell>
                        {entityType === "client" && <TableCell className="text-slate-300 whitespace-nowrap">{getDoerName(project.doer_id)}</TableCell>}
                        {entityType === "doer" && <TableCell className="text-slate-300 whitespace-nowrap">{getClientName(project.client_id)}</TableCell>}
                        
                        <TableCell>
                          {project.trello_card_url ? (
                            <a
                              href={project.trello_card_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-700/50 text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          ) : (
                            <span className="text-slate-600">-</span>
                          )}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge className={`${statusColors[project.status]} border text-xs`}>
                            {project.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge className={`border text-xs ${
                            project.payment_status === 'Paid' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                            project.payment_status === 'Waiting for Payment' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                            'bg-slate-500/20 text-slate-300 border-slate-500/30'
                          }`}>
                            {project.payment_status}
                          </Badge>
                        </TableCell>
                        {entityType === "client" ? (
                          <>
                            <TableCell className="text-right text-white whitespace-nowrap">
                              ${((project.client_deal_amount || 0) + (project.tip_amount || 0)).toLocaleString()}
                              {project.tip_amount > 0 && (
                                <span className="text-xs text-amber-400 ml-1">(+${project.tip_amount} tip)</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right whitespace-nowrap">
                              <span className={project.profit_margin >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                                ${(project.profit_margin || 0).toLocaleString()}
                              </span>
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell className="text-right text-white whitespace-nowrap">
                              ${(project.doer_cost_amount || 0).toLocaleString()}
                            </TableCell>
                          </>
                        )}
                        <TableCell className="whitespace-nowrap">
                          <div className="flex gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEdit(project)}
                              className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700/50"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDelete(project)}
                              className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {projects.map((project) => {
              const isLate = isProjectLate(project);
              return (
                <Card key={project.id} className={`bg-slate-800/40 backdrop-blur-md border-slate-700/50 p-4 ${isLate ? 'border-red-500/30' : ''}`}>
                  <div className="space-y-3">
                    {/* Title and Actions */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-white text-sm flex-1">{project.title}</h3>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(project)}
                          className="h-8 w-8 text-teal-400 hover:bg-teal-500/10"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(project)}
                          className="h-8 w-8 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Status and Payment */}
                    <div className="flex flex-wrap gap-2">
                      <Badge className={`${statusColors[project.status]} border text-xs`}>
                        {project.status}
                      </Badge>
                      <Badge className={`border text-xs ${
                        project.payment_status === 'Paid' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                        project.payment_status === 'Waiting for Payment' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                        'bg-slate-500/20 text-slate-300 border-slate-500/30'
                      }`}>
                        {project.payment_status}
                      </Badge>
                      {isLate && (
                        <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs">
                          LATE
                        </Badge>
                      )}
                    </div>

                    {/* Deadline and Trello */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400">Deadline:</span>
                        <p className={isLate ? 'text-red-400 font-semibold' : 'text-white'}>
                          {project.deadline ? new Date(project.deadline).toLocaleDateString() : '-'}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400">Trello:</span>
                        <div className="mt-0.5">
                          {project.trello_card_url ? (
                            <a
                              href={project.trello_card_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-blue-400 hover:text-blue-300"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          ) : (
                            <span className="text-slate-600">-</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Client/Doer Info */}
                    <div className="text-xs">
                      {entityType === "client" ? (
                        <>
                          <span className="text-slate-400">Doer:</span>
                          <p className="text-white">{getDoerName(project.doer_id)}</p>
                        </>
                      ) : (
                        <>
                          <span className="text-slate-400">Client:</span>
                          <p className="text-white">{getClientName(project.client_id)}</p>
                        </>
                      )}
                    </div>

                    {/* Financial Info */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                      {entityType === "client" ? (
                        <>
                          <div>
                            <span className="text-slate-400 text-xs">Revenue:</span>
                            <p className="text-white font-semibold">
                              ${((project.client_deal_amount || 0) + (project.tip_amount || 0)).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-slate-400 text-xs">Profit:</span>
                            <p className={`font-semibold ${project.profit_margin >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              ${(project.profit_margin || 0).toLocaleString()}
                            </p>
                          </div>
                        </>
                      ) : (
                        <div>
                          <span className="text-slate-400 text-xs">Earned:</span>
                          <p className="text-white font-semibold">
                            ${(project.doer_cost_amount || 0).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* Add/Edit Modal */}
      <AddEditProjectModal
        isOpen={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setEditingProject(null);
        }}
        project={editingProject}
        defaultClientId={entityType === "client" ? entityId : null}
        defaultDoerId={entityType === "doer" ? entityId : null}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-900 border border-red-500/30 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to delete "{projectToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteProjectMutation.mutate(projectToDelete.id)}
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
