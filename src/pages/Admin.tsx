
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  fetchArtSources, 
  fetchAutomationWorkflows, 
  toggleWorkflowStatus,
  triggerWorkflowRun,
  AutomationWorkflow,
  ArtworkSource 
} from '../utils/n8nAutomation';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle 
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Admin = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  
  // Fetch art sources
  const { 
    data: artSources = [],
    isLoading: isLoadingArtSources,
    error: artSourcesError 
  } = useQuery({
    queryKey: ['artSources'],
    queryFn: fetchArtSources
  });
  
  // Fetch workflows
  const { 
    data: workflows = [],
    isLoading: isLoadingWorkflows,
    error: workflowsError,
    refetch: refetchWorkflows
  } = useQuery({
    queryKey: ['workflows'],
    queryFn: fetchAutomationWorkflows
  });
  
  const handleToggleWorkflow = async (id: string, active: boolean) => {
    try {
      await toggleWorkflowStatus(id, active);
      refetchWorkflows();
      toast({
        title: "Workflow Updated",
        description: `Workflow status changed to ${active ? 'active' : 'inactive'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update workflow status",
        variant: "destructive"
      });
    }
  };
  
  const handleRunWorkflow = async (id: string) => {
    try {
      const result = await triggerWorkflowRun(id);
      if (result.success) {
        toast({
          title: "Workflow Triggered",
          description: result.message,
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to trigger workflow",
        variant: "destructive"
      });
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'inactive':
        return <Pause className="h-5 w-5 text-amber-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display text-mystic-900 mb-8">Admin Dashboard</h1>
          
          <Tabs defaultValue="workflows">
            <TabsList className="mb-8">
              <TabsTrigger value="workflows">Automation Workflows</TabsTrigger>
              <TabsTrigger value="sources">Art Sources</TabsTrigger>
            </TabsList>
            
            <TabsContent value="workflows">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-display text-mystic-900 mb-6">n8n Automation Workflows</h2>
                
                {isLoadingWorkflows ? (
                  <div className="flex justify-center p-8">
                    <RefreshCw className="h-8 w-8 text-mystic-700 animate-spin" />
                  </div>
                ) : workflowsError ? (
                  <div className="text-center p-8 text-red-500">
                    Error loading workflows
                  </div>
                ) : (
                  <div className="space-y-6">
                    {workflows.map((workflow) => (
                      <div 
                        key={workflow.id}
                        className="border border-mystic-200 rounded-lg p-6 hover:border-mystic-300 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusIcon(workflow.status)}
                              <h3 className="text-lg font-display text-mystic-900">{workflow.name}</h3>
                            </div>
                            <p className="text-mystic-700 mb-4">{workflow.description}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-mystic-600">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>Last Run: {formatDate(workflow.lastRun)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>Next Run: {formatDate(workflow.nextRun)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Switch 
                                id={`workflow-${workflow.id}`}
                                checked={workflow.status === 'active'}
                                onCheckedChange={(checked) => handleToggleWorkflow(workflow.id, checked)}
                              />
                              <Label htmlFor={`workflow-${workflow.id}`}>
                                {workflow.status === 'active' ? 'Active' : 'Inactive'}
                              </Label>
                            </div>
                            
                            <button
                              className="px-3 py-2 bg-sapphire-100 text-sapphire-700 rounded-md hover:bg-sapphire-200 transition-colors flex items-center gap-1"
                              onClick={() => handleRunWorkflow(workflow.id)}
                            >
                              <Play className="h-4 w-4" />
                              Run Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="sources">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-display text-mystic-900 mb-6">Art Sources</h2>
                
                {isLoadingArtSources ? (
                  <div className="flex justify-center p-8">
                    <RefreshCw className="h-8 w-8 text-mystic-700 animate-spin" />
                  </div>
                ) : artSourcesError ? (
                  <div className="text-center p-8 text-red-500">
                    Error loading art sources
                  </div>
                ) : (
                  <div className="space-y-6">
                    {artSources.map((source) => (
                      <div 
                        key={source.id}
                        className="border border-mystic-200 rounded-lg p-6 hover:border-mystic-300 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              {source.active ? (
                                <CheckCircle className="h-5 w-5 text-emerald-500" />
                              ) : (
                                <XCircle className="h-5 w-5 text-amber-500" />
                              )}
                              <h3 className="text-lg font-display text-mystic-900">{source.name}</h3>
                            </div>
                            <p className="text-mystic-700 mb-4">API URL: {source.url}</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Switch 
                              id={`source-${source.id}`}
                              checked={source.active}
                              // In a real implementation, this would update the source status
                              // onCheckedChange={(checked) => handleToggleSource(source.id, checked)}
                            />
                            <Label htmlFor={`source-${source.id}`}>
                              {source.active ? 'Active' : 'Inactive'}
                            </Label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Admin;
