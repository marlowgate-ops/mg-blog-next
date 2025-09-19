import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET
  const body = await req.json().catch(()=>({}))
  if (!secret || body.secret !== secret) {
    return NextResponse.json({ ok:false, error:'unauthorized' }, { status: 401 })
  }
  const path = body.path || '/best/forex-brokers-jp'
  revalidatePath(path)
  return NextResponse.json({ ok:true, revalidated:path })
}
