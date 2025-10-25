'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';

type Attachment = {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
};

type Event = {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  category: string;
  submitterEmail?: string | null;
  createdAt: string;
  isApproved: boolean;
  attachments: Attachment[];
};

export default function AdminPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [pendingEvents, setPendingEvents] = useState<Event[]>([]);
  const [approvedEvents, setApprovedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');

  useEffect(() => {
    checkAuth();
    loadEvents();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();

      if (!data.isLoggedIn) {
        router.push('/admin/login');
        return;
      }

      setSession(data);
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/admin/login');
    }
  };

  const loadEvents = async () => {
    try {
      const response = await fetch('/api/admin/events');
      if (!response.ok) throw new Error('Failed to load events');

      const data = await response.json();
      setPendingEvents(data.pending || []);
      setApprovedEvents(data.approved || []);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (eventId: string) => {
    if (!confirm('Approve this event and make it public?')) return;

    try {
      const response = await fetch('/api/admin/events', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, action: 'approve' }),
      });

      if (!response.ok) throw new Error('Failed to approve');

      await loadEvents();
    } catch (error) {
      alert('Failed to approve event');
      console.error(error);
    }
  };

  const handleReject = async (eventId: string) => {
    if (!confirm('Reject and delete this event permanently?')) return;

    try {
      const response = await fetch('/api/admin/events', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, action: 'reject' }),
      });

      if (!response.ok) throw new Error('Failed to reject');

      await loadEvents();
    } catch (error) {
      alert('Failed to reject event');
      console.error(error);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Delete this approved event?')) return;

    try {
      const response = await fetch(`/api/admin/events?id=${eventId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      await loadEvents();
    } catch (error) {
      alert('Failed to delete event');
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <p className="text-2xl">LOADING...</p>
      </div>
    );
  }

  const eventsToShow = activeTab === 'pending' ? pendingEvents : approvedEvents;

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header */}
      <header className="border-b-4 border-red-500 p-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h1 className="text-4xl font-bold">3930 PARADISE</h1>
              <p className="text-xl text-red-500 font-bold">ADMIN PORTAL</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Logged in as: {session?.username}</p>
              <button
                onClick={handleLogout}
                className="text-sm text-yellow-400 hover:text-yellow-300 underline mt-1"
              >
                Logout
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 italic">
            Moderate submissions. Verify claims. Keep residents accountable and honest.
            <br />
            Unlike "resort-style" management, we actually review feedback.
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-yellow-400 text-black p-2 border-b-4 border-white">
        <div className="max-w-6xl mx-auto flex gap-4 font-bold">
          <Link href="/" className="hover:underline">
            ← PUBLIC TIMELINE
          </Link>
          <Link href="/submit" className="hover:underline">
            SUBMIT EVENT
          </Link>
        </div>
      </nav>

      {/* Tabs */}
      <div className="border-b-4 border-white">
        <div className="max-w-6xl mx-auto flex">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 p-4 font-bold text-xl ${
              activeTab === 'pending'
                ? 'bg-red-900 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            PENDING ({pendingEvents.length})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`flex-1 p-4 font-bold text-xl ${
              activeTab === 'approved'
                ? 'bg-green-900 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            APPROVED ({approvedEvents.length})
          </button>
        </div>
      </div>

      {/* Events List */}
      <main className="max-w-6xl mx-auto p-4 md:p-8">
        {eventsToShow.length === 0 ? (
          <div className="text-center border-4 border-white p-8">
            <p className="text-xl">
              NO {activeTab.toUpperCase()} EVENTS
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {eventsToShow.map((event) => (
              <article
                key={event.id}
                className="border-4 border-white p-4 bg-gray-900"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-yellow-400 text-black px-2 py-1 text-xs font-bold">
                        {event.category.toUpperCase()}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {format(new Date(event.eventDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                  </div>
                </div>

                <p className="text-gray-300 mb-4 whitespace-pre-wrap">
                  {event.description}
                </p>

                {event.submitterEmail && (
                  <div className="mb-4 text-sm">
                    <span className="text-gray-400">Contact: </span>
                    <span className="text-yellow-400">{event.submitterEmail}</span>
                  </div>
                )}

                {event.attachments.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                    {event.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="border-2 border-gray-600 p-2 bg-black"
                      >
                        {att.fileType === 'image' ? (
                          <a
                            href={att.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={att.fileUrl}
                              alt={att.fileName}
                              className="w-full h-32 object-cover"
                            />
                          </a>
                        ) : (
                          <a
                            href={att.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-blue-400 hover:underline text-sm"
                          >
                            📄 {att.fileName}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-xs text-gray-500 mb-4">
                  Submitted: {format(new Date(event.createdAt), 'MMM dd, yyyy HH:mm')}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {activeTab === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleApprove(event.id)}
                        className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 font-bold border-2 border-white"
                      >
                        ✓ APPROVE
                      </button>
                      <button
                        onClick={() => handleReject(event.id)}
                        className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 font-bold border-2 border-white"
                      >
                        ✗ REJECT
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 font-bold border-2 border-white"
                    >
                      DELETE
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
