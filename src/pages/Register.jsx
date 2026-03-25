import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import { clearAuthError, registerMock } from '../store/authSlice';
import { updateProfileGeneral } from '../store/profileSlice';
import { showToast } from '../store/uiSlice';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authError = useSelector((state) => state.auth.error);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const users = useSelector((state) => state.auth.users);
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [studyProgram, setStudyProgram] = React.useState('Computer Science');
    const [yearOfStudy, setYearOfStudy] = React.useState('1');
    const [password, setPassword] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const exists = users.some((item) => item.email.toLowerCase() === email.toLowerCase());
        dispatch(registerMock({ username, email, password, studyProgram, yearOfStudy }));

        if (exists) return;
        dispatch(updateProfileGeneral({
            username: username || 'student',
            email,
            studyProgram,
            yearOfStudy
        }));
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

                <div className="flex items-center">
                    <input id="terms" name="terms" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                        I agree to the <button type="button" onClick={() => dispatch(showToast({ title: 'Terms page is mocked.', variant: 'info' }))} className="text-brand-primary hover:text-brand-secondary">Terms of Service</button> and <button type="button" onClick={() => dispatch(showToast({ title: 'Privacy page is mocked.', variant: 'info' }))} className="text-brand-primary hover:text-brand-secondary">Privacy Policy</button>
                    </label>
                </div>

                <div>
                    <Button type="submit">Create account</Button>
                </div>
                {authError && <p className="text-sm font-medium text-red-500">{authError}</p>}

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 uppercase text-gray-500">Or sign up with</span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => dispatch(showToast({ title: 'Google signup is mocked in this demo.', variant: 'info' }))}
                    className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                >
                    <span className="ml-2">Google</span>
                </button>

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
