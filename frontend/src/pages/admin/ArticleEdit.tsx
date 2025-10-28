import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faCog, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  ClassicEditor,
  Alignment,
  Autoformat,
  AutoImage,
  AutoLink,
  Autosave,
  BlockQuote,
  Bold,
  Bookmark,
  CloudServices,
  Code,
  CodeBlock,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Fullscreen,
  Heading,
  Highlight,
  HorizontalLine,
  ImageBlock,
  ImageCaption,
  ImageEditing,
  ImageInline,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  ImageUtils,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  MediaEmbed,
  Paragraph,
  PlainTableOutput,
  RemoveFormat,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableLayout,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline
} from 'ckeditor5';

import translations from 'ckeditor5/translations/zh-cn.js';
import 'ckeditor5/ckeditor5.css';
import './css/EditPage.css';

import { fetchArticleById, createArticle, updateArticle, fetchAllCategories, fetchAllTags } from '../../api/apiServices';
import type { Article, Category, Tag } from '../../types/dataTypes';

// 使用GPL许可证（开源项目）
const LICENSE_KEY = 'GPL';

export default function ArticleEdit() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // 状态管理
  const [article, setArticle] = useState<Partial<Article>>({
    title: '',
    content: '',
    status: 'UNPUBLISHED',
    visibility: 'PRIVATE',
    categoryId: undefined,
    tagIds: []
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  const editorRef = useRef<ClassicEditor | null>(null);

  // 初始化布局
  useEffect(() => {
    setIsLayoutReady(true);
    return () => setIsLayoutReady(false);
  }, []);

  // 加载分类和标签
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          fetchAllCategories(),
          fetchAllTags()
        ]);
        // 处理响应数据格式
        const categoryData = Array.isArray(categoriesRes) ? categoriesRes : (categoriesRes?.data || []);
        const tagData = Array.isArray(tagsRes) ? tagsRes : (tagsRes?.data || []);
        
        setCategories(categoryData);
        setTags(tagData);
      } catch (err) {
        console.error('加载选项失败:', err);
      }
    };
    loadOptions();
  }, []);

  // 加载文章数据
  useEffect(() => {
    if (!isEditMode) return;

    const loadArticle = async () => {
      try {
        setLoading(true);
        const data = await fetchArticleById(Number(id));
        setArticle({
          ...data,
          categoryId: data.category?.id,
          tagIds: data.tags?.map((t: Tag) => t.id) || []
        });
      } catch (err: any) {
        setError(err.message || '加载文章失败');
      } finally {
        setLoading(false);
      }
    };
    loadArticle();
  }, [id, isEditMode]);

  // CKEditor配置
  const { editorConfig } = useMemo(() => {
    if (!isLayoutReady) return { editorConfig: {} };

    return {
      editorConfig: {
        toolbar: {
          items: [
            'undo', 'redo', '|',
            'findAndReplace', 'fullscreen', '|',
            'heading', '|',
            'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|',
            'bold', 'italic', 'underline', 'strikethrough',
            'subscript', 'superscript', 'code', 'removeFormat', '|',
            'specialCharacters', 'horizontalLine', 'link', 'bookmark',
            'insertImageViaUrl', 'mediaEmbed', 'insertTable', 'highlight',
            'blockQuote', 'codeBlock', '|',
            'alignment', '|',
            'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
          ],
          shouldNotGroupWhenFull: false
        },
        plugins: [
          Alignment, Autoformat, AutoImage, AutoLink, Autosave, BlockQuote, Bold,
          Bookmark, CloudServices, Code, CodeBlock, Essentials, FindAndReplace,
          FontBackgroundColor, FontColor, FontFamily, FontSize, Fullscreen, Heading,
          Highlight, HorizontalLine, ImageBlock, ImageCaption, ImageEditing, ImageInline,
          ImageInsertViaUrl, ImageResize, ImageStyle, ImageTextAlternative, ImageToolbar,
          ImageUpload, ImageUtils, Indent, IndentBlock, Italic, Link, LinkImage, List,
          ListProperties, MediaEmbed, Paragraph, PlainTableOutput, RemoveFormat,
          SpecialCharacters, SpecialCharactersArrows, SpecialCharactersCurrency,
          SpecialCharactersEssentials, SpecialCharactersLatin, SpecialCharactersMathematical,
          SpecialCharactersText, Strikethrough, Subscript, Superscript, Table, TableCaption,
          TableCellProperties, TableColumnResize, TableLayout, TableProperties, TableToolbar,
          TextTransformation, TodoList, Underline
        ],
        language: 'zh-cn',
        translations: [translations],
        licenseKey: LICENSE_KEY,
        placeholder: '开始撰写文章内容...',
        fontFamily: {
          options: [
            'default', 'Arial', 'Courier New', 'Georgia', 'Lucida Sans Unicode',
            'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana',
            '微软雅黑', '宋体', '黑体', '楷体', '仿宋'
          ],
          supportAllValues: true
        },
        fontSize: {
          options: [10, 12, 14, 'default', 18, 20, 24, 28, 32, 36],
          supportAllValues: true
        },
        heading: {
          options: [
            { model: 'paragraph', title: '正文', class: 'ck-heading_paragraph' },
            { model: 'heading1', view: 'h1', title: '标题 1', class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: '标题 2', class: 'ck-heading_heading2' },
            { model: 'heading3', view: 'h3', title: '标题 3', class: 'ck-heading_heading3' },
            { model: 'heading4', view: 'h4', title: '标题 4', class: 'ck-heading_heading4' },
            { model: 'heading5', view: 'h5', title: '标题 5', class: 'ck-heading_heading5' },
            { model: 'heading6', view: 'h6', title: '标题 6', class: 'ck-heading_heading6' }
          ]
        },
        image: {
          toolbar: [
            'imageStyle:inline', 'imageStyle:block', 'imageStyle:side', '|',
            'toggleImageCaption', 'imageTextAlternative', '|',
            'linkImage'
          ]
        },
        table: {
          contentToolbar: [
            'tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties'
          ]
        },
        list: {
          properties: {
            styles: true,
            startIndex: true,
            reversed: true
          }
        }
      }
    };
  }, [isLayoutReady]);

  // 处理保存
  const handleSave = async () => {
    if (!article.title?.trim()) {
      alert('请输入文章标题');
      return;
    }

    try {
      setIsSaving(true);
      const articleData: any = {
        ...article,
        content: editorRef.current?.getData() || article.content || ''
      };

      if (isEditMode) {
        await updateArticle({ ...articleData, id: Number(id) });
        alert('文章更新成功！');
      } else {
        await createArticle(articleData);
        alert('文章创建成功！');
      }
      navigate('/admin/list/articles');
    } catch (err: any) {
      alert(err.message || '保存失败');
    } finally {
      setIsSaving(false);
    }
  };

  // 标签切换
  const handleTagToggle = (tagId: number) => {
    const currentTags = article.tagIds || [];
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter(id => id !== tagId)
      : [...currentTags, tagId];
    setArticle({ ...article, tagIds: newTags });
  };

  if (loading) {
    return <div className="edit-loading">加载中...</div>;
  }

  return (
    <div className="edit-page-container">
      {/* 主内容区 */}
      <div className="edit-main-content">
        <div className="edit-card">
          <div className="edit-card-header">
            <h1 className="edit-card-title">
              <FontAwesomeIcon icon={faFileAlt} />
              {isEditMode ? '编辑文章' : '新建文章'}
            </h1>
          </div>
          <div className="edit-card-body">
            {error && <div className="edit-error">{error}</div>}
            
            {/* 标题 */}
            <input
              type="text"
              className="edit-input edit-title-input"
              placeholder="输入文章标题..."
              value={article.title || ''}
              onChange={(e) => setArticle({ ...article, title: e.target.value })}
            />

            {/* 内容编辑器 */}
            <div className="edit-content-wrapper">
              <label className="edit-content-label">文章内容</label>
              <div className="edit-content-editor">
                {isLayoutReady && (
                  <CKEditor
                    editor={ClassicEditor}
                    config={editorConfig}
                    data={article.content || ''}
                    onReady={(editor: ClassicEditor) => {
                      editorRef.current = editor;
                    }}
                    onChange={(event, editor: ClassicEditor) => {
                      const data = editor.getData();
                      setArticle({ ...article, content: data });
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 侧边栏设置 */}
      <div className="edit-sidebar">
        {/* 发布设置 */}
        <div className="edit-card">
          <div className="edit-card-header">
            <h3 className="edit-card-title">
              <FontAwesomeIcon icon={faCog} />
              发布设置
            </h3>
          </div>
          <div className="edit-card-body">
            {/* 分类 */}
            <div className="edit-settings-group">
              <label className="edit-form-label required">文章分类</label>
              <select
                className="edit-select"
                value={article.categoryId || ''}
                onChange={(e) => setArticle({ ...article, categoryId: e.target.value ? Number(e.target.value) : undefined })}
              >
                <option value="">请选择分类</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 状态 */}
            <div className="edit-settings-group">
              <label className="edit-form-label">发布状态</label>
              <div className="edit-radio-group">
                <div className="edit-radio-item">
                  <input
                    type="radio"
                    id="status-published"
                    name="status"
                    value="PUBLISHED"
                    checked={article.status === 'PUBLISHED'}
                    onChange={(e) => setArticle({ ...article, status: e.target.value as any })}
                  />
                  <label htmlFor="status-published">已发布</label>
                </div>
                <div className="edit-radio-item">
                  <input
                    type="radio"
                    id="status-draft"
                    name="status"
                    value="UNPUBLISHED"
                    checked={article.status === 'UNPUBLISHED'}
                    onChange={(e) => setArticle({ ...article, status: e.target.value as any })}
                  />
                  <label htmlFor="status-draft">草稿</label>
                </div>
              </div>
            </div>

            {/* 可见性 */}
            <div className="edit-settings-group">
              <label className="edit-form-label">可见性</label>
              <div className="edit-radio-group">
                <div className="edit-radio-item">
                  <input
                    type="radio"
                    id="visibility-public"
                    name="visibility"
                    value="PUBLIC"
                    checked={article.visibility === 'PUBLIC'}
                    onChange={(e) => setArticle({ ...article, visibility: e.target.value as any })}
                  />
                  <label htmlFor="visibility-public">公开</label>
                </div>
                <div className="edit-radio-item">
                  <input
                    type="radio"
                    id="visibility-private"
                    name="visibility"
                    value="PRIVATE"
                    checked={article.visibility === 'PRIVATE'}
                    onChange={(e) => setArticle({ ...article, visibility: e.target.value as any })}
                  />
                  <label htmlFor="visibility-private">私有</label>
                </div>
              </div>
            </div>

            {/* 标签 */}
            <div className="edit-settings-group">
              <label className="edit-form-label">文章标签</label>
              <div className="edit-tags-container">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className={`edit-tag-chip ${(article.tagIds || []).includes(tag.id) ? 'selected' : ''}`}
                    onClick={() => handleTagToggle(tag.id)}
                    style={{ 
                      cursor: 'pointer',
                      opacity: (article.tagIds || []).includes(tag.id) ? 1 : 0.6
                    }}
                  >
                    {tag.name}
                  </div>
                ))}
              </div>
              <p className="edit-hint">点击标签进行选择/取消选择</p>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="edit-actions">
          <button
            className="edit-btn edit-btn-primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            <FontAwesomeIcon icon={faSave} />
            {isSaving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
}
