import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserLayout from './layouts/UserLayout';       
import AccountLayout from './layouts/AccountLayout'; 
import Login from './auth/Login';
import Register from './auth/Register';
import Blog from './blog/Blog';
import BMICalculator from './health/BMICalculator';
import CalorieCalculator from './calorie/CalorieCalculator';
import Profile from './profile/Profile';
import Address from './user/Address';
import ChangePassword from './user/ChangePassword';
import Dashboard from './calorie/Dashboard';
import CalorieTracker from './calorie/CalorieTracker';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<UserLayout />}>
                    <Route path="/" element={<Navigate to="/blog" />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/bmi" element={<BMICalculator />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/calorie" element={<CalorieCalculator />} />
                    <Route path="/calorie-tracker" element={<CalorieTracker />} />
                </Route>

                <Route path="/account" element={<AccountLayout />}>
                    <Route index element={<Navigate to="profile" />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="address" element={<Address />} />
                    <Route path="change-password" element={<ChangePassword />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;