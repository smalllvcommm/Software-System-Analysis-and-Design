// src/configs/listConfigs.ts
import type { ListConfig } from '../types/te/List';
import {
    createArticle,
    deleteArticle,
    updateArticle,
    fetchArticles,

    createCategory,
    deleteCategory,
    updateCategory,
    fetchCategories,

    createKnowledgeCard,
    deleteKnowledgeCard,
    updateKnowledgeCard,
    fetchKnowledgeCards,

    createTag,
    deleteTag,
    updateTag,
    fetchTags,

    createTodo,
    deleteTodo,
    updateTodo,
    fetchTodos,

    createMemo,
    deleteMemo,
    updateMemo,
    fetchMemos,

    createStudyCheckIn,
    deleteStudyCheckIn,
    updateStudyCheckIn,
    fetchStudyCheckIns,

    createAudio,
    deleteAudio,
    updateAudio,
    fetchAudios,

    createWebsite,
    deleteWebsite,
    updateWebsite,
    fetchWebsites,

    createExpense,
    deleteExpense,
    updateExpense,
    fetchExpenses,

    createTravelPlan,
    deleteTravelPlan,
    updateTravelPlan,
    fetchTravelPlans,

    createVideo,
    deleteVideo,
    updateVideo,
    fetchVideos,

    fetchAllCategories,
    fetchAllArticles,
    fetchAllTags
} from '../api/index';
import type { 
    Article,
    KnowledgeCard,
    Category,
    Tag,
    Todo,
    Memo,
    StudyCheckIn,
    Audio,
    Website,
    Expense,
    TravelPlan,
    Video
} from '../types/index';

// 文章列表配置
export const articleListConfig: ListConfig<Article> = {
    title: '文章',
    itemIdKey: 'id',
    createLink: '/admin/articles/edit',
    api: {
        createItem: createArticle,
        deleteItem: deleteArticle,
        updateItem: updateArticle,
        fetchList: fetchArticles,
        
        fetchAllCategories: fetchAllCategories,
        fetchAllTags: fetchAllTags,

    },
    columns: [
        { key: 'title', title: '标题', width: '40%' },
        { key: 'status', title: '状态', width: '10%' },
        { key: 'visibility', title: '可见性', width: '10%' },

        // { key: 'createdTime', title: '创建时间', width: '10%' },
        // { key: 'updatedTime', title: '更新时间', width: '10%' },
    ],
    filters: [
        {
            key: 'status',
            type: 'select',
            label: '状态',
            defaultValue: 'all',
            options: [
                { value: 'PUBLISHED', label: '已发布' },
                { value: 'UNPUBLISHED', label: '草稿' }
            ]
        },
        {
            key: 'visibility',
            type: 'select',
            label: '可见性',
            defaultValue: 'all',
            options: [
                { value: 'PUBLIC', label: '公开' },
                { value: 'PRIVATE', label: '私有' }
            ]
        },
        {
            key: 'categoryId',
            type: 'select',
            label: '分类',
            defaultValue: 0,
            options: []
        },
        {
            key: 'tagId',
            type: 'select',
            label: '标签',
            defaultValue: 0,
            options: []
        },
        {
            key: 'sortBy',
            type: 'select',
            label: '排序',
            defaultValue: 'createdTime-desc',
            options: [
                { value: 'createdTime-desc', label: '最新发布' },
                { value: 'createdTime-asc', label: '最早发布' },
                { value: 'views-desc', label: '最多浏览' },
            ]
        }
    ],
    actions: [], // 编辑功能已整合到标题链接中
    type: 'article'
};

// 知识卡片列表配置
export const knowledgeCardListConfig: ListConfig<KnowledgeCard> = {
    title: '知识卡片',
    itemIdKey: 'id',
    createLink: '/admin/cards/edit',
    api: { 
        createItem: createKnowledgeCard,
        deleteItem: deleteKnowledgeCard,
        updateItem: updateKnowledgeCard,
        fetchList: fetchKnowledgeCards,

        fetchAllCategories: fetchAllCategories,
        fetchAllArticles: fetchAllArticles
    },
    columns: [
        { key: 'title', title: '标题', width: '40%' },
        { key: 'category', title: '分类', width: '20%' },
        { key: 'difficulty', title: '难度', width: '10%' },
        { key: 'createdTime', title: '创建时间', width: '15%' },
        { key: 'sortOrder', title: '排序号', width: '15%' }
    ],
    filters: [
        {
            key: 'categoryId',
            type: 'select',
            label: '分类',
            defaultValue: 0,
            options: []
        },
        {
            key: 'articleId',
            type: 'select',
            label: '文章',
            defaultValue: 0,
            options: []
        },
        {
            key: 'difficulty',
            type: 'select',
            label: '难度',
            defaultValue: 'all',
            options: [
                { value: 'all', label: '全部' },
                { value: 'easy', label: '简单' },
                { value: 'medium', label: '中等' },
                { value: 'hard', label: '困难' }
            ]
        }
    ],
    actions: [
    ],
    type: 'other'
};


