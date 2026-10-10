import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import Button from '../components/Button';
import apiClient from '../api/axios';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // clear field error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email format is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError(null);
    setSuccessMsg(null);
    
    if (!validate()) return;
    
    setLoading(true);
    try {
      await apiClient.post('/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      setSuccessMsg('Registration successful! You can now log in.');
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      if (err.response?.data?.data && typeof err.response.data.data === 'object') {
        setErrors(err.response.data.data); // Field validation errors from backend
      } else {
        setGlobalError(err.response?.data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'var(--bg-surface)', padding: '3rem', borderRadius: '12px', boxShadow: 'var(--shadow-md)', width: '100%', maxWidth: '400px', border: '1px solid var(--border-light)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--primary-100)', color: 'var(--primary-600)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <UserPlus size={24} />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Create Account</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Join ShopEase today</p>
        </div>

        {globalError && (
          <div style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem' }}>
            <AlertCircle size={18} />
            {globalError}
          </div>
        )}

        {successMsg && (
          <div style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem' }}>
            <CheckCircle2 size={18} />
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Full Name</label>
            <input 
              type="text" 
              name="name"
              required 
              value={formData.name}
              onChange={handleInputChange}
              style={{ padding: '0.75rem', borderRadius: '8px', border: errors.name ? '1px solid var(--danger)' : '1px solid var(--border-light)', width: '100%' }} 
              placeholder="John Doe" 
            />
            {errors.name && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.name}</span>}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Email Address</label>
            <input 
              type="email" 
              name="email"
              required 
              value={formData.email}
              onChange={handleInputChange}
              style={{ padding: '0.75rem', borderRadius: '8px', border: errors.email ? '1px solid var(--danger)' : '1px solid var(--border-light)', width: '100%' }} 
              placeholder="you@example.com" 
            />
            {errors.email && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.email}</span>}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Password</label>
            <input 
              type="password" 
              name="password"
              required 
              value={formData.password}
              onChange={handleInputChange}
              style={{ padding: '0.75rem', borderRadius: '8px', border: errors.password ? '1px solid var(--danger)' : '1px solid var(--border-light)', width: '100%' }} 
              placeholder="••••••••" 
            />
            {errors.password && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.password}</span>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              required 
              value={formData.confirmPassword}
              onChange={handleInputChange}
              style={{ padding: '0.75rem', borderRadius: '8px', border: errors.confirmPassword ? '1px solid var(--danger)' : '1px solid var(--border-light)', width: '100%' }} 
              placeholder="••••••••" 
            />
            {errors.confirmPassword && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.confirmPassword}</span>}
          </div>

          <Button type="submit" variant="primary" size="lg" style={{ marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-600)', fontWeight: '600' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
