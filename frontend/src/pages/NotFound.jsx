import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';
import Button from '../components/Button';

/**
 * NotFound 404 page for unmatched routes.
 */
export default function NotFound() {
  return (
    <div className="container">
      <div className="notfound-wrapper">
        <div className="notfound-code">404</div>
        <h1 className="notfound-title">Page Not Found</h1>
        <p className="notfound-desc">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/">
            <Button size="md" icon={<Home size={18} />}>
              Return Home
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="secondary" size="md" icon={<Compass size={18} />}>
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
