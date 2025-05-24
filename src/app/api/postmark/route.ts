// src/app/api/postmark/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const data = await req.json();

  // your logic here

  return NextResponse.json({ message: 'Email processed' });
}
