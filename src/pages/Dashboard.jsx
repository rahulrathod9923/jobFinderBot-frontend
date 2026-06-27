import React, { useState, useEffect } from 'react';
import { 
  Briefcase, CheckSquare, Sparkles, Network, RefreshCw, BarChart2,
  TrendingUp, Award, PieChart as PieIcon, Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';
import api from '../services/api';

const COLORS = ['#6366F1', '#14B8A6', '#EC4899', '#F59E0B', '#10B981', '#EF4444'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (e) {
      console.error('Failed to load stats', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <RefreshCw size={24} className="animate-spin" style={{ color: 'var(--primary)' }} />
      </div>
    );
  }

  if (!stats) return <p>Failed to load dashboard metrics.</p>;

  // Convert Weekly Jobs Map into Recharts array format
  const weeklyData = Object.entries(stats.weeklyJobs).map(([day, count]) => ({
    name: day.substring(0, 3),
    opportunities: count
  }));

  // Convert Platforms into Recharts format
  const platformData = stats.topSources.map(source => ({
    name: source.platform,
    value: source.count
  }));

  const cardItems = [
    { label: 'Jobs Found Today', value: stats.jobsFoundToday, icon: Briefcase, color: 'var(--primary)' },
    { label: 'Pending Approval', value: stats.pendingApproval, icon: CheckSquare, color: 'var(--warning)' },
    { label: 'Published (Outbox)', value: stats.published, icon: Sparkles, color: 'var(--secondary)' },
    { label: 'Success Rate', value: `${stats.successRate.toFixed(1)}%`, icon: Award, color: 'var(--success)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Outreach Dashboard</h1>
        <p style={{ color: 'var(--text-muted)' }}>AI-assisted freelancer opportunity monitoring & approval queue</p>
      </div>

      {/* KPI Cards */}
      <div className="dashboard-grid">
        {cardItems.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>{card.label}</p>
                <h2 style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.5rem' }}>{card.value}</h2>
              </div>
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: `${card.color}15`, color: card.color }}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        {/* Weekly Jobs Area Chart */}
        <div className="glass-card" style={{ padding: '1.5rem', height: '360px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Weekly Opportunities Found</h3>
          </div>
          <div style={{ flexGrow: 1, width: '100%', height: '80%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)' }} />
                <Area type="monotone" dataKey="opportunities" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorJobs)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platforms Distribution Pie Chart */}
        <div className="glass-card" style={{ padding: '1.5rem', minHeight: '360px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <PieIcon size={18} style={{ color: 'var(--secondary)' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Platform Distribution</h3>
          </div>
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ flex: '1 1 180px', height: '200px' }}>
              {platformData.length === 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>No data available</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div style={{ flex: '1 1 120px', display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', maxHeight: '200px', minWidth: '120px' }}>
              {platformData.map((entry, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: COLORS[index % COLORS.length] }} />
                  <span style={{ fontWeight: '500' }}>{entry.name}:</span>
                  <span style={{ color: 'var(--text-muted)' }}>{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RefreshCw size={16} /> Latest Crawler Operations
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Last run:</span>
              <span style={{ fontWeight: '600' }}>
                {stats.latestCrawl.lastCrawlTime ? new Date(stats.latestCrawl.lastCrawlTime).toLocaleString() : 'Never'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Status:</span>
              <span className={`badge ${stats.latestCrawl.status === 'SUCCESS' ? 'badge-approved' : 'badge-rejected'}`}>
                {stats.latestCrawl.status}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Pages Crawled:</span>
              <span style={{ fontWeight: '600' }}>{stats.latestCrawl.pagesCrawled} pages</span>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} /> AI Engine Health (Groq)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Model:</span>
              <span style={{ fontWeight: '600' }}>llama-3.1-70b-versatile</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Total Evaluations:</span>
              <span style={{ fontWeight: '600' }}>{stats.groqUsageCount} requests</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Average AI Score:</span>
              <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{stats.averageAiScore.toFixed(1)} / 100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
