import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from "jsonwebtoken"
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  let auth = request.headers.get("authorization")
  try {
    let payload = jwt.verify(auth as string, process.env.NEXTAUTH_SECRET as string) as Record<any, any>
    if(!payload.id) throw new Error()
    request.headers.set("user", payload.id)
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
  } catch(_) {
    return NextResponse.json({error: "401 UNAUTHORIZED", message: "You are not authorized to use this route."}, {status: 401})
  }
}
