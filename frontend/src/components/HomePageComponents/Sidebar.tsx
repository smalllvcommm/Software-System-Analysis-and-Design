import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faFire
} from '@fortawesome/free-solid-svg-icons';
import ProfileWidget from './ProfileWidget';
import RecentArticles from './RecentArticles';
import PopularTags from './PopularTags';
import '../css/Sidebar.css';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <ProfileWidget />
      
      <RecentArticles 
        title={
          <>
            <FontAwesomeIcon icon={faClock} /> 最近更新
          </>
        } 
      />
      
      <PopularTags 
        title={
          <>
            <FontAwesomeIcon icon={faFire} /> 热门标签
          </>
        } 
      />

    </aside>
  );
}
