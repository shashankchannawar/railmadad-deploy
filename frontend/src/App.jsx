import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import Complaint from './pages/Complaint'
import Admin from './pages/Admin'
import ContactUsPage from './pages/Contact'
import RailwayInfo from './pages/Info'
import ScrollToTop from './components/ScrollToTop'
import SuperAdminLogin from './pages/SuperAdmin'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from "react-hot-toast"
import ProtectedRoute from './components/ProtectedRoute'
import SuperAdminLayout from './components/SuperAdminLayout'
import Dashboard from './pages/Dashboard'
import CreateAdmin from './pages/Admin'
import ManageAdmins from './pages/ManageAdmins'
import Statistics from './pages/Statistics'
import ActivityLogs from './pages/ActivityLogs'
import CategoryAdminLogin from './pages/CategoryAdmin'
import CategoryAdminDashboard from './pages/CategoryAdminDashboard'

const App = () => {
  return (
    <AuthProvider>
      <Toaster position="bottom-center" reverseOrder={false} />
      <ScrollToTop />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/complaint" element={<Complaint />} />
        <Route path="/category-admin" element={<CategoryAdminLogin />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/info" element={<RailwayInfo />} />
        <Route path="/superadmin" element={<SuperAdminLogin />} />
        <Route
          path="/category-admin/dashboard" 
          element={
            <ProtectedRoute requiredRole="category_admin">
              <CategoryAdminDashboard />
            </ProtectedRoute>
          }>
        </Route>
        
        {/* Protected Super Admin Routes with Layout */}
        <Route 
          path="/super-admin/*" 
          element={
            <ProtectedRoute requiredRole="super_admin">
              <SuperAdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Nested Routes - These render inside SuperAdminLayout's <Outlet /> */}
          <Route index element={<SuperAdminLayout />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="admins" element={<ManageAdmins />} />
          <Route path="create-admin" element={<CreateAdmin />} />
          <Route path="statistics" element={<Statistics />} />
          {/* <Route path="activity-logs" element={<ActivityLogs/> } />
          <Route path="settings" element={<div className="text-2xl font-bold">Settings Page - Coming Soon</div>} /> */}
        </Route>

        {/* Unauthorized Page */}
        <Route 
          path="/unauthorized" 
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-red-600">403 - Unauthorized</h1>
                <p className="text-gray-600 mt-4">You don't have permission to access this page.</p>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Go Home
                </button>
              </div>
            </div>
          } 
        />

        {/* 404 Not Found */}
        <Route 
          path="*" 
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
                <p className="text-gray-600 mt-4">The page you're looking for doesn't exist.</p>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Go Home
                </button>
              </div>
            </div>
          } 
        />
      </Routes>


    </AuthProvider>
  )
}

export default App