import { supabase, isSupabaseConfigured } from './client';
import type { Session } from '@supabase/supabase-js';

export interface Lead {
  id: string;
  name: string;
  email: string;
  service: string;
  message: string;
  status: 'New' | 'Read' | 'Contacted';
  phone?: string;
  created_at: string;
}

export interface CMSCategory {
  id: string;
  name_en: string;
  name_es: string;
  display_order: number;
  sort_type: 'alphabetical' | 'custom';
}

export interface CMSService {
  id: string;
  category_id: string;
  title_en: string;
  title_es: string;
  description_en: string;
  description_es: string;
  icon: string;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
}

export interface CMSImage {
  id: string;
  service_id: string;
  url: string;
  storage_path?: string;
  display_order: number;
  created_at: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  service: string;
  message: string;
  phone?: string;
}

/**
 * Authentication Queries
 */

export const signIn = async (email: string, password: string) => {
  if (!isSupabaseConfigured) throw new Error("Supabase is not configured.");
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  if (isSupabaseConfigured) {
    await supabase.auth.signOut();
  }
};

export const getSession = async () => {
  if (!isSupabaseConfigured) return { data: { session: null }, error: null };
  return await supabase.auth.getSession();
};

export const onAuthStateChange = (callback: (event: string, session: Session | null) => void) => {
  if (!isSupabaseConfigured) return { data: { subscription: { unsubscribe: () => {} } } };
  
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
};

/**
 * Database Queries
 */

export const submitContactForm = async (formData: ContactFormData) => {
  if (!isSupabaseConfigured) {
    throw new Error("Our contact system is currently unavailable. Please call us directly.");
  }

  // 1. Save lead to DB
  const { error: dbError } = await supabase
    .from('contact_submissions')
    .insert([{
      ...formData,
      status: 'New'
    }]);

  if (dbError) throw dbError;

  // 2. Trigger notification edge function
  supabase.functions.invoke('send-contact-email', {
    body: formData
  }).catch(err => console.error("Email notification failed:", err));

  return true;
};

export const getLeads = async (): Promise<Lead[]> => {
  if (!isSupabaseConfigured) return [];
  
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as Lead[]) || [];
};

export const getLeadById = async (id: string): Promise<Lead | null> => {
  if (!isSupabaseConfigured) return null;
  
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching lead by ID:", error);
    return null;
  }
  return data as Lead;
};

export const updateLeadStatus = async (id: string, status: Lead['status']): Promise<void> => {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from('contact_submissions')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error("Error updating lead status:", error);
    throw error;
  }
};

/**
 * CMS & Settings Queries
 */

export const getSiteSettings = async (key: string) => {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('cms_settings')
    .select('value')
    .eq('key', key)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error(`Error fetching setting ${key}:`, error);
  }
  return data?.value;
};

export const updateSiteSetting = async (key: string, value: string | number | boolean | object | null) => {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from('cms_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() });

  if (error) throw error;
};

export const getCategories = async (): Promise<CMSCategory[]> => {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('cms_categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return (data as CMSCategory[]) || [];
};

export const getServices = async (): Promise<CMSService[]> => {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('cms_services')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return (data as CMSService[]) || [];
};

export const upsertCategory = async (category: Partial<CMSCategory>) => {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from('cms_categories')
    .upsert({ 
      ...category, 
      updated_at: new Date().toISOString() 
    });

  if (error) throw error;
};

export const upsertService = async (service: Partial<CMSService>) => {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from('cms_services')
    .upsert({ 
      ...service, 
      updated_at: new Date().toISOString() 
    });

  if (error) throw error;
};

export const deleteCategory = async (id: string) => {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from('cms_categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const deleteService = async (id: string) => {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from('cms_services')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

/**
 * Image Management
 */

export const getServiceImages = async (serviceId?: string): Promise<CMSImage[]> => {
  if (!isSupabaseConfigured) return [];
  
  let query = supabase.from('cms_images').select('*').order('display_order', { ascending: true });
  
  if (serviceId) {
    query = query.eq('service_id', serviceId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as CMSImage[]) || [];
};

export const uploadServiceImage = async (serviceId: string, file: Blob, fileName: string) => {
  if (!isSupabaseConfigured) return;

  const storagePath = `services/${serviceId}/${Date.now()}_${fileName}`;
  
  // 1. Upload to Storage
  const { error: uploadError } = await supabase.storage
    .from('service-images')
    .upload(storagePath, file, {
      contentType: 'image/webp',
      upsert: true
    });

  if (uploadError) throw uploadError;

  // 2. Get Public URL
  const { data: { publicUrl } } = supabase.storage
    .from('service-images')
    .getPublicUrl(storagePath);

  // 3. Save to Database
  const { error: dbError } = await supabase
    .from('cms_images')
    .insert([{
      service_id: serviceId,
      url: publicUrl,
      storage_path: storagePath,
      display_order: 0 // Will handle ordering logic in Admin UI if needed
    }]);

  if (dbError) throw dbError;
  return publicUrl;
};

export const addExternalImageLink = async (serviceId: string, url: string) => {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase
    .from('cms_images')
    .insert([{
      service_id: serviceId,
      url: url,
      display_order: 0
    }]);

  if (error) throw error;
};

export const deleteImage = async (imageId: string, storagePath?: string) => {
  if (!isSupabaseConfigured) return;

  // 1. Delete from Storage if exists
  if (storagePath) {
    await supabase.storage
      .from('service-images')
      .remove([storagePath]);
  }

  // 2. Delete from Database
  const { error } = await supabase
    .from('cms_images')
    .delete()
    .eq('id', imageId);

  if (error) throw error;
};
