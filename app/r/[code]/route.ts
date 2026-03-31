export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params
  const url = new URL(request.url)
  const signupUrl = new URL("/signup", url.origin)
  signupUrl.searchParams.set("ref", code.toUpperCase())
  return NextResponse.redirect(signupUrl, { status: 303 })
}
