// src/components/Modal.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useOutsideClick } from '../hooks/useOutsideClick'; // 封装点击外部关闭逻辑
import './css/Modal.css';

// 引入类型定义
import type { ModalProps, ModalButton } from '../types/te/Modal';
import type { FormField } from '../types/te/Modal';

export default function Modal({
  isOpen,
  onClose,
  title,
  fields = [],
  formValues: initialFormValues = {},
  onConfirm,
  isLoading = false,
  showConfirm = true,
  showCancel = true,
  size = 'medium',
  animation = 'slide',
  validateForm,
  className = '',
  showHeader = true,
  showFooter = true,
  backdropClose = true,
  escClose = true,
}: ModalProps) {
  // 状态管理
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // 初始化表单值
  useEffect(() => {
    if (isOpen) {
      // 合并默认值和初始值，优先使用初始值
      const values: Record<string, any> = { ...initialFormValues };
      
      // 设置字段默认值（如果初始值中没有）
      fields.forEach(field => {
        if (values[field.key] === undefined && field.defaultValue !== undefined) {
          values[field.key] = field.defaultValue;
        }
      });
      setFormValues(values);
      setFormErrors({});
    }
  }, [isOpen, fields, initialFormValues]);

  // 点击外部关闭模态框
  useOutsideClick(modalRef, onClose, backdropClose);

  // ESC键关闭
  useEffect(() => {
    if (!isOpen || !escClose) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose, escClose]);

  // 表单字段变化处理
  const handleFieldChange = useCallback((key: string, value: any) => {
    setFormValues(prev => ({ ...prev, [key]: value }));
    
    // 实时验证（如果有自定义验证函数）
    const field = fields.find(f => f.key === key);
    if (field?.validation) {
      const error = field.validation(value);
      setFormErrors(prev => ({ ...prev, [key]: error || '' }));
    }
  }, [fields]);

  // 表单提交处理
  const handleSubmit = async () => {
    if (!onConfirm) return;

    // 全表单验证
    const errors: Record<string, string> = {};
    let isValid = true;

    // 1. 验证必填字段
    fields.forEach(field => {
      if (field.required && (valueIsEmpty(formValues[field.key]))) {
        errors[field.key] = `${field.label}不能为空`;
        isValid = false;
      }
    });

    // 2. 验证自定义规则
    if (validateForm) {
      const customErrors = validateForm(formValues);
      Object.assign(errors, customErrors);
      isValid = Object.keys(customErrors).length === 0;
    }

    // 3. 显示错误
    setFormErrors(errors);
    if (!isValid) return;

    // 4. 提交数据
    setIsSubmitting(true);
    try {
      await onConfirm(formValues);
      onClose(); // 提交成功后关闭模态框
    } catch (error) {
      console.error('提交失败:', error);
      setFormErrors(prev => ({ ...prev, submit: '提交失败，请重试' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // 渲染单个表单字段
  const renderFormField = (field: FormField) => {
    const value = formValues[field.key] ?? '';
    const error = formErrors[field.key] ?? '';
    const hasError = !!error;

    if (field.render) {
      // 自定义渲染
      return field.render({
        value,
        onChange: (val: any) => handleFieldChange(field.key, val),
        error,
        disabled: isLoading || isSubmitting,
      });
    }

    // 默认渲染
    switch (field.type) {
      case 'text':
      case 'number':
      case 'datetime':
        return (
          <div className="form-group">
            <label className="form-label">
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              type={field.type}
              value={value}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              disabled={isLoading || isSubmitting}
              className={hasError ? 'form-input error' : 'form-input'}
            />
            {hasError && <span className="error-text">{error}</span>}
          </div>
        );

      case 'textarea':
        return (
          <div className="form-group">
            <label className="form-label">
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <textarea
              value={value}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              disabled={isLoading || isSubmitting}
              rows={field.rows || 4}
              className={hasError ? 'form-input error' : 'form-input'}
            />
            {hasError && <span className="error-text">{error}</span>}
          </div>
        );

      case 'select':
        return (
          <div className="form-group">
            <label className="form-label">
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <select
              value={value}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              disabled={isLoading || isSubmitting || !field.options?.length}
              className={hasError ? 'form-input error' : 'form-input'}
            >
              {!value && <option value="">{field.placeholder || `请选择${field.label}`}</option>}
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {hasError && <span className="error-text">{error}</span>}
          </div>
        );

      case 'checkbox':
        return (
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={!!value}
                onChange={(e) => handleFieldChange(field.key, e.target.checked)}
                disabled={isLoading || isSubmitting}
              />
              <span>{field.label}</span>
              {field.required && <span className="required">*</span>}
            </label>
            {hasError && <span className="error-text">{error}</span>}
          </div>
        );

      default:
        return null;
    }
  };

  // 渲染底部按钮
  const renderFooterButtons = () => {
    const defaultButtons: ModalButton[] = [];

    if (showConfirm) {
      defaultButtons.push({
        label: '确认',
        onClick: handleSubmit,
        type: 'primary',
        loading: isLoading || isSubmitting,
      });
    }

    if (showCancel) {
      defaultButtons.push({
        label: '取消',
        onClick: onClose,
        type: 'secondary',
      });
    }

    return defaultButtons;
  };

  // 空状态处理
  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${animation} ${isLoading || isSubmitting ? 'modal-lock' : ''}`}>
      <div 
        ref={modalRef}
        className={`modal-container ${size} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* 头部 */}
        {showHeader && (
          <div className="modal-header">
            <h3 id="modal-title" className="modal-title">{title}</h3>
            <button 
              className="modal-close" 
              onClick={onClose}
              aria-label="关闭"
              disabled={isLoading || isSubmitting}
            >
              ×
            </button>
          </div>
        )}

        {/* 内容区 */}
        <div className="modal-body">
          {fields.length > 0 ? (
            <div className="modal-form">
              {fields.map(field => renderFormField(field))}
              {formErrors.submit && (
                <div className="error-text submit-error">{formErrors.submit}</div>
              )}
            </div>
          ) : (
            <div className="modal-content">
              {children}
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        {showFooter && (
          <div className="modal-footer">
            {renderFooterButtons().map((btn, index) => (
              <button
                key={index}
                className={`btn ${btn.type || 'default'}`}
                onClick={btn.onClick}
                disabled={btn.disabled || isLoading || isSubmitting}
              >
                {btn.loading && <span className="loading-dot"></span>}
                {btn.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 辅助函数：判断值是否为空
const valueIsEmpty = (value: any) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  return false;
};