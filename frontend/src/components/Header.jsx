import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, RefreshCw, LogOut, User, ShieldCheck, Package } from 'lucide-react';
import { productService } from '../api/productService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

/**
 * Reusable Header component featuring responsive brand navigation,
 * role-based nav links (CUSTOMER vs ADMIN), cart badge, and live backend health indicator.
 */
export default function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const [healthStatus, setHealthStatus] = useState({
    state: 'checking', // 'up' | 'down' | 'checking'
    text: 'Connecting to API...',
  });

  const checkHealth = async () => {
    setHealthStatus({ state: 'checking', text: 'Checking backend...' });
    try {
      const data = await productService.getHealth();
      if (data && (data.data?.status === 'UP' || data.success)) {
        setHealthStatus({
          state: 'up',
          text: `Backend: ${data.data?.status || 'UP'}`,
        });
      } else {
        setHealthStatus({ state: 'down', text: 'Backend Degraded' });
      }
    } catch {
      setHealthStatus({ state: 'down', text: 'Backend Offline' });
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container header-container">
        {/* Brand Logo */}
        <Link to="/" className="header-brand">
          <div className="header-logo-icon">
            <ShoppingBag size={22} strokeWidth={2.5} />
          </div>
          <span>ShopEase</span>
        </Link>

        {/* Navigation Links based on role */}
        <nav className="header-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Products
          </NavLink>

          {/* Orders link for logged in users */}
          {isAuthenticated && (
            <NavLink
              to="/orders"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              My Orders
            </NavLink>
          )}

          {/* Administrative links only visible to users with ADMIN role */}
          {isAdmin && (
            <>
              <NavLink
                to="/admin"
                end
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Admin (Products)
              </NavLink>
              <NavLink
                to="/admin/categories"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Admin (Categories)
              </NavLink>
            </>
          )}
        </nav>

        {/* Header Right Actions & Auth Status */}
        <div className="header-actions">
          <NavLink
            to="/cart"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', position: 'relative' }}
          >
            <ShoppingCart size={18} />
            <span>Cart</span>
            {totalItems > 0 && (
              <span
                style={{
                  backgroundColor: 'var(--primary-600)',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '999px',
                  marginLeft: '2px',
                }}
              >
                {totalItems}
              </span>
            )}
          </NavLink>

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <NavLink
                to="/account"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '20px',
                  backgroundColor: isAdmin ? '#fef3c7' : '#f1f5f9',
                  color: isAdmin ? '#92400e' : '#1e293b',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                }}
              >
                {isAdmin ? <ShieldCheck size={16} /> : <User size={16} />}
                <span>{user?.name || 'Account'}</span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    padding: '0.1rem 0.35rem',
                    borderRadius: '4px',
                    backgroundColor: isAdmin ? '#f59e0b' : '#3b82f6',
                    color: '#fff',
                    marginLeft: '2px',
                  }}
                >
                  {isAdmin ? 'ADMIN' : 'CUSTOMER'}
                </span>
              </NavLink>

              <button
                onClick={handleLogout}
                title="Sign Out"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.4rem',
                  borderRadius: '6px',
                  transition: 'color 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = '#dc2626')}
                onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Register
              </NavLink>
            </>
          )}

          {/* Backend Health Badge */}
          <div
            className="health-badge"
            title="Spring Boot Backend API Status (click to recheck)"
            onClick={checkHealth}
            style={{ cursor: 'pointer', marginLeft: '0.25rem' }}
          >
            <span className={`health-dot ${healthStatus.state}`}></span>
            <span>{healthStatus.text}</span>
            <RefreshCw
              size={12}
              style={{
                marginLeft: '2px',
                opacity: 0.6,
                animation: healthStatus.state === 'checking' ? 'spin 1s linear infinite' : 'none',
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
