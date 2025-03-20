
// This file contains utilities for interacting with n8n automation workflows
// These would typically be run on a server, but we're providing them here for demonstration

export interface ArtworkSource {
  id: string;
  name: string;
  url: string;
  apiKey?: string;
  active: boolean;
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  lastRun: string;
  nextRun: string;
  status: 'active' | 'inactive' | 'error';
  webhookUrl?: string;
  schedule?: string;
}

// Example n8n workflow configurations
// In a real implementation, these would be stored in a database or configuration file
export const artSources: ArtworkSource[] = [
  {
    id: "met-museum",
    name: "The Metropolitan Museum of Art",
    url: "https://collectionapi.metmuseum.org/public/collection/v1/",
    active: true
  },
  {
    id: "wikimedia-commons",
    name: "Wikimedia Commons",
    url: "https://commons.wikimedia.org/w/api.php",
    active: true
  },
  {
    id: "rijksmuseum",
    name: "Rijksmuseum",
    url: "https://www.rijksmuseum.nl/api/en/",
    apiKey: "your-rijksmuseum-api-key",
    active: false
  }
];

export const automationWorkflows: AutomationWorkflow[] = [
  {
    id: "art-sourcing",
    name: "Art Sourcing Workflow",
    description: "Discovers new mystical and historical artworks from public domain sources",
    lastRun: "2023-07-15T09:30:00Z",
    nextRun: "2023-07-22T09:30:00Z",
    status: "active",
    webhookUrl: "https://n8n.example.com/webhook/art-sourcing",
    schedule: "0 0 * * 0" // Weekly on Sundays
  },
  {
    id: "artist-research",
    name: "Artist Information Enrichment",
    description: "Researches artists and creates detailed biographies and historical context",
    lastRun: "2023-07-16T14:45:00Z",
    nextRun: "2023-07-23T14:45:00Z",
    status: "active",
    webhookUrl: "https://n8n.example.com/webhook/artist-research",
    schedule: "0 0 * * 1" // Weekly on Mondays
  },
  {
    id: "product-creation",
    name: "Product Listing Generator",
    description: "Creates product listings on Printful for discovered artworks",
    lastRun: "2023-07-17T11:15:00Z",
    nextRun: "2023-07-24T11:15:00Z",
    status: "active",
    webhookUrl: "https://n8n.example.com/webhook/product-creation",
    schedule: "0 0 * * 2" // Weekly on Tuesdays
  },
  {
    id: "social-media",
    name: "Social Media Promotion",
    description: "Automatically posts new artworks and products to social media channels",
    lastRun: "2023-07-18T16:30:00Z",
    nextRun: "2023-07-25T16:30:00Z",
    status: "inactive",
    webhookUrl: "https://n8n.example.com/webhook/social-media",
    schedule: "0 0 * * 3" // Weekly on Wednesdays
  }
];

// Sample n8n workflow JSON - This would typically be stored in n8n
export const sampleWorkflowJson = `
{
  "nodes": [
    {
      "parameters": {
        "url": "https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=medieval+mystical",
        "options": {}
      },
      "name": "Met Museum API",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [
        240,
        300
      ]
    },
    {
      "parameters": {
        "functionCode": "// Filter for relevant artworks with mystical themes\\nconst data = $input.json.objectIDs;\\n\\n// Take only first 5 items for demonstration\\nconst limitedData = data.slice(0, 5);\\n\\n// Return data for further processing\\nreturn {json: {objectIDs: limitedData}};\\n"
      },
      "name": "Filter Results",
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [
        460,
        300
      ]
    },
    {
      "parameters": {
        "batchSize": 1,
        "options": {}
      },
      "name": "Split Into Objects",
      "type": "n8n-nodes-base.splitInBatches",
      "typeVersion": 1,
      "position": [
        680,
        300
      ]
    },
    {
      "parameters": {
        "url": "=https://collectionapi.metmuseum.org/public/collection/v1/objects/{{$json.objectIDs[0]}}",
        "options": {}
      },
      "name": "Get Artwork Details",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [
        900,
        300
      ]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{$json.primaryImage}}",
              "operation": "isNotEmpty"
            }
          ]
        }
      },
      "name": "Has Image?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [
        1120,
        300
      ]
    },
    {
      "parameters": {
        "functionCode": "// Format the data for our system\\nconst artwork = $input.json;\\n\\nreturn {\\n  json: {\\n    title: artwork.title,\\n    artist: artwork.artistDisplayName || 'Unknown Artist',\\n    year: artwork.objectDate || 'Unknown',\\n    image: artwork.primaryImage,\\n    description: artwork.objectDescription || artwork.objectName || 'A mystical artwork from history',\\n    source: 'The Metropolitan Museum of Art',\\n    sourceId: artwork.objectID.toString(),\\n    medium: artwork.medium || 'Unknown',\\n    dimensions: artwork.dimensions || ''\\n  }\\n};\\n"
      },
      "name": "Format Artwork Data",
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [
        1340,
        240
      ]
    },
    {
      "parameters": {
        "url": "https://your-backend-api.com/api/artworks",
        "method": "POST",
        "bodyParametersUi": {
          "parameter": [
            {
              "name": "title",
              "value": "={{$json.title}}"
            },
            {
              "name": "artist",
              "value": "={{$json.artist}}"
            },
            {
              "name": "year",
              "value": "={{$json.year}}"
            },
            {
              "name": "image",
              "value": "={{$json.image}}"
            },
            {
              "name": "description",
              "value": "={{$json.description}}"
            },
            {
              "name": "source",
              "value": "={{$json.source}}"
            },
            {
              "name": "sourceId",
              "value": "={{$json.sourceId}}"
            }
          ]
        },
        "options": {}
      },
      "name": "Save to Database",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [
        1560,
        240
      ]
    }
  ],
  "connections": {
    "Met Museum API": {
      "main": [
        [
          {
            "node": "Filter Results",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Filter Results": {
      "main": [
        [
          {
            "node": "Split Into Objects",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Split Into Objects": {
      "main": [
        [
          {
            "node": "Get Artwork Details",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Get Artwork Details": {
      "main": [
        [
          {
            "node": "Has Image?",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Has Image?": {
      "main": [
        [
          {
            "node": "Format Artwork Data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Format Artwork Data": {
      "main": [
        [
          {
            "node": "Save to Database",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
`;

