import React, { useState, useEffect } from 'react';
import { 
  Check, X, Edit3, Eye, Calendar, Sparkles, RefreshCw, AlertCircle, Save 
} from 'lucide-react';
import api from '../services/api';

export default function ApprovalQueue() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  
  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  
  // Previewing state
  const [previewId, setPreviewId] = useState(null);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const response = await api.get('/approval', {
        params: { status: statusFilter, page: 0, size: 50 }
      });
      setQueue(response.data.content);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [statusFilter]);

  const handleApprove = async (id, finalContent) => {
    try {
      await api.post(`/approval/${id}/approve`, { content: finalContent });
      setEditingId(null);
      fetchQueue();
    } catch (e) {
      console.error(e);
      alert('Failed to publish outreach. Browser automation failed or API error occurred.');
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Reject this outreach draft?')) {
      try {
        await api.post(`/approval/${id}/reject`);
        fetchQueue();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const startEditing = (item) => {
    setEditingId(item.id);
    setEditContent(item.content);
  };

  const saveEdit = (id) => {
    // Save draft locally in state list before finalizing approval
    setQueue(prev => prev.map(item => item.id === id ? { ...item, content: editContent } : item));
    setEditingId(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Outreach Approval Queue</h1>
          <p style={{ color: 'var(--text-muted)' }}>Review, edit, and approve outreach comments and DMs before they are published</p>
        </div>

        {/* Filter */}
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-input"
          style={{ width: '160px', padding: '0.5rem' }}
        >
          <option value="PENDING">Pending Approval</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh' }}>
          <RefreshCw size={24} className="animate-spin" style={{ color: 'var(--primary)' }} />
        </div>
      ) : queue.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <AlertCircle size={32} style={{ marginBottom: '1rem' }} />
          <p>No outreach requests found in this queue state.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {queue.map((item) => {
            const isEditing = editingId === item.id;
            const isPreviewing = previewId === item.id;
            
            return (
              <div key={item.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="badge badge-published" style={{ background: item.type === 'COMMENT' ? 'rgba(99,102,241,0.1)' : 'rgba(20,184,166,0.1)', color: item.type === 'COMMENT' ? 'var(--primary)' : 'var(--secondary)' }}>
                      {item.type}
                    </span>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>{item.job.title}</h3>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={12} /> {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>

                {/* Content Box */}
                <div style={{ background: 'rgba(0,0,0,0.15)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  {isEditing ? (
                    <textarea 
                      className="form-input" 
                      style={{ minHeight: '120px', resize: 'vertical', width: '100%' }}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                  ) : (
                    <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: '1.5' }}>
                      {item.content}
                    </p>
                  )}
                </div>

                {/* Preview Metadata Panel */}
                {isPreviewing && (
                  <div style={{ background: 'rgba(99, 102, 241, 0.03)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <p><strong>Job Details:</strong> {item.job.summary || item.job.description}</p>
                    <p><strong>Platform:</strong> {item.job.platform.displayName}</p>
                    <p><strong>Link:</strong> <a href={item.job.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>{item.job.url}</a></p>
                    <p><strong>AI Suitability Score:</strong> {item.job.overallScore}%</p>
                  </div>
                )}

                {/* Actions Toolbar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => setPreviewId(isPreviewing ? null : item.id)}
                    >
                      <Eye size={16} />
                      {isPreviewing ? 'Hide Details' : 'Preview Job'}
                    </button>
                    
                    {statusFilter === 'PENDING' && (
                      isEditing ? (
                        <button className="btn btn-secondary" onClick={() => saveEdit(item.id)}>
                          <Save size={16} /> Save Changes
                        </button>
                      ) : (
                        <button className="btn btn-secondary" onClick={() => startEditing(item)}>
                          <Edit3 size={16} /> Edit Message
                        </button>
                      )
                    )}
                  </div>

                  {statusFilter === 'PENDING' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="btn btn-secondary" 
                        style={{ border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--error)' }}
                        onClick={() => handleReject(item.id)}
                      >
                        <X size={16} /> Reject
                      </button>
                      
                      <button 
                        className="btn btn-primary" 
                        onClick={() => handleApprove(item.id, isEditing ? editContent : item.content)}
                      >
                        <Check size={16} /> Approve & Publish
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
