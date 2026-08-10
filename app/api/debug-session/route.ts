import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return NextResponse.json({ error: 'Not logged in' });
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  return NextResponse.json({
    user_id: user.id,
    email: user.email,
    profile,
    message: profile?.role === 'admin' ? 'You ARE admin - redirect should work' : 'Role is: ' + profile?.role
  });
}
