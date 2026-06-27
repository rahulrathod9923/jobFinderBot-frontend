import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      textAlign: 'center'
    }}>
      <AlertCircle size={48} style={{ color: 'var(--error)' }} />
      <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>404 - Page Not Found</h1>
      <p style={{ color: 'var(--text-muted)' }}>The page you are looking for does not exist or has been relocated.</p>
      <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '1rem', textDecoration: 'none' }}>
        <ArrowLeft size={16} /> Return to Dashboard
      </Link>
    </div>
  );
}
