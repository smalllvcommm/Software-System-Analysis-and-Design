import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { travelPlanService } from '../../api';
import type { TravelPlan } from '../../types';
import './css/ArticleEdit.css';

const TravelPlanEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [travelPlan, setTravelPlan] = useState<Partial<TravelPlan>>({
    title: '',
    content: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: 0,
    categoryId: undefined
  });

  useEffect(() => {
    if (id) {
      loadTravelPlan(id);
    }
  }, [id]);

  const loadTravelPlan = async (planId: string) => {
    try {
      setLoading(true);
      const response = await travelPlanService.fetchById(planId);
      setTravelPlan(response.data);
    } catch (err: any) {
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!travelPlan.title || !travelPlan.destination) {
      setError('请输入标题和目的地');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (id) {
        await travelPlanService.update(id, travelPlan);
      } else {
        await travelPlanService.create(travelPlan);
      }
      navigate('/admin/list/travel-plans');
    } catch (err: any) {
      setError(err.message || '保存失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-page">
      <div className="edit-header">
        <h1>{id ? '编辑旅行计划' : '创建旅行计划'}</h1>
        <button onClick={() => navigate(-1)} className="btn-secondary">
          返回
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-group">
          <label htmlFor="title">计划名称 *</label>
          <input
            type="text"
            id="title"
            value={travelPlan.title || ''}
            onChange={(e) => setTravelPlan({ ...travelPlan, title: e.target.value })}
            required
            className="form-input"
            placeholder="例如：春节云南之旅"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="destination">目的地 *</label>
            <input
              type="text"
              id="destination"
              value={travelPlan.destination || ''}
              onChange={(e) => setTravelPlan({ ...travelPlan, destination: e.target.value })}
              required
              className="form-input"
              placeholder="旅行目的地"
            />
          </div>

          <div className="form-group">
            <label htmlFor="budget">预算</label>
            <input
              type="number"
              id="budget"
              step="0.01"
              value={travelPlan.budget || ''}
              onChange={(e) => setTravelPlan({ ...travelPlan, budget: parseFloat(e.target.value) })}
              className="form-input"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">开始日期</label>
            <input
              type="date"
              id="startDate"
              value={travelPlan.startDate || ''}
              onChange={(e) => setTravelPlan({ ...travelPlan, startDate: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">结束日期</label>
            <input
              type="date"
              id="endDate"
              value={travelPlan.endDate || ''}
              onChange={(e) => setTravelPlan({ ...travelPlan, endDate: e.target.value })}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="content">行程详情</label>
          <textarea
            id="content"
            value={travelPlan.content || ''}
            onChange={(e) => setTravelPlan({ ...travelPlan, content: e.target.value })}
            rows={8}
            className="form-textarea"
            placeholder="输入详细行程安排"
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

export default TravelPlanEdit;

