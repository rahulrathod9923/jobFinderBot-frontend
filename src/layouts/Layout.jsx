import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Briefcase, CheckSquare, BookOpen, 
  Terminal, Settings, LogOut, Bell, Sun, Moon, User, Menu, X 
} from 'lucide-react';
import api, { logOut } from '../services/api';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const username = localStorage.getItem('username') || 'Developer';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.read).length);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error('Logout request failed', e);
    } finally {
      logOut();
    }
  };

  const markNotificationRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Jobs opportunities', path: '/jobs', icon: Briefcase },
    { name: 'Approval Queue', path: '/approval', icon: CheckSquare },
    { name: 'Knowledge Base', path: '/knowledge', icon: BookOpen },
    { name: 'Logs & Activity', path: '/logs', icon: Terminal },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="main-layout">
      {/* Mobile Sidebar backdrop overlay */}
      {isSidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#FFF' }}>
              A
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', letterSpacing: '0.5px' }}>Antigravity</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Freelancer Assistant</span>
            </div>
          </div>
          {/* Close button inside sidebar on mobile */}
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="btn btn-secondary mobile-menu-btn" 
            style={{ padding: '0.25rem', borderRadius: '50%' }}
          >
            <X size={16} />
          </button>
        </div>

        <nav style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link 
                key={item.path} 
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.8rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                  background: isActive ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(20, 184, 166, 0.05))' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  fontWeight: isActive ? '600' : '400',
                  transition: 'var(--transition)'
                }}
              >
                <Icon size={18} style={{ color: isActive ? 'var(--primary)' : 'var(--text-muted)' }} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Card / Logout */}
        <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={18} />
            </div>
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>{username}</p>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Administrator</span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100vh', overflow: 'hidden', width: '100%' }}>
        {/* Top Navbar */}
        <header className="glass-nav" style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', gap: '1.5rem', flexShrink: 0, position: 'relative', zIndex: 100 }}>
          {/* Hamburger button visible only on mobile */}
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="btn btn-secondary mobile-menu-btn" 
            style={{ padding: '0.5rem', borderRadius: '50%' }}
          >
            <Menu size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginLeft: 'auto' }}>
            <button onClick={toggleTheme} className="btn btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%' }}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)} 
                className="btn btn-secondary" 
                style={{ padding: '0.5rem', borderRadius: '50%', position: 'relative' }}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: 'var(--error)', color: '#FFF', fontSize: '0.65rem', padding: '1px 5px', borderRadius: '10px', fontWeight: 'bold' }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Popover */}
              {showNotifications && (
                <div className="glass-card" style={{ position: 'absolute', top: '48px', right: '0', width: '320px', maxHeight: '400px', overflowY: 'auto', zIndex: 1000, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Notifications</h4>
                  {notifications.length === 0 ? (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>No new notifications</p>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: n.read ? 'transparent' : 'rgba(99, 102, 241, 0.05)', border: '1px solid var(--border)' }}>
                        <p style={{ fontSize: '0.85rem', fontWeight: '600' }}>{n.title}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.message}</p>
                        {!n.read && (
                          <button 
                            onClick={() => markNotificationRead(n.id)} 
                            style={{ alignSelf: 'flex-end', fontSize: '0.7rem', padding: '2px 6px', marginTop: '4px' }} 
                            className="btn btn-primary"
                          >
                            Dismiss
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Render Area */}
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
}
