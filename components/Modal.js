"use client";

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(27, 54, 93, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
      backdropFilter: 'blur(4px)'
    }} onClick={onClose}>
      <div style={{
        width: '100%',
        maxWidth: '500px',
        position: 'relative',
        background: 'white',
        padding: '2.5rem',
        borderRadius: '8px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: '1px solid #edf2f7'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.025em' }}>{title}</h2>
          <button onClick={onClose} style={{ 
            background: 'transparent', 
            border: 'none', 
            color: 'var(--text-muted)', 
            fontSize: '1.5rem',
            lineHeight: 1,
            cursor: 'pointer'
          }}>&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}
