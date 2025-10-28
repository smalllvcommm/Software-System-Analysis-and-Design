import React, { useState, useEffect } from 'react';
import { fetchDiaries, createDiary, deleteDiary, fetchAllCategories, fetchAllTags } from '../../api/apiServices';
import type { Diary, Category, Tag } from '../../types/dataTypes';
import './css/DiaryList.css';

const DiaryList: React.FC = () => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newDiary, setNewDiary] = useState({
    title: '',
    content: '',
    mood: 'CALM' as const,
    weather: 'SUNNY' as const,
    categoryId: '',
    tagIds: [] as number[]
  });

  // 心情選項
  const moodOptions = [
    { value: 'HAPPY', label: '😊 開心', color: '#ffd700' },
    { value: 'SAD', label: '😢 難過', color: '#87ceeb' },
    { value: 'EXCITED', label: '🤩 興奮', color: '#ff69b4' },
    { value: 'CALM', label: '😌 平靜', color: '#98fb98' },
    { value: 'ANGRY', label: '😠 生氣', color: '#ff6347' },
    { value: 'ANXIOUS', label: '😰 焦慮', color: '#dda0dd' }
  ];

  // 天氣選項
  const weatherOptions = [
    { value: 'SUNNY', label: '☀️ 晴天', color: '#ffd700' },
    { value: 'CLOUDY', label: '☁️ 多雲', color: '#d3d3d3' },
    { value: 'RAINY', label: '🌧️ 雨天', color: '#87ceeb' },
    { value: 'SNOWY', label: '❄️ 雪天', color: '#f0f8ff' },
    { value: 'WINDY', label: '💨 大風', color: '#e6e6fa' }
  ];

  // 載入數據
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [diariesResponse, categoriesResponse, tagsResponse] = await Promise.all([
        fetchDiaries({ page: 0, size: 100 }),
        fetchAllCategories(),
        fetchAllTags()
      ]);
      
      setDiaries(diariesResponse.data?.content || []);
      setCategories(categoriesResponse.data || []);
      setTags(tagsResponse.data || []);
    } catch (error: any) {
      setError('載入數據失敗：' + (error.message || '未知錯誤'));
      console.error('載入數據失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  // 創建日記
  const handleCreateDiary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiary.title.trim() || !newDiary.content.trim()) {
      setError('請填寫標題和內容');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const selectedCategory = categories.find(c => c.id === parseInt(newDiary.categoryId));
      const selectedTags = tags.filter(t => newDiary.tagIds.includes(t.id));

      await createDiary({
        title: newDiary.title,
        content: newDiary.content,
        mood: newDiary.mood,
        weather: newDiary.weather,
        category: selectedCategory || null,
        tags: selectedTags
      });

      // 重新載入數據
      loadData();
      // 重置表單
      setNewDiary({
        title: '',
        content: '',
        mood: 'CALM',
        weather: 'SUNNY',
        categoryId: '',
        tagIds: []
      });
      setShowCreateForm(false);
    } catch (error: any) {
      setError('創建日記失敗：' + (error.message || '未知錯誤'));
      console.error('創建日記失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  // 刪除日記
  const handleDeleteDiary = async (id: number) => {
    if (!confirm('確定要刪除這篇日記嗎？')) return;

    setLoading(true);
    setError(null);
    try {
      await deleteDiary(id);
      loadData();
    } catch (error: any) {
      setError('刪除日記失敗：' + (error.message || '未知錯誤'));
      console.error('刪除日記失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  // 切換標籤選擇
  const handleTagToggle = (tagId: number) => {
    setNewDiary(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter(id => id !== tagId)
        : [...prev.tagIds, tagId]
    }));
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <div className="diary-list">
      <div className="diary-header">
        <h2>我的日記</h2>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="create-btn"
        >
          {showCreateForm ? '取消' : '寫新日記'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* 創建日記表單 */}
      {showCreateForm && (
        <div className="create-form-container">
          <form onSubmit={handleCreateDiary} className="create-form">
            <div className="form-group">
              <label htmlFor="title">標題 *</label>
              <input
                type="text"
                id="title"
                value={newDiary.title}
                onChange={(e) => setNewDiary({ ...newDiary, title: e.target.value })}
                placeholder="今天發生了什麼？"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>心情</label>
                <div className="mood-selector">
                  {moodOptions.map(mood => (
                    <label key={mood.value} className="mood-option">
                      <input
                        type="radio"
                        name="mood"
                        value={mood.value}
                        checked={newDiary.mood === mood.value}
                        onChange={(e) => setNewDiary({ ...newDiary, mood: e.target.value as any })}
                      />
                      <span style={{ color: mood.color }}>{mood.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>天氣</label>
                <div className="weather-selector">
                  {weatherOptions.map(weather => (
                    <label key={weather.value} className="weather-option">
                      <input
                        type="radio"
                        name="weather"
                        value={weather.value}
                        checked={newDiary.weather === weather.value}
                        onChange={(e) => setNewDiary({ ...newDiary, weather: e.target.value as any })}
                      />
                      <span style={{ color: weather.color }}>{weather.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="category">分類</label>
              <select
                id="category"
                value={newDiary.categoryId}
                onChange={(e) => setNewDiary({ ...newDiary, categoryId: e.target.value })}
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
                      checked={newDiary.tagIds.includes(tag.id)}
                      onChange={() => handleTagToggle(tag.id)}
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
                value={newDiary.content}
                onChange={(e) => setNewDiary({ ...newDiary, content: e.target.value })}
                placeholder="記錄今天的心情和經歷..."
                rows={8}
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="cancel-btn"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={loading}
                className="submit-btn"
              >
                {loading ? '保存中...' : '保存日記'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 日記列表 */}
      <div className="diaries-container">
        {loading && diaries.length === 0 ? (
          <div className="loading-state">
            <p>載入中...</p>
          </div>
        ) : diaries.length === 0 ? (
          <div className="empty-state">
            <p>還沒有日記</p>
            <p className="hint">開始記錄您的生活點滴</p>
          </div>
        ) : (
          diaries.map(diary => {
            const moodOption = moodOptions.find(m => m.value === diary.mood);
            const weatherOption = weatherOptions.find(w => w.value === diary.weather);
            
            return (
              <div key={diary.id} className="diary-card">
                <div className="diary-header-card">
                  <div className="diary-meta">
                    <h3 className="diary-title">{diary.title}</h3>
                    <div className="diary-info">
                      <span className="diary-date">{formatDate(diary.createdTime)}</span>
                      {diary.category && (
                        <span className="diary-category">{diary.category.name}</span>
                      )}
                    </div>
                  </div>
                  <div className="diary-mood-weather">
                    {moodOption && (
                      <span className="mood-indicator" style={{ color: moodOption.color }}>
                        {moodOption.label}
                      </span>
                    )}
                    {weatherOption && (
                      <span className="weather-indicator" style={{ color: weatherOption.color }}>
                        {weatherOption.label}
                      </span>
                    )}
                  </div>
                </div>

                <div className="diary-content">
                  <p className="diary-text">{diary.content}</p>
                </div>

                {diary.tags && diary.tags.length > 0 && (
                  <div className="diary-tags">
                    {diary.tags.map(tag => (
                      <span key={tag.id} className="tag-chip">
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="diary-actions">
                  <button
                    onClick={() => handleDeleteDiary(diary.id)}
                    disabled={loading}
                    className="delete-btn"
                    title="刪除日記"
                  >
                    🗑️ 刪除
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DiaryList;
