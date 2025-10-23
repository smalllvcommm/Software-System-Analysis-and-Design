import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createTodo, updateTodo, fetchTodoById, fetchAllCategories, fetchAllTags } from '../../api/index';
import type { Todo, Category, Tag } from '../../types/index';
import './css/EditPage.css';

const TodoEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [todo, setTodo] = useState<Partial<Todo>>({
    title: '',
    content: '',
    status: 'PENDING',
    priority: 3,
    deadline: '',
    category: null,
    tags: []
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 狀態選項
  const statusOptions = [
    { value: 'PENDING', label: '待處理' },
    { value: 'IN_PROGRESS', label: '進行中' },
    { value: 'COMPLETED', label: '已完成' }
  ];

  // 優先級選項
  const priorityOptions = [
    { value: 1, label: '低' },
    { value: 2, label: '較低' },
    { value: 3, label: '中' },
    { value: 4, label: '較高' },
    { value: 5, label: '高' }
  ];

  // 載入分類和標籤
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          fetchAllCategories(),
          fetchAllTags()
        ]);
        setCategories(categoriesData.data || []);
        setTags(tagsData.data || []);
      } catch (error) {
        console.error('載入分類和標籤失敗:', error);
      }
    };

    loadData();
  }, []);

  // 載入待辦事項數據（編輯模式）
  useEffect(() => {
    if (isEdit && id) {
      const loadTodo = async () => {
        try {
          setLoading(true);
          const response = await fetchTodoById(parseInt(id));
          setTodo(response.data);
        } catch (error) {
          setError('載入待辦事項失敗');
          console.error('載入待辦事項失敗:', error);
        } finally {
          setLoading(false);
        }
      };

      loadTodo();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!todo.title?.trim() || !todo.content?.trim()) {
      setError('請填寫標題和內容');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isEdit && id) {
        await updateTodo(parseInt(id), todo);
      } else {
        await createTodo(todo);
      }

      navigate('/admin/list/todos');
    } catch (error) {
      setError(isEdit ? '更新待辦事項失敗' : '創建待辦事項失敗');
      console.error('提交失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Todo, value: any) => {
    setTodo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagToggle = (tag: Tag) => {
    const currentTags = todo.tags || [];
    const isSelected = currentTags.some(t => t.id === tag.id);
    
    if (isSelected) {
      setTodo(prev => ({
        ...prev,
        tags: currentTags.filter(t => t.id !== tag.id)
      }));
    } else {
      setTodo(prev => ({
        ...prev,
        tags: [...currentTags, tag]
      }));
    }
  };

  if (loading && isEdit) {
    return <div className="edit-page">載入中...</div>;
  }

  return (
    <div className="edit-page">
      <div className="edit-header">
        <h2>{isEdit ? '編輯待辦事項' : '創建待辦事項'}</h2>
        <button 
          type="button" 
          onClick={() => navigate('/admin/list/todos')}
          className="back-btn"
        >
          返回列表
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-group">
          <label htmlFor="title">標題 *</label>
          <input
            type="text"
            id="title"
            value={todo.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="輸入待辦事項標題"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">狀態</label>
            <select
              id="status"
              value={todo.status || 'PENDING'}
              onChange={(e) => handleInputChange('status', e.target.value)}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">優先級</label>
            <select
              id="priority"
              value={todo.priority || 3}
              onChange={(e) => handleInputChange('priority', parseInt(e.target.value))}
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="deadline">截止時間</label>
          <input
            type="datetime-local"
            id="deadline"
            value={todo.deadline ? new Date(todo.deadline).toISOString().slice(0, 16) : ''}
            onChange={(e) => handleInputChange('deadline', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">分類</label>
          <select
            id="category"
            value={todo.category?.id || ''}
            onChange={(e) => {
              const categoryId = parseInt(e.target.value);
              const category = categories.find(c => c.id === categoryId);
              handleInputChange('category', category || null);
            }}
          >
            <option value="">選擇分類</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>標籤</label>
          <div className="tag-selector">
            {tags.map(tag => (
              <label key={tag.id} className="tag-option">
                <input
                  type="checkbox"
                  checked={todo.tags?.some(t => t.id === tag.id) || false}
                  onChange={() => handleTagToggle(tag)}
                />
                <span>{tag.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="content">內容 *</label>
          <textarea
            id="content"
            value={todo.content || ''}
            onChange={(e) => handleInputChange('content', e.target.value)}
            placeholder="輸入待辦事項詳細內容..."
            rows={8}
            required
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/admin/list/todos')}
            className="cancel-btn"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={loading}
            className="submit-btn"
          >
            {loading ? '保存中...' : (isEdit ? '更新' : '創建')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TodoEdit;