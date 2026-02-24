import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import RankTable from './pages/RankTable';
import RewardStore from './pages/RewardStore';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FacultyLogin from './pages/faculty/FacultyLogin';
import FacultySignup from './pages/faculty/FacultySignup';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { UserRole } from './types';

const About = () => <div className="p-8 text-center text-gray-600 dark:text-gray-400">About Page Placeholder</div>;
const Contact = () => <div className="p-8 text-center text-gray-600 dark:text-gray-400">Contact Page Placeholder</div>;

// Student private layout
const PrivateLayout = () => {
  const { isAuthenticated, isLoading, userRole } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center dark:bg-slate-950 dark:text-white">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  // Faculty accounts should go to /faculty
  if (userRole === UserRole.FACULTY) return <Navigate to="/faculty" replace />;
  return (
    <UserProvider>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </UserProvider>
  );
};

// Faculty private layout
const FacultyLayout = () => {
  const { isAuthenticated, isLoading, userRole } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center dark:bg-slate-950 dark:text-white">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/faculty/login" replace />;
  if (userRole === UserRole.STUDENT) return <Navigate to="/" replace />;
  return <Outlet />;
};

// Public layout (redirect if already logged in)
const PublicLayout = () => {
  const { isAuthenticated, isLoading, userRole } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center dark:bg-slate-950 dark:text-white">Loading...</div>;
  if (isAuthenticated) return <Navigate to={userRole === UserRole.FACULTY ? '/faculty' : '/'} replace />;
  return <Outlet />;
};

// Faculty public layout
const FacultyPublicLayout = () => {
  const { isAuthenticated, isLoading, userRole } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center dark:bg-slate-950 dark:text-white">Loading...</div>;
  if (isAuthenticated && userRole === UserRole.FACULTY) return <Navigate to="/faculty" replace />;
  return <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-gray-900 dark:text-slate-100 font-sans selection:bg-indigo-100 selection:text-indigo-700 dark:selection:bg-indigo-900 dark:selection:text-indigo-300 transition-colors duration-300">
            <Routes>
              {/* Student public */}
              <Route element={<PublicLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Route>

              {/* Faculty public */}
              <Route element={<FacultyPublicLayout />}>
                <Route path="/faculty/login" element={<FacultyLogin />} />
                <Route path="/faculty/signup" element={<FacultySignup />} />
              </Route>

              {/* Student private */}
              <Route element={<PrivateLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/rank-table" element={<RankTable />} />
                <Route path="/rewards" element={<RewardStore />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Route>

              {/* Faculty private */}
              <Route element={<FacultyLayout />}>
                <Route path="/faculty" element={<FacultyDashboard />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;