import React from 'react';
import { ExternalLink } from 'lucide-react';

function ArticleViewer({ article }) {
  if (!article) {
    return (
      <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 h-full">
        <p className="text-sm text-neutral-500">Select an article to read.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 h-full">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h2 className="text-lg font-semibold leading-tight">{article.title}</h2>
          {article.pubDate && (
            <p className="text-xs text-neutral-500">{new Date(article.pubDate).toLocaleString()}</p>
          )}
        </div>
        {article.link && (
          <a
            href={article.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            Open <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
      {article.image && (
        <img
          src={article.image}
          alt=""
          className="w-full rounded-lg mb-4 max-h-72 object-cover"
        />
      )}
      {article.content ? (
        <div
          className="prose dark:prose-invert max-w-none prose-a:text-blue-600"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      ) : (
        <p className="text-sm text-neutral-600 dark:text-neutral-300">No content available.</p>
      )}
    </div>
  );
}

export default ArticleViewer;
