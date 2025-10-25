import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAdmin } from '@/lib/session';

// Get active background videos for public display
export async function GET() {
  try {
    const videos = await db.backgroundVideo.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        order: 'asc',
      },
      select: {
        id: true,
        videoUrl: true,
        opacity: true,
        order: true,
      },
    });

    return NextResponse.json({ videos });
  } catch (error) {
    console.error('Error fetching background videos:', error);
    return NextResponse.json({ videos: [] });
  }
}

// Admin: Create new background video
export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, videoUrl, description, opacity, order } = body;

    if (!title || !videoUrl) {
      return NextResponse.json(
        { error: 'Title and video URL required' },
        { status: 400 }
      );
    }

    const video = await db.backgroundVideo.create({
      data: {
        title,
        videoUrl,
        description: description || null,
        opacity: opacity !== undefined ? opacity : 0.15,
        order: order !== undefined ? order : 0,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, video });
  } catch (error) {
    console.error('Error creating background video:', error);
    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    );
  }
}

// Admin: Update background video
export async function PATCH(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, videoUrl, description, opacity, order, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'Video ID required' }, { status: 400 });
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
    if (description !== undefined) updateData.description = description;
    if (opacity !== undefined) updateData.opacity = opacity;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    const video = await db.backgroundVideo.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, video });
  } catch (error) {
    console.error('Error updating background video:', error);
    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 }
    );
  }
}

// Admin: Delete background video
export async function DELETE(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Video ID required' }, { status: 400 });
    }

    await db.backgroundVideo.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting background video:', error);
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    );
  }
}
