import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { syncUserAction } from '@/server/actions/auth'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && user) {
      // Sincronizar usuario OAuth con la base de datos de Prisma
      await syncUserAction(
        { id: user.id, email: user.email! },
        { full_name: user.user_metadata.full_name, role: 'EMPLOYEE' }
      );
      
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Redirect to login if OAuth fails
  return NextResponse.redirect(`${origin}/login?error=oauth_failed`)
}
