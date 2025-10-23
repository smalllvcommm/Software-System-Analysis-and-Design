export type SortDirection = 'asc' | 'desc';
export type FilterType = 'text' | 'select'; 

export interface ColumnConfig<T> {
	key: keyof T | string;
	title: string;
	render?: (record: T) => React.ReactNode;
	sortable?: boolean;
	width?: string;
}

export interface FilterConfig<T> {
	key: keyof T | string;
	type: FilterType;
	label: string;
	placeholder?: string;
	options?: { value: string | number; label: string }[];
	defaultValue?: any;
}

export interface ActionButtonConfig<T> {
	key: string;
	label: string;
	icon?: React.ReactNode;
	onClick?: (record: T) => void;
	isLink?: boolean;
	linkGenerator?: (record: T) => string;
	className?: string;
	disabled?: (record: T) => boolean;
}

export interface ListConfig<T> {
	title: string;

	itemIdKey: keyof T;
	
	api: {

		createItem?: (item: T) => Promise<T>
		
		
		deleteItem?: (id: number) => Promise<void>;

		updateItem?: (item: T) => Promise<T>

		fetchList: (params: any) => Promise<{
		content: T[];
		totalElements: number;
		totalPages: number;
		number: number;
		size: number;
		}>;

		fetchAllSubjects?: () => Promise<any>;

		fetchAllArticles?: () => Promise<any>;

		fetchAllTags?: () => Promise<any>;
  	};
	
	columns: ColumnConfig<T>[];

	filters?: FilterConfig<T>[];
	
	actions?: ActionButtonConfig<T>[];
	
	createLink?: string;
	
	emptyText?: string;

	type?: 'article' | 'other';

	onAction?: (actionKey: string, item: T) => void;

}
