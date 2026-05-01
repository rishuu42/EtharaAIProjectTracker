"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("ethara-token")) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const path = isLogin ? "/api/auth/login" : "/api/auth/signup";
    
    try {
      const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      
      if (!res.ok) {
        setMessage(data.details ? `${data.error}: ${data.details}` : (data.error || "Authentication failed"));
      } else {
        localStorage.setItem("ethara-token", data.token);
        router.push("/dashboard");
      }
    } catch (err) {
      setMessage("Connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'white',
      padding: '2rem'
    }}>
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <img src="/logo.png" alt="EtharaAI Logo" style={{ height: '80px', margin: '0 auto 1.5rem', display: 'block', objectFit: 'contain' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: '500' }}>Streamline your projects with intelligence.</p>
      </div>

      <div style={{ width: '100%', maxWidth: '400px', border: '1px solid #edf2f7', padding: '2.5rem', borderRadius: '8px' }}>
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem', borderBottom: '1px solid #edf2f7' }}>
          <button 
            style={{ 
              flex: 1, 
              border: 'none', 
              background: 'transparent', 
              color: isLogin ? 'var(--primary)' : 'var(--text-muted)', 
              paddingBottom: '1rem', 
              borderBottom: isLogin ? '2px solid var(--primary)' : 'none',
              fontWeight: '700',
              fontSize: '1rem'
            }}
            onClick={() => setIsLogin(true)}
          >
            LOGIN
          </button>
          <button 
            style={{ 
              flex: 1, 
              border: 'none', 
              background: 'transparent', 
              color: !isLogin ? 'var(--primary)' : 'var(--text-muted)', 
              paddingBottom: '1rem', 
              borderBottom: !isLogin ? '2px solid var(--primary)' : 'none',
              fontWeight: '700',
              fontSize: '1rem'
            }}
            onClick={() => setIsLogin(false)}
          >
            SIGN UP
          </button>
        </div>

        {message && (
          <div style={{ 
            padding: '1rem', 
            background: '#fff5f5', 
            color: '#c53030',
            borderRadius: '4px',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase' }}>Full Name</label>
              <input 
                placeholder="John Doe"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                required
                style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase' }}>Email Address</label>
            <input 
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              required
              style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase' }}>Password</label>
            <input 
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              required
              style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <button className="btn-primary" disabled={loading} style={{ marginTop: '0.5rem', padding: '1rem', borderRadius: '4px' }}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Admin: <strong>admin@ethara.ai</strong> / <strong>admin123</strong>
        </div>
      </div>
    </div>
  );
}
