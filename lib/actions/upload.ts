'use server';

import { createClient } from '@/lib/supabase/server';

export async function uploadPackageImage(formData: FormData): Promise<{ url?: string; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const file = formData.get('file') as File;
  if (!file || file.size === 0) return { error: 'No file selected' };
  
  // Max 5MB
  if (file.size > 5 * 1024 * 1024) return { error: 'File 5MB se bari hai' };
  
  const ext = file.name.split('.').pop();
  const filename = `packages/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(filename, file, { contentType: file.type, upsert: false });

  if (uploadError) return { error: uploadError.message };

  const { data } = supabase.storage.from('media').getPublicUrl(filename);
  return { url: data.publicUrl };
}
