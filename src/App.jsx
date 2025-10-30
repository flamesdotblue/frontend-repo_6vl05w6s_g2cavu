import React, { useEffect, useMemo, useState } from 'react';
import FeedSearch from './components/FeedSearch.jsx';
import SavedFeeds from './components/SavedFeeds.jsx';
import FeedArticles from './components/FeedArticles.jsx';
import ArticleViewer from './components/ArticleViewer.jsx';
import { Rss } from 'lucide-react';

function App() {
  const [feeds, setFeeds] = useState(() => {
    try {
      const raw = localStorage.getItem('rss_feeds');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [selectedFeedUrl, setSelectedFeedUrl] = useState(() => {
    try {
      return localStorage.getItem('rss_selected_feed') || '';
    } catch {
      return '';
    }
  });
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    localStorage.setItem('rss_feeds', JSON.stringify(feeds));
  }, [feeds]);

  useEffect(() => {
    if (selectedFeedUrl) {
      localStorage.setItem('rss_selected_feed', selectedFeedUrl);
    }
  }, [selectedFeedUrl]);

  const selectedFeedTitle = useMemo(() => {
    const f = feeds.find((x) => x.url === selectedFeedUrl);
    return f ? f.title : '';
  }, [feeds, selectedFeedUrl]);

  const addFeed = ({ title, url }) => {
    if (feeds.some((f) => f.url === url)) return;
    const next = [...feeds, { title: title || url, url }];
    setFeeds(next);
    setSelectedFeedUrl(url);
  };

  const removeFeed = (url) => {
    const next = feeds.filter((f) => f.url !== url);
    setFeeds(next);
    if (selectedFeedUrl === url) {
      setSelectedFeedUrl(next[0]?.url || '');
      setArticles([]);
      setSelectedArticle(null);
    }
  };

  const parseFeedXml = (xmlText) => {
    const parser = new window.DOMParser();
    const xml = parser.parseFromString(xmlText, 'text/xml');
    const isAtom = xml.getElementsByTagName('entry').length > 0 && xml.getElementsByTagName('item').length === 0;

    const getText = (parent, names) => {
      for (const n of names) {
        const el = parent.getElementsByTagName(n)[0];
        if (el && el.textContent) return el.textContent;
      }
      return '';
    };

    const getAttr = (parent, tag, attr) => {
      const el = parent.getElementsByTagName(tag)[0];
      return el ? el.getAttribute(attr) || '' : '';
    };

    const items = Array.from(xml.getElementsByTagName(isAtom ? 'entry' : 'item')).map((node) => {
      const title = getText(node, ['title']);
      const link = isAtom
        ? (Array.from(node.getElementsByTagName('link')).find((l) => l.getAttribute('rel') !== 'self')?.getAttribute('href') || '')
        : getText(node, ['link']);
      const guid = getText(node, ['id', 'guid']) || link || title;
      const pubDate = getText(node, ['updated', 'published', 'pubDate']);
      const summary = getText(node, ['summary', 'description']);
      const content = getText(node, ['content:encoded', 'content', 'description', 'summary']);
      const imageByMedia = getAttr(node, 'media:content', 'url') || getAttr(node, 'enclosure', 'url');

      let image = imageByMedia;
      if (!image && content) {
        const m = content.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (m) image = m[1];
      }

      return {
        guid,
        title: title || '(no title)',
        link,
        pubDate,
        summary,
        content,
        image,
      };
    });

    return items;
  };

  const loadFeed = async (url) => {
    setLoading(true);
    setError('');
    setArticles([]);
    setSelectedArticle(null);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch feed (${res.status})`);
      const text = await res.text();
      const parsed = parseFeedXml(text);
      setArticles(parsed);
      setSelectedArticle(parsed[0] || null);
    } catch (e) {
      setError(
        'Could not load feed. Some feeds block direct browser access. Try another feed or use a backend proxy.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedFeedUrl) {
      loadFeed(selectedFeedUrl);
    }
  }, [selectedFeedUrl]);

  const headerTitle = selectedFeedTitle || 'RSS Reader';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900 text-neutral-900 dark:text-neutral-100">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/60 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600 text-white"><Rss className="w-5 h-5" /></div>
            <div>
              <h1 className="text-lg font-semibold">{headerTitle}</h1>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">Follow feeds, browse articles, read comfortably.</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <FeedSearch
            onAddFeed={addFeed}
            onPickSuggested={(s) => addFeed(s)}
          />
          <SavedFeeds
            feeds={feeds}
            selectedFeedUrl={selectedFeedUrl}
            onSelectFeed={(url) => setSelectedFeedUrl(url)}
            onRemoveFeed={removeFeed}
          />
        </div>
        <div className="lg:col-span-3 grid grid-cols-1 xl:grid-cols-2 gap-6">
          <FeedArticles
            loading={loading}
            error={error}
            articles={articles}
            onSelectArticle={setSelectedArticle}
            selectedArticleGuid={selectedArticle?.guid || ''}
          />
          <ArticleViewer article={selectedArticle} />
        </div>
      </main>
    </div>
  );
}

export default App;
