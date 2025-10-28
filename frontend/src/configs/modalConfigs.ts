// src/configs/modalConfigs.ts
import type { ModalProps } from '../types/modalTypes';

// 基础模态框配置模板（公共属性）
const baseModalConfig: Partial<ModalProps> = {
  showConfirm: true,
  showCancel: true,
  showHeader: true,
  showFooter: true,
  backdropClose: true,
  escClose: true,
  animation: 'slide',
  confirmText: '保存',
  cancelText: '取消',
};

// ------------------------------
// 文章模态框配置（article）
// ------------------------------
export const articleModalConfig: Partial<ModalProps> = {
  ...baseModalConfig,
  title: '编辑文章',
  size: 'large',
  fields: [
    {
      key: 'title',
      label: '文章标题',
      type: 'text',
      placeholder: '请输入文章标题（最多100字）',
      required: true,
      width: '100%',
      validation: (value) => {
        if (!value?.trim()) return '标题不能为空';
        if (value.length > 100) return '标题不能超过100个字符';
        return null;
      },
    },
    {
      key: 'categoryId',
      label: '所属分类',
      type: 'select',
      placeholder: '请选择分类',
      required: true,
      options: [], // 动态加载分类列表
      
      
      apiMethod: 'fetchAllCategories', // 自定义API方法名
      labelKey: 'name',
      valueKey: 'id',
      
      width: '50%',
    },
    {
      key: 'visibility',
      label: '可见性',
      type: 'select',
      required: true,
      options: [
        { label: '公开', value: 'PUBLIC' },
        { label: '私有', value: 'PRIVATE' },
      ],
      defaultValue: 'PUBLIC',
      width: '50%',
    },
    {
      key: 'status',
      label: '状态',
      type: 'select',
      required: true,
      options: [
        { label: '已发布', value: 'PUBLISHED' },
        { label: '草稿', value: 'UNPUBLISHED' },
      ],
      defaultValue: 'UNPUBLISHED',
      width: '50%',
    },
    {
      key: 'content',
      label: '文章内容',
      type: 'textarea',
      placeholder: '请输入文章内容（支持Markdown）',
      required: true,
      width: '100%',
      rows: 12,
    },
  ],
};

// 学科模态框配置已移除，使用分类（categoryModalConfig）替代

// ------------------------------
// 知识卡片模态框配置（knowledgeCard）
// ------------------------------
export const knowledgeCardModalConfig: Partial<ModalProps> = {
  ...baseModalConfig,
  title: '编辑知识卡片',
  size: 'large',
  fields: [
    {
      key: 'title',
      label: '卡片标题',
      type: 'text',
      placeholder: '请输入卡片标题',
      required: true,
      width: '100%',
    },
    {
      key: 'categoryId',
      label: '所属分类',
      type: 'select',
      placeholder: '请选择分类',
      required: true,
      
      
      apiMethod: 'fetchAllCategories',
      labelKey: 'name',
      valueKey: 'id',
      
      
      options: [], // 动态加载分类列表
      width: '50%',
    },
    {
      key: 'articleId',
      label: '关联文章',
      type: 'select',
      placeholder: '请选择关联文章（可选）',
      options: [], // 动态加载文章列表

      apiMethod: 'fetchAllArticles', // 对应api.getArticles()
      labelKey: 'title', // 文章的标题字段是`title`
      valueKey: 'id',    // 文章的ID字段是`id`


      
      width: '50%',
    },
    {
      key: 'difficulty',
      label: '难度',
      type: 'select',
      required: true,
      options: [
        { label: '简单', value: 'easy' },
        { label: '中等', value: 'medium' },
        { label: '困难', value: 'hard' },
      ],
      defaultValue: 'medium',
      width: '50%',
    },
    {
      key: 'content',
      label: '卡片内容',
      type: 'textarea',
      placeholder: '请输入知识卡片内容',
      required: true,
      width: '100%',
      rows: 8,
    },
  ],
};

