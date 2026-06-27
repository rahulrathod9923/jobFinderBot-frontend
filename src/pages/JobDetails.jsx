import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Link2, Sparkles, AlertCircle, Target, DollarSign,
  Shield, Brain, CheckSquare, Trash2, Layers, Search
} from 'lucide-react';
import api from '../services/api';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);
      try {
        const [jobRes, similarRes] = await Promise.all([
          api.get(`/jobs/${id}`),
          api.get(`/jobs/${id}/similar`)
        ]);
        setJob(jobRes.data);
        setSimilar(similarRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await api.delete(`/jobs/${id}`);
        navigate('/jobs');
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <LoaderSpinner />
      </div>
    );
  }

  if (!job) return <p>Opportunity details not found.</p>;

  const keywordList = job.keywords ? job.keywords.split(',').map(k => k.trim()) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      {/* Back Button / Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn btn-secondary" onClick={() => navigate('/jobs')}>
          <ArrowLeft size={16} /> Back to opportunities
        </button>
        <button className="btn btn-danger" onClick={handleDelete}>
          <Trash2 size={16} /> Delete
        </button>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Left Side: Main details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Header Card */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <span className={`badge ${job.status === 'PENDING' ? 'badge-pending' : job.status === 'APPROVED' ? 'badge-approved' : 'badge-rejected'}`}>
                {job.status}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Found: {new Date(job.dateFound).toLocaleString()}
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', lineHeight: '1.3' }}>{job.title}</h1>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '600' }}>{job.platform.displayName}</span>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Category: {job.category || 'General'}</span>
            </div>
            <a 
              href={job.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary" 
              style={{ marginTop: '1.5rem', textDecoration: 'none' }}
            >
              <Link2 size={16} /> View original post
            </a>
          </div>

          {/* Description Card */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
              Description
            </h3>
            <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem', color: 'var(--text-main)', opacity: '0.9' }}>
              {job.description}
            </p>
          </div>

          {/* AI Outreach / Summary Card */}
          <div className="glass-card" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(20, 184, 166, 0.03))' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Brain size={18} style={{ color: 'var(--primary)' }} /> AI Assessment Summary
            </h3>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>{job.summary}</p>
            
            {keywordList.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Keywords Extracted</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {keywordList.map((kw, i) => (
                    <span key={i} style={{ background: 'var(--border)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Score breakdown and RAG contexts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Score Meters Card */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} style={{ color: 'var(--warning)' }} /> Score Assessment
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <ScoreProgress label="Overall Fit Score" score={job.overallScore} color="var(--primary)" />
              <ScoreProgress label="Budget Confidence" score={job.budgetConfidence} color="var(--secondary)" />
              <ScoreProgress label="Client Reputation" score={job.clientConfidence} color="var(--success)" />
              <ScoreProgress label="Reply Probability" score={job.replyProbability} color="var(--warning)" />
              <ScoreProgress label="Difficulty Level" score={job.difficulty} color="var(--accent)" />
              <ScoreProgress label="Urgency Score" score={job.urgencyScore} color="var(--error)" />

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Estimated Value:</span>
                  <span style={{ fontWeight: '700' }}>${job.estimatedValue ? job.estimatedValue.toLocaleString() : 'Negotiable'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Client Intent:</span>
                  <span style={{ fontWeight: '600' }}>{job.clientIntent || 'Unknown'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Priority:</span>
                  <span style={{ fontWeight: '600', color: job.priority === 'HIGH' ? 'var(--error)' : 'var(--text-main)' }}>{job.priority}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Job Matches */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Search size={16} /> Similar Opportunities
            </h3>
            {similar.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No close matches found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {similar.map(sim => (
                  <Link 
                    key={sim.id} 
                    to={`/jobs/${sim.id}`}
                    style={{ 
                      display: 'block',
                      textDecoration: 'none', 
                      color: 'inherit',
                      padding: '0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(0,0,0,0.1)',
                      border: '1px solid var(--border)',
                      fontSize: '0.85rem',
                      transition: 'var(--transition)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    <p style={{ fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sim.title}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      <span>{sim.platform.displayName}</span>
                      <span>Score: {sim.overallScore}%</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreProgress({ label, score = 0, color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
        <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>{label}</span>
        <span style={{ fontWeight: '600' }}>{score}%</span>
      </div>
      <div style={{ width: '100%', height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: '3px', transition: 'width 0.5s ease-in-out' }} />
      </div>
    </div>
  );
}

function LoaderSpinner() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <RefreshCw size={24} className="animate-spin" style={{ color: 'var(--primary)' }} />
      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Analyzing Jaccard RAG matrices...</span>
    </div>
  );
}
