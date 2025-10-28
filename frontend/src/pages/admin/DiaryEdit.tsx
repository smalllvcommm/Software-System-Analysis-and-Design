import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createDiary, updateDiary, fetchDiaryById, fetchAllCategories, fetchAllTags } from '../../api/apiServices';
import type { Diary, Category, Tag } from '../../types/dataTypes';
import './css/EditPage.css';

const DiaryEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [diary, setDiary] = useState<Partial<Diary>>({
    title: '',
    content: '',
    mood: 'CALM',
    weather: 'SUNNY',
    category: null,
    tags: []
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // 載入日記數據（編輯模式）
  useEffect(() => {
    if (isEdit && id) {
      const loadDiary = async () => {
        try {
          setLoading(true);
          const response = await fetchDiaryById(parseInt(id));
          setDiary(response.data);
        } catch (error) {
          setError('載入日記失敗');
          console.error('載入日記失敗:', error);
        } finally {
          setLoading(false);
        }
      };

      loadDiary();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!diary.title?.trim() || !diary.content?.trim()) {
      setError('請填寫標題和內容');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isEdit && id) {
        await updateDiary(parseInt(id), diary);
      } else {
        await createDiary(diary);
      }

      navigate('/admin/list/diaries');
    } catch (error) {
      setError(isEdit ? '更新日記失敗' : '創建日記失敗');
      console.error('提交失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Diary, value: any) => {
    setDiary(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagToggle = (tag: Tag) => {
    const currentTags = diary.tags || [];
    const isSelected = currentTags.some(t => t.id === tag.id);
    
    if (isSelected) {
      setDiary(prev => ({
        ...prev,
        tags: currentTags.filter(t => t.id !== tag.id)
      }));
    } else {
      setDiary(prev => ({
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
        <h2>{isEdit ? '編輯日記' : '創建日記'}</h2>
        <button 
          type="button" 
          onClick={() => navigate('/admin/list/diaries')}
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
            value={diary.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="輸入日記標題"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>心情</label>
            <div className="mood-selector">
              {moodOptions.map(option => (
                <label key={option.value} className="mood-option">
                  <input
                    type="radio"
                    name="mood"
                    value={option.value}
                    checked={diary.mood === option.value}
                    onChange={(e) => handleInputChange('mood', e.target.value)}
                  />
                  <span style={{ color: option.color }}>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>天氣</label>
            <div className="weather-selector">
              {weatherOptions.map(option => (
                <label key={option.value} className="weather-option">
                  <input
                    type="radio"
                    name="weather"
                    value={option.value}
                    checked={diary.weather === option.value}
                    onChange={(e) => handleInputChange('weather', e.target.value)}
                  />
                  <span style={{ color: option.color }}>{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="category">分類</label>
          <select
            id="category"
            value={diary.category?.id || ''}
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
                  checked={diary.tags?.some(t => t.id === tag.id) || false}
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
            value={diary.content || ''}
            onChange={(e) => handleInputChange('content', e.target.value)}
            placeholder="輸入日記內容..."
            rows={10}
            required
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/admin/list/diaries')}
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

export default DiaryEdit;
