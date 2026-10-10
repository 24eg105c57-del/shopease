import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Heart } from 'lucide-react';

/**
 * Reusable Footer component providing brand info, navigation links, and platform badges.
 */
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div>
            <div className="footer-brand">
              <div className="header-logo-icon" style={{ width: '36px', height: '36px' }}>
                <ShoppingBag size={20} strokeWidth={2.5} />
              </div>
              <span>ShopEase</span>
            </div>
            <p className="footer-desc">
              Your trusted destination for premium electronics, gear, and lifestyle products.
              Engineered with modern React and Java Spring Boot.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-title">Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/">Home Storefront</Link></li>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/products?category=Electronics">Electronics</Link></li>
              <li><Link to="/products?category=Accessories">Accessories</Link></li>
            </ul>
          </div>

          {/* Architecture & Tech */}
          <div>
            <h4 className="footer-title">Tech Stack</h4>
            <ul className="footer-links">
              <li><span style={{ color: '#60a5fa' }}>• Frontend:</span> React + Vite</li>
              <li><span style={{ color: '#60a5fa' }}>• Backend:</span> Spring Boot 3</li>
              <li><span style={{ color: '#60a5fa' }}>• Runtime:</span> Java 21 LTS</li>
              <li><span style={{ color: '#60a5fa' }}>• Database:</span> MySQL 8.x</li>
            </ul>
          </div>

          {/* Guarantees */}
          <div>
            <h4 className="footer-title">Quality Promise</h4>
            <p className="footer-desc" style={{ marginBottom: '1rem' }}>
              Every order includes our 30-day money-back guarantee, free standard shipping, and 24/7 customer assistance.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontSize: '0.85rem' }}>
              <ShieldCheck size={18} />
              <span>Verified Secure Platform</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} ShopEase Platform. Built for Week 1 Foundation.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Crafted with</span>
            <Heart size={14} color="#ef4444" fill="#ef4444" />
            <span>using React & Spring Boot</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
