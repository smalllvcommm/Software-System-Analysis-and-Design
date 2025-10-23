// src/pages/admin/ListPage.tsx
import { useParams } from 'react-router-dom';
import List from '../../components/List';
import { listConfigMap } from '../../configs/listConfigs';
import { ModalConfigMap } from '../../configs/modalConfigs';
import type { ListType } from '../../configs/listConfigs';


export default function ListPage() {
  // 获取路由参数并且规定他的格式是ListType,然后把路由的参数传递给type
  const { type } = useParams<{ type: ListType }>();

  // 获取当前类型的列表配置和模态框配置
  const listConfig = type ? listConfigMap[type] : null;
  const modalConfig = type ? ModalConfigMap[type] : null;

  // 将列表配置和模态框配置一起传递给 List 组件
  return <List {...listConfig} modalConfig={modalConfig} />;
}