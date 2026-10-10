import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  ShoppingCart,
  Check,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import Button from '../components/Button';
import { productService } from '../api/productService';
import { useCart } from '../context/CartContext';

/**
 * ProductDetails page providing extensive specifications, quantity selection, and instant purchasing flow.
 */
export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productService.getProductById(id);
        if (data) {
          setProduct(data);
        } else {
          setError('Product not found in catalog.');
        }
      } catch (err) {
        setError('Failed to retrieve product details from backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, Math.min(prev + delta, product?.stockQuantity || 10)));
  };

  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    const result = await addToCart(product, quantity);
    if (result.success) {
      setAdded(true);
      setToastMessage(`Added ${quantity} × "${product?.name}" to your cart!`);
      setTimeout(() => {
        setAdded(false);
        setToastMessage(null);
      }, 3000);
    } else {
      setToastMessage(result.message || 'Could not add to cart');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="container details-wrapper">
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <div
            style={{
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '3px solid var(--primary-100)',
              borderTopColor: 'var(--primary-600)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container details-wrapper">
        <div className="empty-state" style={{ maxWidth: '600px', margin: '2rem auto' }}>
          <h3 className="empty-state-title">Item Unavailable</h3>
          <p className="empty-state-text">{error || 'This product does not exist.'}</p>
          <Link to="/products">
            <Button variant="primary" icon={<ArrowLeft size={16} />}>
              Back to Catalog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formattedPrice = Number(product.price).toFixed(2);

  return (
    <div className="container details-wrapper">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '10px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 1000,
            fontSize: '0.9rem',
          }}
        >
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumbs */}
      <nav className="breadcrumbs">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/products">Products</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category}`}>{product.category}</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{product.name}</span>
      </nav>

      {/* Product Details Layout */}
      <div className="details-layout">
        {/* Left: Product Image */}
        <div className="details-gallery">
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
            alt={product.name}
            className="details-image"
          />
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="details-info">
          <span className="details-badge">{product.category}</span>
          <h1 className="details-title">{product.name}</h1>

          {/* Rating & Stock */}
          <div className="details-meta">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span className="rating-stars">
                <Star size={16} fill="#f59e0b" strokeWidth={0} />
              </span>
              <strong style={{ color: 'var(--text-main)' }}>{product.rating}</strong>
              <span>({product.reviewCount} customer reviews)</span>
            </div>
            <span>•</span>
            <div className="in-stock-tag">
              <Check size={16} />
              <span>In Stock ({product.stockQuantity} available)</span>
            </div>
          </div>

          {/* Price */}
          <div className="details-price">${formattedPrice}</div>

          {/* Description */}
          <p className="details-desc">{product.description}</p>

          {/* Action Row: Quantity & Add to Cart */}
          <div className="details-actions">
            {/* Quantity Selector */}
            <div className="quantity-picker">
              <button
                type="button"
                className="qty-btn"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <div className="qty-val">{quantity}</div>
              <button
                type="button"
                className="qty-btn"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.stockQuantity}
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <Button
              size="lg"
              variant={added ? 'secondary' : 'primary'}
              onClick={handleAddToCart}
              icon={added ? <Check size={18} color="#10b981" /> : <ShoppingCart size={18} />}
            >
              {added ? 'Added to Cart' : 'Add to Cart'}
            </Button>
          </div>

          {/* Quality Assurance Perks */}
          <div className="details-perks">
            <div className="details-perk-item">
              <Truck size={18} />
              <span>Fast 2-day delivery available on this product</span>
            </div>
            <div className="details-perk-item">
              <RotateCcw size={18} />
              <span>Free 30-day returns with no questions asked</span>
            </div>
            <div className="details-perk-item">
              <ShieldCheck size={18} />
              <span>1-year manufacturer warranty guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
