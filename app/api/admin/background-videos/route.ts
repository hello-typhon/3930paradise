import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAdmin } from '@/lib/session';

// Get all background videos (including inactive) for admin
export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const videos = await db.backgroundVideo.findMany({
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json({ videos });
  } catch (error) {
    console.error('Error fetching admin background videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}
