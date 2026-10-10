import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, CheckCircle2 } from 'lucide-react';
import ProductGrid from '../components/ProductGrid';
import { productService } from '../api/productService';
import { categoryService } from '../api/categoryService';
import { useCart } from '../context/CartContext';

/**
 * Products catalog page with real-time search, category filtering, and sorting.
 */
export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('categoryId') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('featured');
  const [toastMessage, setToastMessage] = useState(null);

  // Sync category state if URL param updates
  useEffect(() => {
    const catId = searchParams.get('categoryId') || '';
    setSelectedCategoryId(catId);
  }, [searchParams]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getProducts(selectedCategoryId ? { categoryId: selectedCategoryId } : {}),
        categoryService.getCategories()
      ]);
      setProducts(productsData.content || []);
      setCategories(categoriesData || []);
    } catch (err) {
      setError('Failed to connect to the backend API. Please make sure Spring Boot is up.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategoryId]);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
    if (!categoryId) {
      searchParams.delete('categoryId');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ categoryId });
    }
  };

  const { addToCart } = useCart();

  const handleAddToCart = async (product) => {
    await addToCart(product, 1);
    setToastMessage(`Added "${product.name}" to cart!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter products by local search query
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return a.id - b.id; // Default featured sort
    });

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
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

      {/* Catalog Header */}
      <div className="catalog-header">
        <h1 className="catalog-title">Explore Catalog</h1>
        <p className="catalog-subtitle">
          Browse through our collection of premium, carefully tested products.
        </p>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="filter-toolbar">
        <div className="filter-search-row">
          {/* Search Box */}
          <div className="search-input-wrap">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search products by title or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SlidersHorizontal size={16} color="var(--text-muted)" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-page)',
                fontFamily: 'inherit',
                fontSize: '0.875rem',
                color: 'var(--text-main)',
                cursor: 'pointer',
              }}
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="category-pills">
          <button
            className={`category-pill ${selectedCategoryId === '' ? 'active' : ''}`}
            onClick={() => handleCategorySelect('')}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-pill ${selectedCategoryId === String(cat.id) ? 'active' : ''}`}
              onClick={() => handleCategorySelect(String(cat.id))}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Product Grid */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'product' : 'products'}
        </span>
      </div>

      <ProductGrid
        products={filteredProducts}
        loading={loading}
        error={error}
        onRetry={fetchData}
        onAddToCart={handleAddToCart}
        emptyMessage={
          searchQuery
            ? `No products found matching "${searchQuery}". Try a different keyword.`
            : 'No products found in this category.'
        }
      />
    </div>
  );
}
