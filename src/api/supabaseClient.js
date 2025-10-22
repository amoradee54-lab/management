import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for common Supabase operations
export const supabaseOperations = {
  // Doers
  async listDoers() {
    const { data, error } = await supabase
      .from('doers')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getDoer(id) {
    const { data, error } = await supabase
      .from('doers')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async createDoer(doerData) {
    const { data, error } = await supabase
      .from('doers')
      .insert([doerData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateDoer(id, updates) {
    const { data, error } = await supabase
      .from('doers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteDoer(id) {
    const { error } = await supabase
      .from('doers')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  // Clients
  async listClients() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getClient(id) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async createClient(clientData) {
    const { data, error } = await supabase
      .from('clients')
      .insert([clientData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateClient(id, updates) {
    const { data, error} = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteClient(id) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  // Projects
  async listProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*, clients(*), doers(*)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getProject(id) {
    const { data, error } = await supabase
      .from('projects')
      .select('*, clients(*), doers(*)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async createProject(projectData) {
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateProject(id, updates) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteProject(id) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  // Quick Access Links
  async getQuickAccessLinks() {
    const { data, error } = await supabase
      .from('quick_access_links')
      .select('*')
      .limit(1)
      .single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data || {};
  },

  async updateQuickAccessLinks(updates) {
    // First check if a record exists
    const { data: existing } = await supabase
      .from('quick_access_links')
      .select('id')
      .limit(1)
      .single();

    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('quick_access_links')
        .update(updates)
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      // Create new
      const { data, error } = await supabase
        .from('quick_access_links')
        .insert([updates])
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  },
};
