import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../components/Input';
import Button from '../components/Button';
import { clearAuthError, loginUser } from '../store/authSlice';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authError = useSelector((state) => state.auth.error);
    const authStatus = useSelector((state) => state.auth.status);
    const [email, setEmail] = React.useState('alex.martinez@university.edu');
    const [password, setPassword] = React.useState('password123!');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await dispatch(loginUser({ email, password })).unwrap();
        } catch {
            // auth error is rendered from store state
        }
    };

    React.useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    React.useEffect(() => {
        if (isAuthenticated) navigate('/quests');
    }, [isAuthenticated, navigate]);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
                <p className="mt-2 text-sm text-gray-600">Sign in to continue working with quests and services.</p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                <div className="space-y-4">
                    <Input label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@university.edu" />
                    <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" isPassword />
                </div>

                {/* Temporarily hidden until remember-me persistence is implemented as a real auth option.
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                            Remember me for 30 days
                        </label>
                    </div>

                    <p className="text-sm text-gray-500">Use your registered email and password.</p>
                </div>
                */}
                <p className="text-sm text-gray-500">Use your registered email and password.</p>

                <div>
                    <Button type="submit">{authStatus === 'loading' ? 'Signing in...' : 'Sign in'}</Button>
                </div>

                {authError && <p className="text-sm font-medium text-red-500">{authError}</p>}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don&apos;t have an account? <Link to="/register" className="font-medium text-brand-primary hover:text-brand-secondary">Sign up</Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Login;
