import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Get the Postmark signature from headers
    const signature = request.headers.get('x-postmark-signature');
    
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing Postmark signature' },
        { status: 401 }
      );
    }

    // Verify the request is from Postmark using HMAC
    const webhookSecret = process.env.POSTMARK_INBOUND_TOKEN || '';
    const rawBody = JSON.stringify(body);
    
    const hmac = crypto.createHmac('sha256', webhookSecret);
    hmac.update(rawBody);
    const calculatedSignature = hmac.digest('hex');

    if (calculatedSignature !== signature) {
      return NextResponse.json(
        { error: 'Invalid Postmark signature' },
        { status: 401 }
      );
    }
    
    // Create a new task from the email
    const task = await prisma.task.create({
      data: {
        subject: body.Subject || 'No Subject',
        fromEmail: body.From || 'Unknown',
        body: body.TextBody || body.HtmlBody || 'No Content',
      },
    });

    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.error('Error processing inbound email:', error);
    return NextResponse.json(
      { error: 'Failed to process email' },
      { status: 500 }
    );
  }
} 