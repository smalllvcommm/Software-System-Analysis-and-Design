import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { audioService } from '../../api/apiServices';
import type { Audio } from '../../types/dataTypes';
import './css/ArticleEdit.css';

const AudioEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [audio, setAudio] = useState<Partial<Audio>>({
    title: '',
    content: '',
    url: '',
    duration: 0,
    categoryId: undefined
  });

  useEffect(() => {
    if (id) {
      loadAudio(id);
    }
  }, [id]);

  const loadAudio = async (audioId: string) => {
    try {
      setLoading(true);
      const response = await audioService.fetchById(audioId);
      setAudio(response.data);
    } catch (err: any) {
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audio.title || !audio.url) {
      setError('请输入标题和音频链接');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (id) {
        await audioService.update(id, audio);
      } else {
        await audioService.create(audio);
      }
      navigate('/admin/list/audios');
    } catch (err: any) {
      setError(err.message || '保存失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-page">
      <div className="edit-header">
        <h1>{id ? '编辑音频' : '创建音频'}</h1>
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
            value={audio.title || ''}
            onChange={(e) => setAudio({ ...audio, title: e.target.value })}
            required
            className="form-input"
            placeholder="输入音频标题"
          />
        </div>

        <div className="form-group">
          <label htmlFor="url">音频链接 *</label>
          <input
            type="url"
            id="url"
            value={audio.url || ''}
            onChange={(e) => setAudio({ ...audio, url: e.target.value })}
            required
            className="form-input"
            placeholder="https://example.com/audio.mp3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="duration">时长（秒）</label>
          <input
            type="number"
            id="duration"
            value={audio.duration || 0}
            onChange={(e) => setAudio({ ...audio, duration: parseInt(e.target.value) })}
            className="form-input"
            placeholder="音频时长"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">描述</label>
          <textarea
            id="content"
            value={audio.content || ''}
            onChange={(e) => setAudio({ ...audio, content: e.target.value })}
            rows={6}
            className="form-textarea"
            placeholder="输入音频描述"
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

export default AudioEdit;

