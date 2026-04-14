import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import { clearAuthError, registerUser } from '../store/authSlice';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authError = useSelector((state) => state.auth.error);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const authStatus = useSelector((state) => state.auth.status);
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [studyProgram, setStudyProgram] = React.useState('Computer Science');
    const [yearOfStudy, setYearOfStudy] = React.useState('1');
    const [password, setPassword] = React.useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(registerUser({
                username,
                nickname: username,
                email,
                password,
                studyProgram,
                yearOfStudy: Number(yearOfStudy)
            })).unwrap();
        } catch {
            // auth error is rendered from store state
        }
    };

    React.useEffect(() => () => dispatch(clearAuthError()), [dispatch]);
    React.useEffect(() => {
        if (isAuthenticated) navigate('/quests');
    }, [isAuthenticated, navigate]);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
                <p className="mt-2 text-sm text-gray-600">Task-first setup: username, study program, year of study.</p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <Input label="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="alexm" />
                    <Input label="University email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@university.edu" />

                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Study program"
                            value={studyProgram}
                            onChange={(e) => setStudyProgram(e.target.value)}
                            options={[
                                { value: 'Computer Science', label: 'Computer Science' },
                                { value: 'Engineering', label: 'Engineering' },
                                { value: 'Business', label: 'Business' },
                                { value: 'Arts & Design', label: 'Arts & Design' },
                                { value: 'Medicine', label: 'Medicine' }
                            ]}
                        />
                        <Select
                            label="Year of study"
                            value={yearOfStudy}
                            onChange={(e) => setYearOfStudy(e.target.value)}
                            options={[
                                { value: '1', label: 'Year 1' },
                                { value: '2', label: 'Year 2' },
                                { value: '3', label: 'Year 3' },
                                { value: '4', label: 'Year 4' },
                                { value: '5', label: 'Graduate' }
                            ]}
                        />
                    </div>

                    <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a strong password" isPassword />
                    <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters with one number and one special character</p>
                </div>

                <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
                    By creating an account, you confirm that the information you provide is accurate and can be used for matching tasks and services inside the platform.
                </div>

                {/* Temporarily hidden until terms acceptance is enforced in the auth flow.
                <div className="flex items-center">
                    <input id="terms" name="terms" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                        I agree to the platform rules and consent to storing my account information for service operation.
                    </label>
                </div>
                */}

                <div>
                    <Button type="submit">{authStatus === 'loading' ? 'Creating...' : 'Create account'}</Button>
                </div>
                {authError && <p className="text-sm font-medium text-red-500">{authError}</p>}

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account? <Link to="/login" className="font-medium text-brand-primary hover:text-brand-secondary">Sign in</Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Register;
