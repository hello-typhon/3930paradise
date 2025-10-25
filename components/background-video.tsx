'use client';

import { useEffect, useState } from 'react';

type BackgroundVideo = {
  id: string;
  videoUrl: string;
  opacity: number;
  order: number;
};

export function BackgroundVideo() {
  const [videos, setVideos] = useState<BackgroundVideo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Fetch active background videos
    fetch('/api/background-videos')
      .then((res) => res.json())
      .then((data) => {
        if (data.videos && data.videos.length > 0) {
          setVideos(data.videos);
        }
      })
      .catch((err) => console.error('Failed to load background videos:', err));
  }, []);

  useEffect(() => {
    if (videos.length <= 1) return;

    // Rotate videos every 30 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    }, 30000);

    return () => clearInterval(interval);
  }, [videos.length]);

  if (videos.length === 0) return null;

  const currentVideo = videos[currentIndex];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {videos.map((video, index) => (
        <video
          key={video.id}
          preload="auto"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{
            opacity: index === currentIndex ? video.opacity : 0,
          }}
        >
          <source src={video.videoUrl} type="video/mp4" />
        </video>
      ))}

      {/* Dark overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black opacity-30"></div>
    </div>
  );
}
