import React from 'react';
import { Newspaper } from 'lucide-react';

function FeedArticles({ loading, error, articles, onSelectArticle, selectedArticleGuid }) {
  return (
    <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 h-full">
      <div className="flex items-center gap-3 mb-3">
        <Newspaper className="w-5 h-5 text-neutral-500" />
        <h2 className="font-semibold">Articles</h2>
      </div>
      {loading ? (
        <p className="text-sm text-neutral-500">Loading feed…</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : articles.length === 0 ? (
        <p className="text-sm text-neutral-500">No articles found.</p>
      ) : (
        <ul className="space-y-2 max-h-[70vh] overflow-auto pr-1">
          {articles.map((a) => {
            const active = a.guid === selectedArticleGuid;
            return (
              <li key={a.guid || a.link}>
                <button
                  onClick={() => onSelectArticle(a)}
                  className={`w-full text-left rounded-lg border px-3 py-2 transition-colors ${
                    active
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-600'
                      : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  <div className="font-medium truncate">{a.title || 'Untitled'}</div>
                  <div className="text-xs text-neutral-500 flex items-center justify-between gap-2">
                    <span className="truncate">{a.source || ''}</span>
                    {a.pubDate && (
                      <span>{new Date(a.pubDate).toLocaleString()}</span>
                    )}
                  </div>
                  {a.summary && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mt-1">{a.summary}</p>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default FeedArticles;
