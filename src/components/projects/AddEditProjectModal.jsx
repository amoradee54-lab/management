
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
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";

export default function AddEditProjectModal({ isOpen, onClose, project, defaultClientId, defaultDoerId }) {
  const [formData, setFormData] = useState({
    title: "",
    order_number: "",
    project_date: new Date().toISOString().split('T')[0],
    deadline: "",
    completion_date: "",
    trello_card_url: "",
    status: "Potential",
    client_deal_amount: "",
    tip_amount: "",
    doer_cost_amount: "",
    deduction_amount: "",
    payment_platform: "PayPal",
    payment_status: "Pending",
    performance_rating: "",
    client_id: defaultClientId || "",
    doer_id: defaultDoerId || "",
    notes: ""
  });

  const queryClient = useQueryClient();

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => base44.entities.Client.list(),
  });

  const { data: doers = [] } = useQuery({
    queryKey: ['doers'],
    queryFn: () => base44.entities.Doer.list(),
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        order_number: project.order_number || "",
        project_date: project.project_date ? new Date(project.project_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        deadline: project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : "",
        completion_date: project.completion_date ? new Date(project.completion_date).toISOString().split('T')[0] : "",
        trello_card_url: project.trello_card_url || "",
        status: project.status || "Potential",
        client_deal_amount: project.client_deal_amount?.toString() || "",
        tip_amount: project.tip_amount?.toString() || "",
        doer_cost_amount: project.doer_cost_amount?.toString() || "",
        deduction_amount: project.deduction_amount?.toString() || "",
        payment_platform: project.payment_platform || "PayPal",
        payment_status: project.payment_status || "Pending",
        performance_rating: project.performance_rating?.toString() || "",
        client_id: project.client_id || defaultClientId || "",
        doer_id: project.doer_id || defaultDoerId || "",
        notes: project.notes || ""
      });
    } else {
      setFormData({
        title: "",
        order_number: "",
        project_date: new Date().toISOString().split('T')[0],
        deadline: "",
        completion_date: "",
        trello_card_url: "",
        status: "Potential",
        client_deal_amount: "",
        tip_amount: "",
        doer_cost_amount: "",
        deduction_amount: "",
        payment_platform: "PayPal",
        payment_status: "Pending",
        performance_rating: "",
        client_id: defaultClientId || "",
        doer_id: defaultDoerId || "",
        notes: ""
      });
    }
  }, [project, defaultClientId, defaultDoerId]);

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Project.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Project.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      onClose();
    },
  });

  const calculateProfitMargin = () => {
    const dealAmount = parseFloat(formData.client_deal_amount) || 0;
    const tipAmount = parseFloat(formData.tip_amount) || 0;
    const doerCost = parseFloat(formData.doer_cost_amount) || 0;
    const deduction = parseFloat(formData.deduction_amount) || 0;
    
    // Calculate commission based on platform - applies to BOTH deal and tip
    let commission = 0;
    if (formData.payment_platform === "Fiverr") {
      commission = (dealAmount + tipAmount) * 0.20; // 20% commission on total
    } else if (formData.payment_platform === "Upwork") {
      commission = (dealAmount + tipAmount) * 0.10; // 10% commission on total
    }
    // PayPal and Other have 0% commission
    
    const profit = (dealAmount + tipAmount) - commission - doerCost - deduction;
    return profit;
  };

  const profitMargin = calculateProfitMargin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const projectData = {
      ...formData,
      client_deal_amount: formData.client_deal_amount ? parseFloat(formData.client_deal_amount) : undefined,
      tip_amount: formData.tip_amount ? parseFloat(formData.tip_amount) : undefined,
      doer_cost_amount: formData.doer_cost_amount ? parseFloat(formData.doer_cost_amount) : undefined,
      deduction_amount: formData.deduction_amount ? parseFloat(formData.deduction_amount) : undefined,
      performance_rating: formData.performance_rating ? parseFloat(formData.performance_rating) : undefined,
      profit_margin: profitMargin,
      // `completed_at` is usually reserved for the timestamp of completion.
      // `completion_date` is for the date input.
      // We keep `completed_at` logic for status change if it's meant to be auto-filled,
      // but `completion_date` is now an explicit user input.
      completed_at: formData.status === "Completed" && !project?.completed_at ? new Date().toISOString() : project?.completed_at || undefined,
      deadline: formData.deadline || undefined,
      completion_date: formData.completion_date || undefined, // Store as string (YYYY-MM-DD) or undefined
      order_number: formData.order_number || undefined
    };

    if (project) {
      await updateMutation.mutateAsync({ id: project.id, data: projectData });
    } else {
      await createMutation.mutateAsync(projectData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border-teal-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-teal-300">
            {project ? "Edit Project" : "Add New Project"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Project Title and Order Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-teal-300">Project Title *</Label>
              <Input
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Website Redesign"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div>
              <Label className="text-teal-300">Order # (Optional)</Label>
              <Input
                value={formData.order_number}
                onChange={(e) => setFormData({ ...formData, order_number: e.target.value })}
                placeholder="e.g., ORD-2024-001"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>

          {/* Project Date, Deadline, and Completion Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-teal-300">Project Date *</Label>
              <Input
                type="date"
                required
                value={formData.project_date}
                onChange={(e) => setFormData({ ...formData, project_date: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div>
              <Label className="text-teal-300">Deadline</Label>
              <Input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div>
              <Label className="text-teal-300">Completion Date</Label>
              <Input
                type="date"
                value={formData.completion_date}
                onChange={(e) => setFormData({ ...formData, completion_date: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
              <p className="text-xs text-slate-400 mt-1">Actual date completed</p>
            </div>
          </div>

          {/* Trello URL */}
          <div>
            <Label className="text-teal-300">Trello Card URL</Label>
            <Input
              type="url"
              value={formData.trello_card_url}
              onChange={(e) => setFormData({ ...formData, trello_card_url: e.target.value })}
              placeholder="https://trello.com/c/..."
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          {/* Status and Payment Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-teal-300">Project Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="Potential">Potential</SelectItem>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-teal-300">Payment Status</Label>
              <Select
                value={formData.payment_status}
                onValueChange={(value) => setFormData({ ...formData, payment_status: value })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Waiting for Payment">Waiting for Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Client and Doer Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-teal-300">Client *</Label>
              <Select
                value={formData.client_id}
                onValueChange={(value) => setFormData({ ...formData, client_id: value })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white max-h-60">
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-teal-300">Doer *</Label>
              <Select
                value={formData.doer_id}
                onValueChange={(value) => setFormData({ ...formData, doer_id: value })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Select doer" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white max-h-60">
                  {doers.map((doer) => (
                    <SelectItem key={doer.id} value={doer.id}>
                      {doer.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Financial Details with Deduction */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-teal-300">Client Deal Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.client_deal_amount}
                  onChange={(e) => setFormData({ ...formData, client_deal_amount: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white pl-8"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <Label className="text-teal-300">Tip Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.tip_amount}
                  onChange={(e) => setFormData({ ...formData, tip_amount: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white pl-8"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <Label className="text-teal-300">Doer Cost Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.doer_cost_amount}
                  onChange={(e) => setFormData({ ...formData, doer_cost_amount: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white pl-8"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <Label className="text-teal-300">Deduction Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.deduction_amount}
                  onChange={(e) => setFormData({ ...formData, deduction_amount: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white pl-8"
                  placeholder="0.00"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">Manual adjustments (refunds, chargebacks, etc.)</p>
            </div>
          </div>

          {/* Payment Platform */}
          <div>
            <Label className="text-teal-300">Payment Platform</Label>
            <Select
              value={formData.payment_platform}
              onValueChange={(value) => setFormData({ ...formData, payment_platform: value })}
            >
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="Fiverr">Fiverr (20% commission)</SelectItem>
                <SelectItem value="Upwork">Upwork (10% commission)</SelectItem>
                <SelectItem value="PayPal">PayPal (0% commission)</SelectItem>
                <SelectItem value="Other">Other (0% commission)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Profit Margin - Calculated */}
          <div>
            <Label className="text-teal-300">Profit Margin (After Commission & Deductions)</Label>
            <div className={`p-4 rounded-lg border ${profitMargin >= 0 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <p className={`text-3xl font-bold ${profitMargin >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                ${profitMargin.toFixed(2)}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {formData.payment_platform === "Fiverr" && "After 20% Fiverr commission (on deal + tip)"}
                {formData.payment_platform === "Upwork" && "After 10% Upwork commission (on deal + tip)"}
                {(formData.payment_platform === "PayPal" || formData.payment_platform === "Other") && "No platform commission"}
              </p>
            </div>
          </div>

          {/* Performance Rating */}
          <div>
            <Label className="text-teal-300">Performance Rating (Doer)</Label>
            <div className="flex items-center gap-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFormData({ ...formData, performance_rating: rating.toString() })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        parseFloat(formData.performance_rating) >= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-600 hover:text-slate-500'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-white font-medium">
                {formData.performance_rating ? `${formData.performance_rating}/5` : 'Not rated'}
              </span>
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <Label className="text-teal-300">Deliveries & Comments</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add notes about deliveries, feedback, or any important comments..."
              className="bg-slate-800 border-slate-700 text-white min-h-32"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="border-slate-700 text-slate-300">
              Cancel
            </Button>
            <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
              {project ? "Update Project" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
