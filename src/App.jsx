import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './layouts/DashboardLayout';
import QuestBoard from './pages/QuestBoard';
import CreateQuest from './pages/CreateQuest';
import CreateService from './pages/CreateService';
import EditProfile from './pages/EditProfile';
import Profile from './pages/Profile';
import QuestDetails from './pages/QuestDetails';
import ProviderBoard from './pages/ProviderBoard';
import MyRequests from './pages/MyRequests';
import ActiveTasks from './pages/ActiveTasks';
import ManageRequest from './pages/ManageRequest';
import { fetchMyProfile } from './store/profileSlice';

const ProtectedRoute = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" replace />;
};

const PublicOnlyRoute = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? <Navigate to="/quests" replace /> : <AuthLayout />;
};

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  React.useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMyProfile());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/quests" element={<QuestBoard />} />
          <Route path="/quests/:id" element={<QuestDetails />} />
          <Route path="/requests/:id" element={<QuestDetails />} />
          <Route path="/create-quest" element={<CreateQuest />} />
          <Route path="/create-service" element={<CreateService />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          {/* Placeholders for other nav links if needed */}
          <Route path="/provider" element={<ProviderBoard />} />
          <Route path="/my-requests" element={<MyRequests />} />
          <Route path="/my-requests/:id/manage" element={<ManageRequest />} />
          <Route path="/active" element={<ActiveTasks />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
