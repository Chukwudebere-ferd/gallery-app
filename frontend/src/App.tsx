import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UserProvider from './context/UserProvider'
import TopicsProvider from './context/TopicsProvider'
import AppShell from './components/layout/AppShell'
import RequireAuth from './components/auth/RequireAuth'
import RequireAdmin from './components/auth/RequireAdmin'
import RequireVerified from './components/auth/RequireVerified'
import AdminLandingRedirect from './components/auth/AdminLandingRedirect'
import HomePage from './pages/Home/HomePage'
import AuthPage from './pages/Auth/AuthPage'
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage'
import VerifyPage from './pages/Auth/VerifyPage'
import ResetPasswordPage from './pages/Auth/ResetPasswordPage'
import UploadPage from './pages/Upload/UploadPage'
import PostPage from './pages/Post/PostPage'
import SavedPage from './pages/Saved/SavedPage'
import ProfilePage from './pages/Profile/ProfilePage'
import SettingsPage from './pages/Settings/SettingsPage'
import AdminPage from './pages/Admin/AdminPage'
import NotFoundPage from './pages/NotFound/NotFoundPage'
import PrivacyPage from './pages/Privacy/PrivacyPage'

function App() {
  return (
    <UserProvider>
      <TopicsProvider>
        <BrowserRouter>
          <AdminLandingRedirect />
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route element={<RequireVerified />}>
              <Route element={<AppShell />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/post/:id" element={<PostPage />} />
                <Route element={<RequireAuth />}>
                  <Route path="/saved" element={<SavedPage />} />
                  <Route path="/upload" element={<UploadPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route element={<RequireAdmin />}>
                    <Route path="/admin" element={<AdminPage />} />
                  </Route>
                </Route>
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </TopicsProvider>
    </UserProvider>
  )
}

export default App