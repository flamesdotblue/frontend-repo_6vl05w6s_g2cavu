import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';

function FeedSearch({ onAddFeed, onPickSuggested }) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const suggestions = [
    { title: 'BBC World', url: 'http://feeds.bbci.co.uk/news/world/rss.xml' },
    { title: 'HN Front Page', url: 'https://hnrss.org/frontpage' },
    { title: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
    { title: 'Ars Technica', url: 'http://feeds.arstechnica.com/arstechnica/index' },
  ];

  const handleAdd = () => {
    setError('');
    const trimmedUrl = url.trim();
    const name = title.trim() || trimmedUrl;
    if (!trimmedUrl) {
      setError('Enter a valid RSS/Atom feed URL');
      return;
    }
    try {
      new URL(trimmedUrl);
      onAddFeed({ title: name, url: trimmedUrl });
      setUrl('');
      setTitle('');
    } catch (e) {
      setError('Enter a valid URL');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
        <div className="flex items-center gap-3 mb-3">
          <Search className="w-5 h-5 text-neutral-500" />
          <h2 className="font-semibold">Add a feed</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Optional title"
            className="md:col-span-2 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/feed.xml"
            className="md:col-span-3 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        <div className="mt-3 flex justify-end">
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Feed
          </button>
        </div>
      </div>

      <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
        <div className="flex items-center gap-3 mb-3">
          <Search className="w-5 h-5 text-neutral-500" />
          <h2 className="font-semibold">Suggestions</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s.url}
              onClick={() => onPickSuggested(s)}
              className="px-3 py-1.5 rounded-full text-sm bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 transition-colors"
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FeedSearch;
