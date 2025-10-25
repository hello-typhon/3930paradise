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
            ACTUAL RESIDENT EXPERIENCES // NOT MARKETING COPY
          </p>
          <p className="text-sm text-gray-400 mt-2 leading-relaxed">
            Not "mindfully developed." Not "stylishly elevated." Not "socially conscious living."
            <br />
            Just documented facts from residents at Ainsley at The Collective.
          </p>
          <p className="text-xs text-yellow-400 mt-2 italic">
            This site is resident-created accountability. Elysian Living has Himalayan Salt Caves. We have receipts.
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
          <p className="text-sm mb-3">
            A chronological record of events at 3930 Paradise, Las Vegas.
            Personal information redacted. Truth preserved.
          </p>
          <div className="text-xs text-gray-300 border-t border-gray-600 pt-3 mt-3">
            <p className="mb-1"><span className="text-yellow-400">★</span> Not a "resort-style community" experience</p>
            <p className="mb-1"><span className="text-yellow-400">★</span> Not "health and wellness" focused maintenance responses</p>
            <p><span className="text-yellow-400">★</span> Just the reality behind the "ultra-modern" marketing</p>
          </div>
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
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-6">
            <div className="border-2 border-gray-700 p-4">
              <h3 className="text-yellow-400 font-bold mb-2 text-sm">WHAT THEY PROMISE:</h3>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>✓ "Socially conscious living"</li>
                <li>✓ "Health and wellness" focused</li>
                <li>✓ "Resort-style community"</li>
                <li>✓ "Ultra-modern designer fixtures"</li>
                <li>✓ "Active, highly social lifestyle"</li>
                <li>✓ Yoga, Pilates, Salt Caves, Red-Light Therapy</li>
              </ul>
            </div>
            <div className="border-2 border-red-700 p-4">
              <h3 className="text-red-400 font-bold mb-2 text-sm">WHAT RESIDENTS DOCUMENT:</h3>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>→ Check the timeline above</li>
                <li>→ Maintenance issues and response times</li>
                <li>→ Communication breakdowns</li>
                <li>→ Actual living conditions</li>
                <li>→ Fee discrepancies</li>
                <li>→ Reality vs. marketing promises</li>
              </ul>
            </div>
          </div>

          <div className="text-center border-t border-gray-700 pt-6">
            <p className="text-gray-400 text-sm mb-2">
              This site documents resident experiences at 3930 Paradise (Ainsley at The Collective).
            </p>
            <p className="text-gray-600 text-xs">
              Not affiliated with Elysian Living. Not "mindfully developed." Just resident accountability.
            </p>
            <p className="text-gray-700 text-xs mt-2">
              Built by residents who believe transparency matters more than Himalayan salt caves.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
