import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const events = await db.event.findMany({
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
    const { title, description, eventDate, category, attachments } = body;

    const event = await db.event.create({
      data: {
        title,
        description,
        eventDate: new Date(eventDate),
        category,
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

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
