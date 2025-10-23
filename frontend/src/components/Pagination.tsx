import './css/Pagination.css';

interface PaginationProps {
  page: number;
  size: number;
  total: number;
  sizeOptions: number[];
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  loading: boolean;
}

export default function Pagination({
  page,
  size,
  total,
  sizeOptions,
  onPageChange,
  onSizeChange,
  loading
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / size));
  
  return (
    <div className="pagination">
      <div className="pagination-info">
        显示 {page * size + 1}-{Math.min((page + 1) * size, total)} 条，共 {total} 条
      </div>
      
      <div className="pagination-controls">
        <button
          className="page-btn prev"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0 || loading}
        >
          上一页
        </button>
        
        <div className="page-numbers">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              className={`page-btn ${idx === page ? 'active' : ''}`}
              onClick={() => onPageChange(idx)}
              disabled={loading}
            >
              {idx + 1}
            </button>
          ))}
        </div>
        
        <button
          className="page-btn next"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1 || loading}
        >
          下一页
        </button>
        
        <div className="page-size-selector">
          <span>每页</span>
          <select
            value={size}
            onChange={(e) => onSizeChange(Number(e.target.value))}
            disabled={loading}
          >
            {sizeOptions.map(option => (
              <option key={option} value={option}>{option}条</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}