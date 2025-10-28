import React, { useState, useEffect } from 'react';
import { fetchTodos, createTodo, deleteTodo, updateTodo } from '../../api/apiServices';
import type { Todo } from '../../types/dataTypes';
import './css/TodoList.css';

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取待办列表
  const loadTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchTodos({ page: 0, size: 100 });
      setTodos(response.data?.content || []);
    } catch (error: any) {
      setError('獲取待辦事項失敗：' + (error.message || '未知錯誤'));
      console.error('獲取待辦事項失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  // 添加待办
  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.title.trim()) {
      setError('請輸入待辦事項標題');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await createTodo({
        title: newTodo.title,
        content: newTodo.content || '',
        status: 'PENDING',
        priority: 3,
        deadline: '',
        category: null,
        tags: []
      });
      // 添加成功后刷新列表 + 清空输入
      loadTodos();
      setNewTodo({ title: '', content: '' });
    } catch (error: any) {
      setError('添加失敗：' + (error.message || '未知錯誤'));
      console.error('添加待辦事項失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  // 删除待办
  const handleDelete = async (id: number) => {
    if (!confirm('確定要刪除嗎？')) return;

    setLoading(true);
    setError(null);
    try {
      await deleteTodo(id);
      loadTodos(); // 删除后刷新
    } catch (error: any) {
      setError('刪除失敗：' + (error.message || '未知錯誤'));
      console.error('刪除待辦事項失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  // 切换完成状态
  const handleToggleStatus = async (todo: Todo) => {
    const newStatus = todo.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    
    setLoading(true);
    setError(null);
    try {
      await updateTodo(todo.id, { ...todo, status: newStatus });
      // 局部更新状态（优化体验）
      setTodos(todos.map(t => 
        t.id === todo.id ? { ...t, status: newStatus } : t
      ));
    } catch (error: any) {
      setError('更新失敗：' + (error.message || '未知錯誤'));
      console.error('更新待辦事項失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <div className="todo-list">
      <h2>待辦清單</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {/* 添加表单 */}
      <form onSubmit={handleCreateTodo} className="todo-form">
        <div className="form-group">
          <input
            type="text"
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            placeholder="輸入待辦事項標題"
            disabled={loading}
            required
          />
        </div>
        <div className="form-group">
          <textarea
            value={newTodo.content}
            onChange={(e) => setNewTodo({ ...newTodo, content: e.target.value })}
            placeholder="輸入詳細內容（可選）"
            disabled={loading}
            rows={2}
          />
        </div>
        <button type="submit" disabled={loading} className="add-btn">
          {loading ? '添加中...' : '添加待辦事項'}
        </button>
      </form>
      
      {/* 待办列表 */}
      <div className="todo-items">
        {loading && todos.length === 0 ? (
          <div className="loading-state">
            <p>載入中...</p>
          </div>
        ) : todos.length === 0 ? (
          <div className="empty-state">
            <p>暫無待辦事項</p>
            <p className="hint">添加您的第一個待辦事項開始使用</p>
          </div>
        ) : (
          todos.map(todo => (
            <div key={todo.id} className={`todo-item ${todo.status === 'COMPLETED' ? 'completed' : ''}`}>
              <div className="todo-content">
                <input
                  type="checkbox"
                  checked={todo.status === 'COMPLETED'}
                  onChange={() => handleToggleStatus(todo)}
                  disabled={loading}
                  className="todo-checkbox"
                />
                <div className="todo-text">
                  <h3 className="todo-title">{todo.title}</h3>
                  {todo.content && (
                    <p className="todo-description">{todo.content}</p>
                  )}
                  <div className="todo-meta">
                    <span className={`status-badge status-${todo.status.toLowerCase()}`}>
                      {todo.status === 'PENDING' ? '待處理' : 
                       todo.status === 'IN_PROGRESS' ? '進行中' : '已完成'}
                    </span>
                    <span className="priority-badge priority-${todo.priority}">
                      優先級: {todo.priority}
                    </span>
                    {todo.deadline && (
                      <span className="deadline">
                        截止: {new Date(todo.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="todo-actions">
                <button 
                  onClick={() => handleDelete(todo.id)}
                  disabled={loading}
                  className="delete-btn"
                  title="刪除"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;
