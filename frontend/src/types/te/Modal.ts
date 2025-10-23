import type { ReactNode } from 'react';

// 基础模态框按钮类型
export interface ModalButton {
	label: string;
	onClick?: () => Promise<void> | void;
	type?: 'primary' | 'secondary' | 'danger';
	disabled?: boolean;
	loading?: boolean;
	className?: string;
}

// 表单字段类型
export interface FormField {
	key: string;
	label: string;
	type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'datetime' | 'number';
	placeholder?: string;
	required?: boolean;
	options?: { label: string; value: string | number | boolean }[];
	defaultValue?: any;
	disabled?: boolean;
	validation?: (value: any) => string | null;
	width?: string;
	rows?: number;
	render?: (props: {
		value: any;
		onChange: (val: any) => void;
		error: string;
		disabled: boolean;
	}) => ReactNode;
	apiMethod?: string;
	/** 新增：选项的label字段（默认取`name`） */
	labelKey?: string;
	/** 新增：选项的value字段（默认取`id`） */
	valueKey?: string;

}

// 基础模态框属性接口（整合所有必要属性）
export interface ModalProps<T = any> {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children?: ReactNode;
	className?: string;
	buttons?: ModalButton[];
	confirmText?: string;
	cancelText?: string;
  	onConfirm?: (item: T | null) => Promise<void> | void;
	showConfirm?: boolean;
	showCancel?: boolean;
	isLoading?: boolean;
	backdropClose?: boolean;
	escClose?: boolean;
	size?: 'small' | 'medium' | 'large' | 'fullscreen';
	showHeader?: boolean;
	showFooter?: boolean;
	animation?: 'fade' | 'slide' | 'none';
	onOpen?: () => void;
	onClosed?: () => void;
	fields?: FormField[]; // 表单字段配置
	formValues?: Record<string, any>; // 初始值（替代initialValues）
	validateForm?: (values: Record<string, any>) => Record<string, string>;
	entityType?: string; // 新增：用于标识实体类型，替代单独的EntityModalConfig
}
