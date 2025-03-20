
import { supabase } from '@/integrations/supabase/client';
import { getVariantId } from '@/utils/printful';

export interface Product {
  id: string;
  title: string;
  artist: string;
  description: string;
  year: string;
  price: number;
  image: string;
  productType: string;
  variants: ProductVariant[];
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  variantId: number;
  size: string;
  price: number;
}

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_variants(*)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map((product) => ({
      id: product.id,
      title: product.title,
      artist: product.artist,
      description: product.description || '',
      year: product.year || '',
      price: parseFloat(product.price),
      image: product.image,
      productType: product.product_type,
      variants: product.product_variants?.map((variant: any) => ({
        id: variant.id,
        productId: variant.product_id,
        variantId: variant.variant_id,
        size: variant.size,
        price: parseFloat(variant.price),
      })) || [],
      createdAt: product.created_at,
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_variants(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      artist: data.artist,
      description: data.description || '',
      year: data.year || '',
      price: parseFloat(data.price),
      image: data.image,
      productType: data.product_type,
      variants: data.product_variants?.map((variant: any) => ({
        id: variant.id,
        productId: variant.product_id,
        variantId: variant.variant_id,
        size: variant.size,
        price: parseFloat(variant.price),
      })) || [],
      createdAt: data.created_at,
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

export const createProduct = async (product: Omit<Product, 'id' | 'variants' | 'createdAt'>): Promise<string | null> => {
  try {
    // Insert the product first
    const { data, error } = await supabase
      .from('products')
      .insert({
        title: product.title,
        artist: product.artist,
        description: product.description,
        year: product.year,
        price: product.price,
        image: product.image,
        product_type: product.productType,
      })
      .select('id')
      .single();
    
    if (error) throw error;
    
    const productId = data.id;
    
    // Create default variants (small, medium, large)
    const variants = [
      {
        product_id: productId,
        variant_id: getVariantId(product.productType, 'small'),
        size: 'small',
        price: product.productType === 'canvas' ? product.price - 10 : product.price - 5,
      },
      {
        product_id: productId,
        variant_id: getVariantId(product.productType, 'medium'),
        size: 'medium',
        price: product.price,
      },
      {
        product_id: productId,
        variant_id: getVariantId(product.productType, 'large'),
        size: 'large',
        price: product.productType === 'canvas' ? product.price + 20 : product.price + 10,
      },
    ];
    
    const { error: variantError } = await supabase
      .from('product_variants')
      .insert(variants);
    
    if (variantError) throw variantError;
    
    return productId;
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
};

export const updateProduct = async (product: Partial<Product> & { id: string }): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .update({
        title: product.title,
        artist: product.artist,
        description: product.description,
        year: product.year,
        price: product.price,
        image: product.image,
        product_type: product.productType,
        updated_at: new Date().toISOString(),
      })
      .eq('id', product.id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating product:', error);
    return false;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    // Product variants will be automatically deleted due to cascade constraint
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};

export const getProductsByType = async (productType: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_variants(*)')
      .eq('product_type', productType)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map((product) => ({
      id: product.id,
      title: product.title,
      artist: product.artist,
      description: product.description || '',
      year: product.year || '',
      price: parseFloat(product.price),
      image: product.image,
      productType: product.product_type,
      variants: product.product_variants?.map((variant: any) => ({
        id: variant.id,
        productId: variant.product_id,
        variantId: variant.variant_id,
        size: variant.size,
        price: parseFloat(variant.price),
      })) || [],
      createdAt: product.created_at,
    }));
  } catch (error) {
    console.error('Error fetching products by type:', error);
    return [];
  }
};
