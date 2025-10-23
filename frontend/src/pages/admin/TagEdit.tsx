import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tagService } from '../../api';
import type { Tag } from '../../types';
import './css/ArticleEdit.css';

const TagEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tag, setTag] = useState<Partial<Tag>>({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (id) {
      loadTag(id);
    }
  }, [id]);

  const loadTag = async (tagId: string) => {
    try {
      setLoading(true);
      const response = await tagService.fetchById(tagId);
      setTag(response.data);
    } catch (err: any) {
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tag.name) {
      setError('请输入标签名称');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (id) {
        await tagService.update(id, tag);
      } else {
        await tagService.create(tag);
      }
      navigate('/admin/list/tags');
    } catch (err: any) {
      setError(err.message || '保存失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-page">
      <div className="edit-header">
        <h1>{id ? '编辑标签' : '创建标签'}</h1>
        <button onClick={() => navigate(-1)} className="btn-secondary">
          返回
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-group">
          <label htmlFor="name">标签名称 *</label>
          <input
            type="text"
            id="name"
            value={tag.name || ''}
            onChange={(e) => setTag({ ...tag, name: e.target.value })}
            required
            className="form-input"
            placeholder="输入标签名称"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">描述</label>
          <textarea
            id="description"
            value={tag.description || ''}
            onChange={(e) => setTag({ ...tag, description: e.target.value })}
            rows={4}
            className="form-textarea"
            placeholder="输入标签描述"
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

export default TagEdit;

