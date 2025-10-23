import React, { useState, useEffect } from 'react';
// 导入封装的待办API（与auth调用方式统一）
import { getTodos, createTodo, deleteTodo, updateTodoStatus } from '../../api/index';
import './css/TodoList.css';
const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', is_completed: false });
  const [loading, setLoading] = useState(false);

  // 获取待办列表（与登录/注册调用风格一致）
  const fetchTodos = async () => {
    setLoading(true);
    try {
      const data = await getTodos();
      setTodos(data);
    } catch (error) {
      alert('获取待办失败：' + (error.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  // 添加待办
  const handlecreateTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;

    setLoading(true);
    try {
      await createTodo(newTodo);
      // 添加成功后刷新列表 + 清空输入
      fetchTodos();
      setNewTodo({ title: '', is_completed: false });
    } catch (error) {
      alert('添加失败：' + (error.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  // 删除待办
  const handleDelete = async (title) => {
    if (!confirm('确定要删除吗？')) return;

    setLoading(true);
    try {
      await deleteTodo(title);
      fetchTodos(); // 删除后刷新
    } catch (error) {
      alert('删除失败：' + (error.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  // 切换完成状态
  const handleToggleStatus = async (title, currentStatus) => {
    setLoading(true);
    try {
      await updateTodoStatus(title, !currentStatus);
      // 局部更新状态（优化体验）
      setTodos(todos.map(todo => 
        todo.title === title ? { ...todo, is_completed: !currentStatus } : todo
      ));
    } catch (error) {
      alert('更新失败：' + (error.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="todo-list">
      <h2>待办清单</h2>
      
      {/* 添加表单 */}
      <form onSubmit={handlecreateTodo}>
        <input
          type="text"
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
          placeholder="输入待办内容"
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? '添加中...' : '添加'}
        </button>
      </form>
      
      {/* 待办列表 */}
      <div className="todo-items">
        {loading ? (
          <p>加载中...</p>
        ) : todos.length === 0 ? (
          <p>暂无待办事项</p>
        ) : (
          todos.map(todo => (
            <div key={todo.title} className="todo-item">
              <input
                type="checkbox"
                checked={todo.is_completed}
                onChange={() => handleToggleStatus(todo.title, todo.is_completed)}
                disabled={loading}
              />
              <span style={{ textDecoration: todo.is_completed ? 'line-through' : 'none' }}>
                {todo.title}
              </span>
              <button 
                onClick={() => handleDelete(todo.title)}
                disabled={loading}
              >
                删除
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;