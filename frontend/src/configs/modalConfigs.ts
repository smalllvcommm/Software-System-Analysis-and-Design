// src/configs/modalConfigs.ts
import type { ModalProps } from '../types/te/Modal';

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
      key: 'subjectId',
      label: '所属学科',
      type: 'select',
      placeholder: '请选择学科',
      required: true,
      options: [], // 动态加载学科列表（由列表页/API填充）
      
      
      apiMethod: 'fetchAllSubjects', // 自定义API方法名
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

// ------------------------------
// 学科模态框配置（subject）
// ------------------------------
export const subjectModalConfig: Partial<ModalProps> = {
  ...baseModalConfig,
  title: '编辑学科',
  size: 'medium',
  fields: [
    {
      key: 'name',
      label: '学科名称',
      type: 'text',
      placeholder: '请输入学科名称（最多50字）',
      required: true,
      width: '100%',
      validation: (value) => {
        if (!value?.trim()) return '学科名称不能为空';
        if (value.length > 50) return '学科名称不能超过50个字符';
        return null;
      },
    },
    {
      key: 'description',
      label: '学科描述',
      type: 'textarea',
      placeholder: '请输入学科描述（可选）',
      width: '100%',
      rows: 4,
    },
  ],
};

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
      key: 'subjectId',
      label: '所属学科',
      type: 'select',
      placeholder: '请选择学科',
      required: true,
      
      
      apiMethod: 'fetchAllSubjects',
      labelKey: 'name',
      valueKey: 'id',
      
      
      options: [], // 动态加载学科列表
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

// 模态框配置映射表（实体类型 -> 配置）
export const ModalConfigMap = {
  articles: articleModalConfig,
  subjects: subjectModalConfig,
  cards: knowledgeCardModalConfig,
  tags: tagModalConfig,
  todos: todoModalConfig,
};