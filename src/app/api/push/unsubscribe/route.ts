// import { getSupabaseAdminClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Push notification system is not in use – returning 503 until re-enabled.
export async function POST() {
  return Response.json({ success: false, error: 'Push notifications are not enabled.' }, { status: 503 })
}

/*
type UnsubscribeBody = {
  endpoint?: unknown
}

export async function POST(request: Request) {
  let body: UnsubscribeBody

  try {
    body = await request.json() as UnsubscribeBody
  } catch {
    return Response.json({ success: false, error: 'Invalid JSON body.' }, { status: 400 })
  }

  if (typeof body.endpoint !== 'string' || !body.endpoint) {
    return Response.json({ success: false, error: 'endpoint is required.' }, { status: 400 })
  }

  try {
    const now = new Date().toISOString()
    const supabase = getSupabaseAdminClient()
    const { error } = await supabase
      .from('push_subscriptions')
      .update({
        disabled_at: now,
        locked_until: null,
        updated_at: now,
      })
      .eq('endpoint', body.endpoint)

    if (error) {
      return Response.json({ success: false, error: 'Could not disable push subscription.' }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Push unsubscribe failed:', error)
    return Response.json({ success: false, error: 'Push unsubscribe is not configured.' }, { status: 500 })
  }
}
*/
