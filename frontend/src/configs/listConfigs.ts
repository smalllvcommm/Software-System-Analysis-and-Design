// src/configs/listConfigs.ts
import type { ListConfig } from '../types/te/List';
import {
    createArticle,
    deleteArticle,
    updateArticle,
    fetchArticles,

    createSubject,
    deleteSubject,
    updateSubject,
    fetchSubjects,

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



    fetchAllSubjects,
    fetchAllArticles,
    fetchAllTags
} from '../api/index';
import type { 
    Article,
    KnowledgeCard,
    Subject,
    Tag,
    Todo
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
        
        fetchAllSubjects: fetchAllSubjects,
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
            key: 'subjectId',
            type: 'select',
            label: '学科',
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
    actions: [
        {
        key: 'edit',
        label: '编辑',
        isLink: true,
        linkGenerator: (item: Article) => `/admin/list/articles/edit/${item.id}`,
        className: 'edit-btn',
        }
    ],
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

        fetchAllSubjects: fetchAllSubjects,
        fetchAllArticles: fetchAllArticles
    },
    columns: [
        { key: 'title', title: '标题', width: '35%' },
        { key: 'subject', title: '学科', width: '25%' },
        { key: 'difficulty', title: '难度', width: '10%' },
        { key: 'createdTime', title: '创建时间', width: '10%' },
        { key: 'sortOrder', title: '排序号', width: '10%' },
        { key: 'article', title: '文章', width: '10%' }

    ],
    filters: [
        {
            key: 'subjectId',
            type: 'select',
            label: '学科',
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

// 学科列表配置
export const subjectListConfig: ListConfig<Subject> = {
    title: '学科',
    itemIdKey: 'id',
    createLink: '/admin/subjects/edit',
    api: {
        createItem: createSubject,
        deleteItem: deleteSubject,
        updateItem: updateSubject,
        fetchList: fetchSubjects,
    },
    columns: [
        { key: 'name', title: '名称', width: '100%' },
    ],
    filters: [],
    actions: [
        {
            key: 'edit',
            label: '编辑',
            onClick: (item: Subject): void => console.log('编辑分类:', item),
            className: 'edit-btn'
        }
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
        { key: 'name', title: '标签名称', width: '40%' },
        { key: 'color', title: '标签颜色', width: '15%' },
        { key: 'articleCount', title: '使用数量', width: '15%' },
        { key: 'createdTime', title: '创建时间', width: '20%' }
    ],
    filters: [
        {
            key: 'searchText',
            type: 'text',
            label: '搜索',
            placeholder: '输入标签名称搜索'
        }
    ],
    actions: [
        {
            key: 'edit',
            label: '编辑',
            isLink: true,
            linkGenerator: (item: Tag): string => `/admin/tags/edit/${item.id}`,
            className: 'edit-btn'
        }
    ],
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

export const listConfigMap = {
    articles: articleListConfig,
    cards: knowledgeCardListConfig,
    subjects: subjectListConfig,
    tags: tagListConfig,
    todos: todoListConfig
};

export type ListType = keyof typeof listConfigMap;