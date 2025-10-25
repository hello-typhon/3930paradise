'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';

type Attachment = {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  isPiiRedacted: boolean;
};

type Event = {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  category: string;
  createdAt: string;
  attachments: Attachment[];
};

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header - Brutalist style */}
      <header className="border-b-4 border-red-500 p-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            3930 PARADISE
          </h1>
          <p className="text-xl md:text-2xl text-red-500 mt-2 font-bold">
            THE REAL STORY // NOT "MINDFULLY DEVELOPED"
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Unlike some "tastefully curated" luxury living experiences, this is the unfiltered truth.
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-yellow-400 text-black p-2 border-b-4 border-white">
        <div className="max-w-6xl mx-auto flex gap-4 font-bold">
          <Link href="/" className="hover:underline">
            TIMELINE
          </Link>
          <Link href="/submit" className="hover:underline">
            SUBMIT EVENT
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="mb-8 border-4 border-white p-4 bg-red-900">
          <h2 className="text-2xl font-bold mb-2">RESIDENT INCIDENT TIMELINE</h2>
          <p className="text-sm">
            A chronological record of events at 3930 Paradise, Las Vegas.
            Personal information redacted. Truth preserved.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-2xl py-16">LOADING...</div>
        ) : events.length === 0 ? (
          <div className="text-center border-4 border-white p-8">
            <p className="text-xl mb-4">NO EVENTS YET</p>
            <Link
              href="/submit"
              className="inline-block bg-yellow-400 text-black px-6 py-3 font-bold border-4 border-white hover:bg-yellow-300"
            >
              SUBMIT FIRST EVENT
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {events.map((event, index) => (
              <article
                key={event.id}
                className="border-4 border-white p-4 bg-gray-900 hover:border-yellow-400 transition-colors"
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
                  <div className="text-gray-500 text-sm">
                    Event #{events.length - index}
                  </div>
                </div>

                <p className="text-gray-300 mb-4 whitespace-pre-wrap">
                  {event.description}
                </p>

                {event.attachments.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
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
                            className="block"
                          >
                            <img
                              src={att.fileUrl}
                              alt={att.fileName}
                              className="w-full h-32 object-cover"
                            />
                            {att.isPiiRedacted && (
                              <span className="block text-xs text-red-500 mt-1">
                                PII REDACTED
                              </span>
                            )}
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

                <div className="mt-4 text-xs text-gray-500">
                  Posted: {format(new Date(event.createdAt), 'MMM dd, yyyy HH:mm')}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-red-500 mt-16 p-8 bg-black">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            This site documents resident experiences at 3930 Paradise.
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Not affiliated with Elysian Living or "mindfully developed" marketing.
          </p>
        </div>
      </footer>
    </div>
  );
}
