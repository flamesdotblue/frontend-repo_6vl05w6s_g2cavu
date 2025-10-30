import React from 'react';
import { Bookmark, Trash2 } from 'lucide-react';

function SavedFeeds({ feeds, selectedFeedUrl, onSelectFeed, onRemoveFeed }) {
  return (
    <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 h-full">
      <div className="flex items-center gap-3 mb-3">
        <Bookmark className="w-5 h-5 text-neutral-500" />
        <h2 className="font-semibold">Saved feeds</h2>
      </div>
      {feeds.length === 0 ? (
        <p className="text-sm text-neutral-500">No feeds yet. Add one to get started.</p>
      ) : (
        <ul className="space-y-2">
          {feeds.map((f) => {
            const active = selectedFeedUrl === f.url;
            return (
              <li key={f.url} className={`group flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm transition-colors cursor-pointer ${
                active
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-600'
                  : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800'
              }`}>
                <button
                  className="flex-1 text-left truncate"
                  onClick={() => onSelectFeed(f.url)}
                  title={f.title}
                >
                  {f.title}
                </button>
                <button
                  onClick={() => onRemoveFeed(f.url)}
                  className="opacity-70 group-hover:opacity-100 text-neutral-500 hover:text-red-600 transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default SavedFeeds;
