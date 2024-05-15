import {Link} from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <ul>
                <li><Link to="/">Главная</Link></li>
                <li><Link to="/about">О нас</Link></li>
                {/* Добавьте ссылки на другие страницы */}
            </ul>
        </div>
    );
}

export default Sidebar;