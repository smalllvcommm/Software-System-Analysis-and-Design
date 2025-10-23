import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studyCheckInService } from '../../api';
import type { StudyCheckIn } from '../../types';
import './css/ArticleEdit.css';

const StudyCheckInEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkIn, setCheckIn] = useState<Partial<StudyCheckIn>>({
    title: '',
    content: '',
    studyDate: '',
    duration: 0,
    categoryId: undefined
  });

  useEffect(() => {
    if (id) {
      loadCheckIn(id);
    }
  }, [id]);

  const loadCheckIn = async (checkInId: string) => {
    try {
      setLoading(true);
      const response = await studyCheckInService.fetchById(checkInId);
      setCheckIn(response.data);
    } catch (err: any) {
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn.title) {
      setError('请输入标题');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (id) {
        await studyCheckInService.update(id, checkIn);
      } else {
        await studyCheckInService.create(checkIn);
      }
      navigate('/admin/list/study-checkins');
    } catch (err: any) {
      setError(err.message || '保存失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-page">
      <div className="edit-header">
        <h1>{id ? '编辑学习打卡' : '创建学习打卡'}</h1>
        <button onClick={() => navigate(-1)} className="btn-secondary">
          返回
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-group">
          <label htmlFor="title">学习内容 *</label>
          <input
            type="text"
            id="title"
            value={checkIn.title || ''}
            onChange={(e) => setCheckIn({ ...checkIn, title: e.target.value })}
            required
            className="form-input"
            placeholder="今天学习了什么"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="studyDate">学习日期</label>
            <input
              type="date"
              id="studyDate"
              value={checkIn.studyDate || ''}
              onChange={(e) => setCheckIn({ ...checkIn, studyDate: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="duration">学习时长（分钟）</label>
            <input
              type="number"
              id="duration"
              value={checkIn.duration || 0}
              onChange={(e) => setCheckIn({ ...checkIn, duration: parseInt(e.target.value) })}
              className="form-input"
              placeholder="学习时长"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="content">学习笔记</label>
          <textarea
            id="content"
            value={checkIn.content || ''}
            onChange={(e) => setCheckIn({ ...checkIn, content: e.target.value })}
            rows={8}
            className="form-textarea"
            placeholder="记录学习心得和笔记"
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

export default StudyCheckInEdit;

