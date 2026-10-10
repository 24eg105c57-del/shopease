import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, Headphones, Sparkles, CheckCircle2 } from 'lucide-react';
import Button from '../components/Button';
import ProductGrid from '../components/ProductGrid';
import { productService } from '../api/productService';

/**
 * Home page showcasing hero banner, core value propositions, and featured products.
 */
export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const loadFeatured = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts();
      // Spring Data returns { content: [...] }, or a raw array if unpaged
      const productList = Array.isArray(data) ? data : (data?.content || []);
      // Feature the top 4 items for the storefront preview
      setFeaturedProducts(productList.slice(0, 4));
    } catch (err) {
      setError(
        'Unable to load featured products from the backend. Ensure Spring Boot is running on port 8080.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeatured();
  }, []);

  const handleAddToCart = (product) => {
    setToastMessage(`Added "${product.name}" to your cart!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div>
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
            animation: 'fadeIn 0.3s ease',
          }}
        >
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={16} color="#2563eb" />
              <span>Spring Boot + React Architecture</span>
            </div>

            <h1 className="hero-title">
              Shop Smarter with <span className="hero-title-accent">ShopEase</span>
            </h1>

            <p className="hero-subtitle">
              Discover top-tier electronics, modern lifestyle accessories, and daily essentials with instant ordering and rapid delivery.
            </p>

            <div className="hero-cta-group">
              <Link to="/products">
                <Button size="lg" icon={<ArrowRight size={18} />}>
                  Explore Full Catalog
                </Button>
              </Link>
              <Link to="/products?category=Electronics">
                <Button variant="secondary" size="lg">
                  Browse Electronics
                </Button>
              </Link>
            </div>
          </div>

          {/* Value Propositions */}
          <div className="hero-features">
            <div className="feature-card">
              <div className="feature-icon-wrap">
                <Truck size={22} />
              </div>
              <div>
                <h4 className="feature-title">Fast Delivery</h4>
                <p className="feature-desc">Free 2-day delivery on all orders over $35</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrap">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 className="feature-title">Buyer Protection</h4>
                <p className="feature-desc">30-day effortless returns with money-back guarantee</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrap">
                <Headphones size={22} />
              </div>
              <div>
                <h4 className="feature-title">Dedicated Support</h4>
                <p className="feature-desc">Our team is always online to help you succeed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container" style={{ marginTop: '3rem' }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Featured Highlights</h2>
            <p className="section-subtitle">Hand-picked bestsellers ready to ship today</p>
          </div>
          <Link to="/products">
            <Button variant="outline" size="sm" icon={<ArrowRight size={14} />}>
              View All Products
            </Button>
          </Link>
        </div>

        <ProductGrid
          products={featuredProducts}
          loading={loading}
          error={error}
          onRetry={loadFeatured}
          onAddToCart={handleAddToCart}
          emptyMessage="No featured products currently available."
        />
      </section>
    </div>
  );
}
