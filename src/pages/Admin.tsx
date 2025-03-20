
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  fetchArtSources, 
  fetchAutomationWorkflows, 
  toggleWorkflowStatus,
  triggerWorkflowRun,
  addNewWorkflow,
  updateWorkflowWebhook,
  updateWorkflowSchedule,
  AutomationWorkflow,
  ArtworkSource 
} from '../utils/n8nAutomation';
import { createPrintfulProduct, getVariantId } from '../utils/printful';
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
  AlertCircle,
  Plus,
  Image,
  FileText
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Schema for new workflow form
const workflowFormSchema = z.object({
  name: z.string().min(3, {
    message: "Workflow name must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  webhookUrl: z.string().url({
    message: "Please enter a valid webhook URL.",
  }),
  schedule: z.string().min(5, {
    message: "Please provide a valid cron schedule.",
  })
});

// Schema for new product form
const productFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  artist: z.string().min(2, {
    message: "Artist name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "Price must be a valid number.",
  }),
  imageUrl: z.string().url({
    message: "Please enter a valid image URL.",
  }),
  productType: z.string({
    required_error: "Please select a product type.",
  }),
  size: z.string({
    required_error: "Please select a size.",
  }),
});

type WorkflowFormValues = z.infer<typeof workflowFormSchema>;
type ProductFormValues = z.infer<typeof productFormSchema>;

