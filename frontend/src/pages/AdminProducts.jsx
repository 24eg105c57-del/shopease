import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '../components/Button';
import { productService } from '../api/productService';
import { categoryService } from '../api/categoryService';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    imageUrl: '',
    stockQuantity: 0,
    rating: 0,
    reviewCount: 0
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getProducts(),
        categoryService.getCategories()
      ]);
      setProducts(productsData.content || []);
      setCategories(categoriesData || []);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        ...currentProduct,
        price: parseFloat(currentProduct.price) || 0,
        stockQuantity: parseInt(currentProduct.stockQuantity, 10) || 0,
        categoryId: currentProduct.categoryId ? parseInt(currentProduct.categoryId, 10) : null,
      };

      if (isEditing && currentProduct.id) {
        await productService.updateProduct(currentProduct.id, payload);
        showSuccess('Product updated successfully');
      } else {
        await productService.createProduct(payload);
        showSuccess('Product created successfully');
      }
      setIsEditing(false);
      setCurrentProduct({
        name: '', description: '', price: 0, categoryId: '', imageUrl: '', stockQuantity: 0, rating: 0, reviewCount: 0
      });
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || (err.response?.status === 403 ? 'Access forbidden: Admin role required' : 'Failed to save product. Please check fields.');
      setError(msg);
    }
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setCurrentProduct(product);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        showSuccess('Product deleted successfully');
        fetchData();
      } catch (err) {
        setError('Failed to delete product');
      }
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setCurrentProduct({
      name: '', description: '', price: 0, categoryId: '', imageUrl: '', stockQuantity: 0, rating: 0, reviewCount: 0
    });
    setError(null);
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '1000px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Product Management</h1>

      {error && (
        <div style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {successMsg && (
        <div style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <CheckCircle2 size={20} />
          {successMsg}
        </div>
      )}

      <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', marginBottom: '3rem', border: '1px solid var(--border-light)' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label>Name</label>
            <input required type="text" name="name" value={currentProduct.name} onChange={handleInputChange} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-light)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label>Category</label>
            <select required name="categoryId" value={currentProduct.categoryId || ''} onChange={handleInputChange} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
              <option value="">Select a category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label>Price</label>
            <input required type="number" step="0.01" min="0" name="price" value={currentProduct.price} onChange={handleInputChange} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-light)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label>Stock Quantity</label>
            <input required type="number" min="0" name="stockQuantity" value={currentProduct.stockQuantity} onChange={handleInputChange} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-light)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', gridColumn: '1 / -1' }}>
            <label>Image URL</label>
            <input type="text" name="imageUrl" value={currentProduct.imageUrl} onChange={handleInputChange} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-light)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', gridColumn: '1 / -1' }}>
            <label>Description</label>
            <textarea name="description" rows="3" value={currentProduct.description} onChange={handleInputChange} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-light)' }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', gridColumn: '1 / -1' }}>
            <Button type="submit" variant="primary" icon={<Plus size={16} />}>
              {isEditing ? 'Update Product' : 'Add Product'}
            </Button>
            {isEditing && (
              <Button type="button" variant="outline" onClick={cancelEdit}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-light)' }}>
              <th style={{ padding: '1rem' }}>ID</th>
              <th style={{ padding: '1rem' }}>Name</th>
              <th style={{ padding: '1rem' }}>Category</th>
              <th style={{ padding: '1rem' }}>Price</th>
              <th style={{ padding: '1rem' }}>Stock</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center' }}>Loading products...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center' }}>No products found</td></tr>
            ) : (
              products.map(product => (
                <tr key={product.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '1rem' }}>{product.id}</td>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{product.name}</td>
                  <td style={{ padding: '1rem' }}>{product.categoryName || '-'}</td>
                  <td style={{ padding: '1rem' }}>${Number(product.price).toFixed(2)}</td>
                  <td style={{ padding: '1rem' }}>{product.stockQuantity}</td>
                  <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleEdit(product)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'var(--primary-600)' }}>
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'var(--danger)' }}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
