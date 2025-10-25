'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Video = {
  id: string;
  title: string;
  videoUrl: string;
  description: string | null;
  opacity: number;
  order: number;
  isActive: boolean;
  createdAt: string;
};

export default function AdminVideosPage() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    videoUrl: '',
    description: '',
    opacity: 0.15,
    order: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    loadVideos();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      if (!data.isLoggedIn) {
        router.push('/admin/login');
      }
    } catch (error) {
      router.push('/admin/login');
    }
  };

  const loadVideos = async () => {
    try {
      const response = await fetch('/api/admin/background-videos');
      if (!response.ok) throw new Error('Failed to load videos');
      const data = await response.json();
      setVideos(data.videos || []);
    } catch (error) {
      console.error('Failed to load videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId ? '/api/background-videos' : '/api/background-videos';
      const method = editingId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { id: editingId, ...formData } : formData),
      });

      if (!response.ok) throw new Error('Failed to save video');

      await loadVideos();
      resetForm();
    } catch (error) {
      alert('Failed to save video');
      console.error(error);
    }
  };

  const handleEdit = (video: Video) => {
    setEditingId(video.id);
    setFormData({
      title: video.title,
      videoUrl: video.videoUrl,
      description: video.description || '',
      opacity: video.opacity,
      order: video.order,
    });
    setShowForm(true);
  };

  const handleToggleActive = async (id: string, currentState: boolean) => {
    try {
      const response = await fetch('/api/background-videos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !currentState }),
      });

      if (!response.ok) throw new Error('Failed to toggle video');
      await loadVideos();
    } catch (error) {
      alert('Failed to toggle video');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this video?')) return;

    try {
      const response = await fetch(`/api/background-videos?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete video');
      await loadVideos();
    } catch (error) {
      alert('Failed to delete video');
      console.error(error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      title: '',
      videoUrl: '',
      description: '',
      opacity: 0.15,
      order: 0,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <p className="text-2xl">LOADING...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header */}
      <header className="border-b-4 border-red-500 p-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold">3930 PARADISE</h1>
          <p className="text-xl text-red-500 font-bold">BACKGROUND VIDEO MANAGER</p>
          <p className="text-xs text-gray-500 mt-2">
            Add subtle background videos to show property damage/issues while contrasting their polished marketing.
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-yellow-400 text-black p-2 border-b-4 border-white">
        <div className="max-w-6xl mx-auto flex gap-4 font-bold">
          <Link href="/admin" className="hover:underline">
            ← ADMIN PORTAL
          </Link>
          <Link href="/" className="hover:underline">
            PUBLIC TIMELINE
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-yellow-400 text-black px-6 py-3 font-bold border-4 border-white hover:bg-yellow-300"
          >
            {showForm ? 'CANCEL' : '+ ADD NEW VIDEO'}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 border-4 border-white p-6 bg-gray-900">
            <h3 className="text-xl font-bold mb-4 text-yellow-400">
              {editingId ? 'EDIT VIDEO' : 'ADD NEW VIDEO'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">TITLE *</label>
                <input
                  type="text"
                  required
                  className="w-full bg-black border-2 border-gray-600 p-2 text-white font-mono"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Water Damage - Unit 304"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">VIDEO URL *</label>
                <input
                  type="url"
                  required
                  className="w-full bg-black border-2 border-gray-600 p-2 text-white font-mono"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://..."
                />
                <p className="text-xs text-gray-500 mt-1">Direct link to MP4 file</p>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">DESCRIPTION</label>
                <textarea
                  className="w-full bg-black border-2 border-gray-600 p-2 text-white font-mono"
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What the video shows..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">
                    OPACITY (0.0 - 1.0)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="1"
                    className="w-full bg-black border-2 border-gray-600 p-2 text-white font-mono"
                    value={formData.opacity}
                    onChange={(e) =>
                      setFormData({ ...formData, opacity: parseFloat(e.target.value) })
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">Default: 0.15 (subtle)</p>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">DISPLAY ORDER</label>
                  <input
                    type="number"
                    className="w-full bg-black border-2 border-gray-600 p-2 text-white font-mono"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value) })
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">Lower numbers show first</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 font-bold border-2 border-white hover:bg-green-500"
                >
                  {editingId ? 'UPDATE' : 'ADD'} VIDEO
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-600 text-white px-6 py-2 font-bold border-2 border-white hover:bg-gray-500"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Video List */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-yellow-400 mb-4">
            BACKGROUND VIDEOS ({videos.length})
          </h3>

          {videos.length === 0 ? (
            <div className="border-4 border-white p-8 text-center">
              <p className="text-gray-400">No videos added yet</p>
            </div>
          ) : (
            videos.map((video) => (
              <div
                key={video.id}
                className={`border-4 p-4 ${
                  video.isActive ? 'border-green-600 bg-gray-900' : 'border-gray-600 bg-gray-800'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold flex items-center gap-2">
                      {video.title}
                      {!video.isActive && (
                        <span className="text-xs bg-gray-600 px-2 py-1">INACTIVE</span>
                      )}
                    </h4>
                    {video.description && (
                      <p className="text-sm text-gray-400 mt-1">{video.description}</p>
                    )}
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-3">
                  <p>URL: {video.videoUrl}</p>
                  <p>Opacity: {video.opacity} | Order: {video.order}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleActive(video.id, video.isActive)}
                    className={`px-4 py-2 font-bold border-2 border-white ${
                      video.isActive
                        ? 'bg-orange-600 hover:bg-orange-500'
                        : 'bg-green-600 hover:bg-green-500'
                    } text-white`}
                  >
                    {video.isActive ? 'DEACTIVATE' : 'ACTIVATE'}
                  </button>
                  <button
                    onClick={() => handleEdit(video)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 font-bold border-2 border-white"
                  >
                    EDIT
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 font-bold border-2 border-white"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 border-4 border-yellow-400 p-4 bg-yellow-900/20">
          <h4 className="text-yellow-400 font-bold mb-2">TIPS FOR BACKGROUND VIDEOS:</h4>
          <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
            <li>Use MP4 format for best compatibility</li>
            <li>Keep opacity between 0.1 - 0.2 for subtle effect</li>
            <li>Videos rotate every 30 seconds if multiple are active</li>
            <li>Upload damage/issue videos to contrast their polished marketing</li>
            <li>Host videos externally (or upload via UploadThing)</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
