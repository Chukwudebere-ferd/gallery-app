import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UserProvider from './context/UserProvider'
import TopicsProvider from './context/TopicsProvider'
import AppShell from './components/layout/AppShell'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import VerifyPage from './pages/VerifyPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import UploadPage from './pages/UploadPage'
import PostPage from './pages/PostPage'
import SavedPage from './pages/SavedPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import AdminPage from './pages/AdminPage'
import NotFoundPage from './pages/NotFoundPage'
import PrivacyPage from './pages/PrivacyPage'

function App() {
  return (
    <UserProvider>
      <TopicsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route element={<AppShell />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/saved" element={<SavedPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/post/:id" element={<PostPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TopicsProvider>
    </UserProvider>
  )
}

export default App