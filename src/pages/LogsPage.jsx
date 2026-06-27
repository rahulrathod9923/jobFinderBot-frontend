import React, { useState, useEffect } from 'react';
import { Terminal, Clock, ShieldAlert, Cpu, RefreshCw, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function LogsPage() {
  const [activeTab, setActiveTab] = useState('scheduler');
  const [schedLogs, setSchedLogs] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const [schedRes, activityRes, auditRes] = await Promise.all([
        api.get('/logs/scheduler'),
        api.get('/logs/activity'),
        api.get('/logs/audit')
      ]);
      setSchedLogs(schedRes.data);
      setActivityLogs(activityRes.data);
      setAuditLogs(auditRes.data);
    } catch (e) {
      console.error('Failed to load logs', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.5px' }}>System Logs Console</h1>
          <p style={{ color: 'var(--text-muted)' }}>Audit trails, automated cron events, and crawler logs</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchLogs}>
          <RefreshCw size={16} /> Refresh logs
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.25rem' }}>
        <button 
          className={`btn ${activeTab === 'scheduler' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('scheduler')}
          style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)' }}
        >
          <Clock size={16} /> Scheduler runs
        </button>
        <button 
          className={`btn ${activeTab === 'activity' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('activity')}
          style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)' }}
        >
          <Cpu size={16} /> System activities
        </button>
        <button 
          className={`btn ${activeTab === 'audit' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('audit')}
          style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)' }}
        >
          <ShieldAlert size={16} /> Audit logs
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '30vh' }}>
          <RefreshCw size={24} className="animate-spin" style={{ color: 'var(--primary)' }} />
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '1.5rem', maxHeight: '550px', overflowY: 'auto' }}>
          {/* Tab 1: Scheduler Logs */}
          {activeTab === 'scheduler' && (
            schedLogs.length === 0 ? (
              <NoLogsMessage label="scheduler events" />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {schedLogs.map(l => (
                  <div key={l.id} style={{ border: '1px solid var(--border)', padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{l.jobName}</span>
                      <span className={`badge ${l.status === 'SUCCESS' ? 'badge-approved' : l.status === 'RUNNING' ? 'badge-pending' : 'badge-rejected'}`}>{l.status}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Start: {new Date(l.startTime).toLocaleString()} | End: {l.endTime ? new Date(l.endTime).toLocaleString() : 'Running'}</p>
                    {l.details && <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', fontFamily: 'monospace', background: '#05070B', padding: '0.5rem', borderRadius: '4px', whiteSpace: 'pre-wrap' }}>{l.details}</p>}
                    {l.errorMessage && <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: 'var(--error)' }}>Error: {l.errorMessage}</p>}
                  </div>
                ))}
              </div>
            )
          )}

          {/* Tab 2: System Activities */}
          {activeTab === 'activity' && (
            activityLogs.length === 0 ? (
              <NoLogsMessage label="background activities" />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {activityLogs.map(l => (
                  <div key={l.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                      <span>{new Date(l.timestamp).toLocaleString()}</span>
                      <span style={{ color: 'var(--secondary)', fontWeight: '600' }}>{l.action}</span>
                    </div>
                    <p>{l.details}</p>
                  </div>
                ))}
              </div>
            )
          )}

          {/* Tab 3: Security Auditing */}
          {activeTab === 'audit' && (
            auditLogs.length === 0 ? (
              <NoLogsMessage label="audit trails" />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {auditLogs.map(l => (
                  <div key={l.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                      <span>{new Date(l.timestamp).toLocaleString()}</span>
                      <span>IP: {l.ipAddress || 'unknown'}</span>
                    </div>
                    <p>
                      <strong>{l.username}</strong> executed action <strong style={{ color: 'var(--accent)' }}>{l.action}</strong>: {l.details}
                    </p>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

function NoLogsMessage({ label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '3rem 0', color: 'var(--text-muted)' }}>
      <AlertCircle size={24} />
      <p>No {label} recorded in the database database.</p>
    </div>
  );
}
