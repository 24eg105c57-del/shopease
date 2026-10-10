import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, PackageCheck, ShoppingBag, ArrowRight, Truck, MapPin, Phone, User, Calendar } from 'lucide-react';
import { orderService } from '../api/orderService';
import Button from '../components/Button';

export default function OrderConfirmation() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!order && id) {
      setLoading(true);
      orderService
        .getOrderById(id)
        .then((res) => {
          setOrder(res.data);
        })
        .catch(() => {
          setError('Failed to load order confirmation details.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, order]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading order confirmation...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{error || 'Unable to retrieve order details.'}</p>
        <Link to="/products">
          <Button variant="primary">Return to Store</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem', maxWidth: '800px' }}>
      {/* Success Banner */}
      <div
        style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '16px',
          padding: '2.5rem',
          textAlign: 'center',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            width: '68px',
            height: '68px',
            backgroundColor: '#dcfce7',
            color: '#16a34a',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}
        >
          <CheckCircle2 size={44} />
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#166534', marginBottom: '0.5rem' }}>
          Thank You! Your Order is Confirmed
        </h1>
        <p style={{ color: '#15803d', fontSize: '1.05rem', margin: 0 }}>
          Order reference: <strong>{order.orderNumber}</strong>
        </p>
        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#166534' }}>
          We have received your order and will deliver it to you with <strong>Cash on Delivery</strong> payment.
        </div>
      </div>

      {/* Order Details Card */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '16px',
          border: '1px solid var(--border-light)',
          padding: '2rem',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid var(--border-light)',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '500', textTransform: 'uppercase' }}>
              Order Number
            </div>
            <div style={{ fontWeight: '700', fontSize: '1rem', marginTop: '0.2rem' }}>{order.orderNumber}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '500', textTransform: 'uppercase' }}>
              Payment Mode
            </div>
            <div style={{ fontWeight: '700', fontSize: '1rem', marginTop: '0.2rem', color: 'var(--primary-700)' }}>
              Cash on Delivery (COD)
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '500', textTransform: 'uppercase' }}>
              Order Status
            </div>
            <div style={{ fontWeight: '700', fontSize: '1rem', marginTop: '0.2rem', color: '#16a34a' }}>
              {order.status || 'CONFIRMED'}
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Truck size={18} color="var(--primary-600)" /> Delivery Information
          </h3>
          <div style={{ backgroundColor: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '10px', fontSize: '0.95rem' }}>
            <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{order.customerName}</div>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Phone: {order.phoneNumber}</div>
            <div style={{ color: 'var(--text-secondary)' }}>Address: {order.deliveryAddress}</div>
          </div>
        </div>

        {/* Itemized List */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <PackageCheck size={18} color="var(--primary-600)" /> Purchased Items
          </h3>
          <div style={{ border: '1px solid var(--border-light)', borderRadius: '10px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border-light)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Item</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Qty</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Price</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: '500' }}>{item.productName}</td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>${Number(item.unitPrice).toFixed(2)}</td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: '600' }}>
                      ${Number(item.subtotal).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ backgroundColor: '#f8fafc', fontWeight: '700' }}>
                  <td colSpan="3" style={{ padding: '1rem', textAlign: 'right', fontSize: '1.05rem' }}>
                    Total Payable at Delivery:
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', fontSize: '1.25rem', color: 'var(--primary-700)' }}>
                    ${Number(order.totalAmount).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <Link to="/orders">
          <Button variant="outline">View All Orders</Button>
        </Link>
        <Link to="/products">
          <Button variant="primary" icon={<ShoppingBag size={18} />}>
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
