import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyCaptcha } from '@/lib/captcha';

export async function GET() {
  try {
    // Only return approved events to public
    const events = await db.event.findMany({
      where: {
        isApproved: true,
      },
      include: {
        attachments: true,
      },
      orderBy: {
        eventDate: 'desc',
      },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, eventDate, category, attachments, captchaToken, submitterEmail } = body;

    // Verify CAPTCHA
    if (!captchaToken) {
      return NextResponse.json({ error: 'CAPTCHA token required' }, { status: 400 });
    }

    const isCaptchaValid = await verifyCaptcha(captchaToken);
    if (!isCaptchaValid) {
      return NextResponse.json({ error: 'CAPTCHA verification failed' }, { status: 400 });
    }

    // Create event (pending approval)
    const event = await db.event.create({
      data: {
        title,
        description,
        eventDate: new Date(eventDate),
        category,
        submitterEmail: submitterEmail || null,
        isApproved: false, // Requires admin approval
        attachments: {
          create: attachments?.map((att: any) => ({
            fileName: att.fileName,
            fileUrl: att.fileUrl,
            fileType: att.fileType,
            isPiiRedacted: att.isPiiRedacted || false,
            redactionAreas: att.redactionAreas,
          })) || [],
        },
      },
      include: {
        attachments: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Event submitted successfully. It will appear after admin approval.',
      eventId: event.id
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
