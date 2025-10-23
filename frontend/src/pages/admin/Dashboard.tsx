// src/pages/admin/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faNewspaper, faEye, faComment } from '@fortawesome/free-solid-svg-icons';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './css/Dashboard.css';

// 注册 Chart.js 组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    userCount: 0,
    articleCount: 0,
    viewCount: 0,
    commentCount: 0,
  });
  
  const [chartData, setChartData] = useState({
    labels: ['一月', '二月', '三月', '四月', '五月', '六月'],
    datasets: [{
      label: '文章发布量',
      data: [12, 19, 14, 22, 25, 30],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
    }]
  });

  // 模拟数据加载
  useEffect(() => {
    // 实际项目中这里会调用后端 API 获取数据
    setTimeout(() => {
      setStats({
        userCount: 3542,
        articleCount: 128,
        viewCount: 125468,
        commentCount: 2456,
      });
    }, 500);
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">数据总览</h1>
      
      {/* 数据统计卡片 */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="card-icon">
            <FontAwesomeIcon icon={faUsers} size="2x" color="#3b82f6" />
          </div>
          <div className="card-content">
            <h3 className="stat-title">总用户数</h3>
            <p className="stat-value">{stats.userCount.toLocaleString()}</p>
            <p className="stat-change positive">
              <FontAwesomeIcon icon="fa-arrow-up" /> 8.2% <span className="text-sm">较上月</span>
            </p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="card-icon">
            <FontAwesomeIcon icon={faNewspaper} size="2x" color="#10b981" />
          </div>
          <div className="card-content">
            <h3 className="stat-title">文章总数</h3>
            <p className="stat-value">{stats.articleCount.toLocaleString()}</p>
            <p className="stat-change positive">
              <FontAwesomeIcon icon="fa-arrow-up" /> 12.5% <span className="text-sm">较上月</span>
            </p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="card-icon">
            <FontAwesomeIcon icon={faEye} size="2x" color="#f59e0b" />
          </div>
          <div className="card-content">
            <h3 className="stat-title">总访问量</h3>
            <p className="stat-value">{stats.viewCount.toLocaleString()}</p>
            <p className="stat-change negative">
              <FontAwesomeIcon icon="fa-arrow-down" /> 3.1% <span className="text-sm">较上月</span>
            </p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="card-icon">
            <FontAwesomeIcon icon={faComment} size="2x" color="#8b5cf6" />
          </div>
          <div className="card-content">
            <h3 className="stat-title">评论总数</h3>
            <p className="stat-value">{stats.commentCount.toLocaleString()}</p>
            <p className="stat-change positive">
              <FontAwesomeIcon icon="fa-arrow-up" /> 15.8% <span className="text-sm">较上月</span>
            </p>
          </div>
        </div>
      </div>
      
      {/* 数据图表 */}
      <div className="chart-container">
        <div className="chart-header">
          <h2 className="chart-title">文章发布趋势</h2>
          <div className="chart-controls">
            <select className="chart-filter">
              <option value="month">按月</option>
              <option value="week">按周</option>
              <option value="day">按日</option>
            </select>
          </div>
        </div>
        
        <div className="chart-content">
          <Bar 
            data={chartData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }}
          />
        </div>
      </div>
      
      {/* 最近活动 */}
      <div className="activity-container">
        <h2 className="activity-title">最近活动</h2>
        <div className="activity-list">
          {/* 模拟活动数据 */}
          <div className="activity-item">
            <div className="activity-icon bg-blue-100">
              <FontAwesomeIcon icon="fa-user-plus" color="#3b82f6" />
            </div>
            <div className="activity-content">
              <p className="activity-text">
                <span className="font-medium">新用户注册</span>: 张三
              </p>
              <p className="activity-time">5分钟前</p>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon bg-green-100">
              <FontAwesomeIcon icon="fa-file-plus" color="#10b981" />
            </div>
            <div className="activity-content">
              <p className="activity-text">
                <span className="font-medium">新文章发布</span>: 《考研英语备考攻略》
              </p>
              <p className="activity-time">30分钟前</p>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon bg-purple-100">
              <FontAwesomeIcon icon="fa-comment" color="#8b5cf6" />
            </div>
            <div className="activity-content">
              <p className="activity-text">
                <span className="font-medium">新评论</span>: 李四 评论了 《考研政治重点》
              </p>
              <p className="activity-time">2小时前</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}