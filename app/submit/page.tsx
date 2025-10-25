'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UploadButton } from '@/lib/uploadthing';

type UploadedFile = {
  url: string;
  name: string;
  type: string;
};

export default function SubmitPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    category: 'complaint',
  });
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          attachments: uploadedFiles.map((file) => ({
            fileName: file.name,
            fileUrl: file.url,
            fileType: file.type.startsWith('image/') ? 'image' : 'document',
            isPiiRedacted: false,
          })),
        }),
      });

      if (!response.ok) throw new Error('Failed to submit event');

      router.push('/');
    } catch (err) {
      setError('Failed to submit event. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header */}
      <header className="border-b-4 border-red-500 p-4 bg-black">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            3930 PARADISE
          </h1>
          <p className="text-xl md:text-2xl text-red-500 mt-2 font-bold">
            SUBMIT EVENT
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-yellow-400 text-black p-2 border-b-4 border-white">
        <div className="max-w-4xl mx-auto flex gap-4 font-bold">
          <Link href="/" className="hover:underline">
            ← BACK TO TIMELINE
          </Link>
        </div>
      </nav>

      {/* Form */}
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="mb-8 border-4 border-white p-4 bg-red-900">
          <h2 className="text-xl font-bold mb-2">DOCUMENTATION GUIDELINES</h2>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>Be factual and specific with dates</li>
            <li>Upload screenshots, emails, or documents as evidence</li>
            <li>Remove or blur personal information before uploading</li>
            <li>Include relevant details but avoid defamation</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="border-4 border-white p-4 bg-gray-900">
            <label className="block text-yellow-400 font-bold mb-2" htmlFor="title">
              EVENT TITLE *
            </label>
            <input
              id="title"
              type="text"
              required
              className="w-full bg-black border-2 border-gray-600 p-3 text-white font-mono focus:border-yellow-400 outline-none"
              placeholder="e.g., Water leak in unit - no response for 3 days"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Date */}
          <div className="border-4 border-white p-4 bg-gray-900">
            <label className="block text-yellow-400 font-bold mb-2" htmlFor="eventDate">
              DATE OF EVENT *
            </label>
            <input
              id="eventDate"
              type="date"
              required
              className="w-full bg-black border-2 border-gray-600 p-3 text-white font-mono focus:border-yellow-400 outline-none"
              value={formData.eventDate}
              onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
            />
          </div>

          {/* Category */}
          <div className="border-4 border-white p-4 bg-gray-900">
            <label className="block text-yellow-400 font-bold mb-2" htmlFor="category">
              CATEGORY *
            </label>
            <select
              id="category"
              required
              className="w-full bg-black border-2 border-gray-600 p-3 text-white font-mono focus:border-yellow-400 outline-none"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="maintenance">Maintenance Issue</option>
              <option value="complaint">Complaint</option>
              <option value="violation">Safety/Code Violation</option>
              <option value="notice">Notice/Communication</option>
              <option value="fee">Unexpected Fee/Charge</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Description */}
          <div className="border-4 border-white p-4 bg-gray-900">
            <label className="block text-yellow-400 font-bold mb-2" htmlFor="description">
              DESCRIPTION *
            </label>
            <textarea
              id="description"
              required
              rows={6}
              className="w-full bg-black border-2 border-gray-600 p-3 text-white font-mono focus:border-yellow-400 outline-none resize-y"
              placeholder="Provide details about what happened. Be specific about dates, times, people contacted, and responses received."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* File Upload */}
          <div className="border-4 border-white p-4 bg-gray-900">
            <label className="block text-yellow-400 font-bold mb-2">
              ATTACHMENTS (Optional)
            </label>
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-4">
                Upload screenshots, emails, or documents. Make sure to remove/blur personal information first.
              </p>
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res) {
                    const newFiles = res.map((file) => ({
                      url: file.url,
                      name: file.name,
                      type: file.type,
                    }));
                    setUploadedFiles([...uploadedFiles, ...newFiles]);
                  }
                }}
                onUploadError={(error: Error) => {
                  alert(`Upload error: ${error.message}`);
                }}
              />
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-bold mb-2">Uploaded Files:</p>
                <ul className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-black border border-gray-600 p-2"
                    >
                      <span className="text-sm truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
                        }
                        className="text-red-500 hover:text-red-400 text-xs font-bold"
                      >
                        REMOVE
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="border-4 border-red-500 p-4 bg-red-900">
              <p className="font-bold">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-yellow-400 text-black p-4 font-bold text-xl border-4 border-white hover:bg-yellow-300 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {submitting ? 'SUBMITTING...' : 'SUBMIT EVENT'}
          </button>
        </form>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-red-500 mt-16 p-8 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            All submissions are public. Do not include personal information.
          </p>
        </div>
      </footer>
    </div>
  );
}
