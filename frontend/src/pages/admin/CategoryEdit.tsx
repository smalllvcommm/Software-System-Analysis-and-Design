import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categoryService } from '../../api/apiServices';
import type { Category } from '../../types/dataTypes';
import './css/ArticleEdit.css';

const CategoryEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [category, setCategory] = useState<Partial<Category>>({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (id) {
      loadCategory(id);
    }
  }, [id]);

  const loadCategory = async (categoryId: string) => {
    try {
      setLoading(true);
      const response = await categoryService.fetchById(categoryId);
      setCategory(response.data);
    } catch (err: any) {
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category.name) {
      setError('请输入分类名称');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (id) {
        await categoryService.update(id, category);
      } else {
        await categoryService.create(category);
      }
      navigate('/admin/list/categories');
    } catch (err: any) {
      setError(err.message || '保存失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-page">
      <div className="edit-header">
        <h1>{id ? '编辑分类' : '创建分类'}</h1>
        <button onClick={() => navigate(-1)} className="btn-secondary">
          返回
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-group">
          <label htmlFor="name">分类名称 *</label>
          <input
            type="text"
            id="name"
            value={category.name || ''}
            onChange={(e) => setCategory({ ...category, name: e.target.value })}
            required
            className="form-input"
            placeholder="输入分类名称"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">描述</label>
          <textarea
            id="description"
            value={category.description || ''}
            onChange={(e) => setCategory({ ...category, description: e.target.value })}
            rows={4}
            className="form-textarea"
            placeholder="输入分类描述"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? '保存中...' : '保存'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
            取消
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryEdit;