// ------------------------------
// 标签模态框配置（tag）
// ------------------------------
export const tagModalConfig: Partial<ModalProps> = {
  ...baseModalConfig,
  title: '编辑标签',
  size: 'medium',
  fields: [
    {
      key: 'name',
      label: '标签名称',
      type: 'text',
      placeholder: '请输入标签名称（最多20字）',
      required: true,
      width: '100%',
      validation: (value) => {
        if (!value?.trim()) return '标签名称不能为空';
        if (value.length > 20) return '标签名称不能超过20个字符';
        return null;
      },
    },
    {
      key: 'color',
      label: '标签颜色',
      type: 'text',
      placeholder: '请输入颜色代码（如：#ff0000）',
      defaultValue: '#1890ff',
      required: true,
      width: '100%',
      validation: (value) => {
        const colorRegex = /^#([0-9A-F]{3}){1,2}$/i;
        if (!colorRegex.test(value)) return '请输入有效的颜色代码（如：#ff0000）';
        return null;
      },
    },
  ],
};

// ------------------------------
// 待办事项模态框配置（todo）
// ------------------------------
export const todoModalConfig: Partial<ModalProps> = {
  ...baseModalConfig,
  title: '编辑待办事项',
  size: 'medium',
  fields: [
    {
      key: 'title',
      label: '待办标题',
      type: 'text',
      placeholder: '请输入待办标题',
      required: true,
      width: '100%',
    },
    {
      key: 'status',
      label: '状态',
      type: 'select',
      required: true,
      options: [
        { label: '待处理', value: 'pending' },
        { label: '已完成', value: 'completed' },
      ],
      defaultValue: 'pending',
      width: '50%',
    },
    {
      key: 'priority',
      label: '优先级',
      type: 'select',
      required: true,
      options: [
        { label: '低', value: 'low' },
        { label: '中', value: 'medium' },
        { label: '高', value: 'high' },
      ],
      defaultValue: 'medium',
      width: '50%',
    },
    {
      key: 'dueTime',
      label: '截止时间',
      type: 'datetime',
      placeholder: '请选择截止时间',
      width: '100%',
    },
    {
      key: 'description',
      label: '描述',
      type: 'textarea',
      placeholder: '请输入待办描述（可选）',
      width: '100%',
      rows: 4,
    },
  ],
};

// 备忘录模态框配置
export const memoModalConfig: Partial<ModalProps> = {
  ...baseModalConfig,
  title: '编辑备忘录',
  size: 'medium',
  fields: [
    {
      key: 'title',
      label: '标题',
      type: 'text',
      placeholder: '请输入备忘录标题',
      required: true,
      width: '100%',
    },
    {
      key: 'content',
      label: '内容',
      type: 'textarea',
      placeholder: '请输入备忘录内容',
      required: true,
      width: '100%',
      rows: 6,
    },
  ],
};

// 音频模态框配置
export const audioModalConfig: Partial<ModalProps> = {
  ...baseModalConfig,
  title: '编辑音频',
  size: 'medium',
  fields: [
    {
      key: 'title',
      label: '音频标题',
      type: 'text',
      placeholder: '请输入音频标题',
      required: true,
      width: '100%',
    },
    {
      key: 'url',
      label: '音频链接',
      type: 'text',
      placeholder: '请输入音频链接',
      required: true,
      width: '100%',
    },
    {
      key: 'duration',
      label: '时长',
      type: 'text',
      placeholder: '例如: 03:45',
      width: '50%',
    },
    {
      key: 'description',
      label: '描述',
      type: 'textarea',
      placeholder: '请输入音频描述（可选）',
      width: '100%',
      rows: 3,
    },
  ],
};

// 视频模态框配置
export const videoModalConfig: Partial<ModalProps> = {
  ...baseModalConfig,
  title: '编辑视频',
  size: 'medium',
  fields: [
    {
      key: 'title',
      label: '视频标题',
      type: 'text',
      placeholder: '请输入视频标题',
      required: true,
      width: '100%',
    },
    {
      key: 'url',
      label: '视频链接',
      type: 'text',
      placeholder: '请输入视频链接',
      required: true,
      width: '100%',
    },
    {
      key: 'duration',
      label: '时长',
      type: 'text',
      placeholder: '例如: 12:30',
      width: '50%',
    },
    {
      key: 'description',
      label: '描述',
      type: 'textarea',
      placeholder: '请输入视频描述（可选）',
      width: '100%',
      rows: 3,
    },
  ],
};

