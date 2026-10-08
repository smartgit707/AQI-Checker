import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import CityPage from './pages/CityPage.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import LoadingFallback from './components/common/LoadingFallback.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import './index.css';

// Route-level code-splitting for secondary views
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage.jsx'));
const ComparePage = lazy(() => import('./pages/ComparePage.jsx'));
const RankingsPage = lazy(() => import('./pages/RankingsPage.jsx'));
const MethodologyPage = lazy(() => import('./pages/MethodologyPage.jsx'));
const DataSourcesPage = lazy(() => import('./pages/DataSourcesPage.jsx'));
const CleanCommutePage = lazy(() => import('./pages/CleanCommutePage.jsx'));
const StubbleTrackerPage = lazy(() => import('./pages/StubbleTrackerPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const CitizenFamilyDashboardPage = lazy(() => import('./pages/CitizenFamilyDashboardPage.jsx'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));
const SettingsPage = lazy(() => import('./pages/SettingsPage.jsx'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage.jsx'));
const AlertsPage = lazy(() => import('./pages/AlertsPage.jsx'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage.jsx'));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
            <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public Environmental Exploration Routes */}
              <Route path="/" element={<App />} />
              <Route path="/city/:slug" element={<CityPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/rankings" element={<RankingsPage />} />
              <Route path="/methodology" element={<MethodologyPage />} />
              <Route path="/data-sources" element={<DataSourcesPage />} />
              <Route path="/clean-commute" element={<CleanCommutePage />} />
              <Route path="/stubble-tracker" element={<StubbleTrackerPage />} />

              {/* Authentication Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected User Platform Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/citizen-dashboard"
                element={
                  <ProtectedRoute>
                    <CitizenFamilyDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/family-dashboard"
                element={
                  <ProtectedRoute>
                    <CitizenFamilyDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <FavoritesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/alerts"
                element={
                  <ProtectedRoute>
                    <AlertsPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Platform Route */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
          </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
