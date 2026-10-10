import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ArrowLeft, AlertCircle, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

export default function Cart() {
  const { cart, loading, cartError, updateQuantity, removeFromCart, clearCart, subtotal, totalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Loading your cart...</p>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center', maxWidth: '600px' }}>
        <div
          style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            backgroundColor: '#e0f2fe',
            color: 'var(--primary-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <ShoppingCart size={42} />
        </div>
        <h2 style={{ fontSize: '1.85rem', fontWeight: '700', marginBottom: '0.75rem' }}>Your Cart is Empty</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Looks like you haven't added anything to your cart yet. Explore our quality catalog and find great deals!
        </p>
        <Link to="/products">
          <Button variant="primary" size="lg" icon={<ArrowRight size={18} />}>
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '1100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>
          Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
        </h1>
        <button
          onClick={clearCart}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '0.9rem',
            textDecoration: 'underline',
          }}
        >
          Clear Cart
        </button>
      </div>

      {cartError && (
        <div
          style={{
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            padding: '0.85rem 1.25rem',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontSize: '0.95rem',
          }}
        >
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <span>{cartError}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
        {/* Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cart.items.map((item) => (
            <div
              key={item.id || item.productId}
              style={{
                display: 'flex',
                gap: '1.25rem',
                backgroundColor: 'var(--bg-surface)',
                padding: '1.25rem',
                borderRadius: '12px',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)',
                alignItems: 'center',
              }}
            >
              <img
                src={item.productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80'}
                alt={item.productName}
                style={{
                  width: '90px',
                  height: '90px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  backgroundColor: '#f1f5f9',
                }}
              />

              <div style={{ flex: 1 }}>
                {item.categoryName && (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: 'var(--primary-600)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {item.categoryName}
                  </span>
                )}
                <h3 style={{ fontSize: '1.05rem', fontWeight: '600', margin: '0.2rem 0 0.4rem' }}>
                  <Link to={`/products/${item.productId}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {item.productName}
                  </Link>
                </h3>
                <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                  ${Number(item.productPrice).toFixed(2)} each
                </div>
                {item.stockQuantity !== undefined && item.stockQuantity <= 5 && (
                  <div style={{ fontSize: '0.75rem', color: '#b45309', marginTop: '0.2rem' }}>
                    Only {item.stockQuantity} remaining in stock
                  </div>
                )}
              </div>

              {/* Quantity Controls */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid var(--border-light)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: '#fff',
                }}
              >
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.productId, item.quantity - 1)}
                  style={{
                    padding: '0.5rem 0.65rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title="Decrease"
                >
                  <Minus size={14} />
                </button>
                <span style={{ padding: '0.5rem 0.75rem', fontWeight: '600', fontSize: '0.95rem', minWidth: '32px', textAlign: 'center' }}>
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.productId, item.quantity + 1)}
                  disabled={item.stockQuantity !== undefined && item.quantity >= item.stockQuantity}
                  style={{
                    padding: '0.5rem 0.65rem',
                    background: 'none',
                    border: 'none',
                    cursor: item.stockQuantity !== undefined && item.quantity >= item.stockQuantity ? 'not-allowed' : 'pointer',
                    opacity: item.stockQuantity !== undefined && item.quantity >= item.stockQuantity ? 0.4 : 1,
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title="Increase"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Item Subtotal */}
              <div style={{ width: '90px', textAlign: 'right', fontWeight: '700', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                ${Number(item.subtotal || item.productPrice * item.quantity).toFixed(2)}
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeFromCart(item.id, item.productId)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '0.4rem',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Remove item"
                onMouseOver={(e) => (e.currentTarget.style.color = '#dc2626')}
                onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          <div style={{ marginTop: '0.5rem' }}>
            <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-600)', textDecoration: 'none', fontWeight: '600' }}>
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            padding: '1.75rem',
            borderRadius: '16px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1.25rem' }}>Order Summary</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Items Subtotal</span>
              <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Estimated Delivery</span>
              <span style={{ color: '#16a34a', fontWeight: '600' }}>FREE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Payment Method</span>
              <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>Cash on Delivery</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1.15rem', fontWeight: '700' }}>Grand Total</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-700)' }}>
              ${subtotal.toFixed(2)}
            </span>
          </div>

          <Button
            variant="primary"
            size="lg"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            onClick={() => {
              if (!isAuthenticated) {
                navigate('/login', { state: { from: { pathname: '/checkout' } } });
              } else {
                navigate('/checkout');
              }
            }}
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={18} />
          </Button>

          <div
            style={{
              marginTop: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              justifyContent: 'center',
            }}
          >
            <ShieldCheck size={16} color="#16a34a" />
            <span>Guaranteed Safe & Verified Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