const Admin = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [isEditingSchedule, setIsEditingSchedule] = useState<string | null>(null);
  const [isEditingWebhook, setIsEditingWebhook] = useState<string | null>(null);
  const [scheduleValue, setScheduleValue] = useState("");
  const [webhookValue, setWebhookValue] = useState("");
  
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
  
  // Setup forms
  const workflowForm = useForm<WorkflowFormValues>({
    resolver: zodResolver(workflowFormSchema),
    defaultValues: {
      name: "",
      description: "",
      webhookUrl: "https://",
      schedule: "0 0 * * *"
    }
  });

  const productForm = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: "",
      artist: "",
      description: "",
      price: "",
      imageUrl: "https://",
      productType: "canvas",
      size: "medium"
    }
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

  const handleEditSchedule = (id: string, currentSchedule: string) => {
    setIsEditingSchedule(id);
    setScheduleValue(currentSchedule);
  };

  const handleEditWebhook = (id: string, currentWebhook: string) => {
    setIsEditingWebhook(id);
    setWebhookValue(currentWebhook);
  };

  const handleSaveSchedule = async (id: string) => {
    try {
      await updateWorkflowSchedule(id, scheduleValue);
      setIsEditingSchedule(null);
      refetchWorkflows();
      toast({
        title: "Schedule Updated",
        description: "Workflow schedule has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update workflow schedule",
        variant: "destructive"
      });
    }
  };

  const handleSaveWebhook = async (id: string) => {
    try {
      await updateWorkflowWebhook(id, webhookValue);
      setIsEditingWebhook(null);
      refetchWorkflows();
      toast({
        title: "Webhook Updated",
        description: "Workflow webhook URL has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update webhook URL",
        variant: "destructive"
      });
    }
  };

  const onWorkflowSubmit = async (data: WorkflowFormValues) => {
    try {
      await addNewWorkflow({
        id: crypto.randomUUID(),
        name: data.name,
        description: data.description,
        lastRun: new Date().toISOString(),
        nextRun: new Date().toISOString(),
        status: 'inactive',
        webhookUrl: data.webhookUrl,
        schedule: data.schedule
      });
      workflowForm.reset();
      refetchWorkflows();
      toast({
        title: "Workflow Created",
        description: "New automation workflow has been created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create new workflow",
        variant: "destructive"
      });
    }
  };

  const onProductSubmit = async (data: ProductFormValues) => {
    try {
      const variantId = getVariantId(data.productType, data.size);
      
      const result = await createPrintfulProduct(
        data.title,
        data.imageUrl,
        data.productType,
        variantId
      );
      
      if (result) {
        toast({
          title: "Product Created",
          description: "New product has been created successfully on Printful",
        });
        productForm.reset();
      } else {
        throw new Error("Failed to create product");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create new product",
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
              <TabsTrigger value="products">Create Products</TabsTrigger>
            </TabsList>
            
            <TabsContent value="workflows">
              <div className="space-y-8">
                {/* Form to add new workflow */}
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Workflow</CardTitle>
                    <CardDescription>Create a new n8n automation workflow</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...workflowForm}>
                      <form onSubmit={workflowForm.handleSubmit(onWorkflowSubmit)} className="space-y-4">
                        <FormField
                          control={workflowForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Workflow Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Art Sourcing Workflow" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={workflowForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Discovers new mystical artworks from public domain sources" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={workflowForm.control}
                          name="webhookUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Webhook URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://n8n.example.com/webhook/trigger/123" {...field} />
                              </FormControl>
                              <FormDescription>
                                The webhook URL to trigger this workflow
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={workflowForm.control}
                          name="schedule"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Schedule (Cron Expression)</FormLabel>
                              <FormControl>
                                <Input placeholder="0 0 * * *" {...field} />
                              </FormControl>
                              <FormDescription>
                                When to run this workflow (e.g., "0 0 * * *" for daily at midnight)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" className="mt-4">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Workflow
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
                
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
                            <div className="w-full">
                              <div className="flex items-center gap-2 mb-2">
                                {getStatusIcon(workflow.status)}
                                <h3 className="text-lg font-display text-mystic-900">{workflow.name}</h3>
                              </div>
                              <p className="text-mystic-700 mb-4">{workflow.description}</p>
                              
                              <div className="grid grid-cols-1 gap-4 text-sm text-mystic-600 mb-4">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="font-semibold">Schedule:</span>
                                    {isEditingSchedule === workflow.id ? (
                                      <div className="flex items-center gap-2">
                                        <Input 
                                          value={scheduleValue} 
                                          onChange={(e) => setScheduleValue(e.target.value)}
                                          className="w-48"
                                          placeholder="0 0 * * *"
                                        />
                                        <Button 
                                          size="sm" 
                                          onClick={() => handleSaveSchedule(workflow.id)}
                                        >
                                          Save
                                        </Button>
                                        <Button 
                                          size="sm"
                                          variant="outline"
                                          onClick={() => setIsEditingSchedule(null)}
                                        >
                                          Cancel
                                        </Button>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2">
                                        <span>{workflow.schedule || "Not scheduled"}</span>
                                        <Button 
                                          size="sm" 
                                          variant="outline"
                                          onClick={() => handleEditSchedule(workflow.id, workflow.schedule || "")}
                                        >
                                          Edit
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                    <span className="font-semibold">Webhook URL:</span>
                                    {isEditingWebhook === workflow.id ? (
                                      <div className="flex items-center gap-2">
                                        <Input 
                                          value={webhookValue} 
                                          onChange={(e) => setWebhookValue(e.target.value)}
                                          className="w-48"
                                          placeholder="https://n8n.example.com/webhook/123"
                                        />
                                        <Button 
                                          size="sm" 
                                          onClick={() => handleSaveWebhook(workflow.id)}
                                        >
                                          Save
                                        </Button>
                                        <Button 
                                          size="sm"
                                          variant="outline"
                                          onClick={() => setIsEditingWebhook(null)}
                                        >
                                          Cancel
                                        </Button>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2">
                                        <span className="truncate max-w-xs">{workflow.webhookUrl || "None"}</span>
                                        <Button 
                                          size="sm" 
                                          variant="outline"
                                          onClick={() => handleEditWebhook(workflow.id, workflow.webhookUrl || "")}
                                        >
                                          Edit
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
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
                            
                            <div className="flex items-center gap-4 ml-4">
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
            
            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Product</CardTitle>
                  <CardDescription>Add a new product to your Printful catalog</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...productForm}>
                    <form onSubmit={productForm.handleSubmit(onProductSubmit)} className="space-y-4">
                      <FormField
                        control={productForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Title</FormLabel>
                            <FormControl>
                              <Input placeholder="The Garden of Earthly Delights" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={productForm.control}
                        name="artist"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Artist Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Hieronymus Bosch" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={productForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="A magnificent triptych painted between 1490 and 1510, depicting the Garden of Eden..." 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={productForm.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price</FormLabel>
                              <FormControl>
                                <Input type="text" placeholder="99.99" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={productForm.control}
                          name="imageUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://example.com/artwork.jpg" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={productForm.control}
                          name="productType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Product Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a product type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="canvas">Canvas Print</SelectItem>
                                  <SelectItem value="framed-print">Framed Print</SelectItem>
                                  <SelectItem value="poster">Poster</SelectItem>
                                  <SelectItem value="t-shirt">T-Shirt</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={productForm.control}
                          name="size"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Size</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a size" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="small">Small</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="large">Large</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button type="submit" className="mt-4 w-full">
                        <Image className="mr-2 h-4 w-4" />
                        Create Product
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Admin;
