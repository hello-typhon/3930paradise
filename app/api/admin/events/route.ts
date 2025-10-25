import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAdmin, getSession } from '@/lib/session';

// Get all events (including pending) - admin only
export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const events = await db.event.findMany({
      include: {
        attachments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const pending = events.filter(e => !e.isApproved);
    const approved = events.filter(e => e.isApproved);

    return NextResponse.json({ pending, approved, all: events });
  } catch (error) {
    console.error('Error fetching admin events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

// Approve or reject event
export async function PATCH(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await getSession();
    const { eventId, action } = await request.json();

    if (!eventId || !action) {
      return NextResponse.json({ error: 'Missing eventId or action' }, { status: 400 });
    }

    if (action === 'approve') {
      const event = await db.event.update({
        where: { id: eventId },
        data: {
          isApproved: true,
          approvedAt: new Date(),
          approvedBy: session.username,
        },
        include: {
          attachments: true,
        },
      });

      return NextResponse.json({ success: true, event });
    } else if (action === 'reject') {
      // Delete the event and its attachments
      await db.event.delete({
        where: { id: eventId },
      });

      return NextResponse.json({ success: true, message: 'Event rejected and deleted' });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

// Delete approved event
export async function DELETE(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('id');

    if (!eventId) {
      return NextResponse.json({ error: 'Missing event ID' }, { status: 400 });
    }

    await db.event.delete({
      where: { id: eventId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
