import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { videoService } from '../../api';
import type { Video } from '../../types';
import './css/ArticleEdit.css';

const VideoEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [video, setVideo] = useState<Partial<Video>>({
    title: '',
    content: '',
    url: '',
    duration: 0,
    categoryId: undefined
  });

  useEffect(() => {
    if (id) {
      loadVideo(id);
    }
  }, [id]);

  const loadVideo = async (videoId: string) => {
    try {
      setLoading(true);
      const response = await videoService.fetchById(videoId);
      setVideo(response.data);
    } catch (err: any) {
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!video.title || !video.url) {
      setError('请输入标题和视频链接');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (id) {
        await videoService.update(id, video);
      } else {
        await videoService.create(video);
      }
      navigate('/admin/list/videos');
    } catch (err: any) {
      setError(err.message || '保存失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-page">
      <div className="edit-header">
        <h1>{id ? '编辑视频' : '创建视频'}</h1>
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
            value={video.title || ''}
            onChange={(e) => setVideo({ ...video, title: e.target.value })}
            required
            className="form-input"
            placeholder="输入视频标题"
          />
        </div>

        <div className="form-group">
          <label htmlFor="url">视频链接 *</label>
          <input
            type="url"
            id="url"
            value={video.url || ''}
            onChange={(e) => setVideo({ ...video, url: e.target.value })}
            required
            className="form-input"
            placeholder="https://example.com/video.mp4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="duration">时长（秒）</label>
          <input
            type="number"
            id="duration"
            value={video.duration || 0}
            onChange={(e) => setVideo({ ...video, duration: parseInt(e.target.value) })}
            className="form-input"
            placeholder="视频时长"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">描述</label>
          <textarea
            id="content"
            value={video.content || ''}
            onChange={(e) => setVideo({ ...video, content: e.target.value })}
            rows={6}
            className="form-textarea"
            placeholder="输入视频描述"
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

export default VideoEdit;

