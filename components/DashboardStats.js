"use client";

export default function DashboardStats({ tasks = [], projects = [] }) {
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const safeProjects = Array.isArray(projects) ? projects : [];

  const completedTasks = safeTasks.filter(t => t?.status === 'done').length;
  const inProgressTasks = safeTasks.filter(t => t?.status === 'in-progress').length;
  const overdueTasks = safeTasks.filter(t => t?.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length;

  const stats = [
    { label: 'Total Projects', value: safeProjects.length, color: 'var(--primary)' },
    { label: 'Tasks Completed', value: completedTasks, color: 'var(--success)' },
    { label: 'In Progress', value: inProgressTasks, color: 'var(--warning)' },
    { label: 'Overdue', value: overdueTasks, color: 'var(--danger)' },
  ];

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '1.5rem',
      marginBottom: '2rem'
    }}>
      {stats.map((stat, i) => (
        <div key={i} className="glass-card" style={{ 
          textAlign: 'center', 
          background: 'white',
          border: '1px solid #edf2f7',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
        }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>{stat.label}</div>
          <div style={{ fontSize: '2.25rem', fontWeight: '800', color: stat.color }}>{stat.value}</div>
        </div>
      ))}
    </div>
  );
}
