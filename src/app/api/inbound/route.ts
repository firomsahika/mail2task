// In your api/inbound/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

// Best practice: Use a singleton Prisma client
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export async function POST(request: Request) {
  try {
    // Get the raw body text first for signature verification
    const rawBodyText = await request.text(); // Get raw body as text
    const body = JSON.parse(rawBodyText); // Then parse it as JSON

    console.log(body);

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
    // Ensure webhookSecret is not empty before creating HMAC
    if (!webhookSecret) {
         console.error('POSTMARK_INBOUND_TOKEN is not set!');
         return NextResponse.json(
            { error: 'Server token not configured' },
            { status: 500 }
         );
    }

    const hmac = crypto.createHmac('sha256', webhookSecret);
    hmac.update(rawBodyText); // Use the rawBodyText for HMAC
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