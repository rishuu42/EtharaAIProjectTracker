"use client";

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="glass-card" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginBottom: '2rem',
      padding: '1rem 2.5rem',
      borderRadius: '0',
      background: 'white',
      border: 'none',
      borderBottom: '1px solid #edf2f7',
      boxShadow: 'none',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      marginLeft: '-2rem',
      marginRight: '-2rem',
      marginTop: '-2rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <img src="/logo.png" alt="EtharaAI Logo" style={{ height: '40px', objectFit: 'contain' }} />
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--text-main)' }}>{user?.name || 'User'}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase' }}>{user?.role}</div>
        </div>
        <button 
          onClick={onLogout}
          className="btn-outline"
          style={{ padding: '0.5rem 1.5rem', fontSize: '0.8rem', borderRadius: '4px' }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
