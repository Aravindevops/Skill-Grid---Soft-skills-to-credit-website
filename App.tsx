import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import RankTable from './pages/RankTable';
import RewardStore from './pages/RewardStore';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';

const About = () => <div className="p-8 text-center text-gray-600 dark:text-gray-400">About Page Placeholder</div>;
const Contact = () => <div className="p-8 text-center text-gray-600 dark:text-gray-400">Contact Page Placeholder</div>;

// Layout for protected routes
const PrivateLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center dark:bg-slate-950 dark:text-white">Loading...</div>;
  }

  return isAuthenticated ? (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </>
  ) : (
    <Navigate to="/login" replace />
  );
};

// Layout for public routes (Login/Signup)
const PublicLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return null;

  // If already logged in, redirect to home
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};
function App() {
  return (
    <AuthProvider>
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-gray-900 dark:text-slate-100 font-sans selection:bg-indigo-100 selection:text-indigo-700 dark:selection:bg-indigo-900 dark:selection:text-indigo-300 transition-colors duration-300">

          <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Route>

              {/* Private Routes */}
              <Route element={<PrivateLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/rank-table" element={<RankTable />} />
              <Route path="/rewards" element={<RewardStore />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
      </Router>
    </ThemeProvider>
  </AuthProvider>
  );
}

export default App;