import React, { useState, useEffect } from 'react';
import { 
  Play, RefreshCw, Layers, BookOpen, AlertCircle, Calendar, 
  Settings, ChevronRight, FileText, Search 
} from 'lucide-react';
import api from '../services/api';

export default function KnowledgeBase() {
  const [activeTab, setActiveTab] = useState('status');
  const [logs, setLogs] = useState([]);
  const [contents, setContents] = useState([]);
  const [chunks, setChunks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [message, setMessage] = useState('');

  const [searchQuery, setSearchQuery] = useState('');

  const fetchKnowledgeData = async () => {
    setLoading(true);
    try {
      const [logsRes, contentRes, chunksRes] = await Promise.all([
        api.get('/crawler/logs'),
        api.get('/crawler/content'),
        api.get('/crawler/chunks')
      ]);
      setLogs(logsRes.data);
      setContents(contentRes.data);
      setChunks(chunksRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledgeData();
  }, []);

  const handleTriggerCrawl = async () => {
    setTriggering(true);
    setMessage('');
    try {
      const response = await api.post('/crawler/trigger');
      setMessage(response.data.message);
      // Wait a moment and refresh logs
      setTimeout(fetchKnowledgeData, 2000);
    } catch (e) {
      console.error(e);
      setMessage('Failed to start crawler task.');
    } finally {
      setTriggering(false);
    }
  };

  const filteredChunks = chunks.filter(c => 
    c.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.summary && c.summary.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Knowledge Base</h1>
          <p style={{ color: 'var(--text-muted)' }}>Crawl portfolio websites, split content, and search RAG embeddings context</p>
        </div>
        <button 
          onClick={handleTriggerCrawl} 
          className="btn btn-primary" 
          disabled={triggering}
        >
          {triggering ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
          Trigger Website Crawl
        </button>
      </div>

      {message && (
        <div style={{
          background: 'var(--primary-glow)',
          border: '1px solid var(--primary)',
          color: 'var(--text-main)',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.9rem'
        }}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.25rem' }}>
        <button 
          className={`btn ${activeTab === 'status' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('status')}
          style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)' }}
        >
          Crawler & Logs
        </button>
        <button 
          className={`btn ${activeTab === 'documents' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('documents')}
          style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)' }}
        >
          Indexed Documents ({contents.length})
        </button>
        <button 
          className={`btn ${activeTab === 'chunks' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('chunks')}
          style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)' }}
        >
          RAG Chunks ({chunks.length})
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '30vh' }}>
          <RefreshCw size={24} className="animate-spin" style={{ color: 'var(--primary)' }} />
        </div>
      ) : (
        <div style={{ minHeight: '400px' }}>
          {/* Tab 1: Crawler & Logs */}
          {activeTab === 'status' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Active Crawl Seed</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.15)', padding: '0.8rem 1.2rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <span style={{ fontWeight: '500', color: 'var(--primary)' }}>https://techstudio.cc</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Crawl frequency: Once daily (2 AM)</span>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Crawl Log History</h3>
                {logs.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No crawler logs recorded yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {logs.map((log) => (
                      <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.05)', fontSize: '0.85rem' }}>
                        <div>
                          <p style={{ fontWeight: '600' }}>Crawl Seed: {log.url}</p>
                          <span style={{ color: 'var(--text-muted)' }}>Time: {new Date(log.startTime).toLocaleString()}</span>
                        </div>
                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <span className={`badge ${log.status === 'SUCCESS' ? 'badge-approved' : log.status === 'RUNNING' ? 'badge-pending' : 'badge-rejected'}`}>
                            {log.status}
                          </span>
                          {log.errorMessage && <span style={{ color: 'var(--error)', fontSize: '0.75rem' }}>{log.errorMessage}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Indexed Documents */}
          {activeTab === 'documents' && (
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Crawled Pages</h3>
              {contents.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No pages have been crawled. Run website crawl to get started.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {contents.map((doc) => (
                    <div key={doc.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '1rem', background: 'rgba(255,255,255,0.01)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <h4 style={{ fontWeight: '600', fontSize: '0.95rem' }}>{doc.title}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Crawled: {new Date(doc.crawledAt).toLocaleDateString()}</span>
                      </div>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none', display: 'block', marginBottom: '0.75rem' }}>
                        {doc.url}
                      </a>
                      <div style={{ background: 'rgba(0,0,0,0.1)', padding: '0.75rem', borderRadius: '4px', maxHeight: '120px', overflowY: 'auto', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {doc.cleanText}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: RAG Chunks */}
          {activeTab === 'chunks' && (
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ position: 'relative', flexGrow: 1 }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    placeholder="Search in chunks..." 
                    className="form-input" 
                    style={{ paddingLeft: '2.5rem' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {filteredChunks.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>No chunks match search criteria.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                  {filteredChunks.map((chunk) => (
                    <div key={chunk.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '1rem', background: 'rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.25rem', color: 'var(--text-muted)' }}>
                        <span>Chunk #{chunk.chunkIndex}</span>
                        <span>Doc ID: {chunk.websiteContent.id}</span>
                      </div>
                      <p style={{ fontStyle: 'italic', color: 'var(--primary)' }}>Summary: {chunk.summary}</p>
                      <p style={{ color: 'var(--text-main)', opacity: '0.95', lineHeight: '1.4', maxHeight: '160px', overflowY: 'auto' }}>
                        {chunk.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
