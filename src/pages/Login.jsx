import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../components/Input';
import Button from '../components/Button';
import { clearAuthError, loginMock } from '../store/authSlice';
import { showToast } from '../store/uiSlice';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authError = useSelector((state) => state.auth.error);
    const users = useSelector((state) => state.auth.users);
    const [email, setEmail] = React.useState('alex.martinez@university.edu');
    const [password, setPassword] = React.useState('password123!');

    const handleLogin = (e) => {
        e.preventDefault();
        const matchedUser = users.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password);
        dispatch(loginMock({
            email,
            password,
            username: matchedUser?.username,
            studyProgram: matchedUser?.studyProgram,
            yearOfStudy: matchedUser?.yearOfStudy
        }));
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

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                            Remember me for 30 days
                        </label>
                    </div>

                    <div className="text-sm">
                        <button
                            type="button"
                            onClick={() => dispatch(showToast({ title: 'Password reset sent (mock).', variant: 'info' }))}
                            className="font-medium text-brand-primary hover:text-brand-secondary"
                        >
                            Forgot password?
                        </button>
                    </div>
                </div>

                <div>
                    <Button type="submit">Sign in</Button>
                </div>

                {authError && <p className="text-sm font-medium text-red-500">{authError}</p>}

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 uppercase text-gray-500">Or continue with</span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => dispatch(showToast({ title: 'Google auth is mocked in this demo.', variant: 'info' }))}
                    className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                >
                    <span className="ml-2">Google</span>
                </button>

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
