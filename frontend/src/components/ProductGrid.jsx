import React from 'react';
import ProductCard from './ProductCard';
import { PackageSearch, AlertCircle } from 'lucide-react';
import Button from './Button';

/**
 * Reusable ProductGrid component managing grid layout, skeleton loading, and empty states.
 * 
 * @param {Object} props
 * @param {Array} props.products - List of product items to render
 * @param {boolean} [props.loading=false] - Whether products are actively fetching
 * @param {string|null} [props.error=null] - Error message if API request failed
 * @param {Function} [props.onAddToCart] - Callback when an item is added to cart
 * @param {Function} [props.onRetry] - Callback to retry failed request
 * @param {string} [props.emptyMessage] - Custom message for empty state
 */
export default function ProductGrid({
  products = [],
  loading = false,
  error = null,
  onAddToCart,
  onRetry,
  emptyMessage = 'No products found matching your criteria.',
}) {
  // Skeleton Loading State
  if (loading) {
    return (
      <div className="product-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div key={n} className="product-skeleton">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-line short"></div>
              <div className="skeleton-line long"></div>
              <div className="skeleton-line medium"></div>
              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                <div className="skeleton-line short" style={{ width: '30%' }}></div>
                <div className="skeleton-line short" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="empty-state" style={{ borderColor: 'var(--danger)' }}>
        <div className="empty-state-icon" style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger)' }}>
          <AlertCircle size={32} />
        </div>
        <h3 className="empty-state-title" style={{ color: 'var(--danger)' }}>Connection Error</h3>
        <p className="empty-state-text">{error}</p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            Try Again
          </Button>
        )}
      </div>
    );
  }

  // Empty State
  if (!products || products.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <PackageSearch size={32} />
        </div>
        <h3 className="empty-state-title">No Products Found</h3>
        <p className="empty-state-text">{emptyMessage}</p>
        {onRetry && (
          <Button variant="secondary" onClick={onRetry}>
            Refresh Catalog
          </Button>
        )}
      </div>
    );
  }

  // Render Grid
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
