import { createBrowserRouter, Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

// 路由守卫
import { AuthGuard } from './AuthGuard';
// 布局组件
import RootLayout from '../layouts/RootLayout.tsx';
import PublicLayout from '../layouts/PublicLayout.tsx';
import StudyLayout from '../layouts/StudyLayout.tsx';
import AdminLayout from '../layouts/AdminLayout.tsx';

// 公共页面
import Home from '../pages/public/Home.tsx';
import About from '../pages/public/About.tsx';
import Login from '../pages/public/Login.tsx';
import Nomatch from '../pages/public/Nomatch.tsx';

// 学习部分组件
import StudyHome from '../pages/study/Home.tsx';
// import SubjectList from '../pages/study/SubjectList.tsx';
// import SubjectDetail from '../pages/study/SubjectDetail.tsx';
// import CardList from '../pages/study/CardList.tsx';
// import CardDetail from '../pages/study/CardDetail.tsx';

// import SubjectCardList from '../pages/study/SubjectCardList.tsx';
import ArticleList from '../pages/study/ArticleList.tsx';
import ArticleDetail from '../pages/study/ArticleDetail.tsx';
// import CardRelatedArticle from '../pages/study/CardRelatedArticle.tsx';
// import RecentStudy from '../pages/study/RecentStudy.tsx';
// import FavoritesCollection from '../pages/study/FavoritesCollection.tsx';

// 后台部分组件
import Dashboard from '../pages/admin/Dashboard.tsx';
import ListPage from '../pages/admin/ListPage';
import AriticleEdit from '../pages/admin/ArticleEdit.tsx';
// import GenericDetail from '../pages/admin/GenericDetail.tsx';
// import UserProfile from '../pages/admin/UserProfile.tsx';
// import Settings from '../pages/admin/Settings.tsx';

// 公共路由
const publicRoutes: RouteObject = {
  path: '/',
  element: <PublicLayout />,
  children: [
    { index: true, element: <Home /> },
    { path: 'login', element: <Login /> },
    { path: 'about', element: <About /> },
    { path: '*', element: <Nomatch /> },
    { path: 'articles/:id', element: <ArticleDetail /> }
  ]
};

// 学习路由
const studyRoutes: RouteObject = {
  path: '/study',
  element: <StudyLayout />,
  children: [
    // 学习中心首页
    { index: true, element: <StudyHome /> },
    
    // // 学科体系路由
    // { path: 'subjects', element: <SubjectList /> },
    // { path: 'subjects/:id', element: <SubjectDetail /> },
    // { path: 'subjects/:subjectId/cards', element: <SubjectCardList /> },
    
    // // 知识卡片路由
    // { path: 'cards', element: <CardList /> },
    // { path: 'cards/:id', element: <CardDetail /> },
    // { path: 'cards/:cardId/article', element: <CardRelatedArticle /> },
    
    // // 文章内容路由
    { path: 'articles', element: <ArticleList /> },

    
    // // 辅助浏览功能
    // { path: 'recent', element: <RecentStudy /> },
    // { path: 'favorites', element: <FavoritesCollection /> },
    
    // 学习区域重定向
  ]
};

// 后台路由
const adminRoutes: RouteObject = {
  path: '/admin',
  element: <AuthGuard requiredRole="admin"><AdminLayout /></AuthGuard>,
  children: [
    { path: 'dashboard', element: <Dashboard /> },
    
    // 资源管理列表页
    { path: 'list/:type', element: <ListPage /> },
    // { path: 'list/articles/edit/:id?', element: <AriticleEdit /> },
    { path: 'list/articles/edit/:id?', element: <AriticleEdit /> },

    // // 系统管理
    // { path: 'profile', element: <UserProfile /> },
    // { path: 'settings', element: <Settings /> },
    
    // 后台重定向
    // { path: '*/*', element: <Navigate to="/admin" replace /> }
  ]
};

// 合并路由（按优先级排序）
const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      publicRoutes,
      studyRoutes,
      adminRoutes
    ]
  }
];

// 创建路由实例
export const router = createBrowserRouter( routes );