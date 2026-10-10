import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Check } from 'lucide-react';
import Button from './Button';
import { useCart } from '../context/CartContext';

/**
 * Reusable ProductCard component displaying item thumbnail, metadata, price, and actions.
 */
export default function ProductCard({ product, onAddToCart }) {
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  if (!product) return null;

  const {
    id,
    name,
    description,
    price = 0,
    categoryName,
    category = 'General',
    imageUrl,
    rating = 4.5,
    reviewCount = 0,
    stockQuantity,
  } = product;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (onAddToCart) {
      onAddToCart(product);
    } else {
      await addToCart(product, 1);
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const formattedPrice = Number(price).toFixed(2);
  const [dollars, cents] = formattedPrice.split('.');

  return (
    <div className="product-card">
      <Link to={`/products/${id}`} className="product-card-image-wrap">
        <img
          src={imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
          alt={name}
          className="product-card-image"
          loading="lazy"
        />
        <span className="product-card-badge">{categoryName || category}</span>
      </Link>

      <div className="product-card-content">
        <div className="product-card-rating">
          <span className="rating-stars">
            <Star size={14} fill="#f59e0b" strokeWidth={0} />
          </span>
          <span>{rating}</span>
          <span>({reviewCount})</span>
        </div>

        <Link to={`/products/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 className="product-card-title" title={name}>{name}</h3>
        </Link>

        <p className="product-card-desc">{description}</p>

        {stockQuantity !== undefined && stockQuantity <= 5 && stockQuantity > 0 && (
          <div style={{ fontSize: '0.75rem', color: '#d97706', marginBottom: '0.5rem', fontWeight: '500' }}>
            Only {stockQuantity} left in stock!
          </div>
        )}

        <div className="product-card-footer">
          <div className="product-card-price">
            ${dollars}<span className="product-card-price-cents">.{cents}</span>
          </div>

          <Button
            size="sm"
            variant={added ? 'secondary' : 'primary'}
            onClick={handleAddToCart}
            disabled={stockQuantity === 0}
            icon={added ? <Check size={14} color="#10b981" /> : <ShoppingCart size={14} />}
          >
            {stockQuantity === 0 ? 'Out of Stock' : added ? 'Added' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
}
