import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, ArrowLeft, Truck, Phone, User, MapPin, DollarSign, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../api/orderService';
import Button from '../components/Button';

export default function Checkout() {
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    phoneNumber: '',
    deliveryAddress: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.phoneNumber.trim() || !formData.deliveryAddress.trim()) {
      setError('Please fill in all delivery details.');
      return;
    }

    if (!cart.items || cart.items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const checkoutPayload = {
        customerName: formData.customerName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        deliveryAddress: formData.deliveryAddress.trim(),
        idempotencyKey: 'IDEMP-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8),
        items: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      const res = await orderService.createOrder(checkoutPayload);
      const createdOrder = res.data;

      // Clear the local / context cart
      await clearCart();

      // Navigate to confirmation page
      navigate(`/order-confirmation/${createdOrder.id}`, { state: { order: createdOrder } });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to place order. Please check item availability.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <h2>No Items to Checkout</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Your shopping cart is currently empty.</p>
        <Link to="/products">
          <Button variant="primary">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '1000px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
          <ArrowLeft size={16} /> Back to Cart
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>Checkout & Delivery</h1>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            padding: '1rem',
            borderRadius: '10px',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <AlertCircle size={22} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2.5rem', alignItems: 'start' }}>
        {/* Checkout Form */}
        <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Shipping Address Section */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              padding: '2rem',
              borderRadius: '16px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={22} color="var(--primary-600)" />
              1. Delivery Information
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.4rem' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-secondary)' }} />
                  <input
                    type="text"
                    name="customerName"
                    required
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="Recipient's Name"
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.95rem',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.4rem' }}>
                  Contact Phone Number
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-secondary)' }} />
                  <input
                    type="tel"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.95rem',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.4rem' }}>
                  Complete Street Address
                </label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-secondary)' }} />
                  <textarea
                    name="deliveryAddress"
                    required
                    rows={3}
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    placeholder="House/Apt Number, Street, City, State, Postal Code"
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.95rem',
                      resize: 'vertical',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Section (Cash on Delivery Only) */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              padding: '2rem',
              borderRadius: '16px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <DollarSign size={22} color="var(--primary-600)" />
              2. Payment Method
            </h2>

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                padding: '1.25rem',
                borderRadius: '12px',
                border: '2px solid var(--primary-600)',
                backgroundColor: '#f0f9ff',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: '6px solid var(--primary-600)',
                  backgroundColor: '#fff',
                  marginTop: '2px',
                }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: '700', fontSize: '1.05rem', color: '#0369a1' }}>Cash on Delivery (COD)</span>
                  <span style={{ backgroundColor: '#e0f2fe', color: '#0284c7', fontSize: '0.75rem', fontWeight: '700', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    ZERO FEE
                  </span>
                </div>
                <p style={{ margin: '0.35rem 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  Pay cash directly to the courier when your order arrives. No online payment or card needed.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1.1rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            {submitting ? 'Placing Order...' : `Confirm & Place Order ($${subtotal.toFixed(2)})`}
          </Button>
        </form>

        {/* Order Summary Sidebar */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            padding: '1.75rem',
            borderRadius: '16px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-md)',
            position: 'sticky',
            top: '90px',
          }}
        >
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.25rem' }}>Your Items</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '300px', overflowY: 'auto', marginBottom: '1.25rem', paddingRight: '0.25rem' }}>
            {cart.items.map((item) => (
              <div key={item.id || item.productId} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <img
                  src={item.productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&auto=format&fit=crop&q=80'}
                  alt={item.productName}
                  style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.productName}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Qty: {item.quantity} × ${Number(item.productPrice).toFixed(2)}
                  </div>
                </div>
                <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>
                  ${Number(item.subtotal || item.productPrice * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              <span>Standard Shipping</span>
              <span style={{ color: '#16a34a', fontWeight: '600' }}>FREE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--border-light)' }}>
              <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Total Amount</span>
              <span style={{ fontWeight: '800', fontSize: '1.35rem', color: 'var(--primary-700)' }}>
                ${subtotal.toFixed(2)}
              </span>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', justifyContent: 'center' }}>
            <ShieldCheck size={16} color="#16a34a" />
            <span>Encrypted & Verified Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
