import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Calendar, ArrowRight, Truck, CheckCircle2, ShoppingBag } from 'lucide-react';
import { orderService } from '../api/orderService';
import Button from '../components/Button';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    orderService
      .getCustomerOrders()
      .then((res) => {
        setOrders(res.data || []);
      })
      .catch(() => {
        setError('Failed to load order history.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>My Orders</h1>
        <Link to="/products">
          <Button variant="outline" size="sm" icon={<ShoppingBag size={16} />}>
            Browse Store
          </Button>
        </Link>
      </div>

      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            padding: '4rem 2rem',
            borderRadius: '16px',
            border: '1px solid var(--border-light)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: '#e0f2fe',
              color: 'var(--primary-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <Package size={36} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>No Orders Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: 1.6 }}>
            You haven't placed any orders yet. Start exploring our catalog to make your first purchase!
          </p>
          <Link to="/products">
            <Button variant="primary">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '16px',
                border: '1px solid var(--border-light)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {/* Order Header */}
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  padding: '1.25rem 1.5rem',
                  borderBottom: '1px solid var(--border-light)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '500' }}>ORDER PLACED</div>
                  <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '500' }}>TOTAL AMOUNT</div>
                  <div style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--primary-700)' }}>
                    ${Number(order.totalAmount).toFixed(2)}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '500' }}>ORDER NUMBER</div>
                  <div style={{ fontWeight: '600', fontSize: '0.95rem', fontFamily: 'monospace' }}>
                    {order.orderNumber}
                  </div>
                </div>

                <div>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '999px',
                      backgroundColor: '#dcfce7',
                      color: '#166534',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                    }}
                  >
                    <CheckCircle2 size={14} />
                    {order.status || 'CONFIRMED'}
                  </span>
                </div>
              </div>

              {/* Order Body */}
              <div style={{ padding: '1.5rem' }}>
                <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Delivery to: <strong>{order.customerName}</strong> ({order.phoneNumber}) — {order.deliveryAddress}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {order.items?.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img
                          src={item.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=80'}
                          alt={item.productName}
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }}
                        />
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{item.productName}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            Qty: {item.quantity} × ${Number(item.unitPrice).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div style={{ fontWeight: '700', fontSize: '1rem' }}>
                        ${Number(item.subtotal).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Payment: <strong>Cash on Delivery (COD)</strong>
                  </div>
                  <Link to={`/order-confirmation/${order.id}`}>
                    <Button variant="outline" size="sm" icon={<ArrowRight size={14} />}>
                      View Receipt
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
