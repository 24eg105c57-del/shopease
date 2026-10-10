import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Button from './Button';

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, isAdmin, isCustomer, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Verifying session...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole === 'ADMIN' && !isAdmin) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            padding: '3rem',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-md)',
            maxWidth: '540px',
            width: '100%',
            textAlign: 'center',
            border: '1px solid #fee2e2',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}
          >
            <ShieldAlert size={36} />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', color: '#991b1b' }}>
            Access Denied
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: 1.6 }}>
            You need <strong>ADMIN</strong> permissions to access this management console.
            Backend endpoints also reject unauthorized requests with HTTP 403.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/products">
              <Button variant="primary">Browse Products</Button>
            </Link>
            <Link to="/account">
              <Button variant="outline">My Account</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (requiredRole === 'CUSTOMER' && !isCustomer && !isAdmin) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>Customer Access Required</h2>
        <p>Please log in with a customer account to access this page.</p>
      </div>
    );
  }

  return children;
}
