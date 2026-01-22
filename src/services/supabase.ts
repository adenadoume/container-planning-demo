import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Container types
export interface Container {
  id?: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface ContainerItem {
  id?: number;
  container_name: string;
  reference_code: string;
  supplier: string;
  cbm: number;
  cartons: number;
  gross_weight: number;
  product_cost: number;
  price_terms?: 'FOB' | 'FCA' | 'EXW';
  payment?: number;
  payment_date?: string;
  remaining?: number;
  status: 'READY TO SHIP' | 'AWAITING SUPPLIER' | 'NEED PAYMENT' | 'NO ANSWER' | 'PENDING' | 'IN PRODUCTION';
  awaiting: string[];
  production_days: number;
  production_ready: string;
  client: string;
  address?: string;
  remarks?: string;
  packing_list?: { url: string; name: string } | string;
  commercial_invoice?: { url: string; name: string } | string;
  hbl?: { url: string; name: string } | string;
  certificates?: { url: string; name: string } | string;
  created_at?: string;
  updated_at?: string;
}

export interface Supplier {
  id?: number;
  reference_code: string;
  supplier: string;
  product?: string;
  country_region?: string;
  province_state?: string;
  port?: string;
  contact_person?: string;
  email?: string;
  contact_number?: string;
  website?: string;
  active?: boolean;
  comments?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Arrival {
  id?: number;
  container_code: string;
  departure_port?: string;
  bl?: string;
  ref?: string;
  etd?: string;
  eta?: string;
  piraeus?: string;
  paleros?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EntypoParalavis {
  id?: number;
  row_number: number;
  // SUPPLIER Section
  description_of_goods?: string;
  material?: string;
  color?: string;
  supplier_code?: string;
  // Quantity & Remarks
  qty_meters?: number;
  r_field?: string;
  remarks_paralavi?: string;
  remarks?: string;
  // Picture Items
  picture_items?: string;
  // AROMA Section
  aroma_code?: string;
  aroma_description?: string;
  client?: string;
  price_existing?: number;
  new_price?: number;
  // Photography
  photography?: string;
  // Dimensions
  length?: number;
  width?: number;
  height?: number;
  // Pricing Base
  price_usd?: number;
  ship_to_forwarder?: number;
  multiplier_base?: number;
  // PRICE TENTATIVE Section
  multiplier_1?: number;
  multiplier_2?: number;
  multiplier_3?: number;
  multiplier_4?: number;
  // AROMA PRICE Section
  price_with_vat?: number;
  existing_price_calc?: number;
  proposal_price?: number;
  profit_margin_1?: number;
  profit_margin_2?: number;
  // Metadata
  created_at?: string;
  updated_at?: string;
}

// Container operations
export const containerService = {
  // Get all containers
  async getAll(): Promise<Container[]> {
    const { data, error } = await supabase
      .from('containers')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  // Create a new container
  async create(name: string): Promise<Container> {
    const { data, error } = await supabase
      .from('containers')
      .insert([{ name }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete a container
  async delete(name: string): Promise<void> {
    const { error } = await supabase
      .from('containers')
      .delete()
      .eq('name', name);
    
    if (error) throw error;
  }
};

// Container items operations
export const containerItemService = {
  // Get all items for a container
  async getByContainer(containerName: string): Promise<ContainerItem[]> {
    const { data, error } = await supabase
      .from('container_items')
      .select('*')
      .eq('container_name', containerName)
      .order('id');
    
    if (error) throw error;
    return data || [];
  },

  // Create a new item
  async create(item: Omit<ContainerItem, 'id' | 'created_at' | 'updated_at'>): Promise<ContainerItem> {
    const { data, error } = await supabase
      .from('container_items')
      .insert([item])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update an item
  async update(id: number, updates: Partial<ContainerItem>): Promise<ContainerItem> {
    const { data, error } = await supabase
      .from('container_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete an item
  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('container_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Bulk update items
  async bulkUpdate(items: ContainerItem[]): Promise<void> {
    const updates = items.map(item => ({
      id: item.id,
      ...item
    }));

    const { error } = await supabase
      .from('container_items')
      .upsert(updates);
    
    if (error) throw error;
  }
};


