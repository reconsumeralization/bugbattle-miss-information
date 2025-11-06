import React, { useEffect, useState } from 'react';
import { fetchNews } from '../utils/api';

interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  category: string;
  importance: string;
  timestamp: string;
}

export default function NewsFeed() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setIsLoading(true);
        const newsData = await fetchNews();
        setArticles(newsData.articles || []);
      } catch (err) {
        console.error('Failed to load news:', err);
        setError('Failed to load news updates. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadNews();
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technology': return '⚡';
      case 'policy': return '📋';
      case 'economics': return '💰';
      case 'employment': return '👥';
      default: return '📰';
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return '#dc2626';
      case 'medium': return '#f59e0b';
      case 'low': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div style={{ 
        border: '1px solid #e5e7eb', 
        borderRadius: '0.5rem',
        padding: '1.5rem', 
        marginBottom: '2rem',
        backgroundColor: 'white'
      }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>📰 Renewable Energy News</h3>
        <p>Loading latest updates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        border: '1px solid #e5e7eb', 
        borderRadius: '0.5rem',
        padding: '1.5rem', 
        marginBottom: '2rem',
        backgroundColor: 'white'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#dc2626' }}>📰 Renewable Energy News</h3>
        <p style={{ color: '#dc2626' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ 
      border: '1px solid #e5e7eb', 
      borderRadius: '0.5rem',
      padding: '1.5rem', 
      marginBottom: '2rem',
      backgroundColor: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ 
        margin: '0 0 1.5rem 0',
        color: '#1f2937',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        📰 Latest Renewable Energy News
      </h3>

      {articles.length === 0 ? (
        <p style={{ color: '#6b7280', fontStyle: 'italic' }}>
          No news articles available at the moment.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {articles.map((article) => (
            <article
              key={article.id}
              style={{
                padding: '1rem',
                border: '1px solid #f3f4f6',
                borderRadius: '0.375rem',
                backgroundColor: '#fafafa',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f9ff';
                e.currentTarget.style.borderColor = '#93c5fd';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fafafa';
                e.currentTarget.style.borderColor = '#f3f4f6';
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '0.5rem'
              }}>
                <h4 style={{ 
                  margin: 0, 
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span>{getCategoryIcon(article.category)}</span>
                  {article.title}
                </h4>
                
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: getImportanceColor(article.importance),
                  backgroundColor: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  marginLeft: '1rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {article.importance}
                </span>
              </div>

              <p style={{ 
                margin: '0 0 0.75rem 0',
                color: '#4b5563',
                lineHeight: '1.5'
              }}>
                {article.summary}
              </p>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.8rem',
                color: '#6b7280'
              }}>
                <span style={{
                  backgroundColor: '#f3f4f6',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  textTransform: 'capitalize'
                }}>
                  {article.category}
                </span>
                
                <time>{formatTimestamp(article.timestamp)}</time>
              </div>
            </article>
          ))}
        </div>
      )}

      <div style={{ 
        marginTop: '1.5rem',
        padding: '0.75rem',
        backgroundColor: '#f0f9ff',
        borderRadius: '0.375rem',
        textAlign: 'center'
      }}>
        <p style={{ 
          margin: 0, 
          fontSize: '0.9rem', 
          color: '#1e40af',
          fontWeight: '500'
        }}>
          💡 Stay informed about renewable energy developments while playing!
        </p>
      </div>
    </div>
  );
} 