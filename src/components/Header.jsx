import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutMock } from '../store/authSlice';

const NavLink = ({ to, children, pathname }) => {
    const isActive = pathname === to || (to !== '/' && pathname.startsWith(to));
    return (
        <Link
            to={to}
            className={`text-sm font-medium transition-colors duration-200 ${isActive ? 'text-brand-primary' : 'text-gray-500 hover:text-gray-900'}`}
        >
            {children}
        </Link>
    );
};

const Header = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const username = useSelector((state) => state.profile.general.username);
    const initials = username.slice(0, 2).toUpperCase() || 'US';

    return (
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link to="/quests" className="flex items-center space-x-2">
                        <div className="rounded-lg bg-brand-primary p-1.5 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-5 w-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0A50.57 50.57 0 00 1.6 9.334 59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                            </svg>
                        </div>
                        <span className="text-lg font-bold tracking-tight text-gray-900">QuestBoard</span>
                    </Link>

                    <nav className="hidden space-x-8 md:flex">
                        <NavLink to="/quests" pathname={pathname}>Quest Board</NavLink>
                        <NavLink to="/provider" pathname={pathname}>Provider Board</NavLink>
                        <NavLink to="/my-requests" pathname={pathname}>My Posts</NavLink>
                        <NavLink to="/active" pathname={pathname}>Active Tasks</NavLink>
                    </nav>

                    <div className="flex items-center space-x-4">
                        <Link to="/profile" className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-indigo-100 text-sm font-bold text-brand-primary shadow-sm">
                                {initials}
                            </div>
                            <span className="hidden text-sm font-medium text-gray-700 sm:inline">{username}</span>
                        </Link>

                        <button
                            onClick={() => {
                                dispatch(logoutMock());
                                navigate('/login');
                            }}
                            className="rounded-md bg-black p-1 text-white hover:bg-gray-800"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
