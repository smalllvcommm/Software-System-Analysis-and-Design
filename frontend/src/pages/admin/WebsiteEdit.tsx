import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { websiteService } from '../../api';
import type { Website } from '../../types';
import './css/ArticleEdit.css';

const WebsiteEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [website, setWebsite] = useState<Partial<Website>>({
    title: '',
    content: '',
    url: '',
    categoryId: undefined
  });

  useEffect(() => {
    if (id) {
      loadWebsite(id);
    }
  }, [id]);

  const loadWebsite = async (websiteId: string) => {
    try {
      setLoading(true);
      const response = await websiteService.fetchById(websiteId);
      setWebsite(response.data);
    } catch (err: any) {
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!website.title || !website.url) {
      setError('请输入标题和网站链接');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (id) {
        await websiteService.update(id, website);
      } else {
        await websiteService.create(website);
      }
      navigate('/admin/list/websites');
    } catch (err: any) {
      setError(err.message || '保存失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-page">
      <div className="edit-header">
        <h1>{id ? '编辑网站' : '添加网站'}</h1>
        <button onClick={() => navigate(-1)} className="btn-secondary">
          返回
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-group">
          <label htmlFor="title">网站名称 *</label>
          <input
            type="text"
            id="title"
            value={website.title || ''}
            onChange={(e) => setWebsite({ ...website, title: e.target.value })}
            required
            className="form-input"
            placeholder="输入网站名称"
          />
        </div>

        <div className="form-group">
          <label htmlFor="url">网站链接 *</label>
          <input
            type="url"
            id="url"
            value={website.url || ''}
            onChange={(e) => setWebsite({ ...website, url: e.target.value })}
            required
            className="form-input"
            placeholder="https://example.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">描述</label>
          <textarea
            id="content"
            value={website.content || ''}
            onChange={(e) => setWebsite({ ...website, content: e.target.value })}
            rows={6}
            className="form-textarea"
            placeholder="输入网站描述"
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

export default WebsiteEdit;

