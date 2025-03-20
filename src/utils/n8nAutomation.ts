
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
    status: "active"
  },
  {
    id: "artist-research",
    name: "Artist Information Enrichment",
    description: "Researches artists and creates detailed biographies and historical context",
    lastRun: "2023-07-16T14:45:00Z",
    nextRun: "2023-07-23T14:45:00Z",
    status: "active"
  },
  {
    id: "product-creation",
    name: "Product Listing Generator",
    description: "Creates product listings on Printful for discovered artworks",
    lastRun: "2023-07-17T11:15:00Z",
    nextRun: "2023-07-24T11:15:00Z",
    status: "active"
  },
  {
    id: "social-media",
    name: "Social Media Promotion",
    description: "Automatically posts new artworks and products to social media channels",
    lastRun: "2023-07-18T16:30:00Z",
    nextRun: "2023-07-25T16:30:00Z",
    status: "inactive"
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
