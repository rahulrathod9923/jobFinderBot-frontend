import React, { useState, useEffect } from 'react';
import { MessageSquare, RefreshCw, AlertCircle, Link2, ExternalLink } from 'lucide-react';
import api from '../services/api';

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      // In our design we can fetch approval queue items of type COMMENT,
      // or implement a direct comments API. Since comments are stored in the Comments table,
      // we can query the backend settings or approval queue list.
      const response = await api.get('/approval', {
        params: { status: 'APPROVED', page: 0, size: 50 }
      });
      // Filter COMMENT items
      const commentItems = response.data.content.filter(item => item.type === 'COMMENT');
      setComments(commentItems);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Outbound Comments</h1>
        <p style={{ color: 'var(--text-muted)' }}>Log of approved comments submitted to external platforms</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh' }}>
          <RefreshCw size={24} className="animate-spin" style={{ color: 'var(--primary)' }} />
        </div>
      ) : comments.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <AlertCircle size={32} style={{ marginBottom: '1rem' }} />
          <p>No comments have been posted yet. Run the approval queue to post your first comment.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {comments.map((item) => (
            <div key={item.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--primary)' }}>
                  {item.job.platform.displayName}
                </span>
                <a href={item.job.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}>
                  Open Post <ExternalLink size={12} />
                </a>
              </div>
              <p style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{item.content}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>Job: {item.job.title}</span>
                <span>Published: {new Date(item.processedAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