// These functions would typically call your n8n instance API
// For demonstration, they simply return the mock data

export const fetchArtSources = async (): Promise<ArtworkSource[]> => {
  // In a real implementation, this would call your n8n instance or API
  return new Promise((resolve) => {
    setTimeout(() => resolve(artSources), 500);
  });
};

export const fetchAutomationWorkflows = async (): Promise<AutomationWorkflow[]> => {
  // In a real implementation, this would call your n8n instance or API
  return new Promise((resolve) => {
    setTimeout(() => resolve(automationWorkflows), 500);
  });
};

export const toggleWorkflowStatus = async (id: string, active: boolean): Promise<AutomationWorkflow> => {
  // In a real implementation, this would call your n8n instance or API
  return new Promise((resolve) => {
    const workflow = automationWorkflows.find(w => w.id === id);
    if (workflow) {
      workflow.status = active ? 'active' : 'inactive';
    }
    setTimeout(() => resolve(workflow as AutomationWorkflow), 500);
  });
};

export const triggerWorkflowRun = async (id: string): Promise<{ success: boolean; message: string }> => {
  // In a real implementation, this would call your n8n instance or API to trigger a workflow run
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: `Workflow ${id} triggered successfully`
      });
    }, 1000);
  });
};

// New functions for enhancing n8n workflow management

export const addNewWorkflow = async (workflow: AutomationWorkflow): Promise<AutomationWorkflow> => {
  // In a real implementation, this would call your n8n instance API to create a new workflow
  return new Promise((resolve) => {
    // Add workflow to the array (simulating a database save)
    automationWorkflows.push(workflow);
    
    setTimeout(() => {
      resolve(workflow);
    }, 1000);
  });
};

export const updateWorkflowWebhook = async (id: string, webhookUrl: string): Promise<AutomationWorkflow> => {
  // In a real implementation, this would update the webhook URL in your n8n instance
  return new Promise((resolve, reject) => {
    const workflow = automationWorkflows.find(w => w.id === id);
    
    if (workflow) {
      workflow.webhookUrl = webhookUrl;
      setTimeout(() => resolve(workflow), 500);
    } else {
      reject(new Error("Workflow not found"));
    }
  });
};

export const updateWorkflowSchedule = async (id: string, schedule: string): Promise<AutomationWorkflow> => {
  // In a real implementation, this would update the schedule in your n8n instance
  return new Promise((resolve, reject) => {
    const workflow = automationWorkflows.find(w => w.id === id);
    
    if (workflow) {
      workflow.schedule = schedule;
      
      // Update the next run date based on the new schedule
      // This is a simplified example - in a real implementation you would parse the cron expression
      const nextRun = new Date();
      nextRun.setDate(nextRun.getDate() + 7); // Just add 7 days for this example
      workflow.nextRun = nextRun.toISOString();
      
      setTimeout(() => resolve(workflow), 500);
    } else {
      reject(new Error("Workflow not found"));
    }
  });
};

export const deleteWorkflow = async (id: string): Promise<boolean> => {
  // In a real implementation, this would delete the workflow from your n8n instance
  return new Promise((resolve) => {
    const index = automationWorkflows.findIndex(w => w.id === id);
    
    if (index !== -1) {
      automationWorkflows.splice(index, 1);
      resolve(true);
    } else {
      resolve(false);
    }
  });
};
