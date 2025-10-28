import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrash, faSearch} from '@fortawesome/free-solid-svg-icons';
import './css/List.css';

import type { FilterConfig, ListConfig } from '../types/uiTypes';
import type { ModalProps } from '../types/modalTypes';
import Modal from './Modal';

const getInitialFilterValues = (filters: FilterConfig<any>[]) => {
	const initialFilters: Record<string, any> = {};
	filters.forEach(filter => {
		if (filter.defaultValue !== undefined) {
		initialFilters[filter.key as string] = filter.defaultValue;
		}
	});
	return initialFilters;
};

export default function List<T>({
	title,
	itemIdKey,
	api,
	columns,
	filters = [],
	actions = [],
	createLink,
	emptyText = '暂无数据',
	modalConfig,
	type,
	onAction,
}: ListConfig<T> & { modalConfig: Partial<ModalProps>; onAction?: (actionKey: string, item: T) => void; }) {
	// 状态定义区
	const location = useLocation();
	const sizeOptions = [10, 20, 50, 100];
	const initialSize = 10;

	// 核心数据状态
	const [items, setItems] = useState<T[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	// 分页状态 - 修复核心
	const [page, setPage] = useState(0);
	const [size, setSize] = useState(initialSize);
	const [total, setTotal] = useState(0);

	// 筛选与排序状态
	const [searchText, setSearchText] = useState('');
	const [filterValues, setFilterValues] = useState<Record<string, any>>({});
	const [sortBy, setSortBy] = useState('createdTime-desc'); 
	const [dynamicFilterOptions, setDynamicFilterOptions] = useState<Record<string, { label: string; value: any }[]>>({});
	const [loadingFilters, setLoadingFilters] = useState(false);
	
	// 模态框状态
	const [modalOpen, setModalOpen] = useState(false);
	const [currentItem, setCurrentItem] = useState<T | null>(null);
	const [localModalConfig, setLocalModalConfig] = useState(modalConfig);
	const [cachedOptions, setCachedOptions] = useState<Record<string, { label: string; value: any }[]>>({});
	const [loadingDynamicOptions, setLoadingDynamicOptions] = useState(false);
	
	// 标签搜索状态
	const [tagSearchText, setTagSearchText] = useState('');
	const [showTagDropdown, setShowTagDropdown] = useState(false);
	const tagDropdownRef = useRef<HTMLDivElement>(null);

	// 点击外部关闭标签下拉框
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (tagDropdownRef.current && !tagDropdownRef.current.contains(event.target as Node)) {
				setShowTagDropdown(false);
			}
		};
		if (showTagDropdown) {
			document.addEventListener('mousedown', handleClickOutside);
			return () => document.removeEventListener('mousedown', handleClickOutside);
		}
	}, [showTagDropdown]);

	// 模态框相关逻辑
	const openModal = async (item: T | null = null) => {
		setCurrentItem(item);
		setLoadingDynamicOptions(true);

		try {
			if (!localModalConfig.fields || localModalConfig.fields.length === 0) {
				setModalOpen(true);
				return;
			}

			const updatedFields = await Promise.all(
				localModalConfig.fields.map(async (field) => {
					if (!field?.apiMethod) return field;
					if (cachedOptions[field.apiMethod]) {
						return { ...field, options: cachedOptions[field.apiMethod] };
					}

					const fetchMethod = api[field.apiMethod as keyof typeof api];
					if (typeof fetchMethod !== 'function') {
						console.error(`API方法${field.apiMethod}未定义`);
						return field;
					}

					const response = await fetchMethod();
					const data = Array.isArray(response) ? response : response?.data || [];
					
					if (!Array.isArray(data)) {
						console.error(`API方法${field.apiMethod}返回的数据不是数组:`, data);
						return field;
					}

					const options = data.map((item: any) => ({
						label: item[field.labelKey || 'name'],
						value: item[field.valueKey || 'id'],
					}));

					setCachedOptions(prev => ({ ...prev, [field.apiMethod]: options }));
					return { ...field, options };
				})
		);

		setLocalModalConfig(prev => ({
			...prev,
			fields: updatedFields,
		}));
		setModalOpen(true);
		} catch (error) {
		console.error('动态加载选项失败:', error);
		setModalOpen(true);
		} finally {
		setLoadingDynamicOptions(false);
		}
	};

	// 保存模态框数据
	const handleSave = async (formValues: Record<string, any>) => {
		const item = currentItem ;
		try{
			if (item) {
				const updatedItem = {
					...item,
					...formValues,
				};
				await api.updateItem(updatedItem);
			} else {
				const newItem = { ...formValues };
				delete newItem.id;
				await api.createItem(newItem);
			}
			loadData();
			setModalOpen(false);
		} catch (error) {
			console.error('保存失败:', error);
    		alert('提交失败，请检查数据后重试');
		}
	};

	// 数据加载与筛选逻辑 - 修复分页联动
	const loadData = useCallback(async () => {
		setLoading(true);
		try {
		const params: Record<string, any> = {
			page,
			size,
			sortBy: sortBy,
		};

		if (searchText.trim()) params.searchText = searchText.trim();

		Object.entries(filterValues).forEach(([key, value]) => {
			if (value != null && value !== 'all' && value !== '') params[key] = value;
		});

		const response = await api.fetchList(params);
		setItems(response.content || []);
		setTotal(response.totalElements || 0);
		// 只在接口返回有效页码时更新page，避免分页冲突
		if (typeof response.number === 'number') {
			setPage(response.number);
		}
		setError('');
		} catch (err: any) {
		setError(err.message || '加载失败，请重试');
		console.error('加载失败:', err);
		} finally {
		setLoading(false);
		}
	}, [api, page, size, searchText, filterValues, sortBy]);

	// 加载动态筛选选项
	const loadDynamicFilters = useCallback(async () => {
	setLoadingFilters(true);
	try {
		if (api.fetchAllCategories) {
		const categoryResponse = await api.fetchAllCategories();
		const categoryData = Array.isArray(categoryResponse) 
			? categoryResponse 
			: (categoryResponse?.data ?? []);
		
		if (Array.isArray(categoryData)) {
			const categoryOptions = categoryData.map((cat: any) => ({
			label: cat.name || '未命名分类',
			value: cat.id ?? cat.name,
			}));
			setDynamicFilterOptions(prev => ({ ...prev, categoryId: categoryOptions }));
		}
		}

		if (api.fetchAllArticles) {
		const articleResponse = await api.fetchAllArticles();
		const articleData = Array.isArray(articleResponse) 
			? articleResponse 
			: (articleResponse?.data ?? []);
		
		if (Array.isArray(articleData)) {
			const articleOptions = articleData.map((art: any) => ({
			label: art.title || '未命名文章',
			value: art.id ?? art.title,
			}));
			setDynamicFilterOptions(prev => ({ ...prev, articleId: articleOptions }));
		}
		}

		if (api.fetchAllTags) {
		const tagResponse = await api.fetchAllTags();
		const tagData = Array.isArray(tagResponse) 
			? tagResponse 
			: (tagResponse?.data ?? []);
		
		if (Array.isArray(tagData)) {
			const tagOptions = tagData.map((tag: any) => ({
			label: tag.name || '未命名标签',
			value: tag.id ?? tag.name,
			}));
			setDynamicFilterOptions(prev => ({ ...prev, tagId: tagOptions }));
		}
		}
	} catch (err) {
		console.error('加载动态筛选选项失败:', err);
	} finally {
		setLoadingFilters(false);
	}
	}, [api]); 

	useEffect(() => {
		loadDynamicFilters();
	}, [loadDynamicFilters]);

	// 筛选器变更处理
	const handleFilterChange = (key: string, value: any) => {
		setFilterValues(prev => ({ ...prev, [key]: value }));
		if (key === 'sortBy') {
			setSortBy(value);
		}
		// 不自动触发搜索，等用户点击"应用筛选"按钮
	};

	// 执行筛选搜索
	const handleSearch = () => {
		setPage(0); // 重置到第一页
		loadData();
	};

	// 按回车键搜索
	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSearch();
		}
	};

	const resetFilters = () => {
		setSearchText('');
		const initialFilters = getInitialFilterValues(filters);
		setFilterValues(initialFilters);
		setPage(0);
		// 重置后立即加载
		setTimeout(() => loadData(), 0);
	};

	// 统一的删除处理函数
	const handleDelete = async (item: T) => {
		const itemId = item[itemIdKey] as number;
		if (!window.confirm(`确定要删除该${title}吗？`)) return;

		setLoading(true);
		try {
		if (api.deleteItem) {
			await api.deleteItem(itemId);
			// 重新加载当前页数据，如果当前页已空则返回上一页
			const shouldGoToPrevPage = items.length === 1 && page > 0;
			if (shouldGoToPrevPage) {
				setPage(prev => prev - 1);
			}
			loadData();
		} else {
			setError('删除功能未启用');
			alert('删除功能未启用');
		}
		} catch (err: any) {
		setError(err.message || '删除失败');
		alert('删除失败，请稍后重试');
		} finally {
		setLoading(false);
		}
	};

	// 渲染辅助函数
	const renderFilter = (filter: FilterConfig<T>) => {
		const key = filter.key as string;
		const value = filterValues[key] ?? filter.defaultValue ?? '';

		if (filter.type === 'select') {
			// 优先使用动态加载的选项，否则使用静态选项
			const options = dynamicFilterOptions[key] || filter.options || [];
			
			// 特殊处理：标签筛选器添加搜索功能
			if (key === 'tagId' && options.length > 0) {
				return renderTagFilterWithSearch(key, value, options);
			}

			return (
				<div className="filter-item" key={key}>
					<label className="filter-label">{filter.label}</label>
					<select
						className="filter-select"
						value={String(value || '')}
						onChange={(e) => handleFilterChange(key, e.target.value)}
						disabled={loading || loadingFilters}
					>
						<option value="">全部</option>
						{options?.map((option: any) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>
			);
		}

		if (filter.type === 'text') {
		return (
			<div className="filter-item" key={key}>
			<label className="filter-label">{filter.label}</label>
			<input
				type="text"
				className="filter-input"
				placeholder={filter.placeholder || `请输入${filter.label}`}
				value={value || ''}
				onChange={(e) => handleFilterChange(key, e.target.value)}
				disabled={loading}
			/>
			</div>
		);
		}

		return null;
	};

	// 状态和可见性映射
	const statusMap: Record<string, string> = {
		'PUBLISHED': '已发布',
		'UNPUBLISHED': '草稿',
		'DRAFT': '草稿',
		'ARCHIVED': '已归档'
	};

	const visibilityMap: Record<string, string> = {
		'PUBLIC': '公开',
		'PRIVATE': '私有',
		'PROTECTED': '受保护'
	};

	const safeRender = (value: any, key?: string) => {
		if (value === null || value === undefined) return '-';
		
		// 处理状态字段
		if (key === 'status' && typeof value === 'string') {
			return statusMap[value] || value;
		}
		
		// 处理可见性字段
		if (key === 'visibility' && typeof value === 'string') {
			return visibilityMap[value] || value;
		}
		
		if (typeof value === 'object') {
			return value.name || value.title || '[对象]';
		}
		if (Array.isArray(value)) {
			return value.length > 0 ? value.join(', ') : '空数组';
		}
		return value;
	};

	// 渲染带搜索功能的标签筛选器
	const renderTagFilterWithSearch = (key: string, value: any, options: any[]) => {
		// 过滤标签选项
		const filteredOptions = options.filter((option: any) =>
			option.label.toLowerCase().includes(tagSearchText.toLowerCase())
		);

		// 获取当前选中的标签名称
		const selectedTag = options.find((opt: any) => String(opt.value) === String(value));
		const displayText = selectedTag ? selectedTag.label : '全部';

		return (
			<div className="filter-item filter-item-searchable" key={key} ref={tagDropdownRef}>
				<label className="filter-label">标签</label>
				<div className="searchable-select-wrapper">
					<div 
						className="searchable-select-trigger"
						onClick={() => setShowTagDropdown(!showTagDropdown)}
					>
						<span>{displayText}</span>
						<span className="dropdown-arrow">▼</span>
					</div>
					
					{showTagDropdown && (
						<div className="searchable-dropdown">
							{/* 搜索框 */}
							<div className="dropdown-search">
								<FontAwesomeIcon icon={faSearch} className="search-icon" />
								<input
									type="text"
									placeholder="搜索标签..."
									value={tagSearchText}
									onChange={(e) => setTagSearchText(e.target.value)}
									onClick={(e) => e.stopPropagation()}
								/>
							</div>
							
							{/* 选项列表 */}
							<div className="dropdown-options">
								<div 
									className={`dropdown-option ${!value || value === '' ? 'selected' : ''}`}
									onClick={() => {
										handleFilterChange(key, '');
										setShowTagDropdown(false);
										setTagSearchText('');
									}}
								>
									全部
								</div>
								{filteredOptions.length > 0 ? (
									filteredOptions.map((option: any) => (
										<div 
											key={option.value}
											className={`dropdown-option ${String(value) === String(option.value) ? 'selected' : ''}`}
											onClick={() => {
												handleFilterChange(key, option.value);
												setShowTagDropdown(false);
												setTagSearchText('');
											}}
										>
											{option.label}
										</div>
									))
								) : (
									<div className="dropdown-empty">无匹配标签</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		);
	};

	// 路由切换时重置状态
	useEffect(() => {
		setItems([]);
		setPage(0);
		setSize(initialSize);
		setTotal(0);
		setSearchText('');
		setFilterValues(getInitialFilterValues(filters));
		setSortBy('createdTime-desc');
		setModalOpen(false);
		setCurrentItem(null);
		setLocalModalConfig(modalConfig);
		setCachedOptions({});
		loadData();
	}, [location.pathname, modalConfig]);

	// 初始化筛选值
	useEffect(() => {
		const initialFilters = getInitialFilterValues(filters);
		if (JSON.stringify(initialFilters) !== JSON.stringify(filterValues)) {
			setFilterValues(initialFilters);
		}
	}, [filters]);

	// 分页变更时加载数据（修复分页核心逻辑）
	useEffect(() => {
		// 避免初始渲染时重复加载
		if (page === 0 && size === initialSize && items.length === 0) return;
		loadData();
	}, [page, size, loadData]);

	// 组件渲染
	return (
		<div className="list-page-container">
		<div className="content-header">
			<h1 className="page-title">{title}</h1>
			<div className="header-actions">
				{/* 导航按钮 - 文章相关页面显示 */}
				{type === 'article' && (
					<>
						<Link to="/admin/list/articles" className="action-btn secondary-btn">
							<span>文章</span>
						</Link>
						<Link to="/admin/list/categories" className="action-btn secondary-btn">
							<span>分类</span>
						</Link>
						<Link to="/admin/list/tags" className="action-btn secondary-btn">
							<span>标签</span>
						</Link>
					</>
				)}
				
				{/* 分类和标签页面也显示文章按钮 */}
				{type === 'other' && (title === '标签' || title === '分类') && (
					<>
						<Link to="/admin/list/articles" className="action-btn secondary-btn">
							<span>文章</span>
						</Link>
						<Link to="/admin/list/categories" className="action-btn secondary-btn">
							<span>分类</span>
						</Link>
						<Link to="/admin/list/tags" className="action-btn secondary-btn">
							<span>标签</span>
						</Link>
					</>
				)}

				{/* 新建按钮 */}
				{type === 'article' ? (
					<Link to="/admin/list/articles/edit" className="action-btn primary-btn">
					<FontAwesomeIcon icon={faPlus} />
					<span>新建{title}</span>
					</Link>
				) : (
					<button
						className="action-btn primary-btn"
						onClick={() => openModal(null)}
						disabled={loading}
						>
						<FontAwesomeIcon icon={faPlus} />
						<span>新建{title}</span>
						</button>
					)}
				</div>
			</div>

			<div className="list-content">
				{/* 1. 筛选区域 */}
				<div className="filter-panel">
				<div className="filter-row">
				{/* 搜索框区域 */}
				<div className="search-group">
				<input
					type="text"
					placeholder={`输入关键词，按回车搜索`}
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					onKeyPress={handleKeyPress}
					disabled={loading}
				/>
				</div>
					
					{/* 筛选条件区域 */}
					<div className="filter-controls">
					{filters.map(filter => renderFilter(filter))}
					
					{/* 筛选操作按钮 */}
					<div className="filter-actions">
						<button className="btn reset-btn" onClick={resetFilters} disabled={loading}>重置</button>
						<button className="btn apply-btn" onClick={handleSearch} disabled={loading}>应用筛选</button>
					</div>
					</div>
				</div>
				</div>

				{/* 2. 列表区域 - 动态高度 */}
				<div className="table-container">
					<div className="table-wrapper" data-loading={loading}>
						{items.length === 0 ? (
							<div className="empty-state">
							<div className="empty-icon">📄</div>
							<h3>{emptyText}</h3>
							{createLink && (
								<Link to={createLink} className="empty-action">
								<FontAwesomeIcon icon={faPlus} /> 立即创建
								</Link>
							)}
							</div>
						) : (
							<table className="data-table">
								<thead>
									<tr className="table-header">
										{columns.map(column => (
											<th key={column.key as string} className="header-cell">
												{column.title}
											</th>
										))}
										{actions.length > 0 || true ? (
											<th className="header-cell actions-header">操作</th>
										) : null}
									</tr>
								</thead>
								<tbody>
									{items.map((item) => (
										<tr 
											key={item[itemIdKey]} 
											className="table-row"
										>
											{columns.map(column => (
										<td key={column.key as string} className="table-cell">
										{/* 如果是标题列且是文章类型，添加编辑链接 */}
										{column.key === 'title' && type === 'article' ? (
											<Link 
												to={`/admin/list/articles/edit/${item[itemIdKey]}`}
												className="title-link"
											>
												{safeRender(item[column.key as keyof T], column.key as string)}
											</Link>
										) : column.render
											? column.render(item)
											: safeRender(item[column.key as keyof T], column.key as string)
										}
										</td>
										))}

										{actions.length > 0 || true ? (
										<td className="actions-cell">
										<div className="action-buttons">
											{actions.map(action => {
											const isDisabled = action.disabled?.(item) || loading;
											return action.isLink && action.linkGenerator ? (
												<Link 
												key={action.key}
												to={action.linkGenerator(item)}
												className={`action-btn ${action.className}`}
												disabled={isDisabled}
												>
												{action.icon || <FontAwesomeIcon icon={faEdit} />}
												<span>{action.label}</span>
												</Link>
											) : (
												<button
												key={action.key}
												onClick={() => {
													action.onClick?.(item);
													onAction?.(action.key, item);
												}}
												className={`action-btn ${action.className}`}
												disabled={isDisabled}
												>
												{action.icon || <FontAwesomeIcon icon={faEdit} />}
												<span>{action.label}</span>
												</button>
											);
											})}

											<button
											key="delete"
											onClick={() => handleDelete(item)}
											className="action-btn delete-btn"
											disabled={loading}
											title="删除"
											>
											<FontAwesomeIcon icon={faTrash} />
											<span>删除</span>
											</button>
										</div>
										</td>
										) : null}
										</tr>
										))}
										</tbody>
										</table>
										)}
										</div>
										</div>

										{/* 3. 分页区域 */}
										<div className="pagination">
										<div className="pagination-info">
											当前显示 {Math.min((page + 1) * size, total)} 条，共 {total} 条
										</div>

										<div className="pagination-controls">
											<button
											className="page-btn prev"
											onClick={() => setPage(p => p - 1)}
											disabled={page === 0 || loading}
											>
											上一页
											</button>

											<div className="page-numbers">
											{Array.from({ length: Math.max(1, Math.ceil(total / size)) }).map((_, idx) => (
												<button
												key={idx}
												className={`page-btn ${idx === page ? 'active' : ''}`}
												onClick={() => setPage(idx)}
												disabled={loading}
												>
												{idx + 1}
												</button>
											))}
											</div>

											<button
											className="page-btn next"
											onClick={() => setPage(p => p + 1)}
											disabled={page >= Math.ceil(total / size) - 1 || loading}
											>
											下一页
											</button>

											<div className="page-size-selector">
											<span>每页</span>
											<select
												value={size}
												onChange={(e) => { 
												setSize(Number(e.target.value)); 
												setPage(0); 
												}}
												disabled={loading}
											>
												{sizeOptions.map(option => (
												<option key={option} value={option}>{option}条</option>
												))}
											</select>
											</div>
										</div>
										</div>
										</div>

										{/* 模态框 */}
										<Modal
										{...localModalConfig}
										isOpen={modalOpen}
										onClose={() => setModalOpen(false)}
										formValues={currentItem as Record<string, any> || {}}
										onConfirm={handleSave}
										isLoading={loading || loadingDynamicOptions}
										/>
										</div>
										);
										}