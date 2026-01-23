import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../shared/auth/AuthContext';
import { Button } from '../../shared/ui/Button';

export const AppLayout = () => {
  const { token, isAdmin, clearToken } = useAuth();

  const navItems = token
    ? [
        // Home видна только обычным пользователям
        ...(!isAdmin ? [{ to: '/', label: 'Home' }] : []),
        { to: '/create', label: 'New complaint' },
        // Track и Feedback только для админов, Feedback скрыт
        ...(isAdmin
          ? [{ to: '/track', label: 'Track complaint' }]
          : []),
      ]
    : [{ to: '/auth', label: 'Sign in' }];

  return (
    <div className="app">
      <div className="shell">
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-mark">CH</div>
            <div>
              <p className="brand-title">Complaint Hub</p>
              <p className="brand-subtitle">Customer Care Portal</p>
            </div>
          </div>
          <nav className="nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-link${isActive ? ' nav-link-active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="token-panel">
            <p className="panel-label">Session</p>
            <div className="panel-row">
              <span>Status</span>
              <span className={token ? 'pill pill-good' : 'pill pill-warn'}>
                {token ? 'Signed in' : 'Signed out'}
              </span>
            </div>
            {token ? (
              <Button variant="ghost" onClick={clearToken}>
                Sign out
              </Button>
            ) : (
              <p className="panel-note">Sign in to access your complaint tools.</p>
            )}
          </div>
        </aside>
        <main className="content">
          <header className="topbar">
            <div>
              <p className="eyebrow">Complaint Hub</p>
              <h1>Tell us what happened</h1>
            </div>
            <div className="topbar-chip">Customer care</div>
          </header>
          <div className="page">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
