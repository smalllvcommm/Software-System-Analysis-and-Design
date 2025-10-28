import { createBrowserRouter, Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

// 路由守卫
import { AuthGuard } from './AuthGuard';
// 布局组件
import RootLayout from '../layouts/RootLayout.tsx';
import PublicLayout from '../layouts/PublicLayout.tsx';
import AdminLayout from '../layouts/AdminLayout.tsx';

// 公共页面
import Home from '../pages/LandingPage/Home.tsx';
import Login from '../pages/Auth/Login.tsx';
import Register from '../pages/Auth/Register.tsx';
import Profile from '../pages/User/Profile.tsx';
import Workspace from '../pages/User/Workspace.tsx';
import TodoList from '../pages/User/TodoList.tsx';
import DiaryList from '../pages/User/DiaryList.tsx';
import Nomatch from '../pages/Common/Nomatch.tsx';

// 文章相关页面
import ArticleList from '../pages/Articles/ArticleList.tsx';
import ArticleDetail from '../pages/Articles/ArticleDetail.tsx';

// 后台部分组件
import Dashboard from '../pages/admin/Dashboard.tsx';
import ListPage from '../pages/admin/ListPage';
import ArticleEdit from '../pages/admin/ArticleEdit.tsx';
import MemoEdit from '../pages/admin/MemoEdit.tsx';
import AudioEdit from '../pages/admin/AudioEdit.tsx';
import VideoEdit from '../pages/admin/VideoEdit.tsx';
import WebsiteEdit from '../pages/admin/WebsiteEdit.tsx';
import ExpenseEdit from '../pages/admin/ExpenseEdit.tsx';
import TravelPlanEdit from '../pages/admin/TravelPlanEdit.tsx';
import StudyCheckInEdit from '../pages/admin/StudyCheckInEdit.tsx';
import CategoryEdit from '../pages/admin/CategoryEdit.tsx';
import TagEdit from '../pages/admin/TagEdit.tsx';
import DiaryEdit from '../pages/admin/DiaryEdit.tsx';

// 公共路由
const publicRoutes: RouteObject = {
  path: '/',
  element: <PublicLayout />,
  children: [
    { index: true, element: <Home /> },
    { path: 'login', element: <Login /> },
    { path: 'register', element: <Register /> },
    { path: 'workspace', element: <Workspace /> },
    { path: 'profile', element: <Profile /> },
    { path: 'articles', element: <ArticleList /> },
    { path: 'articles/:id', element: <ArticleDetail /> },
    { path: 'todoList', element: <TodoList /> },
    { path: 'diaryList', element: <DiaryList /> },
    { path: '*', element: <Nomatch /> }
  ]
};

// 后台路由
const adminRoutes: RouteObject = {
  path: '/admin',
  element: <AuthGuard requiredRole="ADMIN"><AdminLayout /></AuthGuard>,
  children: [
    { index: true, element: <Dashboard /> },
    { path: 'dashboard', element: <Dashboard /> },
    
    // 资源管理列表页
    { path: 'list/:type', element: <ListPage /> },
    
    // 各实体的编辑页面
    { path: 'list/articles/edit/:id?', element: <ArticleEdit /> },
    { path: 'list/memos/edit/:id?', element: <MemoEdit /> },
    { path: 'list/audios/edit/:id?', element: <AudioEdit /> },
    { path: 'list/videos/edit/:id?', element: <VideoEdit /> },
    { path: 'list/websites/edit/:id?', element: <WebsiteEdit /> },
    { path: 'list/expenses/edit/:id?', element: <ExpenseEdit /> },
    { path: 'list/travel-plans/edit/:id?', element: <TravelPlanEdit /> },
    { path: 'list/study-checkins/edit/:id?', element: <StudyCheckInEdit /> },
    { path: 'list/categories/edit/:id?', element: <CategoryEdit /> },
    { path: 'list/tags/edit/:id?', element: <TagEdit /> },
    { path: 'list/diaries/edit/:id?', element: <DiaryEdit /> },
  ]
};

// 合并路由（按优先级排序）
const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      publicRoutes,
      adminRoutes
    ]
  }
];

// 创建路由实例
export const router = createBrowserRouter( routes );