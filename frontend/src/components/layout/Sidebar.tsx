import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { to: '/investigations', label: 'Investigations', icon: 'folder_shared' },
    { to: '/network-analysis', label: 'Network Analysis', icon: 'hub' },
    { to: '/search', label: 'Intelligence Search', icon: 'search_insights' },
    { to: '/alerts', label: 'Alerts', icon: 'notifications_active' },
    { to: '/data-sources', label: 'Data Sources', icon: 'database' },
    { to: '/document-intelligence', label: 'Document Intelligence', icon: 'description' },
    { to: '/timeline', label: 'Timeline', icon: 'schedule' },
    { to: '/reports', label: 'Reports', icon: 'summarize' },
    { to: '/audit', label: 'Audit Trail', icon: 'history' },
    { to: '/command-overview', label: 'Command Overview', icon: 'military_tech' },
    { to: '/women-safety', label: 'Women Safety', icon: 'shield_person' },
  ];

  return (
    <nav className="w-sidebar-width h-screen fixed left-0 top-0 bg-primary dark:bg-primary flex flex-col py-panel-padding z-50 shadow-[4px_0_24px_rgba(16,35,47,0.15)] select-none">
      {/* Brand Header */}
      <div className="px-gutter mb-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded bg-white flex items-center justify-center shrink-0 shadow-sm">
          {/* Minimalist Geometric N Monogram */}
          <svg viewBox="0 0 100 100" className="w-6 h-6 fill-none">
            <rect width="100" height="100" rx="16" fill="#10232F" />
            <path d="M25 75V25L75 75V25" stroke="#FD974E" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <h1 className="font-page-title text-[20px] font-bold text-on-primary tracking-tight leading-none">NIRVIK</h1>
          <p className="font-metadata text-[10px] text-on-primary/70 leading-tight mt-1">Criminal Network Intelligence</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-2 flex flex-col gap-1 custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-r transition-all duration-150 font-medium text-[13px] ${
                isActive
                  ? 'border-l-4 border-secondary-container bg-white/10 text-on-primary font-bold shadow-sm'
                  : 'border-l-4 border-transparent text-on-primary/70 hover:bg-white/5 hover:text-on-primary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined text-[19px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Officer Footer Profile */}
      <div className="mt-auto px-3 pt-3 border-t border-white/10">
        <NavLink
          to="/entities/entity-ramesh-kumar"
          className="flex items-center gap-3 p-2 rounded hover:bg-white/5 transition-colors text-on-primary/80 group"
          title="Officer Profile"
        >
          <div className="w-8 h-8 rounded-full bg-surface-container-highest/20 border border-white/20 flex items-center justify-center text-on-primary overflow-hidden">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-[20px]">account_circle</span>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-body-sm text-[12px] font-bold text-on-primary truncate">{user?.name || 'Rajiv Kumar'}</span>
            <span className="font-metadata text-[10px] text-on-primary/60 truncate">{user?.badgeId || 'RAJ-4482'} · Analyst</span>
          </div>
        </NavLink>
      </div>
    </nav>
  );
};
