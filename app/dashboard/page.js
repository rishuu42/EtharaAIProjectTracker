"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import DashboardStats from "../../components/DashboardStats";
import Modal from "../../components/Modal";

const defaultProject = { name: "", description: "", memberEmails: "" };
const defaultTask = { projectId: "", title: "", description: "", assigneeEmail: "", dueDate: "", status: "todo", priority: "medium" };

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");
  const [projectForm, setProjectForm] = useState(defaultProject);
  const [taskForm, setTaskForm] = useState(defaultTask);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProject, setFilterProject] = useState("all");

  // Modal States
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("ethara-token");
    if (!savedToken) {
      router.push("/");
    } else {
      setToken(savedToken);
    }
  }, [router]);

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const authFetch = async (url, options = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      "Authorization": `Bearer ${token}`
    };
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
      handleLogout();
      throw new Error("Unauthorized");
    }
    return res;
  };

  const loadData = async () => {
    try {
      const [userRes, projectsRes, tasksRes] = await Promise.all([
        authFetch("/api/auth/me"),
        authFetch("/api/projects"),
        authFetch("/api/tasks")
      ]);
      
      const userData = (await userRes.json()) || {};
      const projectsData = (await projectsRes.json()) || {};
      const tasksData = (await tasksRes.json()) || {};

      setUser(userData.user || null);
      setProjects(projectsData.projects || []);
      setTasks(tasksData.tasks || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ethara-token");
    router.push("/");
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsCreating(true);
    try {
      const res = await authFetch("/api/projects", {
        method: "POST",
        body: JSON.stringify(projectForm)
      });
      const data = await res.json();
      
      if (res.ok) {
        setProjectForm(defaultProject);
        setProjectModalOpen(false);
        loadData();
        setMessage("Project created successfully!");
      } else {
        setMessage("Error: " + (data.error || "Failed to create project"));
      }
    } catch (err) {
      setMessage("Connection error. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsCreating(true);
    try {
      const res = await authFetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify(taskForm)
      });
      const data = await res.json();

      if (res.ok) {
        setTaskForm(defaultTask);
        setTaskModalOpen(false);
        loadData();
        setMessage("Task added successfully!");
      } else {
        setMessage("Error: " + (data.error || "Failed to add task"));
      }
    } catch (err) {
      setMessage("Connection error. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      const res = await authFetch("/api/tasks", {
        method: "PUT",
        body: JSON.stringify({ id: taskId, status })
      });
      if (res.ok) loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject = filterProject === "all" || task.projectId === filterProject;
    return matchesSearch && matchesProject;
  });

  if (loading && !user) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <Navbar user={user} onLogout={handleLogout} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-outline" onClick={() => setProjectModalOpen(true)}>+ New Project</button>
          <button className="btn-primary" onClick={() => setTaskModalOpen(true)}>+ Add Task</button>
        </div>
      </div>

      <DashboardStats tasks={tasks} projects={projects} />

      {message && (
        <div style={{ 
          marginBottom: '1.5rem', 
          background: message.includes('Error') ? '#fff5f5' : '#f0fdf4', 
          border: '1px solid',
          borderColor: message.includes('Error') ? '#feb2b2' : '#dcfce7',
          color: message.includes('Error') ? '#c53030' : '#15803d',
          padding: '1rem 1.5rem',
          borderRadius: '4px',
          fontWeight: '600',
          fontSize: '0.9rem'
        }}>
          {message}
        </div>
      )}

      {/* MODALS */}
      <Modal isOpen={isProjectModalOpen} onClose={() => setProjectModalOpen(false)} title="New Project">
        <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase' }}>Project Name</label>
            <input 
              placeholder="e.g. Website Overhaul" 
              value={projectForm.name}
              onChange={e => setProjectForm({...projectForm, name: e.target.value})}
              required
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase' }}>Description</label>
            <textarea 
              placeholder="Brief details..." 
              value={projectForm.description}
              onChange={e => setProjectForm({...projectForm, description: e.target.value})}
              rows={3}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase' }}>Team Member Emails</label>
            <input 
              placeholder="comma separated" 
              value={projectForm.memberEmails}
              onChange={e => setProjectForm({...projectForm, memberEmails: e.target.value})}
            />
          </div>
          <button className="btn-primary" disabled={isCreating}>
            {isCreating ? "Creating..." : "Create Project"}
          </button>
        </form>
      </Modal>

      <Modal isOpen={isTaskModalOpen} onClose={() => setTaskModalOpen(false)} title="Add Task">
        <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase' }}>Select Project</label>
            <select 
              value={taskForm.projectId} 
              onChange={e => setTaskForm({...taskForm, projectId: e.target.value})}
              required
            >
              <option value="">Choose a project...</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase' }}>Task Title</label>
            <input 
              placeholder="What needs to be done?" 
              value={taskForm.title}
              onChange={e => setTaskForm({...taskForm, title: e.target.value})}
              required
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase' }}>Priority</label>
              <select 
                value={taskForm.priority} 
                onChange={e => setTaskForm({...taskForm, priority: e.target.value})}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase' }}>Due Date</label>
              <input 
                type="date" 
                value={taskForm.dueDate}
                onChange={e => setTaskForm({...taskForm, dueDate: e.target.value})}
              />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase' }}>Assignee Email</label>
            <input 
              type="email" 
              placeholder="team.member@ethara.ai" 
              value={taskForm.assigneeEmail}
              onChange={e => setTaskForm({...taskForm, assigneeEmail: e.target.value})}
            />
          </div>
          <button className="btn-primary" disabled={isCreating}>
            {isCreating ? "Adding..." : "Add Task"}
          </button>
        </form>
      </Modal>

      {/* SEARCH & FILTERS */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', alignItems: 'center', padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid #edf2f7' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input 
            placeholder="Search tasks by title..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔍</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Filter by Project:</label>
          <select 
            value={filterProject}
            onChange={e => setFilterProject(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="all">All Projects</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </div>

      {/* GRID CONTENT */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        
        <div style={{ background: 'white', border: '1px solid #edf2f7', borderRadius: '8px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '900', color: 'var(--text-main)', textTransform: 'uppercase' }}>Active Tasks</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Showing {filteredTasks.length} tasks</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredTasks.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '4rem', border: '1px dashed #e2e8f0', borderRadius: '8px' }}>
                No tasks match your search or filter.
              </div>
            ) : (
              filteredTasks.map(task => (
                <div key={task.id} style={{ border: '1px solid #edf2f7', borderRadius: '8px', padding: '1.5rem', background: '#f8fafc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)' }}>{task.title}</div>
                        <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase' }}>
                        {task.project_name} • {task.assignee_email || 'Unassigned'}
                      </div>
                      {task.dueDate && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                          📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <span className={`status-badge status-${task.status}`}>{task.status.replace('-', ' ')}</span>
                  </div>
                  
                  <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
                    {task.status !== 'done' && (
                      <button className="btn-outline" style={{ fontSize: '0.75rem', padding: '0.5rem 1rem', borderRadius: '4px' }} onClick={() => updateTaskStatus(task.id, 'done')}>Mark Done</button>
                    )}
                    {task.status !== 'in-progress' && (
                      <button className="btn-outline" style={{ fontSize: '0.75rem', padding: '0.5rem 1rem', borderRadius: '4px' }} onClick={() => updateTaskStatus(task.id, 'in-progress')}>In Progress</button>
                    )}
                    {task.status !== 'todo' && (
                      <button className="btn-outline" style={{ fontSize: '0.75rem', padding: '0.5rem 1rem', borderRadius: '4px' }} onClick={() => updateTaskStatus(task.id, 'todo')}>Todo</button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ background: 'white', border: '1px solid #edf2f7', borderRadius: '8px', padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1rem', fontWeight: '900', color: 'var(--text-main)', textTransform: 'uppercase' }}>Your Projects</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {projects.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No projects yet.</div>
            ) : (
              projects.map(project => (
                <div key={project.id} style={{ border: '1px solid #edf2f7', borderRadius: '8px', padding: '1.5rem', transition: 'all 0.2s' }}>
                  <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)' }}>{project.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: '1.4' }}>{project.description || 'No description'}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase' }}>
                      Owner: {project.owner_email}
                    </div>
                    <button className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem', borderRadius: '4px' }} onClick={() => setFilterProject(project.id)}>View Tasks</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
