import React, { useState, useEffect } from 'react';
import { Send, RefreshCw, AlertCircle, ExternalLink } from 'lucide-react';
import api from '../services/api';

export default function Dms() {
  const [dms, setDms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDms = async () => {
    try {
      const response = await api.get('/approval', {
        params: { status: 'APPROVED', page: 0, size: 50 }
      });
      // Filter DM items
      const dmItems = response.data.content.filter(item => item.type === 'DM');
      setDms(dmItems);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDms();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Outbound Direct Messages</h1>
        <p style={{ color: 'var(--text-muted)' }}>Log of approved direct messages sent to clients/leads</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh' }}>
          <RefreshCw size={24} className="animate-spin" style={{ color: 'var(--primary)' }} />
        </div>
      ) : dms.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <AlertCircle size={32} style={{ marginBottom: '1rem' }} />
          <p>No direct messages have been dispatched yet. Run approvals to send your first DM outreach.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {dms.map((item) => (
            <div key={item.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--secondary)' }}>
                  {item.job.platform.displayName}
                </span>
                <a href={item.job.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}>
                  Lead Profile <ExternalLink size={12} />
                </a>
              </div>
              <p style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{item.content}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>Job Reference: {item.job.title}</span>
                <span>Sent: {new Date(item.processedAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
