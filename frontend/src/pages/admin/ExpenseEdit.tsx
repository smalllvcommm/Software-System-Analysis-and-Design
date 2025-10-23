import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { expenseService } from '../../api';
import type { Expense } from '../../types';
import './css/ArticleEdit.css';

const ExpenseEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expense, setExpense] = useState<Partial<Expense>>({
    title: '',
    content: '',
    amount: 0,
    expenseDate: '',
    categoryId: undefined
  });

  useEffect(() => {
    if (id) {
      loadExpense(id);
    }
  }, [id]);

  const loadExpense = async (expenseId: string) => {
    try {
      setLoading(true);
      const response = await expenseService.fetchById(expenseId);
      setExpense(response.data);
    } catch (err: any) {
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expense.title || !expense.amount) {
      setError('请输入标题和金额');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (id) {
        await expenseService.update(id, expense);
      } else {
        await expenseService.create(expense);
      }
      navigate('/admin/list/expenses');
    } catch (err: any) {
      setError(err.message || '保存失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-page">
      <div className="edit-header">
        <h1>{id ? '编辑支出' : '记录支出'}</h1>
        <button onClick={() => navigate(-1)} className="btn-secondary">
          返回
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-group">
          <label htmlFor="title">支出项目 *</label>
          <input
            type="text"
            id="title"
            value={expense.title || ''}
            onChange={(e) => setExpense({ ...expense, title: e.target.value })}
            required
            className="form-input"
            placeholder="例如：午餐、交通费"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="amount">金额 *</label>
            <input
              type="number"
              id="amount"
              step="0.01"
              value={expense.amount || ''}
              onChange={(e) => setExpense({ ...expense, amount: parseFloat(e.target.value) })}
              required
              className="form-input"
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label htmlFor="expenseDate">日期</label>
            <input
              type="date"
              id="expenseDate"
              value={expense.expenseDate || ''}
              onChange={(e) => setExpense({ ...expense, expenseDate: e.target.value })}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="content">备注</label>
          <textarea
            id="content"
            value={expense.content || ''}
            onChange={(e) => setExpense({ ...expense, content: e.target.value })}
            rows={4}
            className="form-textarea"
            placeholder="输入支出备注"
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

export default ExpenseEdit;

