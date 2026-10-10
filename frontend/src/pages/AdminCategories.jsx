import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '../components/Button';
import { categoryService } from '../api/categoryService';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    name: '',
    description: ''
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (isEditing && currentCategory.id) {
        await categoryService.updateCategory(currentCategory.id, currentCategory);
        showSuccess('Category updated successfully');
      } else {
        await categoryService.createCategory(currentCategory);
        showSuccess('Category created successfully');
      }
      setIsEditing(false);
      setCurrentCategory({ name: '', description: '' });
      fetchCategories();
    } catch (err) {
      const msg = err.response?.data?.message || (err.response?.status === 403 ? 'Access forbidden: Admin role required' : 'Failed to save category. Please check fields.');
      setError(msg);
    }
  };

  const handleEdit = (category) => {
    setIsEditing(true);
    setCurrentCategory(category);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? (Cannot delete if products exist)')) {
      try {
        await categoryService.deleteCategory(id);
        showSuccess('Category deleted successfully');
        fetchCategories();
      } catch (err) {
        setError('Failed to delete category. It might contain products.');
      }
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setCurrentCategory({ name: '', description: '' });
    setError(null);
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Category Management</h1>

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
          {isEditing ? 'Edit Category' : 'Add New Category'}
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label>Name</label>
            <input required type="text" name="name" value={currentCategory.name} onChange={handleInputChange} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-light)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label>Description</label>
            <textarea name="description" rows="3" value={currentCategory.description} onChange={handleInputChange} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-light)' }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <Button type="submit" variant="primary" icon={<Plus size={16} />}>
              {isEditing ? 'Update Category' : 'Add Category'}
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
              <th style={{ padding: '1rem' }}>Description</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center' }}>Loading categories...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center' }}>No categories found</td></tr>
            ) : (
              categories.map(category => (
                <tr key={category.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '1rem' }}>{category.id}</td>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{category.name}</td>
                  <td style={{ padding: '1rem' }}>{category.description}</td>
                  <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleEdit(category)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'var(--primary-600)' }}>
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(category.id)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'var(--danger)' }}>
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
