
import { toast } from "@/components/ui/use-toast";

// Printful API configuration
const PRINTFUL_API_URL = "https://api.printful.com";
const PRINTFUL_API_KEY = "YOUR_PRINTFUL_API_KEY"; // Replace with your actual API key or use environment variables

// Types
export interface PrintfulProduct {
  id: number;
  external_id: string;
  name: string;
  variants: PrintfulVariant[];
  thumbnail_url: string;
  is_ignored: boolean;
}

export interface PrintfulVariant {
  id: number;
  external_id: string;
  variant_id: number;
  name: string;
  retail_price: string;
  files: {
    thumbnail_url: string;
    preview_url: string;
  }[];
}

export interface PrintfulOrder {
  id: number;
  external_id: string;
  status: string;
  shipping: string;
  retail_costs: {
    total: string;
  };
  recipient: {
    name: string;
    address1: string;
    city: string;
    state_code: string;
    country_code: string;
    zip: string;
  };
}

// Function to fetch products from Printful
export const fetchPrintfulProducts = async (): Promise<PrintfulProduct[]> => {
  try {
    const response = await fetch(`${PRINTFUL_API_URL}/store/products`, {
      headers: {
        "Authorization": `Bearer ${PRINTFUL_API_KEY}`,
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching products: ${response.status}`);
    }
    
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Failed to fetch Printful products:", error);
    toast({
      title: "Error",
      description: "Failed to fetch products. Please try again later.",
      variant: "destructive"
    });
    return [];
  }
};

// Function to create a product on Printful
export const createPrintfulProduct = async (
  artworkTitle: string, 
  artworkImage: string,
  productType: string,
  variantId: number
): Promise<PrintfulProduct | null> => {
  try {
    const productData = {
      sync_product: {
        name: artworkTitle,
        thumbnail: artworkImage
      },
      sync_variants: [
        {
          retail_price: calculatePrice(productType),
          variant_id: variantId,
          files: [
            {
              url: artworkImage
            }
          ]
        }
      ]
    };
    
    const response = await fetch(`${PRINTFUL_API_URL}/store/products`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PRINTFUL_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(productData)
    });
    
    if (!response.ok) {
      throw new Error(`Error creating product: ${response.status}`);
    }
    
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Failed to create Printful product:", error);
    toast({
      title: "Error",
      description: "Failed to create product. Please try again later.",
      variant: "destructive"
    });
    return null;
  }
};

// Function to submit an order to Printful
export const createPrintfulOrder = async (
  orderItems: Array<{ sync_variant_id: number, quantity: number }>,
  shippingInfo: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  }
): Promise<PrintfulOrder | null> => {
  try {
    const orderData = {
      recipient: {
        name: shippingInfo.name,
        address1: shippingInfo.address,
        city: shippingInfo.city,
        state_code: shippingInfo.state,
        country_code: shippingInfo.country,
        zip: shippingInfo.zip
      },
      items: orderItems
    };
    
    const response = await fetch(`${PRINTFUL_API_URL}/orders`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PRINTFUL_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    });
    
    if (!response.ok) {
      throw new Error(`Error creating order: ${response.status}`);
    }
    
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Failed to create Printful order:", error);
    toast({
      title: "Error",
      description: "Failed to submit order. Please try again later.",
      variant: "destructive"
    });
    return null;
  }
};

// Helper function to calculate price based on product type
const calculatePrice = (productType: string): string => {
  switch (productType) {
    case "canvas":
      return "89.99";
    case "framed-print":
      return "99.99";
    case "poster":
      return "39.99";
    case "t-shirt":
      return "29.99";
    default:
      return "49.99";
  }
};

// Function to get Printful variant ID for product type
export const getVariantId = (productType: string, size: string = "medium"): number => {
  // This would typically be a mapping to actual Printful variant IDs
  // These are placeholder values - you would need to replace with actual Printful variant IDs
  const variantMap: Record<string, Record<string, number>> = {
    "canvas": {
      "small": 1231,  // 12×16"
      "medium": 1232, // 18×24"
      "large": 1233   // 24×36"
    },
    "framed-print": {
      "small": 2231,
      "medium": 2232,
      "large": 2233
    },
    "poster": {
      "small": 3231,
      "medium": 3232,
      "large": 3233
    },
    "t-shirt": {
      "small": 4231,
      "medium": 4232,
      "large": 4233
    }
  };
  
  return variantMap[productType]?.[size] || 1232;  // Default to medium canvas if not found
};
