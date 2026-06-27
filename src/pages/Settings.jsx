import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, Shield, Key, Eye, EyeOff, Clipboard, Check, 
  Trash2, Plus, RefreshCw, Save, MessageSquare, AlertCircle 
} from 'lucide-react';
import api from '../services/api';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('system');
  const [settings, setSettings] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [formData, setFormData] = useState({});
  const [savingKey, setSavingKey] = useState(null);
  
  // API key creation state
  const [newKeyName, setNewKeyName] = useState('');
  const [generatedKey, setGeneratedKey] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchSettingsAndKeys = async () => {
    setLoading(true);
    try {
      const [settingsRes, keysRes] = await Promise.all([
        api.get('/settings'),
        api.get('/apikeys')
      ]);
      setSettings(settingsRes.data);
      setApiKeys(keysRes.data);

      // Convert settings array into a key-value object
      const dataObj = {};
      settingsRes.data.forEach(s => {
        dataObj[s.key] = s.value;
      });
      setFormData(dataObj);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettingsAndKeys();
  }, []);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSetting = async (key) => {
    setSavingKey(key);
    try {
      await api.put(`/settings/${key}`, { value: formData[key] });
      alert(`Setting "${key}" successfully saved.`);
    } catch (e) {
      console.error(e);
      alert('Failed to update setting.');
    } finally {
      setSavingKey(null);
    }
  };

  const handleCreateApiKey = async (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    try {
      const response = await api.post('/apikeys', { name: newKeyName, days: '365' });
      setGeneratedKey(response.data.rawKey);
      setNewKeyName('');
      // Reload keys
      const keysRes = await api.get('/apikeys');
      setApiKeys(keysRes.data);
    } catch (e) {
      console.error(e);
      alert('Failed to generate API Key.');
    }
  };

  const handleRevokeApiKey = async (id) => {
    if (window.confirm('Revoke this API Key permanently?')) {
      try {
        await api.delete(`/apikeys/${id}`);
        // Reload keys
        const keysRes = await api.get('/apikeys');
        setApiKeys(keysRes.data);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
        <RefreshCw size={24} className="animate-spin" style={{ color: 'var(--primary)' }} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.5px' }}>System Settings</h1>
        <p style={{ color: 'var(--text-muted)' }}>Configure AI, social source credentials, crawlers, and developer integrations</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.25rem' }}>
        <button 
          className={`btn ${activeTab === 'system' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('system')}
          style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)' }}
        >
          <SettingsIcon size={16} /> Core Config
        </button>
        <button 
          className={`btn ${activeTab === 'credentials' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('credentials')}
          style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)' }}
        >
          <Shield size={16} /> Platform Accounts
        </button>
        <button 
          className={`btn ${activeTab === 'prompts' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('prompts')}
          style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)' }}
        >
          <MessageSquare size={16} /> Prompt Templates
        </button>
        <button 
          className={`btn ${activeTab === 'apikeys' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('apikeys')}
          style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)' }}
        >
          <Key size={16} /> Developer Keys
        </button>
      </div>

      <div style={{ minHeight: '400px' }}>
        {/* Tab 1: Core System Configuration */}
        {activeTab === 'system' && (
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Core Engine Values</h3>
            
            <SettingField 
              label="Groq API Key"
              configKey="groq_api_key"
              value={formData.groq_api_key}
              isSecret={true}
              description="Used to access Llama model chat completions."
              onChange={handleChange}
              onSave={handleSaveSetting}
              saving={savingKey === 'groq_api_key'}
            />

            <SettingField 
              label="Groq Model"
              configKey="groq_model"
              value={formData.groq_model}
              description="E.g., llama-3.1-70b-versatile, llama-3.1-8b-instant."
              onChange={handleChange}
              onSave={handleSaveSetting}
              saving={savingKey === 'groq_model'}
            />

            <SettingField 
              label="Seed Portfolio Website URL"
              configKey="website_url"
              value={formData.website_url}
              description="URL crawled once daily as knowledge source base."
              onChange={handleChange}
              onSave={handleSaveSetting}
              saving={savingKey === 'website_url'}
            />

            <SettingField 
              label="Data Retention Interval (Days)"
              configKey="retention_days"
              value={formData.retention_days}
              description="Automatic cleanup window for jobs, cache, and activity logs."
              onChange={handleChange}
              onSave={handleSaveSetting}
              saving={savingKey === 'retention_days'}
            />

            <SettingField 
              label="Playwright Automation Active"
              configKey="playwright_enabled"
              value={formData.playwright_enabled}
              description="Set to true to spin up Playwright browser instances upon manual approval."
              onChange={handleChange}
              onSave={handleSaveSetting}
              saving={savingKey === 'playwright_enabled'}
            />
          </div>
        )}

        {/* Tab 2: Sourcing Platform Credentials */}
        {activeTab === 'credentials' && (
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Account Credentials</h3>
            
            <SettingField 
              label="Reddit Account Username"
              configKey="reddit_username"
              value={formData.reddit_username}
              description="Used for logging in during Playwright automations."
              onChange={handleChange}
              onSave={handleSaveSetting}
              saving={savingKey === 'reddit_username'}
            />

            <SettingField 
              label="Reddit Account Password"
              configKey="reddit_password"
              value={formData.reddit_password}
              isSecret={true}
              description="Reddit login credential."
              onChange={handleChange}
              onSave={handleSaveSetting}
              saving={savingKey === 'reddit_password'}
            />

            <SettingField 
              label="LinkedIn Account Username"
              configKey="linkedin_username"
              value={formData.linkedin_username}
              description="LinkedIn login email."
              onChange={handleChange}
              onSave={handleSaveSetting}
              saving={savingKey === 'linkedin_username'}
            />

            <SettingField 
              label="LinkedIn Account Password"
              configKey="linkedin_password"
              value={formData.linkedin_password}
              isSecret={true}
              description="LinkedIn login credential."
              onChange={handleChange}
              onSave={handleSaveSetting}
              saving={savingKey === 'linkedin_password'}
            />
          </div>
        )}

        {/* Tab 3: Prompts templates */}
        {activeTab === 'prompts' && (
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>System Prompts</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>AI Job Analysis Prompt Template</label>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Defines output JSON keys: spam, category, budgetConfidence, priority, comment, dm.</span>
              <textarea 
                value={formData.prompt_template || ''} 
                onChange={(e) => handleChange('prompt_template', e.target.value)}
                className="form-input"
                style={{ minHeight: '260px', resize: 'vertical', width: '100%', fontFamily: 'monospace', fontSize: '0.85rem' }}
              />
              <button 
                onClick={() => handleSaveSetting('prompt_template')} 
                className="btn btn-primary"
                style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
                disabled={savingKey === 'prompt_template'}
              >
                {savingKey === 'prompt_template' ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                Save Prompt Template
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Developer Programmatic API Keys */}
        {activeTab === 'apikeys' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Hashed API Keys list */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Developer Integrations</h3>
              
              <form onSubmit={handleCreateApiKey} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <input 
                  type="text" 
                  placeholder="Key name (e.g. Zapier Connection)" 
                  className="form-input" 
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
                <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
                  <Plus size={16} /> Generate Key
                </button>
              </form>

              {generatedKey && (
                <div style={{ 
                  background: 'rgba(99, 102, 241, 0.05)', 
                  border: '1px dashed var(--primary)', 
                  padding: '1.25rem', 
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)', fontSize: '0.85rem' }}>
                    <AlertCircle size={16} />
                    <span><strong>IMPORTANT:</strong> Copy this API Key now. It will never be shown again!</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input 
                      type="text" 
                      readOnly 
                      value={generatedKey} 
                      className="form-input" 
                      style={{ fontFamily: 'monospace', fontSize: '0.85rem', flexGrow: 1 }} 
                    />
                    <button 
                      onClick={copyToClipboard} 
                      className="btn btn-secondary" 
                      style={{ padding: '0.75rem' }}
                    >
                      {copied ? <Check size={16} style={{ color: 'var(--success)' }} /> : <Clipboard size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {apiKeys.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No API keys created yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {apiKeys.map(k => (
                    <div key={k.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: k.active ? 'rgba(0,0,0,0.05)' : 'transparent', opacity: k.active ? 1 : 0.5 }}>
                      <div>
                        <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{k.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Prefix: <code>{k.prefix}</code> | Created: {new Date(k.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {k.active ? (
                        <button className="btn btn-secondary" style={{ color: 'var(--error)', borderColor: 'rgba(239,68,68,0.2)' }} onClick={() => handleRevokeApiKey(k.id)}>
                          <Trash2 size={16} /> Revoke
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Revoked</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SettingField({ label, configKey, value = '', isSecret = false, description, onChange, onSave, saving }) {
  const [showVal, setShowVal] = useState(!isSecret);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>{label}</label>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Key: <code>{configKey}</code></span>
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flexGrow: 1 }}>
          <input 
            type={showVal ? 'text' : 'password'} 
            value={value} 
            onChange={(e) => onChange(configKey, e.target.value)}
            className="form-input"
            placeholder={isSecret ? '••••••••••••••••' : `Enter ${label.toLowerCase()}`}
          />
          {isSecret && (
            <button 
              type="button"
              onClick={() => setShowVal(!showVal)}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', padding: 0 }}
            >
              {showVal ? <EyeOff size={16} style={{ color: 'var(--text-muted)' }} /> : <Eye size={16} style={{ color: 'var(--text-muted)' }} />}
            </button>
          )}
        </div>
        
        <button 
          type="button" 
          className="btn btn-primary"
          onClick={() => onSave(configKey)}
          disabled={saving}
          style={{ flexShrink: 0 }}
        >
          {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
          Save
        </button>
      </div>
      {description && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{description}</span>}
    </div>
  );
}
