import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, ShieldCheck, ShoppingBag, ShoppingCart, LogOut, Package } from 'lucide-react';
import Button from '../components/Button';

export default function Account() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '800px' }}>
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          padding: '2.5rem',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-light)',
        }}
      >
        {/* User Info Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            paddingBottom: '2rem',
            borderBottom: '1px solid var(--border-light)',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: isAdmin ? 'var(--primary-100)' : '#e0f2fe',
              color: isAdmin ? 'var(--primary-700)' : '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isAdmin ? <ShieldCheck size={40} /> : <User size={40} />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: '700', margin: 0 }}>{user?.name}</h1>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '999px',
                  backgroundColor: isAdmin ? '#fef3c7' : '#dbeafe',
                  color: isAdmin ? '#92400e' : '#1e40af',
                  textTransform: 'uppercase',
                }}
              >
                {isAdmin ? 'ADMINISTRATOR' : 'CUSTOMER'}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{user?.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <LogOut size={16} /> Sign Out
          </Button>
        </div>

        {/* Account Details & Role Capabilities */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div
            style={{
              padding: '1.25rem',
              borderRadius: '12px',
              backgroundColor: '#f8fafc',
              border: '1px solid var(--border-light)',
            }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Assigned Roles
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 0 }}>
              {user?.roles?.join(', ') || 'ROLE_CUSTOMER'}
            </p>
          </div>

          <div
            style={{
              padding: '1.25rem',
              borderRadius: '12px',
              backgroundColor: '#f8fafc',
              border: '1px solid var(--border-light)',
            }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Account Status
            </h3>
            <p style={{ color: '#16a34a', fontSize: '0.9rem', fontWeight: '500', marginBottom: 0 }}>
              Active & Verified
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <Link to="/products">
              <Button variant="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingBag size={18} /> Browse Store
              </Button>
            </Link>
            <Link to="/orders">
              <Button variant="secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Package size={18} /> My Orders
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingCart size={18} /> View Cart
              </Button>
            </Link>
            {isAdmin && (
              <>
                <Link to="/admin">
                  <Button variant="secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={18} /> Admin Products
                  </Button>
                </Link>
                <Link to="/admin/categories">
                  <Button variant="secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={18} /> Admin Categories
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
