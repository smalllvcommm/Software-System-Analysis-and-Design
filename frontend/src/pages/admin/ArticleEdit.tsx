import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import './css/ArticleEdit.css'; // 确保此路径正确

import { fetchArticleById, createArticle, updateArticle } from '../../api/index';
import type { Article } from '../../types/index';

// 许可证密钥（保持原样）
const LICENSE_KEY =
  'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NTYzMzkxOTksImp0aSI6IjFlNGY3ZjU1LWQ1OTUtNDM0OS1iMWUxLWRmYzQxOGEzY2IzZSIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjgyNDZjZmNjIn0.z2uj-6Ae6vEwAOzeUrd6xnnaWrAA0O5V3NaeNQeeO3l1r9HKmWCAPJmY3_Q0bAlIEkFkjiQJ-Q6Kj6YVhp_yZg';

export default function ArticleEdit() {
  // 路由参数与导航
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const pageTitle = isEditMode ? '编辑文章' : '新增文章';

  // 状态管理
  const [article, setArticle] = useState<Article>({
    id: 0,
    title: '',
    content: '',
    status: 'UNPUBLISHED',
    visibility: 'PRIVATE',
    createdTime: '',
    updatedTime: '',
    views: 0,
    subject: null,
    tags: [],
  });
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState(''); // 存储文章内容
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  // 编辑器引用
  const editorRef = useRef<ClassicEditor | null>(null);

  // 初始化布局状态
  useEffect(() => {
    setIsLayoutReady(true);
    return () => setIsLayoutReady(false);
  }, []);

  // 生成CKEditor配置（复用高级功能配置）
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
        fontFamily: { supportAllValues: true },
        fontSize: { options: [10, 12, 14, 'default', 18, 20, 22], supportAllValues: true },
        fullscreen: {
          onEnterCallback: container =>
            container.classList.add('editor-container', 'editor-container_classic-editor', 'editor-container_include-fullscreen', 'main-container')
        },
        heading: {
          options: [
            { model: 'paragraph', title: '段落', class: 'ck-heading_paragraph' },
            { model: 'heading1', view: 'h1', title: '标题1', class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: '标题2', class: 'ck-heading_heading2' },
            { model: 'heading3', view: 'h3', title: '标题3', class: 'ck-heading_heading3' },
            { model: 'heading4', view: 'h4', title: '标题4', class: 'ck-heading_heading4' },
            { model: 'heading5', view: 'h5', title: '标题5', class: 'ck-heading_heading5' },
            { model: 'heading6', view: 'h6', title: '标题6', class: 'ck-heading_heading6' }
          ]
        },
        image: {
          toolbar: [
            'toggleImageCaption', 'imageTextAlternative', '|',
            'imageStyle:inline', 'imageStyle:wrapText', 'imageStyle:breakText', '|', 'resizeImage'
          ]
        },
        language: 'zh-cn',
        licenseKey: LICENSE_KEY,
        link: {
          addTargetToExternalLinks: true,
          defaultProtocol: 'https://',
          decorators: {
            toggleDownloadable: { mode: 'manual', label: '可下载', attributes: { download: 'file' } }
          }
        },
        list: { properties: { styles: true, startIndex: true, reversed: true } },
        placeholder: '请输入文章内容...',
        table: {
          contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
        },
        translations: [translations]
      }
    };
  }, [isLayoutReady]);

  // 加载文章数据（核心业务逻辑）
  useEffect(() => {
    if (isEditMode && id) {
      setLoading(true);
      fetchArticleById(parseInt(id))
        .then((data) => {
          setArticle(data);
          setContent(data.content || ''); // 将文章内容加载到编辑器
        })
        .catch((err) => {
          setError(err.message || '加载文章失败');
          setTimeout(() => navigate('/admin/list/articles'), 2000);
        })
        .finally(() => setLoading(false));
    }
  }, [isEditMode, id, navigate]);

  // 标题输入处理
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArticle(prev => ({ ...prev, title: e.target.value }));
  };

  // 编辑器内容变化处理
  const handleContentChange = (event: any, editor: ClassicEditor) => {
    setContent(editor.getData()); // 实时同步编辑器内容
  };

  // 保存/发布文章（核心业务逻辑）
  const handleSave = async (isPublish: boolean = false) => {
    if (!article.title.trim()) {
      setError('标题不能为空');
      return;
    }
    if (!content.trim() && !isEditMode) {
      setError('文章内容不能为空');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const saveData = {
        ...article,
        content, // 存储编辑器内容
        status: isPublish ? 'PUBLISHED' : 'UNPUBLISHED',
        visibility: 'PUBLIC',
      };

      if (isEditMode) {
        await updateArticle(saveData);
      } else {
        const { id, ...createData } = saveData;
        await createArticle(createData);
      }

      const successMsg = isPublish 
        ? `${isEditMode ? '更新并发布' : '发布'}成功` 
        : `${isEditMode ? '修改保存' : '草稿保存'}成功`;
      alert(successMsg);
      navigate('/admin/list/articles');
    } catch (err: any) {
      setError(err.message || `${isEditMode ? '更新' : '创建'}失败，请重试`);
    } finally {
      setIsSaving(false);
    }
  };

  // 加载状态显示
  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="article-edit-container">
      <h1 className="page-title">{pageTitle}</h1>

      {/* 标题输入框 */}
      <input
        type="text"
        placeholder="请输入文章标题"
        value={article.title}
        onChange={handleTitleChange}
        className="article-title-input"
      />

      {/* 错误提示 */}
      {error && <div className="error-message">{error}</div>}

      {/* CKEditor 编辑器（绑定文章内容） */}
      <div className="editor-container">
        <CKEditor
          editor={ClassicEditor}
          config={editorConfig}
          data={content} // 绑定文章内容
          onReady={(editor) => {
            editorRef.current = editor;
          }}
          onChange={handleContentChange} // 同步内容变化
        />
      </div>

      {/* 操作按钮 */}
      <div className="action-buttons">
        <button
          onClick={() => handleSave(false)}
          disabled={isSaving}
          className="btn-save"
        >
          {isSaving ? '保存中...' : isEditMode ? '保存修改' : '保存草稿'}
        </button>

        <button
          onClick={() => handleSave(true)}
          disabled={isSaving || !article.title.trim()}
          className="btn-publish"
        >
          {isSaving ? '处理中...' : isEditMode ? '更新并发布' : '发布文章'}
        </button>
      </div>
    </div>
  );
}