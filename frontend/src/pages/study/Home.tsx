import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.tsx';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './css/Home.css';

// 学科进度接口
interface SubjectProgress {
  id: string;
  name: string;
  icon: string;
  progress: number; // 百分比 0-100
  completed: number; // 已完成卡片数
  total: number; // 总卡片数
  color: string; // 进度条颜色
  lastStudy: string; // 最近学习时间
}

// 学习统计接口
interface StudyStats {
  totalCards: number;
  completedCards: number;
  dailyGoal: number;
  todayCompleted: number;
  streakDays: number; // 连续学习天数
}

// 最近学习记录接口
interface RecentStudy {
  id: string;
  date: string;
  subject: string;
  content: string;
  progress: number; // 本次学习完成的进度
  link: string;
}

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  
  // 如果未登录，重定向到登录页
  if (!isAuthenticated) {
    return (
      <div className="auth-required">
        <div className="auth-message">
          <p>请先登录查看学习进度</p>
          <Link to="/login?redirect=/study/progress" className="btn primary-btn">
            立即登录
          </Link>
        </div>
      </div>
    );
  }

  // 模拟学习统计数据
  const studyStats: StudyStats = {
    totalCards: 142,
    completedCards: 68,
    dailyGoal: 5,
    todayCompleted: 3,
    streakDays: 12
  };

  // 模拟学科进度数据 (按完成度排序)
  const subjectProgress: SubjectProgress[] = [
    {
      id: 'react',
      name: 'React',
      icon: '⚛️',  
      progress: 75,
      completed: 27,
      total: 36,
      color: '#61dafb',
      lastStudy: '今天 14:30'  
    },
    {
      id: 'math',
      name: '高等数学',
      icon: '🧮',
      progress: 62,
      completed: 18,
      total: 29,
      color: '#ff6b7a',
      lastStudy: '昨天 09:17'
    },  
    {
      id: 'typescript',
      name: 'TypeScript',
      icon: '🔤',  
      progress: 45,
      completed: 12,
      total: 27,
      color: '#3178c6',
      lastStudy: '20分钟前'
    },
    {
      id: 'english',
      name: '考研英语',  
      icon: '📝',
      progress: 30,
      completed: 9,
      total: 30,
      color: '#4caf50',
      lastStudy: '3天前'
    }  
];
  
  // 模拟最近学习记录  
  const recentStudies: RecentStudy[] = [
    {
      id: '1',
      date: '今天',
      subject: 'TypeScript',
      content: '泛型约束与类型推论',
      progress: 4,
      link: '/study/cards/typescript-generics'
    },  
    {
      id: '2',
      date: '今天',
      subject: 'React',
      content: 'Hooks生命周期详解',
      progress : 7,
      link: '/study/articles/react-hooks-lifecycle'
    },
    {
      id: '3',
      date: '昨天',
      subject: '高等数学',
      content: '多重积分计算技巧',
      progress: 5,
      link: '/study/cards/calculus-multiple-integral'
    },
    {
      id: '4',
      date: '昨天',
      subject: 'React',
      content: 'Context API状态管理',
      progress : 6,  
      link: '/study/cards/react-context'
    }
];

  // 计算总进度百分比
  const overallProgress = Math.round((studyStats.completedCards / studyStats.totalCards) * 100) || 0;

  return (
    <div className="study-progress-container">
      {/* 页面头部 */}
      <div className="progress-header">
        <h1 className="page-title">学习进度</h1>
        <div className="user-greeting">
          <span>👋 你好，{user?.username || '学习者'}</span>
          <p className="streak-info">
            <i className="fa fa-fire text-orange-500"></i> 
            当前连续学习: <strong>{studyStats.streakDays}</strong> 天
          </p>
        </div>
      </div>

      {/* 进度概览 */}
      <section className="progress-overview">
        <div className="overview-card total-progress">
          <h2 className="section-title">总体进度</h2>
          <div className="progress-circle-container">
            <CircularProgressbar
              value={overallProgress}
              text={`${overallProgress}%`}
              strokeWidth={12}
              styles={buildStyles({
                textSize: 'large',  
                pathColor: '#1E88E5',
                textColor: '#333',
                trailColor:'#f0f',
                backgroundColor: '#fff'  
              })}
            />
          </div>
          <div className="progress-stats">
            <div className="stat-item">
              <span className="stat-label">总卡片数</span>
              <span className="stat-value">{studyStats.totalCards}</span></div>
            <div className="stat-item">
              <span className="stat-label">已完成</span>
              <span className="stat-value">{studyStats.completedCards}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">剩余</span>
              <span className="stat-value">{studyStats.totalCards - studyStats.completedCards}</span>
            </div>
          </div>
        </div>

        <div className="overview-card daily-goal">
          <h2 className="section-title">今日目标</h2>
          <div className="goal-progress">
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                // 修复了这里的错误，将 hundred 改为 100
                style={{ width:`${Math.min((studyStats.todayCompleted / studyStats.dailyGoal) * 100, 100)}%` }}
              ></div></div><div className="goal-text">已完成 {studyStats.todayCompleted}/{studyStats.dailyGoal}个知识点</div></div>
          <div className="goal-tips">
            <p>💡 <strong>今日推荐:</strong></p><p><Link to="/study/subjects/typescript">TypeScript高级类型</Link> 和 <Link to="/study/cards/math-limit">极限证明方法</Link></p></div></div></section>{/* 学科进度列表 */}<section className="subjects-progress">
        <div className="section-header">  
          <h2 className="section-title">学科进度</h2>
          <Link to="/study/subjects" className="view-all-link">查看全部学科 →</Link>  
        </div>
        <div className="subjects-grid">
          {/* 学科进度卡片 */}
          {subjectProgress.map(subject => (
            <div key={subject.id} className="subject-progress-card">  
              <div className="subject-header">  
                <span className="subject-icon">{subject.icon}</span><h3 className="subject-name">{subject.name}</h3>
                <span className="subject-progress-text">{subject.progress}%</span>  
              </div>
              {/* 线性进度条 */}<div className="linear-progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width:`${subject.progress}%`,
                    backgroundColor: subject.color
                  }}
                ></div>
              </div>
              <div className="subject-stats">
                <span className="completed-count">{subject.completed}/{subject.total}</span><span className="last-study">{subject.lastStudy}</span>
              </div>
              <Link 
                to={`/study/subjects/${subject.id}`}
                className="subject-detail-link">查看详情 →</Link></div>
          ))}
        </div>
      </section> {/* 最近学习记录 */}<section className="recent-studies">  
        <div className="section-header">
          <h2 className="section-title">最近学习</h2>
          <Link to="/study/history" className="view-all-link">查看学习历史 →</Link>
        </div>
        <div className="recent-studies-list">
          {recentStudies.map(study => (
            <div key={study.id} className="recent-study-item">
              <div className="study-info">
                <span className="study-date">{study.date}</span><span className="study-subject">{study.subject}</span>
              </div>  
              <Link to={study.link} className="study-content">{study.content}</Link>
              <div className="study-progress-indicator">
                <span className="progress-badge">+{study.progress}%</span>
              </div></div>
          ))}</div></section>{/* 学习建议 */}<section className="study-suggestions">
        <h2 className="section-title">学习建议</h2>
        <div className="suggestions-grid">  
          <div className="suggestion-card">
            <div className="suggestion-icon">🔄</div><h3 className="suggestion-title">复习提醒</h3>
            <p>React Hooks章节已学习7天，建议复习巩固记忆</p>
            <Link to="/study/review?subject=react" className="suggestion-action">开始复习 →</Link>
          </div>
          <div className="suggestion-card">  
            <div className="suggestion-icon">📈</div><h3 className="suggestion-title">薄弱环节</h3>
            <p>高等数学多重积分正确率仅65%，需加强练习</p>
            <Link to="/study/exercises/math-integral" className="suggestion-action">专项练习 →</Link>
          </div>
          <div className="suggestion-card">  
            <div className="suggestion-icon">🎯</div><h3 className="suggestion-title">学习计划</h3>
            <p>距离考研还有12０天，建议每天增加英语词汇学习</p>
            <Link to="/study/plans/english-vocab" className="suggestion-action">查看计划 →</Link>
          </div></div></section></div>
  );
};

export default Home;
