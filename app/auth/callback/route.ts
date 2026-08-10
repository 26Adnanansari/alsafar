import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && sessionData?.user) {
      const user = sessionData.user;
      
      // Check or create profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (!profile) {
        // New user via Google OAuth - create profile
        await supabase.from('profiles').upsert({
          id: user.id,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || 'User',
          phone: user.user_metadata?.phone || '00000000000',
          role: 'customer',
          preferred_language: 'ur',
        });
        return NextResponse.redirect(`${origin}/dashboard`);
      }
      
      // Role-based redirect
      if (profile.role === 'admin') return NextResponse.redirect(`${origin}/admin`);
      if (profile.role === 'agent') return NextResponse.redirect(`${origin}/agent`);
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  // Fallback
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