// 网站收藏模态框配置
export const websiteModalConfig: Partial<ModalProps> = {
  ...baseModalConfig,
  title: '编辑网站收藏',
  size: 'medium',
  fields: [
    {
      key: 'title',
      label: '网站名称',
      type: 'text',
      placeholder: '请输入网站名称',
      required: true,
      width: '100%',
    },
    {
      key: 'url',
      label: '网址',
      type: 'text',
      placeholder: 'https://...',
      required: true,
      width: '100%',
    },
    {
      key: 'category',
      label: '分类',
      type: 'text',
      placeholder: '例如: 工具、学习、娱乐',
      width: '50%',
    },
    {
      key: 'description',
      label: '描述',
      type: 'textarea',
      placeholder: '请输入网站描述（可选）',
      width: '100%',
      rows: 3,
    },
  ],
};

// 支出记录模态框配置
export const expenseModalConfig: Partial<ModalProps> = {
  ...baseModalConfig,
  title: '编辑支出记录',
  size: 'medium',
  fields: [
    {
      key: 'title',
      label: '支出标题',
      type: 'text',
      placeholder: '请输入支出标题',
      required: true,
      width: '100%',
    },
    {
      key: 'amount',
      label: '金额',
      type: 'number',
      placeholder: '请输入金额',
      required: true,
      width: '50%',
    },
    {
      key: 'category',
      label: '类别',
      type: 'text',
      placeholder: '例如: 餐饮、交通、娱乐',
      width: '50%',
    },
    {
      key: 'date',
      label: '日期',
      type: 'date',
      required: true,
      width: '50%',
    },
    {
      key: 'description',
      label: '说明',
      type: 'textarea',
      placeholder: '请输入支出说明（可选）',
      width: '100%',
      rows: 3,
    },
  ],
};

// 旅行计划模态框配置
export const travelPlanModalConfig: Partial<ModalProps> = {
  ...baseModalConfig,
  title: '编辑旅行计划',
  size: 'large',
  fields: [
    {
      key: 'destination',
      label: '目的地',
      type: 'text',
      placeholder: '请输入目的地',
      required: true,
      width: '100%',
    },
    {
      key: 'startDate',
      label: '开始日期',
      type: 'date',
      required: true,
      width: '50%',
    },
    {
      key: 'endDate',
      label: '结束日期',
      type: 'date',
      required: true,
      width: '50%',
    },
    {
      key: 'budget',
      label: '预算',
      type: 'number',
      placeholder: '请输入预算',
      width: '50%',
    },
    {
      key: 'description',
      label: '计划描述',
      type: 'textarea',
      placeholder: '请输入旅行计划详情',
      width: '100%',
      rows: 6,
    },
  ],
};

// 学习打卡模态框配置
export const studyCheckInModalConfig: Partial<ModalProps> = {
  ...baseModalConfig,
  title: '编辑学习打卡',
  size: 'medium',
  fields: [
    {
      key: 'category',
      label: '分类',
      type: 'text',
      placeholder: '请输入分类名称',
      required: true,
      width: '50%',
    },
    {
      key: 'duration',
      label: '时长(分钟)',
      type: 'number',
      placeholder: '请输入学习时长',
      required: true,
      width: '50%',
    },
    {
      key: 'date',
      label: '日期',
      type: 'date',
      required: true,
      width: '50%',
    },
    {
      key: 'content',
      label: '学习内容',
      type: 'textarea',
      placeholder: '请输入学习内容',
      required: true,
      width: '100%',
      rows: 5,
    },
  ],
};

// 分类模态框配置
export const categoryModalConfig: Partial<ModalProps> = {
  ...baseModalConfig,
  title: '编辑分类',
  size: 'medium',
  fields: [
    {
      key: 'name',
      label: '分类名称',
      type: 'text',
      placeholder: '请输入分类名称',
      required: true,
      width: '100%',
    },
    {
      key: 'description',
      label: '描述',
      type: 'textarea',
      placeholder: '请输入分类描述（可选）',
      width: '100%',
      rows: 3,
    },
  ],
};

// 模态框配置映射表（实体类型 -> 配置）
export const ModalConfigMap = {
  articles: articleModalConfig,
  categories: categoryModalConfig,
  cards: knowledgeCardModalConfig,
  tags: tagModalConfig,
  todos: todoModalConfig,
  memos: memoModalConfig,
  audios: audioModalConfig,
  videos: videoModalConfig,
  websites: websiteModalConfig,
  expenses: expenseModalConfig,
  travelPlans: travelPlanModalConfig,
  studyCheckIns: studyCheckInModalConfig,
} as const;