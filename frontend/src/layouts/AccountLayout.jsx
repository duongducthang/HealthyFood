import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import UserLayout from './UserLayout'; 
import avatarImg from '../assets/img/Avatar.svg';
import iconImg from '../assets/icon/icon1.svg';

const AccountLayout = () => {
    const location = useLocation();  
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = () => {
            const savedUser = localStorage.getItem('currentUser');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            } else {
                navigate('/login');
            }
        };

        loadUser();

        window.addEventListener('storage', loadUser);
        window.addEventListener('userUpdate', loadUser); 

        return () => {
            window.removeEventListener('storage', loadUser);
            window.removeEventListener('userUpdate', loadUser);
        };
    }, [navigate]);

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        navigate('/login');
    };

    const isActive = (path) => location.pathname.startsWith(path);
    const getLinkClass = (path) => 
        `block py-2.5 px-3.75 no-underline text-sm rounded-md mb-1.25 transition-all ${
            isActive(path) 
            ? 'bg-gray-border font-semibold text-sky-600' 
            : 'text-gray-600 font-normal hover:bg-gray-border'
        }`;

    return (
        <UserLayout>
            <div className="flex flex-col lg:flex-row max-w-1200 mx-auto my-5 w-full lg:w-full min-h-[calc(100vh-80px)] bg-white rounded-lg overflow-hidden shadow-sm">
                
                {/* Sidebar Container */}
                <aside className="w-full lg:w-[250px] py-7.5 px-5 border-b lg:border-b-0 lg:border-r border-gray-border bg-gray-50"> 
                    
                    {/* User Info Box */}
                    <div className="flex items-center gap-3.75 mb-7.5 pb-5 border-b border-gray-border">
                        <img 
                            src={user?.avatar || avatarImg} 
                            alt="Avatar" 
                            className="w-12.5 h-12.5 rounded-full object-cover" 
                        />
                        <div>
                            <div className="font-bold text-sm text-gray-900">
                                {user ? user.userName || user.fullName : 'Guest'}
                            </div>
                            <Link to="/account/profile" className="text-xs text-sky-600 no-underline hover:text-blue-600">
                                Sửa hồ sơ
                            </Link>
                        </div>
                    </div>

                    {/* Nav Container */}
                    <nav> 
                        <div className="text-sm font-bold text-black mb-1.25 flex items-center"> 
                            <img src={iconImg} alt="icon" className="w-4.5 mr-1.25" />
                            Tài khoản của tôi
                        </div>
                        <ul className="list-none p-0 m-0 ml-2.5">
                            <li>
                                <Link to="/account/profile" className={getLinkClass('/account/profile')}>
                                    Hồ sơ
                                </Link>
                            </li>
                            <li>
                                <Link to="/account/address" className={getLinkClass('/account/address')}>
                                    Địa chỉ
                                </Link>
                            </li>
                            <li>
                                <Link to="/account/change-password" className={getLinkClass('/account/change-password')}>
                                    Đổi mật khẩu
                                </Link>
                            </li>
                            <li>
                                <a 
                                    href="/login" 
                                    onClick={handleLogout} 
                                    className="block py-2.5 px-3.75 text-sm text-red-600 no-underline hover:bg-red-50 rounded-md"
                                > 
                                    Đăng xuất
                                </a>
                            </li>
                        </ul>
                    </nav>
                </aside>

                {/* Main Content Container */}
                <main className="flex-1 py-7.5 px-10"> 
                    <Outlet /> 
                </main>
            </div>
        </UserLayout>
    );
};

export default AccountLayout;