// 标签列表配置
export const tagListConfig: ListConfig<Tag> = {
    title: '标签',
    itemIdKey: 'id',
    createLink: '/admin/tags/edit',
    api: {
        createItem: createTag,
        deleteItem: deleteTag,
        updateItem: updateTag,
        fetchList: fetchTags,
    },
    columns: [
        { key: 'id', title: 'ID', width: '10%' },
        { key: 'name', title: '标签名称', width: '30%' },
        { key: 'color', title: '标签颜色', width: '20%' },
        { key: 'createdTime', title: '创建时间', width: '40%' }
    ],
    filters: [],
    actions: [],
    type: 'other'
};

// 待办列表配置
export const todoListConfig: ListConfig<Todo> = {
    title: '待办',
    itemIdKey: 'id',
    createLink: '/admin/todos/add',
    api: {
        createItem: createTodo,
        deleteItem: deleteTodo,
        updateItem: updateTodo,
        fetchList: fetchTodos
    },
    columns: [
        { 
            key: 'title', 
            title: '待办标题', 
            width: '35%' 
        },
        { 
            key: 'status', 
            title: '状态', 
            width: '15%',
        },
        { key: 'priority', title: '优先级', width: '15%' },
        { key: 'dueTime', title: '截止时间', width: '20%' },
        { key: 'createdTime', title: '创建时间', width: '15%' }
    ],
    filters: [
        {
            key: 'status',
            type: 'select',
            label: '状态',
            defaultValue: 0,
            options: [
                { value: 0 , label: '待处理' },
                { value: 1 , label: '已完成' }
            ]
        },
        {
            key: 'priority',
            type: 'select',
            label: '优先级',
            defaultValue: 'all',
            options: [
                { value: 'all', label: '全部' },
                { value: 'low', label: '低' },
                { value: 'medium', label: '中' },
                { value: 'high', label: '高' }
            ]
        }
    ],
    actions: [
        {
            key: 'status',
            label: '状态',
            onClick: (item: Todo) => updateTodo(item),
            className: 'success-btn',
            disabled: (item: Todo) => item.status === true
        },
        {
            key: 'edit',
            label: '编辑',
            isLink: true,
            linkGenerator: (item: Todo): string => `/admin/todos/edit/${item.id}`,
            className: 'edit-btn'
        }
    ],
    type: 'other'
};

// 备忘录列表配置
export const memoListConfig: ListConfig<Memo> = {
    title: '备忘录',
    itemIdKey: 'id',
    createLink: '/admin/list/memos/edit',
    api: {
        createItem: createMemo,
        deleteItem: deleteMemo,
        updateItem: updateMemo,
        fetchList: fetchMemos,
    },
    columns: [
        { key: 'title', title: '标题', width: '40%' },
        { key: 'content', title: '内容', width: '40%' },
        { key: 'createdTime', title: '创建时间', width: '20%' }
    ],
    filters: [],
    actions: [],
    type: 'other'
};

// 音频列表配置
export const audioListConfig: ListConfig<Audio> = {
    title: '音频',
    itemIdKey: 'id',
    createLink: '/admin/list/audios/edit',
    api: {
        createItem: createAudio,
        deleteItem: deleteAudio,
        updateItem: updateAudio,
        fetchList: fetchAudios,
    },
    columns: [
        { key: 'title', title: '标题', width: '30%' },
        { key: 'url', title: '音频链接', width: '40%' },
        { key: 'duration', title: '时长', width: '15%' },
        { key: 'createdTime', title: '创建时间', width: '15%' }
    ],
    filters: [],
    actions: [],
    type: 'other'
};

