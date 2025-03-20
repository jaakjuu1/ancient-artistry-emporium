
import { supabase } from '@/integrations/supabase/client';

export interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  status: string;
  webhookUrl: string;
  schedule: string;
  lastRun: string;
  nextRun: string;
}

export interface ArtworkSource {
  id: string;
  name: string;
  url: string;
  active: boolean;
}

export const fetchAutomationWorkflows = async (): Promise<AutomationWorkflow[]> => {
  try {
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map((workflow) => ({
      id: workflow.id,
      name: workflow.name,
      description: workflow.description || '',
      status: workflow.status,
      webhookUrl: workflow.webhook_url || '',
      schedule: workflow.schedule || '',
      lastRun: workflow.last_run,
      nextRun: workflow.next_run,
    }));
  } catch (error) {
    console.error('Error fetching workflows:', error);
    return [];
  }
};

export const fetchArtSources = async (): Promise<ArtworkSource[]> => {
  try {
    const { data, error } = await supabase
      .from('art_sources')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    
    return data.map((source) => ({
      id: source.id,
      name: source.name,
      url: source.url,
      active: source.active,
    }));
  } catch (error) {
    console.error('Error fetching art sources:', error);
    return [];
  }
};

export const toggleWorkflowStatus = async (id: string, active: boolean): Promise<void> => {
  try {
    const { error } = await supabase
      .from('workflows')
      .update({ 
        status: active ? 'active' : 'inactive',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error toggling workflow status:', error);
    throw error;
  }
};

export const triggerWorkflowRun = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    // First, get the workflow to check if it has a webhook URL
    const { data: workflow, error: fetchError } = await supabase
      .from('workflows')
      .select('webhook_url, name')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    
    if (!workflow.webhook_url) {
      return {
        success: false,
        message: 'This workflow does not have a webhook URL configured.'
      };
    }
    
    // Trigger the webhook
    const response = await fetch(workflow.webhook_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        trigger: 'manual',
        timestamp: new Date().toISOString(),
      }),
      mode: 'no-cors', // This is needed for cross-origin requests
    });
    
    // Update the last run time in the database
    const { error: updateError } = await supabase
      .from('workflows')
      .update({ 
        last_run: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (updateError) throw updateError;
    
    return {
      success: true,
      message: `Workflow "${workflow.name}" has been triggered.`
    };
  } catch (error) {
    console.error('Error triggering workflow:', error);
    return {
      success: false,
      message: 'Failed to trigger workflow. Please check the webhook URL and try again.'
    };
  }
};

export const addNewWorkflow = async (workflow: AutomationWorkflow): Promise<void> => {
  try {
    const { error } = await supabase
      .from('workflows')
      .insert({
        name: workflow.name,
        description: workflow.description,
        status: workflow.status,
        webhook_url: workflow.webhookUrl,
        schedule: workflow.schedule,
        last_run: workflow.lastRun,
        next_run: workflow.nextRun,
      });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error adding workflow:', error);
    throw error;
  }
};

export const updateWorkflowWebhook = async (id: string, webhookUrl: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('workflows')
      .update({ 
        webhook_url: webhookUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error updating workflow webhook:', error);
    throw error;
  }
};

export const updateWorkflowSchedule = async (id: string, schedule: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('workflows')
      .update({ 
        schedule: schedule,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error updating workflow schedule:', error);
    throw error;
  }
};
