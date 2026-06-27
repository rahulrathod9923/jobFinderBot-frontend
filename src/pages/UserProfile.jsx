import React from 'react';
import { User, Shield, Mail, Calendar, Key } from 'lucide-react';

export default function UserProfile() {
  const username = localStorage.getItem('username') || 'Developer';
  const roles = JSON.parse(localStorage.getItem('roles') || '["ROLE_ADMIN"]');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.5px' }}>User Profile</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage user account credentials and view access roles</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>
        {/* User Card */}
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--primary-glow)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
            border: '2px solid var(--primary)'
          }}>
            {username.substring(0, 1).toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{username}</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>System Administrator</span>
          </div>
        </div>

        {/* User details */}
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Account Details</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Mail size={18} style={{ color: 'var(--primary)' }} />
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email Address</p>
                <p style={{ fontSize: '0.95rem', fontWeight: '500' }}>admin@techstudio.cc</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Shield size={18} style={{ color: 'var(--secondary)' }} />
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Security Roles</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  {roles.map((role, i) => (
                    <span key={i} className="badge badge-approved" style={{ fontSize: '0.7rem' }}>{role}</span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Key size={18} style={{ color: 'var(--accent)' }} />
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>API Permissions</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  WRITE_JOBS, READ_JOBS, APPROVE_OUTREACH, MANAGE_SETTINGS
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
