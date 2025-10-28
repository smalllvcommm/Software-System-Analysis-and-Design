import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { memoService } from '../../api/apiServices';
import type { Memo } from '../../types/dataTypes';
import './css/ArticleEdit.css';

const MemoEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [memo, setMemo] = useState<Partial<Memo>>({
    title: '',
    content: '',
    categoryId: undefined
  });

  useEffect(() => {
    if (id) {
      loadMemo(id);
    }
  }, [id]);

  const loadMemo = async (memoId: string) => {
    try {
      setLoading(true);
      const response = await memoService.fetchById(memoId);
      setMemo(response.data);
    } catch (err: any) {
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memo.title) {
      setError('请输入标题');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (id) {
        await memoService.update(id, memo);
      } else {
        await memoService.create(memo);
      }
      navigate('/admin/list/memos');
    } catch (err: any) {
      setError(err.message || '保存失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-page">
      <div className="edit-header">
        <h1>{id ? '编辑备忘录' : '创建备忘录'}</h1>
        <button onClick={() => navigate(-1)} className="btn-secondary">
          返回
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-group">
          <label htmlFor="title">标题 *</label>
          <input
            type="text"
            id="title"
            value={memo.title || ''}
            onChange={(e) => setMemo({ ...memo, title: e.target.value })}
            required
            className="form-input"
            placeholder="输入备忘录标题"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">内容</label>
          <textarea
            id="content"
            value={memo.content || ''}
            onChange={(e) => setMemo({ ...memo, content: e.target.value })}
            rows={10}
            className="form-textarea"
            placeholder="输入备忘录内容"
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

export default MemoEdit;

