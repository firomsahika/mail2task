// src/app/api/postmark/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { parsePostmarkEmail, PostmarkInboundEmail } from '@/lib/postmark';
import { createTaskFromEmail } from '@/services/taskService';

const POSTMARK_SERVER_TOKEN = process.env.POSTMARK_INBOUND_TOKEN;

export async function POST(req: NextRequest) {
  const token = req.headers.get('Postmark-Token');

  if (token !== POSTMARK_SERVER_TOKEN) {
    return NextResponse.json(
      { error: 'Invalid postmark token' },
      { status: 401 }
    );
  }

  const data = await req.json();

  console.log("Data from Postmark", data)
  
  const email = parsePostmarkEmail(data);


  try {
    const task = await createTaskFromEmail(
      email.Subject || 'No subject',
      email.TextBody,
      email.From,
      email.RecievedAt
    );
    return NextResponse.json({ message: 'Email Created', task });
  } catch (error) {
    console.error('DB error:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }

}