// 视频列表配置
export const videoListConfig: ListConfig<Video> = {
    title: '视频',
    itemIdKey: 'id',
    createLink: '/admin/list/videos/edit',
    api: {
        createItem: createVideo,
        deleteItem: deleteVideo,
        updateItem: updateVideo,
        fetchList: fetchVideos,
    },
    columns: [
        { key: 'title', title: '标题', width: '30%' },
        { key: 'url', title: '视频链接', width: '40%' },
        { key: 'duration', title: '时长', width: '15%' },
        { key: 'createdTime', title: '创建时间', width: '15%' }
    ],
    filters: [],
    actions: [],
    type: 'other'
};

// 网站收藏列表配置
export const websiteListConfig: ListConfig<Website> = {
    title: '网站收藏',
    itemIdKey: 'id',
    createLink: '/admin/list/websites/edit',
    api: {
        createItem: createWebsite,
        deleteItem: deleteWebsite,
        updateItem: updateWebsite,
        fetchList: fetchWebsites,
    },
    columns: [
        { key: 'title', title: '网站名称', width: '25%' },
        { key: 'url', title: '网址', width: '40%' },
        { key: 'description', title: '描述', width: '20%' },
        { key: 'createdTime', title: '创建时间', width: '15%' }
    ],
    filters: [],
    actions: [],
    type: 'other'
};

// 支出记录列表配置
export const expenseListConfig: ListConfig<Expense> = {
    title: '支出记录',
    itemIdKey: 'id',
    createLink: '/admin/list/expenses/edit',
    api: {
        createItem: createExpense,
        deleteItem: deleteExpense,
        updateItem: updateExpense,
        fetchList: fetchExpenses,
    },
    columns: [
        { key: 'title', title: '标题', width: '25%' },
        { key: 'amount', title: '金额', width: '15%' },
        { key: 'category', title: '类别', width: '15%' },
        { key: 'date', title: '日期', width: '20%' },
        { key: 'description', title: '说明', width: '25%' }
    ],
    filters: [],
    actions: [],
    type: 'other'
};

// 旅行计划列表配置
export const travelPlanListConfig: ListConfig<TravelPlan> = {
    title: '旅行计划',
    itemIdKey: 'id',
    createLink: '/admin/list/travelPlans/edit',
    api: {
        createItem: createTravelPlan,
        deleteItem: deleteTravelPlan,
        updateItem: updateTravelPlan,
        fetchList: fetchTravelPlans,
    },
    columns: [
        { key: 'destination', title: '目的地', width: '20%' },
        { key: 'startDate', title: '开始日期', width: '15%' },
        { key: 'endDate', title: '结束日期', width: '15%' },
        { key: 'budget', title: '预算', width: '15%' },
        { key: 'description', title: '描述', width: '35%' }
    ],
    filters: [],
    actions: [],
    type: 'other'
};

// 学习打卡列表配置
export const studyCheckInListConfig: ListConfig<StudyCheckIn> = {
    title: '学习打卡',
    itemIdKey: 'id',
    createLink: '/admin/list/studyCheckIns/edit',
    api: {
        createItem: createStudyCheckIn,
        deleteItem: deleteStudyCheckIn,
        updateItem: updateStudyCheckIn,
        fetchList: fetchStudyCheckIns,
    },
    columns: [
        { key: 'category', title: '分类', width: '20%' },
        { key: 'duration', title: '时长(分钟)', width: '15%' },
        { key: 'content', title: '学习内容', width: '40%' },
        { key: 'checkInDate', title: '日期', width: '25%' }
    ],
    filters: [],
    actions: [],
    type: 'other'
};

// 分类列表配置
export const categoryListConfig: ListConfig<Category> = {
    title: '分类',
    itemIdKey: 'id',
    createLink: '/admin/list/categories/edit',
    api: {
        createItem: createCategory,
        deleteItem: deleteCategory,
        updateItem: updateCategory,
        fetchList: fetchCategories,
    },
    columns: [
        { key: 'id', title: 'ID', width: '10%' },
        { key: 'name', title: '名称', width: '30%' },
        { key: 'description', title: '描述', width: '60%' }
    ],
    filters: [],
    actions: [],
    type: 'other'
};

export const listConfigMap = {
    articles: articleListConfig,
    cards: knowledgeCardListConfig,
    categories: categoryListConfig,
    tags: tagListConfig,
    todos: todoListConfig,
    memos: memoListConfig,
    audios: audioListConfig,
    videos: videoListConfig,
    websites: websiteListConfig,
    expenses: expenseListConfig,
    travelPlans: travelPlanListConfig,
    studyCheckIns: studyCheckInListConfig
};

export type ListType = keyof typeof listConfigMap;